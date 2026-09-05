const express = require('express');
const axios = require('axios');
const ConsultationSession = require('../models/ConsultationSession');

const router = express.Router();

function createDemoSummary(session) {
    const answers = session.answers
        .map((item) => `${item.question}: ${item.answer}`)
        .join('; ');

    return `Demo doctor summary for ${session.patientDetails?.name || 'the patient'}. ` +
        `ABHA ID: ${session.abhaId}. ` +
        `Consultation answers: ${answers || 'No answers recorded.'}. ` +
        `This is a demo summary and not medical advice.`;
}

async function createDoctorSummary(session) {
    // Later, add Coder 2's AI URL as AI_PIPELINE_URL in .env.
    if (!process.env.AI_PIPELINE_URL) {
        return createDemoSummary(session);
    }

    const response = await axios.post(process.env.AI_PIPELINE_URL, {
        abhaId: session.abhaId,
        patient: session.patientDetails,
        answers: session.answers,
        prakritiData: session.prakritiData,
        aharaData: session.aharaData,
        redFlags: session.redFlags
    });

    return response.data.summary || response.data.doctorSummary;
}

// POST /api/sessions - start a consultation
router.post('/', async (req, res) => {
    try {
        const { abhaId, patientDetails } = req.body;

        if (!abhaId) {
            return res.status(400).json({
                status: 'Error',
                message: 'ABHA ID is required'
            });
        }

        const session = await ConsultationSession.create({
            abhaId,
            patientDetails
        });

        res.status(201).json({
            status: 'Success',
            message: 'Consultation session started',
            session
        });
    } catch (error) {
        res.status(400).json({
            status: 'Error',
            message: 'Could not start consultation session',
            error: error.message
        });
    }
});

// POST /api/sessions/:sessionId/answers - save one patient answer
router.post('/:sessionId/answers', async (req, res) => {
    try {
        const { question, answer } = req.body;

        if (!question || !answer) {
            return res.status(400).json({
                status: 'Error',
                message: 'Question and answer are required'
            });
        }

        const session = await ConsultationSession.findById(req.params.sessionId);

        if (!session) {
            return res.status(404).json({
                status: 'Error',
                message: 'Consultation session not found'
            });
        }

        if (session.status === 'completed') {
            return res.status(400).json({
                status: 'Error',
                message: 'This consultation has already finished'
            });
        }

        session.answers.push({ question, answer });
        await session.save();

        res.status(200).json({
            status: 'Success',
            message: 'Answer saved successfully',
            session
        });
    } catch (error) {
        res.status(400).json({
            status: 'Error',
            message: 'Could not save answer',
            error: error.message
        });
    }
});

// POST /api/sessions/:sessionId/complete - save Ayurvedic & Red Flags, create summary, finish session
router.post('/:sessionId/complete', async (req, res) => {
    try {
        const { redFlags, prakritiData, aharaData } = req.body;
        const session = await ConsultationSession.findById(req.params.sessionId);

        if (!session) {
            return res.status(404).json({
                status: 'Error',
                message: 'Consultation session not found'
            });
        }

        if (session.status === 'completed') {
            return res.status(200).json({
                status: 'Success',
                message: 'Consultation was already completed',
                doctorSummary: session.doctorSummary
            });
        }

        // Attach Ayurvedic and Red Flag data if provided from frontend
        if (redFlags) session.redFlags = redFlags;
        if (prakritiData) session.prakritiData = prakritiData;
        if (aharaData) session.aharaData = aharaData;

        session.doctorSummary = await createDoctorSummary(session);
        session.status = 'completed';
        session.completedAt = new Date();

        await session.save();

        res.status(200).json({
            status: 'Success',
            message: 'Consultation completed. Data will auto-delete after 5 minutes.',
            doctorSummary: session.doctorSummary,
            deleteAfter: session.expiresAt
        });
    } catch (error) {
        res.status(500).json({
            status: 'Error',
            message: 'Could not complete consultation',
            error: error.message
        });
    }
});
// GET /api/sessions/abha/:abhaId/previous
router.get('/abha/:abhaId/previous', async (req, res) => {
    try {
        const session = await ConsultationSession.findOne({
            abhaId: req.params.abhaId,
            status: 'completed',
            doctorSummary: { $ne: '' }
        }).sort({ completedAt: -1 });

        if (!session) {
            return res.status(200).json({
                status: 'Success',
                recordExists: false
            });
        }

        res.status(200).json({
            status: 'Success',
            recordExists: true,
            record: {
                abhaId: session.abhaId,
                patientDetails: session.patientDetails,
                answers: session.answers,
                doctorSummary: session.doctorSummary,
                completedAt: session.completedAt
            }
        });

    } catch (error) {
        res.status(500).json({
            status: 'Error',
            message: 'Could not fetch previous record',
            error: error.message
        });
    }
});
// GET /api/sessions/:sessionId/summary - fetch doctor summary
router.get('/:sessionId/summary', async (req, res) => {
    try {
        const session = await ConsultationSession.findById(req.params.sessionId);

        if (!session) {
            return res.status(404).json({
                status: 'Error',
                message: 'Consultation session not found or has been deleted'
            });
        }

        if (session.status !== 'completed') {
            return res.status(400).json({
                status: 'Error',
                message: 'Consultation is not completed yet'
            });
        }

        res.status(200).json({
            status: 'Success',
            doctorSummary: session.doctorSummary,
            deleteAfter: session.expiresAt
        });
    } catch (error) {
        res.status(400).json({
            status: 'Error',
            message: 'Could not fetch doctor summary',
            error: error.message
        });
    }
});

module.exports = router;