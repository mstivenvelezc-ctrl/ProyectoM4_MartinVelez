    // api/sendWhatsApp.ts
    import type { VercelRequest, VercelResponse } from "@vercel/node";
    import twilio from "twilio";

    const client = twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
    );

    const SANDBOX_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER!;

    export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido." });
    }

    const { to, message } = req.body;
    if (!to || !message) {
        return res.status(400).json({ error: "Faltan campos: to, message." });
    }

    const numero = to.startsWith("+") ? to : `+${to}`;

    console.log("FROM:", SANDBOX_NUMBER);
    console.log("TO:",   `whatsapp:${numero}`);

    try {
        await client.messages.create({
        from: SANDBOX_NUMBER,
        to:   `whatsapp:${numero}`,
        body: message,
        });
        res.status(200).json({ message: "WhatsApp enviado con éxito." });
    } catch (error) {
        console.log("TWILIO ERROR:", JSON.stringify(error));
        const errObj = error as { code?: number; message?: string };
        
        // Código 63016 = número no en sesión activa del Sandbox
        // Código 21608 = número no en lista de participantes
        if (errObj.code === 63016 || errObj.code === 21608) {
        return res.status(403).json({
            error:   "SANDBOX_NOT_REGISTERED",
            message: `El número ${numero} no está activado en el Sandbox.`,
        });
        }

        const msg = errObj.message ?? "Error desconocido.";
        res.status(500).json({ error: msg });
    }
    }