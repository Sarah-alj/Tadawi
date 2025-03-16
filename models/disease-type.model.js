import mongoose, { Schema } from 'mongoose';
const DiseaseTypeSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
}, { timestamps: true });
export const DiseaseTypeModel = mongoose.model('DiseaseType', DiseaseTypeSchema);
