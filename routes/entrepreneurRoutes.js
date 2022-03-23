const express = require("express");
const router = express.Router();
const { registerEntrepreneur, loginEntrepreneur, getMe, updateEntrepreneur, deleteEntrepreneur, getAllEntrepreneurs, updateEntrepreneurPassword, updateEntrepreneurValidation} = require("../controllers/entrepreneurController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", registerEntrepreneur);
router.post("/login", loginEntrepreneur);
router.get("/me", protect, getMe);
router.get("/", getAllEntrepreneurs);
router.put("/:id", updateEntrepreneur);
router.delete("/:id", deleteEntrepreneur);
router.put("/security/:id", updateEntrepreneurPassword);
router.put("/validate/:id", updateEntrepreneurValidation);



module.exports = router;
