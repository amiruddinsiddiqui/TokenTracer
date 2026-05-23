import ResponseFormatter from '../utils/responseFormatter.js';

class ReportController {
    constructor(auditService, shareService) {
        this.auditService = auditService;
        this.shareService = shareService;
    }

    async getAudit(req, res, next) {
        try {
            const audit = await this.auditService.getAudit(req.params.id);

            return res.status(200).json(
                ResponseFormatter.success(audit, 'Audit retrieved successfully'),
            );
        } catch (e) {
            next(e);
        }
    }

    async exportSharePdf(req, res, next) {
        try {
            const { audit, shareUrl } = await this.shareService.getPublicAudit(
                req.params.id,
            );

            // structured payload until a PDF renderer is added.
            return res.status(200).json(
                ResponseFormatter.success(
                    {
                        format: 'json',
                        message: 'PDF export not yet implemented; use this payload for rendering.',
                        shareUrl,
                        audit,
                    },
                    'Share export ready',
                ),
            );
        } catch (e) {
            next(e);
        }
    }
}

export default ReportController;
