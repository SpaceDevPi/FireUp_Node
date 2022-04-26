const express = require("express");
const router = express.Router();
const {
  getBookings,
  DeleteBooking,
  SetBooking,
  UpdateBooking,

  findBookingById,
} = require("../controllers/bookingController");

router.get("/", getBookings);
router.get("/BookingId/:id", findBookingById);
router.post("/newBooking", SetBooking);
router.put("/updateBooking/:id", UpdateBooking);

router.delete("/deleteBooking/:id", DeleteBooking);
module.exports = router;
