# Week 9: Selenium Test Design and Local Execution

## Test Plan: Manufacturing Batch Traceability Portal

### Objective
To verify the core UI workflows of the Traceability Portal using automated browser tests via Selenium WebDriver.

### Scope
We will test three critical user journeys on the frontend UI:
1. **Create a New Batch**: Verifies the modal form submission and table update.
2. **Update Batch Status**: Verifies the status dropdown interaction and UI badge change.
3. **Search for a Batch**: Verifies the filtering mechanism using the search bar.

### Prerequisites & Setup
- **Framework**: Selenium WebDriver + JUnit 5 (Jupiter).
- **Driver Management**: WebDriverManager is used for automatic browser binary management (Chrome/Firefox/Edge).
- **Execution**: Run locally via Maven (`mvn clean test`). The application must be running (`mvn spring-boot:run`) prior to test execution on `http://localhost:8080`.

### Failure Screenshot Mechanism
The test suite implements a custom JUnit 5 `TestWatcher` (`ScreenshotOnFailureWatcher`). 
When a test fails, the watcher triggers the WebDriver to take a screenshot and saves it to `target/screenshots/` with a timestamped filename corresponding to the failed test method.

### Test Scenarios

| Test Case | Scenario | Test Data | Expected Result |
| :--- | :--- | :--- | :--- |
| `testCreateNewBatch` | Click "Create New Batch", fill form, and submit. | Product: `Selenium Test Prod`, Qty: `150` | A new row appears in the table with the entered data and 'CREATED' status. |
| `testUpdateBatchStatus` | Find a batch, click 'Update Status', select 'IN_PRODUCTION'. | Target Status: `In Production` | The status badge in the table changes to 'IN_PRODUCTION'. |
| `testSearchBatch` | Enter a keyword in the search bar and click search. | Keyword: `Selenium` | The table filters to show only the batches containing the keyword. |

### Local Test Report
Maven generates standard Surefire reports located at `target/surefire-reports/`. 
To run the suite and generate the report, execute:
```bash
mvn clean test -Dtest=PortalUITest
```
