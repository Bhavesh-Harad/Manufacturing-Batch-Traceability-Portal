# Week 1: Problem Definition and Scope

## Problem Statement
Manufacturing facilities often struggle with tracing batches of products throughout the production lifecycle. Manual record-keeping leads to inaccuracies, compliance risks, and slow response times during audits or recalls. There is a need for an automated, real-time "Manufacturing Batch Traceability Portal" to track batch statuses, maintain quality records, and ensure regulatory compliance.

## Target Users
- **Production Operators**: To input batch data and update status during manufacturing.
- **Quality Assurance (QA) Inspectors**: To review batches, approve/reject them based on quality checks.
- **Plant Managers**: To view summary dashboards and monitor production health.

## Stakeholders
- Plant Management Team
- Quality Control Department
- IT & Infrastructure Team
- Regulatory Compliance Officers

## Existing Pain Points
- High reliance on paper-based or fragmented spreadsheet tracking.
- Difficult and time-consuming backward and forward traceability during recalls.
- Lack of real-time visibility into production bottlenecks.

## Constraints
- **Time Constraint**: A functional MVP must be delivered within 15 weeks.
- **Technology Constraint**: Must be deployable via Ansible to Tomcat/Nginx.
- **Budget**: Open-source technologies preferred (Java/Spring Boot/React or simple HTML/JS, MySQL/PostgreSQL).

## Measurable Success Criteria
- Reduction in batch lookup time during audits by 80%.
- 100% digital transition for batch record approvals.
- High availability of the portal (>99.5%).

## Approved 15-Week MVP Scope
The MVP will focus on the core workflow:
1. Create and register a new batch.
2. View and search existing batches by ID or date.
3. Update batch status (e.g., Created -> In Production -> QA Review -> Approved/Rejected).
4. Role-based access (Operator vs. QA).
5. A simple summary dashboard showing counts of batches in each state.
