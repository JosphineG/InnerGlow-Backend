const nodeMailer = require("nodemailer");
const { convert } = require('html-to-text')

exports.sendMail = (payload)=> {
  return new Promise((resolve, reject) => {
    const transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.gmailUser,
        pass: process.env.gmailPass
      },
    });
    const text = convert(payload.html, { wordwrap: 130})
    const mailOptions = {
      from: process.env.gmailUser,
      to: payload.email,
      subject: payload.subject,
      text: payload.html,
      html: payload.html,
    };
    transporter.sendMail(mailOptions, (error, info) =>{
      if(error){
         reject(error)
      }
      resolve(info?.response)
    })
  });
}