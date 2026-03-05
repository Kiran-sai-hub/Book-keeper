import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
};

const setCookie = (res, token) => {
    const cookieOptions = {
        maxAge: 15 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
    }
    res.cookie('jwt', token, cookieOptions)
}

export { generateToken, setCookie };