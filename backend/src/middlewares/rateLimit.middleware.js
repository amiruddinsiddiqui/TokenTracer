import rateLimit from 'express-rate-limit';
import config from '../config/config.js';

const apiRateLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests, please try again later',
        statusCode: 429,
    },
});

export default apiRateLimiter;
