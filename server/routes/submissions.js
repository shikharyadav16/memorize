import express from 'express';
import Submission from '../models/Submission.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get history of recent submissions for logged in user
router.get('/', auth, async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(submissions);
  } catch (err) {
    console.error('Fetch submissions error:', err);
    res.status(500).json({ error: 'Failed to fetch submission history.' });
  }
});

// Get single submission by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const submission = await Submission.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found.' });
    }

    res.json(submission);
  } catch (err) {
    console.error('Fetch submission error:', err);
    res.status(500).json({ error: 'Failed to fetch submission.' });
  }
});

// Save a submission manually (or called internally by evaluate)
router.post('/', auth, async (req, res) => {
  try {
    const { originalText, userText, score, feedback } = req.body;

    if (!originalText || score === undefined) {
      return res.status(400).json({ error: 'originalText and score are required.' });
    }

    const submission = new Submission({
      userId: req.user._id,
      originalText,
      userText: userText || '',
      score,
      feedback: feedback || '',
    });

    await submission.save();
    res.status(201).json(submission);
  } catch (err) {
    console.error('Save submission error:', err);
    res.status(500).json({ error: 'Failed to save submission.' });
  }
});

export default router;
