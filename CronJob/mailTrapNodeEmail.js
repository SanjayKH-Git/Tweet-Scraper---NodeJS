const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
    host: "live.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: "api",
      pass: "039c24530c3bc79cb8d6eac81aeea616"
    }
  });
  
  async function mailTrapNodeEmail(postURL) {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Email Signal 👻" <mailtrap@demomailtrap.com>', // sender address
      to: "sanjaykhegde98@gmail.com", // list of receivers
      subject: "Tweet Signal !!!", // Subject line
      text: "Tweet Post has Video: ", // plain text body
      html: `<b>Tweet Post has Video:</b> ${postURL}`, // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }

  // mailTrapNodeEmail().catch(console.error);

  module.exports = { mailTrapNodeEmail };
