import * as nodemailer from "nodemailer";
import * as SparkPost from "sparkpost";

const client = new SparkPost(process.env.SPARKPOST_API_KEY);

export const sendSpark = async (recipient: string, url: string) => {
  const response = await client.transmissions.send({
    options: {
      sandbox: true
    },
    content: {
      from: "ya.dillas@yandex.ru",
      subject: "Confirm Email",
      html: `<html>
        <body>
        <p>Testing SparkPost - the worls's most awesomest email service!</p>
        <a href="${url}"> confirm email</a>
        </body>
        </html>`
    },
    recipients: [{ address: recipient }]
  });
  console.log(response);
};

export const sendNodeMailer = async (recipient: string, url: string) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  const account = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: account.user, // generated ethereal user
      pass: account.pass // generated ethereal password
    }
  });

  // setup email data with unicode symbols
  const mailOptions = {
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: recipient, // list of receivers
    subject: "Hello ✔", // Subject line
    text: `Hello world? ${url}`, // plain text body
    html: `<b>Hello world?</b><br /><a href="${url}">confirm email</a>` // html body
  };

  // send mail with defined transport object
  const info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};
