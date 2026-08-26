# Week 2: Agile Planning and DevOps Workflow

## User Stories & Acceptance Criteria

**US1: Create Batch Record**
- *As a* Production Operator, *I want to* create a new batch record, *so that* it can be tracked in the system.
- *Acceptance Criteria*: Form includes Batch ID, Product Name, and Quantity. Status defaults to 'Created'. Requires Operator login.

**US2: Update Batch Status**
- *As a* QA Inspector, *I want to* update a batch's status to 'Approved' or 'Rejected', *so that* downstream processes can proceed.
- *Acceptance Criteria*: Only QA role can approve/reject. Status change is recorded with a timestamp.

**US3: Search Batches**
- *As a* Plant Manager, *I want to* search for batches by ID, *so that* I can find specific records quickly.
- *Acceptance Criteria*: Search bar available on the dashboard. Exact and partial matches supported.

**US4: Summary Dashboard**
- *As a* user, *I want to* see a dashboard of batch statuses, *so that* I get an overview of production.
- *Acceptance Criteria*: Displays total batches, and counts grouped by status (Created, In Production, QA Review, Approved, Rejected).

## Product Backlog (MVP)
1. Setup project repository and CI/CD pipeline (DevOps).
2. Develop database schema for Batches and Users.
3. Implement basic Authentication (Role-based).
4. Develop API for Create, Read, Update, Delete (CRUD) operations.
5. Develop Frontend UI for Dashboard.
6. Develop Frontend UI for Batch Creation and Status Update.

## 15-Week Kanban/Scrum Plan
- **Weeks 1-4**: Planning, Architecture, Setup, Git Initialization.
- **Weeks 5-7**: Core API Development, Database Setup (Branching & PRs).
- **Weeks 8-10**: UI Development, Role-based Access Integration.
- **Weeks 11-13**: CI/CD Implementation (Jenkins, Pipeline as Code).
- **Weeks 14-15**: Ansible Deployment, Final Testing, and MVP Release.

## Definition of Done (DoD)
- Code is peer-reviewed and merged into the `development` branch.
- Unit tests pass with >80% coverage.
- Code builds successfully on the CI server.
- Feature is deployed to the staging environment.
- Acceptance criteria are met and tested.

## DevOps Lifecycle Diagram

```mermaid
graph LR
    A[Plan (Agile/Scrum)] --> B[Code (Git/GitHub)]
    B --> C[Build (Maven)]
    C --> D[Test (JUnit)]
    D --> E[Release (Jenkins/Tag)]
    E --> F[Deploy (Ansible/Tomcat)]
    F --> G[Operate (Nginx)]
    G --> H[Monitor]
    H -. Feedback .-> A
```
