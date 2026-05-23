import sendAuditMail from '../email/sendAuditMail.js';

class LeadService {
    constructor({ leadRepository, auditRepository }) {
        this.leadRepository = leadRepository;
        this.auditRepository = auditRepository;
    }

    async captureLead({ email, company, role, teamSize, auditId }) {
        const lead = await this.leadRepository.createLead({
            email: email.trim().toLowerCase(),
            company: company ?? null,
            role: role ?? null,
            team_size: teamSize ?? null,
            audit_id: auditId ?? null,
        });

        let audit = null;
        if (auditId) {
            audit = await this.auditRepository.findById(auditId);
        }

        const emailResult = await sendAuditMail(email, audit);

        return { ...lead, emailSent: emailResult.success, emailSkipped: emailResult.skipped ?? false };
    }
}

export default LeadService;
