const nodemailer = require('nodemailer');
const sha1 = require('sha1');
const tokens = [];

const transporter = nodemailer.createTransport({
    host: global.EMAIL_SMTP_ADDR,
    port: +global.EMAIL_SMTP_PORT,
    secure: global.EMAIL_SMTP_SECURE === '1', // true for 465, false for other ports
    auth: {
        user: global.EMAIL_SMTP_USER, // generated ethereal user
        pass: global.EMAIL_SMTP_PASS, // generated ethereal password
    }
});

module.exports = app => {

    app.post('/email/get-token', (req, res) => {
        const token = sha1(`SOMESECRET${new Date()}${Math.random()}!`);
        setTimeout(() => tokens.push(token), 5e3);
        setTimeout(() => {
            const index = tokens.indexOf(token);
            tokens.splice(index, 1);
        }, 15 * 6e4);
        res.json({token});
    });

    app.post('/email/send', async (req, res) => {
        try {
            await transporter.sendMail({
                from: `<${global.EMAIL_SMTP_USER}>`, // sender address
                to: global.CONTACT_EMAIL,
                subject: `Mensagem do website`, // Subject line
                text: `${req.body.subject}\n${req.body.text}`, // plain text body
                html: `
                    <h1>${req.body.subject}</h1>
                    <p>${req.body.text}</p>
                    <p>${req.body.name}. ${req.body.email}</p>
                `, // html body
            });
            res.json({ok: true});
        } catch (err) {
            console.error(err);
            res.status(err.status || 500).send(err);
        }        
    });
}