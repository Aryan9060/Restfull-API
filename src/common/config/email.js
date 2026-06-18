import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.example.com",
    port: 587,
    secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendEmail = async (to, subject, text, html) => {
    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject,
        text,
        html
    })
}
const varificationEmail = async (email, subject, token, html) => {
    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject,
        text:token,
        html
    })
}


export { sendEmail, varificationEmail };