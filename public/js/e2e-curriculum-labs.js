// ── Module D: E2E Integration — Labs ─────────────────────────────

const E2E_CURRICULUM_LABS = [
  {
    id: 'e2e-labs-module',
    title: 'E2E Integration Labs',
    icon: '🧪',
    lessons: [
      {
        id: 'e2e-lab-1',
        title: 'Lab 1 — Full Hybrid CRUD Test',
        type: 'lab',
        duration: '45 min',
        content: `
## 🧪 Lab 1 — Full Hybrid CRUD Test

**Goal:** Write one test class that exercises the full CRUD lifecycle using both API and UI layers.

### Your Task

Create \`HybridCRUDTest.java\` in the e2e-module with 4 test methods (each using TestNG @Test priority):

1. **Priority 1 — createViaApiAndVerifyInUI()**
   - POST to /booking with your own name + a price of £333
   - Navigate to the booking detail page in the browser
   - Assert firstname, lastname, and totalprice are all correct

2. **Priority 2 — editPriceViaUIAndVerifyWithApi()**
   - Using the bookingId from step 1
   - Navigate to the edit page in the browser
   - Change the price to £777 via the UI
   - Click Save
   - Assert via GET /booking/{id} that totalprice is now 777

3. **Priority 3 — addNoteViaUIAndVerifyWithApi()**
   - Navigate to the booking in the browser
   - Add a "needs" note (e.g. "Extra pillow")
   - Save via UI
   - Assert via GET /booking/{id} that the additionalneeds field contains "Extra pillow"

4. **Priority 4 — deleteViaApiAndVerifyNotFoundInUI()**
   - DELETE /booking/{id} via API
   - Navigate to the (now-deleted) booking URL in the browser
   - Assert that the page shows a 404 message or redirects

### Required Structure

\`\`\`java
@Epic("E2E Integration")
@Feature("Booking CRUD Lifecycle")
public class HybridCRUDTest extends E2EBaseTest {

    private int bookingId = -1;

    // ... test methods here

    @AfterClass
    public void cleanup() {
        if (bookingId > 0) {
            try { api.deleteBooking(bookingId); }
            catch (Exception ignored) {}  // may already be deleted in step 4
        }
    }
}
\`\`\`

### Acceptance Criteria

- [ ] All 4 tests pass in order (priority=1 through priority=4)
- [ ] Each step is annotated with @Step
- [ ] @BeforeClass authenticates and stores the token
- [ ] @AfterClass cleans up safely (ignoring 404 since test 4 already deleted it)
- [ ] Run mvn allure:serve and screenshot the Step chain for the passing run
`,
        exercise: {
          title: 'Lab 1 — Hybrid CRUD Lifecycle',
          task: 'Build HybridCRUDTest.java with all 4 lifecycle steps. Run with mvn test -pl e2e-module and screenshot all 4 green.',
          hints: [
            'Store bookingId as a class field and set it in priority=1 — it is accessed by priorities 2, 3, and 4',
            'In priority=4 cleanup, the API delete will return 201 since you\'re deleting via API — so the GET immediately after should return 404',
            'Use try/catch in @AfterClass cleanup since the booking may already be deleted by test 4'
          ]
        },
        quiz: []
      },

      {
        id: 'e2e-lab-2',
        title: 'Lab 2 — Cross-Browser Parallel Run',
        type: 'lab',
        duration: '45 min',
        content: `
## 🧪 Lab 2 — Cross-Browser Parallel Run on Selenium Grid

**Goal:** Run 6 E2E tests simultaneously on Chrome and Firefox via Selenium Grid.

### Setup

\`\`\`bash
docker compose up -d
# Verify: open http://localhost:4444 → Grid UI shows Chrome + Firefox nodes
\`\`\`

### Your Task

1. Create 3 test classes (2 methods each = 6 total):
   - \`BookingCreationE2ETest\` — 2 "create via API → verify in UI" tests
   - \`BookingUpdateE2ETest\` — 2 "edit via UI → assert via API" tests
   - \`BookingSearchE2ETest\` — 2 "search by name → verify count via API" tests

2. Configure testng.xml:
\`\`\`xml
<suite name="E2E Grid Suite" parallel="methods" thread-count="6">
  <test name="E2E Tests">
    <classes>
      <class name="tests.BookingCreationE2ETest"/>
      <class name="tests.BookingUpdateE2ETest"/>
      <class name="tests.BookingSearchE2ETest"/>
    </classes>
  </test>
</suite>
\`\`\`

3. Run on Grid — Chrome:
\`\`\`bash
mvn clean test -pl e2e-module -Dgrid.url=http://localhost:4444 -Dbrowser=chrome
\`\`\`

4. Run on Grid — Firefox:
\`\`\`bash
mvn clean test -pl e2e-module -Dgrid.url=http://localhost:4444 -Dbrowser=firefox
\`\`\`

5. Watch the Grid UI (http://localhost:4444) while tests run — you should see up to 3 active sessions simultaneously.

### Acceptance Criteria

- [ ] All 6 tests pass on Chrome
- [ ] All 6 tests pass on Firefox
- [ ] Grid UI shows multiple concurrent active sessions while tests run
- [ ] No race conditions (each test creates and owns its own booking ID)
- [ ] Screenshot: Grid UI showing 3 concurrent sessions + terminal showing 6 tests passed
`,
        exercise: {
          title: 'Lab 2 — Cross-Browser Parallel Run',
          task: 'Run 6 E2E tests in parallel on Selenium Grid — Chrome and Firefox. Screenshot the Grid UI with multiple active sessions.',
          hints: [
            'Ensure each test creates its OWN booking in @BeforeMethod and deletes it in @AfterMethod — no shared booking IDs',
            'SE_NODE_MAX_SESSIONS=3 in docker-compose.yml means max 3 Chrome sessions at once — with 6 tests and 4 threads, some will queue briefly',
            'If Firefox tests fail with "session not created", the Firefox node may still be starting — add a longer wait in CI'
          ]
        },
        quiz: []
      },

      {
        id: 'e2e-lab-3',
        title: 'Lab 3 — Allure Report Deep Dive',
        type: 'lab',
        duration: '30 min',
        content: `
## 🧪 Lab 3 — Allure Report Deep Dive

**Goal:** Produce a fully instrumented Allure report for the complete E2E suite and read it like a senior QA engineer would.

### Your Task

1. Run the full suite:
\`\`\`bash
mvn clean test -pl e2e-module
mvn allure:serve -pl e2e-module
\`\`\`

2. In the Allure report, find and screenshot:
   a. **Overview** — total passed/failed/skipped, duration, trend (if you have history)
   b. **Suites** tab — expand a test class and show the @Step chain for one passing test
   c. **Behaviors** tab — show the Epic → Feature → Story hierarchy you built
   d. **Categories** tab — shows test failure categories (product bugs vs test defects)
   e. A **failing test** with attached screenshot and REST Assured request/response log

3. Deliberately break one test:
   - Change an assertion from \`equalTo("Alice")\` to \`equalTo("WRONG")\`
   - Run again
   - In the Allure report, find the failure and confirm:
     - Screenshot is attached
     - The @Step chain shows exactly which step failed
     - The REST Assured request/response is attached
   - Fix the test back to passing

### What to Look For in the Report

| Report Section | What to verify |
|---|---|
| Overview | Pass rate > 90% for a healthy suite |
| Suites | Each test shows a clean @Step chain — no steps = poor instrumentation |
| Behaviors | Tests organised by Epic/Feature/Story — easier for PMs to read |
| Categories | "Product defects" = app is broken; "Test defects" = test code needs fixing |
| Timeline | Shows parallel execution — threads running simultaneously |

### Acceptance Criteria

- [ ] Screenshots of all 5 report sections listed above
- [ ] Failing test shows screenshot + REST Assured log attached
- [ ] @Step chain shows the full API + UI flow
- [ ] Fixed test passes again
`,
        exercise: {
          title: 'Lab 3 — Allure Report Analysis',
          task: 'Run the full suite, produce an Allure report, and screenshot all 5 sections. Deliberately break a test and show the failure evidence in Allure.',
          hints: [
            'The Timeline tab is only interesting when parallel=true — run with thread-count > 1 to see overlapping bars',
            'Categories are auto-populated based on exception type — NullPointerException becomes "Product bug", AssertionError becomes "Test defect"',
            'To keep Allure history (trend chart), copy the allure-results folder before each run and pass it as allure-history'
          ]
        },
        quiz: []
      },

      {
        id: 'e2e-capstone',
        title: 'Capstone — Ship the Complete Test Pyramid to GitHub Actions',
        type: 'lab',
        duration: '90 min',
        content: `
## 🎯 Capstone — Ship the Complete Test Pyramid

**This is your final project.** Ship a production-ready multi-module test pyramid to GitHub with a full CI pipeline.

---

### What to Build

A GitHub repository named \`restful-booker-e2e\` containing:

**Source Code:**
- \`common/\` — DriverManager, ScreenshotListener, ConfigReader, JsonDataReader
- \`api-module/\` — HealthCheckTest, BookingCRUDTest, AuthTests, BookingDataDrivenTest
- \`ui-module/\` — UiBaseTest, Page Objects, 3+ UI tests
- \`e2e-module/\` — E2EBaseTest, APIClient, ApiSetupUiVerifyTest, UiActionApiAssertTest, DataDrivenE2ETest, HybridCRUDTest

**CI/CD:**
- \`.github/workflows/test-pyramid.yml\` — 3 jobs: api-tests, e2e-tests (Chrome + Firefox matrix), publish-report
- \`docker-compose.yml\` — Selenium Grid with Chrome + Firefox nodes

**Documentation:**
- \`README.md\` explaining:
  - How to run locally: \`mvn test\` vs \`mvn test -pl api-module\` vs Docker Grid
  - How to read the Allure report
  - Test architecture diagram (API layer → UI layer → E2E layer)

---

### Acceptance Criteria

**Code:**
- [ ] All modules compile: \`mvn clean install -DskipTests\` succeeds
- [ ] API tests pass: \`mvn test -pl api-module\` — all green
- [ ] E2E tests pass locally: \`mvn test -pl e2e-module\`
- [ ] No static WebDriver fields — ThreadLocal used throughout
- [ ] All tests create and clean up their own data (no test pollution)

**CI Pipeline:**
- [ ] GitHub Actions workflow runs on push to main
- [ ] api-tests job completes before e2e-tests starts
- [ ] e2e-tests matrix runs Chrome AND Firefox in parallel
- [ ] Allure report publishes to GitHub Pages
- [ ] GitHub Pages report is publicly accessible at your GitHub Pages URL

**Report Quality:**
- [ ] @Epic, @Feature, @Story on every test class and method
- [ ] @Step on every helper method
- [ ] Screenshots attached on failure (ScreenshotListener)
- [ ] REST Assured logs attached (AllureRestAssured filter)

---

### Final Screenshots Required

1. GitHub Actions — all 3 jobs green (api-tests, e2e-tests-chrome, e2e-tests-firefox, publish-report)
2. Allure Overview page on GitHub Pages — showing tests from all 3 layers
3. Allure Behaviors tab — showing Epic → Feature → Story hierarchy
4. Allure timeline showing parallel execution
5. Grid UI (http://localhost:4444) — showing 2+ active sessions during local run
6. IntelliJ Maven panel — all 4 modules visible (common, api-module, ui-module, e2e-module)

---

### Sharing Your Work

Once your pipeline is green, share:
- The GitHub repo URL (public)
- The GitHub Pages Allure report URL
- Screenshots of the 6 items above

**Congratulations — you have built a production-grade test pyramid framework.** 🎉
`,
        exercise: {
          title: 'Capstone — Complete Test Pyramid Pipeline',
          task: 'Ship the full multi-module project to GitHub with a working CI pipeline, Docker Grid, and Allure report on GitHub Pages.',
          hints: [
            'Start with "mvn clean install -DskipTests" and fix all compile errors before attempting to run tests',
            'Push a branch first and verify the workflow runs before merging to main',
            'GitHub Pages must be enabled in repo Settings → Pages → Source: Deploy from branch → gh-pages'
          ]
        },
        quiz: []
      }
    ]
  }
];

// Push labs as a module into E2E_CURRICULUM
E2E_CURRICULUM.push(...E2E_CURRICULUM_LABS);
