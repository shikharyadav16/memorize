import mongoose from 'mongoose';

const passageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Passage = mongoose.model('Passage', passageSchema);

export default Passage;
