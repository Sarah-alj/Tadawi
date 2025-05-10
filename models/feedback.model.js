import mongoose, { Schema } from 'mongoose';

const FeedbackSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    comments: { type: String, required: true },
  },
  {
    timestamps: true,

    //* STATIC METHODS START
    statics: {
      async submitFeedback(data) {
        return this.create({
          name: data.name,
          email: data.email,
          comments: data.comments,
          user: data.user,
        });
      },
    },
    // * STATIC METHODS END
  }
);

export const FeedbackModel = mongoose.model('Feedback', FeedbackSchema);
