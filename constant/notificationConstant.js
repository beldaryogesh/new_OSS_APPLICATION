const nodemailer = require('nodemailer');

module.exports = {
    emailSender  : (userEmail,body) => {
        console.log('mail sender')
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: 'checkdemo02@gmail.com',
              pass: 'vqdoqmekygtousli'
            }
          });
          const mailOptions = {
            from: 'checkdemo02@gmail.com',
            to: userEmail,
            subject: body.notificationTitle,
            text: body.description
          };
          transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
              console.error('Error sending email:', error);
            } else {
              console.log('Email sent:', info.response);
            }
          });
    }
}