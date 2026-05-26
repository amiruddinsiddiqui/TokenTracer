## Day 1 — 2026-05-21

**Hours worked:** 2

**What I did:**  
Set up the backend architecture using Express and Supabase. Created the base folder structure with controllers, services, repositories, routes, and dependency container setup. Implemented Supabase configuration and initialized connection health checks.

**What I learned:**  
Learned how to structure a maintainable Node.js backend using layered architecture.

**Blockers / what I'm stuck on:**  
Had issues with dotenv loading correctly because Node was being run from the wrong directory.

**Plan for tomorrow:**  
Implement the audit engine and pricing recommendation logic.

## Day 2 — 2026-05-22

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


## Day 4 — 2026-05-24

**Hours worked:** 5

**What I did:**  
Implemented AI-generated audit summaries using the Gemini API and integrated them into the audit generation flow. Added automated audit engine tests using Vitest and configured a GitHub Actions CI workflow to run tests automatically on every push to main.

**What I learned:**  
Learned how to mock external API calls during unit testing and configure automated CI pipelines using GitHub Actions.

**Blockers / what I'm stuck on:**  
Spent time debugging Gemini API model mismatch and quota issues. Tested the API manually using curl to identify supported models and fixed the integration by switching to a working Gemini model configuration.

**Plan for tomorrow:**  
Start building the frontend UI, connect frontend and backend APIs, and polish the overall project structure and user experience.


## Day 5 — 2026-05-25

**Hours worked:** 6

**What I did:**  
Built the frontend UI for Token Tracer and connected it with the backend audit APIs. Added landing page sections including hero content, FAQ, social proof (mock), and deployed the frontend on Vercel and the backend on Render.

**What I learned:**  
Learned how to connect frontend forms with backend APIs, handle async audit responses, and structure frontend components for a cleaner and more maintainable UI workflow.

**Blockers / what I'm stuck on:**  
Faced issues with rendering Gemini-generated markdown responses in the frontend because raw markdown symbols like `**` appeared directly in the UI. Resolved it by improving the LLM Prompt.

**Plan for tomorrow:**
Polish the overall backend and frontend, fix remaining bugs, and create the ARCHITECTURE.md documentation with system diagrams and data flow explanations.


## Day 6 — 2026-05-26

**Hours worked:** 5

**What I did:**  
Made token tracer demo video and uploaded it on the YouTube, completed the README and ARCHITECTURE documentation files. Also tested Lighthouse mobile scores and optimized the deployed frontend.

**What I learned:**  
Learned more about deploying frontend and backend applications using Vercel and Render, along with handling CORS and production environment issues.

**Blockers / what I'm stuck on:**  
Faced issues with SPA routing on Vercel and backend deployment errors on Render. Fixed them by adding `vercel.json`, correcting imports, and configuring Express proxy settings.

**Plan for tomorrow:**  
Complete the remaining entrepreneurial documents (GTM, economics, metrics, reflection, and user interviews), do final end-to-end testing, improve overall polish, and prepare the final submission.