package com.example.traceability.selenium;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.junit.jupiter.api.extension.TestWatcher;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class PortalUITest {

    private static WebDriver driver;
    private static WebDriverWait wait;
    private static final String BASE_URL = "http://localhost:8080";

    @BeforeAll
    public static void setupClass() {
        File cachedDriver = new File("C:\\Users\\Acer\\.cache\\selenium\\chromedriver\\win64\\140.0.7339.207\\chromedriver.exe");
        if (cachedDriver.exists()) {
            System.setProperty("webdriver.chrome.driver", cachedDriver.getAbsolutePath());
        } else {
            try {
                WebDriverManager.chromedriver().browserVersion("140").setup();
            } catch (Exception e) {
                WebDriverManager.chromedriver().setup();
            }
        }

        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--disable-gpu");
        options.addArguments("--remote-allow-origins=*");
        options.addArguments("--window-size=1920,1080");
        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    @AfterAll
    public static void teardownClass() {
        if (driver != null) {
            driver.quit();
        }
    }

    @BeforeEach
    public void setupTest() {
        driver.get(BASE_URL);
        // Wait until dashboard loads
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("dashboard-summary")));
    }

    @Test
    @Order(1)
    public void testCreateNewBatch() {
        // Click Create New Batch button
        WebElement createBtn = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//button[@data-bs-target='#createBatchModal']")
        ));
        createBtn.click();

        // Wait for modal to appear and fill the form
        WebElement productNameInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("productName")));
        productNameInput.sendKeys("Selenium Test Product");

        WebElement quantityInput = driver.findElement(By.id("quantity"));
        quantityInput.sendKeys("150");

        // Submit form
        WebElement saveBtn = driver.findElement(By.xpath("//button[text()='Save Batch']"));
        saveBtn.click();

        // Wait for modal to disappear and table to update
        wait.until(ExpectedConditions.invisibilityOfElementLocated(By.id("createBatchModal")));
        
        // Assert the new row is in the table
        WebElement tableBody = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("batches-tbody")));
        assertTrue(tableBody.getText().contains("Selenium Test Product"), "Product name should be in the table.");
        assertTrue(tableBody.getText().contains("150"), "Quantity should be in the table.");
        assertTrue(tableBody.getText().contains("CREATED"), "Status should be CREATED.");
    }

    @Test
    @Order(2)
    public void testSearchBatch() {
        // Use the search bar
        WebElement searchInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("searchInput")));
        searchInput.sendKeys("Selenium Test Product");

        WebElement searchBtn = driver.findElement(By.xpath("//button[contains(@onclick,'searchBatches')]"));
        searchBtn.click();

        // Wait for results
        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.id("batches-tbody"), "Selenium Test Product"));

        // Verify that only the matching result is shown (or at least it is present)
        List<WebElement> rows = driver.findElements(By.xpath("//tbody[@id='batches-tbody']/tr"));
        assertTrue(rows.size() > 0, "Search results should not be empty.");
        assertTrue(rows.get(0).getText().contains("Selenium"), "First row should match search keyword.");
    }

    @Test
    @Order(3)
    public void testUpdateBatchStatus() throws InterruptedException {
        // Reload page to clear any previous search filters
        driver.get(BASE_URL);
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("dashboard-summary")));

        // Ensure there is at least one batch
        WebElement dropdownBtn = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//tbody[@id='batches-tbody']/tr[1]//button[contains(@class,'dropdown-toggle')]")
        ));
        
        // Scroll to the button just in case
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", dropdownBtn);
        Thread.sleep(500); 
        dropdownBtn.click();

        // Wait for Bootstrap dropdown animation to complete
        Thread.sleep(1000);

        // Click 'In Production'
        WebElement inProdOption = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//tbody[@id='batches-tbody']/tr[1]//ul[contains(@class,'dropdown-menu')]//a[contains(text(),'In Production')]")
        ));
        // Use Javascript executor to click in case the animation overlays it
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", inProdOption);

        // Wait for UI to update (status badge text should change)
        wait.until(ExpectedConditions.textToBePresentInElementLocated(
                By.xpath("//tbody[@id='batches-tbody']/tr[1]//span[contains(@class, 'badge')]"), 
                "IN_PRODUCTION"
        ));

        WebElement badge = driver.findElement(By.xpath("//tbody[@id='batches-tbody']/tr[1]//span[contains(@class, 'badge')]"));
        assertTrue(badge.getText().contains("IN_PRODUCTION"), "Status badge should have updated to IN_PRODUCTION.");
    }
    
    // Screenshot mechanism on failure
    @RegisterExtension
    TestWatcher screenshotWatcher = new TestWatcher() {
        @Override
        public void testFailed(ExtensionContext context, Throwable cause) {
            System.out.println("Test failed: " + context.getDisplayName() + ". Taking screenshot...");
            File screenshot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
            try {
                Path destDir = Paths.get("target/screenshots");
                Files.createDirectories(destDir);
                String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
                Path destFile = destDir.resolve(context.getRequiredTestMethod().getName() + "_" + timestamp + ".png");
                Files.copy(screenshot.toPath(), destFile, StandardCopyOption.REPLACE_EXISTING);
                System.out.println("Screenshot saved to: " + destFile.toAbsolutePath());
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    };
}
