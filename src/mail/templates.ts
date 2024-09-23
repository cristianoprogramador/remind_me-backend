// src/mail/templates.ts
export const reminderTemplate = (name: string, reminders: string) => `
  <p>Olá, ${name}!</p>
  <p>Aqui estão os seus lembretes:</p>
  <ul>
    ${reminders
      .split(", ")
      .map((reminder) => `<li>${reminder}</li>`)
      .join("")}
  </ul>
  <p>Tenha um ótimo dia!</p>
  <p>Equipe Remind-Me</p>
`;

export const recoverPasswordTemplate = (name: string, url: string) => `
  <p>Hello, ${name}!</p>
  <p>You requested a password reset. Click the link below to reset your password:</p>
  <a href="${url}">Reset Password</a>
  <p>If you did not request this reset, please ignore this email.</p>
  <p>Thank you!</p>
`;
