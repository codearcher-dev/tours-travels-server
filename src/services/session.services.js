import crypto from 'crypto';
import SessionModel from "../models/session.schema.js";

export const createSession = async (sessionData) => {
    const session = await SessionModel.create(sessionData);
    return session;
}

export const findSessionById = async (sessionId) => {
    const session = await SessionModel.findOne({ sessionId });
    return session;
}

export const deleteSessionById = async (sessionId) => {
    const session = await SessionModel.findOneAndDelete({ sessionId });
    return session;
}

export const generateSessionId = () => {
    return crypto.randomBytes(16).toString('hex');
}