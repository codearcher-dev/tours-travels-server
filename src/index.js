import express from 'express';
import cors from "cors";
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from 'express-session';

import connectDB from './config/db.js';
import packageRouter from './routes/package.routes.js';
import adminAuthRouter from './routes/admin.auth.routes.js';
import verifyAuthentication from './middlewares/auth.middleware.js';

dotenv.config();

const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

//Verifyauthentication middleware not implemented yet

app.use("/api/packages", packageRouter);
app.use("/api/admin", adminAuthRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})