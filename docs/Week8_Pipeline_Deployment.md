# Week 8: Pipeline as Code and Server Deployment

## Pipeline Details
A `Jenkinsfile` has been added to the root of the repository, defining a Declarative Pipeline.

### Stages:
1. **Checkout**: Pulls the latest code from the Source Control Management (SCM) system.
2. **Build & Package**: Runs `mvn clean package -DskipTests` to compile code and build the JAR/WAR file.
3. **Deploy**: Copies the compiled artifact to the Tomcat `webapps` directory (simulated local deployment).

## Parameterization Evidence
The Jenkins pipeline is parameterized using the `parameters` block:
- **DEPLOY_ENV**: A choice parameter allowing selection between `staging` and `production`.
- **TOMCAT_PORT**: A string parameter to define the Tomcat port (default `8080`).

These parameters are accessed in the pipeline via `${params.DEPLOY_ENV}`.

## Deployment Evidence
- **Build Status**: Success
- **Deployed Application URL**: `http://localhost:8080/traceability-portal`
- *Note*: Deployment step in Jenkinsfile executes a shell copy command moving the `.jar` to the Tomcat directory. In a real-world scenario, this can trigger an Ansible playbook.
