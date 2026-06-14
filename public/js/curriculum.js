const CURRICULUM = [
  // ── Chapter 0: Before You Start ─────────────────────────────
  {
    id: 'module-0',
    title: 'Before You Start',
    icon: '👋',
    lessons: [
      {
        id: 'l0',
        title: 'Welcome: A Manual Tester\'s Journey to Automation',
        type: 'intro',
        duration: '10 min',
        whatYoullLearn: [
          'What Selenium WebDriver is and how it works',
          'How your manual testing skills give you a head start',
          'What you will build by the end of this course',
          'The full 9-chapter course roadmap',
          'Exactly what tools you need to get started'
        ],
        content: `
## 👋 Welcome, Manual Tester!

You've been clicking buttons, filling forms, and checking results manually for years. You know what good software looks like. You know when something is broken.

**Now it's time to make the computer do your clicking for you.**

---

### 🤔 Why Learn Automation? (The Honest Answer)

Think about this: how many times a week do you test the login page?

The same steps, every sprint:
1. Open the browser
2. Type a username
3. Type a password
4. Click Login
5. Check you're on the dashboard

That's 5 steps. Done manually by a human. Done manually *every single release*. Done by *you*.

**Automation lets you write those 5 steps once — and run them in 3 seconds, a hundred times a day, automatically.** You write the script once, and you never touch that test again manually.

---

### 🔍 What Exactly Is Selenium?

Selenium WebDriver is a tool that lets Java code control a real web browser — Chrome, Firefox, Edge — just like you would with your mouse and keyboard.

Your code says:
\`\`\`java
// 1. Open the browser and go to the page
driver.get("https://myapp.com/login");

// 2. Find the username field and type in it
driver.findElement(By.id("username")).sendKeys("admin");

// 3. Find the password field and type in it
driver.findElement(By.id("password")).sendKeys("secret123");

// 4. Click the Login button
driver.findElement(By.id("submit")).click();

// 5. Assert you're now on the dashboard
Assert.assertTrue(driver.getCurrentUrl().contains("dashboard"));
\`\`\`

You're not doing anything magical. You're just *writing down* the steps you already know how to do — in a language the computer understands.

---

### 🆚 Manual vs Automation — Side by Side

| Manual Testing | Automation Testing |
|---|---|
| You click buttons yourself | Code clicks for you |
| Takes 5 min per test run | Takes 3 seconds per run |
| Can run once per sprint | Can run 50x per day |
| You get tired and miss things | Never misses, never tired |
| Hard to test 10 browsers at once | Run on 10 browsers simultaneously |
| No code required | Requires coding (we'll teach you!) |

**You don't replace manual testing — you add automation on top, for the repetitive parts.**

---

### 📚 What Will You Build?

By the end of this course, you'll have built a **complete Selenium test automation framework** — the same type used at companies like Infosys, Wipro, TCS, Capgemini, and Amazon.

It includes:
- **Real browser tests** that open Chrome and run test scenarios
- **Page Object Model** — the industry-standard way to organise tests
- **TestNG integration** — run 50 tests with one command
- **Parallel execution** — run tests on 3 browsers simultaneously
- **CI/CD ready** — plug directly into Jenkins or GitHub Actions

---

### 🗺️ Your Learning Roadmap

| Chapter | What You'll Do | Time |
|---------|---------------|------|
| 0 (this one!) | Before You Start — understand the big picture | 10 min |
| 1 | Java for Manual Testers — syntax, variables, loops | 70 min |
| 2 | Your First Automation Test — run Chrome from code | 40 min |
| 3 | Finding Elements — locate anything on any page | 65 min |
| 4 | Complex Scenarios — alerts, frames, multiple windows | 65 min |
| 5 | Writing Clean Tests — Page Object Model pattern | 50 min |
| 6 | Building a Framework — config, reports, multi-browser | 60 min |
| 7 | Advanced & Career Ready — Grid, debugging, logging | 45 min |

**Total: ~8 hours of hands-on learning**

---

### ✅ What You Need Before We Start

**You need:**
- A computer (Windows, Mac, or Linux)
- Google Chrome installed
- An internet connection
- About 15 minutes per lesson

**You do NOT need:**
- Any coding experience whatsoever
- Java knowledge (Chapter 1 starts from zero)
- Any automation background

---

### 💡 How to Use This Course

1. **Read each lesson** — understand the *why*, not just the *how*
2. **Try the exercise** — write the code yourself (don't just copy-paste!)
3. **Use the AI chat** — if you're stuck, ask the AI anything — it's free
4. **Mark complete** — tick off lessons as you go, watch your progress grow
5. **Move at your own pace** — no deadlines, no pressure

> 💡 **Tip**: You don't need to memorise everything. Experienced engineers Google syntax daily. What matters is understanding *why* each piece exists. The syntax you look up later.

---

### 🧑‍💼 What Changes When You Learn This Skill

| Your World Today | After This Course |
|--------|-------|
| Testing login manually every sprint | One click runs 200 test cases |
| "Automation is for developers" | You write production-quality test code |
| Job title: Manual QA Tester | Eligible for: SDET / Automation Engineer |
| Spending evenings on regression | Automation runs overnight, you review in morning |

**You're not replacing yourself. You're upgrading yourself.**

---

Ready? Mark this lesson complete and head to Chapter 1: Java for Manual Testers. 🚀

The first lesson starts with *why* Java instead of jumping straight into syntax — because understanding the reason makes everything else stick.
`,
        exercise: {
          title: 'Reflection: Your Manual Testing to Automation Bridge',
          task: 'Think about 3 test cases you currently run manually every sprint. Write them out as plain English steps (like: "1. Open browser. 2. Go to login page. 3. Type username..."). This is the first step — you already know what the automation needs to do. By Chapter 2, you\'ll be writing this in code.',
          hints: [
            'Think about your most repetitive test scenarios — the ones you dread doing manually',
            'Write them as simple numbered steps, no technical jargon needed',
            'Keep each step as one action: one click, one input, one assertion'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'What does Selenium WebDriver primarily do?',
            options: [
              'Generates test reports automatically',
              'Controls a real web browser from code',
              'Replaces manual testing entirely',
              'Finds bugs in your application code'
            ],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'You need prior coding experience to start Chapter 1 of this course.',
            answer: false
          },
          {
            type: 'fillin',
            q: 'Selenium WebDriver controls a real _______ from your Java code.',
            answer: 'browser'
          },
          {
            type: 'mcq',
            q: 'What is the main advantage of automation over manual testing?',
            options: [
              'Automation tests are always more accurate than manual testers',
              'Automation completely eliminates the need for manual testing',
              'Automated tests can run repeatedly and quickly without human effort',
              'Automation is cheaper to set up than manual testing'
            ],
            answer: 2
          },
          {
            type: 'truefalse',
            q: 'The Page Object Model (POM) is a design pattern you will build in this course.',
            answer: true
          }
        ]
      }
    ]
  },
  // ── Chapter 1: Java Essentials ───────────────────────────────
  {
    id: 'module-1',
    title: 'Java Essentials for Selenium',
    icon: '☕',
    lessons: [
      {
        id: 'l1',
        title: 'Project Setup: Java 21 + Maven',
        type: 'practical',
        duration: '20 min',
        whatYoullLearn: [
          'Install Java 21 and verify it works in terminal',
          'Install Maven and understand what it does',
          'Create a Maven project structure from the command line',
          'Write a pom.xml with Selenium 4 and TestNG dependencies',
          'Run mvn clean install to download all dependencies'
        ],
        quiz: [
          { type: 'mcq', q: 'Which command verifies Java is installed correctly?', options: ['java --check', 'java -version', 'javac --test', 'java --verify'], answer: 1 },
          { type: 'truefalse', q: 'Maven automatically downloads project dependencies listed in pom.xml.', answer: true },
          { type: 'fillin', q: 'The Maven project descriptor file is called _______.xml', answer: 'pom' },
          { type: 'mcq', q: 'What does WebDriverManager do?', options: ['Creates WebDriver instances', 'Auto-downloads the correct browser driver', 'Opens Chrome browser windows', 'Generates test reports'], answer: 1 }
        ],
        content: `
## Setting Up Your Environment

### Install Java 21
Download from: https://adoptium.net (Eclipse Temurin 21 LTS)

Verify install:
\`\`\`bash
java -version
# java version "21.x.x"
\`\`\`

### Install Maven
Download from: https://maven.apache.org/download.cgi

Verify:
\`\`\`bash
mvn -version
\`\`\`

### Create Maven Project
\`\`\`bash
mvn archetype:generate \\
  -DgroupId=com.training \\
  -DartifactId=selenium-training \\
  -DarchetypeArtifactId=maven-archetype-quickstart \\
  -DarchetypeVersion=1.5 \\
  -DinteractiveMode=false
\`\`\`

### pom.xml — Add Selenium 4 + TestNG
\`\`\`xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.training</groupId>
  <artifactId>selenium-training</artifactId>
  <version>1.0-SNAPSHOT</version>

  <properties>
    <maven.compiler.source>21</maven.compiler.source>
    <maven.compiler.target>21</maven.compiler.target>
    <selenium.version>4.21.0</selenium.version>
    <testng.version>7.10.2</testng.version>
  </properties>

  <dependencies>
    <!-- Selenium WebDriver -->
    <dependency>
      <groupId>org.seleniumhq.selenium</groupId>
      <artifactId>selenium-java</artifactId>
      <version>\${selenium.version}</version>
    </dependency>

    <!-- WebDriverManager — auto downloads browser drivers -->
    <dependency>
      <groupId>io.github.bonigarcia</groupId>
      <artifactId>webdrivermanager</artifactId>
      <version>5.8.0</version>
    </dependency>

    <!-- TestNG -->
    <dependency>
      <groupId>org.testng</groupId>
      <artifactId>testng</artifactId>
      <version>\${testng.version}</version>
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
</project>
\`\`\`

Run \`mvn clean install\` to download dependencies.
`,
        exercise: {
          title: 'Exercise: Verify Setup',
          task: 'Create the Maven project above, add the pom.xml dependencies, and run `mvn dependency:resolve` successfully.',
          hints: ['Make sure JAVA_HOME is set to Java 21', 'Maven must be on your PATH', 'Run `mvn -version` to confirm Maven is working']
        }
      },
      {
        id: 'l2',
        title: 'Java Variables & Data Types',
        type: 'practical',
        duration: '15 min',
        whatYoullLearn: [
          'Declare String, int, boolean, and List variables in Java',
          'Use the var keyword for type inference (Java 10+)',
          'Work with String methods like contains(), equals(), and trim()',
          'Store test data in Map<String, String> key-value pairs',
          'Understand why types matter in Selenium test code'
        ],
        quiz: [
          { type: 'mcq', q: 'Which data type stores URLs and element selectors in Selenium tests?', options: ['int', 'boolean', 'String', 'double'], answer: 2 },
          { type: 'truefalse', q: 'The var keyword in Java requires you to explicitly state the type.', answer: false },
          { type: 'fillin', q: 'To check if a String contains another String, use the _______ method.', answer: 'contains' }
        ],
        content: `
## Java Variables for Test Automation

The types you'll use most in Selenium tests:

\`\`\`java
// String — URLs, selectors, text values
String url = "https://example.com";
String xpath = "//button[@id='submit']";

// int — timeouts, counts, indices
int timeout = 10;
int itemCount = 5;

// boolean — conditions, flags
boolean isVisible = true;
boolean testPassed = false;

// List — collections of WebElements
import java.util.List;
List<String> menuItems = new ArrayList<>();

// Map — key-value test data
import java.util.Map;
Map<String, String> userData = new HashMap<>();
userData.put("username", "testuser");
userData.put("password", "pass123");
\`\`\`

### var keyword (Java 10+)
\`\`\`java
var driver = new ChromeDriver();          // inferred: ChromeDriver
var elements = driver.findElements(By.tagName("a")); // inferred: List<WebElement>
\`\`\`

### String operations used constantly in tests:
\`\`\`java
String title = driver.getTitle();
title.contains("Login")       // true/false
title.equals("Login Page")    // exact match
title.trim()                  // remove whitespace
title.toLowerCase()           // "login page"
String.format("User: %s", username) // interpolation
\`\`\`
`,
        exercise: {
          title: 'Exercise: Test Data Variables',
          task: 'Write a Java class `TestData.java` that declares variables for: a login URL, a username, a password, a timeout in seconds, and a Map of form fields. Print all values to the console.',
          solution: `public class TestData {
    public static void main(String[] args) {
        String loginUrl = "https://example.com/login";
        String username = "testuser@example.com";
        String password  = "SecurePass123";
        int timeoutSeconds = 10;

        Map<String, String> formFields = new HashMap<>();
        formFields.put("email", username);
        formFields.put("password", password);

        System.out.println("URL: " + loginUrl);
        System.out.println("Timeout: " + timeoutSeconds + "s");
        formFields.forEach((k, v) -> System.out.println(k + " = " + v));
    }
}`
        }
      },
      {
        id: 'l3',
        title: 'Control Flow & Loops',
        type: 'practical',
        duration: '15 min',
        content: `
## Control Flow in Test Automation

### if/else — conditional assertions
\`\`\`java
String status = element.getText();

if (status.equals("Active")) {
    System.out.println("✅ User is active");
} else if (status.equals("Pending")) {
    System.out.println("⚠️ User is pending");
} else {
    throw new AssertionError("Unexpected status: " + status);
}
\`\`\`

### for loop — iterate over elements
\`\`\`java
List<WebElement> rows = driver.findElements(By.cssSelector("table tbody tr"));

for (int i = 0; i < rows.size(); i++) {
    System.out.println("Row " + (i+1) + ": " + rows.get(i).getText());
}

// Enhanced for-each (preferred)
for (WebElement row : rows) {
    if (row.getText().contains("John")) {
        row.findElement(By.linkText("Edit")).click();
        break;
    }
}
\`\`\`

### while — wait loops (use WebDriverWait instead in real tests)
\`\`\`java
int attempts = 0;
while (attempts < 3) {
    try {
        driver.findElement(By.id("result")).click();
        break;
    } catch (NoSuchElementException e) {
        attempts++;
        Thread.sleep(1000);
    }
}
\`\`\`

### switch — test environment routing
\`\`\`java
String env = System.getProperty("env", "staging");
String baseUrl = switch (env) {
    case "prod"    -> "https://app.example.com";
    case "staging" -> "https://staging.example.com";
    case "local"   -> "http://localhost:8080";
    default        -> throw new IllegalArgumentException("Unknown env: " + env);
};
\`\`\`
`,
        exercise: {
          title: 'Exercise: Table Data Validator',
          task: 'Write a method that takes a List<String> of table cell values and prints "PASS" if all values are non-empty, or "FAIL: row X is empty" for each empty row.',
          solution: `public void validateTableData(List<String> cells) {
    boolean allPassed = true;
    for (int i = 0; i < cells.size(); i++) {
        if (cells.get(i) == null || cells.get(i).trim().isEmpty()) {
            System.out.println("FAIL: row " + (i + 1) + " is empty");
            allPassed = false;
        }
    }
    if (allPassed) System.out.println("PASS: all rows have data");
}`
        }
      },
      {
        id: 'l4',
        title: 'OOP: Classes, Objects & Inheritance',
        type: 'practical',
        duration: '20 min',
        content: `
## OOP Concepts You Need for Selenium

### Classes and Objects
\`\`\`java
// A Page class encapsulates a web page's elements and actions
public class LoginPage {
    private WebDriver driver;

    // Constructor — dependency injection
    public LoginPage(WebDriver driver) {
        this.driver = driver;
    }

    // Methods = actions on the page
    public void enterEmail(String email) {
        driver.findElement(By.id("email")).sendKeys(email);
    }

    public void enterPassword(String password) {
        driver.findElement(By.id("password")).sendKeys(password);
    }

    public void clickLogin() {
        driver.findElement(By.id("btn-login")).click();
    }

    // Fluent method chaining — returns HomePage after login
    public HomePage login(String email, String password) {
        enterEmail(email);
        enterPassword(password);
        clickLogin();
        return new HomePage(driver);
    }
}
\`\`\`

### Inheritance — Base Test class
\`\`\`java
// Every test class extends this
public class BaseTest {
    protected WebDriver driver;

    @BeforeMethod
    public void setUp() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
    }

    @AfterMethod
    public void tearDown() {
        if (driver != null) driver.quit();
    }
}

// Test class inherits driver setup/teardown
public class LoginTest extends BaseTest {
    @Test
    public void testSuccessfulLogin() {
        driver.get("https://example.com/login");
        LoginPage loginPage = new LoginPage(driver);
        HomePage home = loginPage.login("user@test.com", "pass123");
        // assertions...
    }
}
\`\`\`

### Interfaces — for flexible design
\`\`\`java
public interface Loadable {
    void load();
    boolean isLoaded();
}

public class DashboardPage implements Loadable {
    private WebDriver driver;
    private String url = "https://app.example.com/dashboard";

    public DashboardPage(WebDriver driver) { this.driver = driver; }

    @Override
    public void load() { driver.get(url); }

    @Override
    public boolean isLoaded() {
        return driver.getCurrentUrl().contains("dashboard");
    }
}
\`\`\`
`,
        exercise: {
          title: 'Exercise: Build a BasePage class',
          task: 'Create an abstract `BasePage` class with: a `driver` field, a constructor taking WebDriver, a `waitForElement(By locator)` method using WebDriverWait, and a `isElementVisible(By locator)` method that returns boolean.',
          solution: `public abstract class BasePage {
    protected WebDriver driver;
    protected WebDriverWait wait;

    public BasePage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    protected WebElement waitForElement(By locator) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
    }

    protected boolean isElementVisible(By locator) {
        try {
            return driver.findElement(locator).isDisplayed();
        } catch (NoSuchElementException e) {
            return false;
        }
    }
}`
        }
      }
    ]
  },
  {
    id: 'module-2',
    title: 'Selenium 4 Basics',
    icon: '🔬',
    lessons: [
      {
        id: 'l5',
        title: 'Your First Selenium Script',
        type: 'practical',
        duration: '20 min',
        whatYoullLearn: [
          'Write a complete Selenium test class with TestNG annotations',
          'Use WebDriverManager to automatically download ChromeDriver',
          'Navigate to a URL and assert the page title',
          'Find elements, type into them, and submit forms',
          'Run a test from the command line with mvn test'
        ],
        quiz: [
          { type: 'mcq', q: 'Which annotation sets up the WebDriver before each test method?', options: ['@Test', '@BeforeClass', '@BeforeMethod', '@BeforeSuite'], answer: 2 },
          { type: 'truefalse', q: 'driver.quit() should always be called after a test to close the browser.', answer: true },
          { type: 'fillin', q: 'To navigate to a URL in Selenium, use driver._______(url)', answer: 'get' },
          { type: 'mcq', q: 'What does driver.getTitle() return?', options: ['The page URL', 'The page HTML source', 'The browser window title', 'The current user session'], answer: 2 }
        ],
        content: `
## First Working Selenium Test

### Step 1: Create the test class
\`\`\`java
package com.training.tests;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.time.Duration;

public class FirstTest {

    private WebDriver driver;

    @BeforeMethod
    public void setUp() {
        // WebDriverManager downloads chromedriver automatically
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
    }

    @Test
    public void testGoogleTitle() {
        // 1. Navigate
        driver.get("https://www.google.com");

        // 2. Assert title
        String title = driver.getTitle();
        Assert.assertTrue(title.contains("Google"), "Title should contain 'Google', got: " + title);

        // 3. Find the search box and type
        WebElement searchBox = driver.findElement(By.name("q"));
        searchBox.sendKeys("Selenium WebDriver Java");
        searchBox.submit();

        // 4. Wait for results and assert URL changed
        Assert.assertTrue(driver.getCurrentUrl().contains("search"),
            "Should be on search results page");

        System.out.println("✅ Test passed! Page title: " + driver.getTitle());
    }

    @AfterMethod
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
\`\`\`

### Run it:
\`\`\`bash
mvn test -Dtest=FirstTest
\`\`\`

### Selenium 4 new features used:
- **Relative locators**: \`driver.findElement(RelativeLocator.with(By.tagName("input")).below(By.id("label")))\`
- **CDP (Chrome DevTools Protocol)**: Network throttling, console logs
- **BiDi API**: New event-based browser interaction
`,
        exercise: {
          title: 'Exercise: Wikipedia Search Test',
          task: 'Write a test that: opens Wikipedia, searches for "Selenium software", clicks the first result, and asserts the page title contains "Selenium".',
          solution: `@Test
public void testWikipediaSearch() {
    driver.get("https://www.wikipedia.org");

    WebElement searchInput = driver.findElement(By.id("searchInput"));
    searchInput.sendKeys("Selenium software");
    searchInput.submit();

    // Wait for results page
    new WebDriverWait(driver, Duration.ofSeconds(10))
        .until(ExpectedConditions.titleContains("Selenium"));

    Assert.assertTrue(driver.getTitle().contains("Selenium"),
        "Page title should contain Selenium, got: " + driver.getTitle());

    System.out.println("Current page: " + driver.getTitle());
}`
        }
      },
      {
        id: 'l6',
        title: 'Locator Strategies (By)',
        type: 'practical',
        duration: '25 min',
        content: `
## Finding Elements — 8 Strategies

### Priority order (most to least reliable):
1. **By.id** — fastest, most stable
2. **By.name** — good for form fields
3. **By.cssSelector** — flexible, fast
4. **By.xpath** — most powerful, use when others fail

### Examples on a login form:
\`\`\`java
// ✅ Best — By ID
WebElement emailField = driver.findElement(By.id("email"));

// ✅ Good — By Name
WebElement passField = driver.findElement(By.name("password"));

// ✅ CSS — class, attribute, hierarchy
WebElement btn = driver.findElement(By.cssSelector("button.btn-primary"));
WebElement input = driver.findElement(By.cssSelector("form#login input[type='email']"));
WebElement nth = driver.findElement(By.cssSelector("ul.menu li:nth-child(3)"));

// ✅ XPath — text content, complex conditions
WebElement link = driver.findElement(By.xpath("//a[text()='Forgot Password?']"));
WebElement row  = driver.findElement(By.xpath("//tr[td[text()='John']]"));
WebElement icon = driver.findElement(By.xpath("//button[contains(@class,'delete') and @data-id='42']"));

// By LinkText & PartialLinkText
WebElement signIn = driver.findElement(By.linkText("Sign In"));
WebElement forgot = driver.findElement(By.partialLinkText("Forgot"));

// By TagName — get all of a type
List<WebElement> allLinks = driver.findElements(By.tagName("a"));

// By ClassName
WebElement error = driver.findElement(By.className("error-message"));
\`\`\`

### CSS Cheat Sheet:
\`\`\`css
#myId                    /* id="myId" */
.myClass                 /* class="myClass" */
input[type='text']       /* attribute */
div > p                  /* direct child */
div p                    /* any descendant */
li:first-child           /* first li */
li:last-child            /* last li */
li:nth-child(2)          /* 2nd li */
input:not([disabled])    /* not disabled */
\`\`\`

### XPath Cheat Sheet:
\`\`\`xpath
//tag                     absolute search
//tag[@attr='val']        attribute match
//tag[text()='val']       exact text
//tag[contains(@attr,'x')] partial attribute
//tag[contains(text(),'x')] partial text
//parent/child            direct child
//ancestor//descendant    any descendant
(//tag)[2]                second match
\`\`\`
`,
        exercise: {
          title: 'Exercise: Locator Challenge',
          task: 'On https://demoqa.com/text-box — write locators to find: the Full Name input (by id), the Email input (by attribute), the Submit button (by CSS), and the output box (by xpath using partial id).',
          solution: `// Full Name — by ID
By fullName = By.id("userName");

// Email — by CSS attribute
By email = By.cssSelector("input[placeholder='name@example.com']");

// Submit button — by CSS
By submit = By.cssSelector("#submit");

// Output — by XPath partial ID
By output = By.xpath("//*[contains(@id,'output')]");

// Interact:
driver.findElement(fullName).sendKeys("Saif Afzal");
driver.findElement(email).sendKeys("saif@test.com");
driver.findElement(submit).click();
Assert.assertTrue(driver.findElement(output).isDisplayed());`
        }
      },
      {
        id: 'l7',
        title: 'Element Interactions',
        type: 'practical',
        duration: '20 min',
        content: `
## Interacting with Web Elements

### Input Fields
\`\`\`java
WebElement field = driver.findElement(By.id("search"));

field.sendKeys("Selenium");           // type text
field.clear();                        // clear existing text
field.sendKeys(Keys.CONTROL + "a");   // Ctrl+A select all
field.sendKeys(Keys.ENTER);           // press Enter
field.sendKeys(Keys.TAB);             // press Tab
\`\`\`

### Buttons & Links
\`\`\`java
driver.findElement(By.id("submit")).click();
driver.findElement(By.linkText("Home")).click();

// Right-click (context menu)
Actions actions = new Actions(driver);
actions.contextClick(element).perform();

// Double-click
actions.doubleClick(element).perform();
\`\`\`

### Dropdowns (Select)
\`\`\`java
WebElement dropdown = driver.findElement(By.id("country"));
Select select = new Select(dropdown);

select.selectByVisibleText("India");
select.selectByValue("IN");
select.selectByIndex(2);

// Get selected option
String selected = select.getFirstSelectedOption().getText();

// Multi-select
select.selectByVisibleText("Option A");
select.selectByVisibleText("Option B");
List<WebElement> selectedOptions = select.getAllSelectedOptions();
\`\`\`

### Checkboxes & Radio Buttons
\`\`\`java
WebElement checkbox = driver.findElement(By.id("agree"));

// Check only if not already checked
if (!checkbox.isSelected()) {
    checkbox.click();
}

// Assert state
Assert.assertTrue(checkbox.isSelected(), "Checkbox should be checked");

// Radio button
driver.findElement(By.cssSelector("input[type='radio'][value='male']")).click();
\`\`\`

### Get Element Info
\`\`\`java
element.getText()             // visible text
element.getAttribute("href")  // attribute value
element.getAttribute("value") // input field value
element.isDisplayed()         // visible?
element.isEnabled()           // enabled?
element.isSelected()          // checked/selected?
element.getTagName()          // "input", "div", etc.
element.getCssValue("color")  // CSS property
element.getRect()             // position and size
\`\`\`
`,
        exercise: {
          title: 'Exercise: Form Filler',
          task: 'On https://demoqa.com/automation-practice-form — fill in: First Name, Last Name, select Gender radio, enter Mobile number, select a Subject from the dropdown, and click Submit.',
          solution: `driver.get("https://demoqa.com/automation-practice-form");

driver.findElement(By.id("firstName")).sendKeys("Saif");
driver.findElement(By.id("lastName")).sendKeys("Afzal");

// Gender radio
driver.findElement(By.cssSelector("input[value='Male']")).click();

driver.findElement(By.id("userNumber")).sendKeys("9876543210");

// Subject autocomplete
WebElement subject = driver.findElement(By.id("subjectsInput"));
subject.sendKeys("Java");
subject.sendKeys(Keys.ENTER);

// Scroll to submit and click
WebElement submit = driver.findElement(By.id("submit"));
((JavascriptExecutor)driver).executeScript("arguments[0].scrollIntoView(true)", submit);
submit.click();

// Assert modal appeared
Assert.assertTrue(
    driver.findElement(By.id("example-modal-sizes-title-lg")).isDisplayed()
);`
        }
      },
      {
        id: 'l8',
        title: 'Waits — Implicit, Explicit & Fluent',
        type: 'practical',
        duration: '25 min',
        content: `
## Wait Strategies — Critical for Reliable Tests

### The Problem: Dynamic Pages
Elements load asynchronously. Without waits, tests fail with NoSuchElementException.

### ❌ Never use Thread.sleep()
\`\`\`java
Thread.sleep(3000); // BAD — wastes time, still breaks
\`\`\`

### ✅ Implicit Wait — global default
\`\`\`java
// Set once in setUp()
driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
// Selenium polls for 10s before throwing NoSuchElementException
\`\`\`

### ✅ Explicit Wait — wait for specific condition
\`\`\`java
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));

// Wait for element visible
WebElement el = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("result")));

// Wait for clickable
WebElement btn = wait.until(ExpectedConditions.elementToBeClickable(By.id("submit")));

// Wait for text
wait.until(ExpectedConditions.textToBePresentInElement(el, "Success"));

// Wait for URL
wait.until(ExpectedConditions.urlContains("dashboard"));

// Wait for title
wait.until(ExpectedConditions.titleContains("Home"));

// Wait for element to disappear
wait.until(ExpectedConditions.invisibilityOfElementLocated(By.className("spinner")));

// Wait for count
wait.until(ExpectedConditions.numberOfElementsToBeMoreThan(By.cssSelector("li"), 3));

// Custom condition — wait for attribute
wait.until(driver -> driver.findElement(By.id("status"))
    .getAttribute("class").contains("loaded"));
\`\`\`

### ✅ Fluent Wait — fine-grained control
\`\`\`java
Wait<WebDriver> fluentWait = new FluentWait<>(driver)
    .withTimeout(Duration.ofSeconds(30))
    .pollingEvery(Duration.ofSeconds(2))
    .ignoring(NoSuchElementException.class)
    .ignoring(StaleElementReferenceException.class);

WebElement element = fluentWait.until(driver ->
    driver.findElement(By.id("data-table"))
);
\`\`\`

### Rule of thumb:
| Scenario | Use |
|---|---|
| All elements on site need time | Implicit |
| Specific element / condition | Explicit |
| Retry with custom poll interval | Fluent |
`,
        exercise: {
          title: 'Exercise: Wait for AJAX Result',
          task: 'On https://the-internet.herokuapp.com/dynamic_loading/1 — click Start, then use an explicit wait to wait for the "Hello World!" text to appear, and assert it.',
          solution: `driver.get("https://the-internet.herokuapp.com/dynamic_loading/1");

driver.findElement(By.cssSelector("#start button")).click();

WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));

// Wait for loading to finish
wait.until(ExpectedConditions.invisibilityOfElementLocated(By.id("loading")));

// Wait for result text
WebElement result = wait.until(
    ExpectedConditions.visibilityOfElementLocated(By.id("finish"))
);

Assert.assertEquals(result.getText(), "Hello World!");`
        }
      }
    ]
  },
  {
    id: 'module-3',
    title: 'Intermediate Selenium',
    icon: '⚙️',
    lessons: [
      {
        id: 'l9',
        title: 'Handling Alerts, Frames & Windows',
        type: 'practical',
        duration: '25 min',
        content: `
## Alerts
\`\`\`java
// Simple alert
Alert alert = driver.switchTo().alert();
String msg = alert.getText();
alert.accept();     // click OK
alert.dismiss();    // click Cancel

// Prompt — type text before accepting
alert.sendKeys("My input");
alert.accept();

// Wait for alert first
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
alert = wait.until(ExpectedConditions.alertIsPresent());
\`\`\`

## iFrames
\`\`\`java
// Switch by index
driver.switchTo().frame(0);

// Switch by name or id
driver.switchTo().frame("frameName");

// Switch by WebElement
WebElement frameEl = driver.findElement(By.cssSelector("iframe#editor"));
driver.switchTo().frame(frameEl);

// Interact inside frame
driver.findElement(By.id("insideFrame")).click();

// ALWAYS switch back to main page
driver.switchTo().defaultContent();

// Nested frames
driver.switchTo().frame("outer");
driver.switchTo().frame("inner");
driver.switchTo().parentFrame(); // one level up
\`\`\`

## Multiple Windows / Tabs
\`\`\`java
String mainWindow = driver.getWindowHandle();

// Click opens new tab
driver.findElement(By.linkText("Open New Tab")).click();

// Get all handles
Set<String> allWindows = driver.getWindowHandles();

// Switch to new window
for (String handle : allWindows) {
    if (!handle.equals(mainWindow)) {
        driver.switchTo().window(handle);
        break;
    }
}

System.out.println("New tab title: " + driver.getTitle());

// Close new tab and switch back
driver.close();
driver.switchTo().window(mainWindow);
\`\`\`

## Selenium 4 — Open new tab/window programmatically
\`\`\`java
// Open new tab
driver.switchTo().newWindow(WindowType.TAB);
driver.get("https://example.com");

// Open new browser window
driver.switchTo().newWindow(WindowType.WINDOW);
\`\`\`
`,
        exercise: {
          title: 'Exercise: Frames on The Internet',
          task: 'On https://the-internet.herokuapp.com/frames — navigate to the Nested Frames page, switch to the top frame, get its text, then switch to the bottom frame and get its text. Assert both.',
          solution: `driver.get("https://the-internet.herokuapp.com/nested_frames");

// Switch to top frame
driver.switchTo().frame("frame-top");
driver.switchTo().frame("frame-left");
String leftText = driver.findElement(By.tagName("body")).getText();

driver.switchTo().defaultContent();
driver.switchTo().frame("frame-top");
driver.switchTo().frame("frame-middle");
String middleText = driver.findElement(By.tagName("body")).getText();

driver.switchTo().defaultContent();
driver.switchTo().frame("frame-bottom");
String bottomText = driver.findElement(By.tagName("body")).getText();

Assert.assertEquals(leftText, "LEFT");
Assert.assertEquals(middleText, "MIDDLE");
Assert.assertEquals(bottomText, "BOTTOM");`
        }
      },
      {
        id: 'l10',
        title: 'JavaScript Executor',
        type: 'practical',
        duration: '20 min',
        content: `
## JavascriptExecutor — When Selenium Can't Reach It

\`\`\`java
JavascriptExecutor js = (JavascriptExecutor) driver;
\`\`\`

### Scroll operations
\`\`\`java
// Scroll to bottom of page
js.executeScript("window.scrollTo(0, document.body.scrollHeight)");

// Scroll element into view
WebElement el = driver.findElement(By.id("footer"));
js.executeScript("arguments[0].scrollIntoView(true)", el);

// Scroll by pixels
js.executeScript("window.scrollBy(0, 500)");

// Scroll to top
js.executeScript("window.scrollTo(0, 0)");
\`\`\`

### Click hidden/disabled elements
\`\`\`java
WebElement btn = driver.findElement(By.id("hiddenButton"));
js.executeScript("arguments[0].click()", btn);
\`\`\`

### Set input value (when sendKeys doesn't work)
\`\`\`java
WebElement dateInput = driver.findElement(By.id("datePicker"));
js.executeScript("arguments[0].value = '2025-01-15'", dateInput);
\`\`\`

### Get page info
\`\`\`java
String title    = (String) js.executeScript("return document.title");
Long scrollPos  = (Long) js.executeScript("return window.pageYOffset");
Boolean visible = (Boolean) js.executeScript(
    "var rect = arguments[0].getBoundingClientRect();" +
    "return rect.top >= 0 && rect.bottom <= window.innerHeight;", element);
\`\`\`

### Highlight element (useful for debugging)
\`\`\`java
public void highlight(WebElement element) {
    js.executeScript(
        "arguments[0].style.border='3px solid red'", element);
}
\`\`\`

### Async JavaScript (for AJAX)
\`\`\`java
Object result = js.executeAsyncScript(
    "var callback = arguments[arguments.length - 1];" +
    "setTimeout(function() { callback('done'); }, 2000);"
);
\`\`\`
`,
        exercise: {
          title: 'Exercise: Scroll & Interact',
          task: 'On https://the-internet.herokuapp.com/infinite_scroll — use JavascriptExecutor to scroll down 3 times, each time waiting 1s, then count how many paragraphs are loaded and assert count > 3.',
          solution: `driver.get("https://the-internet.herokuapp.com/infinite_scroll");
JavascriptExecutor js = (JavascriptExecutor) driver;

for (int i = 0; i < 3; i++) {
    js.executeScript("window.scrollTo(0, document.body.scrollHeight)");
    Thread.sleep(1500); // acceptable here since we're triggering load
}

List<WebElement> paragraphs = driver.findElements(By.cssSelector(".jscroll-added"));
System.out.println("Loaded paragraphs: " + paragraphs.size());
Assert.assertTrue(paragraphs.size() > 3, "Should have loaded more than 3 paragraphs");`
        }
      },
      {
        id: 'l11',
        title: 'Actions Class — Hover, Drag & Drop',
        type: 'practical',
        duration: '20 min',
        content: `
## Advanced Mouse & Keyboard — Actions API

\`\`\`java
Actions actions = new Actions(driver);
\`\`\`

### Hover / Mouse Over
\`\`\`java
WebElement menu = driver.findElement(By.id("menu-products"));
actions.moveToElement(menu).perform();

// Sub-menu appears — click item
WebElement subItem = driver.findElement(By.linkText("Laptops"));
actions.moveToElement(menu).click(subItem).perform();
\`\`\`

### Drag and Drop
\`\`\`java
WebElement source = driver.findElement(By.id("draggable"));
WebElement target = driver.findElement(By.id("droppable"));

// Method 1 — dragAndDrop
actions.dragAndDrop(source, target).perform();

// Method 2 — manual (more reliable for some sites)
actions.clickAndHold(source)
       .moveToElement(target)
       .release()
       .perform();

// Method 3 — drag by offset
actions.dragAndDropBy(source, 200, 100).perform();
\`\`\`

### Keyboard shortcuts
\`\`\`java
WebElement field = driver.findElement(By.id("text"));

// Select All + Copy
actions.click(field)
       .keyDown(Keys.CONTROL)
       .sendKeys("a")
       .keyUp(Keys.CONTROL)
       .keyDown(Keys.CONTROL)
       .sendKeys("c")
       .keyUp(Keys.CONTROL)
       .perform();

// Select text with Shift+End
actions.click(field)
       .keyDown(Keys.SHIFT)
       .sendKeys(Keys.END)
       .keyUp(Keys.SHIFT)
       .perform();
\`\`\`

### Canvas / Slider interactions
\`\`\`java
WebElement slider = driver.findElement(By.id("slider"));

// Move slider right by 50 pixels
actions.clickAndHold(slider)
       .moveByOffset(50, 0)
       .release()
       .perform();
\`\`\`
`,
        exercise: {
          title: 'Exercise: Hover Menu',
          task: 'On https://the-internet.herokuapp.com/hovers — hover over each user photo, capture the displayed username text, and assert each username follows the format "name: user[N]".',
          solution: `driver.get("https://the-internet.herokuapp.com/hovers");
Actions actions = new Actions(driver);

List<WebElement> figures = driver.findElements(By.cssSelector(".figure"));

for (int i = 0; i < figures.size(); i++) {
    actions.moveToElement(figures.get(i)).perform();

    WebElement caption = figures.get(i).findElement(By.cssSelector(".figcaption h5"));
    String text = caption.getText();
    System.out.println("User " + (i+1) + ": " + text);
    Assert.assertTrue(text.contains("user" + (i+1)),
        "Expected user" + (i+1) + " in caption, got: " + text);
}`
        }
      }
    ]
  },
  {
    id: 'module-4',
    title: 'Design Patterns',
    icon: '🏗️',
    lessons: [
      {
        id: 'l12',
        title: 'Page Object Model (POM)',
        type: 'practical',
        duration: '30 min',
        whatYoullLearn: [
          'Understand why the Page Object Model exists and when to use it',
          'Create a BasePage class with shared wait utilities',
          'Build a page class that encapsulates locators and actions',
          'Write test classes that use page objects — no locators visible',
          'Return page objects from methods that navigate to new pages'
        ],
        quiz: [
          { type: 'mcq', q: 'What is the main benefit of the Page Object Model?', options: ['Tests run faster', 'Locators are defined once — change one class to fix all tests', 'You need less Java knowledge', 'Tests are easier to run in parallel'], answer: 1 },
          { type: 'truefalse', q: 'Assertions (Assert.assertEquals) should be placed inside Page classes.', answer: false },
          { type: 'fillin', q: 'The Page Object Model is a design _______ used to organise test code.', answer: 'pattern' },
          { type: 'mcq', q: 'A method like loginAs() in LoginPage should return what?', options: ['void always', 'A String with the result', 'Another page object (e.g. DashboardPage)', 'A boolean indicating success'], answer: 2 }
        ],
        content: `
## Page Object Model — Industry Standard Pattern

### Why POM?
Without POM: selectors scattered everywhere → 1 UI change = 50 test failures
With POM: selectors in 1 class → 1 UI change = fix 1 class

### Project Structure:
\`\`\`
src/
  main/java/com/training/
    pages/
      BasePage.java
      LoginPage.java
      HomePage.java
      ProductPage.java
  test/java/com/training/
    tests/
      LoginTest.java
      ProductTest.java
\`\`\`

### BasePage.java
\`\`\`java
package com.training.pages;

import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.*;
import java.time.Duration;

public abstract class BasePage {
    protected WebDriver driver;
    protected WebDriverWait wait;

    public BasePage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    protected WebElement waitFor(By locator) {
        return wait.until(ExpectedConditions.elementToBeClickable(locator));
    }

    protected boolean isVisible(By locator) {
        try {
            return driver.findElement(locator).isDisplayed();
        } catch (NoSuchElementException e) { return false; }
    }

    protected void click(By locator)  { waitFor(locator).click(); }
    protected void type(By locator, String text) {
        WebElement el = waitFor(locator);
        el.clear();
        el.sendKeys(text);
    }
    protected String getText(By locator) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(locator)).getText();
    }
}
\`\`\`

### LoginPage.java
\`\`\`java
package com.training.pages;

import org.openqa.selenium.*;

public class LoginPage extends BasePage {

    // Locators — only place in the codebase where these exist
    private final By emailInput   = By.id("email");
    private final By passwordInput = By.id("password");
    private final By loginButton  = By.cssSelector("button[type='submit']");
    private final By errorMessage = By.className("alert-danger");

    public LoginPage(WebDriver driver) { super(driver); }

    public LoginPage open(String baseUrl) {
        driver.get(baseUrl + "/login");
        return this;
    }

    public HomePage loginAs(String email, String password) {
        type(emailInput, email);
        type(passwordInput, password);
        click(loginButton);
        return new HomePage(driver);
    }

    public LoginPage loginExpectingFailure(String email, String password) {
        type(emailInput, email);
        type(passwordInput, password);
        click(loginButton);
        return this;
    }

    public String getErrorMessage() { return getText(errorMessage); }
    public boolean hasError()       { return isVisible(errorMessage); }
}
\`\`\`

### LoginTest.java
\`\`\`java
package com.training.tests;

import com.training.pages.LoginPage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class LoginTest extends BaseTest {

    @Test
    public void testValidLogin() {
        LoginPage loginPage = new LoginPage(driver).open(BASE_URL);
        var homePage = loginPage.loginAs("user@test.com", "Password1");
        Assert.assertTrue(homePage.isLoaded(), "Should redirect to homepage");
    }

    @Test
    public void testInvalidLogin() {
        LoginPage loginPage = new LoginPage(driver).open(BASE_URL);
        loginPage.loginExpectingFailure("wrong@test.com", "badpass");
        Assert.assertTrue(loginPage.hasError());
        Assert.assertEquals(loginPage.getErrorMessage(), "Invalid email or password");
    }
}
\`\`\`
`,
        exercise: {
          title: 'Exercise: Build POM for The Internet',
          task: 'Build a full POM for https://the-internet.herokuapp.com/login — LoginPage with locators, login() method, getFlashMessage() method. Write 2 tests: valid login (admin/admin) and invalid login with assertion on error message.',
          solution: `// LoginPage.java
public class LoginPage extends BasePage {
    private final By username  = By.id("username");
    private final By password  = By.id("password");
    private final By loginBtn  = By.cssSelector("button[type='submit']");
    private final By flash     = By.id("flash");

    public LoginPage(WebDriver driver) { super(driver); }

    public void open() { driver.get("https://the-internet.herokuapp.com/login"); }

    public SecurePage loginAs(String user, String pass) {
        type(username, user);
        type(password, pass);
        click(loginBtn);
        return new SecurePage(driver);
    }

    public LoginPage loginExpectingFailure(String user, String pass) {
        type(username, user);
        type(password, pass);
        click(loginBtn);
        return this;
    }

    public String getFlash() { return getText(flash); }
}

// Tests
@Test public void testValidLogin() {
    LoginPage lp = new LoginPage(driver);
    lp.open();
    SecurePage sp = lp.loginAs("tomsmith", "SuperSecretPassword!");
    Assert.assertTrue(sp.isLoaded());
}

@Test public void testInvalidLogin() {
    LoginPage lp = new LoginPage(driver);
    lp.open();
    lp.loginExpectingFailure("wrong", "wrong");
    Assert.assertTrue(lp.getFlash().contains("Your username is invalid"));
}`
        }
      },
      {
        id: 'l13',
        title: 'Page Factory (@FindBy)',
        type: 'practical',
        duration: '20 min',
        content: `
## Page Factory — Cleaner POM with Annotations

\`\`\`java
package com.training.pages;

import org.openqa.selenium.*;
import org.openqa.selenium.support.*;

public class LoginPage {
    private WebDriver driver;

    // @FindBy replaces driver.findElement
    @FindBy(id = "email")
    private WebElement emailInput;

    @FindBy(id = "password")
    private WebElement passwordInput;

    @FindBy(css = "button[type='submit']")
    private WebElement loginButton;

    @FindBy(className = "error-message")
    private WebElement errorMsg;

    // Lists work too
    @FindBy(css = ".nav-item")
    private List<WebElement> navItems;

    // Constructor MUST call PageFactory.initElements
    public LoginPage(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
    }

    public void login(String email, String password) {
        emailInput.clear();
        emailInput.sendKeys(email);
        passwordInput.clear();
        passwordInput.sendKeys(password);
        loginButton.click();
    }

    public String getError() {
        return errorMsg.getText();
    }

    public int getNavItemCount() {
        return navItems.size();
    }
}
\`\`\`

### @FindBys — AND condition (all must match)
\`\`\`java
@FindBys({
    @FindBy(className = "form-group"),
    @FindBy(tagName = "input")
})
private List<WebElement> formInputs;
\`\`\`

### @FindAll — OR condition (any can match)
\`\`\`java
@FindAll({
    @FindBy(id = "submit"),
    @FindBy(id = "save"),
    @FindBy(css = "button.primary")
})
private List<WebElement> actionButtons;
\`\`\`

### When to use which:
| | POM with By | Page Factory |
|---|---|---|
| Lazy loading | ✅ Yes | ✅ Yes (proxy) |
| Refactoring | Manual | Annotation |
| Lists | findElements | @FindBy |
| Nested elements | Easier | Harder |
`,
        exercise: {
          title: 'Exercise: Rewrite with Page Factory',
          task: 'Convert your LoginPage from the previous exercise to use Page Factory annotations. Ensure your tests still pass.',
          solution: `public class LoginPageFactory {
    @FindBy(id = "username")
    private WebElement usernameField;

    @FindBy(id = "password")
    private WebElement passwordField;

    @FindBy(css = "button[type='submit']")
    private WebElement loginBtn;

    @FindBy(id = "flash")
    private WebElement flashMessage;

    public LoginPageFactory(WebDriver driver) {
        PageFactory.initElements(driver, this);
    }

    public void login(String user, String pass) {
        usernameField.clear();
        usernameField.sendKeys(user);
        passwordField.clear();
        passwordField.sendKeys(pass);
        loginBtn.click();
    }

    public String getFlashMessage() {
        return flashMessage.getText();
    }
}`
        }
      }
    ]
  },
  {
    id: 'module-5',
    title: 'TestNG & Framework',
    icon: '🧪',
    lessons: [
      {
        id: 'l14',
        title: 'TestNG — Annotations & Assertions',
        type: 'practical',
        duration: '25 min',
        content: `
## TestNG — Execution Lifecycle

### Annotation order:
\`\`\`
@BeforeSuite → @BeforeTest → @BeforeClass → @BeforeMethod
     test executes
@AfterMethod → @AfterClass → @AfterTest → @AfterSuite
\`\`\`

### Full example:
\`\`\`java
public class TestNGDemo {

    @BeforeSuite
    public void beforeSuite() {
        System.out.println("Suite started — runs once for all");
    }

    @BeforeClass
    public void beforeClass() {
        System.out.println("Class started — runs once per class");
    }

    @BeforeMethod
    public void setUp() {
        // Setup WebDriver here
    }

    @Test(description = "Verify login works")
    public void testLogin() { /* ... */ }

    @Test(priority = 1, groups = {"smoke"})
    public void testHomePage() { /* ... */ }

    @Test(priority = 2, groups = {"regression"},
          dependsOnMethods = "testHomePage")
    public void testNavigation() { /* ... */ }

    @Test(dataProvider = "loginData")
    public void testMultipleLogins(String user, String pass) { /* ... */ }

    @DataProvider(name = "loginData")
    public Object[][] loginData() {
        return new Object[][] {
            {"admin@test.com", "admin123"},
            {"user@test.com",  "user123"},
            {"guest@test.com", "guest123"}
        };
    }

    @Test(expectedExceptions = NoSuchElementException.class)
    public void testExpectsException() {
        driver.findElement(By.id("nonexistent"));
    }

    @AfterMethod(alwaysRun = true)
    public void tearDown() {
        if (driver != null) driver.quit();
    }
}
\`\`\`

### TestNG Assertions:
\`\`\`java
// Hard assertions — test stops on failure
Assert.assertEquals(actual, expected, "message");
Assert.assertTrue(condition, "message");
Assert.assertFalse(condition);
Assert.assertNull(object);
Assert.assertNotNull(object);
Assert.fail("Explicit failure");

// Soft assertions — collect all failures, report at end
SoftAssert soft = new SoftAssert();
soft.assertEquals(title, "Expected Title");
soft.assertTrue(element.isDisplayed());
soft.assertAll(); // throws if any failed
\`\`\`

### testng.xml — run specific groups
\`\`\`xml
<!DOCTYPE suite SYSTEM "https://testng.org/testng-1.0.dtd">
<suite name="Regression Suite" parallel="methods" thread-count="4">
  <test name="Smoke Tests">
    <groups>
      <run><include name="smoke"/></run>
    </groups>
    <classes>
      <class name="com.training.tests.LoginTest"/>
    </classes>
  </test>
</suite>
\`\`\`
`,
        exercise: {
          title: 'Exercise: Data-Driven Login Test',
          task: 'Create a data-driven TestNG test with @DataProvider that tests 3 different login scenarios (valid, wrong password, wrong email). Use SoftAsserts to check both the URL change and page title.',
          solution: `@DataProvider(name = "loginScenarios")
public Object[][] loginScenarios() {
    return new Object[][] {
        {"tomsmith", "SuperSecretPassword!", true,  "Secure Area"},
        {"tomsmith", "wrongpass",            false, "Login Page"},
        {"wronguser", "SuperSecretPassword!", false, "Login Page"}
    };
}

@Test(dataProvider = "loginScenarios")
public void testLoginScenarios(String user, String pass,
                                boolean shouldSucceed, String expectedTitle) {
    driver.get("https://the-internet.herokuapp.com/login");
    new LoginPageFactory(driver).login(user, pass);

    SoftAssert soft = new SoftAssert();
    String title = driver.getTitle();

    if (shouldSucceed) {
        soft.assertTrue(driver.getCurrentUrl().contains("secure"));
    } else {
        soft.assertTrue(driver.getCurrentUrl().contains("login"));
    }
    soft.assertTrue(title.contains(expectedTitle),
        "Title mismatch: " + title);
    soft.assertAll();
}`
        }
      },
      {
        id: 'l15',
        title: 'Full Framework — Config, Reports & CI',
        type: 'practical',
        duration: '35 min',
        content: `
## Building a Production-Grade Framework

### 1. Configuration — config.properties
\`\`\`
# src/test/resources/config.properties
browser=chrome
baseUrl=https://the-internet.herokuapp.com
implicitWait=10
explicitWait=15
headless=false
\`\`\`

### 2. ConfigReader.java
\`\`\`java
public class ConfigReader {
    private static Properties props = new Properties();

    static {
        try (InputStream in = ConfigReader.class
                .getClassLoader()
                .getResourceAsStream("config.properties")) {
            props.load(in);
        } catch (IOException e) {
            throw new RuntimeException("config.properties not found", e);
        }
    }

    public static String get(String key) {
        return System.getProperty(key, props.getProperty(key));
    }

    public static int getInt(String key) {
        return Integer.parseInt(get(key));
    }

    public static boolean getBool(String key) {
        return Boolean.parseBoolean(get(key));
    }
}
\`\`\`

### 3. DriverFactory.java — multi-browser support
\`\`\`java
public class DriverFactory {
    public static WebDriver create() {
        String browser = ConfigReader.get("browser").toLowerCase();
        boolean headless = ConfigReader.getBool("headless");

        return switch (browser) {
            case "chrome" -> {
                WebDriverManager.chromedriver().setup();
                var options = new ChromeOptions();
                if (headless) options.addArguments("--headless=new");
                options.addArguments("--no-sandbox", "--disable-dev-shm-usage");
                yield new ChromeDriver(options);
            }
            case "firefox" -> {
                WebDriverManager.firefoxdriver().setup();
                var options = new FirefoxOptions();
                if (headless) options.addArguments("-headless");
                yield new FirefoxDriver(options);
            }
            case "edge" -> {
                WebDriverManager.edgedriver().setup();
                yield new EdgeDriver();
            }
            default -> throw new IllegalArgumentException("Unknown browser: " + browser);
        };
    }
}
\`\`\`

### 4. ExtentReports — HTML Test Reports
Add to pom.xml:
\`\`\`xml
<dependency>
  <groupId>com.aventstack</groupId>
  <artifactId>extentreports</artifactId>
  <version>5.1.1</version>
</dependency>
\`\`\`

\`\`\`java
// ReportManager.java
public class ReportManager {
    private static ExtentReports extent;
    private static ThreadLocal<ExtentTest> test = new ThreadLocal<>();

    public static ExtentReports getInstance() {
        if (extent == null) {
            ExtentSparkReporter reporter = new ExtentSparkReporter("reports/TestReport.html");
            reporter.config().setDocumentTitle("Selenium Training Report");
            reporter.config().setReportName("Automation Results");
            reporter.config().setTheme(Theme.DARK);
            extent = new ExtentReports();
            extent.attachReporter(reporter);
        }
        return extent;
    }

    public static void createTest(String name) {
        test.set(getInstance().createTest(name));
    }

    public static ExtentTest getTest() { return test.get(); }

    public static void flush() { getInstance().flush(); }
}
\`\`\`

### 5. Run from CLI with Maven
\`\`\`bash
# Run all tests
mvn test

# Run specific group
mvn test -Dgroups=smoke

# Override config
mvn test -Dbrowser=firefox -Dheadless=true

# Run specific testng.xml
mvn test -DsuiteXmlFile=testng-regression.xml

# Generate Surefire HTML report
mvn test site
\`\`\`
`,
        exercise: {
          title: 'Exercise: Complete Framework',
          task: 'Build the complete framework: ConfigReader + DriverFactory + BaseTest + LoginPage POM + 3 tests using testng.xml. Run with `mvn test` and verify all 3 tests pass.',
          hints: ['BaseTest should use @BeforeMethod to create driver from DriverFactory', 'config.properties should live in src/test/resources', 'testng.xml should be in the project root']
        }
      }
    ]
  },
  {
    id: 'module-6',
    title: 'Advanced Topics',
    icon: '🚀',
    lessons: [
      {
        id: 'l16',
        title: 'Screenshots, Logging & Debugging',
        type: 'practical',
        duration: '20 min',
        content: `
## Screenshot on Failure
\`\`\`java
public class ScreenshotUtil {
    public static String capture(WebDriver driver, String testName) {
        TakesScreenshot ts = (TakesScreenshot) driver;
        File src = ts.getScreenshotAs(OutputType.FILE);

        String timestamp = LocalDateTime.now()
            .format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String dest = "screenshots/" + testName + "_" + timestamp + ".png";

        try {
            Files.createDirectories(Path.of("screenshots"));
            Files.copy(src.toPath(), Path.of(dest));
            return dest;
        } catch (IOException e) {
            throw new RuntimeException("Screenshot failed", e);
        }
    }
}

// In BaseTest @AfterMethod:
@AfterMethod
public void tearDown(ITestResult result) {
    if (result.getStatus() == ITestResult.FAILURE) {
        String path = ScreenshotUtil.capture(driver, result.getName());
        ReportManager.getTest().fail("Test failed")
            .addScreenCaptureFromPath(path);
    }
    driver.quit();
}
\`\`\`

## Logging with SLF4J
\`\`\`xml
<!-- pom.xml -->
<dependency>
  <groupId>org.slf4j</groupId>
  <artifactId>slf4j-simple</artifactId>
  <version>2.0.13</version>
</dependency>
\`\`\`

\`\`\`java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LoginPage extends BasePage {
    private static final Logger log = LoggerFactory.getLogger(LoginPage.class);

    public HomePage login(String email, String pass) {
        log.info("Logging in as: {}", email);
        type(emailInput, email);
        type(passwordInput, pass);
        click(loginButton);
        log.debug("Login button clicked");
        return new HomePage(driver);
    }
}
\`\`\`

## Debugging Tips
\`\`\`java
// Print page source
System.out.println(driver.getPageSource());

// Print all element attributes
JavascriptExecutor js = (JavascriptExecutor) driver;
Map<String, Object> attrs = (Map<String, Object>) js.executeScript(
    "var attrs = {}; " +
    "for (var a of arguments[0].attributes) attrs[a.name] = a.value;" +
    "return attrs;", element);
System.out.println(attrs);

// Highlight element before interacting
js.executeScript("arguments[0].style.outline='3px solid red'", element);

// Console logs
LogEntries logs = driver.manage().logs().get(LogType.BROWSER);
logs.getAll().forEach(e -> System.out.println(e.getMessage()));
\`\`\`
`,
        exercise: {
          title: 'Exercise: Screenshot on Failure',
          task: 'Add a @AfterMethod to BaseTest that captures a screenshot when a test fails, saves it to a "screenshots/" folder with timestamp, and prints the path to console.',
          solution: `@AfterMethod(alwaysRun = true)
public void afterMethod(ITestResult result) {
    if (result.getStatus() == ITestResult.FAILURE) {
        String path = captureScreenshot(result.getName());
        System.out.println("Screenshot saved: " + path);
    }
    if (driver != null) driver.quit();
}

private String captureScreenshot(String testName) {
    TakesScreenshot ts = (TakesScreenshot) driver;
    File src = ts.getScreenshotAs(OutputType.FILE);
    String timestamp = LocalDateTime.now()
        .format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
    String destPath = "screenshots/" + testName + "_" + timestamp + ".png";
    try {
        new File("screenshots").mkdirs();
        Files.copy(src.toPath(), Path.of(destPath), StandardCopyOption.REPLACE_EXISTING);
    } catch (IOException e) { e.printStackTrace(); }
    return destPath;
}`
        }
      },
      {
        id: 'l17',
        title: 'Selenium Grid & Parallel Execution',
        type: 'practical',
        duration: '25 min',
        content: `
## Selenium Grid 4 — Parallel Cross-Browser Testing

### Start Grid (Hub + Node in one command):
\`\`\`bash
# Download selenium-server-4.x.x.jar from selenium.dev
java -jar selenium-server-4.21.0.jar standalone
# Grid UI: http://localhost:4444
\`\`\`

### Connect tests to Grid:
\`\`\`java
public class GridDriverFactory {
    private static final String GRID_URL = "http://localhost:4444";

    public static WebDriver createRemote(String browser) throws Exception {
        DesiredCapabilities caps = new DesiredCapabilities();

        MutableCapabilities options = switch (browser.toLowerCase()) {
            case "chrome"  -> new ChromeOptions();
            case "firefox" -> new FirefoxOptions();
            case "edge"    -> new EdgeOptions();
            default -> throw new IllegalArgumentException(browser);
        };

        return new RemoteWebDriver(new URL(GRID_URL), options);
    }
}
\`\`\`

### Parallel testng.xml:
\`\`\`xml
<suite name="Parallel Suite" parallel="tests" thread-count="3">
  <test name="Chrome">
    <parameter name="browser" value="chrome"/>
    <classes><class name="com.training.tests.LoginTest"/></classes>
  </test>
  <test name="Firefox">
    <parameter name="browser" value="firefox"/>
    <classes><class name="com.training.tests.LoginTest"/></classes>
  </test>
</suite>
\`\`\`

### Thread-safe driver with ThreadLocal:
\`\`\`java
public class DriverManager {
    private static final ThreadLocal<WebDriver> driver = new ThreadLocal<>();

    public static WebDriver getDriver() { return driver.get(); }

    public static void setDriver(WebDriver d) { driver.set(d); }

    public static void quit() {
        if (driver.get() != null) {
            driver.get().quit();
            driver.remove();
        }
    }
}

// BaseTest uses DriverManager
@BeforeMethod
@Parameters("browser")
public void setUp(@Optional("chrome") String browser) {
    WebDriver d = DriverFactory.create(browser);
    DriverManager.setDriver(d);
}

@AfterMethod(alwaysRun = true)
public void tearDown() { DriverManager.quit(); }
\`\`\`
`,
        exercise: {
          title: 'Exercise: Parallel Tests',
          task: 'Update your testng.xml to run your LoginTest in parallel with thread-count="2" at the "methods" level. Add ThreadLocal to DriverManager and verify both tests run simultaneously.',
          hints: ['parallel="methods" runs test methods in parallel', 'ThreadLocal ensures each thread has its own WebDriver', 'Check TestNG output for parallel execution confirmation']
        }
      }
    ]
  }
];

// Total lessons count
const TOTAL_LESSONS = CURRICULUM.reduce((sum, m) => sum + m.lessons.length, 0);
