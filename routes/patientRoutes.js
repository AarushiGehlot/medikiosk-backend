const express = require('express');
const Patient = require('../models/Patient');

const router = express.Router();

// POST /api/patients - create a patient
router.post('/', async (req, res) => {
    try {
        const patient = new Patient(req.body);
        await patient.save();

        res.status(201).json({
            status: 'Success',
            message: 'Patient created successfully',
            patient
        });
    } catch (error) {
        res.status(400).json({
            status: 'Error',
            message: 'Could not create patient',
            error: error.message
        });
    }
});

// GET /api/patients - get all patients
router.get('/', async (req, res) => {
    try {
        const patients = await Patient.find().sort({ createdAt: -1 });

        res.status(200).json({
            status: 'Success',
            count: patients.length,
            patients
        });
    } catch (error) {
        res.status(500).json({
            status: 'Error',
            message: 'Could not fetch patients',
            error: error.message
        });
    }
});

// GET /api/patients/:abhaId - get one patient by ABHA ID
router.get('/:abhaId', async (req, res) => {
    try {
        const patient = await Patient.findOne({
            abhaId: req.params.abhaId
        });

        if (!patient) {
            return res.status(404).json({
                status: 'Error',
                message: 'Patient not found'
            });
        }

        res.status(200).json({
            status: 'Success',
            patient
        });
    } catch (error) {
        res.status(500).json({
            status: 'Error',
            message: 'Could not fetch patient',
            error: error.message
        });
    }
});

// PUT /api/patients/:abhaId - update a patient
router.put('/:abhaId', async (req, res) => {
    try {
        const patient = await Patient.findOneAndUpdate(
            { abhaId: req.params.abhaId },
            req.body,
            { new: true, runValidators: true }
        );

        if (!patient) {
            return res.status(404).json({
                status: 'Error',
                message: 'Patient not found'
            });
        }

        res.status(200).json({
            status: 'Success',
            message: 'Patient updated successfully',
            patient
        });
    } catch (error) {
        res.status(400).json({
            status: 'Error',
            message: 'Could not update patient',
            error: error.message
        });
    }
});
// DELETE /api/patients/:abhaId - delete a patient
router.delete('/:abhaId', async (req, res) => {
    try {
        const patient = await Patient.findOneAndDelete({
            abhaId: req.params.abhaId
        });

        if (!patient) {
            return res.status(404).json({
                status: 'Error',
                message: 'Patient not found'
            });
        }

        res.status(200).json({
            status: 'Success',
            message: 'Patient deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'Error',
            message: 'Could not delete patient',
            error: error.message
        });
    }
});
module.exports = router;