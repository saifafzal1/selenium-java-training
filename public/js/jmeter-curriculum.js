// ── Module A: JMeter Performance Testing (Modules 0-2) ───────────
// Modules 3-4 added by jmeter-curriculum-advanced.js

const JMETER_CURRICULUM = [

  // MODULE 0 — Introduction
  {
    id: 'jmeter-module-0',
    title: 'Welcome to Performance Testing',
    icon: '⚡',
    lessons: [
      {
        id: 'jmeter-l0',
        title: 'What is Performance Testing? — Types, Goals & Metrics',
        type: 'lesson',
        duration: '20 min',
        whatYoullLearn: [
          'The difference between load, stress, spike, and endurance testing',
          'Key performance metrics: response time, throughput, error rate, concurrency',
          'Why performance testing matters and when to do it',
          'What Apache JMeter is and why it is the industry standard',
          'How this course is structured and what you will build'
        ],
        content: `
## ⚡ What is Performance Testing?

Performance testing answers one critical question: **"Does the application behave acceptably under real-world load?"**

Without performance testing, you might ship a web app that works perfectly for one user but crashes when 100 users log in simultaneously.

---

### 🔺 Types of Performance Tests

| Type | What it simulates | Goal |
|---|---|---|
| **Load Test** | Expected user traffic (e.g., 500 concurrent users) | Verify the system handles normal load |
| **Stress Test** | Beyond normal capacity (e.g., 5000 users) | Find the breaking point |
| **Spike Test** | Sudden burst of traffic (e.g., flash sale) | Verify recovery after sudden load |
| **Endurance Test** | Sustained load over hours | Find memory leaks, connection pool exhaustion |
| **Scalability Test** | Incrementally increasing load | Find where performance degrades |

---

### 📊 Key Metrics to Measure

\`\`\`
Response Time    — How long does ONE request take? (target: < 2 seconds)
Throughput       — How many requests per second can the server handle?
Error Rate       — What % of requests return errors? (target: < 1%)
Concurrent Users — How many simultaneous users are active?
95th Percentile  — 95% of requests finish within this time (better than average)
\`\`\`

**Why 95th percentile?** Average response time is misleading — a few very slow requests drag the average up. The 95th percentile tells you what the slowest 5% of users experience.

---

### 🔧 What is Apache JMeter?

**Apache JMeter** is the most widely used open-source performance testing tool. It is:
- **Free** — Apache License 2.0
- **Protocol-agnostic** — HTTP, HTTPS, REST, SOAP, FTP, JDBC, JMS
- **GUI + CLI** — design tests in the GUI, run them in headless mode for CI/CD
- **Extensible** — hundreds of plugins for advanced scenarios

\`\`\`
JMeter simulates multiple users hitting your server simultaneously,
measures how it responds, and produces detailed reports.
\`\`\`

---

### 🏗️ What You Will Build

By the end of this course you will have:
- A JMeter test plan that load-tests a real REST API
- Parameterised tests with CSV data (different users, different payloads)
- Custom assertions that fail when response time exceeds a threshold
- HTML performance reports generated automatically
- A GitHub Actions pipeline that runs your performance tests in CI

---

### 📋 The Performance Testing Workflow

\`\`\`
1. Define goals       → "p95 response < 2s at 200 concurrent users"
2. Design test plan   → Thread groups, HTTP samplers, assertions
3. Baseline run       → Run with 1 user to verify the test plan works
4. Load test run      → Scale to target users, capture results
5. Analyse report     → Find bottlenecks, errors, slow endpoints
6. Fix & re-test      → Repeat until goals are met
\`\`\`
`,
        exercise: {
          title: 'Define Performance Goals for an Application',
          task: `Choose a web application you use (or the Restful-Booker API from the API Testing module).

Define its performance requirements:
1. Expected concurrent users during normal hours
2. Peak concurrent users (e.g., during a sale or launch)
3. Acceptable response time (p95 target in milliseconds)
4. Acceptable error rate (%)
5. Which 3 endpoints are most critical to test first?

Write your goals as an Acceptance Criteria table and paste it into the AI chat. Ask: "Are these performance goals realistic and complete?"`,
          hints: [
            'For a small e-commerce site: 200 concurrent users normal, 2000 peak, p95 < 3s, error rate < 0.5%',
            'The most critical endpoints are usually: login, product search, and checkout',
            'Always test with PRODUCTION-LIKE data volumes — testing with 10 rows when prod has 10 million rows gives false confidence'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'A load test runs with 200 concurrent users and 3% of requests return HTTP 500 errors. What does this tell you?',
            options: [
              'The test is invalid — errors should be excluded from results',
              'The server is struggling under load — the 3% error rate exceeds the typical 1% threshold',
              'The test needs more users to be meaningful',
              '3% error rate is acceptable for performance tests'
            ],
            answer: 1
          },
          {
            type: 'mcq',
            q: 'Why is the 95th percentile (p95) response time more useful than the average response time?',
            options: [
              'p95 is easier to calculate than the average',
              'Average hides outliers — p95 shows what the slowest 5% of users actually experience',
              'p95 always produces a lower number, making results look better',
              'JMeter cannot calculate averages correctly'
            ],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'A stress test is designed to simulate expected normal traffic to verify the system handles it correctly.',
            answer: false
          },
          {
            type: 'fillin',
            q: 'An _______ test runs sustained load over many hours to detect memory leaks and connection pool exhaustion.',
            answer: 'endurance'
          }
        ]
      }
    ]
  },

  // MODULE 1 — JMeter Foundations
  {
    id: 'jmeter-module-1',
    title: 'JMeter Foundations',
    icon: '🔧',
    lessons: [
      {
        id: 'jmeter-l1',
        title: 'Installing JMeter & Your First Test Plan',
        type: 'lesson',
        duration: '30 min',
        whatYoullLearn: [
          'Install Java 21 and Apache JMeter on your machine',
          'Navigate the JMeter GUI — Test Plan, Thread Groups, Samplers',
          'Create a basic HTTP test plan from scratch',
          'Add a View Results Tree listener to see request/response details',
          'Run your first performance test and read the results'
        ],
        content: `
## 🔧 Installing JMeter & Your First Test Plan

### 📋 Prerequisites

JMeter requires Java. Install Java 21 first:

\`\`\`bash
# macOS (Homebrew)
brew install openjdk@21

# Windows — download from https://adoptium.net
# Linux
sudo apt install openjdk-21-jdk

# Verify
java -version  # should print: openjdk version "21..."
\`\`\`

---

### ⬇️ Install JMeter

\`\`\`bash
# Download from https://jmeter.apache.org/download_jmeter.cgi
# Download: apache-jmeter-5.6.3.zip (or latest)

# Extract and run:
cd apache-jmeter-5.6.3/bin

# macOS / Linux:
./jmeter.sh

# Windows:
jmeter.bat
\`\`\`

The JMeter GUI opens. It looks complex at first — but there are only 5 things you need to know:

---

### 🗺️ JMeter GUI — The 5 Key Elements

\`\`\`
Test Plan                  ← Root node — your test
└── Thread Group           ← Simulates N users
    ├── HTTP Request       ← One API call (sampler)
    ├── HTTP Header Mgr    ← Set headers (e.g. Content-Type)
    ├── CSV Data Set       ← Read test data from a file
    ├── Assertion          ← Validate the response
    └── Listener           ← View/record results
\`\`\`

---

### 🏗️ Create Your First Test Plan

**Step 1: Add a Thread Group**
- Right-click "Test Plan" → Add → Threads (Users) → Thread Group
- Set: Number of Threads = 5, Ramp-Up Period = 5, Loop Count = 3

| Setting | Value | Meaning |
|---|---|---|
| Number of Threads | 5 | 5 simulated users |
| Ramp-Up Period | 5 | Spread user start over 5 seconds |
| Loop Count | 3 | Each user makes 3 requests |

Total requests = 5 × 3 = **15 requests**

---

**Step 2: Add an HTTP Request Sampler**
- Right-click Thread Group → Add → Sampler → HTTP Request
- Set:
  - Protocol: \`https\`
  - Server Name: \`restful-booker.herokuapp.com\`
  - Method: \`GET\`
  - Path: \`/booking\`

---

**Step 3: Add a View Results Tree**
- Right-click Thread Group → Add → Listener → View Results Tree
- This shows every request/response — green = pass, red = fail

---

**Step 4: Run the Test**
- Click the green ▶ Play button
- Watch requests appear in View Results Tree
- Click any request → Response Data tab to see the JSON response

---

### 📊 Reading Results

\`\`\`
✅ HTTP Request — GET /booking — 287ms — 200 OK
✅ HTTP Request — GET /booking — 312ms — 200 OK
✅ HTTP Request — GET /booking — 298ms — 200 OK
\`\`\`

Green = response received. The number is the response time in milliseconds.
`,
        exercise: {
          title: 'Create Your First JMeter Test Plan',
          task: `1. Install Java 21 (verify with java -version)
2. Download and extract Apache JMeter 5.6.3
3. Launch JMeter GUI (jmeter.sh or jmeter.bat)
4. Create a test plan with:
   - Thread Group: 10 users, 10s ramp-up, 2 loops
   - HTTP Request: GET https://restful-booker.herokuapp.com/booking
   - View Results Tree listener
5. Run the test (▶ button)
6. Take a screenshot of the View Results Tree showing green requests

Bonus: Add a second HTTP Request for GET /booking/1 and run both in the same Thread Group.`,
          hints: [
            'If the GUI does not open, check that JAVA_HOME is set correctly',
            'Save your test plan as a .jmx file (File → Save) — you will need it in later lessons',
            'The "ramp-up period" means JMeter waits ramp-up/threads seconds between starting each user — 10 users, 10s ramp = 1 new user per second'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'In a Thread Group with 10 users, 5s ramp-up, and 4 loops, how many total HTTP requests are sent?',
            options: ['10', '20', '40', '50'],
            answer: 2
          },
          {
            type: 'mcq',
            q: 'What is the purpose of the "Ramp-Up Period" in a Thread Group?',
            options: [
              'It pauses all threads for that many seconds before starting',
              'It spreads the start of threads over the specified time — preventing all users hitting the server simultaneously at second 0',
              'It is the total duration the test runs for',
              'It limits the maximum response time before a request is counted as failed'
            ],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'The "View Results Tree" listener is suitable for high-load production performance tests because it shows detailed request/response data.',
            answer: false
          },
          {
            type: 'fillin',
            q: 'JMeter test plans are saved as _______ files (XML format).',
            answer: '.jmx'
          }
        ]
      },

      {
        id: 'jmeter-l2',
        title: 'Thread Groups, Samplers & Listeners — The Core Building Blocks',
        type: 'lesson',
        duration: '35 min',
        whatYoullLearn: [
          'Understand the different types of Thread Groups and when to use each',
          'Work with the most important JMeter samplers',
          'Configure the Summary Report and Aggregate Report listeners',
          'Add HTTP Header Manager for REST API tests',
          'Interpret throughput, average, min, max, and error % in reports'
        ],
        content: `
## 🧱 Thread Groups, Samplers & Listeners

These three elements are the backbone of every JMeter test plan.

---

### 🧵 Thread Groups — Controlling Users

**Standard Thread Group** — most common:
\`\`\`
Number of Threads: 100   ← virtual users
Ramp-Up Period:    60    ← add 1 user every 0.6 seconds
Loop Count:        10    ← each user makes 10 request cycles
Duration (s):      300   ← OR run for 5 minutes (check "Forever" + set scheduler)
\`\`\`

**Ultimate Thread Group** (JMeter Plugins required):
\`\`\`
Start Threads Count | Initial Delay | Startup Time | Hold Load For | Stop Time
         50         |      0s       |    30s       |     5m        |   10s
\`\`\`
More realistic — ramps up, holds, then ramps down. Requires the Plugins Manager.

---

### 📡 Samplers — Making Requests

| Sampler | Protocol | Use Case |
|---|---|---|
| HTTP Request | HTTP/HTTPS | REST APIs, web pages |
| JDBC Request | Database | SQL queries under load |
| Java Request | Java | Custom Java code |
| JMS Publisher | JMS | Message queues |
| TCP Sampler | TCP | Raw socket connections |

**HTTP Request — key fields:**

\`\`\`
Protocol: https
Server Name: restful-booker.herokuapp.com
Port: 443
Method: POST
Path: /booking
Body Data: {"firstname":"Alice","lastname":"Smith","totalprice":100,"depositpaid":true,"bookingdates":{"checkin":"2026-01-01","checkout":"2026-01-07"}}
\`\`\`

Always add an **HTTP Header Manager** as a child of the HTTP Request:
\`\`\`
Name: Content-Type    Value: application/json
Name: Accept          Value: application/json
\`\`\`

---

### 📊 Listeners — Viewing Results

**Never use View Results Tree in load tests** — it stores every response in memory and will crash JMeter for large tests.

| Listener | When to use | What it shows |
|---|---|---|
| Summary Report | Always | Aggregate stats per sampler |
| Aggregate Report | Load tests | + percentiles (90%, 95%, 99%) |
| View Results Tree | Debug only | Full request/response per call |
| Response Time Graph | Trend analysis | Response time over time |
| Active Threads Over Time | Plugins | Thread count over time |

---

### 📋 Reading the Summary Report

\`\`\`
Label          #Samples  Average  Min   Max   90%   Error%  Throughput
GET /booking   1000      287ms    95ms  2340ms 450ms  0.20%  42.3/sec
POST /booking  1000      412ms    123ms 3210ms 680ms  0.10%  28.1/sec
TOTAL          2000      349ms    95ms  3210ms 560ms  0.15%  70.4/sec
\`\`\`

| Column | Meaning |
|---|---|
| #Samples | Total requests sent |
| Average | Mean response time |
| 90% | 90th percentile — 90% of requests finish within this |
| Error% | % of requests that returned an error |
| Throughput | Requests per second the server handled |
`,
        exercise: {
          title: 'Build a Multi-Endpoint Load Test',
          task: `Extend your previous test plan with multiple samplers:

1. Thread Group: 20 users, 20s ramp-up, Loop Count = 5
2. HTTP Request 1: GET /booking (get all bookings)
3. HTTP Request 2: POST /booking (create a booking — add body + Header Manager)
4. HTTP Request 3: GET /booking/1 (get a specific booking)
5. Add: Summary Report listener
6. Add: Aggregate Report listener
7. Run the test
8. Screenshot the Aggregate Report showing all 3 endpoints with their p90 response times

Goal: all endpoints should show Error% = 0 and throughput > 5/sec.`,
          hints: [
            'Add the HTTP Header Manager as a child of the POST sampler, not at the Thread Group level (unless all requests need the same headers)',
            'Set POST body as raw JSON in the "Body Data" tab of the HTTP Request sampler',
            'Save your .jmx file after every change — JMeter has no autosave'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'Why should you NOT use the "View Results Tree" listener during a 500-user load test?',
            options: [
              'View Results Tree only works with GET requests',
              'It stores every request and response in memory — with 500 users, this can exhaust RAM and crash JMeter',
              'View Results Tree does not work with HTTP samplers',
              'It is too slow to process results in real time'
            ],
            answer: 1
          },
          {
            type: 'mcq',
            q: 'In the Aggregate Report, the "90%" column shows:',
            options: [
              '90% of the requests that completed successfully',
              'The response time within which 90% of requests completed — faster than the max, more honest than the average',
              'The target response time you set as a goal',
              'The throughput achieved for the top 90% of samplers'
            ],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'An HTTP Header Manager added as a child of a Thread Group applies its headers to ALL HTTP Request samplers inside that Thread Group.',
            answer: true
          },
          {
            type: 'fillin',
            q: 'The _______ listener shows throughput, average, percentiles, and error rate for each sampler — the standard report for load test results.',
            answer: 'Aggregate Report'
          }
        ]
      },

      {
        id: 'jmeter-l3',
        title: 'Testing a REST API — POST, PUT, DELETE with JSON',
        type: 'lesson',
        duration: '35 min',
        whatYoullLearn: [
          'Configure JMeter to test a full REST API CRUD workflow',
          'Send POST requests with JSON bodies',
          'Extract values from JSON responses using JSON Extractor',
          'Chain requests — use the booking ID from POST in subsequent GET/DELETE',
          'Add an HTTP Cookie Manager for session-based APIs'
        ],
        content: `
## 🔌 Testing a REST API — POST, PUT, DELETE with JSON

A realistic API load test doesn't just GET the same endpoint 1000 times. It simulates real user behaviour: login → create resource → update it → delete it.

---

### 🔑 Step 1 — Authenticate (POST /auth)

\`\`\`
Method: POST
Path: /auth
Header: Content-Type: application/json
Body:
{
  "username": "admin",
  "password": "password123"
}
\`\`\`

Add a **JSON Extractor** as a child of this sampler to capture the token:
\`\`\`
Name of created variable: authToken
JSON Path expression: $.token
Match No: 1
Default Value: TOKEN_NOT_FOUND
\`\`\`

Now \`\${authToken}\` is available in all subsequent samplers.

---

### 📝 Step 2 — Create a Booking (POST /booking)

\`\`\`
Method: POST
Path: /booking
Headers:
  Content-Type: application/json
  Accept: application/json
Body:
{
  "firstname": "LoadTest",
  "lastname": "User",
  "totalprice": 150,
  "depositpaid": true,
  "bookingdates": {
    "checkin": "2026-09-01",
    "checkout": "2026-09-07"
  }
}
\`\`\`

Add another **JSON Extractor** to capture the booking ID:
\`\`\`
Name of created variable: bookingId
JSON Path expression: $.bookingid
\`\`\`

---

### 🔍 Step 3 — Get the Booking (GET /booking/\${bookingId})

\`\`\`
Method: GET
Path: /booking/\${bookingId}
\`\`\`

JMeter substitutes \`\${bookingId}\` with the value extracted from the POST response. Each thread (user) gets its own bookingId — thread-safe by default.

---

### 🗑️ Step 4 — Delete the Booking (DELETE /booking/\${bookingId})

\`\`\`
Method: DELETE
Path: /booking/\${bookingId}
Headers:
  Cookie: token=\${authToken}
\`\`\`

---

### 🔗 Full Flow in JMeter

\`\`\`
Thread Group (50 users, 60s ramp, 5 loops)
├── POST /auth              ← gets authToken
│   └── JSON Extractor: authToken = $.token
├── POST /booking           ← creates booking
│   └── JSON Extractor: bookingId = $.bookingid
├── GET /booking/\${bookingId}  ← reads it back
├── DELETE /booking/\${bookingId} ← cleans up
└── Aggregate Report
\`\`\`

This is a **realistic user journey** — each virtual user goes through the full CRUD cycle. With 50 users × 5 loops = 250 complete CRUD cycles under load.

---

### 🍪 HTTP Cookie Manager

For session-based apps (not token-based), add:
- Right-click Thread Group → Add → Config Element → HTTP Cookie Manager
- Leave defaults — JMeter automatically stores and replays cookies (like a browser)
`,
        exercise: {
          title: 'Build a Full CRUD REST API Load Test',
          task: `Build a complete CRUD workflow test plan:

1. Thread Group: 10 users, 30s ramp, 3 loops
2. POST /auth → extract authToken with JSON Extractor
3. POST /booking → extract bookingId with JSON Extractor
4. GET /booking/\${bookingId} — verify it returns 200
5. DELETE /booking/\${bookingId} with Cookie: token=\${authToken}
6. Add Aggregate Report listener

Run and verify:
- All 4 samplers show 0% error rate
- bookingId is different for each thread (check View Results Tree on a 2-user test)
- Throughput > 3 CRUD cycles/sec at 10 users

Screenshot the Aggregate Report showing all 4 endpoints.`,
          hints: [
            'Test with 1 user first — if the JSON Extractor cannot find the token, check the JSON path with an online JSON path tester (jsonpath.com)',
            'If DELETE returns 403, the authToken extraction may have failed — the default value TOKEN_NOT_FOUND will be used',
            'JMeter variables are thread-local — each virtual user has its own authToken and bookingId'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'What does the JSON Extractor do in JMeter?',
            options: [
              'It validates that the JSON response matches a schema',
              'It parses a JSON response and saves a value (like an ID or token) into a JMeter variable for use in later requests',
              'It converts the request body from XML to JSON automatically',
              'It reformats JSON responses for the Aggregate Report'
            ],
            answer: 1
          },
          {
            type: 'mcq',
            q: 'In a Thread Group with 50 threads, each thread extracts a bookingId from a POST response. How many different bookingId values will be in use simultaneously?',
            options: ['1 — JMeter shares variables across threads', '50 — each thread has its own variable scope', '25 — half the threads share each value', 'It depends on the ramp-up period'],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'The JSON Path expression $.token extracts the value of the "token" field from the root of a JSON response object.',
            answer: true
          },
          {
            type: 'fillin',
            q: 'To reference a JMeter variable called "bookingId" inside an HTTP Request path, you write _______ .',
            answer: '${bookingId}'
          }
        ]
      }
    ]
  },

  // MODULE 2 — Test Design Patterns
  {
    id: 'jmeter-module-2',
    title: 'Test Design Patterns',
    icon: '📐',
    lessons: [
      {
        id: 'jmeter-l4',
        title: 'Assertions — Validating Responses Under Load',
        type: 'lesson',
        duration: '30 min',
        whatYoullLearn: [
          'Add Response Assertion to validate HTTP status codes',
          'Add JSON Assertion to validate response body fields',
          'Add Duration Assertion to fail requests that exceed a time threshold',
          'Add Size Assertion to catch unexpectedly large or small responses',
          'Understand how assertion failures appear in reports'
        ],
        content: `
## ✅ Assertions — Validating Responses Under Load

In a functional test, you assert that each response is correct. In a performance test, you also assert that responses arrive fast enough. JMeter assertions do both.

**Without assertions:** a response of \`{ "error": "DB connection failed" }\` with HTTP 200 would count as a PASS.
**With assertions:** JMeter catches it and marks it as a FAIL.

---

### 🔴 Response Assertion — HTTP Status Code

Right-click HTTP Request → Add → Assertions → Response Assertion

\`\`\`
Apply to: Main sample only
Response Field to Test: Response Code
Pattern Matching Rules: Equals
Patterns to Test: 200
\`\`\`

For POST /booking, the Restful-Booker API returns 200 (not 201). Adjust per your API.

---

### 🔍 JSON Assertion — Validate Response Body

Right-click HTTP Request → Add → Assertions → JSON Assertion

\`\`\`
Assert JSON Path exists: $.bookingid
Additionally assert value: (checked)
Expected Value: (leave blank to just check it exists and is not null)
\`\`\`

For a specific value:
\`\`\`
Assert JSON Path exists: $.firstname
Expected Value: LoadTest
\`\`\`

---

### ⏱️ Duration Assertion — Catch Slow Responses

Right-click HTTP Request → Add → Assertions → Duration Assertion

\`\`\`
Duration in milliseconds: 2000
\`\`\`

Any response taking more than 2 seconds is marked as FAILED. This appears in the Aggregate Report's Error% column — letting you set a performance SLA directly in the test plan.

\`\`\`
Label              Error%   ← before duration assertion
GET /booking       0.00%

Label              Error%   ← after adding 2000ms duration assertion
GET /booking       4.50%    ← 4.5% of responses were too slow
\`\`\`

---

### 📏 Size Assertion — Catch Empty or Truncated Responses

\`\`\`
Apply to: Main sample only
Response Size Field to Test: Response Body
Type of Comparison: > (greater than)
Size in bytes: 10
\`\`\`

Catches responses like \`{}\` or \`[]\` that might indicate the server returned empty data under load.

---

### 🏗️ Assertion Best Practices

| What to assert | Assertion type | Why |
|---|---|---|
| HTTP 200 / 201 | Response Assertion | Catch redirects, 5xx under load |
| Response time SLA | Duration Assertion | Enforce performance contract |
| Key field in response | JSON Assertion | Catch empty/error JSON |
| Response size > 10 bytes | Size Assertion | Catch truncated responses |
`,
        exercise: {
          title: 'Add Assertions to Your CRUD Test Plan',
          task: `Enhance your CRUD test plan from Lesson 3 with assertions:

1. POST /auth — Response Assertion: status code = 200
2. POST /auth — JSON Assertion: $.token exists
3. POST /booking — Response Assertion: status code = 200
4. POST /booking — Duration Assertion: < 3000ms
5. GET /booking/\${bookingId} — Response Assertion: status code = 200
6. GET /booking/\${bookingId} — JSON Assertion: $.firstname = "LoadTest"
7. DELETE /booking/\${bookingId} — Response Assertion: status code = 201

Run with 5 users, 3 loops. Screenshot the Aggregate Report:
- All Error% should be 0% if assertions pass
- Temporarily set Duration Assertion to 1ms — screenshot showing failures appear in Error%
- Restore to 3000ms`,
          hints: [
            'Each assertion is a child of the HTTP Request it validates — right-click the sampler, not the Thread Group',
            'Multiple assertions on one sampler all must pass — if any fails, the request is marked FAILED',
            'The Duration Assertion counts against the same Error% as HTTP errors — there is no separate column'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'A GET /api/data request returns HTTP 200 with body "{}". You want JMeter to mark this as a failure. Which assertion should you use?',
            options: [
              'Response Assertion checking status code = 200 (it already passes)',
              'Size Assertion checking response body size > 10 bytes — "{}" is only 2 bytes, so it fails',
              'Duration Assertion with 0ms threshold',
              'JSON Assertion checking $.data exists — "{}" has no "data" field, so it fails'
            ],
            answer: 3
          },
          {
            type: 'mcq',
            q: 'You set a Duration Assertion of 2000ms. 150 out of 1000 requests take longer than 2 seconds. What does the Aggregate Report show?',
            options: [
              'Error% = 15% — those 150 requests are marked as failures',
              'Error% = 0% — Duration Assertions do not affect the error count',
              'Error% = 2000% — one per millisecond exceeded',
              'The test plan stops after the first violation'
            ],
            answer: 0
          },
          {
            type: 'truefalse',
            q: 'A Response Assertion checking status code = 200 will mark a request as FAILED if the server returns HTTP 201.',
            answer: true
          },
          {
            type: 'fillin',
            q: 'To enforce a maximum response time SLA in your JMeter test plan, add a _______ Assertion to each HTTP Request.',
            answer: 'Duration'
          }
        ]
      },

      {
        id: 'jmeter-l5',
        title: 'CSV Data Sets — Parameterising Tests with Real Data',
        type: 'lesson',
        duration: '30 min',
        whatYoullLearn: [
          'What parameterisation is and why it matters for realistic load tests',
          'Create a CSV file with test data for different users',
          'Configure CSV Data Set Config in JMeter',
          'Use CSV variables in HTTP Request bodies and paths',
          'Understand sharing modes — All Threads vs Current Thread Group'
        ],
        content: `
## 📋 CSV Data Sets — Parameterising Tests with Real Data

A load test where 100 users all POST the same JSON body is unrealistic. A real server handles varied data — different users, different prices, different dates.

**CSV Data Set Config** reads a CSV file and assigns each row to a virtual user, making your test data-driven.

---

### 📄 Create a CSV File

\`\`\`csv
# bookings.csv
firstName,lastName,price,checkin,checkout
Alice,Smith,150,2026-01-10,2026-01-17
Bob,Jones,320,2026-02-01,2026-02-05
Charlie,Brown,500,2026-03-15,2026-03-20
Diana,Prince,250,2026-04-01,2026-04-07
Eve,Wilson,180,2026-05-10,2026-05-14
Frank,Miller,420,2026-06-01,2026-06-07
Grace,Taylor,90,2026-07-20,2026-07-25
Henry,Davis,700,2026-08-01,2026-08-10
\`\`\`

Save this as \`bookings.csv\` in your JMeter bin/ folder (or use an absolute path).

---

### ⚙️ Configure CSV Data Set Config

Right-click Thread Group → Add → Config Element → CSV Data Set Config

\`\`\`
Filename:          bookings.csv
Variable Names:    firstName,lastName,price,checkin,checkout
Delimiter:         ,
Allow quoted data? True
Recycle on EOF?    True     ← loop back to row 1 when file is exhausted
Stop thread on EOF? False
Sharing mode:      All threads  ← each row given to one thread at a time
\`\`\`

---

### 🔀 Use Variables in the HTTP Request

In the POST /booking Body Data:
\`\`\`json
{
  "firstname": "\${firstName}",
  "lastname": "\${lastName}",
  "totalprice": \${price},
  "depositpaid": true,
  "bookingdates": {
    "checkin": "\${checkin}",
    "checkout": "\${checkout}"
  }
}
\`\`\`

Now each virtual user sends a different payload. With 100 users and 8 rows in the CSV:
- Rows are distributed round-robin across threads
- Row 1 → Thread 1, Row 2 → Thread 2, ..., Row 8 → Thread 8, Row 1 → Thread 9 (recycle)

---

### 📧 CSV for User Credentials

\`\`\`csv
# users.csv
username,password
admin,password123
user2,pass456
user3,secure789
\`\`\`

In POST /auth body:
\`\`\`json
{ "username": "\${username}", "password": "\${password}" }
\`\`\`

---

### 🔧 Sharing Modes Explained

| Mode | Behaviour | Use when |
|---|---|---|
| All threads | One shared pointer; each thread gets the next row | Simulating unique users |
| Current thread group | Each thread group has its own pointer | Multiple thread groups with different users |
| Current thread | Each thread starts at row 1 independently | Each user repeats the full dataset |
`,
        exercise: {
          title: 'Build a Parameterised Booking Load Test',
          task: `1. Create bookings.csv with 10 rows of booking data (different names, prices, dates)
2. Add CSV Data Set Config to your test plan, pointing to the file
3. Update POST /booking body to use \${firstName}, \${lastName}, \${price}, \${checkin}, \${checkout}
4. Run with 20 users, 10s ramp, 3 loops
5. In View Results Tree (2-user test first), verify each user sends different data
6. In Aggregate Report (20 users), verify Error% = 0%

Bonus: Create a second CSV file with 5 username/password pairs and use it in POST /auth.`,
          hints: [
            'Put the CSV file in the same directory as your .jmx file and use just the filename (no path) — JMeter resolves relative paths from the .jmx location',
            'If you see ${firstName} literally in the request body, check that the CSV Data Set Config is at the Thread Group level (not inside a specific sampler)',
            'With "Recycle on EOF = True", a 10-row CSV with 25 users will cycle: users 11-20 repeat rows 1-10, users 21-25 repeat rows 1-5'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'You have a CSV with 5 rows and 20 threads. With "Recycle on EOF = True", what happens when Thread 6 tries to read a row?',
            options: [
              'Thread 6 gets an empty row and the request fails',
              'Thread 6 gets row 1 again — the pointer cycles back to the start',
              'Thread 6 stops and the thread count drops to 5',
              'JMeter throws an error because there are more threads than rows'
            ],
            answer: 1
          },
          {
            type: 'mcq',
            q: 'With Sharing Mode = "All threads" in a CSV Data Set Config, what happens?',
            options: [
              'All threads read the same row simultaneously',
              'A single global pointer advances — each thread gets the next available row, ensuring each row is used by only one thread at a time',
              'Each thread copies the entire CSV into its own memory',
              'The CSV is only read once on startup'
            ],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'JMeter CSV variables like ${firstName} are replaced with the actual value at runtime when the request is sent.',
            answer: true
          },
          {
            type: 'fillin',
            q: 'In a CSV Data Set Config, the _______ field lists the column names that become JMeter variable names.',
            answer: 'Variable Names'
          }
        ]
      },

      {
        id: 'jmeter-l6',
        title: 'Timers, Pacing & Think Time — Making Tests Realistic',
        type: 'lesson',
        duration: '25 min',
        whatYoullLearn: [
          'Why hammering the server without pauses is unrealistic',
          'Add Constant Timer for a fixed pause between requests',
          'Add Gaussian Random Timer for realistic think time variation',
          'Add Uniform Random Timer for a defined random range',
          'Use Throughput Shaping Timer to cap requests per second'
        ],
        content: `
## ⏱️ Timers, Pacing & Think Time

Real users don't send requests 10 times per second. They click → read the page → think → click again. A test without pauses hammers the server far harder than real users would.

**Think time** = the pause between a user receiving a response and making the next request.

---

### ⏸️ Constant Timer

Right-click Thread Group (or HTTP Request) → Add → Timer → Constant Timer

\`\`\`
Thread Delay (milliseconds): 1000
\`\`\`

Adds a 1-second pause after every sampler in scope. Simple but not realistic — real users don't pause for exactly 1 second every time.

---

### 📊 Gaussian Random Timer

\`\`\`
Deviation (milliseconds): 500
Constant Delay Offset (ms): 1000
\`\`\`

Total delay = random Gaussian value (mean 0, σ=500) + 1000ms

In practice: most delays cluster around 1000ms, with some as low as 200ms and some as high as 1800ms. **More realistic than a constant timer.**

---

### 🎲 Uniform Random Timer

\`\`\`
Random Delay Maximum (ms): 2000
Constant Delay Offset (ms): 500
\`\`\`

Total delay = random(0–2000) + 500 = anywhere from 500ms to 2500ms. Flat distribution — every value equally likely.

---

### 🎯 Throughput Shaping Timer (Plugin required)

This is the most powerful — it lets you define exact requests-per-second targets:

\`\`\`
Start RPS: 10     Duration: 60s    ← ramp up
Start RPS: 10     End RPS: 50  Duration: 120s  ← increase load
Start RPS: 50     Duration: 300s   ← hold peak
Start RPS: 50     End RPS: 0   Duration: 30s   ← ramp down
\`\`\`

---

### ⚠️ Timer Scope Rules

| Timer placement | Applies to |
|---|---|
| Child of Thread Group | All samplers in the group |
| Child of a specific sampler | Only that sampler |
| Child of a Simple Controller | All samplers in that controller |

**Rule:** Put the timer at Thread Group level to apply it to all requests. Put it inside a specific sampler to affect only that one.

---

### 🎯 Recommended Think Times

| Application type | Typical think time |
|---|---|
| REST API (machine-to-machine) | 0ms — no think time needed |
| Web page browsing | 3–7 seconds |
| Form filling | 5–15 seconds |
| Search → results → click | 2–5 seconds |

For pure API load tests (like our Restful-Booker tests), think time is optional — APIs are called by code, not humans.
`,
        exercise: {
          title: 'Add Realistic Think Time to Your Load Test',
          task: `1. Add a Gaussian Random Timer at Thread Group level:
   - Deviation: 500ms, Constant Delay: 1000ms
2. Run your CRUD test with 10 users, 5 loops
3. Compare throughput (requests/sec) in Aggregate Report with and without the timer
4. Add a Constant Timer of 2000ms as a child of POST /booking only (not other samplers)
5. Run again and observe that only POST /booking has the extra delay

Screenshot both Aggregate Reports side by side, showing the throughput difference.`,
          hints: [
            'Throughput will drop significantly with timers — from ~40/sec to ~3/sec. This is correct and expected.',
            'For machine-to-machine API tests (server calling another server), timers are not needed — the client sends requests as fast as it processes them',
            'Think time matters most for browser-based tests that simulate a human user navigating a website'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'You are load-testing a REST API that is called by a mobile app (not a human). Should you add think time?',
            options: [
              'Yes — always add 2-3 seconds think time to every performance test',
              'No — machine-to-machine API calls have no think time; the client sends requests as fast as it needs to',
              'Yes — JMeter requires timers to function correctly',
              'It depends on the HTTP method — GET needs think time, POST does not'
            ],
            answer: 1
          },
          {
            type: 'mcq',
            q: 'A Gaussian Random Timer with Deviation=500ms and Constant Offset=1000ms will produce delays:',
            options: [
              'Exactly 1500ms every time',
              'Randomly between 500ms and 1000ms',
              'Centred around 1000ms, mostly between 500–1500ms, following a bell curve',
              'Between 0ms and 2000ms with equal probability'
            ],
            answer: 2
          },
          {
            type: 'truefalse',
            q: 'A timer placed as a direct child of a Thread Group applies to every sampler within that Thread Group.',
            answer: true
          },
          {
            type: 'fillin',
            q: 'The Throughput Shaping Timer (a JMeter plugin) allows you to specify exact _______ targets that JMeter enforces throughout the test.',
            answer: 'requests per second'
          }
        ]
      }
    ]
  }

]; // Modules 3-4 added by jmeter-curriculum-advanced.js
