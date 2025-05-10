import mongoose, { Schema } from 'mongoose';
const DonationSchema = new Schema(
  {
    equipmentType: { type: String, required: true },
    equipmentName: { type: String, required: true },
    equipmentDescription: { type: String, required: true },
    yearsOfUse: { type: Number, required: true },
    warrantyDetails: { type: String },
    defects: { type: String },
    pointOfContact: { type: String },
    details: { type: String },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isTaken: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
export const DonationModel = mongoose.model('Item', DonationSchema);
