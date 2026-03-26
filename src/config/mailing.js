import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()
console.log("User:", process.env.MAILING_ACCOUNT)
export const transport = nodemailer.createTransport({
    host: process.env.MAILING_HOST || 'smtp.gmail.com',
    port: process.env.MAILING_PORT,
    secure: false,
    auth: {
        user: process.env.MAILING_ACCOUNT,
        pass: process.env.MAILING_PASS
    },
    tls: {
        rejectUnauthorized: false
    },
    family: 4
})