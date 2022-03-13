const asyncHandler = require('express-async-handler');  
// @desc   Get all contractors
// @route  GET /api/contractors
// @access Private
const getContractors = asyncHandler(async (req, res) => {
    res.status(200).json({message: 'contractors'});
})

// @desc   Create a contractor
// @route  POST /api/contractors
// @access Private
const setContractors = asyncHandler( async (req, res) => {
    if(!req.body.text){
        res.status(400)
        throw new Error('text is required');
    }

    res.status(200).json({message: 'post contractors'});
})

// @desc   Update a contractor
// @route  PUT /api/contractors/:id
// @access Private
const updateContractors = asyncHandler(async (req, res) => {
    res.status(200).json({message: 'put contractors'});
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