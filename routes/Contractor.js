import express from "express";

const router = express.Router();

//all routes will be prefixed with /contractors
router.get('/', (req, res) => {
    res.send('Hello ');
});

export default router;