const express = require('express');
const router = express.Router();
const { getContractors, setContractors, updateContractors, deleteContractors } = require('../controllers/contractorController');

router.route('/').get(getContractors).post(setContractors);
router.route('/:id').put(updateContractors).delete(deleteContractors);


module.exports = router