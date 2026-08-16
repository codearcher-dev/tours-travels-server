import { refreshTokens, verifyJwtToken } from "../services/auth.services.js";

const verifyAuthentication = (req, res, next) => {
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;
    req.user = null;

    if (accessToken) {
        const decodedToken = verifyJwtToken(accessToken);
        req.user = decodedToken;
        return next();
    }

    if (refreshToken) {
        try {
            const { newAccessToken, newRefreshToken, user } = refreshTokens(refreshToken);
            req.user = user;

            const baseConfig = {
                httpOnly: true,
                secure: true,
                sameSite: "None"
            }

            res.cookie("access_token", newAccessToken, { ...baseConfig, maxAge: 1800000 })
            res.cookie("refresh_token", newRefreshToken, { ...baseConfig, maxAge: 604800000 })

            return next();
        } catch (error) {
            console.error("Error refreshing tokens:", error);
        }
    }

    return next();
}

export default verifyAuthentication;