const express = require("express");
const router = express.Router();
const { registerEntrepreneur, loginEntrepreneur, getMe } = require("../controllers/entrepreneurController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", registerEntrepreneur);
router.post("/login", loginEntrepreneur);
router.get("/me", protect, getMe);

module.exports = router;
