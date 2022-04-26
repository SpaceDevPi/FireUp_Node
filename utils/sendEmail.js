const nodemailer = require("nodemailer");
const Mail = require("nodemailer/lib/mailer");

module.exports = async (email, subject, text,test) => {
    // let transporter = nodemailer.createTransport({
    //     host: "smtp.gmail.com",
    //     port: 587,
    //     secure: false, // true for 465, false for other ports
    //     auth: {
    //       user:"startup.plateform@gmail.com",
    //       pass: "RgPaq8AUpVgg8PZ"
    //     },
    //   });
    
    //   // send mail with defined transport object
    //   let info = await transporter.sendMail({
    //     from: "startup.plateform@gmail.com", // sender address
    //     to: "fourat.anane@esprit.tn", // list of receivers
    //     subject: "Hello ✔", // Subject line
    //     text: "Hello world?", // plain text body
    //     html: "<b>Hello world?</b>", // html body
    //   });
	try {
		const transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			service: process.env.SERVICE,
			port: Number(process.env.EMAIL_PORT),
			secure: Boolean(process.env.SECURE),
			auth: {
				user: process.env.USER,
				pass: process.env.PASS,
			},
		});

		await transporter.sendMail({
			from: process.env.USER,
			to: email,
			subject: subject,
			text: text,
			html:test,
		});
		console.log("email sent successfully");
	} catch (error) {
		console.log("email not sent!");
		console.log(error);
		return error;
	}
};