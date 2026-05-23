import ResponseFormatter from '../utils/responseFormatter.js';

class ShareController {
    constructor(shareService) {
        this.shareService = shareService;
    }

    async getPublicAudit(req, res, next) {
        try {
            const result = await this.shareService.getPublicAudit(req.params.id);

            return res.status(200).json(
                ResponseFormatter.success(
                    result,
                    'Public audit retrieved successfully',
                ),
            );
        } catch (e) {
            next(e);
        }
    }
}

export default ShareController;
