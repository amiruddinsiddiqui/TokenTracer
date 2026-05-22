import AuditRepository from "../repositories/audit.repository.js";
import LeadRepository from "../repositories/lead.repository.js";
import ShareRepository from "../repositories/share.repository.js";

import AuditService from "../services/auditEngine/audit.service.js";
import ShareService from "../services/share/share.service.js";
import EmailService from "../services/email/email.service.js";
import SummaryService from "../services/ai/summary.service.js";

import AuditController from "../controllers/audit.controller.js";
import LeadController from "../controllers/lead.controller.js";
import ShareController from "../controllers/share.controller.js";

class Container {

    static init() {

        // =========================
        // Repositories
        // =========================

        const repositories = {
            auditRepository: AuditRepository,
            leadRepository: LeadRepository,
            shareRepository: ShareRepository
        };

        // =========================
        // Services
        // =========================

        const services = {

            auditService: new AuditService({
                auditRepository: repositories.auditRepository
            }),

            shareService: new ShareService({
                shareRepository: repositories.shareRepository
            }),

            emailService: new EmailService(),

            summaryService: new SummaryService()
        };

        // =========================
        // Controllers
        // =========================

        const controllers = {

            auditController: new AuditController(
                services.auditService
            ),

            leadController: new LeadController(
                repositories.leadRepository,
                services.emailService
            ),

            shareController: new ShareController(
                services.shareService
            )
        };

        return {
            repositories,
            services,
            controllers
        };
    }
}

const initialized = Container.init();

export default initialized;