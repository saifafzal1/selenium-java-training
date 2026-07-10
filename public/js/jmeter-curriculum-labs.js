// ── Module A: JMeter Performance Testing — Labs ───────────────────
// Standalone lab exercises and capstone project

const JMETER_CURRICULUM_LABS = [

  {
    id: 'jmeter-lab-1',
    title: 'Lab 1 — Your First JMeter Test',
    type: 'lab',
    duration: '30 min',
    difficulty: 'beginner',
    icon: '🧪',
    objective: 'Install JMeter, configure a Thread Group, and run your first HTTP load test against a public REST API.',
    prerequisites: ['Java 11+ installed', 'JMeter downloaded from jmeter.apache.org'],
    steps: [
      {
        step: 1,
        title: 'Install JMeter',
        instruction: `Download Apache JMeter 5.6.x from https://jmeter.apache.org/download_jmeter.cgi
Extract to a folder (e.g., ~/tools/apache-jmeter-5.6.3)
Launch: cd ~/tools/apache-jmeter-5.6.3/bin && ./jmeter (Mac/Linux) or jmeter.bat (Windows)`
      },
      {
        step: 2,
        title: 'Create a Test Plan',
        instruction: `In the JMeter GUI:
1. Right-click Test Plan → Add → Threads → Thread Group
2. Set: Number of Threads = 5, Ramp-Up = 10s, Loop Count = 3
3. Right-click Thread Group → Add → Sampler → HTTP Request
4. Set: Server Name = restful-booker.herokuapp.com, Protocol = https, Path = /booking, Method = GET
5. Right-click Thread Group → Add → Listener → View Results Tree
6. Right-click Thread Group → Add → Listener → Summary Report`
      },
      {
        step: 3,
        title: 'Run the Test',
        instruction: `Click the green Play button (or Ctrl+R)
Watch requests appear in View Results Tree — green = pass, red = fail
In Summary Report, check: # Samples, Average (ms), Error %`
      },
      {
        step: 4,
        title: 'Add an HTTP Header Manager',
        instruction: `Right-click HTTP Request → Add → Config Element → HTTP Header Manager
Add header: Name = Accept, Value = application/json
Re-run the test — the API should return JSON responses`
      },
      {
        step: 5,
        title: 'Add a Response Assertion',
        instruction: `Right-click HTTP Request → Add → Assertions → Response Assertion
Set: Field to Test = Response Code, Pattern = 200
Re-run — any non-200 response will fail red in View Results Tree`
      }
    ],
    deliverable: 'Screenshot showing: Thread Group config (5 users, 10s ramp, 3 loops) + Summary Report showing 15 requests, 0 errors, response time in ms.',
    solution: `Thread Group: 5 threads, 10s ramp, 3 loops → 15 total requests
HTTP Request: GET https://restful-booker.herokuapp.com/booking
Response Assertion: Response Code = 200
Expected result: 15 samples, ~0% error rate, avg response time 200-500ms`
  },

  {
    id: 'jmeter-lab-2',
    title: 'Lab 2 — Data-Driven Load Test with CSV',
    type: 'lab',
    duration: '40 min',
    difficulty: 'intermediate',
    icon: '📊',
    objective: 'Create a CRUD test plan where each virtual user reads unique booking data from a CSV file — simulating realistic varied load.',
    prerequisites: ['Completed Lab 1', 'JMeter running and familiar with Thread Group'],
    steps: [
      {
        step: 1,
        title: 'Create the CSV Data File',
        instruction: `Create bookings.csv in your project folder:

firstname,lastname,totalprice,depositpaid,checkin,checkout,additionalneeds
Alice,Smith,150,true,2026-08-01,2026-08-05,Breakfast
Bob,Jones,220,false,2026-08-10,2026-08-14,None
Carol,Brown,95,true,2026-08-20,2026-08-22,Late checkout
David,Wilson,310,true,2026-09-01,2026-09-07,Airport transfer
Eve,Taylor,175,false,2026-09-15,2026-09-18,Breakfast
Frank,Davis,260,true,2026-10-01,2026-10-04,None`
      },
      {
        step: 2,
        title: 'Configure CSV Data Set Config',
        instruction: `Right-click Thread Group → Add → Config Element → CSV Data Set Config
Set:
  Filename: /absolute/path/to/bookings.csv
  Variable Names: firstname,lastname,totalprice,depositpaid,checkin,checkout,additionalneeds
  Delimiter: ,
  Recycle on EOF: true
  Stop thread on EOF: false`
      },
      {
        step: 3,
        title: 'Create POST /auth to Get Token',
        instruction: `Add HTTP Request: POST /auth
Body (raw JSON):
{
  "username": "admin",
  "password": "password123"
}
Add JSON Extractor (Post Processor):
  Reference Name: authToken
  JSON Path: $.token
  Default Value: TOKEN_NOT_FOUND`
      },
      {
        step: 4,
        title: 'Create POST /booking with CSV Variables',
        instruction: `Add HTTP Request: POST /booking
Body Type: application/json
Body:
{
  "firstname": "\${firstname}",
  "lastname": "\${lastname}",
  "totalprice": \${totalprice},
  "depositpaid": \${depositpaid},
  "bookingdates": {
    "checkin": "\${checkin}",
    "checkout": "\${checkout}"
  },
  "additionalneeds": "\${additionalneeds}"
}
Add JSON Extractor: bookingId from $.bookingid`
      },
      {
        step: 5,
        title: 'Add GET and DELETE to Complete CRUD',
        instruction: `GET /booking/\${bookingId} — verify booking was created
Add JSON Assertion: $.firstname = \${firstname}

DELETE /booking/\${bookingId}
Add HTTP Header Manager: Cookie = token=\${authToken}
Add Response Assertion: Response Code = 201`
      },
      {
        step: 6,
        title: 'Run with 6 Users',
        instruction: `Thread Group: 6 users (one per CSV row), ramp 6s, 1 loop
Run → each user gets a unique CSV row
View Results Tree: all 4 requests (auth, POST, GET, DELETE) should be green for each user`
      }
    ],
    deliverable: 'View Results Tree screenshot showing 24 requests (6 users × 4 requests) all green, with Summary Report showing 0% error rate.',
    solution: `6 users × 4 requests = 24 total requests
Each user uses a different CSV row (Alice, Bob, Carol, David, Eve, Frank)
All bookings created, verified, then deleted — no residual test data
Expected: 24 samples, 0% error rate`
  },

  {
    id: 'jmeter-lab-3',
    title: 'Lab 3 — Correlation & Dynamic Token Extraction',
    type: 'lab',
    duration: '35 min',
    difficulty: 'intermediate',
    icon: '🔗',
    objective: 'Chain four requests where each response feeds the next — auth token → booking ID → verify → update — using JSON and Regex extractors.',
    prerequisites: ['Completed Lab 2', 'Understanding of variables in JMeter'],
    steps: [
      {
        step: 1,
        title: 'Design the Request Chain',
        instruction: `Plan your correlation chain:
1. POST /auth → extract token (JSON: $.token → \${token})
2. POST /booking → extract bookingid (JSON: $.bookingid → \${bookingId})
3. GET /booking/\${bookingId} → extract lastname using REGEX (not JSON Extractor)
4. PUT /booking/\${bookingId} → update firstname, verify 200`
      },
      {
        step: 2,
        title: 'Add Regular Expression Extractor to GET Request',
        instruction: `After GET /booking/\${bookingId}:
Right-click → Add → Post Processors → Regular Expression Extractor
  Reference Name: extractedLastname
  Regular Expression: "lastname":"([^"]+)"
  Template: $1$
  Match No: 1
  Default Value: LASTNAME_NOT_FOUND

Add a Debug Sampler after the GET to print \${extractedLastname} to View Results Tree`
      },
      {
        step: 3,
        title: 'Verify Extraction with Debug Sampler',
        instruction: `Right-click Thread Group → Add → Sampler → Debug Sampler
Enable: JMeter Variables = true
Run with 1 user — open the Debug Sampler in View Results Tree
Confirm you can see extractedLastname=Smith (or whatever lastname you used)`
      },
      {
        step: 4,
        title: 'PUT to Update the Booking',
        instruction: `Add HTTP Request: PUT /booking/\${bookingId}
Add HTTP Header Manager:
  Content-Type: application/json
  Cookie: token=\${token}

Body:
{
  "firstname": "UpdatedFirst",
  "lastname": "\${extractedLastname}",
  "totalprice": 999,
  "depositpaid": true,
  "bookingdates": { "checkin": "2026-08-01", "checkout": "2026-08-05" },
  "additionalneeds": "Correlated test"
}
Add Response Assertion: Response Code = 200`
      },
      {
        step: 5,
        title: 'Final GET to Verify Update',
        instruction: `Add GET /booking/\${bookingId}
Add JSON Assertion: $.firstname = UpdatedFirst
Add JSON Assertion: $.totalprice = 999

Remove the Debug Sampler
Run with 5 users, 2 loops — all should pass`
      }
    ],
    deliverable: 'View Results Tree showing full 5-step chain (auth, create, get, update, verify) for 5 users all green. Summary Report: 0% errors.',
    solution: `Each user: POST auth → POST booking → GET booking (regex extract lastname) → PUT update → GET verify
Total: 5 users × 5 requests = 25 requests
extractedLastname is passed from GET response into PUT body
All assertions pass, proving the correlation chain works`
  },

  {
    id: 'jmeter-lab-4',
    title: 'Lab 4 — Generate an HTML Performance Report',
    type: 'lab',
    duration: '25 min',
    difficulty: 'intermediate',
    icon: '📈',
    objective: 'Run your test plan in non-GUI CLI mode, generate a professional HTML performance report, and identify the slowest endpoint.',
    prerequisites: ['Completed Lab 2 or Lab 3', 'Terminal access', 'JMeter on PATH'],
    steps: [
      {
        step: 1,
        title: 'Prepare the Test Plan for CLI',
        instruction: `In JMeter GUI, update Thread Group to use properties:
  Number of Threads: \${__P(threads,10)}
  Ramp-Up: \${__P(rampup,30)}
  Duration: \${__P(duration,120)}
  Loop Count: -1 (infinite, controlled by duration)

Update HTTP Request server to: \${__P(host,restful-booker.herokuapp.com)}
Save the .jmx file`
      },
      {
        step: 2,
        title: 'Run in Non-GUI Mode',
        instruction: `Open Terminal and run:

mkdir -p results/html-report

jmeter -n \\
  -t test-plan.jmx \\
  -l results/results.jtl \\
  -e -o results/html-report \\
  -Jthreads=10 \\
  -Jrampup=20 \\
  -Jduration=60

Watch the output — you'll see progress lines like:
summary = 45 in 00:00:15 = 3.0/s Err: 0 (0.00%)`
      },
      {
        step: 3,
        title: 'Open the HTML Report',
        instruction: `open results/html-report/index.html (Mac)
start results\\html-report\\index.html (Windows)

Navigate to the Statistics table — you'll see per-endpoint breakdown`
      },
      {
        step: 4,
        title: 'Analyse the Report',
        instruction: `Answer these questions from the report:
1. What is the APDEX score?
2. Which endpoint has the highest average response time?
3. What is the p95 response time for POST /booking?
4. What is the overall throughput (requests/second)?
5. Is the error rate below 1%?`
      },
      {
        step: 5,
        title: 'Stress Test Comparison',
        instruction: `Delete html-report/ folder
Run again with 50 users, 30s ramp, 120s duration:

jmeter -n -t test-plan.jmx -l results/results.jtl -e -o results/html-report -Jthreads=50 -Jrampup=30 -Jduration=120

Compare: did p95 response time increase significantly?
A jump from 500ms at 10 users to 2000ms+ at 50 users = the server is approaching its limit`
      }
    ],
    deliverable: 'Two HTML report screenshots: 10 users and 50 users. Written comparison: APDEX, p95 at both load levels, which endpoint degrades first.',
    solution: `10 users: APDEX ~0.9, p95 ~400-600ms, error 0%
50 users: APDEX ~0.6-0.8, p95 ~800-2000ms (varies), error may rise
POST /booking usually degrades first (involves write, DB insert)
Slowdown pattern visible in "Response Times Over Time" chart`
  },

  {
    id: 'jmeter-capstone',
    title: 'Capstone — Full Performance Testing Pipeline',
    type: 'capstone',
    duration: '90 min',
    difficulty: 'advanced',
    icon: '🏆',
    objective: 'Design and execute a complete performance testing pipeline: data-driven load test → correlation → CLI execution → HTML report → GitHub Actions CI.',
    prerequisites: ['Completed Labs 1-4', 'GitHub account', 'Git installed'],
    description: `This capstone combines everything from Module A into a production-grade performance testing setup. You will build a complete test suite with CI/CD automation — the same setup used by professional QA engineers.`,
    requirements: [
      'Test Plan covers all CRUD operations (auth, create, read, update, delete)',
      'CSV Data Set with at least 10 booking records',
      'Correlation: token and bookingId extracted and chained',
      'Assertions: Response Code + JSON assertions on GET responses',
      'Duration Assertion: all requests must complete in under 3 seconds',
      'Gaussian Timer: 500-1500ms think time between requests',
      'CLI-parameterised: threads, rampup, duration, host all overridable',
      'HTML report generated and analysed',
      'GitHub Actions pipeline that: installs JMeter, runs 20 users for 120s, fails if error rate > 1%, uploads HTML report as artifact'
    ],
    stages: [
      {
        stage: 'A',
        title: 'Test Plan Design',
        tasks: [
          'Create bookings.csv with 10 unique booking records',
          'Build Thread Group with __P() properties for all numeric settings',
          'Add CSV Data Set Config, wired to all POST /booking variables',
          'Chain: POST /auth → POST /booking → GET /booking/id → PUT /booking/id → DELETE /booking/id',
          'Add Gaussian Timer (500ms target, 200ms deviation) to each request',
          'Add Duration Assertion (3000ms max) to each request'
        ]
      },
      {
        stage: 'B',
        title: 'Local Validation',
        tasks: [
          'Run in GUI mode with 1 user, 1 loop — fix any red requests',
          'Run in non-GUI CLI mode with 5 users, 60s duration',
          'Generate HTML report — screenshot APDEX and Statistics table',
          'Run stress test with 50 users — compare p95 vs 5-user run'
        ]
      },
      {
        stage: 'C',
        title: 'GitHub Actions Pipeline',
        tasks: [
          'Create GitHub repository and push: test-plan.jmx, bookings.csv',
          'Create .github/workflows/performance.yml',
          'Pipeline: checkout → setup Java → install JMeter → run test → check errors → upload report',
          'Push and verify pipeline goes GREEN in GitHub Actions tab',
          'Screenshot: GitHub Actions green run + artifact download button'
        ]
      },
      {
        stage: 'D',
        title: 'Performance Report',
        tasks: [
          'Download the artifact from the GitHub Actions run',
          'Open html-report/index.html',
          'Document findings: APDEX, p95 per endpoint, throughput, error rate',
          'Identify which endpoint is the performance bottleneck and why'
        ]
      }
    ],
    gradingCriteria: {
      pass: 'All 5 CRUD requests pass for 20 users, GitHub Actions green, HTML report generated, error rate < 1%',
      distinction: 'All above + nightly schedule added to workflow + performance comparison table (5 vs 20 vs 50 users) documented in README'
    },
    sampleReport: `Performance Test Report — Restful-Booker API
==============================================
Date: 2026-08-01
Environment: GitHub Actions (ubuntu-latest)
Load: 20 users, 30s ramp, 120s duration

APDEX: 0.85 (Good)

Endpoint              Samples  Avg(ms)  p95(ms)  Error%  Throughput
POST /auth            360      145      280      0.00%   3.0/sec
POST /booking         360      380      720      0.28%   3.0/sec
GET /booking/{id}     360      210      410      0.00%   3.0/sec
PUT /booking/{id}     360      320      650      0.00%   3.0/sec
DELETE /booking/{id}  360      170      330      0.00%   3.0/sec
TOTAL                 1800     245      640      0.06%   15.0/sec

Finding: POST /booking is the slowest endpoint (p95=720ms) — involves
a database write. Consider connection pool tuning for higher loads.
`
  }

];

