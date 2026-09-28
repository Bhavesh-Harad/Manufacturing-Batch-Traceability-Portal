# Week 10: Continuous Testing in Jenkins

## Jenkins Test Integration
The Selenium UI test suite has been fully integrated into the Jenkins Pipeline (`Jenkinsfile`). 

### Pipeline Configurations Added:
1. **Test Stage**: Added `sh 'mvn test'` to run the JUnit/Selenium suite automatically.
2. **Test Reporting**: Added the `junit 'target/surefire-reports/*.xml'` step in the `post { always }` block to parse and display test results graphically in Jenkins.
3. **Screenshot Archival**: Jenkins archives any failure screenshots captured by the `TestWatcher` (`target/screenshots/*.png`).
4. **Deployment Gate**: Because the `Deploy` stage comes *after* the `Test` stage, any test failure automatically halts the pipeline, preventing broken code from deploying.

## Defect Simulation & Failure Evidence
**Scenario**: The `testIntentionalFailureForScreenshot` test was deliberately designed to fail by searching for a non-existent button (`fake-button-id`).
**Pipeline Result**:
```text
[INFO] Running com.example.traceability.selenium.PortalUITest
[ERROR] Tests run: 4, Failures: 0, Errors: 1, Skipped: 0
[INFO] ------------------------------------------------------------------------
[INFO] BUILD FAILURE
[INFO] ------------------------------------------------------------------------
[Pipeline] junit
Recording test results
[Pipeline] archiveArtifacts
Archiving artifacts
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Deploy)
Stage "Deploy" skipped due to earlier failure(s)
```
*Result*: The pipeline failed. The `Deploy` stage was skipped. A screenshot was generated and attached to the Jenkins build artifacts.

## Defect Correction
**Action Taken**: The deliberate defect (the failing test `testIntentionalFailureForScreenshot`) was removed from `PortalUITest.java`. 

*Commit*: `fix(tests): Remove deliberate failure to allow pipeline deployment`

## Successful Rerun Evidence
**Scenario**: Pipeline executed again after the defect was corrected.
**Pipeline Result**:
```text
[INFO] Running com.example.traceability.selenium.PortalUITest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[Pipeline] junit
Recording test results
[Pipeline] }
[Pipeline] // stage
[Pipeline] stage
[Pipeline] { (Deploy)
[Pipeline] echo
Tests passed! Deploying to Tomcat on port 8080...
...
[Pipeline] echo
Pipeline executed successfully.
```
*Result*: All 3 critical journey tests passed. The `junit` plugin published the 100% pass rate to the Jenkins dashboard, and the `Deploy` stage executed successfully.
