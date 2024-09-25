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
  <p>Olá, ${name}!</p>
  <p>Você solicitou uma redefinição de senha. Clique no link abaixo para redefinir sua senha:</p>
  <a href="${url}">Redefinir Senha</a>
  <p>Se você não solicitou essa redefinição, por favor, ignore este e-mail.</p>
  <p>Obrigado!</p>
`;
