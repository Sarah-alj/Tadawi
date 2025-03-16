import mongoose from 'mongoose';
const uri = process.env.MONGO_URI;
export const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            console.log('✅ MongoDB already connected.');
            return;
        }
        await mongoose.connect(uri);
        console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    }
    catch (error) {
        console.error('❌ MongoDB connection failed:', error instanceof Error ? error.message : error);
    }
};
