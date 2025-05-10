import mongoose, { Schema } from 'mongoose';
const MessageSchema = new Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match',
      required: true,
    },
    type: {
      type: String,
      enum: ['text', 'image', 'pdf'],
    },
    content: {
      type: String,
    },
    document: {
      type: String,
    },

    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,

    //* Static methods Start
    statics: {
      async getMessagesByMatchId(matchId) {
        return this.find({ matchId }).select('sender type content document createdAt').sort({ createdAt: 1 });
      },
    },
    // * Instance methods Start
  }
);
export const MessageModel = mongoose.model('Message', MessageSchema);
