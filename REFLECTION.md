# REFLECTIONS

## 1. The hardest bug I hit this week, and how I debugged it

The hardest issues I faced this week happened after deploying the application to Vercel and Render. Locally everything worked correctly, but once deployed I started running into multiple production-only problems involving CORS, proxy configuration, rate limiting, and public share links.

The first issue appeared when frontend API requests randomly failed even though the backend was online. Initially I thought the backend routes themselves were crashing. I checked the browser network tab and noticed successful preflight requests followed by failing requests. After inspecting the Render logs more carefully, I discovered Express Rate Limit was throwing proxy-related validation errors because Render sends requests behind a proxy. The error mentioned the `X-Forwarded-For` header and incorrect proxy trust configuration.

I tested several hypotheses including broken CORS headers, incorrect environment variables, and failed backend deployments before eventually realizing the fix was enabling:

```js
app.set('trust proxy', 1)
```

inside the Express app configuration.

At the same time I also discovered another tricky issue involving public audit share links sent through email. The deployed frontend base URL was correct, but the generated route path still pointed to the backend API route:

```txt
/api/share/:id
```

instead of the frontend route:

```txt
/share/:id
```

I fixed the issue by updating the backend URL generation logic to use the frontend share route while still keeping the deployed frontend base URL.

These bugs were frustrating because every individual system appeared to work independently, but small deployment and routing inconsistencies broke the complete user experience once everything was connected together.
---

## 2. A decision I reversed mid-week, and what made me reverse it

One decision I reversed during/at the beginning of the project was using TypeScript for the full stack application. Initially I planned to build both the frontend and backend using TypeScript because it was strongly recommended in the assignment and widely used in production systems.

After starting development I realized I was spending too much time dealing with TypeScript-specific issues instead of building product functionality. Since the assignment timeline was only seven days, I decided to prioritize execution speed and shipping a working MVP over learning advanced TypeScript patterns during development.

I switched the project back to JavaScript so I could focus more on backend architecture, deployment, audit logic, testing, and user experience. I already had stronger confidence debugging and structuring applications in JavaScript, which allowed me to move much faster.

I still think TypeScript would be the better long-term choice if this project continued beyond MVP stage because of improved maintainability and type safety. However, for this timeline I believe switching back to JavaScript was the correct decision because it helped me finish a complete deployed product instead of an incomplete partially-converted codebase.

That experience made me think more practically about engineering tradeoffs instead of blindly choosing the most modern stack.

---

## 3. What I would build in week 2 if I had it

If I had another full week to continue building Token Tracer, I would focus on turning it from a simple audit tool into a more collaborative AI cost management platform.

The biggest feature I would build next is real workspace-level analytics. Instead of manually entering subscription information, teams could connect tools like OpenAI, Anthropic, Cursor, or GitHub billing APIs directly to Token Tracer. That would allow real usage tracking, historical spend analysis, and automatic recommendations over time.

I would also build benchmarking features that compare a team's AI spending against similar companies based on size and use case.

Another feature I would explore is a marketplace for unused AI subscriptions or extra team seats. A secondary marketplace for transferring or reselling unused seats could become an interesting extension of the product same as the Credex.

From a technical side I would improve scalability using Redis caching, background workers, queue systems, and better observability tooling because AI summary generation & email transaction currently happens during request handling.

I would also spend more time improving design polish and making the reports feel more premium and shareable.

---

## 4. How I used AI tools during development

I used multiple AI tools throughout the project including ChatGPT, and Cursor. I mainly used them for brainstorming architecture ideas, debugging deployment issues, improving prompts, generating documentation structure, and reviewing code organization.

One area where AI tools were especially useful was debugging deployment and configuration problems. They helped me understand issues related to CORS, Express proxy configuration, Vercel SPA routing, and environment variables much faster than manually searching documentation.

I also used AI tools while designing the audit recommendation logic and improving the natural language summaries generated for users. Early Gemini responses sometimes returned raw markdown formatting symbols like `**` directly in the UI. I refined the prompts until the generated summaries became cleaner and more readable.

At the same time there were areas where I did not fully trust AI-generated output. I avoided blindly copying pricing information, deployment configurations, and architectural claims without verifying them manually. I also manually tested generated code before integrating it into the project.

One specific mistake I caught was when the AI-generated audit summary said the user could save money by switching plans, while another backend recommendation flow simultaneously returned messages like “your current subscription is already optimal,” creating contradictory audit results that I later fixed by restructuring the backend recommendation logic.

Another issue I caught happened during the Gemini integration when the AI suggested unsupported model configurations, so I manually tested the API with curl and found a working model myself.

That experience reminded me that AI tools are extremely useful for speed and iteration, but they still require verification and engineering judgment.

---

## 5. Self-rating

### Discipline — 9.5/10
I stayed consistent throughout the week, kept pushing commits regularly, and managed to ship a deployed MVP within the assignment timeline.

### Code Quality — 8/10
The project structure is clean and modular, but there are still areas where abstraction, and testing could be improved further.

### Design Sense — 7/10
The frontend is responsive and polished enough for an MVP, although I would spend more time refining spacing, animations, and visual consistency in a longer project.

### Problem Solving — 8/10
I handled several deployment and production-related issues independently by debugging step-by-step instead of randomly changing configurations.

### Entrepreneurial Thinking — 8/10
I tried to think beyond just coding by focusing on user pain points, pricing logic, landing copy, and future product direction, but I still have more to learn about distribution and business strategy.