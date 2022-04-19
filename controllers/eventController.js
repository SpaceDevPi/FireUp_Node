const asyncHandler = require("express-async-handler");
const Event = require("../model/eventModel");

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
  console.log(req.params.id)
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(400);
    throw new Error("event not found");
  }
else{await event.remove();
  res.status(200).json({ id : req.params.id });}
     
});

const findEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  res.status(200).json(event);
});

module.exports = {
  getEvents,
  SetEvent,
  UpdateEvent,
  DeleteEvent,
  findEventById,
};
