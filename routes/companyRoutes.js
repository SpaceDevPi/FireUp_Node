const express = require("express");
const router = express.Router();
const { getCompanies, setCompanies, updateCompanies, deleteCompanies, getCompanyByEntrepreneur, getCompanyById } = require("../controllers/companyController");


router.route('/').get(getCompanies).post(setCompanies);
router.route('/:id').put(updateCompanies).delete(deleteCompanies);
router.route('/entrepreneur/:id').get(getCompanyByEntrepreneur);
router.route('/:id').get(getCompanyById);
module.exports = router;