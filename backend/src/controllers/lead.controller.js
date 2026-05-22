import ResponseFormatter from "../utils/responseFormatter.js";

class LeadController {

    constructor(leadRepository, emailService) {
        this.leadRepository = leadRepository;
        this.emailService = emailService;
    }

    async createLead(req, res, next) {

        try {
            const {
                email,
                company,
                role,
                teamSize
            } = req.body;

            const lead =
                await this.leadRepository
                    .createLead({
                        email,
                        company,
                        role,
                        team_size: teamSize
                    });

            await this.emailService
                .sendAuditEmail(
                    email
                );

            return res.status(201).json(
                ResponseFormatter.success(
                    lead,
                    "Lead captured successfully"
                )
            );

        } catch (e) {
            next(e);
        }
    }
}

export default LeadController;