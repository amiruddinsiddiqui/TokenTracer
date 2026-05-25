import { randomUUID } from 'node:crypto';

export default function createPublicAudit(appBaseUrl = '') {
    const publicId = randomUUID();
    const sharePath = `/share/${publicId}`;
    const base = appBaseUrl.replace(/\/$/, '');
    const shareUrl = base ? `${base}${sharePath}` : sharePath;

    return { publicId, sharePath, shareUrl };
}
