// ── Module D: E2E Integration (Modules 3-4) ──────────────────────
// Extends E2E_CURRICULUM defined in e2e-curriculum.js

E2E_CURRICULUM.push(

  // MODULE 3 — Reporting & Infrastructure
  {
    id: 'e2e-module-3',
    title: 'Reporting & Infrastructure',
    icon: '📊',
    lessons: [
      {
        id: 'e2e-l7',
        title: 'Allure Reporting for E2E Suites — Screenshots & Step Chains',
        type: 'lesson',
        duration: '30 min',
        whatYoullLearn: [
          'Configure Allure to capture screenshots automatically on test failure',
          'Use @Step annotations that span both API and UI actions',
          'Attach REST Assured request/response logs to Allure',
          'Organise E2E tests with @Epic, @Feature, @Story hierarchy',
          'Generate and read a multi-layer Allure report'
        ],
        content: `
## 📊 Allure Reporting for E2E Suites

When a hybrid test fails, you need to know EXACTLY which layer broke — was it the API call, the page navigation, or the UI assertion? A well-configured Allure report tells you at a glance.

---

### 🎨 @Step Annotations Across Both Layers

\`\`\`java
@Epic("E2E Integration")
@Feature("Booking Lifecycle")
public class FullLifecycleTest extends E2EBaseTest {

    @Test
    @Story("Create API → Edit UI → Assert API")
    public void editedBookingPersists() {
        int id = createBookingViaApi("Alice", "Smith", 200);
        navigateToBookingDetail(id);
        editPrice(500);
        saveBooking();
        assertPriceViaApi(id, 500);
        cleanupBooking(id);
    }

    @Step("Create booking via API: {firstName} {lastName} £{price}")
    private int createBookingViaApi(String firstName, String lastName, int price) {
        return api.createBooking(firstName, lastName, price, "2026-10-01", "2026-10-07");
    }

    @Step("Navigate browser to booking detail page for ID {bookingId}")
    private void navigateToBookingDetail(int bookingId) {
        getDriver().get("https://automationintesting.online/#/booking/" + bookingId);
    }

    @Step("Edit price field to £{newPrice}")
    private void editPrice(int newPrice) {
        org.openqa.selenium.By priceField = org.openqa.selenium.By.id("totalprice");
        org.openqa.selenium.WebElement el = getDriver().findElement(priceField);
        el.clear();
        el.sendKeys(String.valueOf(newPrice));
    }

    @Step("Click Save button")
    private void saveBooking() {
        getDriver().findElement(
            org.openqa.selenium.By.cssSelector("button[type='submit']")).click();
        try { Thread.sleep(1000); } catch (Exception ignored) {}
    }

    @Step("Assert booking {bookingId} has price £{expectedPrice} via API")
    private void assertPriceViaApi(int bookingId, int expectedPrice) {
        api.getBooking(bookingId)
           .then()
           .statusCode(200)
           .body("totalprice", org.hamcrest.Matchers.equalTo(expectedPrice));
    }

    @Step("Delete booking {bookingId} via API")
    private void cleanupBooking(int bookingId) {
        api.deleteBooking(bookingId);
    }
}
\`\`\`

In Allure, a failed test shows the EXACT step that broke:
\`\`\`
✅ Create booking via API: Alice Smith £200
✅ Navigate browser to booking detail page for ID 42
✅ Edit price field to £500
❌ Click Save button  ← FAILED HERE (screenshot attached)
⬜ Assert booking 42 has price £500 via API  (not reached)
\`\`\`

---

### 📸 Automatic Screenshot Listener

\`\`\`java
// common/src/main/java/listeners/ScreenshotListener.java
public class ScreenshotListener implements ITestListener {
    @Override
    public void onTestFailure(ITestResult result) {
        try {
            WebDriver driver = DriverManager.getDriver();
            if (driver != null) {
                byte[] screenshot = ((TakesScreenshot) driver)
                    .getScreenshotAs(OutputType.BYTES);
                Allure.getLifecycle().addAttachment(
                    "Screenshot — " + result.getName(),
                    "image/png", "png", screenshot);
            }
        } catch (Exception ignored) {}
    }
}
\`\`\`

Register in testng.xml:
\`\`\`xml
<suite name="E2E Suite">
  <listeners>
    <listener class-name="listeners.ScreenshotListener"/>
  </listeners>
  <test name="E2E Tests">
    <classes>
      <class name="tests.ApiSetupUiVerifyTest"/>
      <class name="tests.UiActionApiAssertTest"/>
      <class name="tests.DataDrivenE2ETest"/>
    </classes>
  </test>
</suite>
\`\`\`

---

### 📡 REST Assured Logs in Allure

Already enabled in E2EBaseTest:
\`\`\`java
RestAssured.filters(new AllureRestAssured());
\`\`\`

---

### 🏃 Generate and View the Report

\`\`\`bash
mvn clean test -pl e2e-module
mvn allure:serve -pl e2e-module
# Or aggregate all modules:
mvn clean test && mvn allure:aggregate && mvn allure:serve
\`\`\`
`,
        exercise: {
          title: 'Build a Fully Instrumented E2E Report',
          task: `Enhance your existing E2E tests with full Allure instrumentation:

1. Add @Epic, @Feature, @Story, @Severity to ALL test classes and methods
2. Extract every meaningful action into a private @Step method
3. Implement ScreenshotListener and register it in testng.xml
4. Run the full suite and then mvn allure:serve

Screenshot the Overview page, one test's step chain, and a deliberately failed test showing the attached screenshot.`,
          hints: [
            'To deliberately fail, change equalTo("Alice") to equalTo("WRONG") temporarily',
            '@Severity(SeverityLevel.CRITICAL) marks tests whose failure blocks the release',
            'Allure.addAttachment("Page HTML", "text/html", "html", driver.getPageSource()) helps debug failures'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'What does a @Step annotation on a private method do in Allure?',
            options: [
              'It makes the method run before each test',
              'It shows the method as a named step in the Allure test detail, so you can see exactly which action failed',
              'It marks the method as thread-safe',
              'It skips the method if the previous step failed'
            ],
            answer: 1
          },
          {
            type: 'mcq',
            q: 'Why is the ScreenshotListener registered in testng.xml rather than inside each test class?',
            options: [
              'TestNG listeners cannot be registered programmatically',
              'Registering in testng.xml applies it to ALL test classes without changing each one individually',
              'Allure requires listeners to be in the XML file',
              'testng.xml listeners run before @BeforeClass setup'
            ],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'When RestAssured.filters(new AllureRestAssured()) is set, every API call\'s request URL, headers, and response body are automatically attached to the Allure report.',
            answer: true
          },
          {
            type: 'fillin',
            q: 'In a well-structured Allure report, tests are organised hierarchically: _______ > _______ > Story.',
            answer: 'Epic > Feature'
          }
        ]
      },

      {
        id: 'e2e-l8',
        title: 'Docker for Test Environments — Selenium Grid',
        type: 'lesson',
        duration: '35 min',
        whatYoullLearn: [
          'Why Docker makes test environments reproducible',
          'What Selenium Grid is and how it enables parallel cross-browser testing',
          'Write a docker-compose.yml for a Selenium Grid environment',
          'Update DriverManager to connect to a remote Selenium Grid',
          'Run your full E2E suite against Grid in a single command'
        ],
        content: `
## 🐳 Docker for Test Environments

**Without Docker:** CI server may not have Chrome, versions differ between machines, "works on my machine" failures.

**With Docker:**
\`\`\`bash
docker compose up -d   # Selenium Grid is ready
mvn clean test         # tests run against the Grid
docker compose down    # cleanup
\`\`\`

---

### 🐳 docker-compose.yml — Selenium Grid

\`\`\`yaml
version: "3.8"
services:
  selenium-hub:
    image: selenium/hub:4.21.0
    container_name: selenium-hub
    ports:
      - "4444:4444"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:4444/wd/hub/status"]
      interval: 10s
      timeout: 5s
      retries: 5

  chrome:
    image: selenium/node-chrome:4.21.0
    depends_on:
      selenium-hub:
        condition: service_healthy
    environment:
      - SE_EVENT_BUS_HOST=selenium-hub
      - SE_EVENT_BUS_PUBLISH_PORT=4442
      - SE_EVENT_BUS_SUBSCRIBE_PORT=4443
      - SE_NODE_MAX_SESSIONS=3
    volumes:
      - /dev/shm:/dev/shm

  firefox:
    image: selenium/node-firefox:4.21.0
    depends_on:
      selenium-hub:
        condition: service_healthy
    environment:
      - SE_EVENT_BUS_HOST=selenium-hub
      - SE_EVENT_BUS_PUBLISH_PORT=4442
      - SE_EVENT_BUS_SUBSCRIBE_PORT=4443
      - SE_NODE_MAX_SESSIONS=2
\`\`\`

---

### 🔧 Update DriverManager for Remote Grid

\`\`\`java
public static void create() {
    String browser = ConfigReader.getBrowser().toLowerCase();
    String gridUrl  = ConfigReader.get("grid.url");

    WebDriver driver;

    if (gridUrl != null && !gridUrl.isEmpty()) {
        // Remote Grid mode
        try {
            java.net.URL hub = new java.net.URL(gridUrl + "/wd/hub");
            if (browser.equals("firefox")) {
                driver = new org.openqa.selenium.remote.RemoteWebDriver(
                    hub, new org.openqa.selenium.firefox.FirefoxOptions());
            } else {
                org.openqa.selenium.chrome.ChromeOptions opts =
                    new org.openqa.selenium.chrome.ChromeOptions();
                opts.addArguments("--no-sandbox", "--disable-dev-shm-usage");
                driver = new org.openqa.selenium.remote.RemoteWebDriver(hub, opts);
            }
        } catch (java.net.MalformedURLException e) {
            throw new RuntimeException("Invalid grid URL: " + gridUrl, e);
        }
    } else {
        // Local mode
        WebDriverManager.chromedriver().setup();
        org.openqa.selenium.chrome.ChromeOptions opts =
            new org.openqa.selenium.chrome.ChromeOptions();
        opts.addArguments("--headless", "--no-sandbox", "--disable-dev-shm-usage");
        driver = new org.openqa.selenium.chrome.ChromeDriver(opts);
    }

    driver.manage().timeouts().implicitlyWait(java.time.Duration.ofSeconds(10));
    DRIVER.set(driver);
}
\`\`\`

Add to config.properties:
\`\`\`properties
grid.url=http://localhost:4444
\`\`\`

---

### ▶️ Full Workflow

\`\`\`bash
docker compose up -d
# Wait for Grid UI at http://localhost:4444
mvn clean test -pl e2e-module -Dgrid.url=http://localhost:4444
docker compose down
\`\`\`
`,
        exercise: {
          title: 'Run Your E2E Suite on Selenium Grid',
          task: `1. Install Docker Desktop from docker.com
2. Create docker-compose.yml as shown
3. Run "docker compose up -d" — verify Grid UI at http://localhost:4444
4. Update DriverManager.java with grid.url support
5. Run: mvn clean test -pl e2e-module -Dgrid.url=http://localhost:4444 -Dbrowser=chrome
6. Watch the Grid UI — see active browser sessions
7. Run again with -Dbrowser=firefox

Screenshot: Grid UI showing 2+ active sessions + terminal showing tests passed.`,
          hints: [
            'Docker Desktop must be running — check the whale icon in your menu bar',
            'If port 4444 is in use, change "4444:4444" to "4445:4444"',
            '"docker compose logs selenium-hub" shows why the hub failed if not healthy'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'What problem does Selenium Grid solve that running WebDriver locally does not?',
            options: [
              'Grid makes tests skip page loads',
              'Grid allows tests to run on multiple browsers simultaneously across machines',
              'Grid fixes timing issues in Selenium waits',
              'Grid automatically retries failed tests'
            ],
            answer: 1
          },
          {
            type: 'mcq',
            q: 'What is the role of the "selenium-hub" container?',
            options: [
              'It runs the actual browser and executes WebDriver commands',
              'It coordinates incoming WebDriver sessions and routes them to available browser nodes',
              'It stores test results and generates reports',
              'It manages the Docker network'
            ],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'The volume mapping "/dev/shm:/dev/shm" prevents Chrome from crashing due to limited shared memory inside the container.',
            answer: true
          },
          {
            type: 'fillin',
            q: 'To connect RemoteWebDriver to Selenium Grid, you pass the URL http://localhost:4444/_______ as the first argument.',
            answer: 'wd/hub'
          }
        ]
      }
    ]
  },

  // MODULE 4 — Full Pipeline
  {
    id: 'e2e-module-4',
    title: 'Full CI/CD Pipeline',
    icon: '🚀',
    lessons: [
      {
        id: 'e2e-l9',
        title: 'Parallel Execution Strategy — Speed Up Your Suite',
        type: 'lesson',
        duration: '30 min',
        whatYoullLearn: [
          'Understand TestNG parallel modes: methods, tests, classes, instances',
          'Configure thread-count for optimal speed vs stability',
          'Identify and fix thread-safety issues in E2E tests',
          'Prevent race conditions when tests share API state',
          'Profile your suite to find the slowest tests'
        ],
        content: `
## ⚡ Parallel Execution Strategy

Running 30 E2E tests sequentially might take 15 minutes. Running them with 5 threads takes 3 minutes.

---

### 📋 TestNG Parallel Modes

| Mode | What runs in parallel | Use when |
|---|---|---|
| \`methods\` | Each @Test method | Tests are fully independent |
| \`classes\` | Each test class | Methods within a class share state |
| \`tests\` | Each \`<test>\` block | Coarse control |
| \`instances\` | Each test instance | @Factory classes |

---

### ⚙️ testng.xml for Parallel E2E

\`\`\`xml
<suite name="E2E Suite" parallel="methods" thread-count="4">
  <listeners>
    <listener class-name="listeners.ScreenshotListener"/>
  </listeners>
  <test name="E2E Tests">
    <classes>
      <class name="tests.ApiSetupUiVerifyTest"/>
      <class name="tests.DataDrivenE2ETest"/>
    </classes>
  </test>
</suite>
\`\`\`

---

### 🔒 Thread-Safety Checklist

\`\`\`java
// ❌ BROKEN — class field shared across threads
private int bookingId;  // Thread 1 sets, Thread 2 reads → RACE CONDITION

// ✅ SAFE — local variables (simplest)
@Test
public void myTest() {
    int bookingId = api.createBooking(...);  // local to this call stack
    // verify ...
    api.deleteBooking(bookingId);
}

// ✅ SAFE — ThreadLocal for state spanning @Before/@After
private final ThreadLocal<Integer> threadBookingId = new ThreadLocal<>();

@BeforeMethod
public void createData() {
    threadBookingId.set(api.createBooking(...));
}

@AfterMethod
public void deleteData() {
    Integer id = threadBookingId.get();
    if (id != null) { api.deleteBooking(id); threadBookingId.remove(); }
}
\`\`\`

---

### 🎯 Recommended Thread Counts

| Machine | thread-count |
|---|---|
| 2-core laptop | 2-3 |
| 4-core workstation | 4-6 |
| 8-core CI server | 6-8 |
| Selenium Grid (3 Chrome nodes) | 3 |

More threads than browser nodes = queue buildup = slower, not faster.
`,
        exercise: {
          title: 'Run Your Suite in Parallel and Measure the Speedup',
          task: `1. Update testng.xml with parallel="methods" thread-count="3"
2. Ensure all booking IDs are local variables or ThreadLocal — NOT class fields
3. Run sequentially (thread-count="1") and note the total time
4. Run with thread-count="3" and note the time
5. Calculate the speedup percentage
6. Deliberately introduce a race condition (use a class field for bookingId) and observe intermittent failures
7. Fix it back and verify stability over 3+ consecutive runs

Screenshot: parallel terminal output + time comparison.`,
          hints: [
            'Stable parallel means ALL tests pass over 3+ consecutive runs — one passing run is not enough',
            'If tests randomly pass/fail, you have a race condition — look for shared mutable state',
            'thread-count should match SE_NODE_MAX_SESSIONS to avoid queuing'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'Which TestNG parallel mode runs each @Test method in its own thread?',
            options: ['parallel="classes"', 'parallel="tests"', 'parallel="methods"', 'parallel="instances"'],
            answer: 2
          },
          {
            type: 'mcq',
            q: 'What is a race condition in parallel test execution?',
            options: [
              'Two tests compete for the same browser window',
              'Two threads access and modify the same shared variable simultaneously, causing unpredictable results',
              'A test fails because the network is slow under load',
              'Tests run out of order when parallel is enabled'
            ],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'Setting thread-count higher than the number of available Selenium Grid nodes makes the suite run faster.',
            answer: false
          },
          {
            type: 'fillin',
            q: 'The safest way to store per-test state across @BeforeMethod and @AfterMethod in a parallel test class is to use _______ .',
            answer: 'ThreadLocal'
          }
        ]
      },

      {
        id: 'e2e-l10',
        title: 'Full GitHub Actions Pipeline — The Complete Test Pyramid in CI',
        type: 'lesson',
        duration: '35 min',
        whatYoullLearn: [
          'Write a GitHub Actions workflow that runs all three layers: API, UI, E2E',
          'Start a Selenium Grid using Docker Compose in GitHub Actions',
          'Use a matrix to run tests on Chrome and Firefox in parallel',
          'Publish Allure reports to GitHub Pages',
          'Send a Slack notification when the pipeline fails'
        ],
        content: `
## 🚀 Full GitHub Actions Pipeline

---

### 📝 .github/workflows/test-pyramid.yml

\`\`\`yaml
name: Test Pyramid — Full Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:
  schedule:
    - cron: "0 6 * * 1-5"   # 6am weekdays

jobs:

  api-tests:
    name: API Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: temurin
          cache: maven
      - name: Run API tests
        run: mvn clean test -pl api-module --no-transfer-progress
      - name: Upload Allure results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: allure-results-api
          path: api-module/target/allure-results/

  e2e-tests:
    name: E2E Tests (\${{ matrix.browser }})
    runs-on: ubuntu-latest
    needs: api-tests
    strategy:
      matrix:
        browser: [chrome, firefox]
      fail-fast: false
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: temurin
          cache: maven
      - name: Start Selenium Grid
        run: |
          docker compose up -d
          timeout 60 bash -c 'until curl -sf http://localhost:4444/wd/hub/status; do sleep 2; done'
      - name: Run E2E tests
        run: |
          mvn clean test -pl e2e-module \\
            -Dgrid.url=http://localhost:4444 \\
            -Dbrowser=\${{ matrix.browser }} \\
            --no-transfer-progress
      - name: Upload E2E Allure results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: allure-results-e2e-\${{ matrix.browser }}
          path: e2e-module/target/allure-results/
      - name: Stop Grid
        if: always()
        run: docker compose down

  publish-report:
    name: Publish Allure Report
    runs-on: ubuntu-latest
    needs: [api-tests, e2e-tests]
    if: always()
    permissions:
      pages: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - name: Download all Allure results
        uses: actions/download-artifact@v4
        with:
          pattern: allure-results-*
          merge-multiple: true
          path: allure-results/
      - name: Generate combined Allure report
        uses: simple-elf/allure-report-action@v1
        with:
          allure_results: allure-results
          allure_report: allure-report
          gh_pages: gh-pages
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_branch: gh-pages
          publish_dir: allure-report
\`\`\`

---

### 🎓 You Have Completed the Full Test Pyramid

You can now:
- **API Layer**: REST Assured tests, run fast in CI (< 2 minutes)
- **UI Layer**: Selenium tests with ThreadLocal WebDriver
- **E2E / Hybrid**: API setup + UI verify, UI action + API assert
- **Infrastructure**: Selenium Grid via Docker
- **Reporting**: Allure with @Step chains, screenshots on failure
- **CI/CD**: GitHub Actions — matrix builds, Docker Compose, GitHub Pages

This is a **production-grade test automation framework**.
`,
        exercise: {
          title: 'Deploy the Complete Test Pyramid Pipeline',
          task: `1. Push your complete multi-module project to GitHub
2. Create .github/workflows/test-pyramid.yml as shown
3. Add SLACK_WEBHOOK_URL as a GitHub Secret (optional)
4. Push to main and watch the Actions tab
5. After the pipeline completes, enable GitHub Pages (Settings → Pages → gh-pages branch)
6. Open your Allure report at https://{username}.github.io/{repo-name}

Final screenshot: all GitHub Actions jobs green + Allure report in browser showing tests from all 3 layers.`,
          hints: [
            '"needs: api-tests" saves time — E2E only runs if API tests pass',
            '"fail-fast: false" means Chrome and Firefox both run even if one fails',
            '"schedule: cron" runs at 6am weekdays — catches overnight environment issues'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'What does "needs: api-tests" in the e2e-tests job do?',
            options: [
              'It imports the API test code into the E2E module',
              'It ensures e2e-tests only starts after api-tests completes — saving time when API is broken',
              'It shares the API test results with the E2E job',
              'It runs API tests and E2E tests in the same job'
            ],
            answer: 1
          },
          {
            type: 'mcq',
            q: 'What does "fail-fast: false" do in a GitHub Actions matrix?',
            options: [
              'The matrix never reports failures',
              'Each matrix variant runs to completion regardless of whether others fail',
              'Failed jobs automatically retry up to 3 times',
              'The first failing job cancels the entire pipeline'
            ],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'The "schedule" trigger with a cron expression allows the pipeline to run automatically without a code push.',
            answer: true
          },
          {
            type: 'fillin',
            q: 'In the GitHub Actions matrix, the syntax _______ inserts the current matrix value (e.g. "chrome" or "firefox") into a step.',
            answer: '${{ matrix.browser }}'
          }
        ]
      }
    ]
  }

); // end E2E_CURRICULUM (Modules 3-4)
