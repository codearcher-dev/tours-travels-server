import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export const generateAccessToken = ({ name, email, id }) => {
    const payload = { name, email, id };
    const secret = process.env.JWT_SECRET;
    const options = { expiresIn: '30m' }; // Token expires in 30 minutes
    return jwt.sign(payload, secret, options);
}

export const generateRefreshToken = ({ sessionId }) => {
    const payload = { sessionId };
    const secret = process.env.JWT_SECRET;
    const options = { expiresIn: '7d' }; // Token expires in 7 days
    return jwt.sign(payload, secret, options);
}

export const generateSessionId = () => {
    return crypto.randomBytes(16).toString('hex');
}

export const verifyJwtToken = (token) => {
    const secret = process.env.JWT_SECRET;
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

export const hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
}

export const verifyPassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
}

export const authenticateAdmin = async (req, res, admin) => {
    const accessToken = generateAccessToken({ name: admin.name, email: admin.email, id: admin._id });
    const refreshToken = generateRefreshToken({ sessionId: req.session.id });

    const baseConfig = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    }

    res.cookie('access_token', accessToken, { ...baseConfig, maxAge: 1800000 }) //30 minutes
    res.cookie('refresh_token', refreshToken, { ...baseConfig, maxAge: 604800000 }) //7 days
    return { accessToken, refreshToken };
}

// export const refreshTokens = async (refreshToken) => {
//     try {
//         const decodedToken = verifyJwtToken(refreshToken)
//         const currentSession = await findSessionById(decodedToken.sessionId)

//         if (!currentSession) {
//             throw new Error("Invalid session")
//         }

//         const user = await getUserByEmail(currentSession.email)

//         if (!user) throw new Error("Invalid user");

//         const userData = {
//             _id: user._id,
//             name: user.name,
//             email: user.email,
//             sessionId: currentSession.sessionId,
//         }

//         const newAccessToken = createAccessToken(userData)
//         const newRefreshToken = createRefreshToken({ sessionId: currentSession.sessionId })

//         return { newAccessToken, newRefreshToken, user: userData }

//     }
//     catch (error) {
//         throw new Error("Error generating new tokens: ", error);
//     }
// }