// ── Convert flat labs into curriculum module and push ─────────
(function() {
  const lessons = JMETER_CURRICULUM_LABS.map(lab => {
    // Build markdown content from steps
    const stepsMarkdown = (lab.steps || []).map(s =>
      `### Step ${s.step}: ${s.title}\n\n${s.instruction}`
    ).join('\n\n---\n\n');

    const content = `## 🎯 Objective\n\n${lab.objective}\n\n` +
      (lab.prerequisites ? `## 📋 Prerequisites\n\n${lab.prerequisites.map(p => `- ${p}`).join('\n')}\n\n` : '') +
      `## 📝 Lab Steps\n\n${stepsMarkdown}` +
      (lab.deliverable ? `\n\n## 📦 Deliverable\n\n${lab.deliverable}` : '') +
      (lab.solution ? `\n\n## ✅ Solution Overview\n\n${lab.solution}` : '');

    return {
      id: lab.id,
      title: lab.title,
      icon: lab.icon || '🧪',
      duration: lab.duration,
      difficulty: lab.difficulty,
      type: 'lab',
      objective: lab.objective,
      content: content,
      exercise: `## Your Task\n\nComplete the lab steps above in your local JMeter environment.\n\n**Deliverable:** ${lab.deliverable || 'Working JMeter test plan achieving the stated objective.'}\n\n**Difficulty:** ${lab.difficulty}`,
      evaluate: `## ✅ Evaluation Criteria\n\n${lab.solution || 'Review your test plan against the lab objectives and verify expected results.'}` 
    };
  });

  JMETER_CURRICULUM.push({
    id: 'jmeter-labs-module',
    title: '🧪 Hands-On JMeter Labs',
    icon: '🧪',
    lessons: lessons
  });
})();
