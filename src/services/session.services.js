import crypto from 'crypto';
import SessionModel from "../models/session.schema.js";

export const findSessionById = async (sessionId) => {
    const session = await SessionModel.findOne({ sessionId });
    return session;
}

export const generateSessionId = () => {
    return crypto.randomBytes(16).toString('hex');
}