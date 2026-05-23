import ResponseFormatter from '../utils/responseFormatter.js';

class LeadController {
    constructor(leadService) {
        this.leadService = leadService;
    }

    async createLead(req, res, next) {
        try {
            if (req.honeypotTriggered) {
                return res.status(201).json(
                    ResponseFormatter.success(
                        { accepted: true },
                        'Lead captured successfully',
                    ),
                );
            }

            const { email, company, role, teamSize, auditId } = req.body;

            const lead = await this.leadService.captureLead({
                email,
                company,
                role,
                teamSize,
                auditId,
            });

            return res.status(201).json(
                ResponseFormatter.success(lead, 'Lead captured successfully'),
            );
        } catch (e) {
            next(e);
        }
    }
}

export default LeadController;