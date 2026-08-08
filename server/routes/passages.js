import express from 'express';
import Passage from '../models/Passage.js';

const router = express.Router();

// Get a random passage
router.get('/random', async (req, res) => {
  try {
    const count = await Passage.countDocuments();
    if (count === 0) {
      return res.status(404).json({ error: 'No passages found. Add some via /admin.' });
    }
    const randomIndex = Math.floor(Math.random() * count);
    const passage = await Passage.findOne().skip(randomIndex);
    res.json(passage);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch passage.' });
  }
});

// Get all passages
router.get('/', async (req, res) => {
  try {
    const passages = await Passage.find().sort({ createdAt: -1 });
    res.json(passages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch passages.' });
  }
});

// Create a new passage
router.post('/', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Passage text is required.' });
    }
    const passage = new Passage({ text: text.trim() });
    await passage.save();
    res.status(201).json(passage);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save passage.' });
  }
});

// Delete a passage
router.delete('/:id', async (req, res) => {
  try {
    const passage = await Passage.findByIdAndDelete(req.params.id);
    if (!passage) {
      return res.status(404).json({ error: 'Passage not found.' });
    }
    res.json({ message: 'Passage deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete passage.' });
  }
});

export default router;
