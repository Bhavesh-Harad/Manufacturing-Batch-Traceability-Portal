# Manufacturing Batch Traceability Portal

This repository contains the source code for the Manufacturing Batch Traceability Portal MVP.

## Branching Policy
- `main`: The production-ready state.
- `development`: The active development branch. All feature branches merge here.
- `feature/*`: Branches for new features, branched from `development`.
- `bugfix/*`: Branches for bug fixes.

## Commit Message Guidelines
- Use present tense ("Add feature" not "Added feature").
- Use imperative mood ("Move cursor to..." not "Moves cursor to...").
- Limit the first line to 72 characters or less.

## Getting Started
Requirements: Java 17, Maven.

1. Clone the repository.
2. Build: `mvn clean install`
3. Run: `mvn spring-boot:run`
