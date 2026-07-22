// ── .NET & Angular Testing Curriculum ─────────────────────────────────────────
// 2-Week Ramp-Up: Beginner → Independent Contributor
// Based on the team ramp-up plan — July 2026
// Modules: Manual Testing → .NET Backend → Angular Frontend → E2E & CI/CD → Capstone
// ───────────────────────────────────────────────────────────────────────────────

const DOTNET_CURRICULUM = [

  // ══════════════════════════════════════════════════════════════════
  // MODULE 0 — BEFORE YOU START
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'module-dotnet-0',
    title: 'Before You Start',
    icon: '🚀',
    lessons: [
      {
        id: 'dotnet-l0',
        title: 'Welcome: Your 2-Week Testing Ramp-Up',
        duration: '15 min',
        type: 'theory',
        difficulty: 'beginner',
        whatYoullLearn: [
          'The goal: zero testing background → independent contributor in 10 working days',
          'The daily rhythm that makes this plan run on autopilot',
          'Every tool you will touch and why it was chosen',
          'The 10 concrete deliverables — one per day — that prove you\'re ready',
          'The "Can Work Independently" checklist you\'ll self-score at the end'
        ],
        content: `# 🚀 Welcome to Your 2-Week Testing Ramp-Up

This course turns someone with **zero testing background** into someone who can independently pick up a testing task on a **.NET + Angular codebase** — write test plans, automate unit/integration/e2e tests, log quality bugs, and get everything running in CI — without step-by-step hand-holding.

---

## 📅 The 10-Day Plan at a Glance

| Week | Days | Focus |
|------|------|-------|
| Week 1 | Days 1–2 | Manual testing, test case design, API testing with Postman |
| Week 1 | Days 3–5 | C# & .NET, xUnit unit tests, Moq mocks, integration tests |
| Week 2 | Days 6–7 | Angular & TypeScript, Jasmine/Karma unit tests |
| Week 2 | Days 8–9 | Cypress E2E tests, GitHub Actions CI/CD |
| Week 2 | Day 10 | Capstone: test a full feature independently |

---

## ⏱ Your Daily Rhythm

Every day follows the same 8-hour structure so there is no decision fatigue about what to do next:

\`\`\`
2 hours  → Theory: read docs, watch short videos, study code examples
4–5 hrs  → Hands-on: build, break, and test a real sample app
1 hour   → Review: self-quiz, catch gaps immediately
1 hour   → Documentation: write what you learned + open questions for mentor
\`\`\`

---

## 🛠 Tools You Will Use

| Purpose | Tool | Why |
|---------|------|-----|
| API testing | **Postman** | Industry standard, free, visual |
| .NET unit testing | **xUnit** | The modern .NET default |
| Mocking | **Moq** | Most-used .NET mocking library |
| Angular unit testing | **Jasmine + Karma** | Angular's built-in test stack |
| E2E testing | **Cypress** | Fast setup, excellent debugging |
| CI/CD | **GitHub Actions** | Free, integrates with your repo |
| Bug tracking | **Jira / Azure Boards** | Any tracker; skill transfers |

> **Swap freely:** if your team uses NUnit instead of xUnit, or Playwright instead of Cypress — the underlying skill transfers directly. Only the API differs.

---

## 🎯 Your 10 Deliverables

By the end of each day you will have produced something concrete:

1. **Day 1** — 15 test cases + a mock bug log with 5 real bug reports
2. **Day 2** — Postman collection (GET/POST/PUT/DELETE with assertions) + test plan template
3. **Day 3** — Running ASP.NET Core To-Do API on GitHub + architecture diagram
4. **Day 4** — xUnit test suite for the Service layer (happy path + edge cases)
5. **Day 5** — Integration tests + HTML code coverage report + gap analysis
6. **Day 6** — Running Angular app + Angular component tree diagram
7. **Day 7** — Angular unit test suite (service + component) with coverage report
8. **Day 8** — Cypress E2E suite for one critical user flow using Page Object Model
9. **Day 9** — GitHub Actions pipeline running all three test suites
10. **Day 10** — Complete test artifact set for a new feature + self-scored readiness checklist

---

## ✅ Definition of "Ready to Work Independently"

You will self-score yourself on Day 10 against 10 criteria. You need to be honest — this list is exactly what to raise in your next mentor check-in if anything is yellow or red. The full checklist is in the Capstone lesson.`,
        exercise: {
          title: 'Set Up Your Environment',
          description: 'Before Day 1, confirm every tool is ready so you hit the ground running.',
          steps: [
            'Install **Postman** (postman.com/downloads)',
            'Install **Visual Studio** (free Community edition) or VS Code + C# Dev Kit extension',
            'Install **.NET SDK 8** (dotnet.microsoft.com/download)',
            'Install **Node.js LTS** (nodejs.org) — needed for Angular and Cypress',
            'Install **Angular CLI**: `npm install -g @angular/cli`',
            'Install **Cypress**: `npm install -g cypress`',
            'Create a free **GitHub account** if you don\'t have one',
            'Create a free **Jira** or **Trello** board for bug logging'
          ]
        }
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════════
  // MODULE 1 — MANUAL TESTING FOUNDATIONS (Days 1–2)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'module-dotnet-1',
    title: 'Manual Testing Foundations',
    icon: '📋',
    lessons: [
      {
        id: 'dotnet-l1',
        title: 'Day 1 — Testing Fundamentals & Test Case Design',
        duration: '2 hours theory + 4 hours practice',
        type: 'theory',
        difficulty: 'beginner',
        whatYoullLearn: [
          'SDLC vs STLC — how testing fits into the software delivery lifecycle',
          'The four testing levels: unit, integration, system, UAT',
          'Functional vs non-functional testing (performance, security, usability)',
          'Black-box, white-box, and grey-box testing — when to use each',
          'Three test case design techniques: equivalence partitioning, boundary value analysis, decision tables',
          'The professional bug lifecycle from discovery to closure'
        ],
        content: `# 📋 Day 1 — Testing Fundamentals & Test Case Design

## 🎯 Objective
Understand core testing vocabulary and design a first set of test cases and bug reports **the way a professional tester would** — not just "does it work or not."

---

## SDLC vs STLC

**SDLC (Software Development Lifecycle):** The complete process of building software — requirements → design → development → testing → deployment → maintenance.

**STLC (Software Testing Lifecycle):** The testing-specific subset — requirement analysis → test planning → test case development → environment setup → execution → closure.

Key distinction: **Verification** answers "are we building the product right?" (does it match the spec?). **Validation** answers "are we building the right product?" (does it meet the user's real need?).

---

## Testing Levels

| Level | Who Writes It | What It Tests | Speed |
|-------|--------------|---------------|-------|
| **Unit** | Developer / Tester | Single class, method, or function | Fastest |
| **Integration** | Tester | Two or more components talking to each other | Fast |
| **System** | Tester | End-to-end flow through the whole application | Slower |
| **UAT** | Business / End User | Does it meet the business requirement? | Slowest |

The **Testing Pyramid** says: write many unit tests, fewer integration tests, and only a handful of E2E tests. Unit tests are cheap to write and run in milliseconds; E2E tests are slow and brittle.

---

## Testing Types

**Functional testing** — verifies the software does what it's supposed to do:
- Smoke testing (does it start at all?)
- Regression testing (did new code break old features?)
- Sanity testing (quick check after a bug fix)

**Non-functional testing** — verifies how well it does it:
- Performance testing (is it fast enough under load?)
- Security testing (is it safe from attacks?)
- Usability testing (can a user actually use it?)
- Accessibility testing (can users with disabilities use it?)

---

## Black-Box, White-Box, Grey-Box

| Approach | Tester sees the code? | Tests based on... |
|----------|----------------------|-------------------|
| **Black-box** | No | Requirements, expected behaviour |
| **White-box** | Yes | Code paths, branches, coverage |
| **Grey-box** | Partially | Internal structure + external behaviour |

As a tester on a .NET + Angular project you will mostly do **grey-box**: you can read the code to understand what paths exist, but you test from the user's perspective.

---

## Test Case Design Techniques

### 1. Equivalence Partitioning (EP)
Divide input values into groups (partitions) that the system should treat identically. Test one value from each partition — no need to test every value.

**Example — age field (must be 18–65):**
- Partition 1: below 18 (invalid) → test with 17
- Partition 2: 18–65 (valid) → test with 30
- Partition 3: above 65 (invalid) → test with 66

### 2. Boundary Value Analysis (BVA)
Bugs cluster at the edges. For every boundary, test the value just below, exactly at, and just above.

**Same age field:**
| Value | Expected |
|-------|----------|
| 17 | ❌ Rejected |
| 18 | ✅ Accepted |
| 65 | ✅ Accepted |
| 66 | ❌ Rejected |

### 3. Decision Tables
Map every combination of input conditions to expected outputs. Useful when multiple conditions interact.

**Login decision table:**

| Valid Username | Valid Password | Account Locked | Expected Outcome |
|---------------|----------------|----------------|-----------------|
| ✅ | ✅ | ❌ | Login success |
| ✅ | ❌ | ❌ | "Wrong password" |
| ❌ | ✅ | ❌ | "User not found" |
| ✅ | ✅ | ✅ | "Account locked" |

---

## Anatomy of a Professional Test Case

Every test case needs:

\`\`\`
TC-001 | Login with valid credentials
─────────────────────────────────────────
Precondition: User account exists in the system
Steps:
  1. Navigate to /login
  2. Enter email: user@example.com
  3. Enter password: ValidPass123!
  4. Click "Sign In"
Expected result: Redirect to /dashboard; user name shown in header
Actual result: [leave blank until executed]
Status: Not run
Priority: P1 — Critical
Severity: High
\`\`\`

---

## The Bug Lifecycle

\`\`\`
New → Assigned → In Progress → Fixed → Re-test → Closed
                                  ↓ (if re-test fails)
                               Reopened
\`\`\`

**A high-quality bug report includes:**
1. **Title:** short, specific, not "it doesn't work"
2. **Steps to reproduce:** numbered, exact, reproducible by anyone
3. **Expected result:** what should happen
4. **Actual result:** what actually happened
5. **Environment:** browser, OS, build number
6. **Severity:** how badly is the system broken? (Critical / High / Medium / Low)
7. **Priority:** how urgently should this be fixed? (P1 / P2 / P3)
8. **Screenshot or log:** evidence

> **Severity vs Priority:** A typo on the homepage is Low severity (system still works) but High priority (every user sees it). A crash in an admin-only export tool is High severity but possibly Lower priority (small user impact).`,
        exercise: {
          title: 'Day 1 Deliverable — 15 Test Cases + 5 Bug Reports',
          description: 'Apply equivalence partitioning and BVA to a real login feature. Log 5 mock bugs professionally.',
          steps: [
            'Open your Jira/Trello board (or a spreadsheet)',
            'Write **15 test cases** for a login feature covering: valid login, wrong password, wrong email, empty fields, special characters, SQL injection attempt, very long inputs, account locked, remember-me checkbox, forgot password link',
            'Use EP for email field: valid email format, missing @, missing domain, empty — one test per partition',
            'Use BVA for password length (min 8, max 64): test 7, 8, 64, 65 characters',
            'Create a decision table for the "remember me + locked account" combinations',
            'Log **5 mock bugs** with all required fields: title, steps, expected, actual, severity, priority',
            'Example bug: "Login button remains active when both fields are empty — expected: disabled until both fields filled"'
          ]
        }
      },

      {
        id: 'dotnet-l2',
        title: 'Day 2 — Exploratory Testing & API Testing with Postman',
        duration: '2 hours theory + 4 hours practice',
        type: 'practical',
        difficulty: 'beginner',
        whatYoullLearn: [
          'Test plan structure: scope, approach, entry/exit criteria, risks',
          'What exploratory testing is and how to run a structured session with charters',
          'HTTP fundamentals: methods, status codes, headers, REST principles',
          'How to write and chain Postman requests with assertions',
          'Why API testing is critical for .NET backend testing'
        ],
        content: `# 🌐 Day 2 — Exploratory Testing & API Testing with Postman

## 🎯 Objective
Learn structured exploratory testing and master REST API testing with Postman — a **core daily skill** for anyone testing a .NET backend.

---

## Test Plan Structure

A test plan is not a list of test cases — it is a **strategy document**. It answers: *What are we testing, how, when, and what does "done" mean?*

**Sections of a test plan:**

| Section | What goes here |
|---------|---------------|
| **Scope** | What features ARE and ARE NOT being tested |
| **Approach** | Testing types and levels (unit, integration, E2E, manual) |
| **Entry criteria** | Conditions that must be met before testing starts (e.g., dev deployment is stable) |
| **Exit criteria** | Conditions that define "done" (e.g., 0 P1 bugs, 95% test case pass rate) |
| **Risks** | What could go wrong and the mitigation plan |
| **Resources** | Who is testing, which environments, which tools |
| **Schedule** | Timeline with milestones |

---

## Exploratory Testing

Exploratory testing is **simultaneous learning, design, and execution** — you explore the application with a purpose, rather than following a pre-written script.

It is NOT random clicking. It uses **charters:**

\`\`\`
Charter: Explore the password reset flow to discover
         any security or usability issues
Duration: 30 minutes
Notes: Log every bug found with exact steps
\`\`\`

**Session-Based Test Management (SBTM):**
- Run a focused session (30–90 mins) with one charter
- Take notes as you explore
- Debrief: what did you find? what didn't you get to? what questions emerged?

---

## HTTP Fundamentals for Testers

Your .NET backend exposes a REST API. Every test of the backend goes through HTTP.

### Methods
| Method | Use case | Idempotent? |
|--------|----------|-------------|
| **GET** | Read data | ✅ Yes |
| **POST** | Create resource | ❌ No |
| **PUT** | Replace resource | ✅ Yes |
| **PATCH** | Partial update | ❌ No |
| **DELETE** | Remove resource | ✅ Yes |

### Status Codes you must know
| Code | Meaning | When you see it |
|------|---------|----------------|
| 200 | OK | Successful GET / PUT |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input — your job to test these |
| 401 | Unauthorized | Missing or invalid auth token |
| 403 | Forbidden | Authenticated but no permission |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate — e.g., email already registered |
| 422 | Unprocessable | Validation failed |
| 500 | Server Error | Backend crash — always a bug |

### REST Principles
1. **Stateless** — each request carries all needed info (auth token, params)
2. **Resource-based URLs** — \`/api/todos\` not \`/api/getTodos\`
3. **JSON payloads** — standard for .NET Web APIs
4. **Consistent responses** — same error format every time

---

## Postman in Practice

### Creating a Collection
Organize requests by feature area. For a To-Do API:

\`\`\`
📁 To-Do API
  ├── GET    /api/todos          → List all todos
  ├── GET    /api/todos/{id}     → Get single todo
  ├── POST   /api/todos          → Create todo
  ├── PUT    /api/todos/{id}     → Update todo
  └── DELETE /api/todos/{id}     → Delete todo
\`\`\`

### Writing Assertions (Tests tab in Postman)
\`\`\`javascript
// Assert status code
pm.test("Status is 200", () => {
  pm.response.to.have.status(200);
});

// Assert response body
pm.test("Todo has a title", () => {
  const body = pm.response.json();
  pm.expect(body.title).to.be.a('string').and.not.empty;
});

// Assert response time
pm.test("Response under 500ms", () => {
  pm.expect(pm.response.responseTime).to.be.below(500);
});
\`\`\`

### Chaining Requests with Environment Variables
\`\`\`javascript
// In POST /api/todos → Tests tab: save the new ID
const body = pm.response.json();
pm.environment.set("todo_id", body.id);

// In GET /api/todos/{{todo_id}} → uses the saved ID automatically
\`\`\`

### What to Test in an API
1. **Happy path** — valid input, expect 200/201
2. **Missing required fields** — expect 400/422
3. **Invalid data types** — string where int expected
4. **Boundary values** — max string length, min/max numbers
5. **Auth** — missing token (401), wrong role (403)
6. **Duplicates** — create same resource twice (409)
7. **Non-existent resources** — GET/DELETE unknown ID (404)
8. **SQL injection** — \`' OR 1=1 --\` in string fields
9. **XSS** — \`<script>alert(1)</script>\` in string fields`,
        exercise: {
          title: 'Day 2 Deliverable — Postman Collection + Test Plan Template',
          description: 'Build a complete Postman collection against a public API and write a one-page test plan.',
          steps: [
            'Open Postman and create a new Collection called "Day 2 Practice"',
            'Add 5 requests against **reqres.in** (a free practice API): GET /api/users, GET /api/users/2, POST /api/users, PUT /api/users/2, DELETE /api/users/2',
            'Add at least 2 assertion scripts per request (status code + body shape)',
            'Chain the POST and PUT requests using an environment variable to pass the created user ID',
            'Run a 30-minute exploratory testing session on **the-internet.herokuapp.com** — log every bug you find with full reproduction steps',
            'Write a one-page test plan for "User Registration" feature using the template from theory (scope, approach, entry/exit criteria, risks)',
            'Export the Postman collection as JSON and save to your test artifacts folder'
          ]
        }
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════════
  // MODULE 2 — .NET BACKEND TESTING (Days 3–5)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'module-dotnet-2',
    title: '.NET Backend Testing',
    icon: '🔷',
    lessons: [
      {
        id: 'dotnet-l3',
        title: 'Day 3 — C# & ASP.NET Core for Testers',
        duration: '2 hours theory + 5 hours practice',
        type: 'theory',
        difficulty: 'beginner',
        whatYoullLearn: [
          'C# essentials: classes, interfaces, async/await, LINQ — enough to read any .NET codebase',
          'ASP.NET Core architecture: Controllers → Services → Repositories → Database',
          'Dependency Injection: why it exists and why it makes testing possible',
          'How to navigate a real .NET codebase and find the code that needs testing',
          'Git workflow: clone, branch, commit, push, pull request'
        ],
        content: `# 🔷 Day 3 — C# & ASP.NET Core for Testers

## 🎯 Objective
You don't need to be a developer. But you **must** be able to navigate a .NET codebase independently — find the classes, read the logic, identify what needs testing.

---

## C# Essentials for Testers

### Classes & Interfaces
\`\`\`csharp
// Interface — defines the contract
public interface ITodoService
{
    Task<Todo> GetByIdAsync(int id);
    Task<Todo> CreateAsync(CreateTodoDto dto);
    Task DeleteAsync(int id);
}

// Implementation — the actual code
public class TodoService : ITodoService
{
    private readonly ITodoRepository _repo;

    // Constructor injection — key to testability
    public TodoService(ITodoRepository repo)
    {
        _repo = repo;
    }

    public async Task<Todo> GetByIdAsync(int id)
    {
        var todo = await _repo.GetByIdAsync(id);
        if (todo == null) throw new NotFoundException($"Todo {id} not found");
        return todo;
    }
}
\`\`\`

**Why interfaces matter for testing:** You can replace \`ITodoRepository\` with a fake/mock in tests, so your unit test never touches the real database.

### async / await
\`\`\`csharp
// Every I/O operation in .NET is async
// await = "pause here until the I/O finishes, then continue"
public async Task<List<Todo>> GetAllAsync()
{
    return await _repo.GetAllAsync(); // async database call
}

// In tests, you call async methods with .Result or await in async test
[Fact]
public async Task GetAll_ReturnsAllTodos()
{
    var result = await _service.GetAllAsync();
    Assert.NotEmpty(result);
}
\`\`\`

### LINQ — Reading Data Queries
\`\`\`csharp
// LINQ is like SQL in C# — you'll see it everywhere
var completedTodos = todos
    .Where(t => t.IsCompleted)          // filter
    .OrderBy(t => t.CreatedAt)          // sort
    .Select(t => new { t.Id, t.Title }) // project
    .ToList();                           // execute
\`\`\`

---

## ASP.NET Core Architecture

Every .NET Web API follows this layered pattern:

\`\`\`
HTTP Request
    ↓
[Controller]        — Handles HTTP: routes, validates input, returns responses
    ↓
[Service]           — Business logic: validation rules, orchestration
    ↓
[Repository]        — Data access: queries the database
    ↓
[Database]          — SQL Server, PostgreSQL, SQLite, etc.
\`\`\`

### Controller — The Entry Point
\`\`\`csharp
[ApiController]
[Route("api/[controller]")]
public class TodosController : ControllerBase
{
    private readonly ITodoService _service;

    public TodosController(ITodoService service)
    {
        _service = service;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TodoDto>> GetById(int id)
    {
        try
        {
            var todo = await _service.GetByIdAsync(id);
            return Ok(todo);          // 200
        }
        catch (NotFoundException)
        {
            return NotFound();        // 404
        }
    }

    [HttpPost]
    public async Task<ActionResult<TodoDto>> Create([FromBody] CreateTodoDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState); // 400
        var todo = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = todo.Id }, todo); // 201
    }
}
\`\`\`

### Dependency Injection (DI)
DI is the mechanism that makes the above architecture testable. Instead of a class creating its own dependencies (\`new TodoRepository()\`), they are **injected** via the constructor.

\`\`\`csharp
// In Program.cs (startup)
builder.Services.AddScoped<ITodoService, TodoService>();
builder.Services.AddScoped<ITodoRepository, TodoRepository>();

// Now ASP.NET Core automatically injects the right implementation
// In tests, you inject a MOCK instead — that's the entire trick
\`\`\`

---

## Reading a Real Codebase — A Checklist

When you first open a .NET project, do this:
1. **Find \`Program.cs\`** — see what services are registered (DI container)
2. **Find the Controllers folder** — these are your API endpoints
3. **Find the Services folder** — this is where business logic lives (most testable)
4. **Find the Repositories/Data folder** — data access layer
5. **Open Swagger** (usually at \`/swagger\`) — interactive API documentation
6. **Run all existing tests** — \`dotnet test\` — see what coverage already exists

---

## Git Workflow for Testers

\`\`\`bash
# Clone the repo
git clone https://github.com/your-org/your-project.git

# Create a branch for your test work
git checkout -b test/add-unit-tests-todo-service

# Stage and commit your test files
git add tests/
git commit -m "test: add unit tests for TodoService"

# Push and open a PR
git push origin test/add-unit-tests-todo-service
\`\`\`

**Commit message convention for test work:**
- \`test: add unit tests for X\`
- \`test: fix flaky assertion in Y\`
- \`test: increase coverage on Z service\``,
        exercise: {
          title: 'Day 3 Deliverable — Sample API on GitHub + Architecture Diagram',
          description: 'Build a simple To-Do API from scratch and diagram its architecture.',
          steps: [
            'Open a terminal and run: `dotnet new webapi -n TodoApi --no-https --use-controllers`',
            'Open the project in Visual Studio or VS Code',
            'Add a `Todo` model class with properties: Id (int), Title (string), IsCompleted (bool), CreatedAt (DateTime)',
            'Create `ITodoService` interface with GetAll, GetById, Create, Update, Delete methods',
            'Implement `TodoService` with an in-memory `List<Todo>` (no database yet — keep it simple)',
            'Create `TodosController` that injects `ITodoService` and exposes all 5 CRUD endpoints',
            'Register services in `Program.cs` and test all endpoints via Swagger',
            'Create a GitHub repo, push the code, and draw an architecture diagram: Controller → Service → In-Memory Store'
          ]
        }
      },

      {
        id: 'dotnet-l4',
        title: 'Day 4 — Unit Testing with xUnit',
        duration: '2 hours theory + 5 hours practice',
        type: 'practical',
        difficulty: 'intermediate',
        whatYoullLearn: [
          'The AAA pattern (Arrange-Act-Assert) — the universal structure of every unit test',
          'FIRST principles: Fast, Independent, Repeatable, Self-validating, Timely',
          'xUnit essentials: [Fact], [Theory], [InlineData], Assert library',
          'Professional test naming: MethodName_Scenario_ExpectedResult',
          'How to identify which code is worth unit-testing vs which is not'
        ],
        content: `# ✅ Day 4 — Unit Testing with xUnit

## 🎯 Objective
Write **real automated unit tests** against yesterday's To-Do API Service layer. By the end of today, no one needs to manually click through Swagger to verify your code — the tests do it.

---

## The AAA Pattern

Every unit test has three sections:

\`\`\`csharp
[Fact]
public async Task GetById_WithValidId_ReturnsTodo()
{
    // ARRANGE — set up everything the test needs
    var todos = new List<Todo> { new Todo { Id = 1, Title = "Write tests" } };
    var service = new TodoService(todos); // inject test data

    // ACT — call the method under test
    var result = await service.GetByIdAsync(1);

    // ASSERT — verify the outcome
    Assert.NotNull(result);
    Assert.Equal("Write tests", result.Title);
}
\`\`\`

---

## FIRST Principles

| Principle | What it means | How to achieve it |
|-----------|--------------|-------------------|
| **Fast** | Run in milliseconds | No database, no network, no file I/O |
| **Independent** | Tests don't depend on each other | Fresh state per test (no shared fields) |
| **Repeatable** | Same result every run | No randomness, no time-dependent logic |
| **Self-validating** | Pass or fail automatically | Always use Assert — never print and check manually |
| **Timely** | Written alongside or before the code | Don't add tests weeks after feature ships |

---

## xUnit Basics

### [Fact] — A single test case
\`\`\`csharp
[Fact]
public async Task Create_WithValidTitle_ReturnsCreatedTodo()
{
    var service = new TodoService(new List<Todo>());
    var dto = new CreateTodoDto { Title = "Buy groceries" };

    var result = await service.CreateAsync(dto);

    Assert.NotNull(result);
    Assert.Equal("Buy groceries", result.Title);
    Assert.False(result.IsCompleted);
    Assert.True(result.Id > 0);
}
\`\`\`

### [Theory] + [InlineData] — Data-driven tests
\`\`\`csharp
[Theory]
[InlineData("")]          // empty
[InlineData("   ")]       // whitespace only
[InlineData(null)]        // null
public async Task Create_WithInvalidTitle_ThrowsValidationException(string title)
{
    var service = new TodoService(new List<Todo>());
    var dto = new CreateTodoDto { Title = title };

    // Assert that the service throws — these should all behave the same
    await Assert.ThrowsAsync<ValidationException>(() => service.CreateAsync(dto));
}
\`\`\`

### Assert methods you'll use daily
\`\`\`csharp
Assert.Equal(expected, actual);          // values are equal
Assert.NotEqual(unexpected, actual);     // values are not equal
Assert.True(condition);                  // condition is true
Assert.False(condition);                 // condition is false
Assert.Null(value);                      // value is null
Assert.NotNull(value);                   // value is not null
Assert.Empty(collection);               // collection has no items
Assert.NotEmpty(collection);            // collection has items
Assert.Contains(item, collection);      // collection contains item
Assert.Throws<ExType>(() => code());    // code throws specific exception
Assert.ThrowsAsync<ExType>(asyncCode);  // async code throws exception
\`\`\`

---

## Naming Convention

Good test names are documentation. Use: **MethodName_Scenario_ExpectedResult**

\`\`\`
✅ GetById_WithValidId_ReturnsTodo
✅ GetById_WithNonExistentId_ThrowsNotFoundException
✅ Create_WithEmptyTitle_ThrowsValidationException
✅ Delete_WithLockedTodo_ThrowsBusinessException

❌ TestGetById
❌ Test1
❌ ShouldWork
\`\`\`

---

## What to Test in the Service Layer

**Test these (high value):**
- Happy path: valid input → correct output
- Edge cases: null, empty, max length, min value
- Exception handling: invalid input → correct exception type
- Business rules: e.g., can't mark as complete if already complete

**Don't test these (low value):**
- Framework code (Entity Framework, ASP.NET routing)
- Simple properties with no logic
- Things already covered by integration tests

---

## Setting Up the Test Project

\`\`\`bash
# From the solution root
dotnet new xunit -n TodoApi.Tests

# Add a reference to the main project
dotnet add TodoApi.Tests/TodoApi.Tests.csproj reference TodoApi/TodoApi.csproj

# Run all tests
dotnet test

# Run with verbose output
dotnet test --logger "console;verbosity=normal"
\`\`\``,
        exercise: {
          title: 'Day 4 Deliverable — xUnit Test Suite for Service Layer',
          description: 'Write unit tests covering every method in TodoService.',
          steps: [
            'Add an xUnit test project: `dotnet new xunit -n TodoApi.Tests` and reference the main project',
            'Write a test class `TodoServiceTests` with a fresh `TodoService` instance per test (use constructor, not shared field)',
            'Test **GetAll**: returns empty list initially, returns items after creation',
            'Test **GetById**: returns correct item for valid ID, throws `NotFoundException` for invalid ID',
            'Test **Create**: returns created item with ID assigned, throws for null/empty title, throws for title > 200 chars',
            'Test **Update**: updates correctly for valid input, throws `NotFoundException` for wrong ID',
            'Test **Delete**: removes item for valid ID, throws `NotFoundException` for wrong ID',
            'Use `[Theory]` + `[InlineData]` for all invalid title cases in Create',
            'Run `dotnet test` — all tests must be green before moving on',
            'Name every test using the `MethodName_Scenario_ExpectedResult` convention'
          ]
        }
      },

      {
        id: 'dotnet-l5',
        title: 'Day 5 — Mocking with Moq & Integration Testing',
        duration: '2 hours theory + 4 hours practice + 1 hour coverage',
        type: 'practical',
        difficulty: 'intermediate',
        whatYoullLearn: [
          'What mocking is and why it\'s the key to fast, reliable unit tests',
          'Moq syntax: Mock<T>, Setup, Returns, Verify — the four commands you use 95% of the time',
          'WebApplicationFactory for integration tests that spin up your real API',
          'In-memory databases for integration tests that need real data persistence',
          'Code coverage: what it means, how to measure it, and what % to aim for'
        ],
        content: `# 🧪 Day 5 — Mocking with Moq & Integration Testing

## 🎯 Objective
Isolate the Service layer with mocks so you can test it without a real database. Then write integration tests that hit real API endpoints and measure code coverage.

---

## Why Mock?

Yesterday's unit tests used an in-memory \`List<Todo>\` directly. On a real project the Service depends on a **Repository** that talks to SQL Server. You don't want your unit tests to:
- Require a database running
- Leave data behind between tests
- Run slowly (I/O is 1000x slower than memory)

**Solution:** Replace the real repository with a **mock** — an object that pretends to be the repository and returns whatever you tell it to.

---

## Moq in Practice

### Setup — telling the mock what to return
\`\`\`csharp
// Install: dotnet add package Moq

var mockRepo = new Mock<ITodoRepository>();

// When GetByIdAsync(1) is called, return this todo
mockRepo.Setup(r => r.GetByIdAsync(1))
        .ReturnsAsync(new Todo { Id = 1, Title = "Buy milk" });

// When GetByIdAsync is called with any int, return null
mockRepo.Setup(r => r.GetByIdAsync(It.IsAny<int>()))
        .ReturnsAsync((Todo)null);

// When GetAllAsync is called, return a list
mockRepo.Setup(r => r.GetAllAsync())
        .ReturnsAsync(new List<Todo> {
            new Todo { Id = 1, Title = "Task A" },
            new Todo { Id = 2, Title = "Task B" }
        });
\`\`\`

### Using the mock in a test
\`\`\`csharp
[Fact]
public async Task GetById_WithValidId_ReturnsTodo()
{
    // Arrange
    var mockRepo = new Mock<ITodoRepository>();
    mockRepo.Setup(r => r.GetByIdAsync(1))
            .ReturnsAsync(new Todo { Id = 1, Title = "Buy milk" });

    var service = new TodoService(mockRepo.Object); // inject mock

    // Act
    var result = await service.GetByIdAsync(1);

    // Assert
    Assert.Equal("Buy milk", result.Title);
}

[Fact]
public async Task GetById_WithInvalidId_ThrowsNotFoundException()
{
    // Arrange
    var mockRepo = new Mock<ITodoRepository>();
    mockRepo.Setup(r => r.GetByIdAsync(It.IsAny<int>()))
            .ReturnsAsync((Todo)null);

    var service = new TodoService(mockRepo.Object);

    // Act + Assert
    await Assert.ThrowsAsync<NotFoundException>(() => service.GetByIdAsync(999));
}
\`\`\`

### Verify — checking the mock was called correctly
\`\`\`csharp
[Fact]
public async Task Delete_WithValidId_CallsRepositoryDelete()
{
    // Arrange
    var mockRepo = new Mock<ITodoRepository>();
    mockRepo.Setup(r => r.GetByIdAsync(1))
            .ReturnsAsync(new Todo { Id = 1 });

    var service = new TodoService(mockRepo.Object);

    // Act
    await service.DeleteAsync(1);

    // Verify the repository's Delete method was actually called once with id=1
    mockRepo.Verify(r => r.DeleteAsync(1), Times.Once);
}
\`\`\`

---

## Integration Testing with WebApplicationFactory

Integration tests start the **real application** (controllers, middleware, DI) but use a test database:

\`\`\`csharp
// Install: dotnet add package Microsoft.AspNetCore.Mvc.Testing

public class TodosIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public TodosIntegrationTests(WebApplicationFactory<Program> factory)
    {
        // Override database with in-memory version
        _client = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                // Remove real DB registration
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));
                if (descriptor != null) services.Remove(descriptor);

                // Add in-memory DB
                services.AddDbContext<AppDbContext>(options =>
                    options.UseInMemoryDatabase("TestDb"));
            });
        }).CreateClient();
    }

    [Fact]
    public async Task GetTodos_ReturnsOkWithList()
    {
        var response = await _client.GetAsync("/api/todos");

        response.EnsureSuccessStatusCode();                    // 200-299
        var content = await response.Content.ReadAsStringAsync();
        var todos = JsonSerializer.Deserialize<List<TodoDto>>(content);
        Assert.NotNull(todos);
    }

    [Fact]
    public async Task CreateTodo_WithValidBody_Returns201()
    {
        var body = JsonSerializer.Serialize(new { Title = "Integration test todo" });
        var content = new StringContent(body, Encoding.UTF8, "application/json");

        var response = await _client.PostAsync("/api/todos", content);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var created = JsonSerializer.Deserialize<TodoDto>(
            await response.Content.ReadAsStringAsync());
        Assert.Equal("Integration test todo", created.Title);
    }
}
\`\`\`

---

## Code Coverage

Coverage tells you *which lines of code are executed by your tests*. It doesn't tell you if the tests are good — but low coverage is a red flag.

\`\`\`bash
# Run tests with coverage collection
dotnet test --collect:"XPlat Code Coverage"

# Install the report generator
dotnet tool install -g dotnet-reportgenerator-globaltool

# Generate an HTML report
reportgenerator -reports:"**/coverage.cobertura.xml" -targetdir:"coverage-report" -reporttypes:Html

# Open coverage-report/index.html in a browser
\`\`\`

**What coverage % to aim for:**
- Service layer: **80%+** — this is business logic, it must be tested
- Controllers: **60%+** — integration tests cover these
- Repositories: **40%** — mostly covered by integration tests
- DTOs/Models: not worth measuring (no logic)

> **Coverage ≠ quality.** You can hit 100% coverage with useless tests. Cover the important paths with meaningful assertions.`,
        exercise: {
          title: 'Day 5 Deliverable — Integration Tests + Coverage Report',
          description: 'Add a real Repository layer, mock it in unit tests, write integration tests, and generate a coverage report.',
          steps: [
            'Add `ITodoRepository` interface and `TodoRepository` implementation using EF Core',
            'Refactor `TodoService` to depend on `ITodoRepository` via constructor injection',
            'Rewrite Day 4 unit tests to use `Mock<ITodoRepository>` instead of direct in-memory list',
            'Add `Moq` package: `dotnet add package Moq`',
            'Write 2–3 integration tests using `WebApplicationFactory` with in-memory EF Core database',
            'Test: GET /api/todos returns 200, POST creates and returns 201, GET /api/todos/{invalid} returns 404',
            'Run `dotnet test --collect:"XPlat Code Coverage"` and generate the HTML report',
            'Write a short gap analysis: list 3 methods not yet covered and why they matter (or don\'t)',
            'Week 1 milestone: you now have a .NET API with full unit + integration tests and a coverage report'
          ]
        }
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════════
  // MODULE 3 — ANGULAR FRONTEND TESTING (Days 6–7)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'module-dotnet-3',
    title: 'Angular Frontend Testing',
    icon: '🅰️',
    lessons: [
      {
        id: 'dotnet-l6',
        title: 'Day 6 — Angular & TypeScript for Testers',
        duration: '2 hours theory + 4 hours practice',
        type: 'theory',
        difficulty: 'intermediate',
        whatYoullLearn: [
          'TypeScript essentials: types, interfaces, generics, decorators — enough to read Angular code',
          'Angular building blocks: modules, components, services, dependency injection, template binding',
          'RxJS Observables: subscribe, pipe, common operators — how Angular handles async data',
          'How to navigate an Angular codebase and identify what needs testing',
          'The difference between modern Angular (17+) and legacy AngularJS (1.x)'
        ],
        content: `# 🅰️ Day 6 — Angular & TypeScript for Testers

## 🎯 Objective
Understand an Angular app's structure well enough to **test it independently**. You don't need to build Angular features — you need to read, navigate, and write tests for what's already built.

---

## TypeScript Essentials for Testers

TypeScript is JavaScript with types. Every Angular file is TypeScript (\`.ts\`).

### Types & Interfaces
\`\`\`typescript
// Interface — defines the shape of an object
interface Todo {
  id: number;
  title: string;
  isCompleted: boolean;
  createdAt: Date;
}

// Type alias — same idea, different syntax
type CreateTodoRequest = {
  title: string;
};

// Using the types
const todo: Todo = { id: 1, title: 'Write tests', isCompleted: false, createdAt: new Date() };
const todos: Todo[] = [];          // array of Todo
const todo2: Todo | null = null;   // nullable
\`\`\`

### Decorators — What \`@Component\`, \`@Injectable\` mean
\`\`\`typescript
// A decorator is metadata attached to a class
@Component({
  selector: 'app-todo-list',    // HTML tag: <app-todo-list>
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent {
  // ...
}

@Injectable({ providedIn: 'root' }) // auto-registered in DI
export class TodoService {
  // ...
}
\`\`\`

---

## Angular Building Blocks

### Components — The UI Building Blocks
\`\`\`typescript
@Component({ selector: 'app-todo-list', templateUrl: './todo-list.component.html' })
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private todoService: TodoService) {} // DI — same as .NET

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.isLoading = true;
    this.todoService.getAll().subscribe({
      next: (todos) => { this.todos = todos; this.isLoading = false; },
      error: (err) => { this.errorMessage = 'Failed to load'; this.isLoading = false; }
    });
  }

  markComplete(id: number): void {
    this.todoService.markComplete(id).subscribe(() => {
      const todo = this.todos.find(t => t.id === id);
      if (todo) todo.isCompleted = true;
    });
  }
}
\`\`\`

### Template — HTML with Angular bindings
\`\`\`html
<!-- todo-list.component.html -->
<div *ngIf="isLoading">Loading...</div>
<p *ngIf="errorMessage" class="error">{{ errorMessage }}</p>

<ul>
  <!-- *ngFor — repeats for each item -->
  <li *ngFor="let todo of todos" [class.done]="todo.isCompleted">
    <!-- {{ }} — interpolation, renders value -->
    {{ todo.title }}
    <!-- (click) — event binding -->
    <button (click)="markComplete(todo.id)" [disabled]="todo.isCompleted">
      Complete
    </button>
  </li>
</ul>
\`\`\`

### Services — Injectable Business Logic
\`\`\`typescript
@Injectable({ providedIn: 'root' })
export class TodoService {
  private apiUrl = 'http://localhost:5000/api/todos';

  constructor(private http: HttpClient) {} // Angular's HTTP client

  getAll(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl);
  }

  create(dto: CreateTodoRequest): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, dto);
  }

  markComplete(id: number): Observable<void> {
    return this.http.patch<void>(\`\${this.apiUrl}/\${id}/complete\`, {});
  }
}
\`\`\`

---

## RxJS Observables — Async in Angular

Unlike .NET's \`async/await\`, Angular uses **Observables** (RxJS library) for all async operations.

\`\`\`typescript
// subscribe — listen to a stream of values
this.todoService.getAll().subscribe({
  next: (todos) => console.log(todos),   // success
  error: (err) => console.error(err),    // error
  complete: () => console.log('done')    // all values emitted
});

// pipe + operators — transform the stream
this.todoService.getAll()
  .pipe(
    map(todos => todos.filter(t => !t.isCompleted)),  // only incomplete
    catchError(err => of([]))                          // return empty on error
  )
  .subscribe(incomplete => this.todos = incomplete);
\`\`\`

---

## Navigating an Angular Codebase

\`\`\`
src/
  app/
    app.module.ts          → Root module (lists all components/services)
    app-routing.module.ts  → URL routes → Component mapping

    todo/
      todo-list/
        todo-list.component.ts    → Component logic (CLASS to test)
        todo-list.component.html  → Template (UI)
        todo-list.component.spec.ts → Tests go here
      todo.service.ts             → Service (CLASS to test)
      todo.service.spec.ts        → Service tests
      todo.model.ts               → Interfaces/types
\`\`\`

**What to test:**
- \`.service.ts\` files — all public methods, all HTTP calls
- \`.component.ts\` files — template rendering, user interactions, input/output bindings
- **Not worth unit testing:** routing configuration, module declarations, CSS`,
        exercise: {
          title: 'Day 6 Deliverable — Angular App + Component Tree Diagram',
          description: 'Generate a sample Angular app that calls your .NET API and map its architecture.',
          steps: [
            'Run: `ng new todo-angular --routing --style=scss` and open in VS Code',
            'Generate service: `ng generate service todo/todo`',
            'Generate components: `ng generate component todo/todo-list` and `ng generate component todo/todo-form`',
            'Implement `TodoService` with `getAll()`, `create()`, and `markComplete()` methods using `HttpClient`',
            'Implement `TodoListComponent`: load todos on init, display in a list, "Mark Complete" button per item',
            'Implement `TodoFormComponent`: form with title input, submit creates a new todo via the service',
            'Add `HttpClientModule` to `AppModule` and connect the Angular app to your .NET API URL',
            'Run `ng serve` and verify the app loads and talks to your .NET API',
            'Draw a component tree diagram: AppComponent → TodoListComponent (uses TodoService) + TodoFormComponent (uses TodoService)'
          ]
        }
      },

      {
        id: 'dotnet-l7',
        title: 'Day 7 — Angular Unit Testing with Jasmine & Karma',
        duration: '2 hours theory + 5 hours practice',
        type: 'practical',
        difficulty: 'intermediate',
        whatYoullLearn: [
          'Jasmine syntax: describe, it, expect, beforeEach, spyOn — the five building blocks',
          'Angular TestBed: how to spin up an Angular component in isolation for testing',
          'How to mock HttpClient with HttpClientTestingModule',
          'Shallow vs deep component testing — when each approach makes sense',
          'Async testing with fakeAsync/tick and whenStable'
        ],
        content: `# 🧪 Day 7 — Angular Unit Testing with Jasmine & Karma

## 🎯 Objective
Write and run automated unit tests for Angular components and services — the Angular equivalent of Day 4's xUnit tests.

---

## Jasmine Syntax

Jasmine is the testing framework Angular ships with. Every \`.spec.ts\` file uses it.

\`\`\`typescript
describe('TodoService', () => {                     // test suite (group)
  let service: TodoService;

  beforeEach(() => {                                // runs before each 'it'
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(TodoService);
  });

  it('should be created', () => {                  // individual test
    expect(service).toBeTruthy();
  });

  it('should call GET /api/todos', () => {
    // test code...
    expect(something).toEqual(expectedValue);      // assertion
  });
});
\`\`\`

### Expect matchers
\`\`\`typescript
expect(value).toBeTruthy();           // not null/undefined/false/0/''
expect(value).toBeFalsy();            // null, undefined, false, 0, ''
expect(value).toEqual(expected);      // deep equality
expect(value).toBe(expected);         // strict reference equality
expect(value).toContain(item);        // array/string contains
expect(value).toHaveBeenCalled();     // spy was called
expect(value).toHaveBeenCalledWith(args); // spy was called with specific args
expect(value).toHaveBeenCalledTimes(n);  // spy was called n times
\`\`\`

---

## Testing a Service with HttpClientTestingModule

\`\`\`typescript
// todo.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],    // fake HttpClient — no real network
      providers: [TodoService]
    });
    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();  // verify no unexpected HTTP calls
  });

  it('getAll() should GET /api/todos', () => {
    const mockTodos: Todo[] = [
      { id: 1, title: 'Task A', isCompleted: false, createdAt: new Date() }
    ];

    service.getAll().subscribe(todos => {
      expect(todos.length).toBe(1);
      expect(todos[0].title).toBe('Task A');
    });

    // Assert the HTTP call was made correctly
    const req = httpMock.expectOne('http://localhost:5000/api/todos');
    expect(req.request.method).toBe('GET');
    req.flush(mockTodos);  // respond with mock data
  });

  it('create() should POST with correct body', () => {
    const newTodo = { title: 'New task' };

    service.create(newTodo).subscribe();

    const req = httpMock.expectOne('http://localhost:5000/api/todos');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTodo);
    req.flush({ id: 1, ...newTodo, isCompleted: false });
  });
});
\`\`\`

---

## Testing a Component with TestBed

\`\`\`typescript
// todo-list.component.spec.ts
describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let mockTodoService: jasmine.SpyObj<TodoService>;

  beforeEach(async () => {
    // Create a spy object — all methods are spies (mocks)
    mockTodoService = jasmine.createSpyObj('TodoService', ['getAll', 'markComplete']);

    // Configure the spy to return fake data
    mockTodoService.getAll.and.returnValue(of([
      { id: 1, title: 'Test task', isCompleted: false, createdAt: new Date() }
    ]));

    await TestBed.configureTestingModule({
      declarations: [TodoListComponent],
      providers: [
        { provide: TodoService, useValue: mockTodoService }  // inject mock
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();  // trigger ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display todos on init', () => {
    expect(mockTodoService.getAll).toHaveBeenCalledOnce();
    expect(component.todos.length).toBe(1);
    expect(component.todos[0].title).toBe('Test task');
  });

  it('should render todo titles in the template', () => {
    const listItems = fixture.nativeElement.querySelectorAll('li');
    expect(listItems.length).toBe(1);
    expect(listItems[0].textContent).toContain('Test task');
  });

  it('should call markComplete when button clicked', () => {
    mockTodoService.markComplete.and.returnValue(of(undefined));

    // Simulate button click
    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(mockTodoService.markComplete).toHaveBeenCalledWith(1);
  });
});
\`\`\`

---

## Async Testing

Most Angular code is async. Two approaches:

\`\`\`typescript
// fakeAsync + tick — synchronous-looking async tests
it('should show error after failed load', fakeAsync(() => {
  mockTodoService.getAll.and.returnValue(throwError(() => new Error('Network error')));
  fixture.detectChanges();
  tick();  // flush all pending async operations
  fixture.detectChanges();

  const errorEl = fixture.nativeElement.querySelector('.error');
  expect(errorEl.textContent).toContain('Failed to load');
}));

// async + whenStable — for tests involving setTimeout, promises
it('should update after async operation', async () => {
  fixture.detectChanges();
  await fixture.whenStable();
  expect(component.todos).not.toBeNull();
});
\`\`\`

---

## Running Tests

\`\`\`bash
# Run all tests (opens Karma browser window)
ng test

# Run with coverage
ng test --code-coverage

# Run headless (for CI)
ng test --watch=false --browsers=ChromeHeadless
\`\`\``,
        exercise: {
          title: 'Day 7 Deliverable — Angular Unit Test Suite with Coverage',
          description: 'Write unit tests for TodoService and TodoListComponent with meaningful coverage.',
          steps: [
            'Open `todo.service.spec.ts` and configure TestBed with `HttpClientTestingModule`',
            'Write tests for `getAll()`: verify GET request is made, verify returned data shape',
            'Write tests for `create()`: verify POST is made, verify request body, verify returned object',
            'Write tests for `markComplete()`: verify PATCH is made with correct ID',
            'Open `todo-list.component.spec.ts` — create a spy object for `TodoService`',
            'Test: component initializes and calls `getAll()` in `ngOnInit`',
            'Test: todo titles are rendered in `<li>` elements after data loads',
            'Test: clicking "Mark Complete" button calls `markComplete(id)` with the correct ID',
            'Test: loading spinner shows when `isLoading=true`, hides when `isLoading=false`',
            'Test: error message renders when `getAll()` throws an error (use `throwError`)',
            'Run `ng test --code-coverage` and verify Service coverage is above 80%'
          ]
        }
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════════
  // MODULE 4 — E2E & CI/CD (Days 8–9)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'module-dotnet-4',
    title: 'E2E Testing & CI/CD',
    icon: '🚦',
    lessons: [
      {
        id: 'dotnet-l8',
        title: 'Day 8 — End-to-End Testing with Cypress',
        duration: '2 hours theory + 4 hours practice',
        type: 'practical',
        difficulty: 'advanced',
        whatYoullLearn: [
          'What E2E tests are for and what they are NOT — the right scope',
          'Cypress vs Playwright: why both are good choices and how to pick',
          'Selector best practices: data-testid attributes vs CSS vs text',
          'cy.intercept() for mocking and stubbing API responses in E2E tests',
          'Page Object Model pattern: how to make E2E tests maintainable as the UI changes'
        ],
        content: `# 🚦 Day 8 — End-to-End Testing with Cypress

## 🎯 Objective
Automate a **full user journey** across the Angular front end and .NET back end — the kind of test that proves to a stakeholder "the feature works end to end."

---

## What E2E Tests Cover (and What They Don't)

E2E tests run in a real browser, against a real backend, simulating real user actions. They are the **most expensive** test type — slow, brittle if overused, hard to debug.

**Use E2E tests for:**
- Critical user journeys (login, purchase, key workflows)
- Smoke tests after deployment
- Cross-browser verification

**Do NOT use E2E tests for:**
- Business logic (unit tests are cheaper and faster)
- Every edge case (integration tests handle these)
- Simple API checks (Postman/integration tests are better)

**Target:** 5–15 E2E tests covering 2–3 critical flows. Not 200.

---

## Cypress vs Playwright

| | Cypress | Playwright |
|---|---------|-----------|
| **Language** | JS/TS | JS/TS, Python, Java, C# |
| **Browser support** | Chrome, Firefox, Edge, Electron | Chrome, Firefox, Safari, Edge |
| **Speed** | Fast | Very fast |
| **Debugging** | Excellent time-travel UI | Good |
| **Setup** | Very easy | Easy |
| **Best for** | Teams new to E2E | Teams needing multi-browser or non-JS |

Both are excellent. Use whichever your team already has. The concepts transfer directly.

---

## Cypress: First Test

\`\`\`bash
# Install
npm install --save-dev cypress

# Open Cypress UI
npx cypress open

# Run headless
npx cypress run
\`\`\`

\`\`\`typescript
// cypress/e2e/todo.cy.ts

describe('Todo App — Create Flow', () => {

  beforeEach(() => {
    cy.visit('http://localhost:4200');  // Angular app URL
  });

  it('should display the todo list on load', () => {
    cy.get('[data-testid="todo-list"]').should('be.visible');
  });

  it('should create a new todo successfully', () => {
    const title = 'My E2E test todo';

    // Type in the form
    cy.get('[data-testid="todo-title-input"]').type(title);
    cy.get('[data-testid="todo-submit-btn"]').click();

    // Verify it appears in the list
    cy.get('[data-testid="todo-list"]')
      .should('contain.text', title);
  });

  it('should not submit with empty title', () => {
    cy.get('[data-testid="todo-submit-btn"]').should('be.disabled');
  });
});
\`\`\`

---

## Selector Best Practices

**Prioritize selectors in this order:**

\`\`\`typescript
// ✅ BEST — data-testid attributes (stable, purpose-built for testing)
cy.get('[data-testid="submit-button"]')

// ✅ GOOD — ARIA roles and labels (accessibility + testing)
cy.get('button[aria-label="Create todo"]')
cy.findByRole('button', { name: /create/i })  // with Testing Library

// ⚠️ OK — semantic elements
cy.get('form button[type="submit"]')

// ❌ AVOID — CSS classes (change with UI redesigns)
cy.get('.btn-primary.create-btn')

// ❌ NEVER — absolute XPaths (brittle, unreadable)
cy.get('#root > div > form > button:nth-child(2)')
\`\`\`

Add \`data-testid\` to your Angular template:
\`\`\`html
<input data-testid="todo-title-input" [(ngModel)]="title" />
<button data-testid="todo-submit-btn" [disabled]="!title">Add</button>
\`\`\`

---

## cy.intercept() — Mocking API Responses

Use intercept to test edge cases without needing the backend to actually return them:

\`\`\`typescript
it('should show error message when API fails', () => {
  // Intercept and stub the API call BEFORE visiting the page
  cy.intercept('GET', '/api/todos', {
    statusCode: 500,
    body: { message: 'Internal server error' }
  }).as('getTodosError');

  cy.visit('http://localhost:4200');
  cy.wait('@getTodosError');

  cy.get('[data-testid="error-message"]').should('contain', 'Failed to load');
});

it('should handle empty list', () => {
  cy.intercept('GET', '/api/todos', { statusCode: 200, body: [] }).as('emptyList');

  cy.visit('http://localhost:4200');
  cy.wait('@emptyList');

  cy.get('[data-testid="empty-state"]').should('be.visible');
  cy.get('[data-testid="todo-list"] li').should('have.length', 0);
});
\`\`\`

---

## Page Object Model (POM) in Cypress

POM moves all selector logic into dedicated classes so tests stay readable when the UI changes:

\`\`\`typescript
// cypress/pages/todo.page.ts
export class TodoPage {
  visit() {
    cy.visit('http://localhost:4200');
  }
  titleInput() {
    return cy.get('[data-testid="todo-title-input"]');
  }
  submitButton() {
    return cy.get('[data-testid="todo-submit-btn"]');
  }
  todoList() {
    return cy.get('[data-testid="todo-list"]');
  }
  createTodo(title: string) {
    this.titleInput().type(title);
    this.submitButton().click();
  }
}

// cypress/e2e/todo.cy.ts
const page = new TodoPage();

it('creates a todo', () => {
  page.visit();
  page.createTodo('Build something great');
  page.todoList().should('contain.text', 'Build something great');
});
\`\`\``,
        exercise: {
          title: 'Day 8 Deliverable — Cypress E2E Suite (Page Object Model)',
          description: 'Write a Cypress test suite for the full todo creation and completion flow using POM.',
          steps: [
            'Install Cypress: `npm install --save-dev cypress` in the Angular project',
            'Add `data-testid` attributes to all interactive elements in your Angular templates',
            'Create `cypress/pages/todo.page.ts` with the Page Object for your todo app',
            'Write E2E test: app loads and displays todo list (intercept GET to return mock data)',
            'Write E2E test: create a new todo — type title, click submit, verify it appears in list',
            'Write E2E test: empty title — submit button is disabled or shows validation error',
            'Write E2E test: API error — intercept GET with 500, verify error message is displayed',
            'Write E2E test: mark complete — click complete button, verify todo is styled as done',
            'Run `npx cypress run` headless — all 5 tests should pass',
            'Write a prioritization note: list the next 3 flows you would automate and justify why'
          ]
        }
      },

      {
        id: 'dotnet-l9',
        title: 'Day 9 — CI/CD with GitHub Actions',
        duration: '2 hours theory + 4 hours practice',
        type: 'practical',
        difficulty: 'advanced',
        whatYoullLearn: [
          'CI/CD fundamentals: what continuous integration and delivery mean in practice',
          'GitHub Actions YAML structure: triggers, jobs, steps, actions',
          'Running dotnet test, ng test, and Cypress in a pipeline automatically',
          'Publishing test results and coverage as pipeline artifacts',
          'The complete defect workflow: find → log → verify → close'
        ],
        content: `# 🔄 Day 9 — CI/CD with GitHub Actions

## 🎯 Objective
Tests that only run on your machine don't count. Get them running **automatically on every push** and producing reports the whole team can act on.

---

## CI/CD Fundamentals

**Continuous Integration (CI):** Every time someone pushes code, an automated pipeline runs all tests. If any test fails, the team knows immediately — before the code reaches production.

**Continuous Delivery (CD):** After tests pass, the pipeline automatically deploys to an environment (staging, preview, or production).

**Why it matters for testers:**
- Bugs are caught within minutes of being introduced, not weeks
- The test suite becomes the team's safety net — everyone trusts it
- Manual regression testing is reduced to exploratory/UAT only

---

## GitHub Actions YAML Structure

\`\`\`yaml
# .github/workflows/tests.yml

name: Test Suite

on:                              # TRIGGER: when does this run?
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  dotnet-tests:                  # JOB 1: .NET unit + integration tests
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.0.x'

      - name: Restore dependencies
        run: dotnet restore

      - name: Run .NET tests with coverage
        run: dotnet test --collect:"XPlat Code Coverage" --logger "trx;LogFileName=results.trx"

      - name: Publish test results
        uses: dorny/test-reporter@v1
        if: always()             # run even if tests fail
        with:
          name: .NET Test Results
          path: '**/*.trx'
          reporter: dotnet-trx

      - name: Generate coverage report
        run: |
          dotnet tool install -g dotnet-reportgenerator-globaltool
          reportgenerator -reports:"**/coverage.cobertura.xml" -targetdir:"coverage-report" -reporttypes:Html

      - name: Upload coverage report
        uses: actions/upload-artifact@v4
        with:
          name: dotnet-coverage
          path: coverage-report/

  angular-tests:                 # JOB 2: Angular unit tests
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: 'todo-angular/package-lock.json'

      - name: Install dependencies
        run: npm ci
        working-directory: todo-angular

      - name: Run Angular unit tests
        run: ng test --watch=false --browsers=ChromeHeadless --code-coverage
        working-directory: todo-angular

      - name: Upload Angular coverage
        uses: actions/upload-artifact@v4
        with:
          name: angular-coverage
          path: todo-angular/coverage/

  e2e-tests:                     # JOB 3: Cypress E2E tests
    runs-on: ubuntu-latest
    needs: [dotnet-tests, angular-tests]  # wait for unit tests to pass first

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Setup .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.0.x'

      - name: Start .NET API in background
        run: dotnet run --project TodoApi/TodoApi.csproj &

      - name: Install Angular dependencies
        run: npm ci
        working-directory: todo-angular

      - name: Start Angular app in background
        run: ng serve --port 4200 &
        working-directory: todo-angular

      - name: Wait for apps to be ready
        run: |
          npx wait-on http://localhost:5000/api/todos
          npx wait-on http://localhost:4200

      - name: Run Cypress E2E tests
        uses: cypress-io/github-action@v6
        with:
          working-directory: todo-angular
          browser: chrome
          headed: false

      - name: Upload Cypress screenshots on failure
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: cypress-screenshots
          path: todo-angular/cypress/screenshots/
\`\`\`

---

## Reading Pipeline Results

In the GitHub Actions tab:
- **Green ✅** — all tests passed, safe to merge
- **Red ❌** — a test failed; the PR should not be merged until fixed
- **Yellow ⏳** — pipeline is running

**Artifacts** (downloadable files) appear at the bottom of each job run — click to download coverage HTML reports.

---

## The Complete Defect Workflow

When a test fails in CI, or when you find a bug manually:

\`\`\`
1. FIND        Exploratory test or CI failure reveals a bug
     ↓
2. REPRODUCE   Confirm it's reproducible (try 3 times, on 2 environments)
     ↓
3. LOG         File a bug with: title, steps, expected, actual, severity,
               priority, environment, screenshots/logs, build version
     ↓
4. TRIAGE      Dev lead confirms it's a bug (not expected behaviour)
     ↓
5. FIX         Developer fixes it on a branch
     ↓
6. RE-TEST     Tester verifies the fix on the fix branch
               (same steps that originally reproduced it)
     ↓
7. REGRESSION  Run the full test suite — confirm nothing else broke
     ↓
8. CLOSE       Mark as fixed in the tracker; update any related tests
\`\`\`

**End-of-sprint test summary report format:**
\`\`\`
Sprint X Test Summary
─────────────────────
Features tested: [list]
Test cases executed: X / Y (Z% pass rate)
Bugs found: N (P1: 0, P2: 2, P3: 3)
Bugs fixed & verified: N
Remaining open bugs: N (list P1/P2 with owners)
Coverage: .NET 82%, Angular 76%
Recommendation: Ready to ship / Not ready (reason)
\`\`\``,
        exercise: {
          title: 'Day 9 Deliverable — GitHub Actions Pipeline Running All Three Suites',
          description: 'Create a working CI pipeline that runs .NET, Angular, and Cypress tests on every push.',
          steps: [
            'Create `.github/workflows/tests.yml` in the root of your GitHub repo',
            'Add the `dotnet-tests` job: checkout → setup .NET → restore → `dotnet test` with coverage → upload artifact',
            'Add the `angular-tests` job: checkout → setup Node → `npm ci` → `ng test --watch=false --browsers=ChromeHeadless --code-coverage`',
            'Add the `e2e-tests` job with `needs: [dotnet-tests, angular-tests]` so it only runs when unit tests pass',
            'In the E2E job, start both the .NET API and Angular app as background processes, use `wait-on` to wait for them',
            'Push to GitHub and watch the Actions tab — fix any failures you see',
            'Introduce a deliberate bug in TodoService, push, verify the pipeline goes red within 2 minutes, then fix and push again',
            'Write a short test summary report as if you were reporting the sprint results to your lead'
          ]
        }
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════════
  // MODULE 5 — CAPSTONE (Day 10)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'module-dotnet-5',
    title: 'Capstone Project',
    icon: '🏆',
    lessons: [
      {
        id: 'dotnet-l10',
        title: 'Day 10 — Capstone: Test a Feature from Scratch',
        duration: '2 hours planning + 5 hours execution',
        type: 'practical',
        difficulty: 'advanced',
        whatYoullLearn: [
          'How to approach a real ticket end-to-end: spec → test plan → automation → CI',
          'Risk-based test prioritization: deciding what to test first and why',
          'How to write a self-assessment that surfaces real gaps (not just "I think I\'m ready")',
          'Packaging a test artifact set: everything a lead needs to review your work',
          'The "Can Work Independently" checklist — 10 specific criteria to self-score'
        ],
        content: `# 🏆 Day 10 — Capstone: Test a Feature from Scratch

## 🎯 Objective
Prove end-to-end independent capability by handling a small feature **exactly the way it would arrive on the job**: a spec, no further instructions.

---

## The Capstone Feature: "Tag Todos"

Add a tagging feature to the To-Do API and Angular app:

**Backend spec:**
- A \`Todo\` can have zero or more tags (e.g., "work", "personal", "urgent")
- POST /api/todos/{id}/tags — adds a tag to a todo
- DELETE /api/todos/{id}/tags/{tag} — removes a tag
- GET /api/todos?tag={tag} — filters todos by tag
- Validation: tag max length 30 chars, max 10 tags per todo, no duplicates

**Frontend spec:**
- TodoListComponent shows tags as chips below each todo title
- TodoFormComponent allows typing tags (comma-separated input)
- Filter bar above the list allows filtering by tag

---

## Step 1 — Test Plan (30 mins)

Before writing a single test, write the plan. Answer these questions:

**Scope:** What exactly are we testing? What's out of scope?

**Risk-based prioritization:**
\`\`\`
P1 — Must test (critical path):
  - Add a valid tag → appears on todo
  - Filter by tag → correct todos returned
  - No duplicate tags allowed
  - Max tags enforced

P2 — Should test (important):
  - Max tag length enforced
  - Remove tag works
  - Empty filter shows all todos

P3 — Nice to test (edge cases):
  - Tags with special characters
  - Concurrent tag additions
  - Tag on non-existent todo returns 404
\`\`\`

**Exit criteria:** All P1 tests pass, no P2 bugs open. P3 logged as backlog.

---

## Step 2 — Manual Test Cases (30 mins)

Write at least 10 test cases using the templates from Day 1. Cover:
- Valid tag operations (positive)
- Validation boundaries (BVA: max length 30, exactly 30, 31 chars)
- Business rules (max 10 tags, duplicate tag rejected)
- Authorization (unauthenticated request should fail if auth is required)

---

## Step 3 — xUnit Tests for Tag Service (90 mins)

\`\`\`csharp
// TagService tests
[Fact] AddTag_WithValidTag_AddsToTodo()
[Fact] AddTag_WithDuplicateTag_ThrowsConflictException()
[Fact] AddTag_ExceedingMaxTags_ThrowsValidationException()
[Theory][InlineData(31)] AddTag_WithTagExceedingMaxLength_ThrowsValidationException(int length)
[Fact] RemoveTag_WithExistingTag_RemovesIt()
[Fact] RemoveTag_WithNonExistentTag_ThrowsNotFoundException()
[Fact] FilterByTag_ReturnsOnlyMatchingTodos()
\`\`\`

---

## Step 4 — Angular Unit Tests (60 mins)

\`\`\`typescript
// TodoListComponent — tags rendering
it('should display tags as chips for each todo')
it('should filter todos when a tag chip is clicked')
it('should call removeTag service when tag remove button clicked')

// TodoFormComponent — tag input
it('should parse comma-separated tags into array')
it('should not add more than 10 tags')
it('should trim whitespace from tags')
\`\`\`

---

## Step 5 — Cypress E2E Tests (60 mins)

\`\`\`typescript
// Critical flow — add a tag
it('adds a tag to a todo and it appears in the UI')

// Critical flow — filter by tag
it('filters the list to only show todos with the selected tag')

// Error flow — too many tags
it('shows error when trying to add an 11th tag')
\`\`\`

---

## Step 6 — Verify CI Pipeline Goes Green (30 mins)

Push everything, watch the GitHub Actions pipeline, fix any failures.

---

## ✅ Readiness Checklist — Score Yourself Honestly

Rate each item: ✅ Yes, fully | ⚠️ Partially | ❌ Not yet

| # | Criterion | Your Score |
|---|-----------|-----------|
| 1 | I can read and navigate a .NET Web API codebase without guidance | |
| 2 | I can read and navigate an Angular app's component/service structure | |
| 3 | I can write a test plan with scope, risks, and entry/exit criteria for a new feature | |
| 4 | I can write xUnit unit tests with Moq mocks achieving meaningful coverage | |
| 5 | I can write Angular unit tests (Jasmine/Karma) for components and services | |
| 6 | I can write and maintain Cypress E2E tests for critical user flows | |
| 7 | I can run structured exploratory testing and file high-quality, reproducible bug reports | |
| 8 | I can set up or extend CI pipelines and correctly interpret coverage/test reports | |
| 9 | I can debug a failing test and determine if it's a test defect vs a product defect | |
| 10 | I can go from a ticket/spec to tested, documented code without step-by-step guidance | |

**Scoring:**
- 9–10 ✅ → **Ready to work independently**
- 6–8 ✅ → **Ready with light oversight** — flag the ⚠️/❌ items with your mentor
- <6 ✅ → **Needs more time** — identify the weakest module and repeat it

> This checklist is exactly what to review in your next mentor check-in. Be honest — the goal isn't to pass the checklist, it's to find real gaps before they cost the team time in production.`,
        exercise: {
          title: 'Day 10 Deliverable — Full Test Artifact Set for the Tag Feature',
          description: 'Produce everything a lead needs to review: test plan, test cases, unit tests, E2E tests, bug log, green CI run, and a scored readiness checklist.',
          steps: [
            'Write a one-page test plan for the "Tag Todos" feature (scope, risks, prioritization, exit criteria)',
            'Write 10+ manual test cases covering valid operations, BVA on tag length, max tags, duplicates',
            'Implement the TagService and TagRepository in .NET (or ask for a pre-built stub from your mentor)',
            'Write xUnit tests with Moq for all 6 TagService methods listed in Step 3',
            'Write Angular unit tests for tag rendering and tag input behaviour listed in Step 4',
            'Write 3 Cypress E2E tests for the critical tag flows listed in Step 5',
            'Push everything, verify the GitHub Actions pipeline goes green',
            'Log any bugs you found with full reproduction steps in Jira/Trello',
            'Complete the Readiness Checklist above with honest scores',
            'Write a 5-minute verbal summary: "Here is what I built, here are the gaps I found in myself, here is my plan to close them"'
          ]
        }
      }
    ]
  }
];
