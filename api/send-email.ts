    // api/send-email.ts — Vercel Serverless Function
    import type { VercelRequest, VercelResponse } from "@vercel/node";
    import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
    import { getAuth } from "firebase-admin/auth";
    import { initializeApp, getApps, cert } from "firebase-admin/app";

    // Inicializar Firebase Admin una sola vez
    if (!getApps().length) {
    initializeApp({
        credential: cert({
        projectId:   process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
    });
    }

    const sesClient = new SESClient({
    region: "us-east-1",
    credentials: {
        accessKeyId:     process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    });

    // Rate limiting simple en memoria (por IP)
    const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
    const RATE_LIMIT    = 5;    // máximo 5 emails
    const WINDOW_MS     = 60_000; // por minuto

    function checkRateLimit(ip: string): boolean {
    const now    = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || now > record.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
        return true;
    }
    if (record.count >= RATE_LIMIT) return false;
    record.count++;
    return true;
    }

    export default async function handler(req: VercelRequest, res: VercelResponse) {
    // 1. Solo POST
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido." });
    }

    // 2. Verificar token de Firebase en el header Authorization
    const authHeader = req.headers.authorization ?? "";
    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No autorizado. Se requiere token." });
    }

    try {
        const idToken = authHeader.split("Bearer ")[1];
        await getAuth().verifyIdToken(idToken); // lanza error si el token es inválido
    } catch {
        return res.status(401).json({ error: "Token inválido o expirado." });
    }

    // 3. Rate limiting por IP
    const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0] ?? "unknown";
    if (!checkRateLimit(ip)) {
        return res.status(429).json({ error: "Demasiadas solicitudes. Intenta en un minuto." });
    }

    // 4. Validar campos
    const { to, subject, body } = req.body;
    if (!to || !subject || !body) {
        return res.status(400).json({ error: "Faltan campos: to, subject, body." });
    }

    // 5. Validar formato de email destino
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
        return res.status(400).json({ error: "El campo 'to' no es un email válido." });
    }

    // 6. Enviar email
    const command = new SendEmailCommand({
        Destination: { ToAddresses: [to] },
        Message: {
        Body:    { Text: { Data: body } },
        Subject: { Data: subject },
        },
        Source: process.env.AWS_SES_FROM_EMAIL!,
    });

    try {
        await sesClient.send(command);
        res.status(200).json({ message: "Email enviado con éxito." });
    } catch (error) {
        const msg = error instanceof Error ? error.message : "Error desconocido.";
        res.status(500).json({ error: msg });
    }
    }