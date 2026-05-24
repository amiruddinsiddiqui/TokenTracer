# PRICING_DATA.md — Token Tracer Audit Engine

All per-seat monthly list prices used in `backend/src/services/auditEngine/pricingRules.js` for **plan comparison math**. API-direct tools (`anthropicApi`, `openaiApi`) are flagged `usage_based` and the engine compares subscription tiers only, not token usage.

**Verification date for all entries below:** 2026-05-23  
**Re-verify before submission** if vendor pages change.

---

## Cursor

Source: https://cursor.com/pricing — verified 2026-05-23

| Plan       | Engine value ($/user/mo) | Notes |
|------------|--------------------------|--------|
| Hobby      | $0                       | Free tier |
| Pro        | $20                      | Individual Pro |
| Business   | $40                      | Team / Business per seat |
| Enterprise | $60                      | Placeholder for enterprise list; contact sales on site |

---

## GitHub Copilot

Source: https://github.com/features/copilot/plans — verified 2026-05-23

| Plan       | Engine value ($/user/mo) |
|------------|--------------------------|
| Individual | $10                      |
| Business   | $19                      |
| Enterprise | $39                      |

---

## Claude (Anthropic subscriptions)

Source: https://www.anthropic.com/pricing — verified 2026-05-23

| Plan       | Engine value ($/user/mo) |
|------------|--------------------------|
| Free       | $0                       |
| Pro        | $20                      |
| Max        | $100                     | Higher tier for power users |
| Team       | $30                      | Standard team seat |
| Enterprise | $60                      | Estimated list for modeling; enterprise is custom |
| API direct | usage_based              | Not compared to seat plans |

---

## ChatGPT (OpenAI subscriptions)

Source: https://openai.com/chatgpt/pricing/ — verified 2026-05-23

| Plan       | Engine value ($/user/mo) |
|------------|--------------------------|
| Plus       | $20                      |
| Team       | $30                      |
| Enterprise | $60                      | Modeled for overspend rules; enterprise is custom |
| API direct | usage_based              |

---

## Anthropic API (direct)

Source: https://www.anthropic.com/pricing — verified 2026-05-23

| Plan | Engine value |
|------|----------------|
| API  | `usage_based` — audit flags overlap with Claude Team/Pro subscriptions |

---

## OpenAI API (direct)

Source: https://openai.com/api/pricing/ — verified 2026-05-23

| Plan | Engine value |
|------|----------------|
| API  | `usage_based` |

---

## Google Gemini

Source: https://one.google.com/about/google-ai-plans/ — verified 2026-05-23

| Plan  | Engine value ($/user/mo) |
|-------|--------------------------|
| Pro   | $20                      | Google AI Pro (consumer/individual) |
| Ultra | $50                      | Higher tier for advanced use |
| API   | usage_based              | https://ai.google.dev/pricing |

---

## Windsurf (Codeium)

Source: https://windsurf.com/pricing — verified 2026-05-23

| Plan | Engine value ($/user/mo) |
|------|--------------------------|
| Pro  | $15                      |
| Team | $30                      |

---

## How numbers map to audit logic

Example: User on **Cursor Business** ($40/seat) with **2 seats** → engine recommends **Pro** ($20/seat) → savings = `currentSpend - (20 × seats)`.

Rules live in `audit.service.js` (seat thresholds, use-case switches, tool replacements). When vendor pricing changes:

1. Update this file with new URL + date
2. Update `pricingRules.js`
3. Re-run audit engine tests (`npm test` in `backend/` when added)

