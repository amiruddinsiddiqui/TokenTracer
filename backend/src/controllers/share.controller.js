import ResponseFormatter from "../utils/responseFormatter.js";

class ShareController {

    constructor(auditService) {
        this.auditService = auditService;
    }

    async createAudit(req, res, next) {

        try {

            const audit =
                await this.auditService.createAudit(
                    req.body
                );

            return res.status(201).json(
                ResponseFormatter.success(
                    audit,
                    "Audit created successfully"
                )
            );

        } catch (e) {
            next(e);
        }
    }
}

export default ShareController;