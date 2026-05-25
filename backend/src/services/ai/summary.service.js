import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../../config/config.js';
import AppError from '../../utils/AppError.js';
import logger from '../../config/logger.js';

const genAI = new GoogleGenerativeAI(
    config.geminiAI.apiKey,
);

async function generateSummary(data) {

    if (!config.geminiAI.apiKey) {
        logger.warn('GEMINI_API_KEY missing - AI summary skipped');
        return 'AI summary unavailable.';
    }

    const model = genAI.getGenerativeModel({
        model: 'gemini-3.5-flash',
    });

    const prompt = `
    You are an AI SaaS cost optimization assistant.
    Analyze this audit data and generate a concise professional summary.
    
    Use Case:
    ${data.useCase}
    
    Recommendations:
    ${JSON.stringify(data.recommendations, null, 2)}
    
    Total Monthly Savings:
    $${data.totalMonthlySavings}
    
    Total Annual Savings:
    $${data.totalAnnualSavings}
    
    Keep the response under 120 words.
    Return plain text only.
    Do not use markdown, asterisks, bullets, or formatting symbols.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;

        return response.text();
    } catch (e) {
        logger.error('Gemini summary generation failed', {message: e.message, stack: e.stack,});
        throw new AppError(e.message || 'Failed to generate AI audit summary', 500, e);
    }
}

export default generateSummary;