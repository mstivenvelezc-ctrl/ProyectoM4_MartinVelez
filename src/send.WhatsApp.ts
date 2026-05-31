    // api/send-whatsapp.ts — Vercel Serverless Function
    import type { VercelRequest, VercelResponse } from "@vercel/node";
    import twilio from "twilio";

    const client = twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
    );

    export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido." });
    }

    const { to, message } = req.body;

    if (!to || !message) {
        return res.status(400).json({ error: "Faltan campos: to, message." });
    }

    try {
        await client.messages.create({
        from: process.env.TWILIO_WHATSAPP_NUMBER!,
        to:   `whatsapp:${to}`,
        body: message,
        });
        res.status(200).json({ message: "WhatsApp enviado con éxito." });
    } catch (error) {
        const msg = error instanceof Error ? error.message : "Error desconocido.";
        res.status(500).json({ error: msg });
    }
    }