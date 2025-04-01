import mongoose, { Schema } from 'mongoose';
const BookingSchema = new Schema({
    bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    trial: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trial',
        required: true,
    },
    bookingDateTime: { type: Date, required: true },
}, { timestamps: true });
export const BookingModel = mongoose.model('Booking', BookingSchema);
