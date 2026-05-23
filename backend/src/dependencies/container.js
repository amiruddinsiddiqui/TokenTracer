import AuditRepository from '../repositories/audit.repository.js';
import LeadRepository from '../repositories/lead.repository.js';
import ShareRepository from '../repositories/share.repository.js';

import AuditService from '../services/auditEngine/audit.service.js';
import ShareService from '../services/share/share.service.js';
import LeadService from '../services/lead/lead.service.js';

import AuditController from '../controllers/audit.controller.js';
import LeadController from '../controllers/lead.controller.js';
import ShareController from '../controllers/share.controller.js';
import ReportController from '../controllers/report.controller.js';

class Container {
    static init() {
        const repositories = {
            auditRepository: AuditRepository,
            leadRepository: LeadRepository,
            shareRepository: ShareRepository,
        };

        const services = {
            auditService: new AuditService({
                auditRepository: repositories.auditRepository,
            }),

            shareService: new ShareService({
                shareRepository: repositories.shareRepository,
            }),

            leadService: new LeadService({
                leadRepository: repositories.leadRepository,
                auditRepository: repositories.auditRepository,
            }),
        };

        const controllers = {
            auditController: new AuditController(services.auditService),

            reportController: new ReportController(
                services.auditService,
                services.shareService,
            ),

            leadController: new LeadController(services.leadService),

            shareController: new ShareController(services.shareService),
        };

        return { repositories, services, controllers };
    }
}

export default Container.init();