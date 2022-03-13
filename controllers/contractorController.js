const asyncHandler = require('express-async-handler');  
const Contractor = require('../model/contractorModel');


// @desc   Get all contractors
// @route  GET /api/contractors
// @access Private
const getContractors = asyncHandler(async (req, res) => {
    const contractors = await Contractor.find();

    res.status(200).json(contractors);
})

// @desc   Create a contractor
// @route  POST /api/contractors
// @access Private
const setContractors = asyncHandler( async (req, res) => {
    // if(!req.body.text){
    //     res.status(400)
    //     throw new Error('text is required');
    // }
    const contractor = await Contractor.create(req.body);
    res.status(200).json(contractor);
})

// @desc   Update a contractor
// @route  PUT /api/contractors/:id
// @access Private
const updateContractors = asyncHandler(async (req, res) => {
    const contractor = await Contractor.findById(req.params.id);
    if (!contractor) {
        res.status(400)
        throw new Error('contractor not found');
    }
    const updatedContractor = await Contractor.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json(updatedContractor);
})

// @desc   Delete a contractor
// @route  DELETE /api/contractors/:id
// @access Private
const deleteContractors = asyncHandler(async (req, res) => {
    res.status(200).json({message: 'delete contractors'});
})

module.exports = {
    getContractors,
    setContractors,
    updateContractors,
    deleteContractors
}