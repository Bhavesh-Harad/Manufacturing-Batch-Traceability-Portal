# Week 6: MVP Completion and Git Collaboration

## Functional MVP Completion
The remaining MVP functions have been implemented in `BatchController.java`:
- View all batches (`GET /api/batches`)
- View batch by ID (`GET /api/batches/{id}`)
- Update batch status (`PUT /api/batches/{id}/status`)
- Search batches (`GET /api/batches/search`)

## Conflict Resolution Evidence
- **Scenario**: A hotfix comment was committed directly to `development` while the `feature/mvp-completion` branch also modified the same section in `BatchController.java`.
- **Merge Action**: Merging `feature/mvp-completion` into `development` resulted in a conflict.
- **Resolution**: Both the MVP feature code and the hotfix comment were kept. The conflict markers were removed, and the file was committed.

## Tagging
- **Tag Created**: `v1.0.0-MVP`
- **Command**: `git tag -a v1.0.0-MVP -m "Release v1.0.0 MVP"`
- **Source Baseline**: The codebase is now release-ready for the MVP stage on the `development` branch.

## Updated Backlog
- [x] Setup project repository and CI/CD pipeline (DevOps).
- [x] Develop database schema for Batches and Users. (Mocked in memory)
- [ ] Implement basic Authentication (Role-based).
- [x] Develop API for Create, Read, Update, Delete (CRUD) operations.
- [ ] Develop Frontend UI for Dashboard.
- [ ] Develop Frontend UI for Batch Creation and Status Update.
