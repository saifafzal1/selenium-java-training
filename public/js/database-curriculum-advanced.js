// ============================================================
// Database Testing with JDBC — Advanced Curriculum (Modules 3-4)
// Extends DATABASE_CURRICULUM defined in database-curriculum.js
// ============================================================

DATABASE_CURRICULUM.push(

  // ── MODULE 3 ─────────────────────────────────────────────
  {
    id: 'db-module-3',
    title: 'Hybrid UI + Database Testing',
    icon: '🔗',
    description: 'Combine Selenium WebDriver with JDBC to close the loop — act on the UI, then assert what was saved to the database.',
    lessons: [

      // ── db-l8 ──────────────────────────────────────────
      {
        id: 'db-l8',
        title: 'Selenium + JDBC — Closing the Loop',
        duration: '40 min',
        difficulty: 'intermediate',
        tags: ['Selenium', 'JDBC', 'hybrid testing', 'integration', 'end-to-end'],
        objectives: [
          'Structure a hybrid test class with WebDriver and Connection fields',
          'Submit a form with Selenium and verify the DB record with JDBC',
          'Query the DB to set up preconditions, then assert the UI reflects them',
          'Clean up both browser state and DB state after tests'
        ],
        content: `## Selenium + JDBC — Closing the Loop

### Why Hybrid Testing?

UI tests tell you what the user *sees*. DB tests tell you what was *saved*. Together they verify the complete flow:

\`\`\`
User fills form → Selenium submits it → Application processes it → DB stores it
\`\`\`

### Base Hybrid Test Class

\`\`\`java
public abstract class BaseHybridTest {
    protected static WebDriver driver;
    protected static WebDriverWait wait;
    protected static Connection dbConn;

    @BeforeAll
    static void setupAll() throws SQLException {
        ChromeOptions opts = new ChromeOptions();
        opts.addArguments("--headless", "--no-sandbox");
        driver = new ChromeDriver(opts);
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        dbConn = DriverManager.getConnection(
            System.getenv().getOrDefault("DB_URL", "jdbc:mysql://localhost:3306/testapp?useSSL=false"),
            System.getenv().getOrDefault("DB_USER", "testuser"),
            System.getenv().getOrDefault("DB_PASS", "testpass")
        );
    }

    @AfterAll
    static void tearDownAll() throws SQLException {
        if (driver != null)  driver.quit();
        if (dbConn != null)  dbConn.close();
    }

    @BeforeEach
    void clearTestData() throws SQLException {
        try (PreparedStatement ps = dbConn.prepareStatement(
                "DELETE FROM users WHERE email LIKE '%@test.example.com'")) {
            ps.executeUpdate();
        }
    }

    protected int countUsersWithEmail(String email) throws SQLException {
        try (PreparedStatement ps = dbConn.prepareStatement(
                "SELECT COUNT(*) FROM users WHERE email = ?")) {
            ps.setString(1, email);
            try (ResultSet rs = ps.executeQuery()) { rs.next(); return rs.getInt(1); }
        }
    }
}
\`\`\`

### Test: Form Submission → DB Verification

\`\`\`java
@Test
void testRegistrationSavesUserToDatabase() throws Exception {
    String email = "newuser@test.example.com";

    // STEP 1: UI — Fill and submit the registration form
    driver.get(BASE_URL + "/register");
    driver.findElement(By.id("firstName")).sendKeys("Jane");
    driver.findElement(By.id("email")).sendKeys(email);
    driver.findElement(By.id("password")).sendKeys("Secure@123");
    driver.findElement(By.id("submit")).click();

    // STEP 2: UI — Assert success message
    WebElement successMsg = wait.until(
        ExpectedConditions.visibilityOfElementLocated(By.id("success-message"))
    );
    assertTrue(successMsg.isDisplayed());

    // STEP 3: DB — Verify the record was persisted
    assertEquals(1, countUsersWithEmail(email));

    try (ResultSet rs = queryUser(email)) {
        assertTrue(rs.next());
        assertEquals("Jane",  rs.getString("first_name"));
        assertEquals("ACTIVE", rs.getString("status"));
        assertFalse(rs.getString("password_hash").contains("Secure@123"),
            "Password should NOT be stored in plaintext");
    }
}
\`\`\`

### Hybrid Test Checklist

- ✅ DB assertions use \`PreparedStatement\` (no SQL injection)
- ✅ Cleanup deletes test users by a clear pattern (e.g., \`%@test.example.com\`)
- ✅ UI waits use \`WebDriverWait\`, not \`Thread.sleep()\`
- ✅ JDBC connection is shared across the test class, not opened per test`,
        exercise: `## Exercise 8.1 — Product Checkout Hybrid Test

**Scenario:** Your e-commerce app has a checkout form that creates an \`orders\` record.

**Test 1 — testCheckoutCreatesOrderRecord:**
1. Use DB to INSERT a product (id=99, name="Test Widget", price=25.00, stock=10)
2. Use Selenium to: log in as a test user, add product to cart, complete checkout
3. Assert UI shows order confirmation number
4. Assert the DB has an order with that ID, status='PENDING', total=25.00

**Test 2 — testCheckoutDecreasesStock:**
1. Use DB to INSERT product with stock=5
2. Use Selenium to purchase 3 units
3. After checkout, query the DB and assert stock=2 (5 - 3)`,
        quiz: [
          {
            question: 'In a hybrid Selenium+JDBC test, what is the correct flow for verifying a form submission?',
            options: [
              'Query the DB first, then fill the form, then assert the UI',
              'Fill and submit the form with Selenium, assert the UI response, then query the DB to verify persistence',
              'Skip the UI assertion and only check the DB',
              'Run the UI test and DB test as completely separate, unrelated tests'
            ],
            correct: 1,
            explanation: 'The hybrid pattern follows the user journey: (1) UI action — fill and submit the form, (2) UI assertion — confirm the expected response was shown, (3) DB assertion — confirm the data was correctly persisted.'
          },
          {
            question: 'Why should you use DB setup (INSERT via JDBC) instead of UI setup (filling forms) for test preconditions when possible?',
            options: [
              'UI actions are unreliable and should be avoided',
              'DB setup is faster and more direct, keeping tests focused on the specific behavior being tested',
              'JDBC is always more accurate than Selenium',
              'UI setup cannot create test users'
            ],
            correct: 1,
            explanation: "If your test is checking checkout behavior, you don't need to test the registration flow again. Inserting the test user directly into the DB is 100x faster than driving the registration UI."
          },
          {
            question: 'How should test data created during hybrid tests be cleaned up?',
            options: [
              'Leave it — the in-memory DB resets on restart',
              'Use a naming pattern (e.g., test emails ending in @test.example.com) and DELETE by that pattern in @BeforeEach or @AfterEach',
              'Manually delete test data between test runs',
              'Create a new database for every test run'
            ],
            correct: 1,
            explanation: 'A naming convention (e.g., emails ending in @test.example.com) makes cleanup simple and safe: DELETE WHERE email LIKE \'%@test.example.com\'. @BeforeEach cleanup also cleans up data left by previously failed tests.'
          }
        ]
      },

      // ── db-l9 ──────────────────────────────────────────
      {
        id: 'db-l9',
        title: 'Data Integrity & Constraint Testing',
        duration: '30 min',
        difficulty: 'intermediate',
        tags: ['constraints', 'NOT NULL', 'UNIQUE', 'FK', 'CHECK', 'data integrity', 'SQLException'],
        objectives: [
          'Write tests that verify NOT NULL, UNIQUE, FK, and CHECK constraints are enforced',
          'Use assertThrows to verify SQLException on constraint violations',
          'Test cascade delete behavior for FK relationships',
          'Distinguish between application-level and database-level validation'
        ],
        content: `## Data Integrity & Constraint Testing

### The Constraint Testing Pattern

Every constraint test follows the same structure:
1. **Positive path** — valid data succeeds
2. **Negative path** — invalid data throws \`SQLException\`

\`\`\`java
// ── NOT NULL constraint
@Test
void testNotNullNameConstraint() {
    assertThrows(SQLException.class, () -> {
        try (PreparedStatement ps = conn.prepareStatement(
                "INSERT INTO employees (name, email) VALUES (NULL, 'a@test.com')")) {
            ps.executeUpdate();
        }
    });
}

// ── UNIQUE constraint
@Test
void testUniqueEmailConstraint() throws SQLException {
    insertEmployee("Alice", "alice@company.com", 60000);
    assertThrows(SQLException.class, () ->
        insertEmployee("Alice 2", "alice@company.com", 55000),
        "Duplicate email should throw SQLException"
    );
    assertEquals(1, countEmployees());
}

// ── CHECK constraint
@Test
void testNegativeSalaryViolatesCheckConstraint() {
    assertThrows(SQLException.class, () ->
        insertEmployee("Bob", "bob@company.com", -5000));
}

// ── CASCADE DELETE
@Test
void testCascadeDeleteRemovesEmployees() throws SQLException {
    int deptId = insertDepartment("Engineering");
    insertEmployeeInDept("Eve", "eve@co.com", deptId, 75000);
    insertEmployeeInDept("Frank", "frank@co.com", deptId, 80000);
    assertEquals(2, countEmployeesInDept(deptId));

    try (PreparedStatement ps = conn.prepareStatement(
            "DELETE FROM departments WHERE id = ?")) {
        ps.setInt(1, deptId); ps.executeUpdate();
    }
    assertEquals(0, countEmployeesInDept(deptId), "CASCADE DELETE should remove employees");
}
\`\`\`

### Application vs. Database Validation

| Layer | What it catches | What it misses |
|-------|----------------|----------------|
| **Client-side JS** | Basic format errors | Any direct API call |
| **Server-side Java** | Business rules | Script/batch inserts |
| **Database constraints** | Everything | Nothing — last resort |`,
        exercise: `## Exercise 9.1 — Bank Account Constraint Suite

Create a \`bank_accounts\` table with constraints:
\`\`\`sql
CREATE TABLE bank_accounts (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    account_no  VARCHAR(20) NOT NULL UNIQUE,
    owner_name  VARCHAR(100) NOT NULL,
    balance     DECIMAL(15,2) NOT NULL DEFAULT 0.00 CHECK (balance >= 0),
    account_type VARCHAR(10) NOT NULL CHECK (account_type IN ('CHECKING', 'SAVINGS')),
    is_active   BOOLEAN NOT NULL DEFAULT TRUE
);
\`\`\`

Write: testNullAccountNoFails, testDuplicateAccountNoFails, testNegativeBalanceFails, testInvalidAccountTypeFails, testValidInsertSucceeds, testDeactivatedAccountCannotGoNegative.`,
        quiz: [
          {
            question: 'What SQLSTATE prefix is typically used for constraint violations in JDBC exceptions?',
            options: [
              '08xxx (Connection exceptions)',
              '23xxx (Integrity constraint violations)',
              '42xxx (Syntax errors)',
              '40xxx (Transaction rollback)'
            ],
            correct: 1,
            explanation: 'SQL standard SQLSTATE 23xxx codes represent integrity constraint violations: 23502 is NOT NULL, 23503 is FK violation, 23505 is UNIQUE violation. Use ex.getSQLState().startsWith("23") to verify.'
          },
          {
            question: 'What does ON DELETE CASCADE on a foreign key mean?',
            options: [
              'When a child row is deleted, the parent row is also deleted',
              'When a parent row is deleted, all child rows referencing it are automatically deleted',
              'Deletion is prevented if any child rows reference the parent',
              'The deletion cascades to all tables in the database'
            ],
            correct: 1,
            explanation: 'ON DELETE CASCADE: if you DELETE a parent row (e.g., a department), the database automatically deletes all child rows that reference it (e.g., all employees in that department).'
          },
          {
            question: 'Why is it important to test database constraints even when the application already validates input?',
            options: [
              'Database constraints are faster than application validation',
              'Direct database access (scripts, migrations, other services) bypasses application validation — only DB constraints catch those',
              'Application validation and DB constraints test different columns',
              'JUnit requires testing all validation layers separately'
            ],
            correct: 1,
            explanation: 'Application code validates only what passes through it. A DBA running a SQL script, a batch import, or a microservice with a bug can insert invalid data directly. DB constraints catch ALL mutations regardless of how they arrive.'
          }
        ]
      }
    ]
  },

  // ── MODULE 4 ─────────────────────────────────────────────
  {
    id: 'db-module-4',
    title: 'Advanced Database Testing',
    icon: '🚀',
    description: 'Schema migration testing with Flyway, database performance assertions, and building a complete, CI-ready test database suite.',
    lessons: [

      // ── db-l10 ─────────────────────────────────────────
      {
        id: 'db-l10',
        title: 'Flyway Migration Testing',
        duration: '35 min',
        difficulty: 'advanced',
        tags: ['Flyway', 'migration', 'schema versioning', 'CI/CD', 'Liquibase'],
        objectives: [
          'Understand database schema versioning and why it matters for tests',
          'Set up Flyway in a Maven test project',
          'Write migration scripts that Flyway applies in order',
          'Test that migrations run cleanly and data survives schema changes'
        ],
        content: `## Flyway Migration Testing

### The Problem: Schema Drift

Without versioned migrations:
- "It works on my machine" — developer DBs diverge over time
- Deployment failures — production schema doesn't match the app
- Test failures — test DB missing a column added last week

### How Flyway Works

\`\`\`
migrations/
  V1__create_users.sql      ← runs first
  V2__add_email_index.sql   ← runs second
  V3__add_phone_column.sql  ← runs third
\`\`\`

### Flyway in Tests

\`\`\`java
public class FlywayMigrationTest {

    static Connection conn;
    static Flyway flyway;

    @BeforeAll
    static void setup() throws SQLException {
        String url = "jdbc:h2:mem:flywaydb;DB_CLOSE_DELAY=-1;MODE=MySQL";

        flyway = Flyway.configure()
            .dataSource(url, "sa", "")
            .locations("classpath:db/migration")
            .load();
        flyway.migrate();
        conn = DriverManager.getConnection(url, "sa", "");
    }

    @Test
    void testAllMigrationsApplied() throws SQLException {
        try (Statement s = conn.createStatement();
             ResultSet rs = s.executeQuery(
                 "SELECT COUNT(*) FROM flyway_schema_history WHERE success = TRUE")) {
            rs.next();
            assertEquals(3, rs.getInt(1), "All 3 migration scripts should have been applied");
        }
    }

    @Test
    void testMigrationIsIdempotent() {
        var result = flyway.migrate();
        assertEquals(0, result.migrationsExecuted, "Re-running migrate() should apply 0 new migrations");
    }
}
\`\`\``,
        exercise: `## Exercise 10.1 — Backward-Compatible Migration Test

**Scenario:** Rename \`users.name\` to \`users.full_name\` safely.

Create 3 migration scripts:
- V1: CREATE TABLE users with column \`name VARCHAR(100)\`
- V2: ADD COLUMN \`full_name\`, then UPDATE full_name = name
- V3: DROP COLUMN \`name\`

Write migration tests: testV1SchemaHasNameColumn, testV2BackfillsFullName, testV3RemovesOldColumn, testAllDataSurvivesAllMigrations.`,
        quiz: [
          {
            question: 'How does Flyway know which migration scripts have already been applied?',
            options: [
              'It reads a version number from the application properties file',
              'It maintains a flyway_schema_history table in the database recording every applied migration',
              'It compares file timestamps of migration scripts',
              'It relies on the developer to manually update a version file'
            ],
            correct: 1,
            explanation: 'Flyway creates and maintains a flyway_schema_history table that records every migration: version number, description, checksum, execution time, and success status.'
          },
          {
            question: 'What is the naming convention for Flyway versioned migration scripts?',
            options: [
              'migration_{number}.sql',
              'V{version}__{description}.sql (double underscore)',
              'db_{version}_changes.sql',
              'v{version}-{description}.sql (single hyphen)'
            ],
            correct: 1,
            explanation: 'Flyway versioned migrations follow V{version}__{description}.sql with a DOUBLE underscore. The version can be any sortable number.'
          },
          {
            question: 'What happens when you call flyway.migrate() and all migrations are already applied?',
            options: [
              'It throws an exception indicating nothing to do',
              'It re-runs all migrations from scratch',
              'It returns a result with migrationsExecuted = 0 (no-op)',
              'It validates checksums and fails if any script changed'
            ],
            correct: 2,
            explanation: 'migrate() is idempotent — safe to call even when no new migrations exist. It returns MigrateResult with migrationsExecuted=0. Safe to always call on application startup.'
          }
        ]
      },

      // ── db-l11 ─────────────────────────────────────────
      {
        id: 'db-l11',
        title: 'Database Performance Assertions',
        duration: '25 min',
        difficulty: 'advanced',
        tags: ['performance', 'query optimization', 'indexes', 'EXPLAIN', 'slow query', 'benchmarking'],
        objectives: [
          'Write timing assertions for critical database queries',
          'Use EXPLAIN to verify index usage in tests',
          'Detect N+1 query problems with JDBC query counting',
          'Build a simple database performance regression test'
        ],
        content: `## Database Performance Assertions

### Simple Timing Assertion

\`\`\`java
@Test
void testCustomerOrderQueryUnder50ms() throws SQLException {
    Duration limit = Duration.ofMillis(50);
    Instant start = Instant.now();

    try (PreparedStatement ps = conn.prepareStatement(
            "SELECT * FROM orders WHERE customer_id = ? AND status = 'COMPLETED'")) {
        ps.setInt(1, 42);
        try (ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {} // consume results
        }
    }

    Duration elapsed = Duration.between(start, Instant.now());
    assertTrue(elapsed.compareTo(limit) < 0,
        "Customer order query should complete under 50ms — took: " + elapsed.toMillis() + "ms");
}
\`\`\`

### Detecting Missing Indexes with EXPLAIN

\`\`\`java
@Test
void testQueryUsesIndex() throws SQLException {
    try (PreparedStatement ps = conn.prepareStatement(
            "EXPLAIN SELECT * FROM orders WHERE customer_id = 42")) {
        try (ResultSet rs = ps.executeQuery()) {
            StringBuilder plan = new StringBuilder();
            while (rs.next()) { plan.append(rs.getString(1)); }
            String planStr = plan.toString().toUpperCase();
            assertTrue(planStr.contains("IDX_ORDERS_CUSTOMER"),
                "Query should use the customer_id index. Plan: " + planStr);
        }
    }
}
\`\`\`

### Performance Test Best Practices

- **Run performance tests separately** from unit tests
- **Use realistic data volumes** — 100K rows minimum
- **Set realistic thresholds** — measure first, then set 2x current
- **Mark as @Tag("performance")** to exclude from normal CI`,
        exercise: `## Exercise 11.1 — Performance Regression Suite

**Setup:** Create a \`transactions\` table with 50,000 rows across 500 accounts.

Write these @Tag("performance") tests:
1. testFindTransactionsByAccountUnder20ms
2. testMonthlyTotalUnder50ms — GROUP BY month, SUM(amount)
3. testBatchInsert1000RowsUnder500ms
4. testExplainPlanUsesAccountIndex — assert "INDEX" appears in EXPLAIN plan`,
        quiz: [
          {
            question: 'What is an N+1 query problem?',
            options: [
              'A query that returns N+1 more rows than expected',
              'Executing N additional queries (one per row) after an initial query, instead of one JOIN query',
              'A primary key sequence that skips N+1 values',
              'A connection pool that opens N+1 extra connections'
            ],
            correct: 1,
            explanation: 'N+1 occurs when code loads N records and then executes a separate query for each to get related data. With 100 orders, N+1 = 101 queries instead of 1-2. The fix is a JOIN or batch load.'
          },
          {
            question: 'Why should database performance tests use large data volumes (e.g., 100,000+ rows)?',
            options: [
              'JUnit requires large datasets for statistical accuracy',
              'Performance problems (missing indexes, table scans) only become measurable at realistic data volumes',
              'JDBC returns incorrect results with small datasets',
              'H2 in-memory databases perform better with larger datasets'
            ],
            correct: 1,
            explanation: 'A full table scan on 100 rows may complete in 1ms — indistinguishable from an indexed query. At 100,000 rows, the scan takes 500ms while the indexed query still takes 1ms.'
          },
          {
            question: 'What does the SQL EXPLAIN command provide in a performance test?',
            options: [
              'The execution time of the query',
              'The query execution plan — how the database will access data (table scan, index use, join order)',
              'The number of rows that will be returned',
              'The CPU cost in milliseconds'
            ],
            correct: 1,
            explanation: 'EXPLAIN shows the query execution plan chosen by the optimizer. You can see if the query uses an index (fast) or does a full table scan (slow), without needing large data volumes.'
          }
        ]
      }
    ]
  }

); // end DATABASE_CURRICULUM (Modules 3-4)
