const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true,
    unique: true,
  },
  Organisator: {
    type: String,
    required: false,
  },
  Categories: {
    type: String,
    required: false,
  },
  Description: {
    type: String,
    required: false,
  },
  Price: {
    type: Number,
    required: false,
  },
  Nbentrepreneurs: {
    type: Number,
    required: false,
  },
  NbInvestisseurs: {
    type: Number,
    required: false,
  },
  Capacite: {
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

module.exports = mongoose.model("Event", eventSchema);
