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
        description: 'Open pom.xml in your editor and replace the entire contents with the Maven config including REST Assured, TestNG, Allure, and Jackson dependencies.',
        commands: [],
        note: 'See the lesson content for the full pom.xml — copy it exactly.'
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
        description: 'Create src/test/resources/testng.xml with suite configuration for all 4 test classes.',
        commands: [],
        note: 'See the lesson content for the full testng.xml.'
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
        description: 'Create src/test/java/base/BaseTest.java with @BeforeClass setup, auth token retrieval, and AllureRestAssured filter.',
        commands: [],
        note: 'See the lesson content for the full BaseTest.java code.'
      },
      {
        step: 2,
        title: 'Create HealthCheckTest.java',
        description: 'Create src/test/java/tests/HealthCheckTest.java with ping endpoint and response time tests.',
        commands: [],
        note: 'See the lesson content for the full HealthCheckTest.java code.'
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
        description: 'Create src/test/java/tests/AuthTest.java with valid login, invalid password, and unauthorised access tests.',
        commands: [],
        note: 'See the lesson content for the full AuthTest.java code.'
      },
      {
        step: 5,
        title: 'Run All Tests So Far',
        description: 'Run the full suite via testng.xml:',
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
        description: 'Create src/test/java/utils/TestDataBuilder.java — this builds request body maps.',
        commands: [],
        note: 'See the lesson content for the full TestDataBuilder.java code.'
      },
      {
        step: 2,
        title: 'Create BookingCRUDTest.java',
        description: 'Create src/test/java/tests/BookingCRUDTest.java with 5 prioritised tests for the full CRUD lifecycle.',
        commands: [],
        note: 'See the lesson content for the full BookingCRUDTest.java code.'
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
        description: 'Create src/test/resources/booking-data.csv with 5 rows of guest booking data.',
        commands: [],
        note: 'See the lesson content for the CSV format.'
      },
      {
        step: 2,
        title: 'Create BookingDataDrivenTest.java',
        description: 'Create src/test/java/tests/BookingDataDrivenTest.java with inline DataProvider, CSV DataProvider, and search filter tests.',
        commands: [],
        note: 'See the lesson content for the full BookingDataDrivenTest.java code.'
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
          'echo "target/\n.idea/\n*.iml\nallure-results/" > .gitignore',
          'git add .',
          'git commit -m "feat: initial REST Assured test suite for Restful-Booker"'
        ],
        expectedOutput: '[main (root-commit) abc1234] feat: initial REST Assured test suite...',
        note: ''
      },
      {
        step: 2,
        title: 'Create GitHub Repository and Push',
        description: 'Go to github.com → New repository → Name: "restful-booker-tests" → Create. Then push your code.',
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
        description: 'In your GitHub repo: Settings → Secrets and variables → Actions → New repository secret.',
        commands: [],
        note: 'API_USERNAME = admin\nAPI_PASSWORD = password123\n\nThese are injected into the workflow at runtime — never committed to the repo.'
      },
      {
        step: 4,
        title: 'Create the GitHub Actions Workflow',
        description: 'Create .github/workflows/api-tests.yml with the full CI pipeline including test execution and Allure report upload.',
        commands: [],
        note: 'See the lesson content for the full workflow YAML.'
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
        description: 'After the workflow finishes (green checkmark): click the workflow run → Scroll to Artifacts → Download "allure-report-run-1".',
        commands: [],
        note: 'Unzip it and open index.html in your browser to see the full Allure report.'
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
    description: 'This capstone project ties together everything you have learned across all 5 modules. By the end you will have a GitHub repository with a complete, automated REST Assured test suite that runs on every push to main and generates Allure reports automatically.',
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
        description: 'Deliberately break one test, push to GitHub, capture the red CI run, then fix it and push again showing green'
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
        description: 'Add JSON schema validation using REST Assured json-schema-validator'
      },
      {
        title: 'Parallel Execution',
        description: 'Update testng.xml to run the Health Check and Auth test classes in parallel and verify no race conditions'
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

// ── Convert flat labs into curriculum module and push ─────────
(function() {
  const lessons = API_CURRICULUM_LABS.map(lab => {
    const stepsMarkdown = (lab.steps || []).map(s => {
      let md = `### Step ${s.step}: ${s.title}\n\n${s.description || ''}`;
      if (s.commands && s.commands.length) {
        md += '\n\n```java\n' + s.commands.join('\n') + '\n```';
      }
      if (s.expectedOutput) md += `\n\n**Expected Output:**\n\`\`\`\n${s.expectedOutput}\n\`\`\``;
      if (s.note) md += `\n\n> 💡 **Note:** ${s.note}`;
      return md;
    }).join('\n\n---\n\n');

    const content = `## 🎯 Objective\n\n${lab.objective}\n\n` +
      `## 📝 Lab Steps\n\n${stepsMarkdown}`;

    return {
      id: lab.id,
      title: lab.title,
      icon: lab.icon || '🌐',
      duration: lab.duration,
      difficulty: lab.difficulty,
      type: 'lab',
      objective: lab.objective,
      content: content,
      exercise: `## Your Task\n\nComplete the lab steps above in your local REST Assured / Java environment.\n\n**Objective:** ${lab.objective}\n\n**Difficulty:** ${lab.difficulty}`,
      evaluate: `## ✅ Evaluation Criteria\n\nReview your implementation against the lab objective:\n\n- All REST Assured test methods are implemented and pass\n- Assertions cover status codes, response body, and headers\n- Tests are well-structured and follow AAA (Arrange-Act-Assert) pattern\n- No hard-coded credentials or endpoints — use configuration\n\n**Objective achieved:** ${lab.objective}`
    };
  });

  API_CURRICULUM.push({
    id: 'api-labs-module',
    title: '🌐 Hands-On API Testing Labs',
    icon: '🌐',
    lessons: lessons
  });
})();
