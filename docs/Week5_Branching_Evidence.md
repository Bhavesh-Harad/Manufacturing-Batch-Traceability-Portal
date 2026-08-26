# Week 5: Feature Development with Branching

## Working Feature 1
- **Feature description**: Core workflow to create a batch.
- **Components**: `Batch` model, `BatchController` REST controller.

## Feature Branch Details
- **Branch Name**: `feature/create-batch`
- **Commands Used**:
  ```bash
  git checkout -b feature/create-batch
  git add src/
  git commit -m "Add core workflow for creating a batch"
  git push origin feature/create-batch # Simulated local
  ```

## Pull Request and Review Evidence (Simulated)
**Pull Request #1: Add core workflow for creating a batch**
- *Author*: Developer
- *Reviewer*: Tech Lead
- *Comments*: "Code looks good. Make sure to add UUID for ID generation." (Resolved in commit `a6154ba`)

## Merge Evidence
```bash
$ git checkout development
Switched to branch 'development'

$ git merge feature/create-batch
Updating 33a1162..a6154ba
Fast-forward
 .../traceability/controller/BatchController.java   | 22 ++++++++++++++++++++
 .../java/com/example/traceability/model/Batch.java | 29 ++++++++++++++++++++++++++
 2 files changed, 51 insertions(+)
 create mode 100644 src/main/java/com/example/traceability/controller/BatchController.java
 create mode 100644 src/main/java/com/example/traceability/model/Batch.java
```
