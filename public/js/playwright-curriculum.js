const PLAYWRIGHT_CURRICULUM = [
  // ── Module 0: Before You Start ─────────────────────────────
  {
    id: 'pw-module-0',
    title: 'Before You Start',
    icon: '👋',
    lessons: [
      {
        id: 'pw-l0',
        title: 'Welcome: Why Playwright in 2025?',
        type: 'intro',
        duration: '10 min',
        whatYoullLearn: [
          'What Playwright is and how it compares to Selenium',
          'Why Playwright became the industry favourite',
          'What you will build by the end of this course',
          'The full 7-module roadmap',
          'Tools you need to get started'
        ],
        content: `
## 👋 Welcome to Playwright Training!

If you've heard of Playwright but not tried it yet, you're in the right place. And if you're coming from Selenium, you'll feel right at home — but faster.

---

### 🤔 Why Playwright?

Playwright was built by the same team that created Puppeteer at Google. Microsoft took it, rebuilt it from scratch, and open-sourced it. Today it's the fastest-growing test automation framework in the world.

Here's the honest comparison:

| Feature | Selenium | Playwright |
|---|---|---|
| Browser support | Chrome, Firefox, Edge, Safari | Chrome, Firefox, WebKit (Safari engine) |
| Setup time | 15–30 min | 2 min |
| Auto-waiting | ❌ You manage it | ✅ Built-in |
| Speed | Medium | Fast |
| API testing | ❌ Not built-in | ✅ Built-in |
| Trace viewer | ❌ | ✅ Full UI debugger |
| Parallel testing | Requires config | ✅ Out of the box |
| Language | Java, Python, JS, C# | JS/TS, Python, Java, C# |

---

### 🔍 What Does Playwright Code Look Like?

\`\`\`javascript
import { test, expect } from '@playwright/test';

test('login navigates to inventory', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/inventory/);
});
\`\`\`

Clean. Readable. No driver setup. No waits to manage.

---

### 🗺️ Your 7-Module Roadmap

| Module | Topic | Lessons |
|---|---|---|
| 0 | Before You Start | 1 |
| 1 | JavaScript & Node.js Essentials | 3 |
| 2 | Playwright Basics | 4 |
| 3 | Intermediate Playwright | 3 |
| 4 | Design Patterns | 3 |
| 5 | API Testing | 2 |
| 6 | Framework & Advanced | 2 |
| 7 | Capstone Labs | 5 |

---

### 🛠️ What You'll Build

By the end you'll have a **professional Playwright framework** covering:
- **UI tests** across Chrome, Firefox and WebKit
- **Page Object Model** — the same industry standard used in Selenium
- **Custom Fixtures** — Playwright's superpower for test setup
- **API tests** — test your backend without a browser
- **Hybrid tests** — seed data via API, verify via UI
- **CI/CD** — GitHub Actions running on every push

Let's start building.
        `,
        exercise: {
          title: 'Reflection: Your Automation Journey',
          description: 'Before writing code, write down 3 repetitive test scenarios at work that you\'d like to automate with Playwright. Think: login flows, form submissions, search results. You\'ll use these as your practice targets throughout the course.',
          hint: 'Pick scenarios you test manually every sprint. The more repetitive, the better the automation candidate.'
        },
        quiz: [
          { q: 'Who originally created Playwright?', options: ['Google (Puppeteer team) then Microsoft', 'Selenium team', 'Jest team', 'Facebook'], answer: 0 },
          { q: 'Which is NOT a built-in Playwright feature?', options: ['Auto-waiting', 'API testing', 'Selenium Grid integration', 'Trace viewer'], answer: 2 },
          { q: 'Playwright\'s WebKit engine allows testing on which browser?', options: ['Internet Explorer', 'Safari-equivalent', 'Opera', 'Brave'], answer: 1 }
        ]
      }
    ]
  },

  // ── Module 1: JavaScript & Node.js Essentials ───────────────
  {
    id: 'pw-module-1',
    title: 'JavaScript & Node.js Essentials',
    icon: '📦',
    lessons: [
      {
        id: 'pw-l1',
        title: 'Project Setup: Node.js, npm & Playwright Install',
        type: 'lesson',
        duration: '20 min',
        whatYoullLearn: [
          'Install Node.js and verify your environment',
          'Create a Playwright project with npm init',
          'Understand package.json and node_modules',
          'Install Playwright browsers with one command',
          'Run your first test from the terminal'
        ],
        content: `
## 🛠️ Project Setup

Playwright runs on Node.js. You need Node 18 or higher.

---

### Step 1: Install Node.js

Download from [nodejs.org](https://nodejs.org) — choose the LTS version.

Verify:
\`\`\`bash
node --version   # v18.0.0 or higher
npm --version    # 9.0.0 or higher
\`\`\`

---

### Step 2: Create Your Project

\`\`\`bash
mkdir my-playwright-tests
cd my-playwright-tests
npm init -y
\`\`\`

This creates **package.json** — the configuration file for your project. Think of it like Maven's pom.xml.

\`\`\`json
{
  "name": "my-playwright-tests",
  "version": "1.0.0",
  "type": "commonjs"
}
\`\`\`

---

### Step 3: Install Playwright

\`\`\`bash
npm install --save-dev @playwright/test
npx playwright install
\`\`\`

The second command downloads Chromium, Firefox and WebKit browsers (~300MB). This only runs once.

---

### Step 4: Create playwright.config.js

\`\`\`javascript
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: 0,
  workers: 3,
  reporter: 'html',
  use: {
    headless: false,   // show the browser window
    slowMo: 500,       // slow down so you can see what's happening
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],
});
\`\`\`

---

### Step 5: Your First Test File

Create \`tests/hello.spec.js\`:

\`\`\`javascript
const { test, expect } = require('@playwright/test');

test('Playwright.dev has correct title', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});
\`\`\`

Run it:
\`\`\`bash
npx playwright test
\`\`\`

View the HTML report:
\`\`\`bash
npx playwright show-report
\`\`\`

---

### 📁 Project Structure

\`\`\`
my-playwright-tests/
├── tests/              ← your test files go here
├── playwright.config.js
├── package.json
└── node_modules/       ← installed packages (never edit manually)
\`\`\`

---

### ⚡ Key Commands

| Command | What it does |
|---|---|
| \`npx playwright test\` | Run all tests |
| \`npx playwright test --headed\` | Run with browser visible |
| \`npx playwright test --project=chromium\` | Run on one browser |
| \`npx playwright test login.spec.js\` | Run one file |
| \`npx playwright show-report\` | Open HTML report |
| \`npx playwright codegen https://saucedemo.com\` | Record a test by clicking |
        `,
        exercise: {
          title: 'Exercise: Set Up Your Playwright Project',
          description: `1. Install Node.js 18+ if not already done
2. Create a new folder called \`playwright-training\`
3. Run \`npm init -y\` and install Playwright
4. Create playwright.config.js with Chrome, Firefox and WebKit projects
5. Write a test that navigates to https://playwright.dev/ and asserts the title contains "Playwright"
6. Run \`npx playwright test --headed\` and watch it execute`,
          hint: 'If you get an error about browsers, run `npx playwright install` again.'
        },
        quiz: [
          { q: 'What command installs Playwright browsers?', options: ['npm install browsers', 'npx playwright install', 'npx playwright browsers', 'npm run install:playwright'], answer: 1 },
          { q: 'What is playwright.config.js equivalent to in a Selenium/Maven project?', options: ['TestNG.xml', 'pom.xml', 'Both — config + runner combined', 'None of the above'], answer: 2 },
          { q: 'Which Node.js version is the minimum required for Playwright?', options: ['Node 12', 'Node 14', 'Node 16', 'Node 18'], answer: 3 }
        ]
      },
      {
        id: 'pw-l2',
        title: 'JavaScript for Testers: Variables, Functions & Async/Await',
        type: 'lesson',
        duration: '25 min',
        whatYoullLearn: [
          'const vs let — when to use each',
          'Arrow functions — the short way to write functions',
          'Async/Await — why every Playwright action needs it',
          'Template literals — clean string building',
          'Destructuring — the pattern you\'ll see everywhere in Playwright'
        ],
        content: `
## 📝 JavaScript Essentials for Playwright

You don't need to be a JS expert. You need 6 concepts. That's it.

---

### 1. const and let

\`\`\`javascript
const username = 'standard_user';   // won't change — use const
let attempts = 0;                   // will change — use let

attempts = 1;          // ✅ fine
username = 'other';    // ❌ TypeError — can't reassign const
\`\`\`

**Rule:** Default to \`const\`. Use \`let\` only when you need to reassign.

---

### 2. Arrow Functions

\`\`\`javascript
// Old style
function add(a, b) {
  return a + b;
}

// Arrow function — same thing, shorter
const add = (a, b) => a + b;

// With a body
const greet = (name) => {
  const msg = \`Hello, \${name}!\`;
  return msg;
};
\`\`\`

In Playwright tests you'll see arrow functions constantly:
\`\`\`javascript
test('my test', async ({ page }) => {
  // this is an arrow function!
});
\`\`\`

---

### 3. Async/Await — The Most Important Concept

Browser actions take time. Clicking a button, loading a page, waiting for a response — all async.

\`\`\`javascript
// Without await — WRONG, doesn't wait
test('bad test', async ({ page }) => {
  page.goto('https://saucedemo.com');   // starts but doesn't wait
  page.click('#login-button');           // might run before page loads!
});

// With await — CORRECT, waits for each step
test('good test', async ({ page }) => {
  await page.goto('https://saucedemo.com');   // waits until fully loaded
  await page.click('#login-button');           // then clicks
});
\`\`\`

**Rule: Every Playwright action must have \`await\` in front of it.**

---

### 4. Template Literals

\`\`\`javascript
const user = 'Saif';
const role = 'QA Lead';

// Old way
const msg = 'Hello ' + user + ', you are a ' + role;

// Template literal — cleaner
const msg = \`Hello \${user}, you are a \${role}\`;

// Multi-line
const query = \`
  SELECT *
  FROM users
  WHERE name = '\${user}'
\`;
\`\`\`

---

### 5. Destructuring

You'll see this everywhere in Playwright. It's just a short way to pull values out of objects.

\`\`\`javascript
// Object destructuring
const user = { name: 'Saif', job: 'QA Lead', id: 42 };
const { name, job } = user;   // pull out name and job
console.log(name);            // 'Saif'

// In Playwright tests — this is destructuring the test fixtures:
test('example', async ({ page, request }) => {
  //                     ^^^^^^^^^^^^^ destructured from the fixture object
});
\`\`\`

---

### 6. Modules — import vs require

\`\`\`javascript
// CommonJS (older, package.json has "type": "commonjs")
const { test, expect } = require('@playwright/test');

// ESM (newer, package.json has "type": "module" or file is .mjs)
import { test, expect } from '@playwright/test';
\`\`\`

They do the same thing. Pick one style and be consistent. This course uses CommonJS.

---

### Putting It Together

\`\`\`javascript
const { test, expect } = require('@playwright/test');

// const for data that doesn't change
const BASE_URL = 'https://www.saucedemo.com';
const USERS = [
  { username: 'standard_user', password: 'secret_sauce' },
  { username: 'problem_user',  password: 'secret_sauce' },
];

// Template literal + destructuring in action
for (const { username, password } of USERS) {
  test(\`Login test for \${username}\`, async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByPlaceholder('Username').fill(username);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();
  });
}
\`\`\`
        `,
        exercise: {
          title: 'Exercise: JS Concepts in a Test',
          description: `Write a test file \`tests/js-practice.spec.js\` that:
1. Uses \`const\` to store the SauceDemo URL and login credentials
2. Uses a \`for...of\` loop to run the same login test for two different users: standard_user and problem_user
3. In each test, uses template literals in the test name: \`Login: \${username}\`
4. Uses \`await\` correctly on every Playwright action
5. Adds a \`console.log(\`Testing \${username}...\`)\` inside each test`,
          hint: 'Check the data-driven example at the bottom of the lesson. The for...of loop goes outside the test() call.'
        },
        quiz: [
          { q: 'What happens if you forget `await` before `page.goto()`?', options: ['It throws a syntax error', 'The test skips the step', 'The next line runs before the page loads', 'Nothing — Playwright handles it'], answer: 2 },
          { q: 'Which is the correct destructuring syntax?', options: ['const [page, request] = fixture', 'const { page, request } = fixture', 'const page, request = fixture', 'const (page, request) = fixture'], answer: 1 },
          { q: 'What does `const` prevent you from doing?', options: ['Changing object properties', 'Reassigning the variable binding', 'Using the variable in functions', 'Using the variable in loops'], answer: 1 }
        ]
      },
      {
        id: 'pw-l3',
        title: 'CommonJS vs ESM & Project Module System',
        type: 'lesson',
        duration: '15 min',
        whatYoullLearn: [
          'The difference between CommonJS and ES Modules',
          'How package.json "type" field controls which system is used',
          'Why mixing import and require breaks tests',
          'How to fix the most common module error beginners hit',
          'Best practice for a Playwright project'
        ],
        content: `
## 📦 Module Systems — The Thing That Trips Everyone Up

When you create a Playwright project, you'll hit a module error within the first hour if you're not careful. This lesson saves you that pain.

---

### The Two Systems

**CommonJS (CJS)** — Node.js default, older style:
\`\`\`javascript
const { test, expect } = require('@playwright/test');
module.exports = { MyClass };
\`\`\`

**ES Modules (ESM)** — Browser-native, modern style:
\`\`\`javascript
import { test, expect } from '@playwright/test';
export class MyClass {}
\`\`\`

---

### What Controls Which System You Use?

Your \`package.json\`:

\`\`\`json
{
  "type": "commonjs"   // → all .js files use require/module.exports
}
\`\`\`

\`\`\`json
{
  "type": "module"     // → all .js files use import/export
}
\`\`\`

If \`"type"\` is missing, Node defaults to \`"commonjs"\`.

---

### The Classic Mistake

You write your test with \`import\`:
\`\`\`javascript
// tests/login.spec.js
import { test, expect } from '@playwright/test';   // ESM style
\`\`\`

But your page object uses \`require\`:
\`\`\`javascript
// pages/LoginPage.js
const { expect } = require('@playwright/test');    // CJS style
module.exports = { LoginPage };
\`\`\`

And your \`package.json\` says \`"type": "commonjs"\`.

**Result:** \`SyntaxError: Cannot use import statement in a module\`

---

### The Fix

**Pick one system and use it everywhere.**

**Option A — Stay with CommonJS (recommended for beginners):**
\`\`\`json
// package.json
{ "type": "commonjs" }
\`\`\`
Then use \`require\`/\`module.exports\` everywhere.

**Option B — Use ESM throughout:**
\`\`\`json
// package.json
{ "type": "module" }
\`\`\`
Then use \`import\`/\`export\` everywhere.

---

### This Course Uses CommonJS

All examples in this course use \`require\`/\`module.exports\`. Your \`package.json\` should have:

\`\`\`json
{
  "name": "playwright-training",
  "version": "1.0.0",
  "type": "commonjs",
  "devDependencies": {
    "@playwright/test": "^1.45.0"
  }
}
\`\`\`

---

### Quick Reference

| | CommonJS | ES Module |
|---|---|---|
| Import | \`const x = require('...')\` | \`import x from '...'\` |
| Named import | \`const { a } = require('...')\` | \`import { a } from '...'\` |
| Export | \`module.exports = { x }\` | \`export { x }\` |
| Default export | \`module.exports = MyClass\` | \`export default MyClass\` |
| package.json | \`"type": "commonjs"\` | \`"type": "module"\` |
        `,
        exercise: {
          title: 'Exercise: Fix the Module Error',
          description: `You have a file with this error. Fix it:

\`\`\`javascript
// package.json has "type": "commonjs"

// tests/broken.spec.js
import { test, expect } from '@playwright/test';

test('broken test', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await expect(page).toHaveTitle(/Playwright/);
});
\`\`\`

Task: Fix it two ways — once using CommonJS require, once by changing package.json to ESM. Verify both run with \`npx playwright test tests/broken.spec.js\`.`,
          hint: 'The quickest fix is to change `import` to `const { test, expect } = require(\'@playwright/test\')`.'
        },
        quiz: [
          { q: 'What does `"type": "module"` in package.json do?', options: ['Makes all .js files use ESM import/export', 'Makes all .js files use require/module.exports', 'Only affects test files', 'Sets the Node.js version'], answer: 0 },
          { q: 'You get: SyntaxError: Cannot use import statement. Most likely cause?', options: ['Playwright not installed', 'import used in CJS project', 'Wrong Node version', 'Missing package.json'], answer: 1 },
          { q: 'CommonJS named export syntax is:', options: ['export { MyClass }', 'export default MyClass', 'module.exports = { MyClass }', 'exports MyClass'], answer: 2 }
        ]
      }
    ]
  },

  // ── Module 2: Playwright Basics ──────────────────────────────
  {
    id: 'pw-module-2',
    title: 'Playwright Basics',
    icon: '🎭',
    lessons: [
      {
        id: 'pw-l4',
        title: 'Your First Real Playwright Test',
        type: 'lesson',
        duration: '25 min',
        whatYoullLearn: [
          'The anatomy of a Playwright test file',
          'test() and test.describe() blocks',
          'beforeEach and afterEach hooks',
          'The page fixture — your browser window',
          'How to structure tests for readability'
        ],
        content: `
## 🎭 Your First Real Playwright Test

Let's write a proper test against SauceDemo — a site built specifically for automation practice.

---

### The Anatomy of a Test File

\`\`\`javascript
const { test, expect } = require('@playwright/test');

// describe groups related tests
test.describe('Login Feature', () => {

  // beforeEach runs before EVERY test in this describe block
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
  });

  // Each test() is one scenario
  test('successful login goes to inventory', async ({ page }) => {
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/inventory/);
  });

  test('locked out user sees error', async ({ page }) => {
    await page.getByPlaceholder('Username').fill('locked_out_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByRole('heading', { level: 3 }))
      .toContainText('Sorry, this user has been locked out');
  });

  test('wrong password shows credential mismatch error', async ({ page }) => {
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('wrong_pass');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByRole('heading', { level: 3 }))
      .toContainText('Username and password do not match');
  });

});
\`\`\`

---

### Key Concepts Broken Down

**\`test.describe()\`** — groups related tests. Optional but good practice. Appears as a section in your report.

**\`test.beforeEach()\`** — setup that runs before every test. Navigate to the page, set up test data, log in. Never put assertions here.

**\`async ({ page })\`** — \`page\` is a *fixture* — a built-in object Playwright injects. It represents one browser tab. You'll meet more fixtures later: \`request\`, \`context\`, \`browser\`.

**\`await\`** — every Playwright action is async. Without await, the action starts but you don't wait for it.

---

### Hooks

\`\`\`javascript
test.describe('My Suite', () => {

  test.beforeAll(async () => {
    // runs ONCE before all tests in this describe
    // good for: DB setup, API seeding
  });

  test.beforeEach(async ({ page }) => {
    // runs before EVERY test
    // good for: navigate, login
  });

  test.afterEach(async ({ page }) => {
    // runs after EVERY test
    // good for: take screenshot on fail, cleanup
  });

  test.afterAll(async () => {
    // runs ONCE after all tests
    // good for: DB teardown
  });

});
\`\`\`

---

### Running Specific Tests

\`\`\`bash
# Run only tests with "login" in name
npx playwright test --grep "login"

# Run only the first test
npx playwright test --grep "successful login"

# Mark a test as only (only this test runs) — don't commit this!
test.only('my test', async ({ page }) => { ... });

# Skip a test
test.skip('my test', async ({ page }) => { ... });
\`\`\`
        `,
        exercise: {
          title: 'Exercise: SauceDemo Login Suite',
          description: `Create \`tests/login.spec.js\` with a describe block containing:
1. A \`beforeEach\` that navigates to https://www.saucedemo.com
2. Test 1: successful login → assert URL contains /inventory
3. Test 2: locked_out_user → assert error message appears
4. Test 3: invalid password → assert credential mismatch message

Run with \`npx playwright test tests/login.spec.js --headed\` to see it in action.`,
          hint: 'The error message on SauceDemo is inside an h3 element. Use `page.getByRole(\'heading\', { level: 3 })`.'
        },
        quiz: [
          { q: 'What does beforeEach do?', options: ['Runs once before the describe block', 'Runs before every test in the block', 'Runs after every test', 'Runs once after all tests'], answer: 1 },
          { q: 'What is `page` in `async ({ page })`?', options: ['A global variable', 'A Playwright fixture', 'An imported class', 'A configuration object'], answer: 1 },
          { q: 'test.only() means:', options: ['This test is the most important', 'Only this test runs, all others skipped', 'This test runs first', 'This test cannot be skipped'], answer: 1 }
        ]
      },
      {
        id: 'pw-l5',
        title: 'Locator Strategies — Finding Elements',
        type: 'lesson',
        duration: '30 min',
        whatYoullLearn: [
          'getByRole — the preferred, accessibility-first locator',
          'getByText, getByLabel, getByPlaceholder, getByAltText',
          'CSS selectors and XPath as fallbacks',
          'Chaining locators to narrow down elements',
          'How to pick the most resilient locator'
        ],
        content: `
## 🔍 Locator Strategies

The biggest difference from Selenium: Playwright gives you **semantic locators** that match how users actually see and use the page.

---

### The Locator Hierarchy (Best to Worst)

1. **getByRole** — best, tests what the user sees
2. **getByLabel** — for form fields
3. **getByPlaceholder** — for inputs with placeholder text
4. **getByText** — for visible text
5. **getByAltText** — for images
6. **getByTestId** — for data-testid attributes
7. **CSS selector** — fallback
8. **XPath** — last resort

---

### 1. getByRole — The Gold Standard

Finds elements by their ARIA role and accessible name. This is how screen readers see the page.

\`\`\`javascript
// Buttons
await page.getByRole('button', { name: 'Login' }).click();
await page.getByRole('button', { name: 'Add to cart' }).first().click();

// Links
await page.getByRole('link', { name: 'Home' }).click();

// Headings
await page.getByRole('heading', { name: 'Products' });
await page.getByRole('heading', { level: 1 });   // h1

// Checkboxes
await page.getByRole('checkbox', { name: 'Remember me' }).check();

// Text inputs (when labelled)
await page.getByRole('textbox', { name: 'Username' }).fill('user');

// Combobox (dropdown)
await page.getByRole('combobox', { name: 'Sort by' }).selectOption('Price (low to high)');
\`\`\`

Common roles: \`button\`, \`link\`, \`heading\`, \`checkbox\`, \`radio\`, \`textbox\`, \`combobox\`, \`listitem\`, \`row\`, \`cell\`, \`dialog\`, \`alert\`

---

### 2. Form-Specific Locators

\`\`\`javascript
// By label text (for <label> + <input> pairs)
await page.getByLabel('Email address').fill('test@test.com');

// By placeholder attribute
await page.getByPlaceholder('Enter your username').fill('saif');

// By visible text content
await page.getByText('Sign in with Google').click();
await page.getByText('Welcome back').waitFor();
\`\`\`

---

### 3. CSS Selectors — Fallback

\`\`\`javascript
// ID
await page.locator('#login-button').click();

// Class
await page.locator('.error-message').textContent();

// Attribute
await page.locator('[data-testid="product-title"]').first().textContent();

// Combined
await page.locator('form.login-form input[name="username"]').fill('user');
\`\`\`

---

### 4. Chaining & Filtering

\`\`\`javascript
// Find a list item containing specific text, then click a button inside it
await page.getByRole('listitem')
  .filter({ hasText: 'Sauce Labs Backpack' })
  .getByRole('button', { name: 'Add to cart' })
  .click();

// nth() — when multiple elements match
await page.getByRole('button', { name: 'Add to cart' }).nth(0).click(); // first
await page.getByRole('button', { name: 'Add to cart' }).last().click(); // last
\`\`\`

---

### 5. How to Find the Right Locator

**Use Playwright Inspector:**
\`\`\`bash
npx playwright codegen https://www.saucedemo.com
\`\`\`

This opens a browser + code window. Click anything and Playwright suggests the best locator.

**Inspect in browser dev tools:**
Open DevTools → Elements → right-click → Copy → Copy selector

---

### Locator Cheat Sheet

| Method | Best for |
|---|---|
| \`getByRole('button', { name: '...' })\` | Buttons, links, headings |
| \`getByLabel('...')\` | Form inputs with labels |
| \`getByPlaceholder('...')\` | Inputs without labels |
| \`getByText('...')\` | Any visible text |
| \`getByTestId('...')\` | Elements with data-testid |
| \`locator('#id')\` | By ID (CSS) |
| \`locator('.class')\` | By class (CSS) |
| \`locator('[attr="val"]')\` | By attribute (CSS) |
        `,
        exercise: {
          title: 'Exercise: Locator Challenge',
          description: `On https://www.saucedemo.com, write locators for:
1. The "Username" input field — use at least 2 different locator strategies
2. The "Login" button — use getByRole
3. After login, the "Products" heading
4. The "Add to cart" button on the FIRST product only
5. The cart icon (top-right)

For each, write the locator, then an assertion that the element is visible: \`await expect(locator).toBeVisible()\``,
          hint: 'Run `npx playwright codegen https://www.saucedemo.com` and click each element — Playwright will suggest the best locator.'
        },
        quiz: [
          { q: 'Which locator is most resilient to HTML structure changes?', options: ['locator("#my-id")', 'getByRole("button", { name: "Login" })', 'locator(".btn-primary")', 'locator("form > button")'], answer: 1 },
          { q: 'How do you select only the FIRST matching element?', options: ['.first()', '[0]', '.nth(0)', 'Both .first() and .nth(0) work'], answer: 3 },
          { q: 'getByLabel() finds elements by:', options: ['The element\'s text content', 'The label element associated with an input', 'The placeholder text', 'The element\'s aria-label attribute'], answer: 1 }
        ]
      },
      {
        id: 'pw-l6',
        title: 'Interactions & Assertions',
        type: 'lesson',
        duration: '30 min',
        whatYoullLearn: [
          'Fill, click, press, check, select — the core interaction methods',
          'Keyboard and mouse interactions',
          'expect() assertions — toBeVisible, toHaveText, toHaveURL, toHaveCount',
          'Soft assertions — test continues even when one fails',
          'Negative assertions with .not'
        ],
        content: `
## 🖱️ Interactions & Assertions

---

### Core Interactions

\`\`\`javascript
// Click
await page.getByRole('button', { name: 'Login' }).click();
await page.locator('#submit').click();

// Fill (clears existing text first)
await page.getByPlaceholder('Username').fill('standard_user');

// Type (simulates real keystrokes, doesn't clear first)
await page.getByPlaceholder('Search').type('backpack');

// Clear then fill
await page.getByPlaceholder('Username').clear();
await page.getByPlaceholder('Username').fill('new_user');

// Press keyboard key
await page.getByPlaceholder('Search').press('Enter');
await page.keyboard.press('Tab');
await page.keyboard.press('Escape');

// Checkbox
await page.getByRole('checkbox', { name: 'Remember me' }).check();
await page.getByRole('checkbox', { name: 'Remember me' }).uncheck();

// Select dropdown
await page.getByRole('combobox').selectOption('Price (low to high)');
await page.getByRole('combobox').selectOption({ label: 'Name (A to Z)' });

// Hover
await page.getByRole('link', { name: 'Products' }).hover();

// Double-click
await page.getByText('Edit').dblclick();

// Right-click
await page.getByText('Item').click({ button: 'right' });

// Drag and drop
await page.getByText('Item A').dragTo(page.getByText('Drop Zone'));
\`\`\`

---

### Core Assertions

Playwright assertions automatically retry for up to 5 seconds by default. You don't need explicit waits.

\`\`\`javascript
const { expect } = require('@playwright/test');

// URL assertions
await expect(page).toHaveURL('https://saucedemo.com/inventory.html');
await expect(page).toHaveURL(/inventory/);        // regex match

// Title assertions
await expect(page).toHaveTitle('Swag Labs');
await expect(page).toHaveTitle(/Swag/);

// Element text
await expect(page.getByRole('heading')).toHaveText('Products');
await expect(page.getByRole('heading')).toContainText('Prod');   // partial

// Visibility
await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
await expect(page.locator('.error')).toBeHidden();

// Count
await expect(page.getByRole('button', { name: 'Add to cart' })).toHaveCount(6);

// Enabled/disabled
await expect(page.getByRole('button', { name: 'Submit' })).toBeEnabled();
await expect(page.getByRole('button', { name: 'Submit' })).toBeDisabled();

// Input value
await expect(page.getByPlaceholder('Username')).toHaveValue('standard_user');

// Checked state
await expect(page.getByRole('checkbox')).toBeChecked();
\`\`\`

---

### Negative Assertions with .not

\`\`\`javascript
await expect(page.locator('.error-message')).not.toBeVisible();
await expect(page).not.toHaveURL(/login/);
await expect(page.getByRole('button', { name: 'Logout' })).not.toBeDisabled();
\`\`\`

---

### Soft Assertions — Test Keeps Running

Normal assertions stop the test on first failure. Soft assertions collect all failures:

\`\`\`javascript
test('check multiple fields', async ({ page }) => {
  await page.goto('https://saucedemo.com/inventory.html');

  // soft assertions — test continues even if one fails
  await expect.soft(page.getByRole('heading')).toHaveText('Products');
  await expect.soft(page.getByRole('button', { name: 'Add to cart' })).toHaveCount(6);
  await expect.soft(page.locator('.inventory_item')).toHaveCount(6);

  // All failures are reported at the end
});
\`\`\`

---

### Text Content Extraction

\`\`\`javascript
// Get text as string
const text = await page.getByRole('heading').textContent();
console.log(text);  // "Products"

// Get all texts as array
const texts = await page.getByRole('listitem').allTextContents();
console.log(texts);  // ["Item 1", "Item 2", ...]

// Get attribute value
const src = await page.getByRole('img').getAttribute('src');
\`\`\`
        `,
        exercise: {
          title: 'Exercise: Full Login + Inventory Assertions',
          description: `Write a test that:
1. Goes to https://www.saucedemo.com
2. Logs in as standard_user / secret_sauce
3. Asserts the URL contains /inventory
4. Asserts the page heading is "Products"
5. Asserts exactly 6 "Add to cart" buttons are visible
6. Clicks "Add to cart" on the first product
7. Asserts the cart badge (top right) shows "1"
8. Uses soft assertions for steps 4-6 so all run even if one fails`,
          hint: 'The cart badge is inside `.shopping_cart_badge`. Use `expect.soft()` for the multi-point checks.'
        },
        quiz: [
          { q: 'What is the difference between fill() and type()?', options: ['No difference', 'fill() clears first, type() simulates keystrokes without clearing', 'type() is faster', 'fill() works only on textareas'], answer: 1 },
          { q: 'Playwright assertions retry automatically for how long by default?', options: ['1 second', '5 seconds', '30 seconds', 'They don\'t retry'], answer: 1 },
          { q: 'Soft assertions:', options: ['Skip the test on failure', 'Stop the test on first failure', 'Collect all failures and report at end', 'Only work in describe blocks'], answer: 2 }
        ]
      },
      {
        id: 'pw-l7',
        title: 'Auto-waiting & Web-first Assertions',
        type: 'lesson',
        duration: '20 min',
        whatYoullLearn: [
          'How Playwright auto-waiting works under the hood',
          'The difference between actionability checks and assertion retries',
          'waitFor(), waitForURL(), waitForResponse()',
          'When you actually need explicit waits',
          'Common timing mistakes and how to avoid them'
        ],
        content: `
## ⏱️ Auto-waiting

This is Playwright's biggest advantage over Selenium. You almost never write explicit waits.

---

### How Auto-waiting Works

When you call \`await locator.click()\`, Playwright automatically waits for the element to be:

1. **Attached** — exists in the DOM
2. **Visible** — not hidden or covered
3. **Stable** — not animating
4. **Enabled** — not disabled
5. **Editable** — for fill() and type()

It polls every 100ms for up to the \`actionTimeout\` (default: 30 seconds). If none of these are satisfied in time, you get a timeout error.

\`\`\`javascript
// This waits automatically for the button to appear, be visible and enabled:
await page.getByRole('button', { name: 'Submit' }).click();

// You don't need this:
await page.waitForSelector('#submit');  // ← unnecessary in most cases
\`\`\`

---

### Assertion Auto-retry

\`expect()\` assertions also retry — they re-evaluate every 100ms until the assertion passes or the timeout is hit.

\`\`\`javascript
// After clicking a button that shows a result async,
// Playwright retries this assertion until it passes:
await expect(page.getByText('Order confirmed')).toBeVisible();

// You don't need:
await page.waitForTimeout(2000);  // ← never do this in real tests!
\`\`\`

---

### When You DO Need Explicit Waits

\`\`\`javascript
// 1. Wait for URL to change after form submission
await page.waitForURL(/dashboard/);

// 2. Wait for a network response
const response = await page.waitForResponse('**/api/users');

// 3. Wait for a specific element state
await page.getByRole('progressbar').waitFor({ state: 'hidden' });

// 4. Wait for an element to be visible
await page.getByText('Loading...').waitFor({ state: 'hidden' });
await page.getByText('Results').waitFor({ state: 'visible' });

// 5. Wait for load state
await page.waitForLoadState('networkidle');   // all network requests done
await page.waitForLoadState('domcontentloaded');
\`\`\`

---

### Never Do This

\`\`\`javascript
// ❌ Hard-coded sleep — brittle, slow, never reliable
await page.waitForTimeout(3000);

// ❌ Polling yourself
let tries = 0;
while (tries < 10) {
  if (await page.locator('#result').isVisible()) break;
  await page.waitForTimeout(500);
  tries++;
}
\`\`\`

These approaches make tests flaky. Playwright's built-in retry handles these cases for you.

---

### Configuring Timeouts

\`\`\`javascript
// playwright.config.js
module.exports = defineConfig({
  use: {
    actionTimeout: 15000,    // per-action timeout (default: 30s)
    navigationTimeout: 30000 // per-navigation timeout
  },
  timeout: 60000,            // per-test timeout (default: 30s)
  expect: {
    timeout: 10000           // per-assertion timeout (default: 5s)
  }
});

// Per-assertion override
await expect(page.getByText('Slow result')).toBeVisible({ timeout: 15000 });
\`\`\`

---

### Debugging Timeouts

When a test times out, Playwright's error message tells you exactly what it was waiting for:

\`\`\`
TimeoutError: locator.click: Timeout 30000ms exceeded.
  waiting for getByRole('button', { name: 'Submit' })
    - element not visible → still waiting...
    - element is visible, enabled and stable
\`\`\`

Use the Trace Viewer (\`--trace on\`) to see a timeline of what happened.
        `,
        exercise: {
          title: 'Exercise: Waits Done Right',
          description: `Write a test against https://the-internet.herokuapp.com/dynamic_loading/2 that:
1. Clicks the "Start" button
2. Waits for the loading bar to disappear (it's a div that shows then hides)
3. Asserts the text "Hello World!" appears
4. Does NOT use waitForTimeout() anywhere
5. Bonus: Set the assertion timeout to 15 seconds in the test itself`,
          hint: 'The loading element has id="loading". Use `.waitFor({ state: "hidden" })` on it, or just let `expect(...).toBeVisible()` retry until the text appears.'
        },
        quiz: [
          { q: 'What does Playwright check before clicking an element?', options: ['Only that it exists in DOM', 'That it is attached, visible, stable and enabled', 'Only that it is visible', 'Nothing — it clicks immediately'], answer: 1 },
          { q: 'Which is the correct way to wait for a URL change?', options: ['page.waitForTimeout(2000)', 'await expect(page).toHaveURL(/dashboard/, { timeout: 10000 })', 'page.sleep(2000)', 'waitForSelector(".dashboard")'], answer: 1 },
          { q: 'waitForTimeout() should be used:', options: ['For all async operations', 'Only for network requests', 'As a last resort — almost never', 'Always after page.goto()'], answer: 2 }
        ]
      }
    ]
  },

  // ── Module 3: Intermediate Playwright ───────────────────────
  {
    id: 'pw-module-3',
    title: 'Intermediate Playwright',
    icon: '🔧',
    lessons: [
      {
        id: 'pw-l8',
        title: 'Screenshots, Videos & Trace Viewer',
        type: 'lesson',
        duration: '25 min',
        whatYoullLearn: [
          'Take screenshots on demand and on failure',
          'Record test videos',
          'Use the Trace Viewer to debug failures visually',
          'Configure screenshot and video in playwright.config.js',
          'Reading a trace file step-by-step'
        ],
        content: `
## 📸 Screenshots, Videos & Traces

This is Playwright's debugging superpower. When a test fails, you can replay exactly what happened.

---

### Screenshots

\`\`\`javascript
// On demand
await page.screenshot({ path: 'screenshot.png' });

// Full page (scrolls and captures everything)
await page.screenshot({ path: 'fullpage.png', fullPage: true });

// Screenshot a specific element
await page.getByRole('heading').screenshot({ path: 'heading.png' });
\`\`\`

**Configure in playwright.config.js:**
\`\`\`javascript
use: {
  screenshot: 'only-on-failure',  // 'on', 'off', 'only-on-failure'
}
\`\`\`

---

### Videos

\`\`\`javascript
// playwright.config.js
use: {
  video: 'on-first-retry',  // 'on', 'off', 'retain-on-failure', 'on-first-retry'
}
\`\`\`

Videos are saved to \`test-results/\` with the test name. Each video shows the full test execution.

---

### Trace Viewer — The Game Changer

A trace is a recording of everything: DOM snapshots, network requests, console logs, screenshots at every step.

**Enable traces:**
\`\`\`javascript
// playwright.config.js
use: {
  trace: 'on-first-retry',  // 'on', 'off', 'on-first-retry', 'retain-on-failure'
}
\`\`\`

**Or run with trace from CLI:**
\`\`\`bash
npx playwright test --trace on
\`\`\`

**Open the trace:**
\`\`\`bash
npx playwright show-trace test-results/my-test/trace.zip
\`\`\`

Or upload to [trace.playwright.dev](https://trace.playwright.dev) — no install needed.

---

### What's in a Trace?

The Trace Viewer shows:
- **Timeline** — every action with timestamps
- **DOM snapshots** — the page at each step (hover to see it)
- **Network tab** — all requests and responses
- **Console tab** — console.log output
- **Source tab** — the test code with the current line highlighted

---

### Screenshot on Test Failure (Custom)

\`\`\`javascript
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    // Test failed — take a screenshot
    const screenshotPath = testInfo.outputPath('screenshot.png');
    await page.screenshot({ path: screenshotPath });
    testInfo.attach('screenshot', {
      body: await page.screenshot(),
      contentType: 'image/png'
    });
  }
});
\`\`\`

---

### Debugging with Playwright Inspector

\`\`\`bash
# Opens the test in slow motion with the inspector panel
npx playwright test --debug

# Step through the test line by line
# Set breakpoints using: await page.pause();
\`\`\`

\`\`\`javascript
test('my test', async ({ page }) => {
  await page.goto('https://saucedemo.com');
  await page.pause();   // ← pauses here, opens Inspector
  await page.getByPlaceholder('Username').fill('standard_user');
});
\`\`\`
        `,
        exercise: {
          title: 'Exercise: Trace a Failing Test',
          description: `1. Write a test that INTENTIONALLY fails (wrong expected text or URL)
2. Run with \`npx playwright test --trace on\`
3. Open the trace with \`npx playwright show-trace\`
4. Navigate the trace: find the step that failed, look at the DOM snapshot
5. Fix the test, re-run, confirm it passes
6. Bonus: Add \`await page.pause()\` and step through with the Inspector`,
          hint: 'An easy way to make a test fail: `await expect(page).toHaveURL("wrong-url")`.'
        },
        quiz: [
          { q: 'What does a Playwright trace file contain?', options: ['Only screenshots', 'DOM snapshots, network requests, console logs, and source code', 'Only network requests', 'Only the test code'], answer: 1 },
          { q: 'Which trace config only records when a test is retried?', options: ['"on"', '"retain-on-failure"', '"on-first-retry"', '"always"'], answer: 2 },
          { q: 'page.pause() in a test:', options: ['Pauses for 1 second', 'Stops the test permanently', 'Opens the Inspector for step-by-step debugging', 'Takes a screenshot'], answer: 2 }
        ]
      },
      {
        id: 'pw-l9',
        title: 'Multiple Pages, Tabs & Dialogs',
        type: 'lesson',
        duration: '20 min',
        whatYoullLearn: [
          'Handle a new tab or popup window',
          'Switch between browser contexts',
          'Handle alert, confirm and prompt dialogs',
          'Handle file downloads',
          'Handle file uploads'
        ],
        content: `
## 🪟 Multiple Pages, Tabs & Dialogs

---

### New Tabs / Popups

When a link opens in a new tab, use \`page.waitForEvent('popup')\`:

\`\`\`javascript
test('handle new tab', async ({ page, context }) => {
  await page.goto('https://the-internet.herokuapp.com/windows');

  // Wait for the new tab to open
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.getByRole('link', { name: 'Click Here' }).click()
  ]);

  // Work with the new tab
  await newPage.waitForLoadState();
  await expect(newPage).toHaveTitle('New Window');

  // Close it
  await newPage.close();
});
\`\`\`

---

### Multiple Pages in One Test

\`\`\`javascript
test('two pages', async ({ browser }) => {
  const context = await browser.newContext();
  const page1 = await context.newPage();
  const page2 = await context.newPage();

  await page1.goto('https://saucedemo.com');
  await page2.goto('https://playwright.dev');

  // Work with each independently
  await expect(page1).toHaveTitle(/Swag Labs/);
  await expect(page2).toHaveTitle(/Playwright/);

  await context.close();
});
\`\`\`

---

### Alert, Confirm & Prompt Dialogs

\`\`\`javascript
test('handle alert', async ({ page }) => {
  // Set up dialog handler BEFORE the action that triggers it
  page.on('dialog', async dialog => {
    console.log(dialog.message());   // "Are you sure?"
    await dialog.accept();           // click OK
    // await dialog.dismiss();       // click Cancel
    // await dialog.accept('my text'); // for prompts
  });

  await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
  await page.getByRole('button', { name: 'Click for JS Alert' }).click();
});
\`\`\`

---

### File Upload

\`\`\`javascript
test('upload a file', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/upload');

  // Set the file input directly — no native dialog opens
  await page.locator('#file-upload').setInputFiles('path/to/file.pdf');

  await page.getByRole('button', { name: 'Upload' }).click();
  await expect(page.locator('#uploaded-files')).toHaveText('file.pdf');
});
\`\`\`

---

### File Download

\`\`\`javascript
test('download a file', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/download');

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('link', { name: 'some-file.txt' }).click()
  ]);

  const path = await download.path();
  console.log('Downloaded to:', path);

  // Save to a specific location
  await download.saveAs('./downloads/some-file.txt');
});
\`\`\`
        `,
        exercise: {
          title: 'Exercise: New Tab + Alert',
          description: `On https://the-internet.herokuapp.com:
1. Write a test that clicks "Multiple Windows" link, waits for the new tab, asserts the new tab title, then closes it
2. Write a test that goes to "JavaScript Alerts", clicks each of the 3 buttons (Alert, Confirm, Prompt), handles each dialog correctly, and asserts the result text on the page

Both tests should be in the same describe block: 'The Internet — Multi-page & Dialogs'`,
          hint: 'For JS Confirm, use `dialog.dismiss()` to click Cancel. For JS Prompt, use `dialog.accept("your text")`.'
        },
        quiz: [
          { q: 'How do you capture a newly opened tab?', options: ['page.switchTab()', 'context.waitForEvent("page")', 'browser.newPage()', 'page.waitForNewTab()'], answer: 1 },
          { q: 'When must you attach a dialog handler?', options: ['After the dialog appears', 'Before the action that triggers the dialog', 'In beforeEach always', 'In afterEach'], answer: 1 },
          { q: 'setInputFiles() is used to:', options: ['Download files', 'Upload files without opening a file picker dialog', 'Read local files', 'Set input field values'], answer: 1 }
        ]
      },
      {
        id: 'pw-l10',
        title: 'Authentication & Browser Contexts',
        type: 'lesson',
        duration: '20 min',
        whatYoullLearn: [
          'What a browser context is and why it matters',
          'storageState — save and reuse login sessions',
          'How to write a global setup that logs in once',
          'Running tests as different users simultaneously',
          'Clearing cookies and storage between tests'
        ],
        content: `
## 🔐 Authentication & Browser Contexts

In real projects, most of your tests need a logged-in user. Logging in before every test is slow. Playwright's \`storageState\` solves this.

---

### What is a Browser Context?

A **context** is like an incognito window — it has its own cookies, localStorage, and session. Multiple contexts in one test run in complete isolation.

\`\`\`javascript
// Default: each test gets its own fresh context automatically
test('test 1', async ({ page }) => { /* fresh context */ });
test('test 2', async ({ page }) => { /* different fresh context */ });
\`\`\`

---

### Save Login State

**Step 1: Global setup — log in once and save state**

Create \`global-setup.js\`:
\`\`\`javascript
const { chromium } = require('@playwright/test');

module.exports = async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('https://www.saucedemo.com');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(/inventory/);

  // Save cookies + localStorage to a file
  await page.context().storageState({ path: '.auth/user.json' });

  await browser.close();
};
\`\`\`

**Step 2: Register it in playwright.config.js**
\`\`\`javascript
module.exports = defineConfig({
  globalSetup: require.resolve('./global-setup'),
  use: {
    storageState: '.auth/user.json',   // every test starts already logged in
  },
});
\`\`\`

Now every test starts with the user already logged in. No login code in your tests.

---

### Multiple Users

\`\`\`javascript
// Save state for two users in global setup
await adminPage.context().storageState({ path: '.auth/admin.json' });
await viewerPage.context().storageState({ path: '.auth/viewer.json' });

// Use per-project in playwright.config.js
projects: [
  {
    name: 'admin tests',
    use: { storageState: '.auth/admin.json' },
    testMatch: '**/admin/*.spec.js'
  },
  {
    name: 'viewer tests',
    use: { storageState: '.auth/viewer.json' },
    testMatch: '**/viewer/*.spec.js'
  }
]
\`\`\`

---

### Custom Fixture for Authentication

The cleanest approach — create a \`loggedInPage\` fixture:

\`\`\`javascript
// fixtures/auth.js
const { test: base } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

const test = base.extend({
  loggedInPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await use(page);   // hand the logged-in page to the test
  }
});

module.exports = { test };
\`\`\`

\`\`\`javascript
// tests/inventory.spec.js
const { test } = require('../fixtures/auth');
const { expect } = require('@playwright/test');

test('inventory shows 6 products', async ({ loggedInPage }) => {
  await expect(loggedInPage.getByRole('button', { name: 'Add to cart' })).toHaveCount(6);
});
\`\`\`
        `,
        exercise: {
          title: 'Exercise: Auth Fixture',
          description: `1. Create \`fixtures/auth.js\` with a \`loggedInPage\` fixture that logs in to SauceDemo
2. Create \`tests/inventory.spec.js\` that imports from your auth fixture (not the default test)
3. Write two tests:
   - Assert 6 "Add to cart" buttons are visible
   - Add one item to cart, assert cart badge shows "1"
4. Confirm that no login code exists in the test file itself — the fixture handles it`,
          hint: 'Import `{ test }` from your fixtures file. Import `{ expect }` from `@playwright/test`. They work together.'
        },
        quiz: [
          { q: 'What does storageState save?', options: ['Only cookies', 'Only localStorage', 'Cookies, localStorage and sessionStorage', 'The full browser state including history'], answer: 2 },
          { q: 'A browser context is most like:', options: ['A browser tab', 'An incognito window with its own cookies and storage', 'A browser window', 'A user profile'], answer: 1 },
          { q: 'Why use globalSetup for login instead of beforeEach?', options: ['It\'s mandatory', 'It logs in once for all tests, not before every single test', 'beforeEach can\'t do login', 'It\'s faster to write'], answer: 1 }
        ]
      }
    ]
  },

  // ── Module 4: Design Patterns ────────────────────────────────
  {
    id: 'pw-module-4',
    title: 'Design Patterns',
    icon: '🏗️',
    lessons: [
      {
        id: 'pw-l11',
        title: 'Page Object Model (POM)',
        type: 'lesson',
        duration: '35 min',
        whatYoullLearn: [
          'Why POM is the industry standard in every framework',
          'Build a LoginPage and InventoryPage class',
          'Locators as class properties',
          'Actions as class methods',
          'How POM makes tests read like plain English'
        ],
        content: `
## 🏗️ Page Object Model

POM is the most important design pattern in test automation. Without it, tests become unmaintainable within weeks.

---

### The Problem Without POM

\`\`\`javascript
// Without POM — imagine 20 tests like this:
test('test 1', async ({ page }) => {
  await page.goto('https://saucedemo.com');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  // ...
});

// The login button locator is hardcoded in EVERY test.
// Change the button → update EVERY test. That's 20 places.
\`\`\`

---

### The Solution: Page Object

Locators and actions live in ONE place. Tests just call the method.

\`\`\`javascript
// pages/LoginPage.js
class LoginPage {
  constructor(page) {
    this.page = page;
  }

  // ── Element Locators ──────────────────────────────────────
  get usernameInput() {
    return this.page.getByPlaceholder('Username');
  }

  get passwordInput() {
    return this.page.getByPlaceholder('Password');
  }

  get loginButton() {
    return this.page.getByRole('button', { name: 'Login' });
  }

  get errorMessage() {
    return this.page.getByRole('heading', { level: 3 });
  }

  // ── Page Actions ──────────────────────────────────────────
  async goto() {
    await this.page.goto('https://www.saucedemo.com');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

module.exports = { LoginPage };
\`\`\`

\`\`\`javascript
// pages/InventoryPage.js
class InventoryPage {
  constructor(page) {
    this.page = page;
  }

  // ── Element Locators ──────────────────────────────────────
  get heading() {
    return this.page.getByRole('heading', { name: 'Products' });
  }

  get addToCartButtons() {
    return this.page.getByRole('button', { name: 'Add to cart' });
  }

  get cartBadge() {
    return this.page.locator('.shopping_cart_badge');
  }

  // ── Page Actions ──────────────────────────────────────────
  async addFirstItemToCart() {
    await this.addToCartButtons.first().click();
  }

  // ── Verification Methods ──────────────────────────────────
  async assertProductCount(count) {
    await expect(this.addToCartButtons).toHaveCount(count);
  }
}

module.exports = { InventoryPage };
\`\`\`

---

### Clean Tests with POM

\`\`\`javascript
// tests/login.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

test.describe('Login', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('successful login navigates to inventory', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory/);
  });

  test('locked out user sees error', async () => {
    await loginPage.login('locked_out_user', 'secret_sauce');
    await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out');
  });

  test('wrong password shows error', async () => {
    await loginPage.login('standard_user', 'wrong_pass');
    await expect(loginPage.errorMessage).toContainText('Username and password do not match');
  });
});
\`\`\`

---

### Folder Structure

\`\`\`
playwright-project/
├── pages/
│   ├── LoginPage.js
│   ├── InventoryPage.js
│   └── CartPage.js
├── tests/
│   ├── login.spec.js
│   └── inventory.spec.js
├── fixtures/
│   └── auth.js
├── playwright.config.js
└── package.json
\`\`\`

---

### Three-Section Convention

Every Page Object should have three sections clearly commented:
1. **Element Locators** — \`get\` properties returning locators
2. **Page Actions** — \`async\` methods that perform user actions
3. **Verification Methods** — \`async\` methods that contain assertions
        `,
        exercise: {
          title: 'Exercise: Build LoginPage + InventoryPage',
          description: `Build the full POM structure:
1. Create \`pages/LoginPage.js\` with goto(), login(), and an errorMessage locator
2. Create \`pages/InventoryPage.js\` with addToCartButtons locator and addFirstItemToCart() method
3. Rewrite your login tests using the LoginPage class — no locators in the test file
4. Write an inventory test using InventoryPage (with the auth fixture from the previous lesson)
5. Confirm: if you change a locator in LoginPage, only that one file needs to change`,
          hint: 'Use JavaScript `get` syntax for locators — it makes them callable without `()` in tests.'
        },
        quiz: [
          { q: 'What is the main benefit of POM?', options: ['Tests run faster', 'Locator changes only need to be made in one place', 'Fewer lines of code per test', 'Tests are easier to parallelize'], answer: 1 },
          { q: 'In a Page Object, locators should be:', options: ['Defined as get properties returning Locator objects', 'Imported from a separate locators file', 'Passed in as constructor arguments', 'Hardcoded strings throughout the class'], answer: 0 },
          { q: 'The three sections of a Page Object class are:', options: ['Setup, Execution, Teardown', 'Element Locators, Page Actions, Verification Methods', 'Constructor, Methods, Exports', 'Config, Tests, Assertions'], answer: 1 }
        ]
      },
      {
        id: 'pw-l12',
        title: 'Custom Fixtures — Playwright\'s Superpower',
        type: 'lesson',
        duration: '30 min',
        whatYoullLearn: [
          'What fixtures are and why they\'re better than beforeEach',
          'Extending the base test with your own fixtures',
          'Composing multiple fixtures together',
          'Fixture scope: test vs worker',
          'Real-world fixture patterns from production frameworks'
        ],
        content: `
## 🔌 Custom Fixtures

Fixtures are Playwright's most powerful feature. They're like a dependency injection system for your tests.

---

### The Problem with beforeEach

\`\`\`javascript
// If 5 test files all need a logged-in page, you repeat this 5 times:
test.beforeEach(async ({ page }) => {
  await page.goto('https://saucedemo.com');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
});
\`\`\`

Fixtures solve this by packaging the setup into a reusable, injectable unit.

---

### Creating a Custom Fixture

\`\`\`javascript
// fixtures/auth.js
const { test: base, expect } = require('@playwright/test');
const { LoginPage }    = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');

const test = base.extend({

  // Fixture 1: logged-in page
  loggedInPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await page.waitForURL(/inventory/);
    await use(page);             // ← hand control to the test
    // teardown goes here (after use)
  },

  // Fixture 2: InventoryPage object (depends on loggedInPage!)
  inventoryPage: async ({ loggedInPage }, use) => {
    const inventory = new InventoryPage(loggedInPage);
    await use(inventory);
  },

});

module.exports = { test, expect };
\`\`\`

---

### Using the Fixtures

\`\`\`javascript
// tests/inventory.spec.js
const { test, expect } = require('../fixtures/auth');

test.describe('Inventory', () => {

  test('shows 6 products', async ({ inventoryPage }) => {
    await expect(inventoryPage.addToCartButtons).toHaveCount(6);
  });

  test('can add item to cart', async ({ inventoryPage, loggedInPage }) => {
    await inventoryPage.addFirstItemToCart();
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

});
\`\`\`

The test only describes **what** it's testing. All setup is invisible.

---

### Fixture Scope

\`\`\`javascript
const test = base.extend({

  // 'test' scope (default) — new instance per test
  loginPage: [async ({ page }, use) => {
    await use(new LoginPage(page));
  }, { scope: 'test' }],

  // 'worker' scope — shared across all tests in the worker
  // Good for: database connections, expensive API setup
  apiToken: [async ({}, use) => {
    const token = await fetchToken();   // done once per worker
    await use(token);
  }, { scope: 'worker' }],

});
\`\`\`

---

### Fixture Teardown

\`\`\`javascript
const test = base.extend({
  loggedInPage: async ({ page }, use) => {
    // SETUP
    await page.goto('https://saucedemo.com');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    await use(page);   // ← TEST RUNS HERE

    // TEARDOWN (runs after the test, even if test failed)
    await page.goto('https://saucedemo.com/');  // reset to homepage
  }
});
\`\`\`

---

### Why Fixtures Beat beforeEach

| | beforeEach | Fixtures |
|---|---|---|
| Reusability across files | ❌ Copy-paste | ✅ Import and use |
| Composability | ❌ Manual | ✅ Fixtures can use other fixtures |
| Teardown | afterEach separately | ✅ Same function, after use() |
| Type-safe (TypeScript) | ❌ | ✅ |
| Scope control | ❌ | ✅ test or worker |
        `,
        exercise: {
          title: 'Exercise: Build a Fixture Suite',
          description: `Extend your auth.js fixture file to include:
1. \`loggedInPage\` — handles login
2. \`inventoryPage\` — returns an InventoryPage instance (depends on loggedInPage)
3. \`loginPage\` — returns a LoginPage instance (for testing login page itself)

Then write 4 tests across 2 files:
- \`tests/login.spec.js\`: Use loginPage fixture for 2 login tests
- \`tests/inventory.spec.js\`: Use inventoryPage fixture for product count and add-to-cart tests

No login code should appear in any test file.`,
          hint: 'A fixture that depends on another fixture just lists the other fixture as a parameter: `inventoryPage: async ({ loggedInPage }, use) => {`'
        },
        quiz: [
          { q: 'How does a fixture "hand control to the test"?', options: ['By returning a value', 'By calling use(value)', 'By calling done()', 'By resolving a Promise'], answer: 1 },
          { q: 'Worker-scope fixtures are created:', options: ['Once per test', 'Once per file', 'Once per worker process (shared across tests)', 'Once per browser'], answer: 2 },
          { q: 'Fixture teardown code goes:', options: ['In afterEach', 'Before use()', 'After use()', 'In a separate cleanup fixture'], answer: 2 }
        ]
      },
      {
        id: 'pw-l13',
        title: 'Request Builder Pattern',
        type: 'lesson',
        duration: '25 min',
        whatYoullLearn: [
          'What the Request Builder pattern is and why it exists',
          'Building a fluent API for HTTP requests',
          'Encapsulating URL, headers, method and body',
          'Chaining: withName().withJob().execute()',
          'Extending the pattern for GET, PUT, DELETE'
        ],
        content: `
## 🔨 Request Builder Pattern

When you have many API tests, you'll find yourself repeating the same URL, headers and request setup. The Request Builder pattern fixes this.

---

### The Problem

\`\`\`javascript
// Without Request Builder — repeated in every test:
test('create user', async ({ request }) => {
  const response = await request.post('https://reqres.in/api/users', {
    headers: { 'Content-Type': 'application/json' },
    data: { name: 'Saif', job: 'QA Lead' }
  });
  expect(response.status()).toBe(201);
});
\`\`\`

If the URL changes, you update every test. If you add an auth header, you update every test.

---

### The Request Builder Solution

\`\`\`javascript
// src/requestBuilders/users/CreateUserRequestBuilder.js
class CreateUserRequestBuilder {
  constructor(request) {
    this.request = request;
    this.url     = 'https://reqres.in/api/users';
    this.headers = { 'Content-Type': 'application/json' };
    this.body    = {};
  }

  // Fluent setters — each returns \`this\` for chaining
  withName(name) {
    this.body.name = name;
    return this;
  }

  withJob(job) {
    this.body.job = job;
    return this;
  }

  async execute() {
    console.log(\`[POST] \${this.url}\`, this.body);
    const response = await this.request.post(this.url, {
      headers: this.headers,
      data: this.body,
    });
    console.log(\`[RESPONSE] \${response.status()}\`);
    return response;
  }
}

module.exports = { CreateUserRequestBuilder };
\`\`\`

---

### Using It in Tests

\`\`\`javascript
const { test, expect } = require('@playwright/test');
const { CreateUserRequestBuilder } = require('../../src/requestBuilders/users/CreateUserRequestBuilder');

test('create user returns 201', async ({ request }) => {
  const response = await new CreateUserRequestBuilder(request)
    .withName('Saif')
    .withJob('QA Lead')
    .execute();

  expect(response.status()).toBe(201);
});

test('response body matches request', async ({ request }) => {
  const response = await new CreateUserRequestBuilder(request)
    .withName('Alice')
    .withJob('Engineer')
    .execute();

  const body = await response.json();
  expect.soft(body.name).toBe('Alice');
  expect.soft(body.job).toBe('Engineer');
  expect.soft(body.id).toBeTruthy();
  expect.soft(body.createdAt).toBeTruthy();
});
\`\`\`

---

### Get and Delete Builders

\`\`\`javascript
// GetUserRequestBuilder.js
class GetUserRequestBuilder {
  constructor(request) {
    this.request = request;
    this.baseUrl = 'https://reqres.in/api/users';
    this.userId  = null;
  }

  withUserId(id) { this.userId = id; return this; }

  async execute() {
    const url = this.userId ? \`\${this.baseUrl}/\${this.userId}\` : this.baseUrl;
    return await this.request.get(url);
  }
}

// DeleteUserRequestBuilder.js
class DeleteUserRequestBuilder {
  constructor(request) {
    this.request = request;
    this.baseUrl = 'https://reqres.in/api/users';
    this.userId  = null;
  }

  withUserId(id) { this.userId = id; return this; }

  async execute() {
    return await this.request.delete(\`\${this.baseUrl}/\${this.userId}\`);
  }
}
\`\`\`

---

### Folder Structure

\`\`\`
src/
└── requestBuilders/
    └── users/
        ├── CreateUserRequestBuilder.js
        ├── GetUserRequestBuilder.js
        ├── UpdateUserRequestBuilder.js
        └── DeleteUserRequestBuilder.js
\`\`\`
        `,
        exercise: {
          title: 'Exercise: Build All 4 Request Builders',
          description: `Create all 4 builders for the reqres.in API:
1. CreateUserRequestBuilder — POST /api/users with withName() and withJob()
2. GetUserRequestBuilder — GET /api/users/:id with withUserId()
3. UpdateUserRequestBuilder — PUT /api/users/:id with withUserId(), withName(), withJob()
4. DeleteUserRequestBuilder — DELETE /api/users/:id with withUserId()

Write one test for each. Assert correct status codes (201, 200, 200, 204).`,
          hint: 'reqres.in accepts any request and returns faked responses. DELETE /api/users/2 always returns 204.'
        },
        quiz: [
          { q: 'Why does each builder method `return this`?', options: ['For error handling', 'To enable method chaining', 'It\'s required by JavaScript', 'To return the response'], answer: 1 },
          { q: 'Where does the URL/headers configuration live in the Request Builder pattern?', options: ['In every test that uses it', 'In the builder constructor', 'In playwright.config.js', 'In a separate config file'], answer: 1 },
          { q: 'The execute() method should:', options: ['Build the request and return this', 'Contain all assertions', 'Make the actual HTTP call and return the response', 'Log results only'], answer: 2 }
        ]
      }
    ]
  },

  // ── Module 5: API Testing ────────────────────────────────────
  {
    id: 'pw-module-5',
    title: 'API Testing',
    icon: '🌐',
    lessons: [
      {
        id: 'pw-l14',
        title: 'API Testing with Playwright',
        type: 'lesson',
        duration: '30 min',
        whatYoullLearn: [
          'The request fixture — Playwright\'s built-in HTTP client',
          'GET, POST, PUT, DELETE requests without a browser',
          'Asserting status codes, headers and response bodies',
          'Data-driven API tests with for...of loops',
          'Testing JSON schema with manual assertions'
        ],
        content: `
## 🌐 API Testing

Playwright includes a built-in HTTP client. You can test your backend without opening a browser.

---

### The request Fixture

\`\`\`javascript
const { test, expect } = require('@playwright/test');

test('GET user returns correct data', async ({ request }) => {
  const response = await request.get('https://reqres.in/api/users/2');

  // Status code
  expect(response.status()).toBe(200);

  // Response body
  const body = await response.json();
  expect(body.data.id).toBe(2);
  expect(body.data.email).toBeTruthy();
});
\`\`\`

---

### POST — Create a Resource

\`\`\`javascript
test('POST creates user and returns 201', async ({ request }) => {
  const response = await request.post('https://reqres.in/api/users', {
    headers: { 'Content-Type': 'application/json' },
    data: {
      name: 'Saif',
      job: 'QA Lead'
    }
  });

  expect(response.status()).toBe(201);

  const body = await response.json();
  expect.soft(body.name).toBe('Saif');
  expect.soft(body.job).toBe('QA Lead');
  expect.soft(body.id).toBeTruthy();
  expect.soft(body.createdAt).toBeTruthy();
});
\`\`\`

---

### PUT — Update a Resource

\`\`\`javascript
test('PUT updates user and returns 200', async ({ request }) => {
  const response = await request.put('https://reqres.in/api/users/2', {
    data: { name: 'Janet Updated', job: 'Senior Engineer' }
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.name).toBe('Janet Updated');
  expect(body.updatedAt).toBeTruthy();
});
\`\`\`

---

### DELETE — Remove a Resource

\`\`\`javascript
test('DELETE user returns 204 with no body', async ({ request }) => {
  const response = await request.delete('https://reqres.in/api/users/2');

  expect(response.status()).toBe(204);

  const text = await response.text();
  expect(text).toBe('');   // 204 has no response body
});
\`\`\`

---

### Data-Driven API Tests

\`\`\`javascript
const users = [
  { name: 'Alice', job: 'Engineer' },
  { name: 'Bob',   job: 'Designer' },
  { name: 'Carol', job: 'PM' },
];

for (const user of users) {
  test(\`Create user: \${user.name} / \${user.job}\`, async ({ request }) => {
    const response = await request.post('https://reqres.in/api/users', {
      data: user
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect.soft(body.name).toBe(user.name);
    expect.soft(body.job).toBe(user.job);
  });
}
\`\`\`

---

### Checking Headers

\`\`\`javascript
test('response has correct content-type', async ({ request }) => {
  const response = await request.get('https://reqres.in/api/users/1');

  const contentType = response.headers()['content-type'];
  expect(contentType).toContain('application/json');
});
\`\`\`

---

### Global API Configuration

\`\`\`javascript
// playwright.config.js
use: {
  baseURL: 'https://reqres.in',       // baseURL for page.goto() AND request calls
  extraHTTPHeaders: {
    'Authorization': \`Bearer \${process.env.API_TOKEN}\`,
    'x-api-key': process.env.API_KEY,
  }
}

// In tests — URL becomes relative:
const response = await request.get('/api/users/1');
\`\`\`
        `,
        exercise: {
          title: 'Exercise: Full CRUD API Test Suite',
          description: `Create \`tests/api/users.spec.js\` with a describe block "Users API" containing:
1. GET /api/users/1 — assert 200, body has id:1 and email field
2. POST /api/users — assert 201, body has id, name, job, createdAt
3. PUT /api/users/2 — update name and job, assert 200 and updatedAt present
4. DELETE /api/users/2 — assert 204, empty body
5. Data-driven POST — loop over 3 users and create each

Use expect.soft() for all body assertions.`,
          hint: 'reqres.in is a mock API — it always returns the same data regardless of what you send. Perfect for practising without a real backend.'
        },
        quiz: [
          { q: 'Which fixture provides HTTP client functionality in Playwright?', options: ['page', 'browser', 'request', 'context'], answer: 2 },
          { q: 'A 204 response means:', options: ['Bad request', 'Not found', 'Success with no content body', 'Unauthorized'], answer: 2 },
          { q: 'How do you pass request headers in Playwright API calls?', options: ['headers property in the options object', 'setHeader() method', 'extraHeaders parameter', 'In the URL query string'], answer: 0 }
        ]
      },
      {
        id: 'pw-l15',
        title: 'Hybrid Tests: API + UI Combined',
        type: 'lesson',
        duration: '25 min',
        whatYoullLearn: [
          'What hybrid tests are and why they\'re faster',
          'Seed data via API, verify via UI',
          'Tear down data via API after UI tests',
          'Using both request and page fixtures in one test',
          'When to go hybrid vs pure API vs pure UI'
        ],
        content: `
## 🔀 Hybrid Tests: API + UI

The most powerful Playwright pattern. Use the API as the back door, the browser as the front door.

---

### Why Hybrid?

| Test type | Speed | Reliability | When to use |
|---|---|---|---|
| UI only | Slow (~8s) | Medium | Full user journeys |
| API only | Fast (<1s) | High | Data checks, CRUD |
| Hybrid | Fast setup + fast verify | High | Setup via API, assert in UI |

**Real-world example:** You have 50 tests that need a user account. Creating accounts via UI takes 10 seconds each. Via API: 200ms. That's 50×10s = 8 minutes vs 50×0.2s = 10 seconds just for setup.

---

### Pattern: API Seed → UI Verify

\`\`\`javascript
test('@api @e2e Seed user via API then verify UI', async ({ request, page }) => {

  // ── Part 1: API Layer (no browser) ──────────────────────
  const response = await request.post('https://reqres.in/api/users', {
    data: { name: 'Saif', job: 'QA Lead' }
  });

  expect(response.status()).toBe(201);

  const { id, name } = await response.json();
  console.log(\`Created user via API: id=\${id}, name=\${name}\`);

  // ── Part 2: UI Layer (browser opens HERE) ────────────────
  await page.goto('https://reqres.in/');
  await expect(page).toHaveTitle(/Reqres/i);

  // In a real app you'd navigate to /users/{id} and assert the name appears
});
\`\`\`

---

### Pattern: UI Test + API Teardown

\`\`\`javascript
let createdUserId;

test('create record via UI', async ({ page }) => {
  // Perform the UI flow that creates a record
  await page.goto('https://myapp.com/create');
  await page.getByLabel('Name').fill('Test Record');
  await page.getByRole('button', { name: 'Save' }).click();

  // Extract the ID from the URL (myapp.com/records/42)
  const url = page.url();
  createdUserId = url.match(/records\/(\d+)/)[1];
});

test.afterAll(async ({ request }) => {
  // Clean up via API — fast and reliable
  if (createdUserId) {
    await request.delete(\`https://myapp.com/api/records/\${createdUserId}\`);
  }
});
\`\`\`

---

### Using Both Fixtures Together

\`\`\`javascript
test('hybrid example', async ({ request, page }) => {
  //                            ^^^^^^^  ^^^^
  //                            API      Browser
  //                            both injected by Playwright
});
\`\`\`

Just list both in the destructured parameter. Playwright provides them both.

---

### When to Use Each

**Pure UI tests:**
- Full end-to-end user journeys
- Visual assertions (layout, styling)
- Flows where the UI IS the product being tested

**Pure API tests:**
- CRUD operations
- Data validation
- Error handling (4xx, 5xx)
- Performance testing

**Hybrid tests:**
- Test UI features that depend on complex data state
- Create test data fast, verify it appears in UI
- Clean up test data after UI tests
        `,
        exercise: {
          title: 'Exercise: Hybrid Test Suite',
          description: `Write \`tests/api/hybrid.spec.js\` with:
1. Test: create a user via API (POST), assert 201, then navigate to reqres.in in the browser and assert the page title
2. Data-driven hybrid: Loop over 3 users, create each via API, assert correct status and body fields
3. Add a comment block at the top explaining the "back door / front door" concept in your own words

Tag all tests with \`@api\` in the test name.`,
          hint: 'Use `async ({ request, page })` to get both fixtures. Create the user with `request`, then use `page` for the UI part.'
        },
        quiz: [
          { q: 'The main advantage of hybrid tests over pure UI tests is:', options: ['They use less memory', 'Data setup is done via API (fast), reducing total test time', 'They\'re easier to write', 'They work without a browser'], answer: 1 },
          { q: 'In `async ({ request, page })`, what are request and page?', options: ['Imported classes', 'Playwright fixtures injected automatically', 'Global variables', 'Config properties'], answer: 1 },
          { q: 'API teardown after a UI test is preferred because:', options: ['It\'s required by Playwright', 'It\'s faster and more reliable than navigating through UI to delete', 'UI teardown doesn\'t work', 'It saves screenshots'], answer: 1 }
        ]
      }
    ]
  },

  // ── Module 6: Framework & Advanced ──────────────────────────
  {
    id: 'pw-module-6',
    title: 'Framework & Advanced',
    icon: '🚀',
    lessons: [
      {
        id: 'pw-l16',
        title: 'Configuration, Tags & CI/CD with GitHub Actions',
        type: 'lesson',
        duration: '30 min',
        whatYoullLearn: [
          'Deep dive into playwright.config.js options',
          'Environment variables with dotenv',
          'Tagging tests with @api, @e2e, @smoke and running subsets',
          'Writing a GitHub Actions workflow for Playwright',
          'Uploading HTML reports as CI artifacts'
        ],
        content: `
## ⚙️ Configuration, Tags & CI/CD

---

### playwright.config.js Deep Dive

\`\`\`javascript
const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

module.exports = defineConfig({
  testDir: './tests',

  // Test execution
  fullyParallel: false,          // run test FILES in parallel
  forbidOnly: !!process.env.CI,  // fail if test.only() left in code
  retries: process.env.CI ? 2 : 0,  // retry failed tests in CI
  workers: process.env.CI ? 1 : 3,  // parallel workers

  // Reporting
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],    // console output
  ],

  // Shared settings for all tests
  use: {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
    headless: !!process.env.CI,
    slowMo: process.env.CI ? 0 : 500,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    extraHTTPHeaders: {
      'x-api-key': process.env.API_KEY ?? '',
    },
  },

  // Browser projects
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],

  // Global setup/teardown
  globalSetup: require.resolve('./global-setup'),
});
\`\`\`

---

### Environment Variables

\`\`\`bash
# .env file (never commit this!)
BASE_URL=https://www.saucedemo.com
API_KEY=my-secret-key
TEST_USER=standard_user
TEST_PASS=secret_sauce
\`\`\`

\`\`\`javascript
// Install: npm install dotenv
require('dotenv').config();

// Use in config or tests:
const baseUrl = process.env.BASE_URL;
\`\`\`

Add \`.env\` to \`.gitignore\`.

---

### Test Tags & Grep

Tag tests by putting the tag in the test name:

\`\`\`javascript
test('@smoke Login works', async ({ page }) => { ... });
test('@api Create user returns 201', async ({ request }) => { ... });
test('@e2e Full checkout flow', async ({ page }) => { ... });
\`\`\`

Run subsets:
\`\`\`bash
npx playwright test --grep "@smoke"     # only smoke tests
npx playwright test --grep "@api"       # only API tests
npx playwright test --grep-invert "@e2e"  # everything except e2e
\`\`\`

---

### GitHub Actions Workflow

Create \`.github/workflows/playwright.yml\`:

\`\`\`yaml
name: Playwright Tests

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: lts/*

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run tests
        run: npx playwright test
        env:
          CI: true
          BASE_URL: \${{ secrets.BASE_URL }}
          API_KEY: \${{ secrets.API_KEY }}

      - name: Upload report
        uses: actions/upload-artifact@v4
        if: \${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
\`\`\`

The HTML report is uploaded as an artifact on every run — pass or fail.

---

### Environment-Specific Projects

Run different test subsets per environment:
\`\`\`javascript
projects: [
  // Smoke tests — fast, run on every push
  {
    name: 'smoke-chromium',
    grep: /@smoke/,
    use: { ...devices['Desktop Chrome'] }
  },
  // Full suite — run nightly
  {
    name: 'full-chromium',
    use: { ...devices['Desktop Chrome'] }
  },
]
\`\`\`
        `,
        exercise: {
          title: 'Exercise: Config + CI Setup',
          description: `1. Create a \`.env\` file with BASE_URL and a test username/password
2. Update playwright.config.js to read from .env using dotenv
3. Update your tests to use \`process.env.BASE_URL\` via the baseURL config
4. Add tags (@smoke, @api, @e2e) to all your existing tests
5. Run \`npx playwright test --grep "@smoke"\` and verify only tagged tests run
6. Create \`.github/workflows/playwright.yml\` and push it to your repo
7. Add \`.env\` to \`.gitignore\``,
          hint: 'Use `require("dotenv").config()` at the top of playwright.config.js. Then baseURL in `use:` picks it up automatically via `process.env.BASE_URL`.'
        },
        quiz: [
          { q: 'forbidOnly: !!process.env.CI does what?', options: ['Prevents test.skip() in CI', 'Fails the build if test.only() is left in the code', 'Disables parallel execution', 'Sets worker count to 1'], answer: 1 },
          { q: 'How do you run only tests tagged @smoke?', options: ['npx playwright test @smoke', 'npx playwright test --tag @smoke', 'npx playwright test --grep "@smoke"', 'npx playwright test --filter smoke'], answer: 2 },
          { q: 'In CI, retries: 2 means:', options: ['Each test runs 2 times total', 'Failed tests are retried up to 2 more times', 'Tests run in 2 parallel batches', 'The suite retries on any failure'], answer: 1 }
        ]
      },
      {
        id: 'pw-l17',
        title: 'Parallel Execution, Sharding & Debugging',
        type: 'lesson',
        duration: '25 min',
        whatYoullLearn: [
          'How Playwright parallelises tests by default',
          'Worker processes vs parallel projects',
          'Sharding — split a test suite across multiple machines',
          'Debugging with Playwright Inspector and VS Code',
          'Reading and fixing common error messages'
        ],
        content: `
## ⚡ Parallel Execution, Sharding & Debugging

---

### How Parallelism Works

Playwright runs test FILES in parallel by default. Each worker is a separate Node.js process with its own browser context.

\`\`\`javascript
// playwright.config.js
module.exports = defineConfig({
  fullyParallel: false,   // files in parallel, tests within a file sequential
  // fullyParallel: true, // EVERYTHING in parallel (be careful with shared state)
  workers: 4,             // 4 simultaneous worker processes
});
\`\`\`

\`\`\`bash
# Override from CLI
npx playwright test --workers=1    # force sequential
npx playwright test --workers=4    # 4 parallel workers
\`\`\`

---

### Parallel Projects (Cross-Browser)

\`\`\`javascript
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
]
\`\`\`

Each project runs independently. With \`workers: 3\`, all three browsers run simultaneously.

---

### Test Isolation — The Golden Rule

Parallel tests MUST be independent. Never share state between tests:

\`\`\`javascript
// ❌ WRONG — shared state breaks parallelism
let sharedPage;
test.beforeAll(async ({ browser }) => {
  sharedPage = await browser.newPage();
});

// ✅ CORRECT — each test gets its own context
test('test 1', async ({ page }) => { ... });  // fresh page
test('test 2', async ({ page }) => { ... });  // different fresh page
\`\`\`

---

### Sharding — Split Across Machines

Run your suite across multiple CI machines to speed up large projects:

\`\`\`bash
# Machine 1: run shard 1 of 3
npx playwright test --shard=1/3

# Machine 2: run shard 2 of 3
npx playwright test --shard=2/3

# Machine 3: run shard 3 of 3
npx playwright test --shard=3/3
\`\`\`

In GitHub Actions:
\`\`\`yaml
strategy:
  matrix:
    shardIndex: [1, 2, 3]
    shardTotal: [3]

steps:
  - run: npx playwright test --shard=\${{ matrix.shardIndex }}/\${{ matrix.shardTotal }}
\`\`\`

---

### Debugging

\`\`\`bash
# Run in debug mode (opens Inspector)
npx playwright test --debug

# Run headed (browser visible)
npx playwright test --headed

# Run with trace (full recording)
npx playwright test --trace on

# Run one specific test
npx playwright test --grep "exact test name"
\`\`\`

**Pause mid-test:**
\`\`\`javascript
await page.pause();   // opens Inspector, pauses execution
\`\`\`

---

### Common Error Messages

| Error | Cause | Fix |
|---|---|---|
| \`TimeoutError: locator not found\` | Element doesn't exist or wrong locator | Check selector, inspect page |
| \`Target page, context or browser has been closed\` | Async code running after test ended | Check for missing await |
| \`Cannot use import statement\` | ESM/CJS mismatch | Fix "type" in package.json |
| \`Error: browserType.launch: Executable doesn't exist\` | Browsers not installed | Run \`npx playwright install\` |
| \`expect received... to equal expected...\` | Assertion failed | Check actual vs expected values in trace |

---

### VS Code Integration

Install the **Playwright Test for VS Code** extension:
- Run/debug individual tests from the gutter
- Step through with breakpoints
- See the browser alongside your code
- Record new tests with the codegen UI

\`\`\`bash
code --install-extension ms-playwright.playwright
\`\`\`
        `,
        exercise: {
          title: 'Exercise: Parallel + Debug',
          description: `1. Set \`workers: 3\` in your config and run your full test suite — observe the parallel execution in the console output
2. Add \`fullyParallel: true\` and run again — note the difference
3. Introduce a deliberate timeout error in one test
4. Run with \`--trace on\` and open the trace to find exactly which step timed out
5. Fix the error, confirm all tests pass
6. Bonus: Run only the chromium project: \`npx playwright test --project=chromium\``,
          hint: 'With `fullyParallel: true`, tests within the SAME file can also run in parallel. Make sure your tests are truly independent.'
        },
        quiz: [
          { q: 'With workers: 4, how many browser processes run simultaneously?', options: ['1', '2', '4', 'Depends on test count'], answer: 2 },
          { q: 'Sharding splits tests across:', options: ['Multiple browsers', 'Multiple files', 'Multiple machines or CI agents', 'Multiple test suites'], answer: 2 },
          { q: 'What does fullyParallel: true enable that the default doesn\'t?', options: ['Cross-browser testing', 'Parallelism within a single test file', 'Faster assertions', 'Sharding'], answer: 1 }
        ]
      }
    ]
  }
];
