import mongoose, { Schema } from 'mongoose';
const FeedbackSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    comments: { type: String, required: true },
  },
  { timestamps: true }
);
export const FeedbackModel = mongoose.model('Feedback', FeedbackSchema);
