// ============================================================
// Database Testing with JDBC — Curriculum  (Modules 0-2)
// Modules 3-4 added by database-curriculum-advanced.js
// ============================================================

const DATABASE_CURRICULUM = [

  // ── MODULE 0 ─────────────────────────────────────────────
  {
    id: 'db-module-0',
    title: 'Introduction to Database Testing',
    icon: '🗄️',
    description: 'Understand why database testing matters, set up JDBC with Maven, and write your first database assertion in a Java test.',
    lessons: [

      // ── db-l0 ──────────────────────────────────────────
      {
        id: 'db-l0',
        title: 'Why Test the Database?',
        duration: '20 min',
        difficulty: 'beginner',
        tags: ['database', 'testing fundamentals', 'JDBC', 'SQL'],
        objectives: [
          'Explain what database testing is and why the UI alone is not enough',
          'Identify the three layers where defects hide (UI, API, DB)',
          'List common database defects: data corruption, truncation, constraint violations',
          'Understand when to use JDBC vs ORM vs DBUnit for test assertions'
        ],
        content: `## Why Test the Database?

Most test automation beginners focus entirely on the UI — they click buttons, fill forms, and assert what they see on screen. But what happens *behind* the screen is just as important.

### The Three-Layer Problem

A web application has at least three places where data lives and can go wrong:

\`\`\`
  Browser (UI)  →  Server (API / Business Logic)  →  Database (Persistence)
       ↕                      ↕                              ↕
   CSS/HTML bugs         Null checks missed           Data truncated
   Wrong label text      Wrong status code            FK constraint skipped
   Missing validation    Field not saved              Wrong column updated
\`\`\`

A green UI test does **not** mean the data was stored correctly. Consider this scenario:

> Your Selenium test fills a registration form and clicks Submit. The page shows "Registration Successful!" — but the email was silently truncated from 52 chars to 50 because the DB column is \`VARCHAR(50)\`. The UI never complained.

This is a real class of defect. Only a database test would catch it.

### What Database Testing Covers

| Type | What You Check |
|------|----------------|
| **Data persistence** | Record is actually saved after form submission |
| **Data integrity** | Values are not corrupted, truncated, or mistyped |
| **Constraints** | NOT NULL, UNIQUE, FK constraints behave correctly |
| **Transactions** | Partial failures roll back atomically |
| **Performance** | Queries run within acceptable time bounds |
| **Migration safety** | Schema changes don't break existing data |

### Tools You'll Use in This Course

- **JDBC** (Java Database Connectivity) — the standard Java API for talking to any relational database
- **H2** — a lightweight in-memory database perfect for testing (no install needed)
- **MySQL / PostgreSQL** — production-grade databases you'll connect to in later modules
- **DBUnit** — a JUnit extension for seeding and asserting database state
- **Flyway** — a migration tool that lets you version your schema changes

### Why Not Just Use the ORM?

Many Java apps use Hibernate or JPA to interact with the DB. You might wonder: "can't I just test through the ORM?" The answer: sometimes yes, but often no:

1. The ORM adds abstraction — it might silently succeed even when a constraint is violated in some edge cases
2. You want to verify the *physical database state* — the actual bytes stored, not what the ORM thinks it stored
3. Some bugs only appear at the SQL/JDBC layer (connection pool exhaustion, transaction isolation issues)

### Quick Analogy

Think of your application as a restaurant:
- **UI tests** = checking if the menu looks right
- **API tests** = checking if the waiter takes your order correctly
- **Database tests** = checking if the kitchen actually prepared what was ordered and it went into the right plate

You need all three for confidence.

### What We'll Build

By the end of this course you'll have a complete **Database Test Suite** in Java that:
- Connects to H2 (in-memory) for fast CI tests
- Seeds test data before each test and cleans up after
- Validates DB state after every UI action (Selenium + JDBC)
- Runs schema migration tests with Flyway
- Includes performance assertions on critical queries

Let's start setting up JDBC in the next lesson.`,
        exercise: `## Exercise 0.1 — Identify the Database Risk

Look at the following Selenium test. Your job is to identify what **database testing** would add to the confidence level.

\`\`\`java
@Test
public void testUserRegistration() {
    driver.get("http://localhost:8080/register");
    driver.findElement(By.id("firstName")).sendKeys("John");
    driver.findElement(By.id("lastName")).sendKeys("Doe");
    driver.findElement(By.id("email")).sendKeys("john.doe@example.com");
    driver.findElement(By.id("password")).sendKeys("Secure123!");
    driver.findElement(By.id("submit")).click();

    // Assert success message
    WebElement msg = driver.findElement(By.id("success-msg"));
    assertEquals("Registration successful!", msg.getText());
}
\`\`\`

**Questions to answer (write in your notes):**

1. List **3 things** that could be wrong in the database even though this test passes.
2. What SQL query would you run to verify the user was correctly saved?
3. If the email column is \`VARCHAR(30)\` but the test email is 24 chars, would the test catch a bug if someone submits a 35-char email? Why or why not?

**Bonus:** Write a comment block above the test describing what database assertions you would add.`,
        quiz: [
          {
            question: 'A Selenium test submits a form and the success page loads. What can you NOT conclude from this?',
            options: [
              'The UI rendered the success message correctly',
              'The database correctly stored all submitted values',
              'The form submit button was clickable',
              'The page URL changed after submission'
            ],
            correct: 1,
            explanation: 'UI test success only confirms what the browser displays. It gives no evidence that the data was stored correctly in the database — values could be truncated, missing, or stored in the wrong column.'
          },
          {
            question: 'Which tool provides the lowest-level, most direct way to assert database state in Java?',
            options: [
              'Hibernate ORM',
              'REST Assured (via API)',
              'JDBC (Java Database Connectivity)',
              'Selenium WebDriver'
            ],
            correct: 2,
            explanation: 'JDBC is the standard Java API for direct database communication. It bypasses all application layers (UI, API, ORM) and lets you query the database directly — giving you the most accurate view of what was actually stored.'
          },
          {
            question: 'What type of defect is BEST caught by database testing but would be missed by UI testing?',
            options: [
              'A button that does not respond to clicks',
              'A page that loads slowly',
              'A form field value that is silently truncated when stored',
              'A missing CSS class on a label'
            ],
            correct: 2,
            explanation: 'Silent data truncation (e.g., email stored as 50 chars when 52 were entered) happens at the database layer. The UI would still show a success message, so a UI test would pass — only a database assertion checking the stored value would catch this defect.'
          }
        ]
      },

      // ── db-l1 ──────────────────────────────────────────
      {
        id: 'db-l1',
        title: 'Setting Up JDBC with Maven',
        duration: '25 min',
        difficulty: 'beginner',
        tags: ['JDBC', 'Maven', 'H2', 'MySQL', 'pom.xml', 'setup'],
        objectives: [
          'Add JDBC and H2 dependencies to pom.xml',
          'Understand DriverManager, Connection, Statement, ResultSet',
          'Write a "Hello JDBC" connection test',
          'Configure H2 in-memory database for fast test execution'
        ],
        content: `## Setting Up JDBC with Maven

### Maven Dependencies

Open your \`pom.xml\` and add these dependencies inside the \`<dependencies>\` block:

\`\`\`xml
<!-- JDBC driver for H2 in-memory DB (perfect for testing) -->
<dependency>
  <groupId>com.h2database</groupId>
  <artifactId>h2</artifactId>
  <version>2.2.224</version>
  <scope>test</scope>
</dependency>

<!-- MySQL JDBC driver (for real DB connections) -->
<dependency>
  <groupId>com.mysql</groupId>
  <artifactId>mysql-connector-j</artifactId>
  <version>8.3.0</version>
</dependency>

<!-- PostgreSQL JDBC driver (alternative) -->
<dependency>
  <groupId>org.postgresql</groupId>
  <artifactId>postgresql</artifactId>
  <version>42.7.3</version>
</dependency>

<!-- DBUnit for seeding/asserting DB state -->
<dependency>
  <groupId>org.dbunit</groupId>
  <artifactId>dbunit</artifactId>
  <version>2.7.3</version>
  <scope>test</scope>
</dependency>
\`\`\`

### The JDBC Core Interfaces

JDBC is built around four key interfaces — you'll use all of them:

\`\`\`
DriverManager → Connection → Statement/PreparedStatement → ResultSet
    (1)             (2)              (3)                        (4)
\`\`\`

| Interface | Responsibility |
|-----------|---------------|
| **DriverManager** | Creates database connections |
| **Connection** | Represents an open session to the database |
| **Statement / PreparedStatement** | Executes SQL queries |
| **ResultSet** | Holds the rows returned by a SELECT query |

### Hello JDBC — Your First Connection

Create \`src/test/java/db/HelloJdbcTest.java\`:

\`\`\`java
package db;

import org.junit.jupiter.api.*;
import java.sql.*;

import static org.junit.jupiter.api.Assertions.*;

public class HelloJdbcTest {

    private static Connection connection;

    @BeforeAll
    static void setupDatabase() throws SQLException {
        // H2 in-memory database — created fresh each test run
        // URL format: jdbc:h2:mem:<db-name>;DB_CLOSE_DELAY=-1
        connection = DriverManager.getConnection(
            "jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1",
            "sa",   // username (H2 default)
            ""      // password (empty for H2 in-memory)
        );

        // Create a test table
        try (Statement stmt = connection.createStatement()) {
            stmt.execute("""
                CREATE TABLE users (
                    id         INT AUTO_INCREMENT PRIMARY KEY,
                    first_name VARCHAR(50)  NOT NULL,
                    last_name  VARCHAR(50)  NOT NULL,
                    email      VARCHAR(100) NOT NULL UNIQUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """);
        }
        System.out.println("✅ H2 in-memory database ready");
    }

    @AfterAll
    static void closeDatabase() throws SQLException {
        if (connection != null && !connection.isClosed()) {
            connection.close();
        }
    }

    @Test
    void testDatabaseIsReachable() throws SQLException {
        // isValid(timeout) pings the DB and returns true if connection is alive
        assertTrue(connection.isValid(5), "Database connection should be valid");
    }

    @Test
    void testInsertAndRetrieve() throws SQLException {
        // INSERT a user
        try (PreparedStatement insert = connection.prepareStatement(
            "INSERT INTO users (first_name, last_name, email) VALUES (?, ?, ?)"
        )) {
            insert.setString(1, "Alice");
            insert.setString(2, "Smith");
            insert.setString(3, "alice@example.com");
            int rowsAffected = insert.executeUpdate();
            assertEquals(1, rowsAffected, "Should insert exactly 1 row");
        }

        // SELECT the user back
        try (PreparedStatement select = connection.prepareStatement(
            "SELECT first_name, last_name, email FROM users WHERE email = ?"
        )) {
            select.setString(1, "alice@example.com");
            try (ResultSet rs = select.executeQuery()) {
                assertTrue(rs.next(), "User should exist in the database");
                assertEquals("Alice", rs.getString("first_name"));
                assertEquals("Smith", rs.getString("last_name"));
            }
        }
    }
}
\`\`\`

### Connecting to MySQL (Real Database)

When connecting to a real MySQL server, the URL format changes:

\`\`\`java
// MySQL connection
Connection conn = DriverManager.getConnection(
    "jdbc:mysql://localhost:3306/your_database?useSSL=false&serverTimezone=UTC",
    "your_username",
    "your_password"
);
\`\`\`

### Connection URL Cheat Sheet

| Database | JDBC URL Format |
|----------|----------------|
| H2 in-memory | \`jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1\` |
| H2 file-based | \`jdbc:h2:~/test\` |
| MySQL | \`jdbc:mysql://host:3306/dbname\` |
| PostgreSQL | \`jdbc:postgresql://host:5432/dbname\` |
| SQL Server | \`jdbc:sqlserver://host:1433;databaseName=dbname\` |

### Why H2 for Testing?

| Feature | H2 In-Memory | Real MySQL |
|---------|-------------|----------|
| Setup time | 0 (auto-creates) | Install + config |
| Test speed | Very fast | Network latency |
| Isolation | Per-process | Shared (if not careful) |
| CI/CD friendly | ✅ No setup | ⚠️ Needs a DB server |
| Production accuracy | ⚠️ SQL dialect differs | ✅ Exact match |

**Best practice**: Use H2 for fast unit/integration tests. Use a real DB in a staging environment for final validation.

### Auto-close with Try-with-Resources

Always use try-with-resources to close JDBC objects:

\`\`\`java
// ✅ CORRECT — auto-closes Connection, PreparedStatement, ResultSet
try (Connection conn = DriverManager.getConnection(url, user, pass);
     PreparedStatement ps = conn.prepareStatement("SELECT * FROM users");
     ResultSet rs = ps.executeQuery()) {
    while (rs.next()) {
        System.out.println(rs.getString("email"));
    }
} // All resources closed here automatically

// ❌ WRONG — forgetting to close leaks connections
Connection conn = DriverManager.getConnection(url, user, pass);
ResultSet rs = conn.createStatement().executeQuery("SELECT * FROM users");
// If an exception occurs before conn.close(), connection is leaked!
\`\`\``,
        exercise: `## Exercise 1.1 — First JDBC Connection

**Setup**

1. Create a Maven project (or use your existing Selenium project).
2. Add the H2 and JUnit 5 dependencies to \`pom.xml\`.
3. Create \`src/test/java/db/HelloJdbcTest.java\`.

**Tasks**

1. Write a \`@BeforeAll\` method that:
   - Connects to H2 in-memory with URL \`jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1\`
   - Creates a \`products\` table with columns: \`id\` (INT, PK), \`name\` (VARCHAR 100), \`price\` (DECIMAL 10,2), \`stock\` (INT)

2. Write a test \`testInsertProduct\` that:
   - Inserts a product: id=1, name="Laptop", price=999.99, stock=50
   - Queries it back and asserts all four field values

3. Write a test \`testUniqueConstraint\` that:
   - Inserts a product with id=1 again
   - Asserts that a \`SQLException\` is thrown (use \`assertThrows\`)

**Expected output when tests pass:**
\`\`\`
✅ H2 in-memory database ready
✅ testInsertProduct PASSED
✅ testUniqueConstraint PASSED
\`\`\``,
        quiz: [
          {
            question: 'What does DB_CLOSE_DELAY=-1 do in the H2 JDBC URL?',
            options: [
              'Closes the DB connection after 1 second',
              'Keeps the in-memory database alive as long as the JVM is running',
              'Sets the connection pool size to unlimited',
              'Disables all foreign key constraints'
            ],
            correct: 1,
            explanation: 'By default, H2 in-memory databases close (and lose all data) when the last connection closes. DB_CLOSE_DELAY=-1 keeps the database alive as long as the JVM is running — essential when using @BeforeAll and @AfterAll across multiple tests.'
          },
          {
            question: 'Why should JDBC resources (Connection, Statement, ResultSet) be used inside try-with-resources blocks?',
            options: [
              'It makes the code look cleaner',
              'It guarantees automatic closure even if an exception occurs, preventing connection leaks',
              'It speeds up query execution',
              'It is required by the JDBC specification'
            ],
            correct: 1,
            explanation: 'JDBC resources are backed by OS-level resources. If they are not closed, you get connection leaks, which eventually exhaust the connection pool and crash the application. try-with-resources guarantees closure even when exceptions are thrown.'
          },
          {
            question: 'What is the primary advantage of H2 in-memory database for testing?',
            options: [
              'It supports more SQL features than MySQL',
              'It requires no installation and creates a fresh database for each test run',
              'It can store data permanently across server restarts',
              'It automatically generates test data'
            ],
            correct: 1,
            explanation: 'H2 in-memory requires zero installation — it starts as a Java library. Each test run gets a clean, isolated database, which prevents test interference and makes CI/CD pipelines trivial to set up.'
          }
        ]
      }
    ]
  },

  // ── MODULE 1 ─────────────────────────────────────────────
  {
    id: 'db-module-1',
    title: 'Core JDBC Operations',
    icon: '🔌',
    description: 'Master CRUD operations, PreparedStatements, ResultSet navigation, and transaction management in test code.',
    lessons: [

      // ── db-l2 ──────────────────────────────────────────
      {
        id: 'db-l2',
        title: 'CRUD with JDBC — Create, Read, Update, Delete',
        duration: '35 min',
        difficulty: 'beginner',
        tags: ['JDBC', 'CRUD', 'SQL', 'PreparedStatement', 'ResultSet'],
        objectives: [
          'Execute INSERT, SELECT, UPDATE, DELETE with PreparedStatement',
          'Navigate ResultSet rows with next(), getString(), getInt()',
          'Use executeUpdate() vs executeQuery() correctly',
          'Count rows and verify DELETE operations'
        ],
        content: `## CRUD with JDBC

In test code, you'll constantly need to do four things:
- **C**reate test data (INSERT)
- **R**ead it back for assertions (SELECT)
- **U**pdate records and verify (UPDATE)
- **D**elete and confirm removal (DELETE)

### Project Structure

\`\`\`
src/
  test/
    java/
      db/
        BaseDbTest.java        ← shared connection setup
        UserRepositoryTest.java ← tests for user-related DB operations
        ProductRepositoryTest.java
\`\`\`

### Base Test Class

\`\`\`java
package db;

import org.junit.jupiter.api.*;
import java.sql.*;

public abstract class BaseDbTest {

    protected static Connection conn;

    @BeforeAll
    static void connect() throws SQLException {
        conn = DriverManager.getConnection(
            "jdbc:h2:mem:cruddb;DB_CLOSE_DELAY=-1", "sa", "");
    }

    @AfterAll
    static void disconnect() throws SQLException {
        if (conn != null) conn.close();
    }

    // Helper: count rows in a table
    protected int countRows(String table) throws SQLException {
        try (Statement s = conn.createStatement();
             ResultSet rs = s.executeQuery("SELECT COUNT(*) FROM " + table)) {
            rs.next();
            return rs.getInt(1);
        }
    }

    // Helper: execute any SQL (DDL or DML)
    protected void execute(String sql) throws SQLException {
        try (Statement s = conn.createStatement()) {
            s.execute(sql);
        }
    }
}
\`\`\`

### CREATE — INSERT

\`\`\`java
@Test
void testInsertUser() throws SQLException {
    // Always use PreparedStatement — never concatenate user values into SQL
    String sql = "INSERT INTO users (first_name, last_name, email) VALUES (?, ?, ?)";

    try (PreparedStatement ps = conn.prepareStatement(sql,
            Statement.RETURN_GENERATED_KEYS)) {

        ps.setString(1, "Bob");
        ps.setString(2, "Jones");
        ps.setString(3, "bob@example.com");

        int rowsInserted = ps.executeUpdate(); // returns number of rows affected
        assertEquals(1, rowsInserted, "Should insert exactly 1 row");

        // Get the auto-generated primary key
        try (ResultSet keys = ps.getGeneratedKeys()) {
            assertTrue(keys.next(), "Should have a generated key");
            int generatedId = keys.getInt(1);
            assertTrue(generatedId > 0, "Generated ID should be positive");
            System.out.println("Inserted user with ID: " + generatedId);
        }
    }
}
\`\`\`

### READ — SELECT

\`\`\`java
@Test
void testSelectSingleUser() throws SQLException {
    // First insert a known user
    execute("INSERT INTO users (first_name, last_name, email) " +
            "VALUES ('Carol', 'White', 'carol@example.com')");

    // Then SELECT and assert
    String sql = "SELECT id, first_name, last_name, email FROM users WHERE email = ?";
    try (PreparedStatement ps = conn.prepareStatement(sql)) {
        ps.setString(1, "carol@example.com");

        try (ResultSet rs = ps.executeQuery()) {
            // rs.next() moves the cursor to the first row — returns false if empty
            assertTrue(rs.next(), "User Carol should exist");

            // Access columns by name (preferred) or index (starts at 1)
            assertEquals("Carol", rs.getString("first_name"));
            assertEquals("White", rs.getString("last_name"));
            assertFalse(rs.next(), "Should be exactly one matching user");
        }
    }
}
\`\`\`

### UPDATE

\`\`\`java
@Test
void testUpdateEmail() throws SQLException {
    // Seed
    execute("INSERT INTO users (first_name, last_name, email) " +
            "VALUES ('Frank', 'Brown', 'frank.old@example.com')");

    // Update
    String updateSql = "UPDATE users SET email = ? WHERE email = ?";
    try (PreparedStatement ps = conn.prepareStatement(updateSql)) {
        ps.setString(1, "frank.new@example.com");
        ps.setString(2, "frank.old@example.com");
        int rowsUpdated = ps.executeUpdate();
        assertEquals(1, rowsUpdated, "Exactly one row should be updated");
    }

    // Verify the change in the DB
    try (PreparedStatement ps = conn.prepareStatement(
            "SELECT email FROM users WHERE first_name = 'Frank'")) {
        try (ResultSet rs = ps.executeQuery()) {
            assertTrue(rs.next());
            assertEquals("frank.new@example.com", rs.getString("email"),
                "Email should reflect the update");
        }
    }
}
\`\`\`

### DELETE

\`\`\`java
@Test
void testDeleteUser() throws SQLException {
    execute("INSERT INTO users (first_name, last_name, email) " +
            "VALUES ('Grace', 'Kim', 'grace@example.com')");

    int beforeCount = countRows("users");

    // Delete
    try (PreparedStatement ps = conn.prepareStatement(
            "DELETE FROM users WHERE email = ?")) {
        ps.setString(1, "grace@example.com");
        int rowsDeleted = ps.executeUpdate();
        assertEquals(1, rowsDeleted, "Should delete exactly 1 row");
    }

    int afterCount = countRows("users");
    assertEquals(beforeCount - 1, afterCount, "Row count should decrease by 1");
}
\`\`\`

### executeUpdate() vs executeQuery()

| Method | Use for | Returns |
|--------|---------|--------|
| \`executeUpdate()\` | INSERT, UPDATE, DELETE | int (rows affected) |
| \`executeQuery()\` | SELECT | ResultSet |
| \`execute()\` | DDL (CREATE, DROP) or unknown | boolean |

### ResultSet Column Access

\`\`\`java
rs.getString("column_name")   // VARCHAR, CHAR, TEXT
rs.getInt("column_name")      // INT, SMALLINT
rs.getLong("column_name")     // BIGINT
rs.getDouble("column_name")   // DOUBLE, FLOAT
rs.getBigDecimal("column_name") // DECIMAL, NUMERIC
rs.getBoolean("column_name")  // BOOLEAN, BIT
rs.getTimestamp("column_name") // DATETIME, TIMESTAMP
rs.getDate("column_name")     // DATE
rs.wasNull()                  // check if last value was SQL NULL
\`\`\``,
        exercise: `## Exercise 2.1 — Full CRUD Test Suite

Create \`src/test/java/db/ProductCrudTest.java\` that tests a \`products\` table.

**Schema to set up in @BeforeAll:**
\`\`\`sql
CREATE TABLE products (
    id       INT AUTO_INCREMENT PRIMARY KEY,
    name     VARCHAR(100) NOT NULL,
    price    DECIMAL(10,2) NOT NULL,
    category VARCHAR(50),
    in_stock BOOLEAN DEFAULT TRUE
)
\`\`\`

**Write these 4 tests:**

1. **testInsert** — Insert "Keyboard" at 79.99 in category "Peripherals". Assert 1 row inserted and generated key > 0.

2. **testSelect** — Insert "Monitor" at 299.99, then SELECT it back and assert name, price (as BigDecimal), and in_stock = true.

3. **testUpdate** — Insert "Mouse" at 29.99, update price to 39.99, query back and assert the new price.

4. **testDelete** — Insert "Webcam" at 49.99, delete it, assert row count decreased and the product no longer exists.`,
        quiz: [
          {
            question: 'Which method should you call to execute a SELECT query with PreparedStatement?',
            options: [
              'executeUpdate()',
              'execute()',
              'executeQuery()',
              'executeSelect()'
            ],
            correct: 2,
            explanation: 'executeQuery() is specifically for SELECT statements and returns a ResultSet. Using executeUpdate() for a SELECT would throw a SQLException in most JDBC drivers.'
          },
          {
            question: 'You call rs.next() on a ResultSet and it returns false. What does this mean?',
            options: [
              'The query failed with an error',
              'There are more rows to read',
              'There are no rows at the current cursor position — either no results or all rows have been read',
              'The ResultSet was closed'
            ],
            correct: 2,
            explanation: 'rs.next() advances the cursor to the next row and returns true if a row was available. false means the cursor is past the last row (or the result set was empty). This is how you check if a SELECT returned any results.'
          },
          {
            question: "Why should you NEVER build SQL queries by concatenating user input like: \"SELECT * FROM users WHERE email = '\" + email + \"'\"?",
            options: [
              'It is slower than PreparedStatement',
              'It causes SQL Injection vulnerabilities — malicious input can alter the SQL query',
              'JDBC does not support String concatenation',
              'It returns the wrong result type'
            ],
            correct: 1,
            explanation: "SQL Injection is the #1 database security vulnerability. PreparedStatement parameterizes values and makes injection impossible."
          }
        ]
      },

      // ── db-l3 ──────────────────────────────────────────
      {
        id: 'db-l3',
        title: 'Transaction Management in Tests',
        duration: '30 min',
        difficulty: 'intermediate',
        tags: ['transactions', 'JDBC', 'rollback', 'commit', 'ACID', 'isolation'],
        objectives: [
          'Understand ACID properties and why they matter in tests',
          'Use setAutoCommit(false) / commit() / rollback() in test code',
          'Use @BeforeEach rollback pattern for test isolation',
          'Handle transaction isolation levels and their impact on tests'
        ],
        content: `## Transaction Management in Tests

### What is a Transaction?

A **transaction** is a group of SQL operations that either ALL succeed or ALL fail together. This is the "A" in ACID:

- **A**tomicity — all or nothing
- **C**onsistency — DB moves from one valid state to another
- **I**solation — concurrent transactions don't interfere
- **D**urability — committed data survives crashes

### JDBC Transaction Control

\`\`\`java
conn.setAutoCommit(false);  // Start manual transaction control

try {
    stmt1.executeUpdate("INSERT INTO orders ...");
    stmt2.executeUpdate("UPDATE inventory ...");
    conn.commit();   // ✅ All succeed — commit changes
} catch (SQLException e) {
    conn.rollback(); // ❌ Something failed — undo everything
    throw e;
}
\`\`\`

### Pattern: Rollback After Each Test

\`\`\`java
@BeforeEach
void beginTransaction() throws SQLException {
    conn.setAutoCommit(false); // Open transaction
}

@AfterEach
void rollbackTransaction() throws SQLException {
    conn.rollback();           // Undo ALL changes from this test
    conn.setAutoCommit(true);  // Reset to default
}
\`\`\`

### Transaction Isolation Levels

| Level | Dirty Reads | Non-Repeatable Reads | Phantom Reads |
|-------|------------|---------------------|---------------|
| READ_UNCOMMITTED | ✅ possible | ✅ possible | ✅ possible |
| READ_COMMITTED | ❌ prevented | ✅ possible | ✅ possible |
| REPEATABLE_READ | ❌ prevented | ❌ prevented | ✅ possible |
| SERIALIZABLE | ❌ prevented | ❌ prevented | ❌ prevented |

**For most tests: READ_COMMITTED is sufficient** — it's the default for MySQL and PostgreSQL.`,
        exercise: `## Exercise 3.1 — Transaction Test Isolation

**Scenario**: You're testing an e-commerce order system. The \`orders\` table must never have negative quantities.

\`\`\`sql
CREATE TABLE orders (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    product   VARCHAR(100),
    quantity  INT CHECK (quantity > 0),
    total     DECIMAL(10,2)
);
\`\`\`

1. Set up the table in \`@BeforeAll\`. Use the \`@BeforeEach / @AfterEach\` rollback pattern.
2. Write \`testValidOrder\` — insert an order with quantity=5. Assert it exists.
3. Write \`testConstraintViolation\` — attempt to insert quantity=-1. Assert \`assertThrows(SQLException.class, ...)\`.
4. Write \`testAtomicOrderAndPayment\` — inside one transaction, insert an order AND payment. Manually rollback. Assert BOTH tables are empty.`,
        quiz: [
          {
            question: 'What does conn.setAutoCommit(false) do?',
            options: [
              'Disables the database connection',
              'Prevents the connection from being committed permanently',
              'Switches to manual transaction control — SQL statements are grouped until commit() or rollback() is called',
              'Makes all queries read-only'
            ],
            correct: 2,
            explanation: 'setAutoCommit(false) disables the default behavior where each SQL statement is immediately committed. Instead, statements accumulate in a transaction until you explicitly call conn.commit() (to save) or conn.rollback() (to undo all changes).'
          },
          {
            question: 'Why is the @BeforeEach begin / @AfterEach rollback pattern preferred for test isolation?',
            options: [
              'It is the only way to reset the database between tests',
              'It ensures each test starts with a clean slate without expensive DELETE operations',
              'It makes tests run in parallel automatically',
              'It prevents the need for a @BeforeAll setup'
            ],
            correct: 1,
            explanation: 'Rollback is the most efficient cleanup strategy — it undoes all changes atomically with a single operation. Unlike DELETE statements, a rollback simply discards the uncommitted transaction log.'
          },
          {
            question: 'What is a Savepoint used for?',
            options: [
              'Saving a database backup before running tests',
              'Rolling back part of a transaction while preserving earlier work within the same transaction',
              'Creating a snapshot of the entire database',
              'Marking a test as passed in the test report'
            ],
            correct: 1,
            explanation: 'A Savepoint marks a specific point within a transaction. You can rollbackToSavepoint(sp) to undo only the operations after that point, while keeping operations before the savepoint.'
          }
        ]
      },

      // ── db-l4 ──────────────────────────────────────────
      {
        id: 'db-l4',
        title: 'Connection Pooling & Best Practices',
        duration: '25 min',
        difficulty: 'intermediate',
        tags: ['connection pool', 'HikariCP', 'C3P0', 'best practices', 'JDBC'],
        objectives: [
          'Understand why connection pools are essential for real applications',
          'Configure HikariCP as a test connection pool',
          'Recognise and fix common connection leak patterns',
          'Apply the DAO pattern to separate DB logic from test assertions'
        ],
        content: `## Connection Pooling & Best Practices

### Why Connection Pools?

Opening a new database connection is expensive. A **connection pool** maintains pre-opened connections that are reused:

\`\`\`
Application Thread 1 ──┐
Application Thread 2 ──┼──▶  [ Pool: conn1 conn2 conn3 ] ──▶ Database
Application Thread 3 ──┘
\`\`\`

### HikariCP Setup

\`\`\`java
HikariConfig config = new HikariConfig();
config.setJdbcUrl("jdbc:h2:mem:pooldb;DB_CLOSE_DELAY=-1");
config.setUsername("sa");
config.setPassword("");
config.setMaximumPoolSize(5);
config.setMinimumIdle(2);
config.setConnectionTimeout(3000);

HikariDataSource dataSource = new HikariDataSource(config);
\`\`\`

### DAO Pattern

\`\`\`java
public class UserDao {
    private final DataSource dataSource;

    public int insert(String firstName, String lastName, String email) throws SQLException {
        String sql = "INSERT INTO users (first_name, last_name, email) VALUES (?, ?, ?)";
        try (Connection c = dataSource.getConnection();
             PreparedStatement ps = c.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, firstName);
            ps.setString(2, lastName);
            ps.setString(3, email);
            ps.executeUpdate();
            try (ResultSet keys = ps.getGeneratedKeys()) {
                keys.next();
                return keys.getInt(1);
            }
        }
    }
}
\`\`\`

### Common Mistakes to Avoid

\`\`\`java
// ❌ MISTAKE: Not closing connections
Connection conn = dataSource.getConnection();
conn.createStatement().executeQuery("SELECT 1"); // never closed!

// ✅ FIX: Always use try-with-resources
try (Connection conn = dataSource.getConnection();
     Statement s = conn.createStatement();
     ResultSet rs = s.executeQuery("SELECT 1")) {
    // auto-closed
}

// ❌ MISTAKE: Hardcoded credentials
conn = DriverManager.getConnection("jdbc:mysql://localhost/db", "root", "password123");

// ✅ FIX: Use environment variables
String url = System.getenv("DB_URL");
\`\`\``,
        exercise: `## Exercise 4.1 — DAO Pattern Implementation

1. Add HikariCP to your \`pom.xml\`.
2. Create \`ProductDao\` with: insert(), findById(), updatePrice(), deleteById(), countAll().
3. Create \`ProductDaoTest\` with a test for each DAO method.
4. Add a test \`testPoolExhaustion\` that attempts to get 6 connections when pool size is 5.`,
        quiz: [
          {
            question: 'What happens when you call connection.close() on a pooled connection from HikariCP?',
            options: [
              'The underlying TCP connection to the database is closed',
              'The connection is returned to the pool for reuse by the next request',
              'All pending queries on that connection are cancelled',
              'The connection pool shrinks by one'
            ],
            correct: 1,
            explanation: 'In a connection pool, close() on a pooled Connection does NOT close the underlying DB connection. It returns the connection to the pool so the next call to dataSource.getConnection() can reuse it.'
          },
          {
            question: 'What is the primary purpose of the DAO (Data Access Object) pattern?',
            options: [
              'To speed up database queries by caching results',
              'To separate database access logic from business logic and test assertions',
              'To automatically generate SQL from Java objects',
              'To manage connection pool configuration'
            ],
            correct: 1,
            explanation: 'DAO separates concerns: the DAO handles all SQL, while tests only call high-level methods like insert() or findById(). This makes tests cleaner and easier to refactor when the schema changes.'
          },
          {
            question: 'Why should database credentials never be hardcoded in test source files?',
            options: [
              'JDBC does not accept hardcoded strings',
              'Credentials in source files get committed to version control, exposing them to anyone with repo access',
              'Hardcoded credentials cause connection pool exhaustion',
              'JUnit rejects tests with hardcoded values'
            ],
            correct: 1,
            explanation: 'Source code is committed to git. Hardcoded passwords end up in version history permanently. Use environment variables, a .env file (in .gitignore), or a secrets manager.'
          }
        ]
      }
    ]
  },

  // ── MODULE 2 ─────────────────────────────────────────────
  {
    id: 'db-module-2',
    title: 'Test Data Management',
    icon: '📦',
    description: 'Build robust test data strategies — seeds, builders, DBUnit fixtures, and cleanup patterns that scale.',
    lessons: [

      // ── db-l5 ──────────────────────────────────────────
      {
        id: 'db-l5',
        title: 'Test Data Setup & Teardown Strategies',
        duration: '30 min',
        difficulty: 'intermediate',
        tags: ['test data', 'seeding', 'cleanup', 'BeforeEach', 'AfterEach', 'fixtures'],
        objectives: [
          'Compare four test data strategies and choose the right one',
          'Implement SQL fixture scripts loaded in @BeforeEach',
          'Apply the "insert what you need, rollback what you changed" principle',
          'Handle FK-constrained tables in the correct insertion order'
        ],
        content: `## Test Data Setup & Teardown Strategies

### The Four Strategies

| Strategy | How it works | Best for |
|----------|-------------|----------|
| **Rollback** | Wrap each test in a transaction, rollback after | Fast, zero cleanup code |
| **Truncate & Seed** | Delete all rows, insert fresh data before each test | When rollback isn't possible |
| **SQL Fixtures** | Load \`.sql\` files before each test class | Large, shared reference data |
| **Builder Pattern** | Build only the minimum data each test needs | Complex object graphs |

### SQL Fixture Files

\`\`\`java
public class SqlFixtureLoader {
    public static void load(Connection conn, String resourcePath) throws Exception {
        InputStream is = SqlFixtureLoader.class.getResourceAsStream(resourcePath);
        String sql = new String(is.readAllBytes());
        for (String statement : sql.split(";")) {
            String trimmed = statement.trim();
            if (!trimmed.isEmpty()) {
                try (Statement s = conn.createStatement()) { s.execute(trimmed); }
            }
        }
    }
}
\`\`\`

### Handling FK-Constrained Tables

\`\`\`sql
-- Delete children first
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM products;
-- Then delete parents
DELETE FROM categories;
DELETE FROM users;
\`\`\``,
        exercise: `## Exercise 5.1 — Fixture Loader

1. Create \`schema.sql\` defining \`customers\` and \`orders\` tables.
2. Create \`seed-customers.sql\` inserting 3 customers: 1 Gold, 1 Silver, 1 Bronze tier.
3. Create \`seed-orders.sql\` inserting 2 orders for Gold customer and 1 for Silver.
4. Write \`CustomerOrderFixtureTest\` with testGoldCustomerHasTwoOrders, testTotalOrderValue, testOrderStatusDefault.`,
        quiz: [
          {
            question: 'When truncating tables with foreign key constraints, what order should you follow?',
            options: [
              'Alphabetical order',
              'Delete parent tables first, then child tables',
              'Delete child tables first (dependent rows), then parent tables',
              'The order does not matter if you use TRUNCATE instead of DELETE'
            ],
            correct: 2,
            explanation: 'Foreign key constraints prevent deleting a parent row while child rows still reference it. You must delete child rows first (e.g., order_items before orders before customers).'
          },
          {
            question: 'What is the key advantage of loading SQL fixture files over hardcoding INSERT statements in @BeforeEach Java methods?',
            options: [
              'SQL files execute faster than Java code',
              'SQL files are version-controlled, sharable, and easier to modify without recompiling test code',
              'SQL files automatically handle FK ordering',
              'SQL files support transactions automatically'
            ],
            correct: 1,
            explanation: 'SQL fixture files externalize test data from test code. DBAs or QA analysts can modify seed data without touching Java code.'
          },
          {
            question: 'What principle should guide what test data you create in @BeforeEach?',
            options: [
              'Create as much data as possible to simulate production',
              'Create only the minimum data the current test actually needs',
              'Use the same dataset for all tests in the project',
              'Always create exactly 100 rows for statistical validity'
            ],
            correct: 1,
            explanation: 'Each test should set up exactly what it needs — no more. Excess data creates noise, slows setup, and creates coupling between tests.'
          }
        ]
      },

      // ── db-l6 ──────────────────────────────────────────
      {
        id: 'db-l6',
        title: 'Test Data Builders & Factories',
        duration: '30 min',
        difficulty: 'intermediate',
        tags: ['builder pattern', 'factory', 'test data', 'object creation', 'fluent API'],
        objectives: [
          'Implement the Builder pattern for creating test entities',
          'Use factories to generate realistic random test data',
          'Compose complex object graphs (User → Order → OrderItems)',
          'Integrate with the Faker library for realistic data'
        ],
        content: `## Test Data Builders & Factories

### Builder Pattern for Test Data

\`\`\`java
public class UserBuilder {
    private String firstName = "Test";
    private String lastName  = "User";
    private String email     = "test." + System.nanoTime() + "@example.com";
    private String status    = "ACTIVE";
    private String tier      = "BRONZE";

    public UserBuilder firstName(String v) { this.firstName = v; return this; }
    public UserBuilder lastName(String v)  { this.lastName = v;  return this; }
    public UserBuilder email(String v)     { this.email = v;     return this; }
    public UserBuilder asGoldMember()    { return tier("GOLD"); }
    public UserBuilder asInactive()      { return status("INACTIVE"); }

    public int insert(Connection conn) throws SQLException {
        String sql = "INSERT INTO users (first_name, last_name, email, status, tier) VALUES (?, ?, ?, ?, ?)";
        try (PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, firstName); ps.setString(2, lastName);
            ps.setString(3, email); ps.setString(4, status); ps.setString(5, tier);
            ps.executeUpdate();
            try (ResultSet keys = ps.getGeneratedKeys()) { keys.next(); return keys.getInt(1); }
        }
    }
}
\`\`\`

**Usage:**
\`\`\`java
int userId = new UserBuilder().email("gold@example.com").asGoldMember().insert(conn);
\`\`\`

### Faker — Realistic Random Data

\`\`\`java
Faker faker = new Faker();
String name  = faker.name().fullName();          // "Jennifer Walsh"
String email = faker.internet().emailAddress();  // "jennifer.walsh@example.com"
double price = faker.number().randomDouble(2, 10, 500);
\`\`\``,
        exercise: `## Exercise 6.1 — Build a Test Data Layer

Create builders for CustomerBuilder, ProductBuilder, CartItemBuilder. Tests:
1. testCartTotal — build 1 customer, 2 products, add both to cart, assert total.
2. testVipCustomerFlag — create a VIP customer, assert tier='VIP'.
3. testUniqueEmailPerCustomer — use Faker to create 10 customers, assert COUNT=10.`,
        quiz: [
          {
            question: 'What is the main advantage of the Builder pattern for test data creation?',
            options: [
              'It generates SQL automatically from Java objects',
              'It provides sensible defaults so tests only specify fields relevant to their scenario',
              'It is faster than using PreparedStatement directly',
              'It automatically cleans up after each test'
            ],
            correct: 1,
            explanation: 'The Builder pattern encapsulates all required fields with sensible defaults. When the schema adds a new NOT NULL column, you update the builder once — all tests continue to work.'
          },
          {
            question: 'Why do test data builders typically use System.nanoTime() or random values for email defaults?',
            options: [
              'To simulate load testing with random inputs',
              'To ensure each builder invocation produces a unique email, preventing UNIQUE constraint violations',
              'Because JDBC requires unique values for VARCHAR fields',
              'To make test output more readable'
            ],
            correct: 1,
            explanation: 'If the default email were static, the second test using a builder without specifying an email would fail with a UNIQUE constraint violation. nanoTime() ensures each call gets a distinct value.'
          },
          {
            question: 'What does the Faker library provide for database testing?',
            options: [
              'Automatic database schema generation',
              'SQL injection testing payloads',
              'Realistic random data (names, emails, addresses) for building believable test records',
              'Connection pool management'
            ],
            correct: 2,
            explanation: 'Faker generates realistic-looking random data — real names, plausible email formats, valid phone numbers. This makes test data easier to interpret in failure reports.'
          }
        ]
      },

      // ── db-l7 ──────────────────────────────────────────
      {
        id: 'db-l7',
        title: 'DBUnit — Seeding and Asserting DB State',
        duration: '35 min',
        difficulty: 'intermediate',
        tags: ['DBUnit', 'XML dataset', 'IDataSet', 'seeding', 'database assertion'],
        objectives: [
          'Set up DBUnit in a Maven project',
          'Create XML datasets for seeding and expected state',
          'Use DatabaseConfig and IDataSet to seed tables',
          'Assert entire table state with Assertion.assertEquals()'
        ],
        content: `## DBUnit — Seeding and Asserting DB State

### What is DBUnit?

DBUnit lets you:
1. **Seed** the database from XML datasets before each test
2. **Assert** the actual table state matches an expected dataset after your code runs

### XML Dataset Format

\`\`\`xml
<?xml version="1.0" encoding="UTF-8"?>
<dataset>
  <customers id="1" name="Alice"  email="alice@test.com" tier="GOLD"/>
  <customers id="2" name="Bob"    email="bob@test.com"   tier="SILVER"/>
  <orders id="1" customer_id="1" total="199.99" status="PENDING"/>
  <orders id="2" customer_id="1" total="49.99"  status="COMPLETED"/>
  <orders id="3" customer_id="2" total="299.99" status="PENDING"/>
</dataset>
\`\`\`

### DBUnit Base Test

\`\`\`java
public abstract class DbUnitBaseTest {
    protected static Connection conn;
    protected static IDatabaseConnection dbunitConn;

    @BeforeAll
    static void setupDbUnit() throws Exception {
        conn = DriverManager.getConnection("jdbc:h2:mem:dbunitdb;DB_CLOSE_DELAY=-1", "sa", "");
        dbunitConn = new DatabaseConnection(conn);
        DatabaseConfig config = dbunitConn.getConfig();
        config.setProperty(DatabaseConfig.PROPERTY_DATATYPE_FACTORY, new org.dbunit.ext.h2.H2DataTypeFactory());
    }

    protected void seed(String xmlResourcePath) throws Exception {
        InputStream is = getClass().getResourceAsStream(xmlResourcePath);
        IDataSet dataSet = new FlatXmlDataSetBuilder().build(is);
        DatabaseOperation.CLEAN_INSERT.execute(dbunitConn, dataSet);
    }

    protected ITable getActualTable(String tableName) throws Exception {
        return dbunitConn.createDataSet().getTable(tableName);
    }
}
\`\`\`

### DBUnit Operations

| Operation | What it does |
|-----------|-------------|
| \`CLEAN_INSERT\` | Truncate tables in dataset, then insert all rows |
| \`INSERT\` | Insert rows (fails if already exist) |
| \`UPDATE\` | Update existing rows |
| \`DELETE_ALL\` | Delete all rows in dataset tables |
| \`REFRESH\` | Insert or update (merge) |`,
        exercise: `## Exercise 7.1 — DBUnit Order Processing Test

1. Create \`/datasets/seed-processor.xml\` with 2 customers and 4 orders.
2. Write \`processOrders(Connection conn)\` that updates status to PROCESSING for PENDING orders.
3. Write DBUnit test \`testProcessorStatusUpdate\` — seed, call processOrders, assert no PENDING orders remain.
4. Write \`testGoldDiscountApplied\` — seed, call applyDiscounts, assert GOLD orders have total reduced by 10%.`,
        quiz: [
          {
            question: 'What does DatabaseOperation.CLEAN_INSERT do when seeding a DBUnit dataset?',
            options: [
              'Inserts rows only if they do not already exist',
              'Truncates all tables referenced in the dataset, then inserts the dataset rows',
              'Merges the dataset with existing rows',
              'Validates the dataset against the schema before inserting'
            ],
            correct: 1,
            explanation: 'CLEAN_INSERT truncates all tables present in the XML dataset, then inserts all rows. This guarantees each test starts with exactly the data specified.'
          },
          {
            question: 'In DBUnit flat XML format, how is a database row represented?',
            options: [
              'As a <row> element with nested <column> children',
              'As a JSON object inside a <table> element',
              'As an XML element named after the table, with column values as attributes',
              'As a CSV line inside a CDATA section'
            ],
            correct: 2,
            explanation: 'DBUnit flat XML uses the table name as the element name and column values as attributes: <users id="1" name="Alice" email="alice@test.com"/>. Compact and easy to write.'
          },
          {
            question: 'When should you prefer DBUnit over raw JDBC SELECT assertions?',
            options: [
              'When checking a single column value after an UPDATE',
              'When asserting that an entire table\'s contents match an expected state after a batch operation',
              'When you need transaction rollback after each test',
              'When connecting to H2 in-memory databases'
            ],
            correct: 1,
            explanation: 'DBUnit shines when you need to verify the full state of a table — comparing every row and column against an expected XML dataset. For single-column checks, raw JDBC SELECT is simpler.'
          }
        ]
      }
    ]
  }

];

// Modules 3-4 added by database-curriculum-advanced.js
