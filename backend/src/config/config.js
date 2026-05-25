import dotenv from 'dotenv'
dotenv.config();

const config = {
    // server
    node_env : process.env.NODE_ENV || "development",
    port : parseInt(process.env.PORT || "3000", 10),

    // supabase postgreSQL
    supabase: {
        supabase_url : process.env.SUPABASE_URL,
        supabase_secret_key : process.env.SUPABASE_KEY
    },

    // JWT
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    },

    appBaseUrl: process.env.FRONTEND_URL || `http://localhost:${parseInt('5173', 10)}`,

    resend: {
        apiKey: process.env.RESEND_API_KEY || null,
        fromEmail:
            process.env.RESEND_FROM_EMAIL ||
            'Token Tracer <onboarding@resend.dev>',
    },

    geminiAI: {
        apiKey: process.env.GEMINI_API_KEY || '',
    },

    frontendUrl: {
        url: process.env.FRONTEND_URL
    },

    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), //15 minutes
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '1000', 10), // 1000 req per 15 min per IP address
    },

    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expiresIn: 24*60*60*1000
    }
}

export default config;