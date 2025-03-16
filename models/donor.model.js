import mongoose, { Schema } from 'mongoose';
const DonorAcquirerSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['donor', 'acquirer', 'both'], required: true },
}, { timestamps: true });
export const DonorAcquirerModel = mongoose.model('DonorAcquirer', DonorAcquirerSchema);
