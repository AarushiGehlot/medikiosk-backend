const express = require('express');

const router = express.Router();

// POST /api/auth/abha/verify
router.post('/abha/verify', (req, res) => {
    const { abhaId, otp } = req.body;

    if (!abhaId || !otp) {
        return res.status(400).json({
            status: 'Error',
            message: 'ABHA ID and OTP are required'
        });
    }

    // Demo-only OTP. No real ABHA authentication happens here.
    if (otp !== '123456') {
        return res.status(401).json({
            status: 'Error',
            message: 'Invalid OTP. Use 123456 for this demo.'
        });
    }

    res.status(200).json({
        status: 'Success',
        message: 'Mock ABHA authentication successful',
        patient: {
            abhaId,
            name: 'Demo Patient',
            age: 30,
            gender: 'Female',
            contact: '9999999999'
        }
    });
});

module.exports = router;