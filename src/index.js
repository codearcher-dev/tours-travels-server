import "dotenv/config"
import express from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser';
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
app.use(cors({
    origin: ['https://tours-travels-react.onrender.com',
        'https://tours-travels-admin-axch.onrender.com',
        'https://www.primetraveller.in',
        'https://admin.primetraveller.in',
        "http://localhost:5173", "http://localhost:5174"],
    credentials: true
}));

app.use(cookieParser());
//Verifyauthentication middleware not implemented yet

app.use("/api/package", packageRouter);
app.use("/api/admin", adminAuthRouter);
app.use("/api/destination", destinationRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/enquiry", enquiryRouter);
app.use("/api/insight", insightRouter);

app.get("/api/ping", (req, res) => {
    console.log("Ping received");
    return res.status(200).json({ message: "alive" });
});

// Schedule a task to run every 12 AM
cron.schedule('0 0 0 * * *', async () => {
    try {
        const insight = await storeInsight();
    } catch (error) {
        console.error(error)
    }
}, { timezone: 'Asia/Kolkata' });

app.use((err, req, res, next) => {
    return res.status(500).json({ message: err.message });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})