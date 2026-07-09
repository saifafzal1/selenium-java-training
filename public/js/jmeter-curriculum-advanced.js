// ── Module A: JMeter Performance Testing (Modules 3-4) ───────────
// Extends JMETER_CURRICULUM defined in jmeter-curriculum.js

JMETER_CURRICULUM.push(

  // MODULE 3 — Advanced Features
  {
    id: 'jmeter-module-3',
    title: 'Advanced JMeter Features',
    icon: '🔬',
    lessons: [
      {
        id: 'jmeter-l7',
        title: 'Correlation — Handling Dynamic Values',
        type: 'lesson',
        duration: '35 min',
        whatYoullLearn: [
          'What correlation is and why dynamic values break tests',
          'Use Regular Expression Extractor for non-JSON responses',
          'Use Boundary Extractor for simple value extraction',
          'Use XPath Extractor for XML/HTML responses',
          'Chain multiple extractions across request sequences'
        ],
        content: `
## 🔗 Correlation — Handling Dynamic Values

**The problem:** Your test authenticates, gets a CSRF token from the HTML response, then must include that token in every subsequent POST. The token changes every session. Hardcoding it breaks the test.

**Correlation** = automatically extracting dynamic values from responses and replaying them in later requests.

---

### 🔤 Regular Expression Extractor

For any response format (HTML, JSON, XML, plain text).

Right-click HTTP Request → Add → Post Processors → Regular Expression Extractor

\`\`\`
Reference Name:         csrfToken
Regular Expression:     name="csrf_token" value="([^"]+)"
Template:               $1$
Match No:               1
Default Value:          CSRF_NOT_FOUND
\`\`\`

**How it works:**
- JMeter searches the response body for the regex pattern
- The part inside \`()\` is captured as group 1
- \`$1$\` means "use capture group 1"
- The result is stored in \`\${csrfToken}\`

---

### 🎯 Regex Extraction Examples

**Extract a session ID from a Set-Cookie header:**
\`\`\`
Apply to: JMeter Variable — Response Headers
Regular Expression: SESSIONID=([A-Za-z0-9]+);
Template: $1$
\`\`\`

**Extract a redirect URL from HTML:**
\`\`\`
Regular Expression: <a href="([^"]+)" id="continue-link">
Template: $1$
\`\`\`

**Extract a JSON value without JSON Extractor:**
\`\`\`
Regular Expression: "bookingid":\\s*(\\d+)
Template: $1$
\`\`\`

---

### 🏷️ Boundary Extractor (Simpler Alternative)

Right-click HTTP Request → Add → Post Processors → Boundary Extractor

\`\`\`
Reference Name:  orderId
Left Boundary:   "order_id":"
Right Boundary:  "
Match No:        1
\`\`\`

No regex knowledge needed — just specify what comes before and after the value. JMeter extracts everything between the boundaries.

---

### 📋 XPath Extractor (XML / HTML)

For XML APIs or web page HTML:

\`\`\`
Reference Name:  productName
XPath query:     //product[@id='1']/name/text()
Match No:        1
\`\`\`

\`\`\`
Reference Name:  allPrices
XPath query:     //price/text()
Match No:        -1    ← extract ALL matches into productName_1, productName_2, etc.
\`\`\`

---

### 🔗 Correlation Chain Example

\`\`\`
GET /login-page
└── Boundary Extractor: csrfToken (between "csrf=" and "&")

POST /login
└── Body: username=\${username}&password=\${password}&csrf=\${csrfToken}
    └── Regex Extractor: sessionId (from Set-Cookie header)

GET /dashboard
└── Header: Cookie: session=\${sessionId}
    └── JSON Extractor: userId ($.user.id)

POST /checkout
└── Body: { "user_id": "\${userId}", "items": [...] }
\`\`\`

Each value flows from one response into the next request — the test stays valid across sessions.
`,
        exercise: {
          title: 'Extract and Chain Dynamic Values',
          task: `Practice correlation with the Restful-Booker API:

1. POST /auth — use JSON Extractor to get token → \${authToken}
2. POST /booking — use JSON Extractor to get bookingid → \${bookingId}
3. GET /booking/\${bookingId} — verify the correct booking is returned
4. PUT /booking/\${bookingId} with Cookie: token=\${authToken} — update the firstname to "Updated"
5. GET /booking/\${bookingId} — add a JSON Assertion: $.firstname = "Updated"

Run with 5 users, 2 loops. Verify all requests pass including the assertion.

Bonus: Add a Regular Expression Extractor to GET /booking/\${bookingId} to extract "lastname" using regex instead of JSON Extractor.`,
          hints: [
            'Regex for extracting "lastname" from JSON: "lastname":"([^"]+)" — the capture group grabs everything between the quotes',
            'If PUT /booking returns 403, check that the Cookie header format is: token=\${authToken} (not Bearer)',
            'Use Debug Sampler (Add → Sampler → Debug Sampler) to print all current variables to View Results Tree — great for debugging extractions'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'What does "Match No: -1" do in a Regular Expression Extractor?',
            options: [
              'It extracts the last match only',
              'It extracts ALL matches, storing them as variableName_1, variableName_2, etc.',
              'It disables the extractor',
              'It uses a random match from all found matches'
            ],
            answer: 1
          },
          {
            type: 'mcq',
            q: 'The Boundary Extractor uses "Left Boundary" and "Right Boundary" to extract a value. What is its main advantage over the Regular Expression Extractor?',
            options: [
              'It is faster than regex at runtime',
              'It requires no regex knowledge — just specify the text before and after the target value',
              'It works only with JSON responses',
              'It can extract multiple values simultaneously'
            ],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'The Default Value field in an extractor sets what the variable contains if the pattern is NOT found — preventing the request from crashing with a null value.',
            answer: true
          },
          {
            type: 'fillin',
            q: 'In a Regular Expression Extractor, the _______ field specifies which regex capture group to use as the extracted value.',
            answer: 'Template'
          }
        ]
      },

      {
        id: 'jmeter-l8',
        title: 'HTML Reports, BlazeMeter & Analysing Results',
        type: 'lesson',
        duration: '30 min',
        whatYoullLearn: [
          'Generate a professional HTML report from a JMeter run',
          'Navigate the HTML report — Dashboard, Charts, Statistics table',
          'Interpret response time percentile charts and throughput over time',
          'Upload your test plan to BlazeMeter for cloud execution',
          'Compare runs to track performance improvements over time'
        ],
        content: `
## 📊 HTML Reports, BlazeMeter & Analysing Results

The JMeter GUI listeners (Summary Report, Aggregate Report) give basic stats. For a shareable, visual, professional performance report, use the **HTML Dashboard Report**.

---

### 📁 Generate an HTML Report

Run in non-GUI mode (command line) to generate the report automatically:

\`\`\`bash
# Basic run with HTML report generation
jmeter -n -t test-plan.jmx -l results.jtl -e -o ./html-report

# Flags:
# -n         non-GUI mode (much faster, lower overhead)
# -t         test plan file (.jmx)
# -l         log results to this file (.jtl)
# -e         generate HTML report after test
# -o         output folder for the HTML report
\`\`\`

Then open \`html-report/index.html\` in any browser.

---

### 🗺️ HTML Report — Dashboard Overview

The dashboard shows:

\`\`\`
APDEX                ← Application Performance Index (0-1, higher is better)
Requests Summary     ← Total pass/fail doughnut chart
Statistics table     ← Per-sampler: samples, avg, min, max, p90, p95, p99, error%, throughput
\`\`\`

**APDEX** = industry-standard satisfaction score:
\`\`\`
1.0 = Excellent  (all responses under "Toleration" threshold)
0.8 = Good
0.5 = Fair
< 0.5 = Poor
\`\`\`

---

### 📈 Key Charts to Review

**Response Times Over Time** — spot when the server slows down (saw-tooth pattern = GC pauses)

**Transactions Per Second** — throughput curve; a plateau means the server is saturated

**Latency vs Request** — compare response time when the server is under vs not under load

**Percentiles Over Time** — watch the p99 line — a rising p99 is the first sign of degradation

---

### ☁️ BlazeMeter — Cloud Performance Testing

BlazeMeter runs your JMeter test plan in the cloud from multiple geographic locations.

**Why use BlazeMeter?**
- Run tests from multiple regions simultaneously (US East + EU + Asia)
- Scale to 100,000+ virtual users without owning that hardware
- Automatic Allure-style reports hosted online

**Setup:**
1. Sign up at blazemeter.com (free tier: 50 users, 10 minute tests)
2. Upload your .jmx file
3. Configure users and duration in the UI
4. Start → BlazeMeter runs it in the cloud and emails you the report

**Alternatively**, install the BlazeMeter Chrome extension — it records browser actions and exports as a JMeter .jmx file automatically.

---

### 📊 Statistics to Report to Stakeholders

\`\`\`
Endpoint         Requests  Avg(ms)  p95(ms)  Error%  Throughput
GET /booking     5000      287      520      0.20%   41.3/sec
POST /booking    5000      412      780      0.10%   28.7/sec
DELETE /booking  5000      198      350      0.00%   35.1/sec
TOTAL            15000     299      640      0.10%   105.1/sec

Peak concurrency: 100 users
Test duration: 5 minutes
Infrastructure: 2-core/4GB server
\`\`\`

This is the table you share with your tech lead or management after a load test.
`,
        exercise: {
          title: 'Generate and Analyse an HTML Performance Report',
          task: `1. Save your CRUD test plan as test-plan.jmx
2. Run from command line in non-GUI mode:
   jmeter -n -t test-plan.jmx -l results.jtl -e -o ./html-report
3. Open html-report/index.html in your browser
4. Screenshot and analyse:
   a. The APDEX score and what it means for this app
   b. The Statistics table — which endpoint is slowest?
   c. The Response Times Over Time chart — any spikes?
5. Increase load to 50 users and regenerate the report
6. Compare the two reports: does p95 increase significantly?

Bonus: Upload the .jmx to BlazeMeter free tier and compare cloud results vs local.`,
          hints: [
            'Delete the html-report/ folder before each new run — JMeter will error if the output folder already exists',
            'The .jtl file is a CSV — open it in Excel to see raw request-level data',
            'APDEX requires you to set Toleration and Frustration thresholds in jmeter.properties (defaults: 500ms toleration, 1500ms frustration)'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'What does a plateau in the "Transactions Per Second" chart indicate?',
            options: [
              'The test has finished and JMeter stopped sending requests',
              'The server is saturated — it cannot process more requests per second regardless of additional users',
              'The network connection to the server was lost',
              'All requests are being cached and returning instantly'
            ],
            answer: 1
          },
          {
            type: 'mcq',
            q: 'Why should you delete the html-report/ output folder before running jmeter -e -o ./html-report again?',
            options: [
              'Old reports slow down the new test run',
              'JMeter throws an error if the output directory already exists — it will not overwrite it',
              'The browser caches the old report and will not show the new one',
              'The .jtl results file conflicts with old HTML files'
            ],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'A rising p99 response time while p50 (median) stays stable is an early warning sign of server degradation under load.',
            answer: true
          },
          {
            type: 'fillin',
            q: 'The JMeter CLI flag _______ generates an HTML report after the test run completes.',
            answer: '-e'
          }
        ]
      }
    ]
  },

  // MODULE 4 — CI/CD Pipeline
  {
    id: 'jmeter-module-4',
    title: 'Performance Tests in CI/CD',
    icon: '🚀',
    lessons: [
      {
        id: 'jmeter-l9',
        title: 'Running JMeter from the Command Line — Non-GUI Mode',
        type: 'lesson',
        duration: '25 min',
        whatYoullLearn: [
          'Why non-GUI mode is essential for CI/CD and large load tests',
          'Master the JMeter CLI flags for production test runs',
          'Override test plan properties from the command line (users, duration, host)',
          'Validate a .jtl results file and check for failures',
          'Save and restore JMeter properties files for different environments'
        ],
        content: `
## 🖥️ Running JMeter from the Command Line

The JMeter GUI is for building and debugging test plans. For **actual load testing**, you must use non-GUI mode:

- GUI mode runs ~30% slower (rendering the UI consumes CPU and memory)
- Non-GUI mode can run on headless servers with no display
- Non-GUI mode is the only option in CI/CD pipelines

---

### ⚙️ Essential CLI Flags

\`\`\`bash
jmeter \\
  -n \\                              # non-GUI mode
  -t test-plan.jmx \\               # test plan file
  -l results/results.jtl \\         # log all results here
  -e \\                              # generate HTML report after run
  -o results/html-report \\         # HTML report output folder
  -j results/jmeter.log \\          # JMeter log file
  -Jthreads=50 \\                   # override Thread Group users
  -Jrampup=60 \\                    # override ramp-up seconds
  -Jduration=300 \\                 # override test duration seconds
  -Jhost=staging.myapp.com \\       # override target server
  -Jprotocol=https                  # override protocol
\`\`\`

---

### 🔧 Parameterise Your Test Plan for CLI Overrides

In your test plan, replace hardcoded values with JMeter properties:

**Thread Group:**
\`\`\`
Number of Threads: \${__P(threads,10)}     ← default 10, overridable with -Jthreads=50
Ramp-Up Period:    \${__P(rampup,30)}      ← default 30s
Duration:          \${__P(duration,120)}   ← default 120s
\`\`\`

**HTTP Request:**
\`\`\`
Server Name: \${__P(host,restful-booker.herokuapp.com)}
Protocol:    \${__P(protocol,https)}
\`\`\`

Now you can run the same .jmx file with different configs:
\`\`\`bash
# Development — light load
jmeter -n -t test-plan.jmx -Jthreads=5 -Jduration=60 -Jhost=dev.myapp.com

# Staging — medium load
jmeter -n -t test-plan.jmx -Jthreads=50 -Jduration=300 -Jhost=staging.myapp.com

# Pre-production — full load
jmeter -n -t test-plan.jmx -Jthreads=500 -Jduration=1800 -Jhost=preprod.myapp.com
\`\`\`

---

### ✅ Check if the Test Passed

JMeter CLI returns exit code 0 (success) or non-zero (failure) based on errors. But you can also parse the .jtl file:

\`\`\`bash
# Count failures in .jtl (CSV format — "false" in the success column = failed)
grep -c ",false," results/results.jtl

# Exit with error if any failures found
FAILURES=$(grep -c ",false," results/results.jtl || true)
if [ "$FAILURES" -gt "0" ]; then
  echo "FAIL: $FAILURES requests failed"
  exit 1
fi
echo "PASS: 0 failures"
\`\`\`

---

### 📁 Properties File — Save Your Environment Config

Create \`staging.properties\`:
\`\`\`properties
threads=50
rampup=60
duration=300
host=staging.myapp.com
protocol=https
\`\`\`

Use it with:
\`\`\`bash
jmeter -n -t test-plan.jmx -q staging.properties -l results.jtl -e -o html-report
\`\`\`
`,
        exercise: {
          title: 'Run Your Test Plan from the Command Line',
          task: `1. Update your test plan to use \${__P(threads,10)}, \${__P(rampup,30)}, \${__P(duration,120)} in the Thread Group
2. Update the HTTP Request server name to \${__P(host,restful-booker.herokuapp.com)}
3. Run from CLI with 20 users, 30s ramp, 120s duration:
   jmeter -n -t test-plan.jmx -Jthreads=20 -Jrampup=30 -Jduration=120 -l results.jtl -e -o html-report
4. Create staging.properties with those values
5. Run again using: jmeter -n -t test-plan.jmx -q staging.properties -l results.jtl -e -o html-report
6. Screenshot the terminal output showing the test running and the final summary line`,
          hints: [
            'The __P() function reads a JMeter property — the first argument is the property name, the second is the default if not set',
            'Delete html-report/ before each run to avoid the "directory already exists" error',
            'The final line of JMeter CLI output shows: "summary = N in X s = Y.Z/s Err: E (E%)" — this is your quick pass/fail check'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'Why is non-GUI mode (-n) recommended for large load tests?',
            options: [
              'Non-GUI mode uses a different HTTP library that is more accurate',
              'The GUI consumes significant CPU and memory rendering the UI, reducing the load JMeter can generate',
              'Non-GUI mode automatically generates HTML reports',
              'JMeter GUI mode has a 10-user limit'
            ],
            answer: 1
          },
          {
            type: 'mcq',
            q: 'What does \${__P(threads,10)} do in a JMeter test plan?',
            options: [
              'Creates 10 new threads every second',
              'Reads the "threads" JMeter property — uses it if set (e.g., -Jthreads=50), falls back to 10 if not',
              'Sets the thread count permanently to 10 and ignores CLI overrides',
              'Divides the total users into groups of 10'
            ],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'The -q flag in the JMeter CLI loads a properties file, allowing you to store environment-specific settings separately from the test plan.',
            answer: true
          },
          {
            type: 'fillin',
            q: 'JMeter non-GUI mode is enabled with the _______ flag.',
            answer: '-n'
          }
        ]
      },

      {
        id: 'jmeter-l10',
        title: 'GitHub Actions Pipeline — Automated Performance Tests in CI',
        type: 'lesson',
        duration: '35 min',
        whatYoullLearn: [
          'Run JMeter performance tests automatically on every push',
          'Install JMeter in a GitHub Actions runner',
          'Generate and publish HTML performance reports as GitHub Pages',
          'Fail the pipeline if error rate exceeds a threshold',
          'Set up a scheduled nightly performance test'
        ],
        content: `
## 🚀 GitHub Actions — Automated Performance Tests

Running performance tests manually is reactive. A CI pipeline that runs on every push (or nightly) catches performance regressions before they reach production.

---

### 📝 .github/workflows/performance.yml

\`\`\`yaml
name: Performance Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: "0 2 * * 1-5"    # 2am weekdays — nightly performance test
  workflow_dispatch:          # manual trigger

jobs:
  performance-test:
    name: JMeter Load Test
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up Java 21
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: temurin

      - name: Download JMeter
        run: |
          wget -q https://archive.apache.org/dist/jmeter/binaries/apache-jmeter-5.6.3.tgz
          tar -xzf apache-jmeter-5.6.3.tgz
          echo "\$PWD/apache-jmeter-5.6.3/bin" >> \$GITHUB_PATH

      - name: Run JMeter Performance Tests
        run: |
          mkdir -p results/html-report
          jmeter \\
            -n \\
            -t jmeter/test-plan.jmx \\
            -l results/results.jtl \\
            -e -o results/html-report \\
            -Jthreads=20 \\
            -Jrampup=30 \\
            -Jduration=120 \\
            -Jhost=restful-booker.herokuapp.com \\
            -Jprotocol=https

      - name: Check for failures
        run: |
          FAILURES=$(grep -c ",false," results/results.jtl 2>/dev/null || echo 0)
          TOTAL=$(grep -c "," results/results.jtl 2>/dev/null || echo 1)
          ERROR_PCT=$(awk "BEGIN {printf \"%.1f\", ($FAILURES/$TOTAL)*100}")
          echo "Failures: $FAILURES / $TOTAL requests (${ERROR_PCT}%)"
          if (( $(echo "$ERROR_PCT > 1.0" | bc -l) )); then
            echo "FAIL: Error rate ${ERROR_PCT}% exceeds 1% threshold"
            exit 1
          fi
          echo "PASS: Error rate ${ERROR_PCT}% is within threshold"

      - name: Upload HTML Report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: performance-report
          path: results/html-report/

      - name: Publish to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        if: github.ref == 'refs/heads/main'
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: results/html-report
          destination_dir: perf-reports/latest
\`\`\`

---

### 📁 Project Structure

\`\`\`
your-repo/
├── .github/
│   └── workflows/
│       └── performance.yml
├── jmeter/
│   ├── test-plan.jmx
│   ├── bookings.csv
│   └── staging.properties
└── results/               ← gitignored
    ├── results.jtl
    └── html-report/
\`\`\`

---

### ⚡ Pipeline Outcomes

| Scenario | Pipeline result |
|---|---|
| All tests pass, error rate < 1% | ✅ Green — merge allowed |
| Error rate > 1% | ❌ Red — blocks merge |
| p95 > 3s (Duration Assertion in test plan) | ❌ Red — performance regression |
| Nightly test fails | 📧 Email notification to team |

---

### 🎓 You Have Completed Module A

You can now:
- Design JMeter test plans with Thread Groups, Samplers, Assertions, Listeners
- Parameterise tests with CSV Data Sets for realistic varied load
- Extract dynamic values (token, ID) with JSON/Regex/Boundary Extractors
- Generate professional HTML performance reports
- Run tests in non-GUI mode from the command line
- Automate performance testing in GitHub Actions CI/CD

**This is a production-grade performance testing setup.**
`,
        exercise: {
          title: 'Deploy a GitHub Actions Performance Pipeline',
          task: `1. Push your test plan to GitHub:
   - jmeter/test-plan.jmx
   - jmeter/bookings.csv

2. Create .github/workflows/performance.yml as shown

3. Push to main — watch the Actions tab

4. After the pipeline completes:
   - Download the HTML report artifact
   - Enable GitHub Pages in Settings → Pages → gh-pages branch
   - View your report at https://yourname.github.io/your-repo/perf-reports/latest

5. Intentionally break a test (set Duration Assertion to 1ms) — push and confirm the pipeline goes RED

6. Fix and push — confirm GREEN

Final screenshot: GitHub Actions job green + HTML report open in browser.`,
          hints: [
            'Add "results/" and "*.jtl" to .gitignore — results files are large and should not be committed',
            'The "Check for failures" step uses grep on the .jtl CSV — the success column is "true" or "false"',
            'For the nightly test, set "cron: 0 2 * * 1-5" — runs at 2am UTC Monday-Friday'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'Why is a "schedule" trigger with a cron expression useful for performance tests?',
            options: [
              'It makes the pipeline run faster than push triggers',
              'It runs performance tests automatically at a set time — catching overnight regressions without a code push',
              'Cron triggers have higher resource limits than push triggers',
              'It is required by GitHub for performance test workflows'
            ],
            answer: 1
          },
          {
            type: 'mcq',
            q: 'The pipeline "Check for failures" step exits with code 1 when error rate > 1%. What does this do to the GitHub Actions job?',
            options: [
              'Nothing — exit code 1 is informational only',
              'The job is marked as FAILED — blocking any branch protection rules and preventing auto-merge',
              'GitHub sends an email but the job continues',
              'The job retries automatically up to 3 times'
            ],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'The "if: always()" condition on the Upload HTML Report step ensures the report is uploaded even when the test fails.',
            answer: true
          },
          {
            type: 'fillin',
            q: 'To manually trigger a GitHub Actions workflow on demand (without a code push), add the _______ trigger to the workflow.',
            answer: 'workflow_dispatch'
          }
        ]
      }
    ]
  }

); // end JMETER_CURRICULUM (Modules 3-4)
