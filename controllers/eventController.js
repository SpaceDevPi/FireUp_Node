const asyncHandler = require("express-async-handler");
const Event = require("../model/eventModel");
const nodemailer = require("nodemailer");

// get events
const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find();
  res.status(200).json(events);
});
//create event
const SetEvent = asyncHandler(async (req, res) => {
  if (
    !req.body.Title ||
    !req.body.Organisator ||
    !req.body.Description ||
    !req.body.Categories ||
    !req.body.Capacite ||
    !req.body.Date_Debut ||
    !req.body.Date_Fin ||
    !req.body.Localisation ||
    !req.body.img
  ) {
    res.status(400);
    throw new Error("event can t be empty ");
  }

  const eventExists = await Event.findOne(req.body.Titre);

  if (!eventExists) {
    res.status(400);
    throw new Error("event already exists");
  }

  const event = await Event.create(req.body);

  if (event) {
    res.status(201).json({
      // idEvent: event.idEvent,
      Title: event.Title,
      Organisator: event.Organisator,
      Categories: event.Categories,
      Description: event.Description,
      Price: event.Price,
      Capacite: event.Capacite,
      Date_Debut: event.Date_Debut,
      Date_Fin: event.Date_Fin,
      Localisation: event.Localisation,
      img: event.img,
    });
  } else {
    res.status(400);
    throw new Error("Invalid event data");
  }
});

//update event
const UpdateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(400);
    throw new Error("event not found");
  }
  const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedEvent);
});

//delete event
const DeleteEvent = asyncHandler(async (req, res) => {
  console.log(req.params.id);
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(400);
    throw new Error("event not found");
  } else {
    await event.remove();
    var mail_refus = `Hello dear user, thank you for trusting us. <br><br>However, we inform you that your The Event for the event <a style="color:#FFA73B;">${event.Title} </a> has been declined.<br> <br>  .<br><br>.`;
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
      subject: "Event has been canceled ", // Subject line
      text: "We're sorry dear client", // plain text body
      html: mail, // html body
    });
    res.status(200).json({ id: req.params.id });
  }
});

const findEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  res.status(200).json(event);
});
const getEventsByCategories = asyncHandler(async (req, res) => {
  const events = await Event.find({
    Categories: req.params.categories,
  });

  console.log(events);
  res.status(200).json(events);
});

module.exports = {
  getEvents,
  SetEvent,
  UpdateEvent,
  DeleteEvent,
  findEventById,
  getEventsByCategories,
};
