const express = require("express");
const router = express.Router();
const {
  getEvents,
  DeleteEvent,
  SetEvent,
  UpdateEvent,
  findEventById,
} = require("../controllers/eventController");

router.get("/", getEvents);
router.get("/EventId/:id", findEventById);
router.post("/newEvent", SetEvent);
router.put("/updateEvent/:id", UpdateEvent);
router.delete("/deleteEvent/:id", DeleteEvent);
module.exports = router;
