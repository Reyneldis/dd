// src/lib/email/config.ts
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string | undefined;
    pass: string | undefined;
  };
  tls: {
    rejectUnauthorized: boolean;
  };
}

interface SenderConfig {
  from?: string;
}

export const emailConfig: EmailConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
};

export const senderConfig: SenderConfig = {
  from: process.env.GMAIL_USER
    ? `Delivery <${process.env.GMAIL_USER}>`
    : undefined,
};
