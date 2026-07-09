// ── Module C: API Test Execution (Modules 3-4) ───────────────────
// Extends API_CURRICULUM defined in api-curriculum.js

API_CURRICULUM.push(

  // MODULE 3 — REST Assured with Java
  // ═══════════════════════════════════════════════════════════
  {
    id: 'api-module-3',
    title: 'REST Assured with Java',
    icon: '☕',
    lessons: [
      // ── Lesson 7 ───────────────────────────────────────────
      {
        id: 'api-l7',
        title: 'REST Assured Setup with Maven — Your First Java API Test',
        type: 'lesson',
        duration: '35 min',
        whatYoullLearn: [
          'What REST Assured is and how it differs from Postman',
          'Add REST Assured and TestNG dependencies to pom.xml',
          'Write your first GET test using given().when().then() syntax',
          'Assert status code, response time, and body fields in Java',
          'Understand the BDD-style fluent API'
        ],
        content: `
## ☕ REST Assured Setup with Maven

You've been using Postman as a GUI tool to test APIs manually and with simple scripts. **REST Assured** is the Java equivalent — it lets you write the exact same tests as proper Java code in your Maven project.

**Why switch from Postman to REST Assured?**

| | Postman + Newman | REST Assured |
|---|---|---|
| **Language** | JavaScript (in Tests tab) | Java |
| **IDE support** | Limited | Full IntelliJ support |
| **Integration** | Export required | Native Maven/TestNG |
| **Complexity** | Simple scripts | Full Java — classes, inheritance, utils |
| **Best for** | Exploration, quick tests | Production test suites |

---

### 📦 Maven Dependencies

Create a new Maven project in IntelliJ (**File → New Project → Maven**).

Add to your \`pom.xml\`:

\`\`\`xml
<dependencies>

  <!-- REST Assured — the main library -->
  <dependency>
    <groupId>io.rest-assured</groupId>
    <artifactId>rest-assured</artifactId>
    <version>5.4.0</version>
    <scope>test</scope>
  </dependency>

  <!-- JSON Schema Validation (for asserting response structure) -->
  <dependency>
    <groupId>io.rest-assured</groupId>
    <artifactId>json-schema-validator</artifactId>
    <version>5.4.0</version>
    <scope>test</scope>
  </dependency>

  <!-- TestNG — the test runner you already know -->
  <dependency>
    <groupId>org.testng</groupId>
    <artifactId>testng</artifactId>
    <version>7.9.0</version>
    <scope>test</scope>
  </dependency>

  <!-- Jackson — for serialising/deserialising Java objects to/from JSON -->
  <dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.17.0</version>
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

Run \`mvn clean install\` to download the dependencies.

---

### 🔑 The given().when().then() Pattern

REST Assured uses a **BDD-style** (Behaviour-Driven Development) fluent API that reads almost like plain English:

\`\`\`java
given()           // ← Set up request (headers, body, auth)
  .header(...)
  .body(...)
.when()           // ← Send the request
  .get("/booking")
.then()           // ← Check the response
  .statusCode(200)
  .body("size()", greaterThan(0));
\`\`\`

This is the core pattern. Every REST Assured test follows it.

---

### ▶️ Your First Test — Health Check

Create \`src/test/java/tests/HealthCheckTest.java\`:

\`\`\`java
package tests;

import io.restassured.RestAssured;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

public class HealthCheckTest {

    @BeforeClass
    public void setUp() {
        // Set the base URL once — all requests in this class use it
        RestAssured.baseURI = "https://restful-booker.herokuapp.com";
    }

    @Test
    public void pingEndpointReturns201() {
        given()
            .when()
                .get("/ping")
            .then()
                .statusCode(201)
                .body(equalTo("Created"));
    }
}
\`\`\`

Run it with IntelliJ (right-click → Run) or \`mvn test\`.

---

### 🔍 GET — Read a Booking

\`\`\`java
@Test
public void getBookingReturnsCorrectData() {
    given()
        .header("Accept", "application/json")
    .when()
        .get("/booking/1")
    .then()
        .statusCode(200)
        .body("firstname", not(emptyOrNullString()))
        .body("lastname",  not(emptyOrNullString()))
        .body("totalprice", greaterThan(0))
        .body("depositpaid", isA(Boolean.class))
        .body("bookingdates.checkin",  matchesPattern("\\\\d{4}-\\\\d{2}-\\\\d{2}"))
        .body("bookingdates.checkout", matchesPattern("\\\\d{4}-\\\\d{2}-\\\\d{2}"));
}
\`\`\`

**Key matchers from Hamcrest:**

| Matcher | What it checks |
|---|---|
| \`equalTo("text")\` | Exact string match |
| \`greaterThan(0)\` | Number is > 0 |
| \`not(emptyOrNullString())\` | Not null or empty string |
| \`isA(Boolean.class)\` | Is a boolean type |
| \`hasSize(5)\` | Array/list has 5 elements |
| \`containsString("hello")\` | String contains substring |
| \`matchesPattern("\\\\d+")\` | Matches a regex pattern |

---

### 📋 GET — Read All Bookings

\`\`\`java
@Test
public void getAllBookingsReturnsArray() {
    given()
        .header("Accept", "application/json")
    .when()
        .get("/booking")
    .then()
        .statusCode(200)
        .body("$", not(empty()))              // Array is not empty
        .body("bookingid", everyItem(notNullValue())); // Every item has bookingid
}
\`\`\`

**\`$\`** in the body path means "the root of the response" — useful for asserting the top-level structure.

---

### 📏 Asserting Response Time

\`\`\`java
import io.restassured.response.Response;
import static java.util.concurrent.TimeUnit.MILLISECONDS;

@Test
public void pingRespondsFast() {
    given()
        .when()
            .get("/ping")
        .then()
            .statusCode(201)
            .time(lessThan(3000L), MILLISECONDS);   // Under 3 seconds
}
\`\`\`

---

### 📁 Project Structure

\`\`\`
src/
└── test/
    └── java/
        ├── base/
        │   └── BaseTest.java       ← @BeforeClass setup (baseURI, logging)
        ├── tests/
        │   ├── HealthCheckTest.java
        │   ├── BookingReadTests.java
        │   ├── BookingWriteTests.java
        │   └── AuthTests.java
        └── utils/
            └── TestDataBuilder.java  ← Builds request body objects
\`\`\`
`,
        exercise: {
          title: 'Write Your First 3 REST Assured Tests',
          task: `Create a new Maven project and write 3 REST Assured tests:

1. HealthCheckTest — GET /ping, assert status 201 and body equals "Created"
2. GetAllBookingsTest — GET /booking, assert status 200 and response is not an empty array
3. GetSingleBookingTest — GET /booking/1, assert status 200 and firstname/lastname/totalprice are all present and non-null

Run all 3 with "mvn test" and screenshot the terminal showing 3 tests passing.`,
          hints: [
            'Add RestAssured.baseURI in a @BeforeClass method so you don\'t repeat the URL in every test',
            'Import static io.restassured.RestAssured.* and static org.hamcrest.Matchers.* at the top of the class',
            'If you get a 404, try /booking/2 or /booking/3 — some IDs may have been deleted on the shared test server'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'What does RestAssured.baseURI do when set in @BeforeClass?',
            options: [
              'It sets the HTTP method for all requests',
              'It sets the base URL prefix so you only need to specify the path in each test',
              'It configures the authentication token',
              'It enables SSL certificate validation'
            ],
            answer: 1
          },
          {
            type: 'mcq',
            q: 'In REST Assured, what does .body("bookingid", everyItem(notNullValue())) assert?',
            options: [
              'That the bookingid field has a specific value',
              'That every item in the array has a non-null bookingid field',
              'That there is exactly one bookingid in the response',
              'That the bookingid equals the number 1'
            ],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'The REST Assured given().when().then() pattern follows BDD (Behaviour-Driven Development) style.',
            answer: true
          },
          {
            type: 'fillin',
            q: 'In REST Assured body path syntax, _______ represents the root element of the JSON response.',
            answer: '$'
          }
        ]
      },

      // ── Lesson 8 ───────────────────────────────────────────
      {
        id: 'api-l8',
        title: 'POST, PUT, PATCH, DELETE — Write Operations with REST Assured',
        type: 'lesson',
        duration: '40 min',
        whatYoullLearn: [
          'Send a POST request with a JSON body in REST Assured',
          'Extract a value from a response (e.g. bookingid) for use in later tests',
          'Send PUT and PATCH requests to update data',
          'Send DELETE requests and verify the deletion',
          'Chain test operations — create, read, update, delete in sequence'
        ],
        content: `
## ✏️ Write Operations with REST Assured

GET requests read data. The real test coverage comes from writing data — creating, updating, deleting — and verifying each operation worked correctly.

---

### 📦 Building a Request Body

You can pass a request body in two ways:

**Option 1: String (simple, quick)**
\`\`\`java
String body = """
    {
        "firstname": "Sally",
        "lastname": "Smith",
        "totalprice": 250,
        "depositpaid": false,
        "bookingdates": {
            "checkin": "2026-03-01",
            "checkout": "2026-03-07"
        },
        "additionalneeds": "Dinner"
    }
    """;
\`\`\`

**Option 2: Java Map (cleaner, type-safe)**
\`\`\`java
Map<String, Object> bookingDates = new HashMap<>();
bookingDates.put("checkin", "2026-03-01");
bookingDates.put("checkout", "2026-03-07");

Map<String, Object> booking = new HashMap<>();
booking.put("firstname", "Sally");
booking.put("lastname", "Smith");
booking.put("totalprice", 250);
booking.put("depositpaid", false);
booking.put("bookingdates", bookingDates);
booking.put("additionalneeds", "Dinner");
\`\`\`

---

### ➕ POST — Create a Booking

\`\`\`java
@Test
public void createBookingReturnsCorrectData() {
    Map<String, Object> bookingDates = new HashMap<>();
    bookingDates.put("checkin",  "2026-03-01");
    bookingDates.put("checkout", "2026-03-07");

    Map<String, Object> booking = new HashMap<>();
    booking.put("firstname",      "Sally");
    booking.put("lastname",       "Smith");
    booking.put("totalprice",     250);
    booking.put("depositpaid",    false);
    booking.put("bookingdates",   bookingDates);
    booking.put("additionalneeds","Dinner");

    given()
        .header("Content-Type", "application/json")
        .header("Accept",       "application/json")
        .body(booking)
    .when()
        .post("/booking")
    .then()
        .statusCode(200)
        .body("bookingid",            notNullValue())
        .body("booking.firstname",    equalTo("Sally"))
        .body("booking.lastname",     equalTo("Smith"))
        .body("booking.totalprice",   equalTo(250))
        .body("booking.depositpaid",  equalTo(false))
        .body("booking.bookingdates.checkin",  equalTo("2026-03-01"))
        .body("booking.bookingdates.checkout", equalTo("2026-03-07"))
        .body("booking.additionalneeds",       equalTo("Dinner"));
}
\`\`\`

---

### 🔗 Extracting the bookingid for Later Tests

\`\`\`java
int bookingId = given()
        .header("Content-Type", "application/json")
        .header("Accept",       "application/json")
        .body(booking)
    .when()
        .post("/booking")
    .then()
        .statusCode(200)
        .extract().path("bookingid");

given()
    .header("Accept", "application/json")
.when()
    .get("/booking/" + bookingId)
.then()
    .statusCode(200)
    .body("firstname", equalTo("Sally"));
\`\`\`

---

### 🔐 Authentication Token

\`\`\`java
String token = given()
        .header("Content-Type", "application/json")
        .body("{ \\"username\\": \\"admin\\", \\"password\\": \\"password123\\" }")
    .when()
        .post("/auth")
    .then()
        .statusCode(200)
        .extract().path("token");
\`\`\`

---

### 🔄 PUT — Replace a Booking Entirely

\`\`\`java
@Test
public void updateBookingReplacesAllFields() {
    Map<String, Object> updatedDates = new HashMap<>();
    updatedDates.put("checkin",  "2026-06-01");
    updatedDates.put("checkout", "2026-06-10");

    Map<String, Object> updatedBooking = new HashMap<>();
    updatedBooking.put("firstname",      "James");
    updatedBooking.put("lastname",       "Brown");
    updatedBooking.put("totalprice",     500);
    updatedBooking.put("depositpaid",    true);
    updatedBooking.put("bookingdates",   updatedDates);
    updatedBooking.put("additionalneeds","Lunch");

    given()
        .header("Content-Type", "application/json")
        .header("Accept",       "application/json")
        .header("Cookie",       "token=" + token)
        .body(updatedBooking)
    .when()
        .put("/booking/" + bookingId)
    .then()
        .statusCode(200)
        .body("firstname",  equalTo("James"))
        .body("lastname",   equalTo("Brown"))
        .body("totalprice", equalTo(500));
}
\`\`\`

---

### 📝 PATCH — Update One Field Only

\`\`\`java
@Test
public void partialUpdateChangesOnlyPrice() {
    given()
        .header("Content-Type", "application/json")
        .header("Accept",       "application/json")
        .header("Cookie",       "token=" + token)
        .body("{ \\"totalprice\\": 999 }")
    .when()
        .patch("/booking/" + bookingId)
    .then()
        .statusCode(200)
        .body("totalprice", equalTo(999))
        .body("firstname",  equalTo("James"));
}
\`\`\`

---

### 🗑️ DELETE — Remove a Booking

\`\`\`java
@Test
public void deleteBookingRemovesIt() {
    given()
        .header("Cookie", "token=" + token)
    .when()
        .delete("/booking/" + bookingId)
    .then()
        .statusCode(201);

    given()
        .header("Accept", "application/json")
    .when()
        .get("/booking/" + bookingId)
    .then()
        .statusCode(404);
}
\`\`\`

---

### ⚙️ Base Test Class

\`\`\`java
package base;

import io.restassured.RestAssured;
import org.testng.annotations.BeforeClass;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

public class BaseTest {

    protected String token;

    @BeforeClass
    public void setUp() {
        RestAssured.baseURI = "https://restful-booker.herokuapp.com";

        token = given()
                    .header("Content-Type", "application/json")
                    .body("{ \\"username\\": \\"admin\\", \\"password\\": \\"password123\\" }")
                .when()
                    .post("/auth")
                .then()
                    .statusCode(200)
                    .extract().path("token");
    }
}
\`\`\`
`,
        exercise: {
          title: 'Build the Full CRUD Test Flow',
          task: `Write a single TestNG test class called BookingCRUDTest that performs the complete create → read → update → delete lifecycle:

1. @Test (priority=1): Create a booking for yourself and extract the bookingId
2. @Test (priority=2): GET the booking by ID and verify your name and totalprice match
3. @Test (priority=3): GET the auth token and store it in a class field
4. @Test (priority=4): PUT (full replace) with a different name and higher price, verify response
5. @Test (priority=5): PATCH just the totalprice to 1 and verify only that field changed
6. @Test (priority=6): DELETE the booking, verify 201, then GET it and verify 404

Run with mvn test and screenshot all 6 tests passing.`,
          hints: [
            'Use class-level fields (private int bookingId; private String token;) to share values between tests',
            'Use @Test(priority=1), (priority=2) etc to control execution order',
            'The PATCH body only needs the field you want to change: { "totalprice": 1 }'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'How do you extract a value from a REST Assured response for use in a later test?',
            options: [
              '.body("fieldName", equalTo(value))',
              '.extract().path("fieldName")',
              '.then().get("fieldName")',
              '.response().getValue("fieldName")'
            ],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'After deleting a resource, you should verify the deletion by attempting a GET request and asserting a 404 status code.',
            answer: true
          },
          {
            type: 'mcq',
            q: 'What is the key difference between PUT and PATCH in terms of request body?',
            options: [
              'PUT requires authentication, PATCH does not',
              'PUT sends the complete resource; PATCH sends only the fields being changed',
              'PUT can only be used on top-level fields; PATCH works on nested fields',
              'There is no functional difference between them in practice'
            ],
            answer: 1
          },
          {
            type: 'fillin',
            q: 'In a BaseTest class, you typically use _______ to run setup code once before all tests in a class, such as obtaining an auth token.',
            answer: '@BeforeClass'
          }
        ]
      },

      // ── Lesson 9 ───────────────────────────────────────────
      {
        id: 'api-l9',
        title: 'Authentication Patterns — Basic Auth, Bearer Tokens, OAuth2',
        type: 'lesson',
        duration: '35 min',
        whatYoullLearn: [
          'Understand the three most common API authentication patterns',
          'Implement Basic Auth in REST Assured',
          'Use Bearer token authentication in request headers',
          'Handle OAuth2 token flows',
          'Test both positive (valid auth) and negative (invalid/no auth) scenarios'
        ],
        content: `
## 🔐 Authentication Patterns in REST Assured

Most real APIs require authentication — you need to prove who you are before you can read or change data. There are three patterns you'll encounter in every QA role.

---

### 1️⃣ Basic Authentication

**How it works:** Username and password encoded in Base64, sent in the Authorization header.

\`\`\`
Authorization: Basic YWRtaW46cGFzc3dvcmQxMjM=
\`\`\`

**In REST Assured:**

\`\`\`java
given()
    .auth().basic("admin", "password123")
.when()
    .get("/protected-endpoint")
.then()
    .statusCode(200);
\`\`\`

**Testing negative auth:**
\`\`\`java
@Test
public void invalidCredentialsReturn401() {
    given()
        .auth().basic("admin", "wrongpassword")
    .when()
        .get("/protected-endpoint")
    .then()
        .statusCode(401);
}
\`\`\`

---

### 2️⃣ Bearer Token (Most Common in Modern APIs)

**How it works:**
1. Login with credentials → server returns a token
2. Every subsequent request includes the token in the Authorization header

\`\`\`java
String token = given()
        .contentType("application/json")
        .body("{ \\"email\\": \\"user@test.com\\", \\"password\\": \\"secret\\" }")
    .when()
        .post("/api/auth/login")
    .then()
        .statusCode(200)
        .extract().path("data.token");

given()
    .header("Authorization", "Bearer " + token)
.when()
    .get("/api/users/profile")
.then()
    .statusCode(200)
    .body("email", equalTo("user@test.com"));
\`\`\`

---

### 3️⃣ OAuth2 — Token via Client Credentials

\`\`\`java
String accessToken = given()
        .contentType("application/x-www-form-urlencoded")
        .formParam("grant_type", "client_credentials")
        .formParam("client_id",  "my-client-id")
        .formParam("client_secret", "my-client-secret")
    .when()
        .post("https://auth.myapp.com/oauth/token")
    .then()
        .statusCode(200)
        .extract().path("access_token");

given()
    .auth().oauth2(accessToken)
.when()
    .get("https://api.myapp.com/data")
.then()
    .statusCode(200);
\`\`\`

---

### 🏗️ RequestSpecification — Avoid Repeating Auth Setup

\`\`\`java
import io.restassured.specification.RequestSpecification;
import io.restassured.builder.RequestSpecBuilder;

public class BaseTest {

    protected static RequestSpecification requestSpec;
    protected static String token;

    @BeforeClass
    public static void setUp() {
        RestAssured.baseURI = "https://restful-booker.herokuapp.com";

        token = given()
                    .contentType("application/json")
                    .body("{ \\"username\\": \\"admin\\", \\"password\\": \\"password123\\" }")
                .when()
                    .post("/auth")
                .then()
                    .statusCode(200)
                    .extract().path("token");

        requestSpec = new RequestSpecBuilder()
            .addHeader("Content-Type", "application/json")
            .addHeader("Accept",       "application/json")
            .addHeader("Cookie",       "token=" + token)
            .build();
    }
}
\`\`\`

Use it with \`given(requestSpec)\`:

\`\`\`java
@Test
public void updateWithAuthSucceeds() {
    given(requestSpec)
        .body(updatedBooking)
    .when()
        .put("/booking/" + bookingId)
    .then()
        .statusCode(200);
}

@Test
public void updateWithoutAuthFails() {
    given()
        .contentType("application/json")
        .body(updatedBooking)
    .when()
        .put("/booking/" + bookingId)
    .then()
        .statusCode(403);
}
\`\`\`

---

### 🔴 Always Test Negative Auth Scenarios

| Scenario | Expected status |
|---|---|
| Valid credentials | 200 or 201 |
| Wrong password | 401 |
| No credentials at all | 401 or 403 |
| Expired token | 401 |
| Token for wrong user's resource | 403 |
`,
        exercise: {
          title: 'Test All Auth Scenarios for Restful-Booker',
          task: `Write an AuthTests.java class with 5 test methods:

1. validCredentialsReturnToken() — POST /auth with correct credentials, assert token is returned and is a non-empty string
2. invalidPasswordReturnsError() — POST /auth with wrong password, assert response indicates failure
3. updateWithValidTokenSucceeds() — PUT /booking/{id} with token in Cookie header, assert 200
4. updateWithoutTokenFails() — PUT /booking/{id} with NO Cookie header, assert 403
5. deleteWithValidTokenSucceeds() — DELETE /booking/{id} with token, then GET to verify 404

Extend BaseTest so the token is obtained in @BeforeClass. Run mvn test and screenshot all 5 passing.`,
          hints: [
            'Restful-Booker returns { "reason": "Bad credentials" } for invalid auth — you can assert that too',
            'Test 4 is important: it proves unauthorised access is blocked — a security test disguised as a functional test',
            'You need a valid bookingId for tests 3, 4, 5 — create one in @BeforeClass as well'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'In REST Assured, which method automatically encodes credentials in Base64 for Basic Auth?',
            options: [
              '.header("Authorization", ...)',
              '.auth().basic("user", "pass")',
              '.auth().bearer("token")',
              '.formParam("username", "pass")'
            ],
            answer: 1
          },
          {
            type: 'mcq',
            q: 'What does RequestSpecBuilder allow you to do?',
            options: [
              'Run multiple requests in parallel',
              'Create a reusable request configuration (headers, auth, base URL) shared across tests',
              'Automatically retry failed requests',
              'Parse JSON response bodies more efficiently'
            ],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'You should always test that requests WITHOUT credentials receive a 401 or 403 response.',
            answer: true
          },
          {
            type: 'fillin',
            q: 'In REST Assured, .auth()._______(accessToken) automatically adds the "Authorization: Bearer ..." header for OAuth2.',
            answer: 'oauth2'
          }
        ]
      },

      // ── Lesson 10 ───────────────────────────────────────────
      {
        id: 'api-l10',
        title: 'Data-Driven API Testing with TestNG DataProvider',
        type: 'lesson',
        duration: '35 min',
        whatYoullLearn: [
          'What data-driven testing means for APIs',
          'Use @DataProvider to run the same test with multiple input sets',
          'Test both valid and invalid inputs in one test method',
          'Read test data from a CSV file into a DataProvider',
          'Assert different expected outcomes per data row'
        ],
        content: `
## 📊 Data-Driven API Testing with TestNG DataProvider

Imagine you need to test the Create Booking endpoint with 10 different guest names, price ranges, and date combinations. Writing 10 separate test methods would be repetitive and hard to maintain.

**Data-driven testing** lets you write ONE test method that runs with multiple datasets automatically.

---

### 🔁 @DataProvider Basics

\`\`\`java
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

public class BookingDataDrivenTest extends BaseTest {

    @DataProvider(name = "bookingData")
    public Object[][] getBookingData() {
        return new Object[][] {
            // firstname, lastname, price, depositPaid, checkin,       checkout
            { "Alice",   "Johnson", 100,   true,  "2026-01-01", "2026-01-07" },
            { "Bob",     "Smith",   250,   false, "2026-02-15", "2026-02-20" },
            { "Charlie", "Brown",   500,   true,  "2026-03-10", "2026-03-17" },
            { "Diana",   "Prince",  75,    false, "2026-04-05", "2026-04-06" },
        };
    }

    @Test(dataProvider = "bookingData")
    public void createBookingWithVariousData(
            String firstName, String lastName, int price,
            boolean depositPaid, String checkin, String checkout) {

        Map<String, Object> dates = new HashMap<>();
        dates.put("checkin",  checkin);
        dates.put("checkout", checkout);

        Map<String, Object> body = new HashMap<>();
        body.put("firstname",    firstName);
        body.put("lastname",     lastName);
        body.put("totalprice",   price);
        body.put("depositpaid",  depositPaid);
        body.put("bookingdates", dates);

        given()
            .contentType("application/json")
            .accept("application/json")
            .body(body)
        .when()
            .post("/booking")
        .then()
            .statusCode(200)
            .body("bookingid",         notNullValue())
            .body("booking.firstname", equalTo(firstName))
            .body("booking.lastname",  equalTo(lastName))
            .body("booking.totalprice",equalTo(price));
    }
}
\`\`\`

TestNG runs this test **4 times** — once per row in the DataProvider.

---

### ❌ Testing Invalid Inputs

\`\`\`java
@DataProvider(name = "invalidBookingData")
public Object[][] getInvalidBookingData() {
    return new Object[][] {
        // description,            firstname, lastname, price, checkin,       checkout,       expectedStatus
        { "Missing firstname",     null,      "Smith",  100,   "2026-01-01", "2026-01-07",  500 },
        { "Empty lastname",        "John",    "",       100,   "2026-01-01", "2026-01-07",  500 },
        { "Negative price",        "John",    "Smith",  -50,   "2026-01-01", "2026-01-07",  200 },
        { "Checkout before checkin","John",   "Smith",  100,   "2026-01-07", "2026-01-01",  200 },
    };
}

@Test(dataProvider = "invalidBookingData")
public void createBookingWithInvalidData(
        String description, String firstName, String lastName,
        int price, String checkin, String checkout, int expectedStatus) {

    Map<String, Object> dates = new HashMap<>();
    dates.put("checkin",  checkin);
    dates.put("checkout", checkout);

    Map<String, Object> body = new HashMap<>();
    body.put("firstname",    firstName);
    body.put("lastname",     lastName);
    body.put("totalprice",   price);
    body.put("depositpaid",  false);
    body.put("bookingdates", dates);

    given()
        .contentType("application/json")
        .body(body)
    .when()
        .post("/booking")
    .then()
        .statusCode(expectedStatus);
}
\`\`\`

---

### 📄 Reading Test Data from CSV

\`\`\`java
@DataProvider(name = "csvBookingData")
public Object[][] getBookingDataFromCsv() throws IOException {
    List<Object[]> data = new ArrayList<>();

    try (BufferedReader reader = new BufferedReader(new FileReader(
            "src/test/resources/booking-test-data.csv"))) {

        String line;
        reader.readLine(); // Skip header row

        while ((line = reader.readLine()) != null) {
            String[] cols = line.split(",");
            data.add(new Object[] {
                cols[0],
                cols[1],
                Integer.parseInt(cols[2]),
                Boolean.parseBoolean(cols[3]),
                cols[4],
                cols[5]
            });
        }
    }
    return data.toArray(new Object[0][]);
}
\`\`\`

---

### 📊 TestNG Data-Driven Results

\`\`\`
Tests run: 4, Failures: 0, Errors: 0

  ✅ createBookingWithVariousData[0] — Alice Johnson  £100   PASSED (312ms)
  ✅ createBookingWithVariousData[1] — Bob Smith      £250   PASSED (198ms)
  ✅ createBookingWithVariousData[2] — Charlie Brown  £500   PASSED (245ms)
  ✅ createBookingWithVariousData[3] — Diana Prince   £75    PASSED (187ms)
\`\`\`

If one dataset fails, only that row is marked as failed — the others still pass.
`,
        exercise: {
          title: 'Build a Data-Driven Booking Test Suite',
          task: `Create a BookingDataDrivenTest class with two DataProviders:

1. "validBookings" — 5 different guest/price/date combinations. Run createBooking with each and assert all fields match.
2. "searchFilters" — test GET /booking with query parameters: ?firstname=Bob, ?lastname=Smith, ?checkin=2026-01-01, ?checkout=2026-01-07. For each, assert status 200 and the response is an array.

Also create a CSV file with at least 3 bookings and write a 3rd DataProvider that reads from it.

Run all tests with mvn test and screenshot showing the parameterised test names in the results.`,
          hints: [
            'For query parameters in REST Assured, use .queryParam("firstname", value) in the given() section',
            'The CSV DataProvider needs the file in src/test/resources/ — make sure this folder exists',
            'TestNG names parameterised tests as methodName[row-index] — check the output to see them'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'What does a @DataProvider method return in TestNG?',
            options: [
              'A single Object with test parameters',
              'A List<Map> of test data',
              'A 2D Object[][] array where each inner array is one test run',
              'A String array of test values'
            ],
            answer: 2
          },
          {
            type: 'truefalse',
            q: 'If one row in a data-driven test fails, TestNG will stop running and fail all remaining rows.',
            answer: false
          },
          {
            type: 'mcq',
            q: 'Why is testing an API with invalid/boundary inputs valuable?',
            options: [
              'It is required by all CI/CD platforms',
              'It reveals whether the API correctly validates and rejects bad data — exposing potential security issues',
              'Invalid input tests always run faster than valid input tests',
              'It doubles the number of tests, which always improves coverage'
            ],
            answer: 1
          },
          {
            type: 'fillin',
            q: 'In REST Assured, you add a URL query parameter using the _______ method in the given() block.',
            answer: '.queryParam()'
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════
  // MODULE 4 — CI/CD & Reporting
  // ═══════════════════════════════════════════════════════════
  {
    id: 'api-module-4',
    title: 'CI/CD & Reporting',
    icon: '🚀',
    lessons: [
      // ── Lesson 11 ──────────────────────────────────────────
      {
        id: 'api-l11',
        title: 'REST Assured + Allure Reporting — Beautiful Test Reports',
        type: 'lesson',
        duration: '30 min',
        whatYoullLearn: [
          'Add Allure to your REST Assured Maven project',
          'Add @Step and @Description annotations for readable reports',
          'Generate and open an Allure HTML report locally',
          'Understand what a good API test report shows',
          'Add request/response logging to reports for failed tests'
        ],
        content: `
## 📊 Allure Reporting for REST Assured

Running tests in the terminal is fine for you. But when a test fails and you need to share what happened with your team or a developer, you need a proper report.

**Allure Report** turns raw TestNG output into a beautiful, shareable HTML dashboard.

---

### 📦 Add Allure to pom.xml

\`\`\`xml
<dependency>
    <groupId>io.qameta.allure</groupId>
    <artifactId>allure-testng</artifactId>
    <version>2.27.0</version>
    <scope>test</scope>
</dependency>

<dependency>
    <groupId>io.qameta.allure</groupId>
    <artifactId>allure-rest-assured</artifactId>
    <version>2.27.0</version>
    <scope>test</scope>
</dependency>

<!-- In the build > plugins section: -->
<plugin>
    <groupId>io.qameta.allure</groupId>
    <artifactId>allure-maven</artifactId>
    <version>2.12.0</version>
    <configuration>
        <reportVersion>2.27.0</reportVersion>
    </configuration>
</plugin>
\`\`\`

---

### 🏷️ Allure Annotations

\`\`\`java
import io.qameta.allure.*;

@Epic("Booking API")
@Feature("Create Booking")
public class CreateBookingTest extends BaseTest {

    @Test
    @Story("Valid booking creation")
    @Description("Creates a booking and verifies all fields are returned correctly")
    @Severity(SeverityLevel.CRITICAL)
    public void createBookingWithValidData() {
        // test code...
    }
}
\`\`\`

| Annotation | What it adds to the report |
|---|---|
| @Epic | Top-level grouping |
| @Feature | Sub-grouping |
| @Story | Test story |
| @Description | Full description shown in the report |
| @Severity | BLOCKER, CRITICAL, NORMAL, MINOR, TRIVIAL |
| @Step | Label for individual steps within a test |

---

### 📡 Logging Requests/Responses to Allure

\`\`\`java
import io.qameta.allure.restassured.AllureRestAssured;

// In your BaseTest @BeforeClass — add this once:
RestAssured.filters(new AllureRestAssured());
\`\`\`

That single line automatically attaches every request and response to each test in the Allure report.

---

### 📝 @Step Annotations for Readable Steps

\`\`\`java
@Test
@Story("Full CRUD lifecycle")
public void fullBookingLifecycle() {
    int id = createBooking("Alice", "Smith", 100);
    verifyBookingExists(id, "Alice");
    updateBooking(id, "Alice Updated", 200);
    deleteBooking(id);
    verifyBookingDeleted(id);
}

@Step("Create booking for {firstName} {lastName}")
private int createBooking(String firstName, String lastName, int price) {
    // ... REST Assured POST ...
    return bookingId;
}

@Step("Delete booking {id}")
private void deleteBooking(int id) {
    // ... REST Assured DELETE ...
}
\`\`\`

---

### ▶️ Generate and Open the Report

\`\`\`bash
mvn clean test
mvn allure:report
mvn allure:serve
\`\`\`
`,
        exercise: {
          title: 'Add Allure Reporting to Your Test Suite',
          task: `Add Allure to your existing REST Assured project:

1. Add the allure-testng and allure-rest-assured dependencies to pom.xml
2. Add RestAssured.filters(new AllureRestAssured()) to your BaseTest @BeforeClass
3. Add @Epic, @Feature, @Story and @Severity annotations to each of your test classes
4. Add at least 3 @Step methods to your BookingCRUDTest to break it into named steps
5. Run mvn clean test && mvn allure:serve
6. Screenshot the Allure Overview page and one test's step-by-step detail page`,
          hints: [
            'The allure-results/ folder is created after "mvn test" — the report is built from these raw files',
            'If allure:serve doesn\'t open automatically, the terminal shows the URL — usually http://localhost:port',
            'Attach a custom note with Allure.addAttachment("Note", "text/plain", "What went wrong here", "txt")'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'What does RestAssured.filters(new AllureRestAssured()) do?',
            options: [
              'Enables parallel test execution',
              'Automatically attaches the full request and response to each test in the Allure report',
              'Filters out requests that return 4xx status codes',
              'Converts REST Assured tests to Postman collections'
            ],
            answer: 1
          },
          {
            type: 'mcq',
            q: 'Which Maven command generates AND opens the Allure HTML report in a browser?',
            options: ['mvn allure:report', 'mvn allure:serve', 'mvn allure:generate', 'mvn test --allure'],
            answer: 1
          },
          {
            type: 'truefalse',
            q: '@Step annotations on helper methods make test failures easier to diagnose by showing which step in the flow broke.',
            answer: true
          },
          {
            type: 'fillin',
            q: 'In Allure, the _______ annotation marks the most critical tests that, if failing, indicate a major blocking issue.',
            answer: '@Severity(SeverityLevel.BLOCKER)'
          }
        ]
      },

      // ── Lesson 12 ──────────────────────────────────────────
      {
        id: 'api-l12',
        title: 'REST Assured in GitHub Actions — Full CI Pipeline',
        type: 'lesson',
        duration: '35 min',
        whatYoullLearn: [
          'Push your REST Assured Maven project to GitHub',
          'Write a GitHub Actions workflow to run mvn test automatically',
          'Publish Allure reports as a CI artefact',
          'Fail the build on test failure and get notified',
          'Understand the complete professional API test pipeline'
        ],
        content: `
## 🚀 REST Assured in GitHub Actions

Your test suite runs locally. The final step is making it run automatically every time your code changes — without you having to do anything.

---

### 📁 Repository Structure

\`\`\`
restful-booker-rest-assured/
├── .github/
│   └── workflows/
│       └── api-tests.yml
├── src/
│   ├── main/java/
│   └── test/
│       ├── java/
│       │   ├── base/BaseTest.java
│       │   ├── tests/
│       │   │   ├── HealthCheckTest.java
│       │   │   ├── BookingCRUDTest.java
│       │   │   ├── AuthTests.java
│       │   │   └── BookingDataDrivenTest.java
│       │   └── utils/TestDataBuilder.java
│       └── resources/
│           ├── testng.xml
│           └── booking-test-data.csv
├── pom.xml
└── README.md
\`\`\`

---

### 📝 testng.xml

\`\`\`xml
<!DOCTYPE suite SYSTEM "https://testng.org/testng-1.0.dtd">
<suite name="Restful-Booker API Test Suite" parallel="none">

    <test name="Health &amp; Auth">
        <classes>
            <class name="tests.HealthCheckTest"/>
            <class name="tests.AuthTests"/>
        </classes>
    </test>

    <test name="CRUD Operations">
        <classes>
            <class name="tests.BookingCRUDTest"/>
        </classes>
    </test>

    <test name="Data-Driven Tests">
        <classes>
            <class name="tests.BookingDataDrivenTest"/>
        </classes>
    </test>

</suite>
\`\`\`

---

### 📝 The GitHub Actions Workflow

\`\`\`yaml
name: REST Assured API Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

jobs:
  api-tests:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'
          cache: maven

      - name: Run API tests with Maven
        run: |
          mvn clean test \\
            -Dapi.username=\${{ secrets.API_USERNAME }} \\
            -Dapi.password=\${{ secrets.API_PASSWORD }} \\
            --no-transfer-progress

      - name: Generate Allure Report
        if: always()
        run: mvn allure:report --no-transfer-progress

      - name: Upload Allure Report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: allure-report-\${{ github.run_number }}
          path: target/site/allure-maven-plugin/
          retention-days: 30

      - name: Upload Surefire XML Results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: surefire-results
          path: target/surefire-reports/
\`\`\`

---

### 🔐 Using Secrets in REST Assured Tests

\`\`\`java
@BeforeClass
public void setUp() {
    RestAssured.baseURI = System.getProperty("base.url",
        "https://restful-booker.herokuapp.com");

    String username = System.getProperty("api.username", "admin");
    String password = System.getProperty("api.password", "password123");

    token = given()
                .contentType("application/json")
                .body("{ \\"username\\": \\"" + username + "\\", \\"password\\": \\"" + password + "\\" }")
            .when()
                .post("/auth")
            .then()
                .statusCode(200)
                .extract().path("token");
}
\`\`\`

---

### 🎓 You're Now a Complete API Tester

You can:
- Explain REST, HTTP methods and JSON to anyone
- Use Postman to explore and manually test any API
- Run Postman collections automatically with Newman in CI
- Write professional Java API tests with REST Assured
- Handle all three major authentication patterns
- Use DataProviders for efficient test coverage
- Generate beautiful Allure reports
- Run everything automatically in GitHub Actions

**This is the complete professional API testing skill set.**
`,
        exercise: {
          title: 'Deploy Your Full API Test Suite to GitHub Actions',
          task: `Set up the complete CI pipeline for your REST Assured project:

1. Push your project to a GitHub repository
2. Create testng.xml that runs all your test classes in the correct order
3. Create .github/workflows/api-tests.yml with JDK setup, mvn test, allure:report, and artifact upload
4. Add API_USERNAME and API_PASSWORD as GitHub Secrets
5. Update BaseTest to read credentials from System.getProperty()
6. Push to main and watch the Actions tab
7. Download the Allure report artifact when the run completes
8. Screenshot: (a) green workflow run in Actions tab, (b) downloaded Allure report open in browser`,
          hints: [
            'The "cache: maven" option in setup-java dramatically speeds up subsequent runs by caching downloaded JARs',
            'Use "if: always()" on the allure:report and upload steps so reports are available even for failed runs',
            'If mvn test fails on CI but passes locally, use getClass().getClassLoader().getResourceAsStream() for reliable CI resource paths'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'Why should you use System.getProperty() in BaseTest instead of hardcoding credentials?',
            options: [
              'System.getProperty() reads faster than hardcoded strings',
              'It allows CI pipelines to inject credentials via -D flags without storing them in the codebase',
              'Hardcoded strings are not valid Java syntax',
              'System.getProperty() is required by REST Assured 5.x'
            ],
            answer: 1
          },
          {
            type: 'mcq',
            q: 'What does "cache: maven" in the setup-java action do?',
            options: [
              'Caches the test results from the last run',
              'Caches downloaded Maven dependencies so subsequent pipeline runs start faster',
              'Stores the generated Allure report in a cache',
              'Enables incremental builds so unchanged tests are skipped'
            ],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'The "if: always()" condition on the Allure report upload step is important because it ensures reports are available even when tests fail.',
            answer: true
          },
          {
            type: 'fillin',
            q: 'In Maven, you pass a system property to tests using the _______ syntax on the command line (e.g. -Dapi.username=admin).',
            answer: '-D'
          }
        ]
      }
    ]
  }


); // end API_CURRICULUM (Modules 3-4)
