import config from '../../config/config.js';
import logger from '../../config/logger.js';
import {
    buildAuditEmailHtml,
    buildAuditEmailSubject,
    buildAuditEmailText,
} from './buildAuditEmail.js';

export default async function sendAuditMail(email, audit) {
    const { apiKey, fromEmail } = config.resend;

    if (!apiKey) {
        logger.warn('RESEND_API_KEY not set — skipping transactional email', {
            email,
        });
        return { success: false, skipped: true, reason: 'RESEND_API_KEY not configured' };
    }

    const sharePath = audit?.public_id
        ? `/share/${audit.public_id}`
        : null;
    const shareUrl = sharePath ? `${config.appBaseUrl}${sharePath}` : null;

    const payload = {
        from: fromEmail,
        to: [email],
        subject: buildAuditEmailSubject(audit),
        html: buildAuditEmailHtml({ email, audit, shareUrl }),
        text: buildAuditEmailText({ email, audit, shareUrl }),
    };

    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errText = await response.text();
        logger.error('Resend API error', {
            status: response.status,
            body: errText,
            email,
        });
        throw new Error(`Failed to send audit email (${response.status})`);
    }

    const result = await response.json();
    logger.info('Audit email sent', { email, messageId: result.id });

    return { success: true, messageId: result.id };
}