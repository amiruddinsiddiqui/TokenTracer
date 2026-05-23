import AppError from '../utils/AppError.js';

const TOOL_NAMES = new Set([
    'cursor',
    'chatgpt',
    'claude',
    'githubCopilot',
    'gemini',
    'windsurf',
    'anthropicApi',
    'openaiApi',
]);

const USE_CASES = new Set([
    'coding',
    'writing',
    'research',
    'data',
    'mixed',
    'general',
]);

export function validateAuditBody(req, res, next) {
    const { tools, useCase } = req.body ?? {};

    if (!Array.isArray(tools) || tools.length === 0) {
        return next(new AppError('tools must be a non-empty array', 400));
    }

    if (!useCase || typeof useCase !== 'string') {
        return next(new AppError('useCase is required', 400));
    }

    if (!USE_CASES.has(useCase)) {
        return next(
            new AppError(
                `useCase must be one of: ${[...USE_CASES].join(', ')}`,
                400,
            ),
        );
    }

    for (const [index, tool] of tools.entries()) {
        if (!tool?.name || !TOOL_NAMES.has(tool.name)) {
            return next(
                new AppError(`tools[${index}].name is invalid or missing`, 400),
            );
        }
        if (!tool.plan || typeof tool.plan !== 'string') {
            return next(
                new AppError(`tools[${index}].plan is required`, 400),
            );
        }
        if (typeof tool.seats !== 'number' || tool.seats < 1) {
            return next(
                new AppError(`tools[${index}].seats must be a positive number`, 400),
            );
        }
        if (typeof tool.monthlySpend !== 'number' || tool.monthlySpend < 0) {
            return next(
                new AppError(
                    `tools[${index}].monthlySpend must be a non-negative number`,
                    400,
                ),
            );
        }
    }

    next();
}

/**
 * Honeypot: bots often fill hidden fields. Real users leave `_honeypot` empty.
 * Documented in README.md (Abuse protection).
 */
export function honeypotMiddleware(req, res, next) {
    const trap = req.body?._honeypot ?? req.body?.website;
    if (trap && String(trap).trim() !== '') {
        req.honeypotTriggered = true;
    }
    next();
}

export function validateLeadBody(req, res, next) {
    const { email } = req.body ?? {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || typeof email !== 'string' || !emailPattern.test(email.trim())) {
        return next(new AppError('A valid email is required', 400));
    }

    next();
}
