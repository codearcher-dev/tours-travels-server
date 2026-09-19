import SessionModel from '../models/session.schema.js';
import { createSession, findSessionById, generateSessionId } from './session.services.js';
import { generateAccessToken, generateRefreshToken, verifyJwtToken } from './jwt.services.js';
import { getAdminByEmail } from './admin.services.js';

export const authenticateAdmin = async (req, res, admin) => {
    const sessionId = generateSessionId();

    const session = await createSession({
        sessionId,
        userAgent: req.headers['user-agent'],
        ip: req.ip,
        email: admin.email,
    })
    const accessToken = generateAccessToken({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        sessionId: session.sessionId
    });

    const refreshToken = generateRefreshToken({ sessionId });

    const baseConfig = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    }

    res.cookie('access_token', accessToken, { ...baseConfig, maxAge: 1800000 }) //30 minutes
    res.cookie('refresh_token', refreshToken, { ...baseConfig, maxAge: 604800000 }) //7 days
    return { accessToken, refreshToken };
}

export const refreshTokens = async (refreshToken) => {
    try {
        const decodedToken = verifyJwtToken(refreshToken)
        const currentSession = await findSessionById(decodedToken.sessionId)

        if (!currentSession) {
            console.log("Invalid session");
            throw new Error("Invalid session");
        }

        const user = await getAdminByEmail(currentSession.email);

        if (!user) throw new Error("Invalid user");

        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            sessionId: currentSession.sessionId,
        }

        const newAccessToken = generateAccessToken(userData);
        const newRefreshToken = generateRefreshToken({ sessionId: currentSession.sessionId })

        console.log("New Access Token: ", newAccessToken);
        console.log("New Refresh Token: ", newRefreshToken);

        return { newAccessToken, newRefreshToken, user: userData }

    }
    catch (error) {
        throw new Error("Error generating new tokens: ", error);
    }
}