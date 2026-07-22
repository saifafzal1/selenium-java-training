// ── .NET & Angular Testing — Labs & Capstone Assessments ────────────────────
// Hands-on deliverables, capstone challenges, and the readiness assessment
// ───────────────────────────────────────────────────────────────────────────────

const DOTNET_CURRICULUM_LABS = [
  {
    id: 'lab-dotnet-capstone',
    title: '🏆 Capstone Lab — Tag Feature: Full Test Artifact Set',
    duration: '8 hours',
    type: 'lab',
    difficulty: 'advanced',
    content: `# 🏆 Capstone Lab — Tag Feature: Full Test Artifact Set

This lab synthesizes everything from the 10-day ramp-up into a single end-to-end deliverable.
You will test the "Tag Todos" feature from scratch — exactly as you would on the job.

---

## The Feature Spec

**Backend (ASP.NET Core):**
- A \`Todo\` can have zero or more string tags
- **POST** /api/todos/{id}/tags — add a tag to a todo
- **DELETE** /api/todos/{id}/tags/{tag} — remove a tag
- **GET** /api/todos?tag={tag} — filter todos by tag
- Validation rules:
  - Tag max length: 30 characters
  - Max tags per todo: 10
  - No duplicate tags on the same todo
  - Tag on non-existent todo → 404

**Frontend (Angular):**
- Tags displayed as chips below each todo title
- Tag input in the create form (comma-separated)
- Filter bar filters the list by clicking a tag chip

---

## Part 1 — Test Plan (1 hour)

Produce a one-page test plan covering:
- **Scope:** features in / features out
- **Test types:** unit (xUnit, Jasmine), integration (WebApplicationFactory), E2E (Cypress), manual exploratory
- **Risk-based prioritization:** P1 / P2 / P3 test areas
- **Entry criteria:** what must be ready before testing starts
- **Exit criteria:** what "done" means (no P1 bugs, coverage thresholds, etc.)
- **Environment:** local vs CI

---

## Part 2 — Manual Test Cases (45 mins)

Write at least 12 test cases. Must include:
- Happy path: add valid tag → verify it appears
- BVA on tag length: 29 chars, 30 chars (boundary), 31 chars
- Max tags: add 10th tag (should succeed), add 11th tag (should fail)
- Duplicate detection: add same tag twice to same todo
- Filter: filter by a tag → only matching todos shown, unmatched hidden
- Auth: if the API requires auth, unauthenticated tag request → 401
- SQL injection in tag value: \`' OR 1=1 --\`
- XSS in tag value: \`<script>alert(1)</script>\`
- Non-existent todo: POST /api/todos/99999/tags → 404

Use the format: ID | Title | Precondition | Steps | Expected | Severity

---

## Part 3 — xUnit Unit Tests (90 mins)

\`\`\`
Required test methods:

TagService_AddTag_WithValidTag_AddsSuccessfully
TagService_AddTag_WithDuplicateTag_ThrowsConflictException
TagService_AddTag_ExceedingMaxCount_ThrowsValidationException
TagService_AddTag_WithTooLongTag_ThrowsValidationException (Theory: 31, 100, 255)
TagService_AddTag_ToNonExistentTodo_ThrowsNotFoundException
TagService_RemoveTag_WithExistingTag_RemovesSuccessfully
TagService_RemoveTag_WithNonExistentTag_ThrowsNotFoundException
TagService_GetByTag_ReturnsOnlyMatchingTodos
TagService_GetByTag_WithNoMatch_ReturnsEmptyList
\`\`\`

All tests use \`Mock<ITagRepository>\`. No tests touch the real database.

---

## Part 4 — Angular Unit Tests (60 mins)

\`\`\`
Required tests:

TodoListComponent: should render tag chips for each todo
TodoListComponent: should filter list when tag chip clicked
TodoListComponent: should hide tag chip remove button for completed todos
TodoListComponent: should call removeTag service when remove button clicked

TodoFormComponent: should parse comma-separated input into tag array
TodoFormComponent: should trim whitespace from each parsed tag
TodoFormComponent: should show error when more than 10 tags entered
TodoFormComponent: should not submit form when tag exceeds 30 chars
\`\`\`

Use \`jasmine.createSpyObj\` for the service. Use \`fakeAsync/tick\` for any async assertions.

---

## Part 5 — Cypress E2E Tests (60 mins)

\`\`\`
Required scenarios:

1. Add a tag to an existing todo → tag chip appears in list
2. Filter todos by clicking a tag chip → only matching todos visible
3. Remove a tag → chip disappears from todo
4. Try to add 11th tag → form shows inline error, API never called
5. Filter with no matches → empty state message displayed
\`\`\`

Use Page Object Model. Use \`cy.intercept()\` for error states only — let happy path hit the real backend.

---

## Part 6 — CI Pipeline Verification (30 mins)

1. Push all three test suites to a branch: \`test/tag-feature\`
2. GitHub Actions must show all three jobs green
3. Download and review the coverage artifacts — document the numbers

---

## Part 7 — Bug Log

During your testing, log every defect you find using the professional format:
Title | Steps | Expected | Actual | Severity | Priority | Environment

If no real bugs exist (you built a clean implementation), create 3 **intentional** bugs, log them, then fix them and verify — simulating a real triage cycle.

---

## Readiness Assessment — Score Yourself

| # | Criterion | ✅ / ⚠️ / ❌ | Notes |
|---|-----------|-------------|-------|
| 1 | Navigate a .NET codebase without guidance | | |
| 2 | Navigate an Angular app's component/service structure | | |
| 3 | Write a test plan with scope, risks, entry/exit criteria | | |
| 4 | Write xUnit tests with Moq achieving 80%+ service coverage | | |
| 5 | Write Angular Jasmine tests for components and services | | |
| 6 | Write Cypress E2E tests using Page Object Model | | |
| 7 | Run structured exploratory sessions and file quality bug reports | | |
| 8 | Set up or extend CI pipelines and interpret coverage reports | | |
| 9 | Diagnose a failing test (test defect vs product defect) | | |
| 10 | Go from spec → tested, documented code without hand-holding | | |

**Scoring guide:**
- 9–10 ✅ → Ready to work independently — close this course and pick up a real ticket
- 6–8 ✅ → Ready with light oversight — schedule a 30-min mentor review on ⚠️/❌ items
- <6 ✅ → Repeat the weakest module, then re-score

---

## Deliverables Checklist

Submit all of the following to be considered complete:

- [ ] Test plan document (1 page)
- [ ] 12+ manual test cases in a spreadsheet or test management tool
- [ ] xUnit test project pushed to GitHub (all 9 tests green)
- [ ] Angular unit test file (all 8 tests green, coverage report attached)
- [ ] Cypress E2E spec file (5 scenarios green)
- [ ] GitHub Actions pipeline screenshot (all three jobs green)
- [ ] Coverage numbers: .NET service layer %, Angular component/service %
- [ ] Bug log (real or simulated)
- [ ] Scored readiness checklist with honest notes on gaps
- [ ] 5-minute verbal summary prepared: what you built, where your gaps are, how you'll close them`,
    exercises: [
      {
        title: 'Part 1 — Write the Test Plan',
        description: 'Produce a one-page strategy document before writing any code.',
        steps: [
          'Define scope: "Tag CRUD on todo items; backend API + Angular UI; manual + automated."',
          'List what is OUT of scope: authentication system, performance testing, browser matrix.',
          'Write entry criteria: "Dev deploy stable on localhost; both apps start without errors."',
          'Write exit criteria: "0 P1 bugs, service layer coverage ≥ 80%, all automated tests green in CI."',
          'List 3 top risks and mitigations (e.g., "tag filtering performance on large datasets → test with 100+ todos")',
          'Save the test plan as a Markdown or Word document in your test artifacts folder.'
        ]
      },
      {
        title: 'Part 2 — Manual Test Cases',
        description: 'Write 12+ test cases using professional format before automating.',
        steps: [
          'Open a spreadsheet with columns: ID, Title, Precondition, Steps, Expected Result, Severity, Priority',
          'Write 4 happy-path cases: add valid tag, remove tag, filter by tag, show tags in UI',
          'Write 3 BVA cases for tag length boundary (29, 30, 31 chars)',
          'Write 2 business rule cases: 10th tag succeeds, 11th tag fails',
          'Write 1 duplicate tag case, 1 SQL injection case, 1 XSS case',
          'Execute all 12 cases manually against your local app and record actual results'
        ]
      },
      {
        title: 'Part 3 — xUnit Tests with Moq',
        description: 'Automate the service-layer tests against a mocked repository.',
        steps: [
          'Create TagService and ITagRepository in your .NET project',
          'Write TagServiceTests class in the xUnit project',
          'Implement all 9 test methods listed in Part 3',
          'Run `dotnet test` — all 9 must be green before proceeding',
          'Run with coverage: `dotnet test --collect:"XPlat Code Coverage"` — verify ≥ 80% on TagService'
        ]
      },
      {
        title: 'Part 4 — Angular Unit Tests',
        description: 'Test the tag rendering and form validation in Angular components.',
        steps: [
          'Add tag chip rendering to TodoListComponent template with data-testid attributes',
          'Add comma-separated tag input to TodoFormComponent with 10-tag and 30-char validation',
          'Write 8 Jasmine tests covering all scenarios listed in Part 4',
          'Run `ng test --watch=false --browsers=ChromeHeadless` — all 8 must be green',
          'Check coverage report: component coverage should be ≥ 70%'
        ]
      },
      {
        title: 'Part 5 — Cypress E2E Tests',
        description: 'Write 5 end-to-end scenarios using Page Object Model.',
        steps: [
          'Create `cypress/pages/todo.page.ts` — extend it to include tag-related selectors and actions',
          'Write a `cypress/e2e/tags.cy.ts` spec with all 5 scenarios',
          'Use `cy.intercept()` for the "11th tag → error" scenario only',
          'Run `npx cypress run` headless — all 5 scenarios must pass',
          'Add a screenshot artifact upload step to your GitHub Actions pipeline for E2E failures'
        ]
      },
      {
        title: 'Part 6 — CI & Final Assessment',
        description: 'Verify everything runs in CI and honestly score yourself.',
        steps: [
          'Commit everything to branch `test/tag-feature` and push to GitHub',
          'Verify all three GitHub Actions jobs go green (dotnet-tests, angular-tests, e2e-tests)',
          'Download coverage artifacts and record your numbers in the readiness checklist',
          'Complete the 10-point readiness self-assessment — be honest on every item',
          'Prepare a 5-minute verbal summary of what you built and where your gaps are',
          'Schedule a mentor review within 48 hours to discuss your self-assessment'
        ]
      }
    ]
  }
];
