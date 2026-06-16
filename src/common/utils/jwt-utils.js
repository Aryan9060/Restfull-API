import crypto from "crypto";
import jwt from 'jsonwebtoken';

const generateToken = () => {
    const rewToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rewToken).digest("hex");

    return { rewToken, hashedToken };
}

const generateAccessToken = (payload) => {
    jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m'
    }, (err, token) => {
        if (err) throw err;
        return token;
    })
};

const varifiAccessToken = (token) => {
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
        if (err) throw err;
        return decoded;
    })
}

const generateRefreshToken = (payload) => {
    jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '24h'
    }, (err, token) => {
        if (err) throw err;
        return token;
    })
};

const varifiRefreshToken = (token) => {
    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
        if (err) throw err;
        return decoded;
    })
}

export { generateToken, generateAccessToken, varifiAccessToken, generateRefreshToken, varifiRefreshToken };
