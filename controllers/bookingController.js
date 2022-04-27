const asyncHandler = require("express-async-handler");
const Booking = require("../model/bookingModel");
const nodemailer = require("nodemailer");

// get bookings
const getBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find();
  res.status(200).json(bookings);
});
//create booking
const SetBooking = asyncHandler(async (req, res) => {
  if (
    !req.body.Name_Event ||
    !req.body.idTicket ||
    !req.body.Participant_Name ||
    !req.body.Price ||
    !req.body.Date_Debut ||
    !req.body.Date_Fin ||
    !req.body.Localisation ||
    !req.body.img
  ) {
    res.status(400);
    throw new Error("booking can t be empty ");
  }

  // const bookingExists = await Booking.find({
  //   idTicket: req.body.idTicket,
  // });
  const bookingExists = await Booking.findOne(req.body.idTicket.value);
  if (!bookingExists) {
    res.status(400);
    throw new Error("booking already exists");
  }

  const booking = await Booking.create(req.body);

  if (booking) {
    res.status(201).json({
      Name_Event: booking.Name_Event,
      idTicket: booking.idTicket,
      Participant_Name: booking.Participant_Name,
      Price: booking.Price,
      Date_Debut: booking.Date_Debut,
      Date_Fin: booking.Date_Fin,
      Localisation: booking.Localisation,
      img: booking.img,
      seat: booking.seat,
    });
  } else {
    res.status(400);
    throw new Error("Invalid booking data");
  }
});

//update booking
const UpdateBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(400);
    throw new Error("booking not found");
  }
  const updatedBooking = await Booking.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  res.status(200).json(updatedBooking);
});

//delete booking
const DeleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(400);
    throw new Error("booking not found");
  }

  await booking.remove();
  var mail_refus = `Hello dear user, thank you for trusting us. <br><br>However, we inform you that your Booking for the event <a style="color:#FFA73B;">${booking.Name_Event} </a> has been declined.<br> <br>  .<br><br>.`;
  var resultat = mail_refus;
  //mail
  const mail = `
<div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We're thrilled to have you here! Get ready to dive into your new account. </div>
<table border="0" cellpadding="0" cellspacing="0" width="100%">
    <!-- LOGO -->
    <tr>
        <td bgcolor="#FFA73B" align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                    <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td bgcolor="#FFA73B" align="center" style="padding: 0px 10px 0px 10px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                    <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                        <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Welcome to <span style=" color :#FFA73B;">Fire up! </span></h1> <img src=" https://img.icons8.com/clouds/100/000000/handshake.png" width="125" height="120" style="display: block; border: 0px;" />
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                    <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                        <p style="margin: 0;">  ${resultat}  </p>
                    </td>
                </tr>
               
                <tr>
                  
                </tr> <!-- COPY -->
              
                <tr>
                    <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                        <p style="margin: 0;">If you have any questions, just reply to this email—we're always happy to help out.</p>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                        <p style="margin: 0;">Cheers,<br>SpaceDev Team</p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td bgcolor="#f4f4f4" align="center" style="padding: 30px 10px 0px 10px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                    <td bgcolor="#FFECD1" align="center" style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                        <h2 style="font-size: 20px; font-weight: 400; color: #111111; margin: 0;">Need more help?</h2>
                        <p style="margin: 0;"><a href="#" target="_blank" style="color: #FFA73B;">We&rsquo;re here to help you out</a></p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                    <td bgcolor="#f4f4f4" align="left" style="padding: 0px 30px 30px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;"> <br>
                        <p style="margin: 0;">If these emails get annoying, please feel free to <a href="#" target="_blank" style="color: #111111; font-weight: 700;">unsubscribe</a>.</p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
 
  `;

  // send email
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER, // generated ethereal user
      pass: process.env.PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // send mail with defined transport object
  let info = transporter.sendMail({
    from: '"FireUp" <startup.plateform@gmail.com>', // sender address
    to: "karouiahmed294@gmail.com", // list of receivers
    subject: "Booking Declined ", // Subject line
    text: "We're sorry dear client", // plain text body
    html: mail, // html body
  });
  res.status(200).json({ id: req.params.id });
});

const findBookingById = asyncHandler(async (req, res) => {
  const idTicket = req.params.id;
  const booking = await Booking.findOne({ idTicket });
  res.status(200).json(booking);
});

module.exports = {
  getBookings,
  SetBooking,
  UpdateBooking,
  DeleteBooking,
  findBookingById,
};
