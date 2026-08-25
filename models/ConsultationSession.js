const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true,
            trim: true
        },
        answer: {
            type: String,
            required: true,
            trim: true
        },
        answeredAt: {
            type: Date,
            default: Date.now
        }
    },
    { _id: false }
);

const consultationSessionSchema = new mongoose.Schema(
    {
        abhaId: {
            type: String,
            required: true,
            trim: true
        },
        patientDetails: {
            name: String,
            age: Number,
            gender: String,
            contact: String
        },
        answers: {
            type: [answerSchema],
            default: []
        },
        status: {
            type: String,
            enum: ['active', 'completed'],
            default: 'active'
        },
        doctorSummary: {
            type: String,
            default: ''
        },
        completedAt: Date,
        expiresAt: {
            type: Date,
            default: null,
            expires: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    'ConsultationSession',
    consultationSessionSchema
);