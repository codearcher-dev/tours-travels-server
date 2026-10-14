import "dotenv/config"
import express from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser';
import cron from 'node-cron';
import { createRequire } from 'module';

import packageRouter from './routes/package.routes.js';
import adminAuthRouter from './routes/admin.auth.routes.js';
import destinationRouter from './routes/destination.routes.js';
import feedbackRouter from './routes/feedback.routes.js';
import enquiryRouter from './routes/enquiry.routes.js';
import insightRouter from "./routes/insight.routes.js";

import verifyAuthentication from './middlewares/auth.middleware.js';

import connectDB from './config/db.js';
import { upload } from "./config/cloudinary.js"
import uploadToCloudinary from './utils/uploadToCloudinary.js';
import { storeInsight } from "./services/insight.services.js";

import { getMessaging } from "firebase-admin/messaging";
import { getAllAdmins } from "./services/admin.services.js";
import intializeFirebase from "./config/firebase.config.js";
import AdminModel from "./models/admin.schema.js";

const app = express();
connectDB();
intializeFirebase();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: [
        'https://tours-travels-admin-axch.onrender.com',
        'https://www.primetraveller.in',
        'https://admin.primetraveller.in',
        "http://localhost:5173",
        "http://localhost:5174",
        "https://localhost",
        "http://localhost"],
    credentials: true
}));

app.use(cookieParser());

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

//Test Route
app.post('/api/push-notification', async (req, res) => {
    const { title, body } = req.body;

    try {
        const admins = await getAllAdmins();
        let tokens = [];
        admins.forEach(admin => {
            admin.fcmToken.forEach(token => tokens.push(token));
        });

        if (tokens.length === 0) {
            return res.status(400).json({ success: false, message: "No tokens available" });
        }

        const message = {
            notification: {
                title: title || "Notification",
                body: body || "New notification recieved",
            },
            tokens,
            data: {
                route: "/enquiries",
            },
            android: {
                priority: "high",
                notification: {
                    channelId: 'default_channel',
                    priority: "high",
                    sound: 'default',
                    visibility: "public",
                }
            }
        }

        console.log("tokens : ", message.tokens);

        const response = await getMessaging().sendEachForMulticast(message);
        console.log("Successfully sent message:", response);

        const invalidTokens = [];

        response.responses.forEach((resp, idx) => {
            if (!resp.success) {
                const errorCode = resp.error?.code;
                if (
                    errorCode === 'messaging/invalid-registration-token' ||
                    errorCode === 'messaging/registration-token-not-registered'
                ) {
                    invalidTokens.push(message.tokens[idx]);
                }
            }
        });

        if (invalidTokens.length > 0) {
            await AdminModel.updateMany(
                { fcmToken: { $in: invalidTokens } },
                { $pull: { fcmToken: { $in: invalidTokens } } }
            );
        }

        console.log("Invalid tokens:", invalidTokens);

        return res.status(200).json({ success: true, messageId: response });
    } catch (error) {
        console.error("Error sending message:", error);
        return res.status(500).json({ success: false, error: error.message })
    }
})


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