import "dotenv/config"
import express from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser';
import session from 'express-session';

import connectDB from './config/db.js';
import packageRouter from './routes/package.routes.js';
import adminAuthRouter from './routes/admin.auth.routes.js';
import verifyAuthentication from './middlewares/auth.middleware.js';
import destinationRouter from './routes/destination.routes.js';
import feedbackRouter from './routes/feedback.routes.js';
import enquiryRouter from './routes/enquiry.routes.js';

import { upload } from "./config/cloudinary.js"
import uploadToCloudinary from './utils/uploadToCloudinary.js';

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





// Multiple images upload route (up to 10 images)
app.post('/api/upload/multiple', upload.array('images', 10), async (req, res) => {
    console.log("Multiple Upload")
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'Please select at least one image.' });
        }

        const uploadPromises = req.files.map((file) =>
            uploadToCloudinary(file.buffer, 'gallery_images')
        );

        const results = await Promise.all(uploadPromises);

        return res.status(200).json({
            message: 'Images uploaded successfully',
            count: results.length,
            data: results
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
















const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})