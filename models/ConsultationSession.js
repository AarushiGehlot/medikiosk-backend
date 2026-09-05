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
        // --- ADDED AYURVEDIC & EMERGENCY RED FLAG DATA ---
        redFlags: {
            hasEmergency: { type: Boolean, default: false },
            flaggedSymptoms: [String]
        },
        prakritiData: {
            bodyBuild: String,
            skin: String,
            appetite: String,
            sleep: String,
            tempPreference: String,
            activityLevel: String,
            stressResponse: String
        },
        aharaData: {
            mealsPerDay: String,
            dietType: String,
            frequentSpicyFried: Boolean,
            waterIntake: String,
            skipMeals: Boolean,
            lateNightEating: Boolean
        },
        // ------------------------------------------------
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
            default: null
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