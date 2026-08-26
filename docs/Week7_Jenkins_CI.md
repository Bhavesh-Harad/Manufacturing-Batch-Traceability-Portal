# Week 7: Jenkins Installation and Continuous Integration Job

## Jenkins Installation & Configuration
1. **Installation**: Downloaded Jenkins (`jenkins.war`) and executed it using `java -jar jenkins.war --httpPort=8080`.
2. **Plugins Installed**: Git Plugin, Maven Integration Plugin, Pipeline Plugin.
3. **Global Tool Configuration**: Configured paths for JDK 17 and Maven 3.x in Jenkins.

## Continuous Integration Job (Freestyle Project)
**Job Name**: `TraceabilityPortal-CI-Job`

### Configuration Details
1. **Source Code Management**: 
   - Git repository URL: `https://github.com/example/TraceabilityPortal.git` (or local file path)
   - Branch Specifier: `*/development`
2. **Build Triggers**:
   - `Poll SCM` enabled with schedule: `H/5 * * * *` (Poll every 5 minutes)
   - *Alternative*: GitHub hook trigger for GITScm polling.
3. **Build Environment**:
   - "Delete workspace before build starts" checked.
4. **Build Steps**:
   - Invoke top-level Maven targets.
   - Goals: `clean package -DskipTests`
5. **Post-build Actions**:
   - **Archive the artifacts**: 
     - Files to archive: `target/*.jar`

## Build Trigger Evidence (Simulated Log)
```text
Started by timer
Running as SYSTEM
Building in workspace /var/lib/jenkins/workspace/TraceabilityPortal-CI-Job
> git fetch --tags --progress -- https://github.com/example/TraceabilityPortal.git +refs/heads/*:refs/remotes/origin/*
> git checkout -f development
[TraceabilityPortal-CI-Job] $ mvn clean package -DskipTests
[INFO] Scanning for projects...
[INFO] Building traceability-portal 0.0.1-SNAPSHOT
[INFO] --- maven-clean-plugin:3.1.0:clean (default-clean) @ traceability-portal ---
[INFO] --- maven-jar-plugin:3.2.0:jar (default-jar) @ traceability-portal ---
[INFO] Building jar: /var/lib/jenkins/workspace/TraceabilityPortal-CI-Job/target/traceability-portal-0.0.1-SNAPSHOT.jar
[INFO] BUILD SUCCESS
Archiving artifacts
Finished: SUCCESS
```
