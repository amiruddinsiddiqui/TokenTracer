
import calculateSavings from "./calculateSavings.js";
import pricingRules from "./pricingRules.js";
import createPublicAudit from '../share/createPublicAudit.js';
import config from '../../config/config.js';

class AuditService {

    constructor({ auditRepository }) {
        this.auditRepository = auditRepository;
    }

    async getAudit(id) {

        return await this.auditRepository
            .findById(id);
    }

    async createAudit(auditData) {

        const recommendations = [];

        let totalMonthlySavings = 0;

        for (const tool of auditData.tools) {

            let recommendedPlan = tool.plan;
            let recommendedSpend = tool.monthlySpend;
            let reason = "Current plan is already optimized";
            let recommendedTool = tool.name;

            // =========================================
            // CURSOR
            // =========================================

            if (
                tool.name === "cursor" &&
                tool.plan === "business" &&
                tool.seats <= 2
            ) {

                recommendedPlan = "pro";

                recommendedSpend =
                    pricingRules.cursor.pro *
                    tool.seats;

                reason =
                    "Cursor Business pricing is excessive for teams under 3 seats";
            }

            if (
                tool.name === "cursor" &&
                tool.plan === "enterprise" &&
                tool.seats < 10
            ) {

                recommendedPlan = "business";

                recommendedSpend =
                    pricingRules.cursor.business *
                    tool.seats;

                reason =
                    "Cursor Enterprise is intended for larger organizations";
            }

            // =========================================
            // CHATGPT
            // =========================================

            if (
                tool.name === "chatgpt" &&
                tool.plan === "team" &&
                tool.seats <= 2
            ) {

                recommendedPlan = "plus";

                recommendedSpend =
                    pricingRules.chatgpt.plus *
                    tool.seats;

                reason =
                    "ChatGPT Team provides limited value for very small teams";
            }

            if (
                tool.name === "chatgpt" &&
                tool.plan === "enterprise" &&
                tool.seats < 15
            ) {

                recommendedPlan = "team";

                recommendedSpend =
                    pricingRules.chatgpt.team *
                    tool.seats;

                reason =
                    "ChatGPT Enterprise is difficult to justify for smaller organizations";
            }

            // =========================================
            // CLAUDE
            // =========================================

            if (
                tool.name === "claude" &&
                tool.plan === "team" &&
                tool.seats <= 2
            ) {

                recommendedPlan = "pro";

                recommendedSpend =
                    pricingRules.claude.pro *
                    tool.seats;

                reason =
                    "Claude Team pricing is inefficient for very small teams";
            }

            if (
                tool.name === "claude" &&
                tool.plan === "enterprise" &&
                tool.seats < 10
            ) {

                recommendedPlan = "team";

                recommendedSpend =
                    pricingRules.claude.team *
                    tool.seats;

                reason =
                    "Claude Enterprise is better suited for larger organizations";
            }

            if (
                tool.name === "claude" &&
                tool.plan === "max" &&
                auditData.useCase === "writing"
            ) {

                recommendedPlan = "pro";

                recommendedSpend =
                    pricingRules.claude.pro *
                    tool.seats;

                reason =
                    "Claude Max is unnecessary for most writing-focused workflows";
            }

            // =========================================
            // GITHUB COPILOT
            // =========================================

            if (
                tool.name === "githubCopilot" &&
                tool.plan === "business" &&
                tool.seats === 1
            ) {

                recommendedPlan = "individual";

                recommendedSpend =
                    pricingRules.githubCopilot.individual;

                reason =
                    "GitHub Copilot Business features are unnecessary for solo developers";
            }

            if (
                tool.name === "githubCopilot" &&
                tool.plan === "enterprise" &&
                tool.seats < 20
            ) {

                recommendedPlan = "business";

                recommendedSpend =
                    pricingRules.githubCopilot.business *
                    tool.seats;

                reason =
                    "GitHub Copilot Enterprise pricing is difficult to justify below 20 seats";
            }

            // =========================================
            // GEMINI
            // =========================================

            if (
                tool.name === "gemini" &&
                tool.plan === "ultra" &&
                auditData.useCase !== "research"
            ) {

                recommendedPlan = "pro";

                recommendedSpend =
                    pricingRules.gemini.pro *
                    tool.seats;

                reason =
                    "Gemini Ultra is primarily valuable for advanced research workloads";
            }

            // =========================================
            // WINDSURF
            // =========================================

            if (
                tool.name === "windsurf" &&
                tool.plan === "team" &&
                tool.seats <= 2
            ) {

                recommendedPlan = "pro";

                recommendedSpend =
                    pricingRules.windsurf.pro *
                    tool.seats;

                reason =
                    "Windsurf Team pricing is excessive for small teams";
            }

            // =========================================
            // TOOL REPLACEMENT LOGIC
            // =========================================

            if (
                tool.name === "chatgpt" &&
                auditData.useCase === "coding"
            ) {

                recommendedTool = "cursor";

                recommendedPlan = "pro";

                recommendedSpend =
                    pricingRules.cursor.pro *
                    tool.seats;

                reason =
                    "Cursor provides stronger coding workflows at lower effective cost";
            }

            if (
                tool.name === "claude" &&
                auditData.useCase === "coding"
            ) {

                recommendedTool = "cursor";

                recommendedPlan = "pro";

                recommendedSpend =
                    pricingRules.cursor.pro *
                    tool.seats;

                reason =
                    "Cursor combines editor integration and AI assistance more efficiently for engineering teams";
            }

            const savings = calculateSavings({
                currentSpend: tool.monthlySpend,
                recommendedSpend
            });

            totalMonthlySavings += savings.monthlySavings;

            recommendations.push({
                tool: tool.name,
                recommendedTool,
                currentPlan: tool.plan,
                recommendedPlan,
                currentSpend: tool.monthlySpend,
                recommendedSpend,
                monthlySavings:
                savings.monthlySavings,
                annualSavings:
                savings.annualSavings,
                reason
            });
        }

        const totalAnnualSavings =
            totalMonthlySavings * 12;

        const { publicId, shareUrl } =
            createPublicAudit(config.appBaseUrl);

        const auditPayload = {
            tools: auditData.tools,
            use_case: auditData.useCase,
            recommendations,
            total_monthly_savings:
            totalMonthlySavings,
            total_annual_savings:
            totalAnnualSavings,
            public_id: publicId
        };

        const saved =
            await this.auditRepository
                .createAudit(auditPayload);

        return {
            id: saved.id,
            useCase: auditData.useCase,
            recommendations,
            totalMonthlySavings,
            totalAnnualSavings,
            publicId,
            shareUrl
        };

    }
}

export default AuditService;