import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

export const transport = nodemailer.createTransport({
    host: process.env.MAILING_SERVICE,
    port: process.env.MAILING_PORT,
    secure: true,
    auth: {
        user: process.env.MAILING_ACCOUNT,
        pass: process.env.MAILING_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
})