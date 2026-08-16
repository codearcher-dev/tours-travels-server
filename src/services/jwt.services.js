import jwt from 'jsonwebtoken';

export const generateAccessToken = ({ name, email, _id, sessionId }) => {
    const payload = { name, email, _id, sessionId };
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

export const verifyJwtToken = (token) => {
    const secret = process.env.JWT_SECRET;
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}