// ── Module D: E2E Integration — Full Test Pyramid (Modules 0-2) ──
// Modules 3-4 added by e2e-curriculum-advanced.js

const E2E_CURRICULUM = [

  // MODULE 0 — Introduction
  // ═══════════════════════════════════════════════════════════
  {
    id: 'e2e-module-0',
    title: 'Welcome to E2E Integration',
    icon: '🔗',
    lessons: [
      {
        id: 'e2e-l0',
        title: 'The Test Pyramid — Why E2E Integration Matters',
        type: 'lesson',
        duration: '20 min',
        whatYoullLearn: [
          'What the test pyramid is and why it guides modern test strategy',
          'The difference between unit, integration, and E2E tests',
          'How Selenium, REST Assured, and Playwright work together',
          'What you will build in this course — a full test pyramid project',
          'When to use API tests vs UI tests vs hybrid tests'
        ],
        content: `
## 🔗 The Test Pyramid — Why E2E Integration Matters

You now know how to test with three powerful tools:
- **Selenium** — browser UI automation in Java
- **REST Assured** — API test automation in Java
- **Playwright** — modern browser automation in JavaScript

The final skill is knowing how to **combine them** into a single, professional test suite that covers every layer of your application.

---

### 🔺 The Test Pyramid

\`\`\`
         ▲
        /E2E\\         ← Few, slow, expensive — test full user journeys
       /─────\\
      /Integr.\\      ← API + service layer tests — fast, reliable
     /─────────\\
    /   Unit    \\    ← Many, fast, cheap — individual function tests
   /─────────────\\
\`\`\`

**The pyramid tells you where to invest test effort:**

| Layer | Count | Speed | Confidence | Tools |
|---|---|---|---|---|
| Unit | Many (100s) | Milliseconds | Low (mocked deps) | JUnit, Jest |
| Integration / API | Medium (50-100) | Seconds | High (real HTTP) | REST Assured, Newman |
| E2E / UI | Few (10-30) | Minutes | Highest (real browser) | Selenium, Playwright |

---

### 🤔 Why Combine Them?

Consider a hotel booking web app:

**Pure UI test (fragile):**
\`\`\`
1. Open browser → click "New Booking" → fill 12 form fields → submit → assert confirmation page
\`\`\`
Problems: slow (each step is a UI click), fragile (any layout change breaks it), hard to set up test data.

**Hybrid approach (robust):**
\`\`\`
1. POST /booking via REST Assured → get bookingId (< 1 second)
2. Open browser → navigate to /booking/{bookingId} → assert the details page shows correctly
\`\`\`
Result: half the UI steps, rock-solid test data, 3× faster.

---

### 🏗️ What You Will Build

By the end of this course you will have a **complete Maven project** containing:

\`\`\`
restful-booker-e2e/
├── pom.xml                          ← Parent: shared dependencies
├── api-module/                      ← REST Assured tests (no browser)
│   └── src/test/java/
│       ├── base/ApiBaseTest.java
│       └── tests/
├── ui-module/                       ← Selenium tests (browser only)
│   └── src/test/java/
│       ├── base/UiBaseTest.java
│       ├── pages/
│       └── tests/
└── e2e-module/                      ← Hybrid integration tests
    └── src/test/java/
        ├── base/E2EBaseTest.java
        └── tests/
            ├── ApiSetupUiVerifyTest.java
            ├── UiActionApiAssertTest.java
            └── DataDrivenE2ETest.java
\`\`\`

With:
- **ThreadLocal WebDriver** — safe for parallel execution
- **Allure Reports** — beautiful dashboards covering all layers
- **Docker** — reproducible Selenium Grid environment
- **GitHub Actions** — CI pipeline running the full pyramid

---

### 📋 Tools Introduced in This Course

| Tool | Purpose | Already Seen? |
|---|---|---|
| Maven Multi-Module | Organise API + UI + E2E as separate modules | No |
| WebDriverManager | Automatic driver binary management | Maybe |
| ThreadLocal\<WebDriver\> | Thread-safe driver for parallel tests | No |
| Allure + Selenium listener | Screenshots attached to failed tests | Partial |
| Docker Compose | Spin up Selenium Grid in one command | No |
| GitHub Actions matrix | Test on Chrome + Firefox in parallel | No |
`,
        exercise: {
          title: 'Map Your Application\'s Test Pyramid',
          task: `Think of a web application you have tested (or want to test).

Draw its test pyramid on paper or in a diagram tool (draw.io, Excalidraw, etc.):
1. Bottom layer: List 5 unit tests it should have (individual functions)
2. Middle layer: List 5 API/integration tests (endpoint + service layer)
3. Top layer: List 3 E2E tests (full user journeys through the browser)

For the E2E layer, identify which steps could be replaced with API calls to make the test faster.

Share your diagram in the AI chat and ask: "Does my test pyramid look right?"`,
          hints: [
            'The pyramid base (unit tests) should be the widest — most tests',
            'For E2E tests, ask: does this step NEED the UI, or could I do it via API?',
            'A good E2E test has ≤ 5 UI interactions — everything else is API'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'According to the test pyramid, which type of test should you have the MOST of?',
            options: [
              'E2E / UI tests — they test the full user journey',
              'Integration / API tests — they test real HTTP calls',
              'Unit tests — they are fast, cheap and test individual functions',
              'All three should have equal numbers'
            ],
            answer: 2
          },
          {
            type: 'truefalse',
            q: 'In a hybrid E2E test, creating test data via the API instead of through the UI makes tests faster and less fragile.',
            answer: true
          },
          {
            type: 'mcq',
            q: 'Why are UI / E2E tests placed at the TOP (small section) of the test pyramid?',
            options: [
              'They are the most important so they get the top position',
              'They are slow and expensive — you should have fewer of them',
              'They require less code to write',
              'They are only used for frontend applications'
            ],
            answer: 1
          },
          {
            type: 'fillin',
            q: 'The pattern where you create test data via the API and then verify the result in the browser UI is called the _______ pattern.',
            answer: 'API Setup → UI Verify'
          }
        ]
      }
    ]
  },

  // MODULE 1 — Project Foundation
  // ═══════════════════════════════════════════════════════════
  {
    id: 'e2e-module-1',
    title: 'Project Foundation',
    icon: '🏗️',
    lessons: [
      {
        id: 'e2e-l1',
        title: 'Maven Multi-Module Project Setup',
        type: 'lesson',
        duration: '35 min',
        whatYoullLearn: [
          'What a Maven multi-module project is and when to use one',
          'Create a parent pom.xml with shared dependency management',
          'Add api-module, ui-module, and e2e-module as child modules',
          'Run tests for a specific module only',
          'Share common utilities across all modules'
        ],
        content: `
## 🏗️ Maven Multi-Module Project Setup

A **multi-module Maven project** organises your API tests, UI tests, and E2E tests into separate modules that share a common parent configuration. This prevents dependency duplication and lets you run only the tests you need.

---

### 📁 Project Structure

\`\`\`
restful-booker-e2e/
├── pom.xml              ← Parent POM (packaging: pom)
├── common/              ← Shared utilities (test data, config)
│   └── pom.xml
├── api-module/          ← REST Assured tests
│   └── pom.xml
├── ui-module/           ← Selenium WebDriver tests
│   └── pom.xml
└── e2e-module/          ← Hybrid integration tests
    └── pom.xml
\`\`\`

---

### 📄 Parent pom.xml

\`\`\`xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">

  <modelVersion>4.0.0</modelVersion>
  <groupId>com.automationlabs</groupId>
  <artifactId>restful-booker-e2e</artifactId>
  <version>1.0.0</version>
  <packaging>pom</packaging>

  <!-- List all child modules -->
  <modules>
    <module>common</module>
    <module>api-module</module>
    <module>ui-module</module>
    <module>e2e-module</module>
  </modules>

  <!-- Shared properties -->
  <properties>
    <maven.compiler.source>21</maven.compiler.source>
    <maven.compiler.target>21</maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <testng.version>7.9.0</testng.version>
    <rest-assured.version>5.4.0</rest-assured.version>
    <selenium.version>4.21.0</selenium.version>
    <allure.version>2.27.0</allure.version>
    <webdrivermanager.version>5.8.0</webdrivermanager.version>
    <jackson.version>2.17.0</jackson.version>
  </properties>

  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>org.testng</groupId>
        <artifactId>testng</artifactId>
        <version>\${testng.version}</version>
        <scope>test</scope>
      </dependency>
      <dependency>
        <groupId>io.rest-assured</groupId>
        <artifactId>rest-assured</artifactId>
        <version>\${rest-assured.version}</version>
        <scope>test</scope>
      </dependency>
      <dependency>
        <groupId>org.seleniumhq.selenium</groupId>
        <artifactId>selenium-java</artifactId>
        <version>\${selenium.version}</version>
      </dependency>
      <dependency>
        <groupId>io.github.bonigarcia</groupId>
        <artifactId>webdrivermanager</artifactId>
        <version>\${webdrivermanager.version}</version>
      </dependency>
      <dependency>
        <groupId>io.qameta.allure</groupId>
        <artifactId>allure-testng</artifactId>
        <version>\${allure.version}</version>
        <scope>test</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>

  <build>
    <pluginManagement>
      <plugins>
        <plugin>
          <groupId>org.apache.maven.plugins</groupId>
          <artifactId>maven-surefire-plugin</artifactId>
          <version>3.2.5</version>
          <configuration>
            <suiteXmlFiles>
              <suiteXmlFile>testng.xml</suiteXmlFile>
            </suiteXmlFiles>
          </configuration>
        </plugin>
        <plugin>
          <groupId>io.qameta.allure</groupId>
          <artifactId>allure-maven</artifactId>
          <version>2.12.0</version>
        </plugin>
      </plugins>
    </pluginManagement>
  </build>

</project>
\`\`\`

---

### 📄 api-module/pom.xml

\`\`\`xml
<project>
  <parent>
    <groupId>com.automationlabs</groupId>
    <artifactId>restful-booker-e2e</artifactId>
    <version>1.0.0</version>
  </parent>
  <artifactId>api-module</artifactId>

  <dependencies>
    <dependency>
      <groupId>org.testng</groupId>
      <artifactId>testng</artifactId>
    </dependency>
    <dependency>
      <groupId>io.rest-assured</groupId>
      <artifactId>rest-assured</artifactId>
    </dependency>
    <dependency>
      <groupId>io.qameta.allure</groupId>
      <artifactId>allure-testng</artifactId>
    </dependency>
    <dependency>
      <groupId>com.automationlabs</groupId>
      <artifactId>common</artifactId>
      <version>\${project.version}</version>
    </dependency>
  </dependencies>
</project>
\`\`\`

---

### ▶️ Running Specific Modules

\`\`\`bash
# Run ALL modules
mvn clean test

# Run only API tests
mvn clean test -pl api-module

# Run only UI tests
mvn clean test -pl ui-module

# Run API + E2E but skip UI
mvn clean test -pl api-module,e2e-module

# Skip tests in one module
mvn clean test -pl '!ui-module'
\`\`\`

---

### 📦 common/pom.xml — Shared Utilities

\`\`\`xml
<project>
  <parent>...</parent>
  <artifactId>common</artifactId>
  <packaging>jar</packaging>

  <dependencies>
    <dependency>
      <groupId>com.fasterxml.jackson.core</groupId>
      <artifactId>jackson-databind</artifactId>
      <version>\${jackson.version}</version>
    </dependency>
  </dependencies>
</project>
\`\`\`

\`\`\`java
// common/src/main/java/utils/ConfigReader.java
public class ConfigReader {
    private static final Properties props = new Properties();
    static {
        try (InputStream is = ConfigReader.class
                .getResourceAsStream("/config.properties")) {
            props.load(is);
        } catch (Exception e) { throw new RuntimeException(e); }
    }
    public static String get(String key) {
        return System.getProperty(key, props.getProperty(key, ""));
    }
    public static String getBaseUrl() { return get("base.url"); }
    public static String getBrowser()  { return get("browser"); }
}
\`\`\`

\`\`\`properties
# common/src/main/resources/config.properties
base.url=https://restful-booker.herokuapp.com
browser=chrome
implicit.wait=10
\`\`\`
`,
        exercise: {
          title: 'Create the Multi-Module Maven Project',
          task: `Create the full multi-module structure in IntelliJ:

1. New Project → Maven → groupId: com.automationlabs, artifactId: restful-booker-e2e
2. Change packaging in pom.xml to "pom"
3. Create 4 sub-modules: common, api-module, ui-module, e2e-module
4. Set up the parent pom.xml with dependencyManagement as shown
5. Add the parent reference to each child pom.xml
6. Create ConfigReader.java and config.properties in the common module
7. Run "mvn clean install -DskipTests" from the root to verify everything compiles

Screenshot the Maven panel in IntelliJ showing all 4 modules.`,
          hints: [
            'When IntelliJ creates a sub-module, it automatically adds it to the parent pom.xml <modules> section',
            'The common module needs <packaging>jar</packaging> — the parent has <packaging>pom</packaging>',
            'Run mvn clean install -DskipTests (not just test) to install common into your local Maven repository so other modules can depend on it'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'In a Maven multi-module project, where do you define dependency VERSIONS to avoid repeating them in each child module?',
            options: [
              'In each child pom.xml <dependencies> section',
              'In the parent pom.xml <dependencyManagement> section',
              'In a separate versions.xml file',
              'In the Maven settings.xml'
            ],
            answer: 1
          },
          {
            type: 'mcq',
            q: 'Which Maven command runs tests in only the api-module?',
            options: [
              'mvn test --module api-module',
              'mvn test -pl api-module',
              'mvn test -m api-module',
              'mvn test -only api-module'
            ],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'The parent POM in a multi-module project must have <packaging>pom</packaging> (not jar or war).',
            answer: true
          },
          {
            type: 'fillin',
            q: 'In the parent pom.xml, you list child modules inside the _______ XML element.',
            answer: '<modules>'
          }
        ]
      },

      {
        id: 'e2e-l2',
        title: 'ThreadLocal WebDriver — Safe Parallel Test Execution',
        type: 'lesson',
        duration: '35 min',
        whatYoullLearn: [
          'Why static WebDriver fields break parallel tests',
          'What ThreadLocal is and how it solves the parallel problem',
          'Implement a DriverManager class using ThreadLocal<WebDriver>',
          'Integrate WebDriverManager for automatic driver binary management',
          'Write a BaseTest that safely creates and tears down drivers'
        ],
        content: `
## 🧵 ThreadLocal WebDriver — Safe Parallel Test Execution

The most common mistake in Selenium projects is using a **static WebDriver**:

\`\`\`java
// ❌ BROKEN for parallel execution
public class BaseTest {
    protected static WebDriver driver;  // shared across ALL threads!
}
\`\`\`

When two tests run in parallel, they both write to and read from the same \`driver\` variable. Test 1 might navigate to login while Test 2 is still checking the homepage — total chaos.

**ThreadLocal** gives each thread its own private copy of a variable.

---

### 🧵 ThreadLocal Explained

\`\`\`java
ThreadLocal<WebDriver> = a locker room.
Each thread gets its own locker (WebDriver).
Thread 1 and Thread 2 never see each other's lockers.
\`\`\`

---

### 🏗️ DriverManager Class

\`\`\`java
// ui-module/src/main/java/driver/DriverManager.java
package driver;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import utils.ConfigReader;

public class DriverManager {

    private static final ThreadLocal<WebDriver> DRIVER = new ThreadLocal<>();

    public static void create() {
        String browser = ConfigReader.getBrowser().toLowerCase();
        WebDriver driver;

        switch (browser) {
            case "firefox" -> {
                WebDriverManager.firefoxdriver().setup();
                FirefoxOptions opts = new FirefoxOptions();
                opts.addArguments("--headless");
                driver = new FirefoxDriver(opts);
            }
            default -> {
                WebDriverManager.chromedriver().setup();
                ChromeOptions opts = new ChromeOptions();
                opts.addArguments("--headless", "--no-sandbox",
                                  "--disable-dev-shm-usage", "--window-size=1920,1080");
                driver = new ChromeDriver(opts);
            }
        }

        driver.manage().timeouts()
              .implicitlyWait(java.time.Duration.ofSeconds(10));

        DRIVER.set(driver);
    }

    public static WebDriver getDriver() {
        WebDriver d = DRIVER.get();
        if (d == null) throw new IllegalStateException(
            "Driver not initialised for thread: " + Thread.currentThread().getName());
        return d;
    }

    public static void quit() {
        WebDriver d = DRIVER.get();
        if (d != null) {
            try { d.quit(); } finally { DRIVER.remove(); }
        }
    }
}
\`\`\`

---

### 🏗️ UiBaseTest

\`\`\`java
// ui-module/src/test/java/base/UiBaseTest.java
package base;

import driver.DriverManager;
import io.qameta.allure.Allure;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.testng.ITestResult;
import org.testng.annotations.*;

public class UiBaseTest {

    @BeforeMethod
    public void setUp() {
        DriverManager.create();
    }

    @AfterMethod
    public void tearDown(ITestResult result) {
        if (result.getStatus() == ITestResult.FAILURE) {
            byte[] screenshot = ((TakesScreenshot) DriverManager.getDriver())
                .getScreenshotAs(OutputType.BYTES);
            Allure.getLifecycle().addAttachment(
                "Screenshot on failure", "image/png", "png", screenshot);
        }
        DriverManager.quit();
    }

    protected org.openqa.selenium.WebDriver getDriver() {
        return DriverManager.getDriver();
    }
}
\`\`\`

---

### ▶️ Using the Driver in a Test

\`\`\`java
public class HomePageTest extends UiBaseTest {

    @Test
    public void pageTitleIsCorrect() {
        getDriver().get("https://the-internet.herokuapp.com");
        String title = getDriver().getTitle();
        Assert.assertEquals(title, "The Internet");
    }

    @Test
    public void loginPageLoads() {
        getDriver().get("https://the-internet.herokuapp.com/login");
        Assert.assertTrue(
            getDriver().findElement(By.id("username")).isDisplayed());
    }
}
\`\`\`

---

### ⚙️ testng.xml for Parallel

\`\`\`xml
<suite name="UI Tests" parallel="methods" thread-count="3">
  <test name="Booking UI Tests">
    <classes>
      <class name="tests.HomePageTest"/>
      <class name="tests.BookingPageTest"/>
    </classes>
  </test>
</suite>
\`\`\`
`,
        exercise: {
          title: 'Implement ThreadLocal WebDriver with Parallel Tests',
          task: `In your ui-module:

1. Add WebDriverManager dependency to pom.xml
2. Create DriverManager.java exactly as shown
3. Create UiBaseTest.java extending it
4. Write 3 simple test methods across 2 test classes
5. Configure testng.xml with parallel="methods" thread-count="3"
6. Run and confirm 3 Chrome windows open simultaneously
7. Screenshot the terminal showing "3 tests passed" in parallel mode`,
          hints: [
            'If you see "Chrome not found", add opts.setBinary("/path/to/chrome") or install Chrome system-wide',
            'parallel="methods" runs each @Test method in its own thread — needs ThreadLocal',
            'DRIVER.remove() in quit() is critical — without it, the ThreadLocal leaks memory on long test runs'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'Why does a static WebDriver field break when tests run in parallel?',
            options: [
              'Selenium does not support static fields',
              'Multiple threads share the same WebDriver instance and overwrite each other\'s state',
              'Static fields cannot hold browser instances',
              'Parallel execution requires Chrome, not Firefox'
            ],
            answer: 1
          },
          {
            type: 'mcq',
            q: 'What does DRIVER.remove() do in the DriverManager.quit() method?',
            options: [
              'Closes the browser tab',
              'Uninstalls the WebDriver binary',
              'Removes the WebDriver from the current thread\'s ThreadLocal slot, preventing memory leaks',
              'Clears browser cookies and cache'
            ],
            answer: 2
          },
          {
            type: 'truefalse',
            q: 'WebDriverManager.chromedriver().setup() automatically downloads the correct ChromeDriver version matching your installed Chrome.',
            answer: true
          },
          {
            type: 'fillin',
            q: 'To store a value per-thread in Java, you use the _______ class from the java.lang package.',
            answer: 'ThreadLocal'
          }
        ]
      },

      {
        id: 'e2e-l3',
        title: 'REST Assured + Selenium in One Project — Shared Infrastructure',
        type: 'lesson',
        duration: '30 min',
        whatYoullLearn: [
          'Set up the e2e-module with both REST Assured and Selenium dependencies',
          'Create E2EBaseTest that provides both API and UI capabilities',
          'Build an APIClient helper for reusable REST Assured calls',
          'Build a UIClient helper for reusable Selenium page interactions',
          'Understand how to share test state between the API and UI layers'
        ],
        content: `
## 🔗 REST Assured + Selenium in One Project

The e2e-module is where the magic happens — it combines your API testing skills with your UI testing skills in a single test class.

---

### 📄 e2e-module/pom.xml

\`\`\`xml
<project>
  <parent>
    <groupId>com.automationlabs</groupId>
    <artifactId>restful-booker-e2e</artifactId>
    <version>1.0.0</version>
  </parent>
  <artifactId>e2e-module</artifactId>

  <dependencies>
    <dependency>
      <groupId>io.rest-assured</groupId>
      <artifactId>rest-assured</artifactId>
    </dependency>
    <dependency>
      <groupId>org.seleniumhq.selenium</groupId>
      <artifactId>selenium-java</artifactId>
    </dependency>
    <dependency>
      <groupId>io.github.bonigarcia</groupId>
      <artifactId>webdrivermanager</artifactId>
    </dependency>
    <dependency>
      <groupId>org.testng</groupId>
      <artifactId>testng</artifactId>
    </dependency>
    <dependency>
      <groupId>io.qameta.allure</groupId>
      <artifactId>allure-testng</artifactId>
    </dependency>
    <dependency>
      <groupId>io.qameta.allure</groupId>
      <artifactId>allure-rest-assured</artifactId>
      <version>2.27.0</version>
    </dependency>
    <dependency>
      <groupId>com.automationlabs</groupId>
      <artifactId>common</artifactId>
      <version>\${project.version}</version>
    </dependency>
  </dependencies>
</project>
\`\`\`

---

### 🏗️ APIClient Helper

\`\`\`java
// e2e-module/src/test/java/clients/APIClient.java
package clients;

import io.restassured.RestAssured;
import io.restassured.response.Response;
import utils.ConfigReader;
import java.util.HashMap;
import java.util.Map;
import static io.restassured.RestAssured.*;

public class APIClient {

    private final String baseUrl;
    private String token;

    public APIClient() {
        this.baseUrl = ConfigReader.getBaseUrl();
        RestAssured.baseURI = baseUrl;
    }

    public String authenticate(String username, String password) {
        token = given()
                    .header("Content-Type", "application/json")
                    .body("{ \\"username\\": \\"" + username + "\\", \\"password\\": \\"" + password + "\\" }")
                .when()
                    .post("/auth")
                .then()
                    .statusCode(200)
                    .extract().path("token");
        return token;
    }

    public int createBooking(String firstName, String lastName,
                              int price, String checkin, String checkout) {
        Map<String, Object> dates = new HashMap<>();
        dates.put("checkin",  checkin);
        dates.put("checkout", checkout);

        Map<String, Object> body = new HashMap<>();
        body.put("firstname",    firstName);
        body.put("lastname",     lastName);
        body.put("totalprice",   price);
        body.put("depositpaid",  true);
        body.put("bookingdates", dates);

        return given()
                   .header("Content-Type", "application/json")
                   .body(body)
               .when()
                   .post("/booking")
               .then()
                   .statusCode(200)
                   .extract().path("bookingid");
    }

    public Response getBooking(int bookingId) {
        return given()
                   .header("Accept", "application/json")
               .when()
                   .get("/booking/" + bookingId);
    }

    public void deleteBooking(int bookingId) {
        given()
            .header("Cookie", "token=" + token)
        .when()
            .delete("/booking/" + bookingId)
        .then()
            .statusCode(201);
    }
}
\`\`\`

---

### 🏗️ E2EBaseTest

\`\`\`java
// e2e-module/src/test/java/base/E2EBaseTest.java
package base;

import clients.APIClient;
import driver.DriverManager;
import io.qameta.allure.Allure;
import io.qameta.allure.restassured.AllureRestAssured;
import io.restassured.RestAssured;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.testng.ITestResult;
import org.testng.annotations.*;

public class E2EBaseTest {

    protected APIClient api;

    @BeforeClass
    public void setUpClass() {
        api = new APIClient();
        api.authenticate("admin", "password123");
        RestAssured.filters(new AllureRestAssured());
    }

    @BeforeMethod
    public void setUpBrowser() {
        DriverManager.create();
    }

    @AfterMethod
    public void tearDownBrowser(ITestResult result) {
        if (result.getStatus() == ITestResult.FAILURE) {
            byte[] screenshot = ((TakesScreenshot) DriverManager.getDriver())
                .getScreenshotAs(OutputType.BYTES);
            Allure.getLifecycle().addAttachment(
                "Failure screenshot", "image/png", "png", screenshot);
        }
        DriverManager.quit();
    }

    protected org.openqa.selenium.WebDriver getDriver() {
        return DriverManager.getDriver();
    }
}
\`\`\`

---

### 🔑 Key Design Principles

| Principle | Why |
|---|---|
| APIClient is a class, not static methods | Allows one instance per test class, holding the auth token |
| DriverManager uses ThreadLocal | Safe for parallel execution |
| Screenshots in @AfterMethod | Always captured on failure, never on success |
| AllureRestAssured filter in @BeforeClass | All API calls logged once, for the whole class |
| @BeforeClass for API auth, @BeforeMethod for driver | Auth is expensive (1 HTTP call); driver is cheap to create per test |
`,
        exercise: {
          title: 'Wire Up E2EBaseTest and Verify Both Layers Work',
          task: `In your e2e-module:

1. Create APIClient.java with: authenticate(), createBooking(), getBooking(), deleteBooking()
2. Create E2EBaseTest.java with both @BeforeClass (API) and @BeforeMethod (driver) lifecycle
3. Write a single smoke test "E2ESmokeTest.java" with one @Test method that:
   a. Creates a booking via api.createBooking()
   b. Calls api.getBooking(id) and asserts status 200
   c. Navigates to "https://restful-booker.herokuapp.com" via getDriver()
   d. Asserts the page title is "Restful-booker"
   e. Calls api.deleteBooking(id) in @AfterMethod cleanup

4. Run mvn test -pl e2e-module and screenshot the green result`,
          hints: [
            'The Restful-Booker homepage title is "Restful-booker" — capital R, lowercase b',
            'Store the bookingId as a class-level field (int bookingId;) so @AfterMethod can access it for cleanup',
            'If you get "Connection refused" on the UI step, use https://the-internet.herokuapp.com for the browser step'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'Why is APIClient instantiated in @BeforeClass rather than @BeforeMethod?',
            options: [
              'REST Assured only allows one instance per JVM',
              'API auth is an HTTP call — doing it once per class is faster than once per test',
              '@BeforeMethod cannot access instance fields',
              'APIClient is a singleton that cannot be instantiated multiple times'
            ],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'In E2EBaseTest, @BeforeMethod creates a new WebDriver for EACH test method, while @BeforeClass runs only once for the whole class.',
            answer: true
          },
          {
            type: 'mcq',
            q: 'What is the purpose of the AllureRestAssured filter added in @BeforeClass?',
            options: [
              'It filters out failed API calls from the results',
              'It automatically logs every REST Assured request and response as an attachment in the Allure report',
              'It retries failed API calls up to 3 times',
              'It converts JSON responses to Java objects automatically'
            ],
            answer: 1
          },
          {
            type: 'fillin',
            q: 'In E2EBaseTest, the _______ annotation method creates the WebDriver for each test, and the _______ annotation method quits it.',
            answer: '@BeforeMethod / @AfterMethod'
          }
        ]
      }
    ]
  },

  // MODULE 2 — Hybrid Test Patterns
  // ═══════════════════════════════════════════════════════════
  {
    id: 'e2e-module-2',
    title: 'Hybrid Test Patterns',
    icon: '🔄',
    lessons: [
      {
        id: 'e2e-l4',
        title: 'API Setup → UI Verification Pattern',
        type: 'lesson',
        duration: '35 min',
        whatYoullLearn: [
          'What the "API Setup → UI Verify" pattern is and when to use it',
          'Create test data via REST Assured in milliseconds instead of clicking through UI forms',
          'Navigate to the resulting UI page and assert the data appears correctly',
          'Build a Page Object for the UI verification step',
          'Clean up test data via API in @AfterMethod'
        ],
        content: `
## ⚡ API Setup → UI Verification Pattern

**The problem with UI-only test setup:**

\`\`\`
1. Click "New Booking" button              ← 500ms
2. Fill "First Name" field                 ← 200ms
3. Fill "Last Name" field                  ← 200ms
4. Select check-in date from calendar      ← 1500ms (slow, flaky)
5. Select check-out date from calendar     ← 1500ms
6. Enter price                             ← 200ms
7. Click "Save"                            ← 800ms
                                    Total: ~5 seconds just to SET UP
\`\`\`

**API Setup instead:**

\`\`\`java
int bookingId = api.createBooking("Alice", "Smith", 250, "2026-06-01", "2026-06-07");
                                    // Total: ~300ms
\`\`\`

---

### 📐 Page Object for the Verification Step

\`\`\`java
// e2e-module/src/test/java/pages/BookingDetailPage.java
package pages;

import driver.DriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;

public class BookingDetailPage {

    private final WebDriver driver;
    private final WebDriverWait wait;

    private final By firstNameField = By.id("firstname");
    private final By lastNameField  = By.id("lastname");
    private final By priceField     = By.id("totalprice");

    public BookingDetailPage() {
        this.driver = DriverManager.getDriver();
        this.wait   = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    public void navigateTo(int bookingId) {
        driver.get("https://automationintesting.online/#/booking/" + bookingId);
    }

    public String getFirstName() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(firstNameField))
                   .getAttribute("value");
    }

    public String getLastName() {
        return driver.findElement(lastNameField).getAttribute("value");
    }

    public int getPrice() {
        String text = driver.findElement(priceField).getAttribute("value");
        return Integer.parseInt(text.replaceAll("[^0-9]", ""));
    }
}
\`\`\`

---

### ✅ The Full Test

\`\`\`java
@Epic("E2E Integration")
@Feature("Booking Verification")
public class ApiSetupUiVerifyTest extends E2EBaseTest {

    private int bookingId;
    private final String FIRST_NAME = "Alice";
    private final String LAST_NAME  = "Wonderland";
    private final int    PRICE      = 350;

    @Test
    @Story("Create via API, verify in UI")
    @Severity(SeverityLevel.CRITICAL)
    public void bookingCreatedViaApiAppearsInUI() {
        bookingId = api.createBooking(FIRST_NAME, LAST_NAME, PRICE,
                                      "2026-09-01", "2026-09-07");
        Assert.assertTrue(bookingId > 0, "Expected a valid booking ID from the API");

        BookingDetailPage page = new BookingDetailPage();
        page.navigateTo(bookingId);

        Assert.assertEquals(page.getFirstName(), FIRST_NAME);
        Assert.assertEquals(page.getLastName(),  LAST_NAME);
        Assert.assertEquals(page.getPrice(),     PRICE);
    }

    @AfterClass
    public void tearDownClass() {
        if (bookingId > 0) api.deleteBooking(bookingId);
    }
}
\`\`\`

---

### 🎯 When to Use This Pattern

| Scenario | Use API Setup → UI Verify? |
|---|---|
| Verifying a booking form shows correct data | ✅ Yes |
| Testing a complex calendar date-picker | ✅ Yes — set dates via API, verify display |
| Testing the UI form submission itself | ❌ No — the form IS the thing under test |
| Testing that a "Delete" button actually deletes | ❌ No — the UI action IS the thing under test |
`,
        exercise: {
          title: 'Build the API Setup → UI Verify Test',
          task: `Write a complete ApiSetupUiVerifyTest class with 2 test methods:

1. bookingWithHighPriceAppearsCorrectly()
   - Create via API: first="James", last="Bond", price=999
   - Verify all 3 fields in the UI

2. multipleBookingsAppearsInList()
   - Create 3 bookings via API in @BeforeClass
   - Navigate to the booking list page
   - Assert all 3 booking names are visible on the page

Also implement cleanup: delete all created bookings in @AfterClass via API.`,
          hints: [
            'Store created booking IDs in a List<Integer> for easy cleanup in @AfterClass',
            'For the list page, use driver.getPageSource().contains("James Bond") as a simple assertion',
            'api.createBooking() calls can be made in a loop or called 3 times explicitly in @BeforeClass'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'What is the primary advantage of creating test data via API instead of through the UI form?',
            options: [
              'API calls are more readable than UI interactions',
              'It is faster and more reliable than clicking through forms — no calendar pickers or slow page loads',
              'The API always returns better data quality than the UI form',
              'Selenium cannot fill form fields reliably'
            ],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'You should ALWAYS use API setup for test data, even when the form submission itself is the feature being tested.',
            answer: false
          },
          {
            type: 'mcq',
            q: 'Why is @AfterClass used for cleanup (deleting bookings) instead of @AfterMethod?',
            options: [
              '@AfterMethod cannot make API calls',
              'The bookingId is only available after all @Test methods in the class have run',
              'The booking should remain until all tests in the class are done, then be cleaned up once',
              'TestNG does not allow @AfterMethod to delete data'
            ],
            answer: 2
          },
          {
            type: 'fillin',
            q: 'In the API Setup → UI Verify pattern, the _______ layer creates the test data fast, and the _______ layer verifies it is displayed correctly.',
            answer: 'API / UI'
          }
        ]
      },

      {
        id: 'e2e-l5',
        title: 'UI Actions → API Assertions Pattern',
        type: 'lesson',
        duration: '35 min',
        whatYoullLearn: [
          'What the "UI Action → API Assert" pattern is and when to use it',
          'Perform an action through the UI (form submit, button click)',
          'Assert the backend state changed correctly via REST Assured',
          'Why API assertions are faster and more reliable than UI assertions',
          'Combine both patterns in a single test flow'
        ],
        content: `
## 🖱️ UI Actions → API Assertions Pattern

**The problem with UI-only assertions:**

\`\`\`
1. Click "Save Booking"                 ← Action
2. Wait for success toast message       ← 2000ms wait (fragile)
3. Navigate to booking list             ← 1000ms page load
4. Search for the booking               ← 500ms
5. Click into it                        ← 500ms
6. Assert every field                   ← 1000ms
                                Total: ~5 seconds just to ASSERT
\`\`\`

**API Assertion instead:**

\`\`\`java
// 1. Click "Save"  (UI action)
savePage.clickSave();

// 2. Extract the new booking ID from the URL or confirmation
int newId = extractIdFromUrl(driver.getCurrentUrl());

// 3. Assert via API — no waiting, no navigation, no searching
api.getBooking(newId)
   .then()
   .statusCode(200)
   .body("firstname", equalTo("Alice"))
   .body("totalprice", equalTo(350));
                                Total: ~300ms to ASSERT
\`\`\`

---

### 📐 Page Object for the UI Action

\`\`\`java
public class CreateBookingPage {

    private final WebDriver driver;
    private final WebDriverWait wait;

    private final By firstNameInput = By.name("firstname");
    private final By lastNameInput  = By.name("lastname");
    private final By priceInput     = By.name("totalprice");
    private final By saveButton     = By.cssSelector("button[type='submit']");
    private final By successMessage = By.cssSelector(".booking-id");

    public CreateBookingPage() {
        this.driver = DriverManager.getDriver();
        this.wait   = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    @Step("Navigate to create booking form")
    public void navigateTo() {
        driver.get("https://automationintesting.online/#/");
    }

    @Step("Fill booking form: {firstName} {lastName}, £{price}")
    public void fillForm(String firstName, String lastName, int price) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(firstNameInput))
            .sendKeys(firstName);
        driver.findElement(lastNameInput).sendKeys(lastName);
        driver.findElement(priceInput).clear();
        driver.findElement(priceInput).sendKeys(String.valueOf(price));
    }

    @Step("Submit the booking form")
    public void clickSave() {
        driver.findElement(saveButton).click();
    }

    @Step("Wait for and extract the new booking ID")
    public int getNewBookingId() {
        String text = wait.until(
            ExpectedConditions.visibilityOfElementLocated(successMessage))
            .getText();
        return Integer.parseInt(text.replaceAll("[^0-9]", ""));
    }
}
\`\`\`

---

### ✅ The Full Test

\`\`\`java
@Epic("E2E Integration")
@Feature("Booking Form Submission")
public class UiActionApiAssertTest extends E2EBaseTest {

    private int newBookingId = -1;

    @Test
    @Story("UI submit → API verify backend state")
    @Severity(SeverityLevel.CRITICAL)
    public void bookingSubmittedViaUiIsPersisted() {
        CreateBookingPage createPage = new CreateBookingPage();

        createPage.navigateTo();
        createPage.fillForm("Charlie", "Chaplin", 150);
        createPage.clickSave();
        newBookingId = createPage.getNewBookingId();

        Assert.assertTrue(newBookingId > 0);

        api.getBooking(newBookingId)
           .then()
           .statusCode(200)
           .body("firstname",   equalTo("Charlie"))
           .body("lastname",    equalTo("Chaplin"))
           .body("totalprice",  equalTo(150));
    }

    @AfterClass
    public void cleanup() {
        if (newBookingId > 0) api.deleteBooking(newBookingId);
    }
}
\`\`\`

---

### 🔄 Combining Both Patterns

\`\`\`java
@Test
public void fullLifecycleTest() {
    // 1. API SETUP
    int id = api.createBooking("Diana", "Prince", 200, "2026-10-01", "2026-10-07");

    // 2. UI ACTION — edit the price via UI
    BookingEditPage editPage = new BookingEditPage();
    editPage.navigateTo(id);
    editPage.updatePrice(999);
    editPage.clickSave();

    // 3. API ASSERT — verify new price persisted
    api.getBooking(id).then().body("totalprice", equalTo(999));

    // 4. CLEANUP
    api.deleteBooking(id);
}
\`\`\`
`,
        exercise: {
          title: 'Build the UI Action → API Assert Test',
          task: `Write a UiActionApiAssertTest class:

1. Test 1 — "deleteViaUiIsRemovedFromApi":
   a. Create a booking via API
   b. Navigate to it in the browser
   c. Click the "Delete" button in the UI
   d. Assert via API (GET /booking/{id}) returns 404

2. Test 2 — "priceEditedViaUiPersistsToApi":
   a. Create a booking via API with price=100
   b. Navigate to it in the browser
   c. Change the price to 500 in the form
   d. Save it via the UI
   e. Assert via api.getBooking(id) that totalprice == 500`,
          hints: [
            'For the DELETE test, the API returns 404 after a successful delete — use .statusCode(404) to assert it\'s gone',
            'If the site doesn\'t have a delete button visible, a simulated click can be done via JavascriptExecutor',
            'Soft assertions (SoftAssert) are useful when you want to assert multiple fields and see ALL failures at once'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'Why are API assertions faster than UI assertions after a form submission?',
            options: [
              'REST Assured compiles faster than Selenium',
              'API assertions go directly to the backend — no waiting for page loads, toast messages, or UI re-rendering',
              'The API returns results in XML which is faster to parse',
              'Selenium cannot assert form values after submission'
            ],
            answer: 1
          },
          {
            type: 'mcq',
            q: 'In the full lifecycle test, what is the purpose of the UI step (editing price)?',
            options: [
              'The UI is required for Allure screenshots',
              'The UI action IS the feature under test — we are testing that the edit form works',
              'It is faster to edit via UI than API',
              'REST Assured cannot send PUT requests'
            ],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'You can assert that a UI delete action worked by calling GET on the API and checking for a 404 response.',
            answer: true
          },
          {
            type: 'fillin',
            q: 'In TestNG, _______ allows you to collect multiple assertion failures and report them all at the end, rather than stopping at the first failure.',
            answer: 'SoftAssert'
          }
        ]
      },

      {
        id: 'e2e-l6',
        title: 'Data-Driven E2E Tests',
        type: 'lesson',
        duration: '30 min',
        whatYoullLearn: [
          'Apply @DataProvider to full E2E hybrid tests',
          'Read E2E test data from a JSON file',
          'Use SoftAssert to collect all E2E failures before stopping',
          'Test multiple user personas through the same E2E flow',
          'Organise E2E test output with Allure parameters'
        ],
        content: `
## 📊 Data-Driven E2E Tests

Data-driven testing in E2E context means running the same API setup → UI verify flow with multiple datasets.

---

### 🔁 @DataProvider for E2E

\`\`\`java
@DataProvider(name = "guestPersonas")
public Object[][] guestPersonas() {
    return new Object[][] {
        { "Alice",   "Smith",    100,   "2026-01-10",  "2026-01-17",  true  },
        { "Bob",     "Jones",    500,   "2026-02-01",  "2026-02-05",  true  },
        { "Charlie", "Brown",    9999,  "2026-03-15",  "2026-03-20",  true  },
        { "Diana",   "Prince",   1,     "2026-06-01",  "2026-06-02",  true  },
    };
}

@Test(dataProvider = "guestPersonas")
public void guestBookingAppearsInUI(String firstName, String lastName,
                                     int price, String checkin,
                                     String checkout, boolean expectUI) {
    int id = api.createBooking(firstName, lastName, price, checkin, checkout);
    bookingIds.add(id);

    BookingDetailPage page = new BookingDetailPage();
    page.navigateTo(id);

    SoftAssert soft = new SoftAssert();
    soft.assertEquals(page.getFirstName(), firstName, "First name mismatch");
    soft.assertEquals(page.getLastName(),  lastName,  "Last name mismatch");
    soft.assertEquals(page.getPrice(),     price,     "Price mismatch");
    soft.assertAll();
}
\`\`\`

---

### 📄 Reading E2E Test Data from JSON

\`\`\`json
// common/src/main/resources/e2e-test-data.json
[
  { "firstName": "Alice",   "lastName": "Wonder",   "price": 200, "checkin": "2026-04-01", "checkout": "2026-04-07" },
  { "firstName": "Bob",     "lastName": "Builder",  "price": 350, "checkin": "2026-05-10", "checkout": "2026-05-14" },
  { "firstName": "Charlie", "lastName": "Chaplin",  "price": 500, "checkin": "2026-06-20", "checkout": "2026-06-25" }
]
\`\`\`

\`\`\`java
@DataProvider(name = "jsonPersonas")
public Object[][] jsonPersonas() throws Exception {
    return JsonDataReader.readE2EData("/e2e-test-data.json")
        .toArray(new Object[0][]);
}
\`\`\`

---

### 🏷️ Allure Parameters for Data-Driven Tests

\`\`\`java
@Test(dataProvider = "guestPersonas")
public void guestBookingAppearsInUI(String firstName, String lastName,
                                     int price, String checkin, String checkout, boolean x) {
    Allure.parameter("Guest", firstName + " " + lastName);
    Allure.parameter("Price", "£" + price);
    // ... rest of test
}
\`\`\`

This makes each row in the Allure report clearly labelled:
\`\`\`
✅ guestBookingAppearsInUI [Guest: Alice Smith, Price: £100]
✅ guestBookingAppearsInUI [Guest: Bob Jones, Price: £500]
✅ guestBookingAppearsInUI [Guest: Charlie Brown, Price: £9999]
\`\`\`
`,
        exercise: {
          title: 'Build a Data-Driven E2E Suite with JSON Data',
          task: `Create a DataDrivenE2ETest class:

1. Create e2e-test-data.json with 5 booking personas
2. Implement JsonDataReader.readE2EData()
3. Write a @DataProvider that reads from the JSON file
4. Write a @Test(dataProvider=...) that:
   a. Creates booking via API for each persona
   b. Verifies the booking via UI
   c. Adds Allure.parameter() calls for guest name and price
   d. Uses SoftAssert (not hard Assert) so all persona results are collected
5. Add @AfterClass cleanup for all created booking IDs`,
          hints: [
            'Store booking IDs in Collections.synchronizedList(new ArrayList<>()) when running parallel data-driven tests',
            'SoftAssert.assertAll() must be called at the END of the test — it throws if any soft assertion failed',
            'Allure.parameter() should be called at the TOP of the test so the label appears even if the test fails'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'What does SoftAssert do differently compared to a regular Assert?',
            options: [
              'SoftAssert runs faster than regular Assert',
              'SoftAssert collects all failures and reports them together — it does not stop at the first failure',
              'SoftAssert only works with REST Assured, not Selenium',
              'SoftAssert skips the test if the first assertion fails'
            ],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'When using SoftAssert, you must call soft.assertAll() at the end of the test to actually trigger a test failure if any soft assertions failed.',
            answer: true
          },
          {
            type: 'mcq',
            q: 'What does Allure.parameter("Guest", firstName) do in a data-driven test?',
            options: [
              'It passes a parameter to the next test in the suite',
              'It labels this specific test run with the value so it\'s identifiable in the Allure report',
              'It stores the parameter in a database for later analysis',
              'It configures the Allure report\'s filter settings'
            ],
            answer: 1
          },
          {
            type: 'fillin',
            q: 'To make a List thread-safe for storing booking IDs across parallel data-driven test runs, wrap it with _______ .',
            answer: 'Collections.synchronizedList()'
          }
        ]
      }
    ]
  }
]; // Modules 3-4 added by e2e-curriculum-advanced.js
