// ── Security Vulnerability Testing — Modules 3-4 ─────────────────
// Extends SECURITY_CURRICULUM defined in security-curriculum.js

SECURITY_CURRICULUM.push(

  // MODULE 3 — Authentication & Authorization
  {
    id: 'sec-module-3',
    title: 'Authentication & Authorization',
    icon: '🔑',
    lessons: [
      {
        id: 'sec-l6',
        title: 'Broken Authentication — Session Hijacking & Brute Force',
        type: 'lesson',
        duration: '35 min',
        whatYoullLearn: [
          'Identify weak session management and session fixation vulnerabilities',
          'Perform credential brute-force with Burp Intruder and Hydra',
          'Test for insecure "Remember Me" and password reset flows',
          'Detect predictable session tokens and test for session fixation',
          'Apply secure session management best practices'
        ],
        content: `
## 🔑 Broken Authentication — Session Hijacking & Brute Force

Authentication failures (OWASP A07) are among the most exploited vulnerabilities. They let attackers impersonate legitimate users without knowing their password.

---

### 🧪 What to Test

\`\`\`
1. Brute force — can we guess passwords with no lockout?
2. Weak credentials — are default/common passwords accepted?
3. Session tokens — are they random and long enough?
4. Session fixation — can we set our own session ID?
5. Password reset — is the reset flow secure?
6. Remember Me — are persistent tokens stored securely?
\`\`\`

---

### 💣 Brute Force Testing with Burp Intruder

\`\`\`
DVWA → Brute Force (Security: Low)

1. In Burp Proxy, capture the GET request:
   GET /dvwa/vulnerabilities/brute/?username=admin&password=test&Login=Login

2. Send to Intruder
3. Clear all payload markers → highlight "test" in password=test → Add §
4. Payloads → type: Simple List → add common passwords:
   password, 123456, admin, password123, letmein, abc123

5. Start Attack
6. Sort by Response Length — a different length = login success
\`\`\`

**Signs of successful brute force:**
- Different response length
- Response contains "Welcome" instead of "Username and/or password incorrect"
- Redirect to a different page (302 vs 200)

---

### 🔐 Hydra — Command-Line Brute Force

\`\`\`bash
# HTTP GET-based login (like DVWA brute force)
hydra -l admin -P /usr/share/wordlists/rockyou.txt \\
  "http-get-form://localhost/dvwa/vulnerabilities/brute/:username=^USER^&password=^PASS^&Login=Login:Username and/or password incorrect:H=Cookie: PHPSESSID=xxx;security=low"

# HTTP POST-based login
hydra -l admin -P passwords.txt \\
  http-post-form "//localhost/login:username=^USER^&password=^PASS^:Invalid credentials"

# SSH brute force (only on systems you own)
hydra -l root -P /usr/share/wordlists/rockyou.txt ssh://192.168.1.1
\`\`\`

---

### 🪙 Session Token Analysis

A secure session token must be:
1. **Random** — not predictable from user ID, timestamp, or username
2. **Long** — at least 128 bits (16+ bytes, 32+ hex chars)
3. **Unique** — different for every login, even same user

**Testing with ZAP:**
- ZAP → Tools → Session Token Analyzer
- Log in multiple times, collect 10+ session tokens
- ZAP analyses entropy — low entropy = predictable tokens

**Manual test:**
\`\`\`
Login as admin → PHPSESSID=abc123
Logout, login again → PHPSESSID=abc124  ← Sequential! Predictable!

Login as user1 → token = md5(user1) ← Trivially guessable
\`\`\`

---

### 📧 Password Reset Testing

The password reset flow is frequently vulnerable:

\`\`\`
Test 1: Is the reset token long and random? (or is it md5 of email?)
Test 2: Does the token expire? (try the same token after 24 hours)
Test 3: Can the token be used multiple times?
Test 4: Host header injection:
  POST /reset-password
  Host: attacker.com
  email=victim@example.com
  → Reset email contains a link to attacker.com!
Test 5: Predictable token: reset token = timestamp? username base64?
\`\`\`

---

### 🛡️ Secure Authentication Checklist

\`\`\`
☑ Session tokens: cryptographically random, 128-bit minimum
☑ Account lockout: 5-10 failed attempts → temporary lockout
☑ HTTPS only: never transmit credentials over HTTP
☑ Regenerate session after login (prevent session fixation)
☑ Short session timeout: 15-30 min for sensitive apps
☑ HttpOnly + Secure + SameSite flags on session cookies
☑ Multi-factor authentication for sensitive operations
☑ Password reset tokens: one-time use, expire in 1 hour
☑ Store passwords with bcrypt/Argon2 (never MD5/SHA1)
\`\`\`
`,
        exercise: {
          title: 'Brute-Force DVWA Login and Analyse Session Tokens',
          task: `**Part 1 — Brute Force with Burp Intruder:**
1. DVWA → Brute Force (Security: Low)
2. Capture request in Burp → Send to Intruder
3. Set password as injection point
4. Use this wordlist: password, 123456, admin, password123, letmein, abc123, dragon, master
5. Start attack → identify which password is correct by response length difference
6. Screenshot: Intruder results showing the valid password with different response length

**Part 2 — Session Token Analysis:**
1. Log in to DVWA and copy your PHPSESSID value
2. Log out → log in again → copy the new PHPSESSID
3. Repeat 5 times, record all 5 tokens
4. Answer: Are the tokens random? Could you predict the next one?
5. Check the cookie in browser DevTools → Application → Cookies
   - Is HttpOnly set?
   - Is Secure set?
   - Is SameSite set?

**Part 3 — Analysis:**
What would need to change about DVWA's session management to make it production-secure?`,
          hints: [
            'In Burp Intruder Community, throttle the attack speed in Options → Request Engine → set threads to 1 to avoid 429 errors',
            'Sort the Intruder results by "Length" column — the successful login will have a noticeably different content length',
            'DVWA (running in Docker) will have a short PHPSESSID — check if it\'s random by comparing 5 logins'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'What is session fixation?',
            options: [
              'An attack where the attacker guesses the victim\'s session token through brute force',
              'An attack where the attacker sets a known session token before the victim logs in, then uses that same token after login to hijack the session',
              'A server-side vulnerability where sessions never expire',
              'A technique to fix broken session management in legacy applications'
            ],
            answer: 1
          },
          {
            type: 'mcq',
            q: 'Passwords should be stored using bcrypt or Argon2 rather than MD5 or SHA1 because:',
            options: [
              'MD5 and SHA1 are not supported by modern databases',
              'bcrypt and Argon2 are deliberately slow with a cost factor, making brute-force attacks computationally expensive',
              'bcrypt and Argon2 encrypt the password so it can be decrypted if forgotten',
              'MD5 and SHA1 produce hashes that are too short to be secure'
            ],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'A password reset token should be invalidated after it is used once.',
            answer: true
          },
          {
            type: 'fillin',
            q: 'Account _______ after multiple failed login attempts is a critical defence against brute-force attacks.',
            answer: 'lockout'
          }
        ]
      },

      {
        id: 'sec-l7',
        title: 'IDOR & Broken Access Control — Accessing Other Users\' Data',
        type: 'lesson',
        duration: '35 min',
        whatYoullLearn: [
          'What Insecure Direct Object Reference (IDOR) is and how to find it',
          'Test for horizontal and vertical privilege escalation',
          'Access other users\' resources by manipulating IDs in requests',
          'Test for missing function-level access control',
          'Implement proper server-side authorization checks'
        ],
        content: `
## 🚪 IDOR & Broken Access Control

**Broken Access Control** is OWASP #1 — the most common web vulnerability. It means users can perform actions or access data they shouldn't be able to.

---

### 🔍 IDOR — Insecure Direct Object Reference

IDOR occurs when an application uses a user-controllable value (ID, filename, order number) to directly reference an internal object, without checking if the current user is authorised to access it.

\`\`\`
Legitimate request:
GET /api/orders/1234          ← Your order

IDOR attack:
GET /api/orders/1233          ← Someone else's order!
GET /api/orders/1235
GET /api/orders/1236
\`\`\`

If the server returns order 1233 without checking that it belongs to you → IDOR vulnerability.

---

### 🧪 Testing for IDOR

**Step 1: Find object references**
Look for IDs in:
- URL paths: \`/user/42/profile\`
- Query parameters: \`?order_id=1234\`
- Request body: \`{"account_id": 99}\`
- Cookies: \`user_id=42\`
- Hidden form fields: \`<input type="hidden" name="user" value="42">\`

**Step 2: Modify the reference**
- Change your ID (e.g., 42) to another ID (e.g., 41, 43)
- Try 0, -1, null, very large numbers
- Try other users' known IDs

**Step 3: Check if access is granted**
- Did the server return another user's data?
- Did it return a different HTTP status (200 vs 403)?

---

### 🔺 Privilege Escalation

**Horizontal:** Access another user's data at the same privilege level
\`\`\`
User A (ID 42) → accesses User B's (ID 43) account → IDOR
\`\`\`

**Vertical:** Escalate to a higher privilege level
\`\`\`
Regular user → accesses admin-only API endpoint → vertical escalation
\`\`\`

**Testing vertical escalation:**
\`\`\`
1. Log in as a regular user
2. Browse as admin and capture admin-only API requests in Burp
3. Replay those requests with regular user's session token
4. If the server returns data → missing function-level access control

Example:
Admin request:  GET /api/admin/users  → 200 OK (admin token)
Replayed with:  GET /api/admin/users  → 200 OK (regular user token!)  ← VULNERABILITY
\`\`\`

---

### 🎭 Testing with Two Browser Sessions

The most effective technique: two accounts, two browsers.

\`\`\`
Browser 1 (Firefox): Logged in as admin
Browser 2 (Chrome): Logged in as regular user

1. In Firefox: perform an admin action, capture the request in Burp
2. Copy the request → change the session cookie to the regular user's
3. Replay in Burp Repeater → observe if the server accepts it
\`\`\`

---

### 🛡️ Prevention

**The Golden Rule:** Always check authorisation server-side, on every request.

\`\`\`java
// VULNERABLE — trusts the ID in the URL
@GetMapping("/orders/{orderId}")
public Order getOrder(@PathVariable Long orderId) {
    return orderRepository.findById(orderId).orElseThrow();
}

// SECURE — verifies ownership before returning
@GetMapping("/orders/{orderId}")
public Order getOrder(@PathVariable Long orderId,
                      @AuthenticationPrincipal User currentUser) {
    Order order = orderRepository.findById(orderId).orElseThrow();
    if (!order.getUserId().equals(currentUser.getId())) {
        throw new AccessDeniedException("Not your order");
    }
    return order;
}
\`\`\`

**Additional controls:**
- Use indirect references (UUIDs instead of sequential integers)
- Implement RBAC (Role-Based Access Control) centrally
- Log all access control failures
`,
        exercise: {
          title: 'Find and Exploit IDOR in OWASP Juice Shop',
          task: `OWASP Juice Shop has multiple IDOR vulnerabilities to find:

**Part 1 — Access Another User's Basket:**
1. Browse to https://juice-shop.herokuapp.com (or your local instance)
2. Register two accounts: user1@test.com and user2@test.com
3. Add items to user1's basket, note the basket ID (check API calls in DevTools → Network)
4. Log in as user2 → change the basket ID in the request to user1's ID
5. Screenshot: user2 accessing user1's basket (IDOR!)

**Part 2 — Access Order History:**
1. As user1, place an order — note the order ID from the confirmation
2. Log in as user2 → navigate to /rest/track-order/<order-id>
3. Can user2 see user1's order? Screenshot the response

**Part 3 — Admin API Access:**
1. As a regular user, attempt to access: /api/Users/
2. What HTTP status do you get? 200 or 403?
3. Use Burp to inspect the response headers — what information is exposed?

Document each finding with: Vulnerability type, URL/Parameter, Impact, Evidence (screenshot)`,
          hints: [
            'Open Browser DevTools (F12) → Network tab → filter by "basket" or "order" to find the API calls with IDs',
            'Juice Shop basket IDs are sequential integers — if your basket is ID 3, try ID 1, 2, 4...',
            'The /api/Users/ endpoint might return all users if you\'re not careful — this is a mass assignment / sensitive data exposure finding too'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'A user with account ID 42 can access the profile at /user/42/settings. They change the URL to /user/41/settings and see another user\'s settings. This is:',
            options: [
              'A SQL injection vulnerability',
              'An IDOR (Insecure Direct Object Reference) — horizontal privilege escalation',
              'A session hijacking attack',
              'A path traversal vulnerability'
            ],
            answer: 1
          },
          {
            type: 'mcq',
            q: 'Why are UUIDs (e.g., 550e8400-e29b-41d4-a716-446655440000) more resistant to IDOR attacks than sequential integers?',
            options: [
              'UUIDs are encrypted so attackers cannot read them',
              'UUIDs are non-sequential and non-predictable — guessing another user\'s UUID is computationally infeasible',
              'Databases enforce access control on UUID-keyed tables automatically',
              'UUIDs change on every request, making them impossible to capture'
            ],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'Server-side access control checks are optional if the UI hides the admin buttons from regular users.',
            answer: false
          },
          {
            type: 'fillin',
            q: 'Accessing a higher-privilege account\'s resources (e.g., regular user accessing admin functions) is called _______ privilege escalation.',
            answer: 'vertical'
          }
        ]
      },

      {
        id: 'sec-l8',
        title: 'JWT Tokens — Analysis, Weaknesses & Attacks',
        type: 'lesson',
        duration: '30 min',
        whatYoullLearn: [
          'Understand the structure of JWT tokens (header.payload.signature)',
          'Decode JWT payloads to read their claims',
          'Exploit the "alg:none" attack to forge unsigned tokens',
          'Exploit weak HS256 secrets via offline brute force',
          'Implement secure JWT validation in Java'
        ],
        content: `
## 🪙 JWT Tokens — Analysis, Weaknesses & Attacks

**JSON Web Tokens (JWT)** are the most common authentication mechanism in modern REST APIs. A JWT proves who you are to the server — if you can forge one, you can impersonate any user.

---

### 🔍 JWT Structure

\`\`\`
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwicm9sZSI6InVzZXIiLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

Header.Payload.Signature
\`\`\`

Decode at https://jwt.io:

\`\`\`json
// Header
{ "alg": "HS256", "typ": "JWT" }

// Payload (the claims — readable by anyone!)
{
  "sub": "1234567890",
  "name": "John Doe",
  "role": "user",
  "iat": 1516239022
}

// Signature — verifies integrity (server checks this)
HMACSHA256(base64(header) + "." + base64(payload), secret)
\`\`\`

**Important:** The payload is only base64-encoded, NOT encrypted. Anyone can read it — never put passwords, SSNs, or secrets in a JWT payload.

---

### 🔓 Attack 1: Algorithm Confusion ("alg:none")

Some libraries accept \`"alg": "none"\` — meaning no signature verification.

\`\`\`
Original JWT header:
{ "alg": "HS256", "typ": "JWT" }

Modified JWT header:
{ "alg": "none", "typ": "JWT" }

Modified payload:
{ "sub": "1", "role": "admin", "iat": ... }  ← escalated to admin!

Modified JWT:
base64(newHeader) + "." + base64(newPayload) + "."  ← empty signature!
\`\`\`

If the server accepts this token, authentication is completely bypassed.

**Test in Burp:**
1. Capture a request with a JWT in Authorization header
2. Decode the JWT (https://jwt.io or Burp JWT plugin)
3. Modify the header to \`"alg":"none"\`
4. Change a claim (e.g., \`"role":"admin"\`)
5. Remove the signature (keep the trailing dot)
6. Replay — does the server accept it?

---

### 🔓 Attack 2: Weak Secret Brute Force

HS256 JWTs are signed with a symmetric secret. If the secret is weak, it can be cracked offline.

\`\`\`bash
# hashcat — GPU-accelerated
hashcat -a 0 -m 16500 "eyJhbGc..." /usr/share/wordlists/rockyou.txt

# john the ripper
john --wordlist=/usr/share/wordlists/rockyou.txt --format=HMAC-SHA256 jwt.txt

# jwt-cracker (npm)
npx jwt-cracker "eyJhbGc..." --wordlist common-secrets.txt
\`\`\`

Common weak secrets to test: \`secret\`, \`password\`, \`123456\`, \`jwt_secret\`, app name

---

### 🔓 Attack 3: Algorithm Switch (RS256 → HS256)

If the server uses RS256 (asymmetric — private key signs, public key verifies):
1. Obtain the public key (often at \`/jwks.json\` or \`/.well-known/openid-configuration\`)
2. Switch the algorithm to HS256 (symmetric)
3. Sign the token with the PUBLIC KEY as the HS256 secret
4. Some libraries will verify HS256 using the key material — and accept it!

---

### 🛡️ Secure JWT Implementation

\`\`\`java
// Validating JWTs securely with jjwt (Java)
try {
    Claims claims = Jwts.parserBuilder()
        .setSigningKey(secretKey)          // Must be strong (256-bit minimum)
        .requireExpiration()               // Reject tokens with no expiry
        .build()
        .parseClaimsJws(token)
        .getBody();

    // Check issuer and audience
    if (!"https://myapp.com".equals(claims.getIssuer())) {
        throw new JwtException("Invalid issuer");
    }
} catch (JwtException e) {
    // ALL JWT exceptions must be caught — invalid token
    throw new UnauthorizedException("Invalid token");
}
\`\`\`

**Secure JWT checklist:**
\`\`\`
☑ Never accept alg:none
☑ Use RS256 (asymmetric) for APIs used by third parties
☑ Minimum 256-bit secret for HS256
☑ Always set exp (expiry) — short-lived (15-60 min for access tokens)
☑ Validate iss (issuer) and aud (audience) claims
☑ Use a JWT library — never parse/verify manually
☑ Store tokens in HttpOnly cookies or memory (not localStorage)
\`\`\`
`,
        exercise: {
          title: 'Decode and Forge JWT Tokens',
          task: `**Part 1 — JWT Analysis:**
1. Browse to https://juice-shop.herokuapp.com
2. Register an account and log in
3. Open DevTools → Application → Local Storage → look for a JWT token
   (or DevTools → Network → find a request with "Authorization: Bearer" header)
4. Copy the token and decode it at https://jwt.io
5. Answer: What claims are in the payload? What algorithm is used? When does it expire?

**Part 2 — Modify Payload (no verification bypass):**
1. In jwt.io, change the \`email\` claim to \`admin@juice-sh.op\` (the Juice Shop admin email)
2. Keep the same secret (or use a blank secret)
3. Copy the new token → use it in a request to /rest/basket/1 or /api/Users/
4. What HTTP status do you get? Does it work?

**Part 3 — Crack the Secret (if HS256):**
\`\`\`bash
# Install jwt-cracker
npm install -g @lmammino/jwt-cracker

# Try to crack with common secrets
jwt-cracker "YOUR_JWT_TOKEN" --alphabet abcdefghijklmnopqrstuvwxyz --max-length 6
\`\`\`
Report: Was the secret crackable? How long did it take?

**Part 4 — Document your findings** in the format:
- Algorithm: HS256/RS256
- Token expiry: X minutes
- Claims exposed in payload (any sensitive data?)
- Crackable secret: Y/N`,
          hints: [
            'Juice Shop JWTs are in localStorage under "token" key — check DevTools → Application → Local Storage → http://localhost:3000',
            'The Juice Shop admin email is admin@juice-sh.op — this is documented in the Juice Shop CTF hints',
            'jwt-cracker works for short secrets — try alphabet "abcdefghijklmnopqrstuvwxyz" with max-length 4 first'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'Why is the "alg:none" JWT attack so dangerous?',
            options: [
              'It removes the expiry claim, making the token valid forever',
              'It disables signature verification — the server accepts any payload without checking the signature, allowing anyone to forge tokens with arbitrary claims',
              'It changes the encryption algorithm to one the server cannot decrypt',
              'It allows the token to be reused after logout'
            ],
            answer: 1
          },
          {
            type: 'mcq',
            q: 'Storing a JWT in localStorage (vs HttpOnly cookie) is a security risk because:',
            options: [
              'localStorage tokens expire immediately when the browser closes',
              'JavaScript (including injected XSS scripts) can read localStorage — an XSS attack can steal the token and use it remotely',
              'localStorage is cleared on every page navigation',
              'localStorage cannot store tokens longer than 4KB'
            ],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'The JWT payload (claims) is encrypted, so sensitive user data like passwords can safely be stored in it.',
            answer: false
          },
          {
            type: 'fillin',
            q: 'JWT tokens using the HS256 algorithm are signed with a _______ secret — the same key is used to sign and verify.',
            answer: 'symmetric'
          }
        ]
      }
    ]
  },

  // MODULE 4 — API Security & CI/CD
  {
    id: 'sec-module-4',
    title: 'API Security & CI/CD Integration',
    icon: '🔌',
    lessons: [
      {
        id: 'sec-l9',
        title: 'REST API Security Testing — Mass Assignment, Rate Limiting & Exposure',
        type: 'lesson',
        duration: '30 min',
        whatYoullLearn: [
          'Test REST APIs for mass assignment (parameter pollution)',
          'Test for sensitive data exposure in API responses',
          'Verify rate limiting and resource quota enforcement',
          'Test API versioning for security regressions',
          'Use OWASP API Security Top 10 as a testing checklist'
        ],
        content: `
## 🔌 REST API Security Testing

APIs have their own unique vulnerability class — the **OWASP API Security Top 10**. Modern applications are API-first, making this critical knowledge.

---

### 🏆 OWASP API Security Top 10

| # | Risk | Example |
|---|---|---|
| API1 | Broken Object Level Authorization | IDOR — access another user's data |
| API2 | Broken Authentication | Weak JWT, no rate limiting on auth |
| API3 | Broken Object Property Level Auth | Mass Assignment — set isAdmin=true |
| API4 | Unrestricted Resource Consumption | No rate limit → DoS |
| API5 | Broken Function Level Authorization | Regular user calls admin endpoints |
| API6 | Unrestricted Access to Sensitive Data | Returning passwords, tokens in responses |
| API7 | Server Side Request Forgery | API fetches URLs you control |
| API8 | Security Misconfiguration | CORS *, debug endpoints in production |
| API9 | Improper Inventory Management | Old /v1 API still active, no security |
| API10 | Unsafe API Consumption | Trusts third-party API data blindly |

---

### 💥 API3: Mass Assignment

**Mass Assignment** occurs when the API blindly binds all request properties to a model object — including properties the client should never be able to set.

\`\`\`json
// Registration request (intended)
POST /api/users
{ "username": "alice", "email": "alice@test.com", "password": "secret" }

// Mass assignment attack — client adds isAdmin:true
POST /api/users
{ "username": "alice", "email": "alice@test.com", "password": "secret", "isAdmin": true, "role": "admin" }

// Vulnerable server binds ALL fields → alice is now admin!
\`\`\`

**Test:** Add extra fields like \`"isAdmin": true\`, \`"role": "admin"\`, \`"credits": 99999\` to any POST/PUT request. Check if the server accepts them.

---

### 🔍 API6: Sensitive Data Exposure

APIs often return more data than the client needs:

\`\`\`json
// GET /api/user/42 — client only needs name and email
// Vulnerable response:
{
  "id": 42,
  "username": "alice",
  "email": "alice@example.com",
  "password_hash": "$2b$12$...",     ← never expose this
  "reset_token": "abc123",           ← never expose this
  "internal_notes": "VIP customer",  ← internal data
  "stripe_customer_id": "cus_xyz"    ← PII
}
\`\`\`

**Test:** Read every API response and check for fields that shouldn't be returned.

---

### 🚦 API4: Rate Limiting

Without rate limiting, APIs are vulnerable to:
- Brute force on authentication endpoints
- Resource exhaustion (DoS)
- Data scraping (download entire user database)

\`\`\`bash
# Test rate limiting with a loop
for i in {1..100}; do
  curl -s -o /dev/null -w "%{http_code}\\n" \\
    http://localhost:3000/rest/user/login \\
    -H "Content-Type: application/json" \\
    -d '{"email":"test@test.com","password":"wrong"}'
done
# If you get 200 or 401 every time (not 429) → no rate limiting!
\`\`\`

---

### 🏛️ API8: Security Misconfiguration

**CORS misconfiguration:**
\`\`\`
Response header: Access-Control-Allow-Origin: *
→ Any website can make authenticated requests to this API!

Secure:  Access-Control-Allow-Origin: https://myapp.com
\`\`\`

**Exposed debug endpoints:**
\`\`\`bash
# Common debug/admin paths to test
/api/debug
/api/admin
/api/swagger
/api/docs
/actuator          ← Spring Boot — exposes health, env, beans, metrics
/actuator/env      ← Exposes environment variables (including secrets!)
/actuator/heapdump ← Full heap dump — can contain secrets in memory
\`\`\`

**Test with ffuf (web fuzzer):**
\`\`\`bash
ffuf -u http://localhost:3000/FUZZ -w /usr/share/wordlists/dirb/common.txt
\`\`\`

---

### 🔄 API9: Old API Versions

\`\`\`bash
# Test if deprecated API versions are still active
curl http://api.example.com/v1/users/42     # Old version — may lack security controls
curl http://api.example.com/v2/users/42     # Current version — secured
curl http://api.example.com/beta/users/42   # Beta endpoints — often less secured
\`\`\`

Old API versions often lack authentication, rate limiting, and input validation added in newer versions.
`,
        exercise: {
          title: 'API Security Audit of OWASP Juice Shop',
          task: `Run a systematic API security audit against Juice Shop:

**Test 1 — Mass Assignment:**
1. Register a new user via the UI
2. Intercept the POST /api/Users request in Burp
3. Add \`"role": "admin"\` to the JSON body and forward
4. Check your profile: GET /api/Users/<your_id>
5. Was the role field accepted?

**Test 2 — Sensitive Data Exposure:**
1. As an authenticated user, GET /api/Users/ (list all users)
2. What sensitive fields are returned? (password hashes, email, etc.)
3. GET /rest/user/whoami — what does this return?

**Test 3 — Rate Limiting:**
1. In terminal, run 20 login attempts with wrong password:
   \`for i in {1..20}; do curl -s -X POST http://localhost:3000/rest/user/login -H "Content-Type: application/json" -d '{"email":"a@a.com","password":"wrong"}' | head -c 50; echo; done\`
2. Do you get 429 (Too Many Requests) after repeated failures?

**Test 4 — Debug Endpoints:**
1. Test these URLs: /api-docs, /swagger.json, /swagger/index.html
2. If Swagger is found — document ALL endpoints listed

Create a finding report with severity for each issue found.`,
          hints: [
            'Juice Shop exposes a full Swagger API documentation — find it and you\'ll have a complete list of all endpoints to test',
            'The /api/Users/ endpoint returns all users if you\'re authenticated — note if password hashes are included in the response',
            'Juice Shop intentionally lacks rate limiting — the loop test should show no 429 responses'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'A mass assignment attack works by:',
            options: [
              'Sending a very large request body to crash the server',
              'Including additional fields (like isAdmin or role) in the request that the server blindly binds to the model object',
              'Injecting SQL via request parameters',
              'Sending requests from multiple IP addresses simultaneously'
            ],
            answer: 1
          },
          {
            type: 'mcq',
            q: 'Spring Boot\'s /actuator/env endpoint is a security risk in production because:',
            options: [
              'It allows executing arbitrary Java code on the server',
              'It exposes all environment variables — including database passwords, API keys, and other secrets',
              'It crashes the application when accessed by unauthorised users',
              'It is only accessible on port 8443, exposing the HTTPS port'
            ],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'CORS header "Access-Control-Allow-Origin: *" means any website can make cross-origin requests to the API, including with user credentials.',
            answer: false
          },
          {
            type: 'fillin',
            q: 'HTTP status code _______ indicates the server is enforcing rate limiting and rejecting excess requests.',
            answer: '429'
          }
        ]
      },

      {
        id: 'sec-l10',
        title: 'ZAP in CI/CD — Automated Security Gates in GitHub Actions',
        type: 'lesson',
        duration: '30 min',
        whatYoullLearn: [
          'Run OWASP ZAP as a Docker container in GitHub Actions',
          'Configure ZAP baseline scan and full active scan in CI',
          'Parse ZAP results and fail the pipeline on High-severity findings',
          'Generate and publish ZAP HTML security reports as artifacts',
          'Configure scan rules and false positive suppression'
        ],
        content: `
## 🔄 ZAP in CI/CD — Automated Security Gates

Running security tests manually is reactive. Integrating ZAP into GitHub Actions means every PR is automatically scanned — and High-severity vulnerabilities block the merge.

---

### 🐳 ZAP Docker Images

OWASP provides official ZAP Docker images:

| Image | Scan type | Speed | Coverage |
|---|---|---|---|
| \`zaproxy/zap-stable:baseline\` | Passive only | Fast (2-5 min) | Low false positives |
| \`zaproxy/zap-stable:full\` | Active (attacks) | Slow (15-60 min) | Maximum coverage |
| \`zaproxy/zap-stable:api\` | API-focused | Medium | OpenAPI/GraphQL |

**Baseline scan** = safe for production (no attacks, just crawl and passive analysis)
**Full scan** = attacks the target — only use against test/staging environments

---

### 📝 .github/workflows/security.yml

\`\`\`yaml
name: Security Scan

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: "0 3 * * 1"    # Weekly on Monday 3am

jobs:
  zap-baseline:
    name: ZAP Baseline Security Scan
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      # Start the application under test
      - name: Start Application
        run: |
          docker run -d -p 3000:3000 \\
            --name juice-shop \\
            bkimminich/juice-shop

      - name: Wait for Application
        run: |
          timeout 60 bash -c 'until curl -s http://localhost:3000 > /dev/null; do sleep 2; done'
          echo "Application is ready"

      # Run ZAP Baseline Scan
      - name: ZAP Baseline Scan
        uses: zaproxy/action-baseline@v0.12.0
        with:
          target: 'http://localhost:3000'
          rules_file_name: '.zap/rules.tsv'
          cmd_options: '-a'                   # Include Ajax spider
          fail_action: true                   # Fail if High alerts found
          artifact_name: 'zap-baseline-report'

      # Upload report even if scan found issues
      - name: Upload ZAP Report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: zap-security-report
          path: report_html.html
\`\`\`

---

### ⚙️ ZAP Rules File — Suppress False Positives

Create \`.zap/rules.tsv\`:

\`\`\`tsv
# Rule ID  Action    URL regex         Parameter  Comment
10015      IGNORE    .*                           # Incomplete or No Cache-control Header
10016      IGNORE    .*                           # Web Browser XSS Protection Not Enabled
10035      IGNORE    .*                           # Strict-Transport-Security Header Not Set (dev env)
10038      IGNORE    .*                           # Content Security Policy Header Not Set
40012      WARN      .*                           # XSS (downgrade from FAIL to WARN)
\`\`\`

Tuning the rules prevents known false positives from blocking every PR.

---

### 🔥 Full Active Scan (Staging Only)

\`\`\`yaml
  zap-active-scan:
    name: ZAP Full Active Scan
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'    # Only on develop branch

    steps:
      - uses: actions/checkout@v4

      - name: ZAP Full Scan
        uses: zaproxy/action-full-scan@v0.10.0
        with:
          target: 'https://staging.myapp.com'
          rules_file_name: '.zap/rules.tsv'
          cmd_options: '-a -j'               # Ajax spider + report
          fail_action: true
\`\`\`

---

### 📊 Reading the ZAP CI Report

The HTML report generated by ZAP CI contains:

\`\`\`
Summary:
  High:          2   ← Pipeline FAILS (if fail_action: true)
  Medium:        5
  Low:           12
  Informational: 8

High Alerts:
  SQL Injection
    URL: /search?q=test
    Parameter: q
    Attack: ' OR 1=1--
    Evidence: You have an error in your SQL syntax
    Solution: Use parameterised queries
\`\`\`

---

### 🎓 You Have Completed the Security Testing Course

You can now:
- Use OWASP ZAP and Burp Suite for intercepting and scanning
- Detect and exploit SQL Injection, XSS, Command Injection manually
- Test for Broken Access Control (IDOR) and privilege escalation
- Analyse and attack JWT tokens
- Audit REST APIs using OWASP API Security Top 10
- Run automated security scans in GitHub Actions CI/CD

**This is the security skill set expected of senior QA engineers.**
`,
        exercise: {
          title: 'Build a GitHub Actions Security Pipeline',
          task: `**Part 1 — Local ZAP Docker Scan:**
1. Run Juice Shop in Docker: \`docker run -d -p 3000:3000 bkimminich/juice-shop\`
2. Run ZAP baseline scan:
\`\`\`bash
docker run --rm \\
  --network host \\
  -v $(pwd):/zap/wrk/:rw \\
  zaproxy/zap-stable \\
  zap-baseline.py \\
  -t http://localhost:3000 \\
  -r zap-report.html
\`\`\`
3. Open zap-report.html in browser
4. Screenshot: report summary showing alert counts

**Part 2 — GitHub Actions Pipeline:**
1. Create a new public GitHub repo
2. Add .github/workflows/security.yml as shown in the lesson
3. Create .zap/rules.tsv to suppress the informational alerts
4. Push → watch the Actions tab run
5. Download the security report artifact
6. Screenshot: GitHub Actions run (green or with findings listed)

**Part 3 — Tuning:**
1. Identify one false positive in the ZAP report
2. Find its rule ID (shown in the alert detail)
3. Add it to rules.tsv with IGNORE action
4. Rerun and confirm the false positive is suppressed

Report: How many High/Medium findings did ZAP find? Which are false positives vs real issues?`,
          hints: [
            'The --network host flag is needed so the ZAP Docker container can reach localhost:3000 where Juice Shop is running',
            'ZAP rule IDs are in the format 10016, 40012 etc — they\'re shown in the "Alert ID" field in the HTML report',
            'The zaproxy/action-baseline GitHub Action handles all the Docker setup automatically — you just provide the target URL'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'Why should the ZAP Full Active Scan only run against staging, NOT production?',
            options: [
              'Full scans are too slow for CI pipelines',
              'Active scans send attack payloads (SQL injection, XSS) that could corrupt real data, trigger alerts, or affect real users in production',
              'Production environments block ZAP\'s Docker container',
              'Full scans require more memory than GitHub Actions provides'
            ],
            answer: 1
          },
          {
            type: 'mcq',
            q: 'A ZAP rules.tsv file with "10016 IGNORE .*" does what?',
            options: [
              'Deletes the rule 10016 from ZAP permanently',
              'Tells ZAP to skip alert 10016 across all URLs — suppressing it as a known false positive or accepted risk',
              'Adds rule 10016 to the active scan policy',
              'Changes rule 10016\'s severity to High'
            ],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'ZAP\'s baseline scan is safe to run against production because it only performs passive analysis — it does not send attack payloads.',
            answer: true
          },
          {
            type: 'fillin',
            q: 'Setting `fail_action: true` in the ZAP GitHub Action causes the pipeline to _______ if any High-severity alerts are found.',
            answer: 'fail'
          }
        ]
      }
    ]
  }

); // end SECURITY_CURRICULUM (Modules 3-4)
