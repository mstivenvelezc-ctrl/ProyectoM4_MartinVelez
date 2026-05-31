    // api/send-email.ts — Vercel Serverless Function
    import type { VercelRequest, VercelResponse } from "@vercel/node";
    import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

    const sesClient = new SESClient({
    region: "us-east-1",
    credentials: {
        accessKeyId:     process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    });

    export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Solo POST
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido." });
    }

    const { to, subject, body } = req.body;

    if (!to || !subject || !body) {
        return res.status(400).json({ error: "Faltan campos: to, subject, body." });
    }

    const command = new SendEmailCommand({
        Destination: { ToAddresses: [to] },
        Message: {
        Body:    { Text: { Data: body } },
        Subject: { Data: subject },
        },
        Source: process.env.AWS_SES_FROM_EMAIL!, // identidad verificada en SES
    });

    console.log("KEY:", process.env.AWS_ACCESS_KEY_ID ? "OK" : "VACÍA");
    console.log("SECRET:", process.env.AWS_SECRET_ACCESS_KEY ? "OK" : "VACÍA");
    console.log("FROM:", process.env.AWS_SES_FROM_EMAIL ? "OK" : "VACÍA");

    try {
        await sesClient.send(command);
        res.status(200).json({ message: "Email enviado con éxito." });
    } catch (error) {
        const msg = error instanceof Error ? error.message : "Error desconocido.";
        res.status(500).json({ error: msg });
    }
    }