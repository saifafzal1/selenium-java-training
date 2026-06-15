// Auto-merged into PLAYWRIGHT_CURRICULUM on load
const PLAYWRIGHT_LABS = [
  {
    id: 'pw-lab-1',
    title: 'Lab 1: SauceDemo Login Suite with POM',
    type: 'lab',
    duration: '45 min',
    difficulty: 'Beginner',
    description: 'Build a complete Login test suite using Page Object Model against SauceDemo. Covers 3 login scenarios, proper locators, and assertions.',
    content: `
## 🏆 Lab 1: SauceDemo Login Suite with POM

**Goal:** Build a production-quality login test suite using the Page Object Model pattern.

---

### What You'll Build

\`\`\`
playwright-lab1/
├── pages/
│   └── LoginPage.js
├── tests/
│   └── login.spec.js
├── playwright.config.js
└── package.json
\`\`\`

---

### Requirements

**LoginPage.js must have:**
- \`goto()\` method that navigates to https://www.saucedemo.com
- \`login(username, password)\` method
- \`errorMessage\` locator property (getter)
- All locators using Playwright best-practice methods (getByRole, getByPlaceholder)

**login.spec.js must have:**
- A \`test.describe('Login')\` block
- \`beforeEach\` that uses LoginPage.goto()
- Test 1: successful login → assert URL contains /inventory
- Test 2: locked_out_user → assert error message text
- Test 3: wrong password → assert credential error text
- No locators directly in the test file — all through LoginPage

---

### Step-by-Step

**1. Set up the project:**
\`\`\`bash
mkdir playwright-lab1 && cd playwright-lab1
npm init -y
npm install --save-dev @playwright/test
npx playwright install chromium
\`\`\`

**2. Create playwright.config.js:**
\`\`\`javascript
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  use: {
    headless: false,
    slowMo: 300,
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ]
});
\`\`\`

**3. Build LoginPage.js in pages/ folder**

**4. Build login.spec.js in tests/ folder**

**5. Run:**
\`\`\`bash
npx playwright test --headed
npx playwright show-report
\`\`\`

---

### Hints

- The error banner on SauceDemo is an \`h3\` inside a div with class \`error-message-container\`
- Use \`getByRole('heading', { level: 3 })\` for the error message
- Use \`getByPlaceholder()\` for the username and password inputs
- Use \`getByRole('button', { name: 'Login' })\` for the button
    `,
    rubric: [
      { criterion: 'LoginPage.js exists in pages/ folder', points: 10 },
      { criterion: 'LoginPage has goto(), login() methods and errorMessage getter', points: 15 },
      { criterion: 'All locators use getByRole/getByPlaceholder (no CSS ID locators)', points: 10 },
      { criterion: 'test.describe block wraps all tests', points: 5 },
      { criterion: 'beforeEach navigates using loginPage.goto()', points: 10 },
      { criterion: 'Test 1: successful login asserts URL matches /inventory/', points: 15 },
      { criterion: 'Test 2: locked_out_user asserts correct error text', points: 15 },
      { criterion: 'Test 3: wrong password asserts credential mismatch text', points: 15 },
      { criterion: 'No raw locators exist in the test file', points: 5 },
    ],
    evaluationPrompt: `You are a Playwright automation expert reviewing a student's Lab 1 submission.

The student was asked to build a SauceDemo login test suite using Page Object Model.

Requirements:
- pages/LoginPage.js with goto(), login(username, password), errorMessage getter
- tests/login.spec.js with describe block, beforeEach, 3 tests
- Locators use getByRole/getByPlaceholder (not raw CSS IDs like #user-name)
- No locators in the test file — all through LoginPage

Evaluate the student's code and explanation. Give a score out of 100 based on the rubric, and specific feedback on what's correct, what's missing, and how to improve.`
  },

  {
    id: 'pw-lab-2',
    title: 'Lab 2: Custom Fixtures + Auth State',
    type: 'lab',
    duration: '50 min',
    difficulty: 'Intermediate',
    description: 'Build a custom auth fixture that handles SauceDemo login, then use it across multiple test files without any login code in the tests.',
    content: `
## 🏆 Lab 2: Custom Fixtures + Auth State

**Goal:** Create a reusable auth fixture and write tests that use it — no login code in any test file.

---

### What You'll Build

\`\`\`
playwright-lab2/
├── pages/
│   ├── LoginPage.js
│   └── InventoryPage.js
├── fixtures/
│   └── auth.js
├── tests/
│   ├── login.spec.js      (uses loginPage fixture)
│   └── inventory.spec.js  (uses inventoryPage fixture)
├── playwright.config.js
└── package.json
\`\`\`

---

### Requirements

**fixtures/auth.js must:**
- Extend Playwright's base \`test\`
- Define \`loginPage\` fixture returning a LoginPage instance
- Define \`loggedInPage\` fixture that performs full login
- Define \`inventoryPage\` fixture (depends on loggedInPage) returning InventoryPage instance
- Export the extended \`test\` and re-export \`expect\`

**InventoryPage.js must have:**
- \`heading\` locator
- \`addToCartButtons\` locator
- \`cartBadge\` locator
- \`addFirstItemToCart()\` action method

**inventory.spec.js must:**
- Import \`test\` from fixtures/auth.js (NOT from @playwright/test directly)
- Have 2 tests using \`inventoryPage\` fixture:
  1. Assert exactly 6 "Add to cart" buttons
  2. Add to cart → assert badge shows "1"
- Have NO login code in the file

---

### The Fixture Pattern

\`\`\`javascript
// fixtures/auth.js
const { test: base, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');

const test = base.extend({
  loginPage: async ({ page }, use) => {
    // YOUR CODE HERE
  },
  loggedInPage: async ({ page }, use) => {
    // YOUR CODE HERE — perform login
  },
  inventoryPage: async ({ loggedInPage }, use) => {
    // YOUR CODE HERE — depends on loggedInPage
  }
});

module.exports = { test, expect };
\`\`\`

---

### Run & Verify

\`\`\`bash
npx playwright test --headed
\`\`\`

All 4+ tests should pass. The browser should open already on the inventory page for inventory tests — no login steps visible.
    `,
    rubric: [
      { criterion: 'fixtures/auth.js exists and extends base test', points: 10 },
      { criterion: 'loggedInPage fixture performs full login without parameters', points: 20 },
      { criterion: 'inventoryPage fixture depends on loggedInPage (not page)', points: 15 },
      { criterion: 'InventoryPage.js has heading, addToCartButtons, cartBadge locators', points: 15 },
      { criterion: 'inventory.spec.js imports test from fixtures/auth.js', points: 10 },
      { criterion: 'Test: 6 Add to cart buttons visible', points: 15 },
      { criterion: 'Test: Add to cart → badge shows "1"', points: 15 },
    ],
    evaluationPrompt: `You are a Playwright expert reviewing Lab 2: Custom Fixtures.

The student built a custom auth fixture system for SauceDemo. Evaluate:
1. Does fixtures/auth.js correctly extend base test with 3 fixtures?
2. Does loggedInPage perform a real login?
3. Does inventoryPage depend on loggedInPage (not page)?
4. Do inventory tests import from the fixture file, not @playwright/test?
5. Is no login code present in the test files?

Score out of 100. Give detailed feedback on each point.`
  },

  {
    id: 'pw-lab-3',
    title: 'Lab 3: API Testing with Request Builders',
    type: 'lab',
    duration: '50 min',
    difficulty: 'Intermediate',
    description: 'Build a complete API test suite for reqres.in using the Request Builder pattern for all 4 CRUD operations.',
    content: `
## 🏆 Lab 3: API Testing with Request Builders

**Goal:** Build a full CRUD API test suite using the Request Builder pattern against reqres.in.

---

### What You'll Build

\`\`\`
playwright-lab3/
├── src/
│   └── requestBuilders/
│       └── users/
│           ├── CreateUserRequestBuilder.js
│           ├── GetUserRequestBuilder.js
│           ├── UpdateUserRequestBuilder.js
│           └── DeleteUserRequestBuilder.js
├── tests/
│   └── api/
│       ├── createUser.spec.js
│       ├── getUser.spec.js
│       ├── updateUser.spec.js
│       └── deleteUser.spec.js
├── playwright.config.js
└── package.json
\`\`\`

---

### Requirements

**Each Request Builder must:**
- Accept \`request\` as constructor argument
- Have fluent setters (return \`this\`) for each field
- Have an \`execute()\` async method that makes the HTTP call
- Log \`[REQUEST]\` and \`[RESPONSE]\` to console

**createUser.spec.js must have:**
- Test: status 201 with name + job
- Test: body contains name, job, id, createdAt
- Test: create with name only
- Test: data-driven — loop over 3 different users

**getUser.spec.js must have:**
- Test: GET /api/users/2 returns 200
- Test: response body has correct structure (data.id, data.email)

**updateUser.spec.js must have:**
- Test: PUT /api/users/2 returns 200
- Test: updatedAt is present in response

**deleteUser.spec.js must have:**
- Test: DELETE /api/users/2 returns 204
- Test: response body is empty

---

### The Builder Pattern

\`\`\`javascript
// Usage in tests:
const response = await new CreateUserRequestBuilder(request)
  .withName('Saif')
  .withJob('QA Lead')
  .execute();

expect(response.status()).toBe(201);
\`\`\`

---

### Run All API Tests

\`\`\`bash
npx playwright test tests/api/
\`\`\`

All tests should pass. reqres.in is a public mock API — it accepts all requests.
    `,
    rubric: [
      { criterion: 'All 4 Request Builder files exist in correct folder', points: 10 },
      { criterion: 'Each builder has fluent setters returning this', points: 15 },
      { criterion: 'Each execute() logs REQUEST and RESPONSE', points: 5 },
      { criterion: 'CreateUser: status 201 test passes', points: 10 },
      { criterion: 'CreateUser: body assertions use expect.soft()', points: 10 },
      { criterion: 'CreateUser: data-driven test loops over 3+ users', points: 15 },
      { criterion: 'GetUser: 200 status and body structure assertions', points: 10 },
      { criterion: 'UpdateUser: 200 status and updatedAt present', points: 10 },
      { criterion: 'DeleteUser: 204 status and empty body', points: 10 },
      { criterion: 'All tests pass (no failures)', points: 5 },
    ],
    evaluationPrompt: `You are a Playwright API testing expert reviewing Lab 3.

The student built a Request Builder pattern for reqres.in CRUD operations. Evaluate:
1. Do all 4 builders follow the fluent pattern (returning this from setters)?
2. Does execute() make the correct HTTP method?
3. Are tests comprehensive (status + body + edge cases)?
4. Is data-driven testing implemented correctly?
5. Are soft assertions used for body field checks?

Score out of 100 with specific feedback.`
  },

  {
    id: 'pw-lab-4',
    title: 'Lab 4: Hybrid Test Suite',
    type: 'lab',
    duration: '45 min',
    difficulty: 'Advanced',
    description: 'Combine API and UI testing in one test suite. Seed data via API, verify in the browser, clean up via API.',
    content: `
## 🏆 Lab 4: Hybrid Test Suite

**Goal:** Write tests that combine API calls and browser interaction in a single test file, demonstrating the "back door / front door" pattern.

---

### What You'll Build

\`\`\`
playwright-lab4/
├── src/
│   └── requestBuilders/
│       └── users/
│           └── CreateUserRequestBuilder.js
├── tests/
│   └── hybrid/
│       ├── hybrid-example.spec.js
│       └── data-driven-hybrid.spec.js
├── playwright.config.js
└── package.json
\`\`\`

---

### Requirements

**hybrid-example.spec.js must have:**
- A detailed comment block at the top explaining: what hybrid tests are, why they're faster, the "back door / front door" metaphor
- Test: \`@api @e2e\` — create user via API (POST), assert 201, then open browser to reqres.in and assert title
- Uses \`async ({ request, page })\` — both fixtures in one test
- Console.log of the created user's id and name

**data-driven-hybrid.spec.js must have:**
- Data array of 3+ users (name + job)
- For loop generating one test per user
- Each test: creates user via API, asserts status + body fields, then navigates browser to a URL
- All body assertions use \`expect.soft()\`
- All tests tagged with \`@api\` in the name

---

### The Pattern to Demonstrate

\`\`\`javascript
test('@api @e2e Seed user via API then verify UI', async ({ request, page }) => {
  // PART 1 — API (fast, no browser)
  const response = await new CreateUserRequestBuilder(request)
    .withName('...')
    .withJob('...')
    .execute();

  // ... assert API response ...

  // PART 2 — UI (browser opens here)
  await page.goto('...');
  await expect(page).toHaveTitle(/.../);
});
\`\`\`

---

### Evaluation Criteria

Your submission should answer these questions in comments:
1. **Why is API setup faster than UI setup?**
2. **What is the "back door"? What is the "front door"?**
3. **When would you NOT use hybrid tests?**
    `,
    rubric: [
      { criterion: 'Comment block explains hybrid test concept clearly', points: 15 },
      { criterion: 'Test uses both request AND page fixtures', points: 15 },
      { criterion: 'API part creates user and asserts status 201', points: 15 },
      { criterion: 'UI part navigates browser and asserts page title', points: 15 },
      { criterion: 'Console.log shows created user id and name', points: 5 },
      { criterion: 'Data-driven test loops over 3+ users', points: 15 },
      { criterion: 'All body assertions use expect.soft()', points: 10 },
      { criterion: 'Tests tagged with @api in test name', points: 5 },
      { criterion: 'Code comments explain the "back door / front door" concept', points: 5 },
    ],
    evaluationPrompt: `You are a Playwright expert reviewing Lab 4: Hybrid Tests.

The student wrote tests combining API and UI. Evaluate:
1. Does the test correctly use both request and page fixtures?
2. Is the API "seed" part separated from the UI "verify" part with comments?
3. Does the data-driven loop work correctly?
4. Are soft assertions used for all body checks?
5. Is the comment block clear and educational?
6. Does the student demonstrate understanding of WHY hybrid tests are faster?

Score out of 100 with detailed feedback.`
  },

  {
    id: 'pw-lab-5',
    title: 'Lab 5: Full Framework — Config, Tags, CI & Report',
    type: 'lab',
    duration: '60 min',
    difficulty: 'Advanced',
    description: 'Assemble a production-ready Playwright framework with environment config, dotenv, test tags, GitHub Actions CI, and HTML reporting.',
    content: `
## 🏆 Lab 5: Full Framework

**Goal:** Bring everything together into a professional, deployable Playwright framework.

---

### What You'll Build

\`\`\`
playwright-lab5/
├── .env                          ← environment variables
├── .gitignore                    ← ignore .env and node_modules
├── .github/
│   └── workflows/
│       └── playwright.yml        ← CI pipeline
├── src/
│   └── requestBuilders/users/   ← all 4 builders
├── pages/
│   ├── LoginPage.js
│   └── InventoryPage.js
├── fixtures/
│   └── auth.js
├── tests/
│   ├── login.spec.js            ← @smoke tagged
│   ├── inventory.spec.js        ← @smoke tagged
│   └── api/
│       └── users.spec.js        ← @api tagged
├── playwright-report/
├── playwright.config.js         ← reads from .env, configures everything
└── package.json
\`\`\`

---

### Requirements

**playwright.config.js must:**
- Use \`require('dotenv').config()\`
- Set \`baseURL\` from \`process.env.BASE_URL\`
- Set \`headless: !!process.env.CI\`
- Set \`retries: process.env.CI ? 2 : 0\`
- Set \`workers: process.env.CI ? 1 : 3\`
- Configure \`trace: 'on-first-retry'\`
- Configure \`screenshot: 'only-on-failure'\`
- Include Chromium, Firefox and WebKit projects
- Set \`forbidOnly: !!process.env.CI\`

**.env file must have:**
\`\`\`
BASE_URL=https://www.saucedemo.com
TEST_USER=standard_user
TEST_PASS=secret_sauce
\`\`\`

**Tests must be tagged:**
- Login tests: \`@smoke\` in the name
- Inventory tests: \`@smoke\` in the name
- API tests: \`@api\` in the name

**GitHub Actions workflow must:**
- Trigger on push to main
- Install Node.js LTS
- Run \`npm ci\`
- Run \`npx playwright install --with-deps\`
- Run \`npx playwright test\`
- Upload playwright-report as artifact (retention: 30 days)

---

### Verification Steps

\`\`\`bash
# 1. Run only smoke tests
npx playwright test --grep "@smoke"

# 2. Run only API tests
npx playwright test --grep "@api"

# 3. Run all tests on chromium only
npx playwright test --project=chromium

# 4. Confirm .env variables are loaded
node -e "require('dotenv').config(); console.log(process.env.BASE_URL)"

# 5. Check .gitignore includes .env
cat .gitignore | grep .env
\`\`\`

---

### Deliverable Checklist

- [ ] All tests pass: \`npx playwright test\`
- [ ] Smoke subset runs: \`npx playwright test --grep "@smoke"\`
- [ ] API subset runs: \`npx playwright test --grep "@api"\`
- [ ] .env is in .gitignore
- [ ] playwright.config.js reads from environment variables
- [ ] GitHub Actions workflow file exists
- [ ] HTML report generates: \`npx playwright show-report\`
    `,
    rubric: [
      { criterion: 'playwright.config.js uses dotenv and process.env correctly', points: 15 },
      { criterion: 'headless, retries, workers, forbidOnly all use CI env var', points: 10 },
      { criterion: 'trace and screenshot configured correctly', points: 5 },
      { criterion: 'All 3 browser projects configured', points: 5 },
      { criterion: 'Login tests tagged @smoke', points: 5 },
      { criterion: 'Inventory tests tagged @smoke', points: 5 },
      { criterion: 'API tests tagged @api', points: 5 },
      { criterion: '.env file exists with BASE_URL, TEST_USER, TEST_PASS', points: 5 },
      { criterion: '.gitignore includes .env', points: 5 },
      { criterion: 'GitHub Actions YAML file is complete and correct', points: 15 },
      { criterion: 'npx playwright test --grep "@smoke" runs only smoke tests', points: 10 },
      { criterion: 'All tests pass end-to-end', points: 15 },
    ],
    evaluationPrompt: `You are a senior Playwright engineer reviewing Lab 5: Full Framework.

The student assembled a complete production-ready Playwright framework. Evaluate:
1. Does playwright.config.js correctly use dotenv and all process.env variables?
2. Are CI-specific settings (headless, retries, workers, forbidOnly) all gated on process.env.CI?
3. Are all 3 browser projects configured?
4. Are tests properly tagged (@smoke, @api)?
5. Is the GitHub Actions YAML complete (checkout, node setup, install, test, upload artifact)?
6. Is .env in .gitignore?
7. Does the HTML report generate?

Score out of 100. This is the capstone — be thorough in your feedback.`
  }
];

if (typeof PLAYWRIGHT_CURRICULUM !== "undefined") {
  PLAYWRIGHT_CURRICULUM.push(...PLAYWRIGHT_LABS);
}
