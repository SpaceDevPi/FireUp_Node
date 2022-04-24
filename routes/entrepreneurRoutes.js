const express = require("express");
const router = express.Router();
const { 
    registerEntrepreneur, 
    loginEntrepreneur, 
    getMe, 
    updateEntrepreneur, 
    deleteEntrepreneur, 
    getAllEntrepreneurs, 
    updateEntrepreneurPassword, 
    updateEntrepreneurValidation,
    verifyEmail,
    getEntrepreneurById,
    changeStatus
} = require("../controllers/entrepreneurController");
const { protect } = require("../middleware/authMiddleware");
// const auth = require("./auth");

router.post("/", registerEntrepreneur);
router.post("/login", loginEntrepreneur);
router.get("/me", protect, getMe);
router.get("/", getAllEntrepreneurs);
router.put("/:id", updateEntrepreneur);
router.delete("/:id", deleteEntrepreneur);
router.put("/security/:id", updateEntrepreneurPassword);
router.put("/validate/:id", updateEntrepreneurValidation);
router.get("/verify/:id/:token", verifyEmail);
router.get("/:id", getEntrepreneurById);
router.put("/logout/:id", changeStatus);
// router.use("/auth",auth);

module.exports = router;
