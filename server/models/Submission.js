import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userText: {
    type: String,
    default: '',
  },
  originalText: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
  feedback: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;
