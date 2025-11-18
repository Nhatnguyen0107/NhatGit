import jwt from 'jsonwebtoken';

/**
 * Generate Access Token (short-lived)
 * @param {Object} payload - User data to encode
 * @returns {String} JWT access token
 */
export const generateAccessToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m' }
    );
};

/**
 * Generate Refresh Token (long-lived)
 * @param {Object} payload - User data to encode
 * @returns {String} JWT refresh token
 */
export const generateRefreshToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
    );
};

/**
 * Verify Access Token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded payload
 */
export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired access token');
    }
};

/**
 * Verify Refresh Token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded payload
 */
export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired refresh token');
    }
};

/**
 * Generate both tokens at once
 * @param {Object} user - User object with id, email, role
 * @returns {Object} { accessToken, refreshToken }
 */
export const generateTokens = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
        role_id: user.role_id
    };

    return {
        accessToken: generateAccessToken(payload),
        refreshToken: generateRefreshToken({ id: user.id })
    };
};
