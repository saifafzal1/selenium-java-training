// ============================================================
// Database Testing with JDBC — Labs
// ============================================================

const DATABASE_CURRICULUM_LABS = [

  // ── LAB 1 ────────────────────────────────────────────────
  {
    id: 'db-lab-1',
    title: 'Lab 1: Your First JDBC Test Suite',
    duration: '35 min',
    difficulty: 'beginner',
    tags: ['JDBC', 'H2', 'CRUD', 'Maven', 'JUnit 5'],
    type: 'lab',
    objectives: [
      'Set up a Maven project with H2 and JUnit 5',
      'Create an H2 in-memory database and schema in @BeforeAll',
      'Write full CRUD tests with insert, select, update, delete assertions',
      'Use @BeforeEach cleanup to keep tests independent'
    ],
    content: `## Lab 1: Your First JDBC Test Suite

In this lab you'll build a complete JDBC test suite from scratch — from Maven project setup to passing CRUD tests.

### What You'll Build

A test suite for a **library book catalogue** with this schema:

\`\`\`sql
CREATE TABLE books (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    isbn      VARCHAR(20)  NOT NULL UNIQUE,
    title     VARCHAR(200) NOT NULL,
    author    VARCHAR(100) NOT NULL,
    year      INT          NOT NULL CHECK (year > 1000 AND year <= 2100),
    available BOOLEAN      NOT NULL DEFAULT TRUE
);
\`\`\`

### Step 1 — Maven pom.xml

Create a new Maven project and add these dependencies:

\`\`\`xml
<properties>
  <maven.compiler.source>21</maven.compiler.source>
  <maven.compiler.target>21</maven.compiler.target>
</properties>

<dependencies>
  <dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <version>2.2.224</version>
    <scope>test</scope>
  </dependency>
  <dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.10.2</version>
    <scope>test</scope>
  </dependency>
</dependencies>

<build>
  <plugins>
    <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-surefire-plugin</artifactId>
      <version>3.2.5</version>
    </plugin>
  </plugins>
</build>
\`\`\`

### Step 2 — Create the Test Class

\`\`\`java
// src/test/java/library/BookCatalogueTest.java
package library;

import org.junit.jupiter.api.*;
import java.sql.*;
import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.DisplayName.class)
class BookCatalogueTest {

    static Connection conn;

    @BeforeAll
    static void createDatabase() throws SQLException {
        conn = DriverManager.getConnection(
            "jdbc:h2:mem:librarydb;DB_CLOSE_DELAY=-1", "sa", "");

        try (Statement s = conn.createStatement()) {
            s.execute("""
                CREATE TABLE books (
                    id        INT AUTO_INCREMENT PRIMARY KEY,
                    isbn      VARCHAR(20)  NOT NULL UNIQUE,
                    title     VARCHAR(200) NOT NULL,
                    author    VARCHAR(100) NOT NULL,
                    year      INT          NOT NULL CHECK (year > 1000 AND year <= 2100),
                    available BOOLEAN      NOT NULL DEFAULT TRUE
                )
            """);
        }
        System.out.println("📚 Library database created");
    }

    @BeforeEach
    void clearBooks() throws SQLException {
        try (Statement s = conn.createStatement()) {
            s.execute("DELETE FROM books");
        }
    }

    @AfterAll
    static void close() throws SQLException {
        if (conn != null) conn.close();
    }

    @Test
    @DisplayName("1. Insert a book and verify it exists")
    void testInsertBook() throws SQLException {
        // TODO:
        // 1. Insert book: isbn="978-0-13-468599-1", title="Clean Code",
        //    author="Robert C. Martin", year=2008
        // 2. Assert executeUpdate() returns 1
        // 3. Assert generated key > 0
        // 4. SELECT it back and assert title = "Clean Code"
    }

    @Test
    @DisplayName("2. Update book availability")
    void testUpdateAvailability() throws SQLException {
        // TODO:
        // 1. Insert a book with available=TRUE
        // 2. UPDATE available = FALSE where isbn matches
        // 3. Assert 1 row updated
        // 4. SELECT back and assert available = false
    }

    @Test
    @DisplayName("3. Delete a book")
    void testDeleteBook() throws SQLException {
        // TODO:
        // 1. Insert 3 books
        // 2. Delete one by isbn
        // 3. Assert total count = 2
        // 4. Assert the deleted isbn no longer exists
    }

    @Test
    @DisplayName("4. Unique ISBN constraint is enforced")
    void testUniqueIsbnConstraint() throws SQLException {
        // TODO:
        // 1. Insert a book with isbn="ISBN-001"
        // 2. assertThrows(SQLException.class) when inserting same isbn again
        // 3. Assert count = 1 (duplicate was not saved)
    }

    @Test
    @DisplayName("5. Year CHECK constraint rejects year 999")
    void testYearCheckConstraint() {
        // TODO: assertThrows when inserting year=999
    }

    @Test
    @DisplayName("6. Find books by author")
    void testFindByAuthor() throws SQLException {
        // TODO:
        // 1. Insert 3 books: 2 by "Martin Fowler", 1 by "Robert Martin"
        // 2. SELECT WHERE author = 'Martin Fowler'
        // 3. Assert exactly 2 rows returned
    }
}
\`\`\`

### Step 3 — Run the Tests

\`\`\`bash
mvn test -Dtest=BookCatalogueTest
\`\`\`

### Reference Solution — testInsertBook

\`\`\`java
@Test
void testInsertBook() throws SQLException {
    String sql = "INSERT INTO books (isbn, title, author, year) VALUES (?, ?, ?, ?)";
    int generatedId;

    try (PreparedStatement ps = conn.prepareStatement(sql,
            Statement.RETURN_GENERATED_KEYS)) {
        ps.setString(1, "978-0-13-468599-1");
        ps.setString(2, "Clean Code");
        ps.setString(3, "Robert C. Martin");
        ps.setInt(4, 2008);

        int rows = ps.executeUpdate();
        assertEquals(1, rows, "Should insert exactly 1 row");

        try (ResultSet keys = ps.getGeneratedKeys()) {
            assertTrue(keys.next());
            generatedId = keys.getInt(1);
            assertTrue(generatedId > 0);
        }
    }

    try (PreparedStatement ps = conn.prepareStatement(
            "SELECT title, available FROM books WHERE id = ?")) {
        ps.setInt(1, generatedId);
        try (ResultSet rs = ps.executeQuery()) {
            assertTrue(rs.next(), "Inserted book should be retrievable");
            assertEquals("Clean Code", rs.getString("title"));
            assertTrue(rs.getBoolean("available"), "Book should be available by default");
        }
    }
}
\`\`\``,
    exercise: `## Lab Challenge — Extension Tasks

Once all 6 tests pass, extend the suite with these challenges:

**Challenge A — Pagination:**
Insert 20 books. Write a test that queries them in pages of 5 using:
\`SELECT * FROM books ORDER BY id LIMIT ? OFFSET ?\`
Assert page 1 returns 5 books with the 5 lowest IDs.

**Challenge B — Full-Text Search:**
Insert 10 books with varied titles. Write a test that uses:
\`SELECT * FROM books WHERE LOWER(title) LIKE LOWER(?)\`
Assert searching for "code" returns only books with "code" in the title.

**Challenge C — Aggregate Stats:**
After inserting books from years 2000-2010, write a test that asserts:
- Min year = 2000
- Max year = 2010
- Average year ≈ 2005
- Count = 11`,
    evaluate: `## Lab Evaluation Criteria

Your lab is complete when ALL of the following are true:

**Functional (80 points):**
- ✅ All 6 core tests pass (10 pts each)
- ✅ @BeforeEach cleanup works — running tests in any order gives same result (10 pts)
- ✅ Constraint tests use assertThrows correctly (10 pts)

**Code Quality (20 points):**
- ✅ All JDBC resources are closed with try-with-resources (5 pts)
- ✅ No hardcoded SQL values — all use PreparedStatement parameters (5 pts)
- ✅ Helper method for common operations (countBooks, insertTestBook) (5 pts)
- ✅ Clear failure messages in all assertions (5 pts)

**Run:** \`mvn test -Dtest=BookCatalogueTest\` — all 6 tests green = Lab 1 complete ✅`
  },

  // ── LAB 2 ────────────────────────────────────────────────
  {
    id: 'db-lab-2',
    title: 'Lab 2: Test Data Management with Builders & DBUnit',
    duration: '45 min',
    difficulty: 'intermediate',
    tags: ['Builder pattern', 'DBUnit', 'XML fixtures', 'test data', 'transactions'],
    type: 'lab',
    objectives: [
      'Implement a complete Builder-based test data layer',
      'Create XML fixture files and load them with DBUnit',
      'Use the BeforeEach-rollback pattern for full test isolation',
      'Verify complex multi-table data states with DBUnit assertions'
    ],
    content: `## Lab 2: Test Data Management with Builders & DBUnit

### Scenario

You're testing an **online quiz platform**. Your DB schema:

\`\`\`sql
CREATE TABLE quiz_users (
    id       INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50)  NOT NULL UNIQUE,
    email    VARCHAR(100) NOT NULL,
    tier     VARCHAR(10)  NOT NULL DEFAULT 'FREE'
);

CREATE TABLE quizzes (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    title      VARCHAR(200) NOT NULL,
    category   VARCHAR(50),
    difficulty VARCHAR(10)  DEFAULT 'MEDIUM',
    pass_score INT          DEFAULT 70
);

CREATE TABLE attempts (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    user_id   INT NOT NULL REFERENCES quiz_users(id),
    quiz_id   INT NOT NULL REFERENCES quizzes(id),
    score     INT NOT NULL CHECK (score >= 0 AND score <= 100),
    taken_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Part A — Build the Test Data Layer

\`\`\`java
public class QuizUserBuilder {
    private String username = "user_" + System.nanoTime();
    private String email    = username + "@lab.test";
    private String tier     = "FREE";

    public QuizUserBuilder username(String v) { this.username = v; return this; }
    public QuizUserBuilder email(String v)    { this.email = v;    return this; }
    public QuizUserBuilder asPro()            { this.tier = "PRO"; return this; }
    public QuizUserBuilder asAdmin()          { this.tier = "ADMIN"; return this; }

    public int insert(Connection conn) throws SQLException { /* implement */ return 0; }
}
\`\`\`

**Tests using builders:**
\`\`\`java
@Test
void testProUserAttemptCount() throws SQLException {
    int userId = new QuizUserBuilder().username("alice").asPro().insert(conn);
    int quizId = new QuizBuilder().title("Java Basics").insert(conn);

    new AttemptBuilder(userId, quizId).score(85).insert(conn);
    new AttemptBuilder(userId, quizId).score(72).insert(conn);
    new AttemptBuilder(userId, quizId).score(91).insert(conn);

    try (PreparedStatement ps = conn.prepareStatement(
            "SELECT COUNT(*) FROM attempts WHERE user_id = ?")) {
        ps.setInt(1, userId);
        try (ResultSet rs = ps.executeQuery()) {
            rs.next();
            assertEquals(3, rs.getInt(1));
        }
    }
}
\`\`\`

### Part B — XML Fixtures with DBUnit

Create \`src/test/resources/datasets/quiz-seed.xml\`:

\`\`\`xml
<?xml version="1.0" encoding="UTF-8"?>
<dataset>
  <quiz_users id="1" username="alice" email="alice@test.com" tier="PRO"/>
  <quiz_users id="2" username="bob"   email="bob@test.com"   tier="FREE"/>
  <quizzes id="1" title="Java Fundamentals" category="Java" difficulty="EASY" pass_score="60"/>
  <quizzes id="2" title="Spring Boot Deep Dive" category="Spring" difficulty="HARD" pass_score="80"/>
  <attempts id="1" user_id="1" quiz_id="1" score="95"/>
  <attempts id="2" user_id="1" quiz_id="2" score="78"/>
  <attempts id="3" user_id="2" quiz_id="1" score="55"/>
</dataset>
\`\`\`

### Part C — Transaction Isolation

\`\`\`java
@BeforeEach
void beginTx() throws SQLException { conn.setAutoCommit(false); }

@AfterEach
void rollbackTx() throws SQLException {
    conn.rollback();
    conn.setAutoCommit(true);
}
\`\`\``,
    exercise: `## Lab 2 Challenges

**Challenge A — Leaderboard Query:**
Seed 5 users with multiple attempts. Query the top 3 by best score and assert the order.

**Challenge B — Failed Attempts XML:**
Create \`expected-failed.xml\` showing only attempts where score < pass_score. Use DBUnit \`Assertion.assertEquals\` to compare.

**Challenge C — Bulk Data Builder:**
Create 100 users, 10 quizzes, 500 attempts using batch inserts. Assert completion under 2 seconds.`,
    evaluate: `## Lab 2 Evaluation

**Part A — Builders (30 pts):**
- ✅ QuizUserBuilder, QuizBuilder, AttemptBuilder implemented (10 each)
- ✅ Each builder has sensible defaults
- ✅ testProUserAttemptCount and 2 more builder tests pass

**Part B — DBUnit (40 pts):**
- ✅ XML fixture file loads without errors
- ✅ At least 3 tests use seeded data
- ✅ At least 1 test uses a JOIN query
- ✅ CLEAN_INSERT properly resets data between tests

**Part C — Transaction Isolation (30 pts):**
- ✅ @BeforeEach/AfterEach rollback pattern implemented
- ✅ Table is empty at start of each test
- ✅ Tests run in any order with same result`
  },

  // ── LAB 3 ────────────────────────────────────────────────
  {
    id: 'db-lab-3',
    title: 'Lab 3: Hybrid Selenium + JDBC E2E Tests',
    duration: '50 min',
    difficulty: 'intermediate',
    tags: ['Selenium', 'JDBC', 'hybrid', 'E2E', 'form submission', 'WebDriverWait'],
    type: 'lab',
    objectives: [
      'Write a BaseHybridTest class with shared WebDriver and Connection',
      'Submit forms with Selenium and assert DB persistence with JDBC',
      'Use JDBC to set up preconditions instead of driving the UI',
      'Verify data integrity across both the UI layer and the database layer'
    ],
    content: `## Lab 3: Hybrid Selenium + JDBC E2E Tests

### Application Under Test

A **contact management app** at \`http://localhost:8080\`.

\`\`\`sql
CREATE TABLE contacts (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    full_name  VARCHAR(100) NOT NULL,
    email      VARCHAR(150) NOT NULL UNIQUE,
    phone      VARCHAR(20),
    company    VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contact_notes (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    contact_id INT NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    note_text  TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Base Hybrid Test

\`\`\`java
public abstract class BaseContactHybridTest {

    protected static WebDriver driver;
    protected static WebDriverWait wait;
    protected static Connection conn;

    @BeforeAll
    static void setup() throws SQLException {
        ChromeOptions opts = new ChromeOptions();
        opts.addArguments("--headless=new", "--window-size=1280,800");
        driver = new ChromeDriver(opts);
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        conn = DriverManager.getConnection(
            System.getenv().getOrDefault("DB_URL", "jdbc:mysql://localhost:3306/contactsdb"),
            System.getenv().getOrDefault("DB_USER", "tester"),
            System.getenv().getOrDefault("DB_PASS", "tester")
        );
    }

    @AfterAll
    static void teardown() throws SQLException {
        if (driver != null) driver.quit();
        if (conn != null)   conn.close();
    }

    @BeforeEach
    void cleanupTestData() throws SQLException {
        try (PreparedStatement ps = conn.prepareStatement(
                "DELETE FROM contacts WHERE email LIKE '%@test.hybrid'")) {
            ps.executeUpdate();
        }
    }

    protected int countContactsByEmail(String email) throws SQLException {
        try (PreparedStatement ps = conn.prepareStatement(
                "SELECT COUNT(*) FROM contacts WHERE email = ?")) {
            ps.setString(1, email);
            try (ResultSet rs = ps.executeQuery()) { rs.next(); return rs.getInt(1); }
        }
    }

    protected int insertContact(String name, String email, String phone) throws SQLException {
        try (PreparedStatement ps = conn.prepareStatement(
                "INSERT INTO contacts (full_name, email, phone) VALUES (?, ?, ?)",
                Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, name); ps.setString(2, email); ps.setString(3, phone);
            ps.executeUpdate();
            try (ResultSet keys = ps.getGeneratedKeys()) { keys.next(); return keys.getInt(1); }
        }
    }
}
\`\`\`

### Test 1 — Create Contact Form → DB Verification

\`\`\`java
@Test
void testCreateContactSavesToDatabase() throws Exception {
    String email = "john.test@test.hybrid";

    driver.get("http://localhost:8080/contacts/new");
    driver.findElement(By.id("fullName")).sendKeys("John Test");
    driver.findElement(By.id("email")).sendKeys(email);
    driver.findElement(By.id("phone")).sendKeys("+1-555-0100");
    driver.findElement(By.cssSelector("button[type=submit]")).click();

    wait.until(ExpectedConditions.urlContains("/contacts/"));
    assertTrue(driver.findElement(By.tagName("h1")).getText().contains("John Test"));

    assertEquals(1, countContactsByEmail(email));

    try (PreparedStatement ps = conn.prepareStatement(
            "SELECT full_name, phone FROM contacts WHERE email = ?")) {
        ps.setString(1, email);
        try (ResultSet rs = ps.executeQuery()) {
            assertTrue(rs.next());
            assertEquals("John Test",   rs.getString("full_name"));
            assertEquals("+1-555-0100", rs.getString("phone"));
        }
    }
}
\`\`\``,
    exercise: `## Lab 3 Challenges

**Challenge A — Delete Contact:**
Insert via DB → navigate via UI → click Delete → assert DB count = 0 and cascade removed notes.

**Challenge B — Edit Contact Phone:**
Insert via DB with phone "555-OLD" → edit via Selenium → assert DB has phone = "555-NEW".

**Challenge C — Notes Cascade:**
Insert contact + 3 notes via DB → delete via UI → assert both tables show 0 records.`,
    evaluate: `## Lab 3 Evaluation

**Hybrid Setup (20 pts):**
- ✅ BaseContactHybridTest has both WebDriver and Connection set up correctly
- ✅ @BeforeEach cleanup uses an email pattern filter

**Form → DB Tests (40 pts):**
- ✅ testCreateContactSavesToDatabase: UI submission + DB assertion passes
- ✅ testDuplicateEmailShowsError: error shown + DB count = 1
- ✅ At least 1 more form test written

**DB → UI Tests (40 pts):**
- ✅ testContactListShowsDbRecords: DB-seeded records appear in UI
- ✅ At least 1 more DB-setup-then-UI-assert test written
- ✅ All waits use WebDriverWait — no Thread.sleep()`
  },

  // ── LAB 4 ────────────────────────────────────────────────
  {
    id: 'db-lab-4',
    title: 'Lab 4: Flyway Migrations & Performance Testing',
    duration: '40 min',
    difficulty: 'advanced',
    tags: ['Flyway', 'migration', 'performance', 'EXPLAIN', 'indexes', 'CI/CD'],
    type: 'lab',
    objectives: [
      'Write versioned Flyway migration scripts and test they apply correctly',
      'Verify data survives schema changes using migration tests',
      'Write timing assertions for critical database queries',
      'Use EXPLAIN to verify index usage in test assertions'
    ],
    content: `## Lab 4: Flyway Migrations & Performance Testing

### Part A — Flyway Migration Test Suite

**V1__create_products.sql:**
\`\`\`sql
CREATE TABLE products (
    id    INT AUTO_INCREMENT PRIMARY KEY,
    name  VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL
);
\`\`\`

**V2__add_category.sql:**
\`\`\`sql
ALTER TABLE products ADD COLUMN category VARCHAR(50) DEFAULT 'General';
\`\`\`

**V3__add_stock.sql:**
\`\`\`sql
ALTER TABLE products ADD COLUMN stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0);
CREATE INDEX idx_products_category ON products(category);
\`\`\`

**V4__add_sku.sql:**
\`\`\`sql
ALTER TABLE products ADD COLUMN sku VARCHAR(30) UNIQUE;
\`\`\`

\`\`\`java
class ProductMigrationTest {
    static Flyway flyway;
    static Connection conn;
    static final String DB_URL = "jdbc:h2:mem:migrationdb;DB_CLOSE_DELAY=-1;MODE=MySQL";

    @BeforeAll
    static void setup() throws SQLException {
        flyway = Flyway.configure()
            .dataSource(DB_URL, "sa", "")
            .locations("classpath:db/migration/products")
            .load();
        flyway.migrate();
        conn = DriverManager.getConnection(DB_URL, "sa", "");
    }

    @Test
    void testAllMigrationsApplied() throws SQLException {
        // TODO: assert flyway_schema_history count = 4
    }

    @Test
    void testV3StockConstraint() {
        // TODO: assertThrows when inserting stock = -5
    }

    @Test
    void testDataSurvivesAllMigrations() throws SQLException {
        // TODO: no NULL category, no NULL sku
    }
}
\`\`\`

### Part B — Performance Tests

\`\`\`java
@Tag("performance")
class ProductPerformanceTest {

    @Test
    void testFindByCategoryUnder30ms() throws SQLException {
        Instant start = Instant.now();
        // run SELECT WHERE category = 'Electronics'
        Duration elapsed = Duration.between(start, Instant.now());
        assertTrue(elapsed.toMillis() < 30,
            "Query took " + elapsed.toMillis() + "ms — expected < 30ms");
    }

    @Test
    void testExplainUsesIndexForCategory() throws SQLException {
        try (PreparedStatement ps = conn.prepareStatement(
                "EXPLAIN SELECT * FROM products WHERE category = 'Electronics'");
             ResultSet rs = ps.executeQuery()) {
            StringBuilder plan = new StringBuilder();
            while (rs.next()) plan.append(rs.getString(1));
            assertTrue(plan.toString().toUpperCase().contains("IDX_PRODUCTS_CATEGORY"));
        }
    }
}
\`\`\`

### Part C — CI Pipeline YAML

\`\`\`yaml
name: Database Tests
on: [push, pull_request]
jobs:
  migration-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { java-version: '21', distribution: 'temurin' }
      - run: mvn test -Dtest=ProductMigrationTest
  performance-tests:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { java-version: '21', distribution: 'temurin' }
      - run: mvn test -Dgroups=performance
        env:
          DB_URL: jdbc:mysql://localhost:3306/perftest
\`\`\``,
    exercise: `## Lab 4 Challenges

**Challenge A:** Add V5 with a discount column + CHECK constraint test.

**Challenge B:** Call \`flyway.validate()\` and assert it passes; modify a migration file and assert it throws FlywayValidateException.

**Challenge C:** Write a query that intentionally skips the index (LOWER(name)), run EXPLAIN and assert the index is NOT used. Then fix it and assert the index IS used.`,
    evaluate: `## Lab 4 Evaluation

**Part A — Migration Tests (40 pts):**
- ✅ All 4 migration versions applied (schema_history count = 4)
- ✅ V3 stock constraint test uses assertThrows
- ✅ testDataSurvivesAllMigrations confirms category and sku populated

**Part B — Performance Tests (40 pts):**
- ✅ At least 3 timing tests with meaningful thresholds
- ✅ EXPLAIN plan test verifies index usage
- ✅ Batch insert test cleans up after itself

**Part C — CI YAML (20 pts):**
- ✅ Migration tests run on every push/PR
- ✅ Performance tests only on main branch`
  },

  // ── CAPSTONE ─────────────────────────────────────────────
  {
    id: 'db-capstone',
    title: 'Capstone: Complete Database Test Suite',
    duration: '120 min',
    difficulty: 'advanced',
    tags: ['capstone', 'JDBC', 'DBUnit', 'Flyway', 'Selenium', 'performance', 'CI/CD'],
    type: 'lab',
    objectives: [
      'Build a production-quality, multi-layer database test suite from scratch',
      'Integrate JDBC, DBUnit, Flyway, and Selenium hybrid tests in one Maven project',
      'Implement a complete test data layer with builders and fixtures',
      'Set up a CI/CD pipeline for migration, integration, and performance tests'
    ],
    content: `## Capstone: Complete Database Test Suite

### Project: E-Commerce Backend Testing

### Stage A — Schema Migrations

\`\`\`sql
-- V1: Core tables
CREATE TABLE customers (id INT PK, name VARCHAR(100), email VARCHAR(150) UNIQUE, tier VARCHAR(10) DEFAULT 'STANDARD');
CREATE TABLE categories (id INT PK, name VARCHAR(50) UNIQUE);
CREATE TABLE products   (id INT PK, name VARCHAR(100), price DECIMAL(10,2), category_id INT FK, stock INT DEFAULT 0);

-- V2: Orders
CREATE TABLE orders      (id INT PK, customer_id INT FK, status VARCHAR(20) DEFAULT 'PENDING', total DECIMAL(10,2));
CREATE TABLE order_items (id INT PK, order_id INT FK, product_id INT FK, quantity INT, unit_price DECIMAL(10,2));

-- V3: Indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_customer   ON orders(customer_id);
CREATE INDEX idx_orders_status     ON orders(status);
\`\`\`

### Stage B — Test Data Layer

\`\`\`java
public class TestDataFactory {
    public static int createCustomerWithOrders(Connection c, int orderCount) throws SQLException { /* ... */ return 0; }
    public static int createProductInStock(Connection c, String cat, int qty) throws SQLException { /* ... */ return 0; }
    public static int createOrderWithItems(Connection c, int customerId, int... productIds) throws SQLException { /* ... */ return 0; }
}
\`\`\`

### Stage C — Integration Tests (10+ required)

- CRUD + constraint violations for each entity
- Order total = SUM(quantity × unit_price)
- Stock decreases when order placed
- Status transitions: PENDING → PROCESSING → SHIPPED → DELIVERED
- DBUnit fixture tests (2+ XML files)
- Migration tests (schema + data survival)

### Stage D — Hybrid Tests *(Optional)*

1. Place order via UI → verify DB order record + stock reduction
2. DB-seed out-of-stock product → verify UI shows "Out of Stock"
3. Cancel order via UI → verify status=CANCELLED in DB + stock restored

### Stage E — Performance Suite

\`\`\`java
@Tag("performance")
class ECommercePerformanceTest {
    @Test void testOrdersByCustomerUnder20ms() { /* timing */ }
    @Test void testPendingOrdersUnder50ms()    { /* timing */ }
    @Test void testProductSearchUnder30ms()    { /* timing */ }
    @Test void testExplainUsesIndexes()        { /* EXPLAIN */ }
    @Test void testBulkOrderInsertUnder2s()    { /* batch 10K */ }
}
\`\`\`

### Deliverables Checklist

\`\`\`
✅ pom.xml with all dependencies
✅ 3 Flyway migration scripts
✅ 4 Builder classes with Faker defaults
✅ TestDataFactory utility
✅ DBUnit XML fixtures (2+ files)
✅ 10+ integration tests
✅ 5 @Tag("performance") tests
✅ .github/workflows/db-tests.yml
✅ 3 hybrid tests (optional)
\`\`\`

\`\`\`bash
mvn test -Dexcludes="**/*PerformanceTest.java"
mvn test -Dgroups=performance
\`\`\``,
    exercise: `## Capstone Extensions

**Extension 1 — Report Generation:** After the suite runs, use JDBC to generate a summary: total customers, products, orders, migrations applied, avg query time.

**Extension 2 — Parallel Execution:** Configure JUnit 5 parallelism with 4 threads. Fix any isolation issues that arise.

**Extension 3 — Cleanup Audit:** Assert that \`SELECT COUNT(*) FROM customers WHERE email LIKE '%@test%'\` = 0 after the full suite.`,
    evaluate: `## Capstone Evaluation

**Stage A — Setup (10 pts):** All dependencies correct, migrations apply cleanly

**Stage B — Data Layer (20 pts):**
- 4 builders with Faker defaults (4 × 4 pts)
- TestDataFactory with 3 methods (4 pts)

**Stage C — Integration Tests (35 pts):**
- CRUD tests (9 pts) · Constraint tests (8 pts) · Business logic (9 pts)
- DBUnit fixtures (5 pts) · Migration tests (4 pts)

**Stage D — Hybrid Tests (15 pts optional):** 3 tests × 5 pts each

**Stage E — Performance (20 pts):** 5 timed tests (3 pts each) + EXPLAIN (5 pts)

**BUILD SUCCESS with 10+ tests green = 100 pts ✅**`
  }

];

// ── Push labs as a module into DATABASE_CURRICULUM ────────────
DATABASE_CURRICULUM.push({
  id: 'database-labs-module',
  title: '🗄️ Hands-On Database Testing Labs',
  icon: '🗄️',
  lessons: DATABASE_CURRICULUM_LABS
});
