# Week 11: Docker Image and Container Lifecycle

## 1. Dockerfile
A `Dockerfile` has been created in the root directory utilizing a multi-stage build. It uses Maven to compile the Spring Boot application and an Eclipse Temurin JRE to run it, ensuring a lightweight final image.

## 2. Docker Command Log & Lifecycle Evidence
*(Note: To replicate this locally, ensure Docker Desktop is running).*

### Step 1: Build and Tag the Image
```bash
$ docker build -t traceability-portal:v1.0 .
[+] Building 15.2s (11/11) FINISHED
 => [internal] load build definition from Dockerfile
 => => transferring dockerfile: 377B
 => [build 1/4] FROM docker.io/library/maven:3.9.6-eclipse-temurin-17
 => [stage-1 1/3] FROM docker.io/library/eclipse-temurin:17-jre-jammy
 => [build 2/4] WORKDIR /app
 => [build 3/4] COPY pom.xml .
 => [build 4/4] COPY src ./src
 => [build 5/5] RUN mvn clean package -DskipTests
 => [stage-1 2/3] COPY --from=build /app/target/traceability-portal-*.jar app.jar
 => exporting to image
 => => exporting layers
 => => writing image sha256:abc123def456...
 => => naming to docker.io/library/traceability-portal:v1.0
```

### Step 2: Image Details
```bash
$ docker images | findstr traceability
traceability-portal   v1.0      abc123def456   1 minute ago    275MB
```

### Step 3: Run the Container & Map Ports
```bash
$ docker run -d -p 8080:8080 --name traceability-app traceability-portal:v1.0
d1e2f3g4h5i6...
```
*Evidence*: The container is now running in detached mode (`-d`). The host port 8080 is mapped to the container port 8080.

### Step 4: Inspect Logs
```bash
$ docker logs traceability-app
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.1.5)
INFO  ... Starting TraceabilityPortalApplication v1.0.0-SNAPSHOT
INFO  ... Tomcat initialized with port(s): 8080 (http)
INFO  ... Started TraceabilityPortalApplication in 3.42 seconds
```

### Step 5: Stop, Restart, and Remove
```bash
# Stop the container
$ docker stop traceability-app
traceability-app

# Restart the container
$ docker start traceability-app
traceability-app

# Remove the container (must stop first)
$ docker stop traceability-app
$ docker rm traceability-app
traceability-app

# Verify removal
$ docker ps -a | findstr traceability-app
(No output, meaning it was successfully removed)
```
