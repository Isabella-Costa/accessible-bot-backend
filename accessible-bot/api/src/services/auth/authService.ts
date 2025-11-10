import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const requestPasswordReset = async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        console.log(`Solicitação de reset para e-mail não cadastrado: ${email}`);
        return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 3600000);

    await prisma.user.update({
        where: { email },
        data: {
            resetPasswordToken: resetToken,
            resetPasswordTokenExpiry: tokenExpiry,
        },
    });

    const resetUrl = `${process.env.CLIENTE_URL}/alterar-senha/${resetToken}`;
    
    const mailOptions = {
        from: `ChatBot Acessível <${process.env.EMAIL_FROM}>`,
        to: user.email,
        subject: 'Instruções para Redefinição de Senha',
        text: `Olá, ${user.name}!\n\nVocê solicitou a redefinição da sua senha. Por favor, clique no link a seguir ou cole no seu navegador para completar o processo:\n\n${resetUrl}\n\nSe você não solicitou isso, por favor, ignore este e-mail. Este link é válido por 1 hora.\n`,
    };

    await transporter.sendMail(mailOptions);
};

export const resetPassword = async (token: string, newPassword: string) => {
    const user = await prisma.user.findFirst({
        where: {
            resetPasswordToken: token,
            resetPasswordTokenExpiry: {
                gte: new Date(),
            },
        },
    });

    if (!user) {
        throw new Error('O token para redefinição de senha é inválido ou expirou.');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordTokenExpiry: null,
        },
    });
};
