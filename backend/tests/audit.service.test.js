import { vi } from 'vitest';

// Mock AI summary generation to avoid real Gemini API calls during tests
vi.mock(
    '../src/services/ai/summary.service.js',
    () => ({
        default: vi.fn(async () =>
            'Mock AI summary'
        ),
    }),
);

import { describe, it, expect } from 'vitest';
import AuditService from '../src/services/auditEngine/audit.service.js';

describe('AuditService', () => {

    const mockRepository = {
        createAudit: vi.fn(async (data) => ({
            id: '123',
            ...data,
        })),
    };

    const auditService =
        new AuditService({
            auditRepository: mockRepository,
        });

    // Should downgrade Cursor Business to Pro for very small teams
    it('should recommend Cursor Pro for small Cursor Business teams', async () => {

        const result =
            await auditService.createAudit({
                useCase: 'coding',
                tools: [
                    {
                        name: 'cursor',
                        plan: 'business',
                        seats: 2,
                        monthlySpend: 80,
                    },
                ],
            });

        expect(
            result.recommendations[0]
                .recommendedPlan
        ).toBe('pro');
    });

    // Should recommend Cursor instead of ChatGPT for coding workflows
    it('should replace ChatGPT with Cursor for coding workflows', async () => {

        const result =
            await auditService.createAudit({
                useCase: 'coding',
                tools: [
                    {
                        name: 'chatgpt',
                        plan: 'team',
                        seats: 2,
                        monthlySpend: 60,
                    },
                ],
            });

        expect(
            result.recommendations[0]
                .recommendedTool
        ).toBe('cursor');
    });

    // Should correctly calculate total monthly savings
    it('should calculate total monthly savings', async () => {

        const result =
            await auditService.createAudit({
                useCase: 'coding',
                tools: [
                    {
                        name: 'chatgpt',
                        plan: 'team',
                        seats: 2,
                        monthlySpend: 60,
                    },
                ],
            });

        expect(
            result.totalMonthlySavings
        ).toBeGreaterThan(0);
    });

    // Should generate annual savings from monthly savings
    it('should generate annual savings', async () => {

        const result =
            await auditService.createAudit({
                useCase: 'writing',
                tools: [
                    {
                        name: 'claude',
                        plan: 'max',
                        seats: 1,
                        monthlySpend: 100,
                    },
                ],
            });

        expect(
            result.totalAnnualSavings
        ).toBe(
            result.totalMonthlySavings * 12
        );
    });

    // Should always return recommendations as an array
    it('should return recommendations array', async () => {

        const result =
            await auditService.createAudit({
                useCase: 'coding',
                tools: [
                    {
                        name: 'cursor',
                        plan: 'business',
                        seats: 2,
                        monthlySpend: 80,
                    },
                ],
            });

        expect(
            Array.isArray(
                result.recommendations
            )
        ).toBe(true);
    });
});