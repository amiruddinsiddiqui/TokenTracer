import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './config/config.js';
import logger from './config/logger.js';
import ResponseFormatter from './utils/responseFormatter.js';
import errorHandlerMiddleware from "./middlewares/errorHandler.middleware.js";
import cookieParser from "cookie-parser";
import supabase from "./config/supabase.js";

import leadRoutes from "./routes/lead.route.js"
import auditRoutes from './routes/audit.route.js';
import shareRoutes from './routes/share.route.js';
import apiRateLimiter from "./middlewares/rateLimit.middleware.js";

// Initialize Express app
const app = express();

// middlewares
app.use(helmet());
app.use(cors({
    origin: true,
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
    });
    next();
})

// ratelimit global middleware
app.use('/', apiRateLimiter);

// health check
app.get('/health', (req, res) => {
    res.status(200).json(
        ResponseFormatter.success(
            {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
            },
            'Service is healthy',
        )
    )
});

app.get('/', (req, res) => {
    res.status(200).json(
        ResponseFormatter.success(
            {
                service: 'Token Tracer API',
                version: '1.0.0',
                endpoint: {
                    health: '/health',
                    createAudit: 'POST /api/audit',
                    getAudit: 'GET /api/audit/:id',
                    captureLead: 'POST /api/leads',
                    publicShare: 'GET /api/share/:id',
                    sharePdf: 'GET /api/share/:id/pdf',
                },
            },
            'Token Tracer App'
        )
    )
})


app.use('/api/audit', auditRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/share', shareRoutes);


app.use((req, res) => {
    res.status(404).json(ResponseFormatter.error('Endpoint not found', 404))
})

app.use(errorHandlerMiddleware)


async function initializeSupabaseConnection() {
    try {
        logger.info('Initializing all connections...');

        const { error } = await supabase
            .from('leads')
            .select('*')
            .limit(1);

        if (error) {
            throw error;
        }

        logger.info('Supabase connection established successfully');
    } catch (e) {
        logger.error('Failed to establish connection', e);
        throw e;
    }
}


const startServer = async () => {
    try {
        await initializeSupabaseConnection();

        const server = app.listen(config.port, () => {
            logger.info(`Server listening on port ${config.port}`);
            logger.info(`Environment: ${config.node_env}`);
            logger.info(`API available at: http://localhost:${config.port}`);
        });

        const gracefulShutdown = async (signal) => {
            logger.info(`${signal} received, shutting down gracefully...`);

            server.close(async () => {
                logger.info("HTTP server closed");

                try {
                    // await supabase (dot) disconnect()

                    logger.info('All connection closed, exiting process');
                    process.exit(0);
                } catch (e) {
                    logger.info('Error occurred during shutdown:',e);
                    process.exit(1);
                }
            });

            setTimeout(() => {
                logger.error('Forced shutdown');
                process.exit(1);
            }, 10000);
        }

        process.on("SIGTERM", () => gracefulShutdown("SIGTERM")); // SIGTERM -> signal terminate
        process.on("SIGINT", () => gracefulShutdown("SIGINT")); // SIGINT -> signal interrupt

        process.on("uncaughtException", (error) => {
            logger.error("Uncaught Exception", error)
            gracefulShutdown("uncaughtException");
        });

        process.on("unhandledRejection", (reason, promise) => {
            logger.error("Unhandled Rejection at:", promise, "reason:", reason);
            gracefulShutdown("unhandledRejection");
        });
    } catch (e) {
        logger.info(`Failed to start server`, e);
        process.exit(1);
    }
}


await startServer();