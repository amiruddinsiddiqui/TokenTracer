class SummaryService {

    async generateSummary(auditResult) {

        // TODO:
        // integrate Gemini

        return `
            Your team can save around 
            $${auditResult.monthlySavings}/month
            by optimizing unused AI subscriptions.
        `;
    }
}

export default SummaryService;