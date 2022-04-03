const express = require("express");
const router = express.Router();
const {
  getBookings,
  DeleteBooking,
  SetBooking,

  findBookingById,
} = require("../controllers/bookingController");

router.get("/", getBookings);
router.get("/BookingId/:id", findBookingById);
router.post("/newBooking", SetBooking);
router.delete("/deleteBooking/:id", DeleteBooking);
module.exports = router;
