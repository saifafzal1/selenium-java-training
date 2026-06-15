// Capstone Lab Exercises — Module 7
// Auto-merged into CURRICULUM on load
const CURRICULUM_LABS = [
    {
    id: 'module-7',
    title: 'Capstone Lab Exercises',
    icon: '🏆',
    lessons: [
      // ── Lab 1 ──────────────────────────────────────────────
      {
        id: 'lab1',
        title: 'Lab 1: Login Flow with Page Object Model',
        type: 'lab',
        duration: '45 min',
        difficulty: 'intermediate',
        testSite: 'https://the-internet.herokuapp.com/login',
        whatYoullLearn: [
          'Build a LoginPage POM class with @FindBy annotations and PageFactory',
          'Write a positive login test that asserts the success URL',
          'Write a negative login test asserting the error message text',
          'Apply explicit WebDriverWait instead of Thread.sleep()',
          'Organise pages/ and tests/ packages correctly'
        ],
        content: `
## 🔬 Lab 1 — Login Flow with Page Object Model

### 🎯 Goal
Build a complete Page Object Model automation for the login feature of a real test site and verify both successful and failed login scenarios.

---

### 🌐 Test Site
**URL:** https://the-internet.herokuapp.com/login

| Credential | Value |
|---|---|
| Valid username | \`tomsmith\` |
| Valid password | \`SuperSecretPassword!\` |
| Expected success URL | contains \`/secure\` |
| Invalid creds error | \`Your username is invalid!\` |

---

### 📋 Requirements

#### Package Structure
\`\`\`
src/test/java/
├── pages/
│   ├── LoginPage.java      ← locators + login() method
│   └── SecurePage.java     ← success page verification
└── tests/
    └── LoginTest.java      ← 2 test methods
\`\`\`

#### LoginPage.java — Minimum requirements
- Use \`@FindBy\` for username field, password field, login button, error message
- Initialise with \`PageFactory.initElements(driver, this)\`
- Expose a \`login(String user, String pass)\` method that returns \`SecurePage\`
- Expose a \`getErrorMessage()\` method that returns the error text string

#### SecurePage.java — Minimum requirements
- Use \`@FindBy\` to locate the success heading (\`h2\` or flash message)
- Expose a \`isLoaded()\` method that returns boolean
- Expose a \`getFlashMessage()\` method

#### LoginTest.java — Must include BOTH:
1. **\`testValidLogin()\`** — logs in with valid credentials, asserts current URL contains \`/secure\`, asserts flash message contains \`You logged in\`
2. **\`testInvalidLogin()\`** — logs in with invalid credentials, asserts error div is displayed, asserts error text contains \`Your username is invalid\`

---

### ⚙️ Technical Constraints
- Use **explicit \`WebDriverWait\`** (min 5s) for any dynamic element — no \`Thread.sleep()\`
- All element interactions must go through the Page Object — **no raw \`driver.findElement()\` in test class**
- Use **TestNG \`Assert\`** (not JUnit) for all assertions
- Both tests must pass with \`mvn test\`

---

### 💡 Key Patterns to Apply
\`\`\`java
// ✅ Correct — WebDriverWait in Page Object
public String getErrorMessage() {
    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
    WebElement error = wait.until(ExpectedConditions.visibilityOfElementLocated(
        By.id("flash")));
    return error.getText();
}

// ❌ Wrong — raw sleep
Thread.sleep(2000); // never do this

// ✅ Correct — driver encapsulated in Page Object
// In test:
loginPage.login("tomsmith", "SuperSecretPassword!");

// ❌ Wrong — driver exposed in test class
driver.findElement(By.id("username")).sendKeys("tomsmith");
\`\`\`
`,
        exercise: {
          title: 'Build It: Login POM + Tests',
          task: 'Create the full LoginPage, SecurePage, and LoginTest as described above. Run `mvn test` — both tests must pass. Then open the Evaluate tab to self-assess your implementation against the rubric.',
          hints: [
            'The username field has id="username", password has id="password", button is a <button> with type="submit"',
            'The error flash message has id="flash" and class="flash error"',
            'SecurePage\'s heading is an <h2> inside div#flash',
            'Remember: @FindBy fields are null until PageFactory.initElements(driver, this) is called in the constructor'
          ],
          solution: `// LoginPage.java
package pages;

import org.openqa.selenium.*;
import org.openqa.selenium.support.*;
import org.openqa.selenium.support.ui.*;
import java.time.Duration;

public class LoginPage {
    private WebDriver driver;

    @FindBy(id = "username")
    private WebElement usernameField;

    @FindBy(id = "password")
    private WebElement passwordField;

    @FindBy(css = "button[type='submit']")
    private WebElement loginButton;

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
    }

    public SecurePage login(String user, String pass) {
        usernameField.clear();
        usernameField.sendKeys(user);
        passwordField.clear();
        passwordField.sendKeys(pass);
        loginButton.click();
        return new SecurePage(driver);
    }

    public String getErrorMessage() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
        WebElement error = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.id("flash")));
        return error.getText();
    }
}

// SecurePage.java
package pages;

import org.openqa.selenium.*;
import org.openqa.selenium.support.*;

public class SecurePage {
    private WebDriver driver;

    @FindBy(css = "#flash")
    private WebElement flashMessage;

    public SecurePage(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
    }

    public boolean isLoaded() {
        return driver.getCurrentUrl().contains("/secure");
    }

    public String getFlashMessage() { return flashMessage.getText(); }
}

// LoginTest.java
package tests;

import org.openqa.selenium.*;
import org.openqa.selenium.chrome.*;
import org.testng.*;
import org.testng.annotations.*;
import pages.*;

public class LoginTest {
    private WebDriver driver;
    private LoginPage loginPage;

    @BeforeMethod
    public void setUp() {
        driver = new ChromeDriver();
        driver.get("https://the-internet.herokuapp.com/login");
        loginPage = new LoginPage(driver);
    }

    @Test
    public void testValidLogin() {
        SecurePage secure = loginPage.login("tomsmith", "SuperSecretPassword!");
        Assert.assertTrue(secure.isLoaded(), "URL should contain /secure");
        Assert.assertTrue(secure.getFlashMessage().contains("You logged in"),
            "Flash should confirm login");
    }

    @Test
    public void testInvalidLogin() {
        loginPage.login("wronguser", "wrongpass");
        String error = loginPage.getErrorMessage();
        Assert.assertTrue(error.contains("Your username is invalid"),
            "Error message should appear");
    }

    @AfterMethod
    public void tearDown() { if (driver != null) driver.quit(); }
}`
        },
        rubric: {
          totalPoints: 20,
          criteria: [
            { id: 'lab1_c1', label: 'LoginPage uses @FindBy + PageFactory.initElements() — no driver.findElement() in constructor body', points: 4 },
            { id: 'lab1_c2', label: 'login() method is fully encapsulated in LoginPage — test class calls loginPage.login(), not raw driver commands', points: 4 },
            { id: 'lab1_c3', label: 'Explicit WebDriverWait used (visibilityOf or elementToBeClickable) — zero Thread.sleep() in codebase', points: 4 },
            { id: 'lab1_c4', label: 'testValidLogin() asserts both URL (contains /secure) AND flash message text', points: 4 },
            { id: 'lab1_c5', label: 'testInvalidLogin() asserts the error element text — test passes with wrong credentials', points: 4 }
          ]
        },
        quiz: [
          { type: 'mcq', q: 'Which method must be called in a Page Object constructor for @FindBy fields to work?', options: ['PageFactory.init()', 'PageFactory.initElements(driver, this)', 'PageFactory.create(driver)', 'WebElement.init(driver)'], answer: 1 },
          { type: 'truefalse', q: 'It is acceptable to call driver.findElement() directly inside a TestNG @Test method when using Page Object Model.', answer: false },
          { type: 'mcq', q: 'Which wait correctly waits for an element to be visible before reading its text?', options: ['Thread.sleep(3000)', 'driver.manage().timeouts().implicitlyWait()', 'wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("flash")))', 'driver.findElement(By.id("flash")).isDisplayed()'], answer: 2 },
          { type: 'fillin', q: 'The TestNG assertion class used to check boolean conditions is called Assert.________()', answer: 'assertTrue' }
        ]
      },

      // ── Lab 2 ──────────────────────────────────────────────
      {
        id: 'lab2',
        title: 'Lab 2: Data-Driven Testing with @DataProvider',
        type: 'lab',
        duration: '40 min',
        difficulty: 'intermediate',
        testSite: 'https://the-internet.herokuapp.com/login',
        whatYoullLearn: [
          'Implement @DataProvider to supply multiple test data sets',
          'Parameterise a @Test method to consume data from the provider',
          'Test boundary conditions: valid, invalid username, invalid password, empty fields',
          'Assert different expected outcomes per data row',
          'Verify test isolation — each row runs independently'
        ],
        content: `
## 🔬 Lab 2 — Data-Driven Testing with @DataProvider

### 🎯 Goal
Replace hard-coded test data with a \`@DataProvider\` that drives the same login test with four distinct data sets — covering valid login, invalid credentials, and edge cases.

---

### 🌐 Test Site
**URL:** https://the-internet.herokuapp.com/login

---

### 📋 Requirements

#### DataProvider
Create a \`@DataProvider(name = "loginData")\` method that returns **exactly 4 rows**:

| Row | Username | Password | Expected outcome |
|-----|----------|----------|-----------------|
| 1 | \`tomsmith\` | \`SuperSecretPassword!\` | URL contains \`/secure\` |
| 2 | \`tomsmith\` | \`wrongpassword\` | Error: \`Your password is invalid!\` |
| 3 | \`wronguser\` | \`SuperSecretPassword!\` | Error: \`Your username is invalid!\` |
| 4 | (empty) | (empty) | Error: \`Your username is invalid!\` |

#### Test Method
- Annotate with \`@Test(dataProvider = "loginData")\`
- Method signature: \`public void testLogin(String user, String pass, String expectedOutcome)\`
- Use \`expectedOutcome\` value to branch: if it contains \`/secure\`, assert on URL; otherwise assert error message contains \`expectedOutcome\`

#### Test Isolation
- \`@BeforeMethod\` must navigate to the login page (fresh state per row)
- \`@AfterMethod\` must quit the driver

---

### ⚙️ The Data Provider Pattern
\`\`\`java
@DataProvider(name = "loginData")
public Object[][] loginData() {
    return new Object[][] {
        { "tomsmith",  "SuperSecretPassword!", "/secure" },
        { "tomsmith",  "wrongpassword",        "Your password is invalid!" },
        { "wronguser", "SuperSecretPassword!", "Your username is invalid!" },
        { "",          "",                     "Your username is invalid!" }
    };
}

@Test(dataProvider = "loginData")
public void testLogin(String user, String pass, String expectedOutcome) {
    // your assertion logic branches on expectedOutcome
}
\`\`\`

---

### 💡 Branching Assertion Strategy
\`\`\`java
if (expectedOutcome.startsWith("/")) {
    Assert.assertTrue(driver.getCurrentUrl().contains(expectedOutcome),
        "URL should contain: " + expectedOutcome);
} else {
    String error = loginPage.getErrorMessage();
    Assert.assertTrue(error.contains(expectedOutcome),
        "Error should contain: " + expectedOutcome);
}
\`\`\`
`,
        exercise: {
          title: 'Build It: 4-Row Data-Driven Login Test',
          task: 'Implement the @DataProvider with all 4 rows and a single parameterised @Test method. All 4 test runs must pass when you run `mvn test`. Open the Evaluate tab and check off each criterion you have met.',
          hints: [
            'The @DataProvider method can be in the same test class or in a separate DataProviders.java utility class',
            'Use @Test(dataProvider = "loginData", dataProviderClass = DataProviders.class) if provider is in another class',
            'The empty string "" for username still submits the form — the site returns "Your username is invalid!"',
            'TestNG prints each data row with its index — check console output to confirm 4 separate test runs'
          ],
          solution: `// DataDrivenLoginTest.java
package tests;

import org.openqa.selenium.*;
import org.openqa.selenium.chrome.*;
import org.testng.*;
import org.testng.annotations.*;
import pages.LoginPage;

public class DataDrivenLoginTest {
    private WebDriver driver;
    private LoginPage loginPage;

    @BeforeMethod
    public void setUp() {
        driver = new ChromeDriver();
        driver.get("https://the-internet.herokuapp.com/login");
        loginPage = new LoginPage(driver);
    }

    @DataProvider(name = "loginData")
    public Object[][] loginData() {
        return new Object[][] {
            { "tomsmith",  "SuperSecretPassword!", "/secure" },
            { "tomsmith",  "wrongpassword",        "Your password is invalid!" },
            { "wronguser", "SuperSecretPassword!", "Your username is invalid!" },
            { "",          "",                     "Your username is invalid!" }
        };
    }

    @Test(dataProvider = "loginData")
    public void testLogin(String user, String pass, String expectedOutcome) {
        loginPage.login(user, pass);

        if (expectedOutcome.startsWith("/")) {
            Assert.assertTrue(
                driver.getCurrentUrl().contains(expectedOutcome),
                "URL should contain: " + expectedOutcome);
        } else {
            String error = loginPage.getErrorMessage();
            Assert.assertTrue(
                error.contains(expectedOutcome),
                "Error should contain: " + expectedOutcome);
        }
    }

    @AfterMethod(alwaysRun = true)
    public void tearDown() { if (driver != null) driver.quit(); }
}`
        },
        rubric: {
          totalPoints: 20,
          criteria: [
            { id: 'lab2_c1', label: '@DataProvider method returns exactly 4 rows — valid login, wrong password, wrong username, empty credentials', points: 4 },
            { id: 'lab2_c2', label: '@Test method signature accepts (String user, String pass, String expectedOutcome) — driven by @DataProvider', points: 4 },
            { id: 'lab2_c3', label: 'Branching assertion: URL check for success rows, error-message check for failure rows — single test method handles all cases', points: 4 },
            { id: 'lab2_c4', label: '@BeforeMethod navigates to login page and @AfterMethod quits driver — each data row runs in isolation', points: 4 },
            { id: 'lab2_c5', label: 'All 4 test runs pass when executing mvn test — TestNG console shows 4 entries in the DataProvider results', points: 4 }
          ]
        },
        quiz: [
          { type: 'mcq', q: 'What does @DataProvider return to supply multiple test data sets?', options: ['List<String[]>', 'Object[][]', 'Map<String, Object>', 'String[]'], answer: 1 },
          { type: 'truefalse', q: 'With @DataProvider returning 4 rows, TestNG will run the @Test method 4 times — once per row.', answer: true },
          { type: 'mcq', q: 'How do you link a @Test method to a specific @DataProvider?', options: ['@Test(provider = "name")', '@Test(dataProvider = "name")', '@Test(data = "name")', '@Test(source = "name")'], answer: 1 },
          { type: 'fillin', q: 'The @DataProvider annotation attribute that names the provider is called _______.', answer: 'name' }
        ]
      },

      // ── Lab 3 ──────────────────────────────────────────────
      {
        id: 'lab3',
        title: 'Lab 3: Multi-Page E-Commerce Flow',
        type: 'lab',
        duration: '50 min',
        difficulty: 'advanced',
        testSite: 'https://www.saucedemo.com',
        whatYoullLearn: [
          'Build a chain of Page Objects where each action returns the next page',
          'Assert state at each page boundary (not just the final assertion)',
          'Handle cart badge count as a dynamic assertion',
          'Use @FindBy with CSS selectors for complex element locators',
          'Implement a complete end-to-end purchase journey in one test'
        ],
        content: `
## 🔬 Lab 3 — Multi-Page E-Commerce Flow

### 🎯 Goal
Automate the complete purchase journey on a real e-commerce test site: login → browse inventory → add item to cart → verify cart → checkout → confirm order.

---

### 🌐 Test Site
**URL:** https://www.saucedemo.com

| Credential | Value |
|---|---|
| Username | \`standard_user\` |
| Password | \`secret_sauce\` |

---

### 📋 Page Objects Required

#### LoginPage.java
- \`login(String user, String pass)\` → returns \`InventoryPage\`

#### InventoryPage.java
- \`addFirstItemToCart()\` → returns \`InventoryPage\` (allows chaining)
- \`getCartCount()\` → returns the badge number as \`int\`
- \`openCart()\` → returns \`CartPage\`

#### CartPage.java
- \`getCartItemCount()\` → returns number of items in cart as \`int\`
- \`getFirstItemName()\` → returns the item name text
- \`proceedToCheckout()\` → returns \`CheckoutPage\`

#### CheckoutPage.java
- \`fillDetails(String first, String last, String zip)\` → returns \`CheckoutPage\`
- \`finish()\` → returns \`ConfirmationPage\`

#### ConfirmationPage.java
- \`isOrderConfirmed()\` → returns \`true\` if success header is visible

---

### 🔗 Method Chaining — The Target Test
\`\`\`java
@Test
public void testCompletePurchase() {
    InventoryPage inventory = loginPage.login("standard_user", "secret_sauce");
    inventory.addFirstItemToCart();
    Assert.assertEquals(inventory.getCartCount(), 1, "Cart should show 1 item");

    CartPage cart = inventory.openCart();
    Assert.assertEquals(cart.getCartItemCount(), 1, "Cart should contain 1 item");
    String itemName = cart.getFirstItemName();
    Assert.assertFalse(itemName.isEmpty(), "Item name should not be empty");

    ConfirmationPage confirm = cart
        .proceedToCheckout()
        .fillDetails("Jane", "Doe", "10001")
        .finish();

    Assert.assertTrue(confirm.isOrderConfirmed(), "Order confirmation should appear");
}
\`\`\`

---

### 💡 Key Locators for SauceDemo

\`\`\`java
// LoginPage
@FindBy(id = "user-name")       private WebElement usernameField;
@FindBy(id = "password")        private WebElement passwordField;
@FindBy(id = "login-button")    private WebElement loginBtn;

// InventoryPage
@FindBy(css = ".btn_add_to_cart_action")  // first Add to Cart button
@FindBy(css = ".shopping_cart_badge")     // cart item count

// CartPage
@FindBy(css = ".cart_item")               // all cart items
@FindBy(id = "checkout")                  // checkout button

// CheckoutPage
@FindBy(id = "first-name")
@FindBy(id = "last-name")
@FindBy(id = "postal-code")
@FindBy(id = "continue")
@FindBy(id = "finish")

// ConfirmationPage
@FindBy(css = ".complete-header")         // "Thank you for your order!"
\`\`\`
`,
        exercise: {
          title: 'Build It: Full E-Commerce POM Chain',
          task: 'Implement all 5 Page Objects and the testCompletePurchase() test as specified. The test must pass end-to-end with `mvn test`. Assert at each page — not just the final confirmation.',
          hints: [
            'Each page method that navigates returns a NEW Page Object — driver.get() is not needed between pages',
            'getCartCount() must handle the case where the badge is absent (return 0) using findElements()',
            'The checkout flow has two pages: step one (personal info) and step two (summary) — the "Finish" button is on step two',
            'Use WebDriverWait on the confirmation page: wait for .complete-header to be visible before calling isOrderConfirmed()'
          ],
          solution: `// Key method implementations

// InventoryPage.java
public InventoryPage addFirstItemToCart() {
    List<WebElement> addButtons = driver.findElements(
        By.cssSelector(".btn_add_to_cart_action, .btn_primary.btn_inventory"));
    if (!addButtons.isEmpty()) addButtons.get(0).click();
    return this;
}

public int getCartCount() {
    List<WebElement> badges = driver.findElements(
        By.cssSelector(".shopping_cart_badge"));
    if (badges.isEmpty()) return 0;
    return Integer.parseInt(badges.get(0).getText().trim());
}

public CartPage openCart() {
    driver.findElement(By.cssSelector(".shopping_cart_link")).click();
    return new CartPage(driver);
}

// CartPage.java
public int getCartItemCount() {
    return driver.findElements(By.cssSelector(".cart_item")).size();
}

public String getFirstItemName() {
    return driver.findElement(By.cssSelector(".inventory_item_name")).getText();
}

public CheckoutPage proceedToCheckout() {
    driver.findElement(By.id("checkout")).click();
    return new CheckoutPage(driver);
}

// CheckoutPage.java
public CheckoutPage fillDetails(String first, String last, String zip) {
    driver.findElement(By.id("first-name")).sendKeys(first);
    driver.findElement(By.id("last-name")).sendKeys(last);
    driver.findElement(By.id("postal-code")).sendKeys(zip);
    driver.findElement(By.id("continue")).click();
    return this;
}

public ConfirmationPage finish() {
    driver.findElement(By.id("finish")).click();
    return new ConfirmationPage(driver);
}

// ConfirmationPage.java
public boolean isOrderConfirmed() {
    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
    try {
        WebElement header = wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector(".complete-header")));
        return header.isDisplayed();
    } catch (TimeoutException e) { return false; }
}`
        },
        rubric: {
          totalPoints: 25,
          criteria: [
            { id: 'lab3_c1', label: '5 Page Object classes created (LoginPage, InventoryPage, CartPage, CheckoutPage, ConfirmationPage) — each in the pages/ package', points: 5 },
            { id: 'lab3_c2', label: 'Method chaining works: each navigation method returns the correct next Page Object (not void)', points: 5 },
            { id: 'lab3_c3', label: 'Intermediate assertions present: cart badge count == 1 after add, cart item count == 1 on CartPage — not just final assertion', points: 5 },
            { id: 'lab3_c4', label: 'isOrderConfirmed() uses WebDriverWait and handles TimeoutException gracefully (returns false, does not throw)', points: 5 },
            { id: 'lab3_c5', label: 'Complete end-to-end test passes with mvn test — all assertions green, no flakiness on re-run', points: 5 }
          ]
        },
        quiz: [
          { type: 'mcq', q: 'In the method-chaining POM pattern, what should addFirstItemToCart() return?', options: ['void', 'WebElement', 'InventoryPage', 'CartPage'], answer: 2 },
          { type: 'truefalse', q: 'Calling driver.get(url) between page transitions is required when using the method-chaining POM pattern.', answer: false },
          { type: 'mcq', q: 'Why should getCartCount() use findElements() instead of findElement()?', options: ['findElements() is faster', 'findElements() returns an empty list when nothing is found instead of throwing NoSuchElementException', 'findElements() supports CSS selectors', 'findElement() only works with By.id()'], answer: 1 },
          { type: 'fillin', q: 'WebDriverWait throws a _______ exception when the condition is not met within the timeout.', answer: 'TimeoutException' }
        ]
      },

      // ── Lab 4 ──────────────────────────────────────────────
      {
        id: 'lab4',
        title: 'Lab 4: Parallel Cross-Browser Execution',
        type: 'lab',
        duration: '45 min',
        difficulty: 'advanced',
        testSite: 'https://the-internet.herokuapp.com',
        whatYoullLearn: [
          'Implement ThreadLocal<WebDriver> for thread-safe parallel execution',
          'Configure testng.xml with parallel="tests" and thread-count="2"',
          'Parameterise browser selection via @Parameters from testng.xml',
          'Capture and save a screenshot on test failure in @AfterMethod',
          'Verify tests actually run in parallel by reading TestNG output timestamps'
        ],
        content: `
## 🔬 Lab 4 — Parallel Cross-Browser Execution

### 🎯 Goal
Upgrade your existing test suite so the **same tests run simultaneously on Chrome and Firefox** using TestNG's parallel execution with a thread-safe \`ThreadLocal\` WebDriver.

---

### 📋 Requirements

#### DriverManager.java — Thread-safe WebDriver
\`\`\`java
public class DriverManager {
    private static final ThreadLocal<WebDriver> driverThread = new ThreadLocal<>();

    public static WebDriver getDriver()           { return driverThread.get(); }
    public static void setDriver(WebDriver d)     { driverThread.set(d); }
    public static void quit() {
        if (driverThread.get() != null) {
            driverThread.get().quit();
            driverThread.remove();
        }
    }
}
\`\`\`

#### BaseTest.java — Parameterised setup
\`\`\`java
@BeforeMethod
@Parameters("browser")
public void setUp(@Optional("chrome") String browser) {
    WebDriver driver = DriverFactory.create(browser);
    DriverManager.setDriver(driver);
    DriverManager.getDriver().manage().window().maximize();
}

@AfterMethod(alwaysRun = true)
public void tearDown(ITestResult result) {
    if (result.getStatus() == ITestResult.FAILURE) {
        captureScreenshot(result.getName() + "_" + Thread.currentThread().getId());
    }
    DriverManager.quit();
}
\`\`\`

#### testng.xml — Parallel configuration
\`\`\`xml
<suite name="CrossBrowser" parallel="tests" thread-count="2" verbose="1">
  <test name="Chrome Tests">
    <parameter name="browser" value="chrome"/>
    <classes>
      <class name="tests.LoginTest"/>
      <class name="tests.DataDrivenLoginTest"/>
    </classes>
  </test>
  <test name="Firefox Tests">
    <parameter name="browser" value="firefox"/>
    <classes>
      <class name="tests.LoginTest"/>
      <class name="tests.DataDrivenLoginTest"/>
    </classes>
  </test>
</suite>
\`\`\`

---

### ⚙️ Why ThreadLocal?

Without ThreadLocal, a shared \`WebDriver\` field in BaseTest causes **race conditions** — Thread A quits the driver that Thread B is still using.

With ThreadLocal, each thread has its **own independent WebDriver instance**. No sharing, no races.

---

### ✅ Verification Steps
After running \`mvn test -DsuiteXmlFile=testng.xml\`:
1. Chrome and Firefox should start **within 2 seconds of each other**
2. Confirm two browser windows open simultaneously
3. TestNG HTML report shows tests grouped by Chrome/Firefox
4. Screenshots appear in \`screenshots/\` folder with thread ID in filename
`,
        exercise: {
          title: 'Build It: ThreadLocal + Parallel testng.xml',
          task: 'Implement DriverManager with ThreadLocal, update BaseTest with @Parameters browser selection + screenshot on failure, and write a testng.xml that runs your Lab 1 LoginTest on both Chrome and Firefox in parallel.',
          hints: [
            'Add WebDriverManager.firefoxdriver().setup() to DriverFactory for Firefox support',
            'The @Optional("chrome") annotation sets a default if the parameter is missing from testng.xml',
            'Thread.currentThread().getId() gives you the thread ID — add it to the screenshot filename to avoid overwrites',
            'verbose="1" in the suite tag shows detailed per-test output including thread IDs'
          ],
          solution: `// DriverManager.java
package utils;
import org.openqa.selenium.WebDriver;

public class DriverManager {
    private static final ThreadLocal<WebDriver> driverThread = new ThreadLocal<>();

    public static WebDriver getDriver()       { return driverThread.get(); }
    public static void setDriver(WebDriver d) { driverThread.set(d); }
    public static void quit() {
        if (driverThread.get() != null) {
            driverThread.get().quit();
            driverThread.remove();
        }
    }
}

// BaseTest.java (key methods)
@BeforeMethod
@Parameters("browser")
public void setUp(@Optional("chrome") String browser) throws Exception {
    WebDriver d;
    switch (browser.toLowerCase()) {
        case "firefox":
            WebDriverManager.firefoxdriver().setup();
            d = new FirefoxDriver();
            break;
        default:
            WebDriverManager.chromedriver().setup();
            d = new ChromeDriver();
    }
    DriverManager.setDriver(d);
    DriverManager.getDriver().manage().window().maximize();
}

@AfterMethod(alwaysRun = true)
public void tearDown(ITestResult result) {
    if (result.getStatus() == ITestResult.FAILURE) {
        TakesScreenshot ts = (TakesScreenshot) DriverManager.getDriver();
        File src = ts.getScreenshotAs(OutputType.FILE);
        String name = result.getName() + "_t" + Thread.currentThread().getId() + ".png";
        try {
            new File("screenshots").mkdirs();
            Files.copy(src.toPath(), Path.of("screenshots/" + name));
        } catch (IOException e) { e.printStackTrace(); }
    }
    DriverManager.quit();
}`
        },
        rubric: {
          totalPoints: 20,
          criteria: [
            { id: 'lab4_c1', label: 'DriverManager uses ThreadLocal<WebDriver> — setDriver(), getDriver(), and quit() with driverThread.remove() all implemented', points: 4 },
            { id: 'lab4_c2', label: 'BaseTest @BeforeMethod uses @Parameters("browser") and @Optional("chrome") — browser controlled from testng.xml', points: 4 },
            { id: 'lab4_c3', label: 'testng.xml has parallel="tests" thread-count="2" with separate <test> blocks for Chrome and Firefox', points: 4 },
            { id: 'lab4_c4', label: 'Screenshot capture in @AfterMethod: only fires on FAILURE, saves to screenshots/ with thread ID in filename', points: 4 },
            { id: 'lab4_c5', label: 'Parallel execution verified: console timestamps show Chrome and Firefox starting within 2s of each other (not sequentially)', points: 4 }
          ]
        },
        quiz: [
          { type: 'mcq', q: 'Why must ThreadLocal.remove() be called in the teardown method?', options: ['To reset the browser settings', 'To prevent memory leaks — thread pools can reuse threads that still hold old WebDriver references', 'To close the browser window', 'To reset the WebDriver session'], answer: 1 },
          { type: 'truefalse', q: 'parallel="methods" and parallel="tests" in testng.xml produce the same execution behaviour.', answer: false },
          { type: 'mcq', q: 'What does @Optional("chrome") on a @Parameters method argument do?', options: ['Makes the browser optional for the test', 'Provides a default value if the parameter is not set in testng.xml', 'Marks the test as optional', 'Skips the test if chrome is not installed'], answer: 1 },
          { type: 'fillin', q: 'The TestNG result constant for a failed test is ITestResult._______.', answer: 'FAILURE' }
        ]
      },

      // ── Lab 5 ──────────────────────────────────────────────
      {
        id: 'lab5',
        title: 'Lab 5: Full CI-Ready Framework',
        type: 'lab',
        duration: '60 min',
        difficulty: 'expert',
        testSite: 'https://the-internet.herokuapp.com',
        whatYoullLearn: [
          'Externalise all config (browser, base URL, headless) into config.properties',
          'Build a DriverFactory that reads config and supports headless mode',
          'Integrate ExtentReports — every test logs Pass/Fail with screenshot on failure',
          'Configure Maven Surefire plugin to run testng.xml from mvn test',
          'Verify the framework runs cleanly with mvn test from a fresh terminal with zero IDE involvement'
        ],
        content: `
## 🔬 Lab 5 — Full CI-Ready Framework

### 🎯 Goal
Assemble everything from Labs 1–4 into a **production-grade framework** that runs end-to-end from \`mvn test\` with zero manual steps.

---

### 📋 Components to Build

#### 1. config.properties (in src/test/resources/)
\`\`\`properties
browser=chrome
baseUrl=https://the-internet.herokuapp.com
headless=false
timeout=10
reportsPath=reports/TestReport.html
\`\`\`

#### 2. ConfigReader.java
\`\`\`java
public class ConfigReader {
    private static final Properties props = new Properties();
    static {
        try (InputStream in = ConfigReader.class.getClassLoader()
                .getResourceAsStream("config.properties")) {
            props.load(in);
        } catch (IOException e) { throw new RuntimeException(e); }
    }
    public static String get(String key)       { return props.getProperty(key); }
    public static boolean getBool(String key)  { return Boolean.parseBoolean(get(key)); }
    public static int getInt(String key)       { return Integer.parseInt(get(key)); }
}
\`\`\`

#### 3. DriverFactory.java — Headless support
\`\`\`java
public class DriverFactory {
    public static WebDriver create() {
        String browser  = ConfigReader.get("browser");
        boolean headless = ConfigReader.getBool("headless");

        return switch (browser.toLowerCase()) {
            case "chrome" -> {
                WebDriverManager.chromedriver().setup();
                ChromeOptions opts = new ChromeOptions();
                if (headless) opts.addArguments("--headless=new","--no-sandbox","--disable-dev-shm-usage");
                yield new ChromeDriver(opts);
            }
            case "firefox" -> {
                WebDriverManager.firefoxdriver().setup();
                FirefoxOptions opts = new FirefoxOptions();
                if (headless) opts.addArguments("-headless");
                yield new FirefoxDriver(opts);
            }
            default -> throw new IllegalArgumentException("Unknown browser: " + browser);
        };
    }
}
\`\`\`

#### 4. ReportManager.java — ExtentReports
\`\`\`java
public class ReportManager {
    private static ExtentReports extent;
    private static final ThreadLocal<ExtentTest> test = new ThreadLocal<>();

    public static void initReports() {
        ExtentSparkReporter spark = new ExtentSparkReporter(ConfigReader.get("reportsPath"));
        spark.config().setDocumentTitle("Automation AI Lab — Test Results");
        spark.config().setTheme(Theme.STANDARD);
        extent = new ExtentReports();
        extent.attachReporter(spark);
    }
    public static void createTest(String name) { test.set(extent.createTest(name)); }
    public static ExtentTest getTest()         { return test.get(); }
    public static void flush()                 { if (extent != null) extent.flush(); }
}
\`\`\`

#### 5. BaseTest.java
\`\`\`java
@BeforeSuite
public void initSuite() { ReportManager.initReports(); }

@BeforeMethod
public void setUp(Method m) {
    WebDriver driver = DriverFactory.create();
    DriverManager.setDriver(driver);
    driver.get(ConfigReader.get("baseUrl"));
    ReportManager.createTest(m.getName());
}

@AfterMethod(alwaysRun = true)
public void tearDown(ITestResult result) {
    if (result.getStatus() == ITestResult.FAILURE) {
        String path = ScreenshotUtil.capture(DriverManager.getDriver(), result.getName());
        ReportManager.getTest().fail(result.getThrowable()).addScreenCaptureFromPath(path);
    } else if (result.getStatus() == ITestResult.SUCCESS) {
        ReportManager.getTest().pass("Test passed");
    }
    DriverManager.quit();
}

@AfterSuite
public void tearDownSuite() { ReportManager.flush(); }
\`\`\`

#### 6. Maven Surefire — pom.xml
\`\`\`xml
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-surefire-plugin</artifactId>
  <version>3.2.5</version>
  <configuration>
    <suiteXmlFiles><suiteXmlFile>testng.xml</suiteXmlFile></suiteXmlFiles>
  </configuration>
</plugin>
\`\`\`

---

### ✅ Definition of Done
\`\`\`bash
mvn clean test
# ✅ All tests PASS
# ✅ reports/TestReport.html generated
# ✅ screenshots/ folder populated on failures
# ✅ Zero hard-coded browser names or URLs in test classes
\`\`\`
`,
        exercise: {
          title: 'Build It: Complete CI-Ready Framework',
          task: 'Assemble the full 6-component framework. Run `mvn clean test` — all tests from Labs 1 & 3 must pass, the HTML report must generate, and setting headless=true must not break any test.',
          hints: [
            'ExtentReports dependency: com.aventstack:extentreports:5.1.1 in pom.xml',
            'config.properties must be in src/test/resources/ for getResourceAsStream() to find it',
            '@BeforeSuite and @AfterSuite run once per suite — put ReportManager.initReports() and flush() there',
            'Test mvn clean test from a command line with no IDE — if it only works in IDE, Surefire is misconfigured'
          ],
          solution: `// Full pom.xml Surefire + ExtentReports:
<dependency>
  <groupId>com.aventstack</groupId>
  <artifactId>extentreports</artifactId>
  <version>5.1.1</version>
</dependency>

<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-surefire-plugin</artifactId>
  <version>3.2.5</version>
  <configuration>
    <suiteXmlFiles><suiteXmlFile>testng.xml</suiteXmlFile></suiteXmlFiles>
    <argLine>-Dfile.encoding=UTF-8</argLine>
  </configuration>
</plugin>

// ScreenshotUtil.java
public class ScreenshotUtil {
    public static String capture(WebDriver driver, String testName) {
        try {
            TakesScreenshot ts = (TakesScreenshot) driver;
            File src = ts.getScreenshotAs(OutputType.FILE);
            String ts2 = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String dest = "screenshots/" + testName + "_" + ts2 + ".png";
            new File("screenshots").mkdirs();
            Files.copy(src.toPath(), Path.of(dest), StandardCopyOption.REPLACE_EXISTING);
            return dest;
        } catch (Exception e) { return "screenshot-failed"; }
    }
}`
        },
        rubric: {
          totalPoints: 30,
          criteria: [
            { id: 'lab5_c1', label: 'config.properties in src/test/resources — ConfigReader loads it with getResourceAsStream() (not hardcoded file path)', points: 5 },
            { id: 'lab5_c2', label: 'DriverFactory reads browser and headless from ConfigReader — no browser name hardcoded in test or base class', points: 5 },
            { id: 'lab5_c3', label: 'ReportManager creates ExtentReports HTML at reportsPath — every test logged as Pass or Fail with message', points: 5 },
            { id: 'lab5_c4', label: 'Screenshot captured on failure and attached to ExtentReport via addScreenCaptureFromPath()', points: 5 },
            { id: 'lab5_c5', label: 'Maven Surefire configured in pom.xml with suiteXmlFile — mvn clean test runs all tests from terminal with no IDE', points: 5 },
            { id: 'lab5_c6', label: 'Framework passes with headless=true — tests produce same results headless as headed', points: 5 }
          ]
        },
        quiz: [
          { type: 'mcq', q: 'Where must config.properties be placed for getResourceAsStream("config.properties") to find it?', options: ['Project root directory', 'src/main/java/', 'src/test/resources/', 'src/test/java/utils/'], answer: 2 },
          { type: 'truefalse', q: '@BeforeSuite runs once before all tests in the suite — it is the correct place to initialise ExtentReports.', answer: true },
          { type: 'mcq', q: 'Which Maven plugin is responsible for running TestNG suites from pom.xml?', options: ['maven-compiler-plugin', 'maven-failsafe-plugin', 'maven-surefire-plugin', 'maven-testng-plugin'], answer: 2 },
          { type: 'fillin', q: 'The ExtentReports method that writes the final HTML file to disk is called _______.', answer: 'flush' }
        ]
      }
    ]
  }
];

// Merge into main CURRICULUM array
if (typeof CURRICULUM !== 'undefined') {
  CURRICULUM.push(...CURRICULUM_LABS);
}
