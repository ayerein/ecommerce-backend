import dotenv from 'dotenv'
import { transport } from '../config/mailing.js'

dotenv.config()

export const sendRecoveryMail = async (userEmail, token) => {
    const frontendBaseUrl = process.env.FRONTEND_URL || 'http://localhost:5173'

    const resetLink = `${frontendBaseUrl}/reset-password?token=${token}`
    
    const mailOptions = {
        from: process.env.MAILING_ACCOUNT,
        to: userEmail,
        subject: "Recuperación de contraseña",
        html: `
            <div style="font-family: sans-serif; border: 1px solid #ddd; padding: 20px;">
                <h2>¿Olvidaste tu contraseña?</h2>
                <p>No te preocupes, haz clic en el botón de abajo para restablecerla. Este enlace expira en 1 hora.</p>
                <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    Restablecer Contraseña
                </a>
                <p style="margin-top: 20px;">Si no solicitaste este cambio, puedes ignorar este correo.</p>
            </div>
        `
    }

    return await transport.sendMail(mailOptions)
}

