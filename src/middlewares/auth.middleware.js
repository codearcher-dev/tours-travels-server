import { refreshTokens, verifyJwtToken } from "../services/auth.services.js";

// const verifyAuthentication = (req, res, next) => {
//     const accessToken = req.cookies.access_token;
//     const refreshToken = req.cookies.refresh_token;
//     req.user = null;

//     if (accessToken) {
//         const decodedToken = verifyJwtToken(accessToken);
//         req.user = decodedToken;
//         return next();
//     }

//     if (refreshToken) {
//         const { newAccessToken, newRefreshToken, user } = refreshTokens(refreshToken);
//         req.user = user;
//     }
// }