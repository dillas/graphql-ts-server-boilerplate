import * as nodemailer from "nodemailer";

export const sendNodeMailer = async (recipient: string, url: string) => {
  const transporterBeget = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: process.env.MAIL_LOGIN,
      pass: process.env.MAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: "noreply@yacob.ru", // sender address
    to: recipient, // list of receivers
    subject: "Hello ✔", // Subject line
    text: `Hello world? ${url}`, // plain text body
    html: `<b>Hello world?</b><br /><a href="${url}">confirm email</a>` // html body
  };

  transporterBeget.verify(error => {
    if (error) {
      console.log(error);
    } else {
      transporterBeget.sendMail(mailOptions);
    }
  });
};
