import MongoStore from 'connect-mongo';
import 'dotenv/config';
import express from 'express';
import 'express-async-errors';
import session from 'express-session';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/database.js';
import AuthRouter from './routes/auth.routes.js';
import ChatRouter from './routes/chat.routes.js';
import DiseaseRouter from './routes/disease.routes.js';
import DoctorRouter from './routes/doctor.routes.js';
import DonationRouter from './routes/donation.routes.js';
import LabRouter from './routes/lab.routes.js';
import MatchRouter from './routes/match.routes.js';
import NotificationsRouter from './routes/notifications.routes.js';
import PatientRouter from './routes/patient.routes.js';
import UserRouter from './routes/user.routes.js';
import FeedbackRouter from './routes/feedback.routes.js';
import AIChatRouter from './routes/ai-chat.routes.js';

import errorHandler from './middleware/errorHandler.js';

import { protectHtmlPages } from './middleware/html-pages-middleware.js';
const app = express();
// Connect to MongoDB
connectDB();
// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Middleware
app.use(
  express.json({
    limit: '5mb',
  })
);
// Setup express-session with existing Mongoose connection
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret', //added a fallback secret key to void crashing if .env file doesnt have secret key
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      client: mongoose.connection.getClient(), // Use existing Mongoose connection
      collectionName: 'sessions',
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    },
  })
);

app.use('/api/auth', AuthRouter);
app.use('/api/diseases', DiseaseRouter);
app.use('/api/patients', PatientRouter);
app.use('/api/doctors', DoctorRouter);
app.use('/api/matches', MatchRouter);
app.use('/api/labs', LabRouter);
app.use('/api/users', UserRouter);
app.use('/api/donations', DonationRouter);
app.use('/api/notifications', NotificationsRouter);
app.use('/api/chat', ChatRouter);
app.use('/api/feedbacks', FeedbackRouter);
app.use('/api/ai-chat', AIChatRouter);

// protect html pages
app.use(protectHtmlPages);

// serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static assets(html, css, and images used in website)
app.use(express.static(path.join(__dirname, 'public')));

// middleware to handle errors
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
