import "dotenv/config"
import express from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser';
import session from 'express-session';
import cron from 'node-cron';

import connectDB from './config/db.js';
import packageRouter from './routes/package.routes.js';
import adminAuthRouter from './routes/admin.auth.routes.js';
import verifyAuthentication from './middlewares/auth.middleware.js';
import destinationRouter from './routes/destination.routes.js';
import feedbackRouter from './routes/feedback.routes.js';
import enquiryRouter from './routes/enquiry.routes.js';

import { upload } from "./config/cloudinary.js"
import uploadToCloudinary from './utils/uploadToCloudinary.js';
import insightRouter from "./routes/insight.routes.js";
import { storeInsight } from "./services/insight.services.js";

const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: ['https://tours-travels-react.onrender.com', 'https://tours-travels-admin-axch.onrender.com'], credentials: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

//Verifyauthentication middleware not implemented yet

app.use("/api/package", packageRouter);
app.use("/api/admin", adminAuthRouter);
app.use("/api/destination", destinationRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/enquiry", enquiryRouter);
app.use("/api/insight", insightRouter);



// Schedule a task to run every 12 AM
cron.schedule('0 0 0 * * *', async () => {
    try {
        const insight = await storeInsight();
        console.log(insight);
    } catch (error) {
        console.error(error)
    }
}, { timezone: 'Asia/Kolkata' });



const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})