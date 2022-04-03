const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  Name_Event: {
    type: String,
    required: true,
  },
  idTicket: {
    type: Number,

    required: true,
    unique: true,
  },
  Participant_Name: {
    type: String,
    required: true,
  },

  Price: {
    type: Number,
    required: false,
  },

  Date_Debut: {
    type: Date,
    required: false,
  },
  Date_Fin: {
    type: Date,
    required: false,
  },
  Localisation: {
    type: String,
    required: false,
  },
  img: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
