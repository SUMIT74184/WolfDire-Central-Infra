# AI Assistant System Prompt & Project Roadmap

## 🎯 Role & Objective
You are an expert Full-Stack Architect specializing in multi-tenant microservices (Spring Boot), real-time distributed systems (Kafka, Redis), and modern frontend applications (React/Next.js with React Query). 
Your objective is to execute the following tasks sequentially. Do not jump ahead. Always ensure the backend configuration perfectly matches the frontend requirements provided to you.

---

## 📋 Task Backlog

### Phase 1: Architecture, Gap Analysis & Gateway Fixes
- [ ] **API Gateway Audit:** Debug and resolve current routing and configuration issues in the API Gateway.
- [ ] **Gap Analysis (Frontend to Backend):** Analyze the frontend codebase. Identify any missing backend endpoints, data contracts, or configurations required to support the frontend UI. Document this in an `analysis.md` file.
- [ ] **Gap Analysis (Backend to Frontend):** Analyze the backend codebase. Identify any missing frontend UI components, state management, or API calls needed to consume existing backend services. Add this to `analysis.md`.
- [ ] **Architecture Diagrams:** Generate a clear text-based architecture and data flow diagram in the `analysis.md` file illustrating the microservices topology.




### Phase 2: Infrastructure & Persistence
- [ ] **Database Persistence Check:** Audit all microservice databases (PostgreSQL/MySQL/Mongo). Ensure data is persistent across container restarts (e.g., Docker volumes are correctly mapped). Fix any ephemeral data setups.
- [ ] **Redis Configuration:** Configure Redis across the stack for two primary use cases:
  - Global caching layer for high-read data.
  - Centralized session management.
- [ ] **Docker Compose Optimization:** Review and optimize the `docker-compose.yml` file. Ensure all services are correctly configured and can be started with a single command.
- [ ] **Database Initialization:** Ensure all databases are initialized with the correct schema and sample data.
-[ ]  **Checkout all Dockerfile:** Ensure all the Dockerfiles are lightweight as there are 6 services so ensure that the image size is less than 200MB. example -xms256m -xmx128m



### Phase 3: Core Security & Auth Service
- [ ] **Auth Service Validation:** Ensure the Auth microservice is correctly configured for a social media platform context.
- [ ] **CORS Configuration:** Configure global CORS rules (ideally at the API Gateway level) to allow seamless frontend communication without preflight errors.
- [ ] **Frontend-Auth Wiring:** Connect the frontend authentication flow (Login/Register/Social OAuth) to the Auth service. Ensure tokens/sessions are securely handled.

### Phase 3.5: Admin Panel & Role-Based Access Control (RBAC)
- [ ] **Backend Admin Middleware:** Update the Auth Service registration logic to automatically detect admin emails (using a specific prefix/domain regex) and assign a `ROLE_ADMIN` authority in the database and JWT payload.
- [ ] **Frontend Route Guards:** Implement a Higher-Order Component or Route Guard in the React application to protect `/admin/*` routes, parsing the JWT to ensure only `ROLE_ADMIN` users can render the admin dashboard.
- [ ] **Admin Dashboard UI:** Scaffold the isolated admin frontend panel.

### Phase 4: Inter-Service Communication (Synchronous & Asynchronous)
- [ ] **Synchronous Communication:** Implement `OpenFeign` for direct, blocking, service-to-service calls where immediate responses are required.
- [ ] **Asynchronous Communication:** Implement `Apache Kafka` for event-driven, non-blocking communication between services (e.g., user creation events, analytics logging).

### Phase 5: Feature-Specific Implementations
- [ ] **Comments System (Threaded & Paginated):** Implement the backend logic and frontend UI for threaded comments. Enforce strict pagination rules: load 50 to 100 comments per page, with a "load next 50" mechanism.
- [ ] **Notification Service Wiring:** Connect the standalone Notification Service to both the backend (event triggers via Kafka) and the frontend (UI display/polling or WebSockets).
- [ ] **Analytics Service Integration:** Wire the Analytics microservice to the frontend. Ensure analytics data is accessible within the User Profile and Application Settings pages.
checkout the admin panel too for this too

- [ ] **AI Moderation Service (STANDBY):** The custom LLM for moderation is currently in development. Acknowledge existing controllers, but hold off on deep implementation until the custom model is ready.

### Phase 6: Frontend State & Data Fetching
- [ ] **React Query Implementation:** Replace or refactor frontend data fetching to use React Query (`@tanstack/react-query`). Ensure robust caching, background fetching, and state management for all API calls to the microservices.