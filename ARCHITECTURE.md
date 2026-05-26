# System Architecture of Token Tracer

Token Tracer is a full-stack AI spend auditing platform built with a React frontend and a layered Node.js Express backend. The system analyzes AI tool subscriptions, generates optimization recommendations, stores audits and leads, and creates shareable public reports.

---

# 1. System Topology & Tier Architecture

```mermaid
graph TD

    subgraph ClientTier["Client Tier"]
        SPA["React Frontend (Vite)"]
        LS["Browser LocalStorage"]
        Share["Public Share Pages"]
    end

    subgraph ServerTier["Backend Tier"]
        Router["Express Routers"]
        Controller["Controllers"]
        Service["Business Services"]
        Repository["Repositories"]
        RateLimit["Rate Limiter"]
    end

    subgraph StorageTier["Storage"]
        DB["Supabase PostgreSQL"]
    end

    subgraph ExternalServices["External Services"]
        Gemini["Gemini API"]
        Resend["Resend Email API"]
    end

    SPA --> RateLimit
    RateLimit --> Router
    Router --> Controller
    Controller --> Service
    Service --> Repository
    Repository --> DB

    Service --> Gemini
    Service --> Resend

    SPA --> LS
    SPA --> Share
```

---

# 2. End-to-End Data Flow

The following sequence diagram shows how a user's spend inputs become a completed audit result.

```mermaid
sequenceDiagram
    autonumber

    actor User
    participant Frontend as React Frontend
    participant Backend as Express Backend
    participant AuditService as Audit Service
    participant AI as Gemini API
    participant DB as Supabase Database
    participant Email as Resend API

    User->>Frontend: Fill spend audit form

    Note over Frontend: Form state persists in LocalStorage

    Frontend->>Backend: POST /api/audit

    Backend->>AuditService: Validate and process audit

    Note over AuditService: Pricing rules calculate savings and recommendations

    AuditService->>AI: Generate personalized summary

    alt AI Success
        AI-->>AuditService: Return AI-generated summary
    else AI Failure
        AI-->>AuditService: Return fallback template summary
    end

    AuditService->>DB: Save audit + public share ID

    DB-->>AuditService: Audit stored successfully

    AuditService-->>Backend: Final audit result

    Backend-->>Frontend: JSON response

    Frontend-->>User: Display audit results page

    opt Lead Capture
        User->>Frontend: Submit email/company info

        Frontend->>Backend: POST /api/leads

        Backend->>DB: Save lead information

        Backend->>Email: Send transactional email

        Email-->>Backend: Email delivered

        Backend-->>Frontend: Success response
    end
```

---

# 3. Why I Chose This Stack

| Layer | Technology | Reason                                                                                                                                                                                                                                                                                                                  |
|---|---|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Language | JavaScript | TypeScript was strongly considered, but I chose JavaScript to move faster during MVP development and focus more on product execution, architecture, and deployment within the 7-day timeline. I am currently learning TypeScript and preferred using a stack I could debug and ship confidently under time constraints. |
| Frontend | React + Vite | React provides component-based UI development while Vite offers fast builds and an excellent developer experience.                                                                                                                                                                                                      |
| Styling | TailwindCSS | Makes responsive UI development faster without relying on large UI frameworks.                                                                                                                                                                                                                                          |
| Backend | Node.js + Express | Lightweight and flexible backend stack that is easy to structure into layered services and controllers.                                                                                                                                                                                                                 |
| Database | Supabase PostgreSQL | Provides a managed PostgreSQL database with a simple SDK and fast setup for MVP development.                                                                                                                                                                                                                            |
| AI | Gemini API | Generates personalized audit summaries quickly with low latency and affordable pricing.                                                                                                                                                                                                                                 |
| Email | Resend API | Simple transactional email API with modern developer tooling.                                                                                                                                                                                                                                                           |
| Testing | Vitest | Fast test runner with built-in mocking support and easy integration with Vite.                                                                                                                                                                                                                                          |
| Deployment | Vercel + Render | Vercel simplifies frontend deployment while Render provides easy backend hosting for Express applications.                                                                                                                                                                                                              |

---

# 4. Scaling to 10,000 Audits / Day

If Token Tracer needed to support 10,000+ audits per day, several architectural improvements would be required to improve scalability, reliability, and performance.

```mermaid
graph TD

    CDN["Cloudflare CDN / WAF"] --> API["Load Balanced API Servers"]

    API --> Redis["Redis Cache"]

    API --> Queue["RabbitMQ Job Queue"]

    Queue --> Worker1["AI Summary Worker"]
    Queue --> Worker2["Email Worker"]

    Worker1 --> Gemini["Gemini API"]
    Worker2 --> Resend["Resend API"]

    API --> Pool["Postgres Connection Pool"]

    Pool --> DB["Supabase PostgreSQL"]
```

## Planned Scaling Improvements

### 1. Background Job Queues
Currently, AI summary generation and email sending happen during the request lifecycle. At higher traffic volumes, these operations should move to asynchronous workers using RabbitMQ and Redis.

### 2. Redis Caching
Frequently accessed public audit share pages should be cached in Redis to reduce database load and improve response times.

### 3. Database Connection Pooling
A connection pooler such as PgBouncer would help manage large numbers of concurrent PostgreSQL connections efficiently.

### 4. Horizontal API Scaling
Multiple backend API instances behind a load balancer would improve reliability and throughput during traffic spikes.

### 5. CDN & Edge Security
Cloudflare would be used for:
- CDN asset delivery
- DDoS protection
- edge caching
- request filtering
- global performance improvements

### 6. Monitoring & Observability
Production-scale deployments would require:
- centralized logging
- request tracing
- uptime monitoring
- performance metrics
- error alerting