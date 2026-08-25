const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
    {
        abhaId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        age: {
            type: Number,
            required: true,
            min: 0
        },

        gender: {
            type: String,
            required: true,
            enum: ['Male', 'Female', 'Other']
        },

        contact: {
            type: String,
            trim: true
        },

        symptoms: {
            type: [String],
            default: []
        },

        medicalHistory: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true
    }
);

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;