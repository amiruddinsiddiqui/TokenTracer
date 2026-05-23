## Day 1 — 2026-05-22

**Hours worked:** 2

**What I did:**  
Set up the backend architecture using Express and Supabase. Created the base folder structure with controllers, services, repositories, routes, and dependency container setup. Implemented Supabase configuration and initialized connection health checks.

**What I learned:**  
Learned how to structure a maintainable Node.js backend using layered architecture.

**Blockers / what I'm stuck on:**  
Had issues with dotenv loading correctly because Node was being run from the wrong directory.

**Plan for tomorrow:**  
Implement the audit engine and pricing recommendation logic.

## Day 2 — 2026-05-23

**Hours worked:** 3

**What I did:**  
Built the audit creation API flow including routes, controllers, services, and repositories. Implemented pricing rules and savings calculations for Cursor, ChatGPT, Claude, Gemini, and GitHub Copilot plans.

**What I learned:**  
Learned how to design the codebase using the SOLI(Dependency Inversion) principle.

**Blockers / what I'm stuck on:**  
Spent time debugging ES module export/import mismatches and Supabase configuration issues where environment variables were not loading correctly.

**Plan for tomorrow:**  
Implement more APIs flow and AI-generated summaries.

## Day 3 — 2026-05-23

**Hours worked:** 7

**What I did:**  
Implemented the audit generation, sharing, and lead capture flow. Added public shareable audit links, connected routes/controllers/services/repositories, and integrated transactional email sending using Resend. Also implemented request validation, honeypot protection, and rate limiting middleware on all endpoints.

**What I learned:**  
Learned how to connect multiple backend layers cleanly using dependency injection and understood how transactional email workflows work with Resend API integration.

**Blockers / what I'm stuck on:**  
Spent time fixing public audit UUID generation, and resolving Resend 403 authorization issues during email testing.

**Plan for tomorrow:**  
Implement AI-generated audit summaries using an LLM API, improve recommendation quality, and add fallback/error handling for AI summary generation.