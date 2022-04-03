const asyncHandler = require('express-async-handler')
const Company = require('../model/companyModel')
const Entrepreneur = require('../model/entrepreneurModel')

//@desc   Get all companies
//@route  GET /api/companies
//@access Public
const getCompanies = asyncHandler(async (req, res) => {
    const companies = await Company.find();
    res.status(200).json(companies);
})

//@desc   Create a company
//@route  POST /api/companies
//@access Private
const setCompanies = asyncHandler( async (req, res) => {
    const entrepreneur = await Entrepreneur.findById(req.body.entrepreneur)
    if (!entrepreneur) {
        res.status(400)
        throw new Error('entrepreneur not found')
    }
    const company = new Company(req.body)
    company.entrepreneur = entrepreneur._id
    await company.save()
    res.status(201).json(company)

})

//@desc   Update a company
//@route  PUT /api/companies/:id
//@access Private
const updateCompanies = asyncHandler(async (req, res) => {
    const company = await Company.findById(req.params.id);
    if (!company) {
        res.status(400)
        throw new Error('company not found')
    }

    const updatedCompany = await Company.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json(updatedCompany);
})

//@desc   Delete a company
//@route  DELETE /api/companies/:id
//@access Private
const deleteCompanies = asyncHandler(async (req, res) => {
    const company = await Company.findById(req.params.id);
    if (!company) {
        res.status(400)
        throw new Error('company not found')
    }
    await company.remove()
    res.status(200).json({message: 'company removed'})
})

//@desc find company by entrepreneur
//@route  GET /api/companies/entrepreneur/:id
//@access Public
const getCompanyByEntrepreneur = asyncHandler(async (req, res) => {
    const entrepreneur = await Entrepreneur.findById(req.params.id)
    if (!entrepreneur) {
        res.status(400)
        throw new Error('entrepreneur not found')
    }
    const company = await Company.find({entrepreneur: req.params.id})
    res.status(200).json(company)
})

//@desc find company by id
//@route  GET /api/companies/:id
//@access Public
const getCompanyById = asyncHandler(async (req, res) => {
    const company = await Company.findById(req.params.id)
    if (!company) {
        res.status(400)
        throw new Error('company not found')
    }
    res.status(200).json(company)
})




module.exports = {
    getCompanies,
    setCompanies,
    updateCompanies,
    deleteCompanies,
    getCompanyByEntrepreneur,
    getCompanyById
}

