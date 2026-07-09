// ── Module C: API Test Execution — Lab Walkthroughs ────────────
// Labs: Terminal-first, step-by-step guided exercises
// Capstone: Restful-Booker REST Assured Automation Suite

const API_CURRICULUM_LABS = [

  // ──────────────────────────────────────────────────────────
  // LAB 1 — Environment Setup
  // ──────────────────────────────────────────────────────────
  {
    id: 'api-lab-1',
    title: 'Lab 1: Set Up Your API Testing Environment',
    icon: '⚙️',
    duration: '20 min',
    difficulty: 'Beginner',
    objective: 'Install all tools needed for the course and verify they work correctly.',
    steps: [
      {
        step: 1,
        title: 'Install Java JDK 21',
        description: 'Check if Java is already installed first:',
        commands: [
          'java -version',
          'javac -version'
        ],
        expectedOutput: 'openjdk version "21.x.x" ...',
        note: 'If not installed, download from https://adoptium.net — choose JDK 21 LTS. Run the installer, then re-run the commands above.'
      },
      {
        step: 2,
        title: 'Install Maven',
        description: 'Check Maven:',
        commands: ['mvn -version'],
        expectedOutput: 'Apache Maven 3.9.x ...',
        note: 'IntelliJ IDEA bundles Maven — if you have IntelliJ you already have it. Standalone: https://maven.apache.org/download.cgi'
      },
      {
        step: 3,
        title: 'Install Node.js (for Newman)',
        description: 'Check Node.js:',
        commands: ['node --version', 'npm --version'],
        expectedOutput: 'v20.x.x',
        note: 'Download from https://nodejs.org — choose the LTS version.'
      },
      {
        step: 4,
        title: 'Install Newman and HTMLExtra Reporter',
        description: 'Install globally via npm:',
        commands: [
          'npm install -g newman',
          'npm install -g newman-reporter-htmlextra',
          'newman --version'
        ],
        expectedOutput: '6.x.x',
        note: 'This makes the "newman" command available anywhere in your terminal.'
      },
      {
        step: 5,
        title: 'Download and Install Postman',
        description: 'Go to https://www.postman.com/downloads/ and install for your OS. Create a free account — required for collections and environments.',
        commands: [],
        note: 'Open Postman after install and sign in.'
      },
      {
        step: 6,
        title: 'Verify Everything with a Test Call',
        description: 'Run this curl command to confirm you can reach the Restful-Booker API:',
        commands: ['curl -s https://restful-booker.herokuapp.com/ping'],
        expectedOutput: 'Created',
        note: '"Created" means the API is live and responding. You are ready to start the course!'
      }
    ]
  },

  // ──────────────────────────────────────────────────────────
  // LAB 2 — Create Maven Project
  // ──────────────────────────────────────────────────────────
  {
    id: 'api-lab-2',
    title: 'Lab 2: Create the REST Assured Maven Project',
    icon: '📦',
    duration: '25 min',
    difficulty: 'Beginner',
    objective: 'Set up a complete Maven project with REST Assured, TestNG, and Allure dependencies.',
    steps: [
      {
        step: 1,
        title: 'Create a New Maven Project via Terminal',
        description: 'Navigate to where you want your project, then generate it:',
        commands: [
          'cd ~/Desktop',
          'mvn archetype:generate -DgroupId=com.api.tests -DartifactId=restful-booker-tests -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false',
          'cd restful-booker-tests'
        ],
        expectedOutput: 'BUILD SUCCESS',
        note: 'This creates a standard Maven directory structure.'
      },
      {
        step: 2,
        title: 'Create the Full Directory Structure',
        description: 'Create the folders needed for your tests:',
        commands: [
          'mkdir -p src/test/java/base',
          'mkdir -p src/test/java/tests',
          'mkdir -p src/test/java/utils',
          'mkdir -p src/test/resources',
          'ls -R src/'
        ],
        expectedOutput: 'src/test/java/base  src/test/java/tests  src/test/java/utils',
        note: ''
      },
      {
        step: 3,
        title: 'Replace pom.xml with Full Dependencies',
        description: 'Open pom.xml in your editor and replace the entire contents with:',
        code: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.api.tests</groupId>
    <artifactId>restful-booker-tests</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>jar</packaging>

    <properties>
        <maven.compiler.source>21</maven.compiler.source>
        <maven.compiler.target>21</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <dependency>
            <groupId>io.rest-assured</groupId>
            <artifactId>rest-assured</artifactId>
            <version>5.4.0</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>io.rest-assured</groupId>
            <artifactId>json-schema-validator</artifactId>
            <version>5.4.0</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.testng</groupId>
            <artifactId>testng</artifactId>
            <version>7.9.0</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
            <version>2.17.0</version>
        </dependency>
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
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>3.2.5</version>
                <configuration>
                    <suiteXmlFiles>
                        <suiteXmlFile>src/test/resources/testng.xml</suiteXmlFile>
                    </suiteXmlFiles>
                    <argLine>
                        -javaagent:"\${settings.localRepository}/org/aspectj/aspectjweaver/1.9.22/aspectjweaver-1.9.22.jar"
                    </argLine>
                </configuration>
            </plugin>
            <plugin>
                <groupId>io.qameta.allure</groupId>
                <artifactId>allure-maven</artifactId>
                <version>2.12.0</version>
                <configuration>
                    <reportVersion>2.27.0</reportVersion>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.aspectj</groupId>
                <artifactId>aspectj-maven-plugin</artifactId>
                <version>1.14.0</version>
            </plugin>
        </plugins>
    </build>
</project>`,
        note: ''
      },
      {
        step: 4,
        title: 'Download All Dependencies',
        description: 'Run Maven to pull all libraries from the internet:',
        commands: ['mvn clean install -DskipTests'],
        expectedOutput: 'BUILD SUCCESS',
        note: 'This may take 1-2 minutes the first time — Maven downloads all JAR files into your local repository (~/.m2/).'
      },
      {
        step: 5,
        title: 'Create testng.xml',
        description: 'Create src/test/resources/testng.xml:',
        code: `<!DOCTYPE suite SYSTEM "https://testng.org/testng-1.0.dtd">
<suite name="Restful-Booker API Test Suite" parallel="none" verbose="1">

    <test name="Health Check">
        <classes>
            <class name="tests.HealthCheckTest"/>
        </classes>
    </test>

    <test name="Authentication">
        <classes>
            <class name="tests.AuthTest"/>
        </classes>
    </test>

    <test name="Booking CRUD">
        <classes>
            <class name="tests.BookingCRUDTest"/>
        </classes>
    </test>

    <test name="Data Driven">
        <classes>
            <class name="tests.BookingDataDrivenTest"/>
        </classes>
    </test>

</suite>`,
        note: ''
      },
      {
        step: 6,
        title: 'Open in IntelliJ IDEA',
        description: 'Open IntelliJ → File → Open → Select the restful-booker-tests folder. IntelliJ will detect the pom.xml and set up the project automatically.',
        commands: [],
        note: 'You should see the Maven tool window on the right side with the project structure.'
      }
    ]
  },

  // ──────────────────────────────────────────────────────────
  // LAB 3 — BaseTest and First Tests
  // ──────────────────────────────────────────────────────────
  {
    id: 'api-lab-3',
    title: 'Lab 3: BaseTest Class and First REST Assured Tests',
    icon: '☕',
    duration: '30 min',
    difficulty: 'Beginner',
    objective: 'Write the BaseTest setup class and first 3 tests using the given().when().then() pattern.',
    steps: [
      {
        step: 1,
        title: 'Create BaseTest.java',
        description: 'Create src/test/java/base/BaseTest.java:',
        code: `package base;

import io.qameta.allure.restassured.AllureRestAssured;
import io.restassured.RestAssured;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.specification.RequestSpecification;
import org.testng.annotations.BeforeClass;

import static io.restassured.RestAssured.given;

public class BaseTest {

    protected String token;
    protected int bookingId;
    protected static RequestSpecification requestSpec;

    @BeforeClass
    public void setUp() {
        // Set base URL — reads from system property or defaults to live API
        RestAssured.baseURI = System.getProperty("base.url",
            "https://restful-booker.herokuapp.com");

        // Attach every request/response to Allure automatically
        RestAssured.filters(new AllureRestAssured());

        // Enable request/response logging for debugging
        RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();

        // Get auth token
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

        System.out.println("✅ Auth token obtained: " + token.substring(0, 8) + "...");

        // Build reusable request spec with auth token
        requestSpec = new RequestSpecBuilder()
            .addHeader("Content-Type", "application/json")
            .addHeader("Accept", "application/json")
            .addHeader("Cookie", "token=" + token)
            .build();
    }
}`,
        note: ''
      },
      {
        step: 2,
        title: 'Create HealthCheckTest.java',
        description: 'Create src/test/java/tests/HealthCheckTest.java:',
        code: `package tests;

import base.BaseTest;
import io.qameta.allure.*;
import org.testng.annotations.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@Epic("Restful-Booker API")
@Feature("Health Check")
public class HealthCheckTest extends BaseTest {

    @Test
    @Story("API is live")
    @Description("Verify the API health check endpoint returns 201 and confirms the service is running")
    @Severity(SeverityLevel.BLOCKER)
    public void pingEndpointReturns201() {
        given()
        .when()
            .get("/ping")
        .then()
            .statusCode(201)
            .body(equalTo("Created"))
            .time(lessThan(3000L));
    }

    @Test
    @Story("Response speed")
    @Description("Verify the health endpoint responds within acceptable time")
    @Severity(SeverityLevel.NORMAL)
    public void pingRespondsFast() {
        given()
        .when()
            .get("/ping")
        .then()
            .statusCode(201)
            .time(lessThan(5000L));
    }
}`,
        note: ''
      },
      {
        step: 3,
        title: 'Run HealthCheckTest Only',
        description: 'Run just the health check tests from the terminal:',
        commands: ['mvn test -Dtest=HealthCheckTest -DsuiteXmlFile='],
        expectedOutput: 'Tests run: 2, Failures: 0, Errors: 0',
        note: 'If you see a connection error, check your internet connection and verify the base URL is reachable.'
      },
      {
        step: 4,
        title: 'Create AuthTest.java',
        description: 'Create src/test/java/tests/AuthTest.java:',
        code: `package tests;

import base.BaseTest;
import io.qameta.allure.*;
import org.testng.annotations.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@Epic("Restful-Booker API")
@Feature("Authentication")
public class AuthTest extends BaseTest {

    @Test
    @Story("Valid login")
    @Severity(SeverityLevel.CRITICAL)
    public void validCredentialsReturnToken() {
        String receivedToken = given()
                .contentType("application/json")
                .body("{ \\"username\\": \\"admin\\", \\"password\\": \\"password123\\" }")
            .when()
                .post("/auth")
            .then()
                .statusCode(200)
                .body("token", not(emptyOrNullString()))
                .body("token", hasLength(greaterThan(5)))
                .extract().path("token");

        System.out.println("Token received: " + receivedToken);
    }

    @Test
    @Story("Invalid login")
    @Severity(SeverityLevel.CRITICAL)
    public void invalidPasswordReturnsError() {
        given()
                .contentType("application/json")
                .body("{ \\"username\\": \\"admin\\", \\"password\\": \\"WRONGPASSWORD\\" }")
            .when()
                .post("/auth")
            .then()
                .statusCode(200) // Restful-Booker returns 200 even for bad creds
                .body("reason", equalTo("Bad credentials"));
    }

    @Test
    @Story("Delete without token")
    @Severity(SeverityLevel.CRITICAL)
    public void deleteWithoutTokenReturns403() {
        given()
                .contentType("application/json")
                // No Cookie header — no token
            .when()
                .delete("/booking/1")
            .then()
                .statusCode(403);
    }
}`,
        note: ''
      },
      {
        step: 5,
        title: 'Run All Tests So Far',
        description: 'Run the full suite via testng.xml (only classes that exist will run):',
        commands: ['mvn clean test'],
        expectedOutput: 'Tests run: 5, Failures: 0',
        note: 'You will see some skipped tests for BookingCRUDTest and BookingDataDrivenTest — we write those next.'
      }
    ]
  },

  // ──────────────────────────────────────────────────────────
  // LAB 4 — CRUD Tests
  // ──────────────────────────────────────────────────────────
  {
    id: 'api-lab-4',
    title: 'Lab 4: Build the Full CRUD Test Class',
    icon: '✏️',
    duration: '40 min',
    difficulty: 'Beginner',
    objective: 'Write the complete Create → Read → Update → Delete lifecycle test using REST Assured.',
    steps: [
      {
        step: 1,
        title: 'Create TestDataBuilder.java (utility)',
        description: 'Create src/test/java/utils/TestDataBuilder.java — this builds request body maps:',
        code: `package utils;

import java.util.HashMap;
import java.util.Map;

public class TestDataBuilder {

    public static Map<String, Object> createBookingBody(
            String firstName, String lastName, int price,
            boolean depositPaid, String checkin, String checkout,
            String additionalNeeds) {

        Map<String, Object> dates = new HashMap<>();
        dates.put("checkin",  checkin);
        dates.put("checkout", checkout);

        Map<String, Object> body = new HashMap<>();
        body.put("firstname",       firstName);
        body.put("lastname",        lastName);
        body.put("totalprice",      price);
        body.put("depositpaid",     depositPaid);
        body.put("bookingdates",    dates);
        body.put("additionalneeds", additionalNeeds);

        return body;
    }

    public static Map<String, Object> defaultBooking() {
        return createBookingBody(
            "Test", "Learner", 200, true,
            "2026-06-01", "2026-06-07", "Breakfast"
        );
    }
}`,
        note: ''
      },
      {
        step: 2,
        title: 'Create BookingCRUDTest.java',
        description: 'Create src/test/java/tests/BookingCRUDTest.java:',
        code: `package tests;

import base.BaseTest;
import io.qameta.allure.*;
import org.testng.annotations.Test;
import utils.TestDataBuilder;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@Epic("Restful-Booker API")
@Feature("Booking CRUD")
public class BookingCRUDTest extends BaseTest {

    @Test(priority = 1)
    @Story("Create")
    @Description("Create a new booking and verify all fields are returned correctly")
    @Severity(SeverityLevel.CRITICAL)
    public void createBookingSuccessfully() {
        bookingId = createBookingStep();
        System.out.println("✅ Created booking with ID: " + bookingId);
    }

    @Test(priority = 2, dependsOnMethods = "createBookingSuccessfully")
    @Story("Read")
    @Description("Retrieve the created booking and verify data matches what was sent")
    @Severity(SeverityLevel.CRITICAL)
    public void readBookingReturnsCorrectData() {
        given()
            .header("Accept", "application/json")
        .when()
            .get("/booking/" + bookingId)
        .then()
            .statusCode(200)
            .body("firstname",               equalTo("Test"))
            .body("lastname",                equalTo("Learner"))
            .body("totalprice",              equalTo(200))
            .body("depositpaid",             equalTo(true))
            .body("bookingdates.checkin",    equalTo("2026-06-01"))
            .body("bookingdates.checkout",   equalTo("2026-06-07"))
            .body("additionalneeds",         equalTo("Breakfast"));
    }

    @Test(priority = 3, dependsOnMethods = "createBookingSuccessfully")
    @Story("Full Update (PUT)")
    @Description("Replace all booking fields via PUT and verify the changes")
    @Severity(SeverityLevel.NORMAL)
    public void fullUpdateWithPutSucceeds() {
        given(requestSpec)
            .body(TestDataBuilder.createBookingBody(
                "Updated", "Guest", 500, false,
                "2026-09-01", "2026-09-10", "Dinner"))
        .when()
            .put("/booking/" + bookingId)
        .then()
            .statusCode(200)
            .body("firstname",  equalTo("Updated"))
            .body("lastname",   equalTo("Guest"))
            .body("totalprice", equalTo(500));
    }

    @Test(priority = 4, dependsOnMethods = "fullUpdateWithPutSucceeds")
    @Story("Partial Update (PATCH)")
    @Description("Update only the total price using PATCH and verify other fields are unchanged")
    @Severity(SeverityLevel.NORMAL)
    public void partialUpdateWithPatchChangesOnlyPrice() {
        given(requestSpec)
            .body("{ \\"totalprice\\": 999 }")
        .when()
            .patch("/booking/" + bookingId)
        .then()
            .statusCode(200)
            .body("totalprice", equalTo(999))
            .body("firstname",  equalTo("Updated"))   // unchanged
            .body("lastname",   equalTo("Guest"));     // unchanged
    }

    @Test(priority = 5, dependsOnMethods = "partialUpdateWithPatchChangesOnlyPrice")
    @Story("Delete")
    @Description("Delete the booking and verify it no longer exists")
    @Severity(SeverityLevel.CRITICAL)
    public void deleteBookingAndVerifyGone() {
        // Step 1 — Delete
        given(requestSpec)
        .when()
            .delete("/booking/" + bookingId)
        .then()
            .statusCode(201);  // Restful-Booker quirk

        // Step 2 — Verify it's gone
        given()
            .header("Accept", "application/json")
        .when()
            .get("/booking/" + bookingId)
        .then()
            .statusCode(404);

        System.out.println("✅ Booking " + bookingId + " successfully deleted and verified gone.");
    }

    // ── Helper method ──────────────────────────────────────
    @Step("Create a new booking via POST /booking")
    private int createBookingStep() {
        return given()
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .body(TestDataBuilder.defaultBooking())
            .when()
                .post("/booking")
            .then()
                .statusCode(200)
                .body("bookingid",              notNullValue())
                .body("booking.firstname",      equalTo("Test"))
                .body("booking.lastname",       equalTo("Learner"))
                .body("booking.totalprice",     equalTo(200))
                .body("booking.depositpaid",    equalTo(true))
                .extract().path("bookingid");
    }
}`,
        note: ''
      },
      {
        step: 3,
        title: 'Run the CRUD Tests',
        description: 'Run only the CRUD test:',
        commands: ['mvn test -Dtest=BookingCRUDTest -DsuiteXmlFile='],
        expectedOutput: 'Tests run: 5, Failures: 0, Errors: 0',
        note: 'Tests run in priority order: create → read → update → patch → delete. Each depends on the previous.'
      },
      {
        step: 4,
        title: 'Verify Your Allure Results',
        description: 'Generate and open the Allure report:',
        commands: [
          'mvn allure:report',
          'mvn allure:serve'
        ],
        expectedOutput: 'Server started at port: 12345 (opens browser automatically)',
        note: 'Click on the "Booking CRUD" feature in the report and expand each test to see the full request/response logged automatically.'
      }
    ]
  },

  // ──────────────────────────────────────────────────────────
  // LAB 5 — Data-Driven Tests
  // ──────────────────────────────────────────────────────────
  {
    id: 'api-lab-5',
    title: 'Lab 5: Data-Driven Tests with @DataProvider',
    icon: '📊',
    duration: '30 min',
    difficulty: 'Intermediate',
    objective: 'Write parameterised API tests using TestNG DataProvider to test multiple datasets efficiently.',
    steps: [
      {
        step: 1,
        title: 'Create the CSV Test Data File',
        description: 'Create src/test/resources/booking-data.csv:',
        code: `firstname,lastname,totalprice,depositpaid,checkin,checkout,additionalneeds
Alice,Johnson,100,true,2026-01-10,2026-01-17,Breakfast
Bob,Smith,250,false,2026-02-15,2026-02-20,None
Charlie,Brown,500,true,2026-03-10,2026-03-17,Dinner
Diana,Prince,75,false,2026-04-05,2026-04-06,None
Eve,Clark,350,true,2026-05-20,2026-05-27,Airport transfer`,
        note: ''
      },
      {
        step: 2,
        title: 'Create BookingDataDrivenTest.java',
        description: 'Create src/test/java/tests/BookingDataDrivenTest.java:',
        code: `package tests;

import base.BaseTest;
import io.qameta.allure.*;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.io.*;
import java.util.*;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@Epic("Restful-Booker API")
@Feature("Data-Driven Booking")
public class BookingDataDrivenTest extends BaseTest {

    // ── Inline DataProvider ────────────────────────────────
    @DataProvider(name = "validBookings")
    public Object[][] validBookingData() {
        return new Object[][] {
            { "Alice",   "Johnson", 100, true,  "2026-01-10", "2026-01-17", "Breakfast" },
            { "Bob",     "Smith",   250, false, "2026-02-15", "2026-02-20", "None" },
            { "Charlie", "Brown",   500, true,  "2026-03-10", "2026-03-17", "Dinner" },
        };
    }

    @Test(dataProvider = "validBookings")
    @Story("Create multiple valid bookings")
    @Severity(SeverityLevel.NORMAL)
    public void createBookingWithDifferentGuests(
            String firstName, String lastName, int price,
            boolean depositPaid, String checkin, String checkout, String needs) {

        Map<String, Object> dates = new HashMap<>();
        dates.put("checkin", checkin);
        dates.put("checkout", checkout);

        Map<String, Object> body = new HashMap<>();
        body.put("firstname",       firstName);
        body.put("lastname",        lastName);
        body.put("totalprice",      price);
        body.put("depositpaid",     depositPaid);
        body.put("bookingdates",    dates);
        body.put("additionalneeds", needs);

        given()
            .header("Content-Type", "application/json")
            .header("Accept", "application/json")
            .body(body)
        .when()
            .post("/booking")
        .then()
            .statusCode(200)
            .body("bookingid",             notNullValue())
            .body("booking.firstname",     equalTo(firstName))
            .body("booking.lastname",      equalTo(lastName))
            .body("booking.totalprice",    equalTo(price))
            .body("booking.depositpaid",   equalTo(depositPaid));
    }

    // ── CSV DataProvider ───────────────────────────────────
    @DataProvider(name = "csvBookings")
    public Object[][] csvBookingData() throws IOException {
        List<Object[]> rows = new ArrayList<>();
        String csvPath = "src/test/resources/booking-data.csv";

        try (BufferedReader br = new BufferedReader(new FileReader(csvPath))) {
            br.readLine(); // skip header
            String line;
            while ((line = br.readLine()) != null) {
                String[] c = line.split(",");
                rows.add(new Object[]{
                    c[0], c[1],
                    Integer.parseInt(c[2]),
                    Boolean.parseBoolean(c[3]),
                    c[4], c[5], c[6]
                });
            }
        }
        return rows.toArray(new Object[0][]);
    }

    @Test(dataProvider = "csvBookings")
    @Story("Create bookings from CSV")
    @Severity(SeverityLevel.NORMAL)
    public void createBookingFromCsv(
            String firstName, String lastName, int price,
            boolean depositPaid, String checkin, String checkout, String needs) {

        Map<String, Object> dates = new HashMap<>();
        dates.put("checkin", checkin);
        dates.put("checkout", checkout);

        Map<String, Object> body = new HashMap<>();
        body.put("firstname",       firstName);
        body.put("lastname",        lastName);
        body.put("totalprice",      price);
        body.put("depositpaid",     depositPaid);
        body.put("bookingdates",    dates);
        body.put("additionalneeds", needs);

        given()
            .header("Content-Type", "application/json")
            .header("Accept", "application/json")
            .body(body)
        .when()
            .post("/booking")
        .then()
            .statusCode(200)
            .body("booking.firstname", equalTo(firstName));
    }

    // ── Search Filter Tests (negative/boundary) ────────────
    @DataProvider(name = "searchFilters")
    public Object[][] searchFilterData() {
        return new Object[][] {
            { "firstname", "Alice" },
            { "lastname",  "Smith" },
            { "checkin",   "2026-01-10" },
            { "checkout",  "2026-01-17" },
        };
    }

    @Test(dataProvider = "searchFilters")
    @Story("Search bookings by filter")
    @Severity(SeverityLevel.MINOR)
    public void searchBookingsByFilter(String paramName, String paramValue) {
        given()
            .header("Accept", "application/json")
            .queryParam(paramName, paramValue)
        .when()
            .get("/booking")
        .then()
            .statusCode(200)
            .body("$", instanceOf(List.class));  // Returns array (may be empty)
    }
}`,
        note: ''
      },
      {
        step: 3,
        title: 'Run the Full Suite',
        description: 'Run everything together:',
        commands: ['mvn clean test'],
        expectedOutput: 'Tests run: 18+, Failures: 0',
        note: 'With 3 inline + 5 CSV data rows + 4 search tests, you should see 12+ tests from BookingDataDrivenTest alone.'
      }
    ]
  },

  // ──────────────────────────────────────────────────────────
  // LAB 6 — GitHub Actions Pipeline
  // ──────────────────────────────────────────────────────────
  {
    id: 'api-lab-6',
    title: 'Lab 6: Deploy to GitHub Actions',
    icon: '🚀',
    duration: '25 min',
    difficulty: 'Intermediate',
    objective: 'Push the complete test project to GitHub and run it automatically in CI.',
    steps: [
      {
        step: 1,
        title: 'Initialise Git and Create .gitignore',
        description: 'In your project root:',
        commands: [
          'git init',
          'echo "target/\\n.idea/\\n*.iml\\nallure-results/" > .gitignore',
          'git add .',
          'git commit -m "feat: initial REST Assured test suite for Restful-Booker"'
        ],
        expectedOutput: '[main (root-commit) abc1234] feat: initial REST Assured test suite...',
        note: ''
      },
      {
        step: 2,
        title: 'Create GitHub Repository and Push',
        description: 'Go to github.com → New repository → Name: "restful-booker-tests" → Create. Then:',
        commands: [
          'git remote add origin https://github.com/YOUR_USERNAME/restful-booker-tests.git',
          'git branch -M main',
          'git push -u origin main'
        ],
        expectedOutput: 'Branch main set up to track remote branch main from origin.',
        note: 'Replace YOUR_USERNAME with your actual GitHub username.'
      },
      {
        step: 3,
        title: 'Add GitHub Secrets',
        description: 'In your GitHub repo: Settings → Secrets and variables → Actions → New repository secret. Add:',
        commands: [],
        note: 'API_USERNAME = admin\nAPI_PASSWORD = password123\n\nThese are injected into the workflow at runtime — never committed to the repo.'
      },
      {
        step: 4,
        title: 'Create the GitHub Actions Workflow',
        description: 'Create .github/workflows/api-tests.yml:',
        code: `name: Restful-Booker API Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

jobs:
  api-tests:
    runs-on: ubuntu-latest
    name: REST Assured API Test Suite

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'
          cache: maven

      - name: Run tests
        run: |
          mvn clean test \\
            -Dapi.username=\${{ secrets.API_USERNAME }} \\
            -Dapi.password=\${{ secrets.API_PASSWORD }} \\
            --no-transfer-progress

      - name: Generate Allure report
        if: always()
        run: mvn allure:report --no-transfer-progress

      - name: Upload Allure HTML report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: allure-report-run-\${{ github.run_number }}
          path: target/site/allure-maven-plugin/
          retention-days: 30

      - name: Upload Surefire XML
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: surefire-xml
          path: target/surefire-reports/
          retention-days: 7`,
        note: ''
      },
      {
        step: 5,
        title: 'Push the Workflow and Watch It Run',
        description: 'Commit and push the workflow file:',
        commands: [
          'git add .github/',
          'git commit -m "ci: add GitHub Actions workflow for API tests"',
          'git push origin main'
        ],
        expectedOutput: 'Branch main updated.',
        note: 'Go to your GitHub repo → Actions tab. You should see the workflow start within seconds.'
      },
      {
        step: 6,
        title: 'Download and View the Report',
        description: 'After the workflow finishes (green checkmark):',
        commands: [],
        note: 'Click on the workflow run → Scroll to Artifacts → Download "allure-report-run-1". Unzip it and open index.html in your browser to see the full Allure report.'
      }
    ]
  },

  // ──────────────────────────────────────────────────────────
  // CAPSTONE — Full Suite
  // ──────────────────────────────────────────────────────────
  {
    id: 'api-capstone',
    title: '🏆 Capstone Project: Restful-Booker Complete Automation Suite',
    icon: '🏆',
    duration: '3-4 hours',
    difficulty: 'Intermediate',
    objective: 'Build and deploy a production-quality API test suite that covers the full Restful-Booker API — authentication, CRUD, data-driven testing, edge cases, and automated CI/CD reporting.',
    description: `This capstone project ties together everything you've learned across all 5 modules. By the end you will have a GitHub repository with a complete, automated REST Assured test suite that runs on every push to main and generates Allure reports automatically.`,
    requirements: [
      'Maven project with REST Assured 5.x, TestNG 7.9, and Allure 2.27',
      'BaseTest class with automatic auth token retrieval and AllureRestAssured filter',
      'HealthCheckTest — 2 tests covering /ping endpoint and response time',
      'AuthTest — 3 tests: valid login, invalid password, unauthorised access',
      'BookingCRUDTest — 5 tests: create → read → PUT → PATCH → delete with 404 verification',
      'BookingDataDrivenTest — DataProvider with 5 bookings + CSV reader with 5 rows + 4 search filter tests',
      'testng.xml suite file that runs all 4 test classes in order',
      'GitHub repository with all source files committed',
      'GitHub Actions workflow that runs on push to main',
      'Allure report artifact uploaded on every run (including failed runs)'
    ],
    deliverables: [
      {
        title: 'GitHub Repository URL',
        description: 'Public repo containing all source code, testng.xml, pom.xml, and .github/workflows/api-tests.yml'
      },
      {
        title: 'Green CI Screenshot',
        description: 'Screenshot of a passing GitHub Actions run showing all tests green in the summary'
      },
      {
        title: 'Allure Report Screenshot',
        description: 'Screenshot of the downloaded Allure report showing test pass rate, suites, and at least one expanded test with request/response attached'
      },
      {
        title: 'Failed Test Evidence',
        description: 'Deliberately break one test (e.g. change an expected status code), push to GitHub, capture the red CI run, then fix it and push again showing green'
      }
    ],
    bonusChallenges: [
      {
        title: 'Filter by First Name',
        description: 'Add 3 tests that use GET /booking?firstname=VALUE and verify the filtered results contain only bookings with that name'
      },
      {
        title: 'Date Range Search',
        description: 'Add tests for GET /booking?checkin=DATE&checkout=DATE and verify the response is an array'
      },
      {
        title: 'Schema Validation',
        description: 'Add JSON schema validation using REST Assured\'s json-schema-validator: create a booking-schema.json file and assert that the GET /booking/{id} response matches it'
      },
      {
        title: 'Parallel Execution',
        description: 'Update testng.xml to run the Health Check and Auth test classes in parallel (parallel="classes") and verify no race conditions'
      }
    ],
    checklist: [
      'Project runs locally with mvn clean test showing 0 failures',
      'Allure report generates with mvn allure:serve and shows all tests',
      'GitHub repository is public and contains all files',
      'GitHub Actions workflow runs automatically on push',
      'Allure HTML report is uploaded as an artifact on every run',
      'Auth token is read from system properties (not hardcoded)',
      'DELETE verification: GET after DELETE returns 404',
      'Data-driven tests show parameterised test names in the report',
      'At least one @Step annotation is used in BookingCRUDTest'
    ]
  }

]; // end API_CURRICULUM_LABS