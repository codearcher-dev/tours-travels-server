import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    userAgent: {
        type: String,
        required: true,
    },
    ip: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const SessionModel = mongoose.model("Session", sessionSchema);

export default SessionModel;