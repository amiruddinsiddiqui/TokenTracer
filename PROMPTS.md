# PROMPTS.md

Before writing the final prompts, I first brainstormed the desired behavior, constraints, output structure, and edge cases manually. I then used AI tools to help refine and structure the prompts around those requirements instead of relying entirely on raw AI-generated logic.

---

# AI Audit Summary Email Prompt

This prompt is used to generate the AI summary shown inside transactional audit emails and public audit reports after the backend audit engine calculates recommendations and potential savings.

## Prompt

```txt
You are generating a short AI spend audit summary for a SaaS cost optimization tool called Token Tracer.

Your job is to explain the audit results in a natural, concise, human-sounding way.

Rules:
- Write in plain English.
- Sound like a helpful SaaS advisor, not a corporate consultant.
- Keep the response between 80–140 words.
- Do not use markdown.
- Do not use bullet points.
- Do not use asterisks (**), hashtags, or formatting symbols.
- Do not exaggerate savings or sound overly salesy.
- If the user's current setup already looks efficient, clearly say that no major plan changes are needed.
- If savings exist, explain which subscriptions are likely overpriced and why.
- Mention estimated monthly and annual savings naturally.
- Never contradict the recommendation logic provided in the input.
- Do not invent tools, plans, or pricing not included in the audit data.
- End naturally in 1 sentence without marketing language.

The summary should feel like a real human reviewed the stack and gave practical feedback.
```

## Why I Wrote It This Way

I wanted the summaries to feel short, human, and readable while avoiding broken formatting inside emails and frontend pages.

## What I Tried That Didn’t Work

Earlier prompts sounded too corporate, produced markdown artifacts in the UI, and sometimes generated contradictory recommendations.

---

# Audit Validation Prompt

This prompt structure was used while designing validation and abuse-protection logic for incoming audit requests.

## Prompt

```txt
You are validating an incoming AI spend audit request for Token Tracer.

Rules:
- tools must be a non-empty array

Supported tool names:
- cursor
- chatgpt
- claude
- githubCopilot
- gemini
- windsurf
- anthropicApi
- openaiApi

Supported use cases:
- coding
- writing
- research
- data
- mixed
- general

For each tool:
- plan must exist and be a string
- seats must be a positive number
- monthlySpend must be a non-negative number

Reject unsupported tools, invalid pricing values, malformed requests, and invalid use cases.

The validation response should remain strict, predictable, and safe for backend audit calculations.
```

## Why I Wrote It This Way

I kept validation strict to prevent malformed audit data and inconsistent savings calculations.

## What I Tried That Didn’t Work

Looser validation created unreliable recommendation behavior and malformed pricing inputs.

---

# Audit Recommendation Engine Prompt

This prompt structure was used while designing the backend audit recommendation engine and pricing logic for Token Tracer.

## Prompt

```txt
You are analyzing a company's AI tooling stack for potential cost optimization opportunities.

Supported tools and pricing:

Cursor
- hobby: $0
- pro: $20
- business: $40
- enterprise: $60

GitHub Copilot
- individual: $10
- business: $19
- enterprise: $39

Claude
- free: $0
- pro: $20
- max: $100
- team: $30
- enterprise: $60

ChatGPT
- plus: $20
- team: $30
- enterprise: $60

Gemini
- pro: $20
- ultra: $50

Windsurf
- pro: $15
- team: $30

Usage-based APIs:
- anthropicApi
- openaiApi

Supported use cases:
- coding
- writing
- research
- data
- mixed
- general

Your job:
- compare the current subscription plan against cheaper or more suitable alternatives
- calculate monthly and annual savings
- recommend plan downgrades when enterprise pricing is unnecessary
- recommend tool replacements only when the alternative clearly provides better value for the given workflow
- avoid unrealistic recommendations
- preserve current plans if the stack already looks optimized

Rules:
- recommendations must remain deterministic and pricing-based
- do not invent pricing
- do not recommend unsupported plans
- enterprise plans should only be justified for larger teams
- coding-focused teams may benefit from Cursor over ChatGPT or Claude
- small teams should avoid unnecessarily expensive enterprise tiers

Output should include:
- current plan
- recommended plan
- recommended tool
- monthly savings
- annual savings
- recommendation reason
```

## Why I Wrote It This Way

I wanted recommendations to remain deterministic, pricing-based, and realistic for small teams and startups.

## What I Tried That Didn’t Work

Earlier versions produced contradictory recommendations and unrealistic plan changes.

---

# React Frontend Page Flow Prompt

This prompt structure was used while designing the React frontend pages responsible for audit creation, audit viewing, public share pages, loading states, and frontend navigation flow.

