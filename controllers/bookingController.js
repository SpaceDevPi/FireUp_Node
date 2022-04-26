const asyncHandler = require("express-async-handler");
const Booking = require("../model/bookingModel");

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