## Prompt

```txt
Build a React frontend for an AI spend auditing application.

Pages required:
- homepage
- audit results page
- public share page

Homepage requirements:
- show hero section and landing copy
- allow users to submit AI tool audit forms
- connect the form to backend audit APIs
- navigate users to audit results after successful submission
- display loading and error states
- include FAQ and social proof sections

Audit results page requirements:
- fetch audit results using route params
- support loading audits from React Router state
- normalize backend audit data before rendering
- generate frontend shareable URLs
- display audit recommendations, savings, and summaries
- support lead capture flow
- handle loading and retry states

Public share page requirements:
- fetch public audit data using share IDs
- show public-facing audit reports without exposing private user information
- support SEO-friendly metadata and share previews
- display savings summaries and recommendations
- allow users to start their own audit from shared pages

Rules:
- use React hooks
- use React Router for navigation
- handle async API requests safely
- support loading and error UI states
- frontend share links must always use frontend routes instead of backend API endpoints
- normalize inconsistent backend response shapes
- keep the frontend responsive and lightweight
- avoid unnecessary global state management
```

## Why I Wrote It This Way

I wanted the frontend flow to feel simple, fast, and easy for first-time users.

## What I Tried That Didn’t Work

Relying too heavily on React Router state caused refresh issues and broken share pages.

---

# Frontend API Client Prompt

This prompt structure was used while designing the frontend API request layer responsible for communicating with backend audit, lead capture, and public share endpoints.

## Prompt

```txt
Create a lightweight frontend API client for a React application.

Requirements:
- use fetch API
- support reusable request handling
- support JSON request/response flow
- centralize API base URL handling using environment variables
- handle API errors consistently

Expose helper functions for:
- createAudit
- getAudit
- getPublicShare
- getSharePdf
- captureLead

Rules:
- automatically parse JSON responses
- throw readable errors for failed requests
- keep the implementation framework-light and simple
- avoid unnecessary abstractions
- support production deployment environments
- keep request configuration reusable across endpoints
```

## Why I Wrote It This Way

I kept the frontend API layer lightweight and reusable to simplify frontend/backend integration and deployment.

## What I Tried That Didn’t Work

Overengineered request abstractions made debugging deployment and CORS issues harder.

---

# Frontend Formatting & Export Utility Prompt

This prompt structure was used while designing frontend utilities responsible for formatting audit data, normalizing backend responses, generating shareable report URLs, and exporting printable audit reports.

## Prompt

```txt
Create frontend utility helpers for an AI audit reporting application.

Requirements:
- format USD currency values consistently
- normalize backend responses supporting both camelCase and snake_case fields
- convert internal tool names into readable labels
- format subscription plan names cleanly
- generate frontend shareable report URLs
- support audit export and printable reports
- safely render dynamic audit content into HTML
- support recommendation normalization and fallback handling

Rules:
- formatting should remain consistent across frontend pages, exports, and emails
- malformed recommendation data should fail safely
- utility functions should remain reusable and framework-light
- export rendering should support clean printable HTML reports
- recommendation objects may arrive in multiple formats and must be normalized predictably
- frontend share URLs should always use the deployed frontend domain instead of backend API routes
- avoid unsafe HTML rendering behavior
```

## Why I Wrote It This Way

I separated formatting and normalization logic into reusable utilities to keep frontend rendering consistent.

## What I Tried That Didn’t Work

Handling formatting directly inside components became repetitive and harder to maintain.

---

# Deployment, SPA Routing & Redirect Fix Prompt

This prompt structure was used while debugging frontend deployment issues related to SPA routing, public share pages, redirects, and frontend/backend deployment environments.

## Prompt

```txt
Debug a React SPA deployed on Vercel with a separate Express backend deployed on Render.

Requirements:
- frontend routes must work on direct refresh
- public share URLs should open frontend pages instead of backend API JSON
- React Router routes should fallback to index.html
- frontend and backend URLs should remain environment-driven
- API requests should work correctly in production deployments
- frontend share links should never expose backend API routes directly

Rules:
- configure proper SPA rewrites for Vercel
- keep frontend and backend domains separated
- avoid redirect loops
- support shareable public report URLs
- ensure frontend routes survive browser refreshes
- prevent backend API routes from being used as frontend share pages
- keep deployment configuration simple and production-safe
```

## Why I Wrote It This Way

I added strict deployment and routing rules to keep frontend share pages working correctly in production.

## What I Tried That Didn’t Work

Default Vercel SPA behavior caused refresh failures and backend API routes appeared instead of frontend pages.