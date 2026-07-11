// ── Module C: API Test Execution ───────────────────────────────
// Course: API Testing with Postman, REST Assured & CI/CD
// Target: Absolute beginners who have completed the Selenium module
// Tools: Postman, Newman, REST Assured 5.x, TestNG, Maven, Allure, GitHub Actions
// Test Target: Restful-Booker (https://restful-booker.herokuapp.com/)

const API_CURRICULUM = [

  // ═══════════════════════════════════════════════════════════
  // MODULE 0 — Before You Start
  // ═══════════════════════════════════════════════════════════
  {
    id: 'api-module-0',
    title: 'Before You Start',
    icon: '👋',
    lessons: [
      {
        id: 'api-l0',
        title: 'Welcome: What Is API Testing and Why Does It Matter?',
        type: 'intro',
        duration: '12 min',
        whatYoullLearn: [
          'What an API is and why testing it is a core QA skill in 2026',
          'How API testing fits into the test pyramid',
          'The difference between Postman, Newman and REST Assured',
          'What you will build by the end of this course',
          'The full 5-module roadmap'
        ],
        content: `
## 👋 Welcome to API Test Execution!

You know how to click buttons and check pages with Selenium. Now you're going to learn how to test the engine underneath — the API that powers every modern application.

---

### 🤔 What Is an API?

Imagine a restaurant. You (the customer) don't walk into the kitchen to cook your own food. Instead, you give your order to a **waiter**, who carries it to the kitchen and brings back your food.

**An API is that waiter.**

- **You** = the frontend app (the browser you see)
- **The waiter** = the API
- **The kitchen** = the backend server and database

When you log in to a website, your browser sends an API request: "Check if username = admin and password = secret123." The server checks its database and sends back an API response: "Yes, valid. Here is your user data."

You never see any of this. It all happens invisibly — but it's happening on every click.

---

### 🔍 Why Test the API?

Think about what happens if the API is broken:

| What breaks | What the user sees |
|---|---|
| Login API returns wrong user ID | User sees someone else's data |
| Payment API doesn't validate amount | Users can pay £0 for anything |
| Search API returns unfiltered results | Private data leaks to wrong users |
| Booking API doesn't check dates | Double-bookings happen silently |

**The UI might look perfect. The data underneath is wrong.**

This is why API testing sits above unit tests and below E2E tests in the test pyramid — it catches the most critical bugs fastest.

---

### 🏔️ The Test Pyramid

\`\`\`
        /\\
       /  \\
      / E2E \\         ← Slow. Test the whole user journey. Few tests.
     /--------\\
    / API Tests \\     ← Medium speed. Test the logic layer. Many tests.
   /-------------\\
  /  Unit Tests   \\   ← Fast. Test individual functions. Thousands of tests.
 /─────────────────\\
\`\`\`

API tests are the **sweet spot** — they're:
- Much faster than E2E (no browser to open)
- Much more meaningful than unit tests (testing real business logic)
- Independent of UI changes (the API works even when the frontend changes)

---

### 🛠️ The Tools You'll Use

| Tool | What it does | When you use it |
|---|---|---|
| **Postman** | GUI for making API calls manually | Exploring, designing, and manual testing |
| **Newman** | Runs Postman collections in the terminal | Automating Postman tests in CI |
| **REST Assured** | Java library for writing API tests in code | Professional automation in your Maven project |
| **TestNG** | Test runner (you already know this!) | Running REST Assured test suites |
| **Allure** | Report generator | Beautiful test reports |
| **GitHub Actions** | CI/CD platform | Running tests automatically on every push |

---

### 🌐 Your Test Target: Restful-Booker

Throughout this course you will test a real, live API called **Restful-Booker** — a hotel booking system built specifically for training.

- **Base URL:** \`https://restful-booker.herokuapp.com\`
- **Supports:** GET, POST, PUT, PATCH, DELETE
- **Has authentication, data validation, and real booking logic**
- **Free, always available, safe to test**

By the end, you'll have a complete Java test suite that:
1. Creates a booking
2. Reads it back
3. Updates it
4. Deletes it
5. Verifies authentication
6. Runs in GitHub Actions CI automatically

---

### 🗺️ Your 5-Module Roadmap

| Module | Topic | Lessons |
|---|---|---|
| 0 | Before You Start | 1 |
| 1 | API Fundamentals | 3 |
| 2 | Postman Mastery | 3 |
| 3 | REST Assured with Java | 4 |
| 4 | CI/CD & Reporting | 2 |
| + | Capstone Project | 1 |

**Total: ~7 hours of hands-on learning**

---

### ✅ What You Need Before We Start

**You need:**
- Java JDK 11+ installed
- IntelliJ IDEA (or Eclipse)
- Postman installed — free from [postman.com](https://www.postman.com/downloads/)
- Maven (comes with IntelliJ)
- An internet connection

**You do NOT need:**
- Any API testing experience
- Knowledge of HTTP beyond "websites use it"
- Any backend/server experience

If you completed the Selenium module, you're already 70% of the way there — you know Java, Maven, and TestNG. This course adds the API layer on top.

---

Ready? Mark this lesson complete and head to Module 1: API Fundamentals.
`,
        exercise: {
          title: 'Spot the API in Action',
          task: 'Open your browser, go to any website you use daily (LinkedIn, Amazon, Gmail), and open the browser Developer Tools (F12 → Network tab). Refresh the page and click on any request that shows "application/json" in the Type column. Look at the "Headers" and "Response" tabs. Write down: (1) the URL of the API call, (2) the HTTP method used (GET/POST/etc), (3) what the response data looks like. This is a real API call happening in front of you.',
          hints: [
            'Filter the Network tab by "XHR" or "Fetch" to see only API calls, not page assets',
            'The URL often starts with /api/ — that is the API endpoint',
            'The Response tab shows the JSON data the server sent back'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'In the restaurant analogy, what does the API represent?',
            options: [
              'The customer placing the order',
              'The waiter carrying orders between kitchen and customer',
              'The kitchen cooking the food',
              'The menu listing available dishes'
            ],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'API tests are faster than unit tests because they test the full application stack.',
            answer: false
          },
          {
            type: 'mcq',
            q: 'Which tool do you use to run Postman collections automatically from the command line?',
            options: ['REST Assured', 'TestNG', 'Newman', 'Allure'],
            answer: 2
          },
          {
            type: 'fillin',
            q: 'The test target used throughout this course is called _______, a hotel booking API built for training.',
            answer: 'Restful-Booker'
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════
  // MODULE 1 — API Fundamentals
  // ═══════════════════════════════════════════════════════════
  {
    id: 'api-module-1',
    title: 'API Fundamentals',
    icon: '🌐',
    lessons: [
      // ── Lesson 1 ───────────────────────────────────────────
      {
        id: 'api-l1',
        title: 'REST, HTTP & JSON — The Language of APIs',
        type: 'lesson',
        duration: '25 min',
        whatYoullLearn: [
          'What REST means and why modern APIs use it',
          'The 5 HTTP methods: GET, POST, PUT, PATCH, DELETE',
          'HTTP status codes — what 200, 201, 400, 401, 404, 500 mean',
          'JSON structure — objects, arrays, strings, numbers, booleans',
          'Request anatomy: URL, headers, body, query parameters'
        ],
        content: `
## 🌐 REST, HTTP & JSON — The Language of APIs

Before you can test an API, you need to speak its language. Don't worry — it's simpler than Java.

---

### 🔤 What Is REST?

**REST** stands for Representational State Transfer. It's a set of rules that define how web APIs should be designed.

A REST API is built around **resources** — things in your system that have a URL:

| Resource | URL |
|---|---|
| All bookings | \`/booking\` |
| One specific booking | \`/booking/42\` |
| Creating a token | \`/auth\` |
| Health check | \`/ping\` |

The URL tells you **what** you're working with. The HTTP method tells you **what to do with it**.

---

### 📡 The 5 HTTP Methods

| Method | What it does | Example |
|---|---|---|
| **GET** | Read data | Get booking #42 |
| **POST** | Create new data | Create a new booking |
| **PUT** | Replace all data | Replace booking #42 entirely |
| **PATCH** | Update part of data | Update only the check-in date |
| **DELETE** | Remove data | Delete booking #42 |

**Memory trick:** CRUD → Create=POST, Read=GET, Update=PUT/PATCH, Delete=DELETE

---

### 🔢 HTTP Status Codes

The server always replies with a number that tells you what happened:

| Code | Meaning | When you see it |
|---|---|---|
| **200 OK** | Success, here's the data | GET request worked |
| **201 Created** | Success, new thing created | POST request worked |
| **204 No Content** | Success, nothing to return | DELETE worked |
| **400 Bad Request** | Your request has an error | Missing required field |
| **401 Unauthorized** | Not logged in / no token | Missing auth header |
| **403 Forbidden** | Logged in but no permission | Trying to delete someone else's data |
| **404 Not Found** | Resource doesn't exist | GET /booking/99999 |
| **500 Internal Server Error** | Server crashed | Bug in the backend |

**Rule of thumb:**
- **2xx = Good**
- **4xx = Your fault (client error)**
- **5xx = Their fault (server error)**

---

### 📦 JSON — How API Data Looks

JSON (JavaScript Object Notation) is the format APIs use to send data. Think of it as a structured way to write key-value pairs.

**A simple booking object:**
\`\`\`json
{
  "firstname": "James",
  "lastname": "Brown",
  "totalprice": 150,
  "depositpaid": true,
  "bookingdates": {
    "checkin": "2026-01-01",
    "checkout": "2026-01-10"
  },
  "additionalneeds": "Breakfast"
}
\`\`\`

**JSON rules you must know:**

| Data type | Example | Notes |
|---|---|---|
| String | \`"hello"\` | Always in double quotes |
| Number | \`150\` | No quotes |
| Boolean | \`true\` or \`false\` | No quotes, lowercase |
| Object | \`{ "key": "value" }\` | Curly braces |
| Array | \`[1, 2, 3]\` | Square brackets |
| Null | \`null\` | Missing/empty value |

---

### 🔍 Anatomy of an API Request

When you make an API call, four things go with it:

**1. URL** — Where to send it:
\`\`\`
https://restful-booker.herokuapp.com/booking/1
\`\`\`

**2. HTTP Method** — What to do:
\`\`\`
GET
\`\`\`

**3. Headers** — Metadata about the request:
\`\`\`
Content-Type: application/json
Accept: application/json
Cookie: token=abc123def456
\`\`\`

**4. Body** — Data you're sending (only for POST/PUT/PATCH):
\`\`\`json
{
  "firstname": "James",
  "lastname": "Brown",
  "totalprice": 150,
  "depositpaid": true,
  "bookingdates": {
    "checkin": "2026-01-01",
    "checkout": "2026-01-10"
  }
}
\`\`\`

**Query parameters** go at the end of the URL after a \`?\`:
\`\`\`
GET /booking?firstname=James&lastname=Brown
\`\`\`

---

### 🧪 What We're Testing on Restful-Booker

Here's a preview of the API you'll test:

| Operation | Method | URL | What you check |
|---|---|---|---|
| Health check | GET | /ping | Returns 201 |
| Get all bookings | GET | /booking | Array of IDs |
| Get one booking | GET | /booking/{id} | Booking object |
| Create booking | POST | /booking | Returns new booking + ID |
| Create auth token | POST | /auth | Returns token string |
| Update booking | PUT | /booking/{id} | Returns updated booking |
| Partial update | PATCH | /booking/{id} | Returns updated fields |
| Delete booking | DELETE | /booking/{id} | Returns "Created" (their quirk!) |

You'll write Java tests for every one of these.
`,
        exercise: {
          title: 'Decode These API Responses',
          task: `For each scenario below, write (1) which HTTP method to use, and (2) what status code you expect back:

1. A user tries to view their profile page while logged out
2. A form submission is missing the "email" required field
3. A search returns 5 matching products successfully
4. A new user account is successfully created
5. Someone tries to view a product that was deleted last week`,
          hints: [
            'Logged out = no valid session = authentication problem → 401',
            'Missing required field = something wrong with the request = client error → 400',
            'Returning data = reading something that exists → GET + 200',
            'Creating something new → POST + 201',
            'Resource was deleted = no longer exists → GET + 404'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'Which HTTP method do you use to CREATE a new resource in a REST API?',
            options: ['GET', 'POST', 'PUT', 'DELETE'],
            answer: 1
          },
          {
            type: 'mcq',
            q: 'A server returns status code 401. What does this mean?',
            options: [
              'The resource was not found',
              'The server had an internal error',
              'The request is not authenticated',
              'The request body is malformed'
            ],
            answer: 2
          },
          {
            type: 'truefalse',
            q: 'In JSON, string values must be wrapped in double quotes.',
            answer: true
          },
          {
            type: 'fillin',
            q: 'HTTP status codes starting with 2 mean _______, while codes starting with 4 mean the client made an error.',
            answer: 'success'
          },
          {
            type: 'mcq',
            q: 'What is the difference between PUT and PATCH?',
            options: [
              'PUT creates, PATCH reads',
              'PUT replaces the entire resource, PATCH updates only specified fields',
              'PUT is for secured endpoints, PATCH is for public endpoints',
              'They are identical — just different naming conventions'
            ],
            answer: 1
          }
        ]
      },

      // ── Lesson 2 ───────────────────────────────────────────
      {
        id: 'api-l2',
        title: 'Your First API Call with Postman',
        type: 'lesson',
        duration: '30 min',
        whatYoullLearn: [
          'Install Postman and understand the interface',
          'Send a GET request to a live API and read the response',
          'Send a POST request with a JSON body to create data',
          'Read and understand the response body, status code and headers',
          'Save requests to a collection for reuse'
        ],
        content: `
## 📮 Your First API Call with Postman

Postman is the most popular tool for working with APIs. Think of it as a browser — but instead of typing URLs and clicking links, you send structured API requests and see exactly what comes back.

---

### 🛠️ Install Postman

1. Go to [postman.com/downloads](https://www.postman.com/downloads/)
2. Download for your OS (Windows/Mac/Linux)
3. Install and create a free account (required for collections/sync)
4. Open Postman — you'll see the main window

---

### 🔍 The Postman Interface

\`\`\`
┌─────────────────────────────────────────────────────────┐
│  Collections  │  ← Saved requests (like a filing system) │
├───────────────┼─────────────────────────────────────────┤
│               │  GET ▼  │ https://...              [Send]│
│  Sidebar      │─────────────────────────────────────────│
│               │  Params │ Auth │ Headers │ Body         │
│               │─────────────────────────────────────────│
│               │  Response                               │
│               │  Status: 200 OK  │ Time: 243ms          │
│               │  Body │ Headers                         │
│               │  { "firstname": "James", ...}           │
└─────────────────────────────────────────────────────────┘
\`\`\`

---

### ▶️ Lab: Send Your First GET Request

**Step 1: Open a new request tab**
- Click the **+** button to open a new tab

**Step 2: Set method and URL**
- Method: **GET** (should already be selected)
- URL: \`https://restful-booker.herokuapp.com/ping\`

**Step 3: Click Send**

**What you should see:**
\`\`\`
Status: 201 Created    Time: ~200ms
Body: "Created"
\`\`\`

**Why 201 for a health check?** That's a quirk of this particular API — "Created" means "I'm alive and running". Not standard, but it's a good reminder that you should always check the docs.

---

### 📋 Get All Bookings

Change the URL to:
\`\`\`
GET https://restful-booker.herokuapp.com/booking
\`\`\`

Click Send. You'll see something like:
\`\`\`json
[
  { "bookingid": 1 },
  { "bookingid": 2 },
  { "bookingid": 3 },
  ...
]
\`\`\`

This is an **array** of booking IDs. To get the details of one, pick any ID and make:
\`\`\`
GET https://restful-booker.herokuapp.com/booking/1
\`\`\`

Response:
\`\`\`json
{
  "firstname": "Jim",
  "lastname": "Brown",
  "totalprice": 111,
  "depositpaid": true,
  "bookingdates": {
    "checkin": "2018-01-01",
    "checkout": "2019-01-01"
  },
  "additionalneeds": "Breakfast"
}
\`\`\`

---

### ➕ Create a Booking (POST Request)

Now let's create something.

**Step 1:** Change method to **POST**
**Step 2:** URL: \`https://restful-booker.herokuapp.com/booking\`
**Step 3:** Go to the **Headers** tab and add:
- Key: \`Content-Type\`   Value: \`application/json\`
- Key: \`Accept\`   Value: \`application/json\`

**Step 4:** Go to the **Body** tab → select **raw** → select **JSON** from the dropdown

**Step 5:** Paste this body:
\`\`\`json
{
  "firstname": "Sally",
  "lastname": "Smith",
  "totalprice": 250,
  "depositpaid": false,
  "bookingdates": {
    "checkin": "2026-03-01",
    "checkout": "2026-03-07"
  },
  "additionalneeds": "Dinner"
}
\`\`\`

**Step 6:** Click Send

**Response (201 Created):**
\`\`\`json
{
  "bookingid": 17,
  "booking": {
    "firstname": "Sally",
    "lastname": "Smith",
    "totalprice": 250,
    "depositpaid": false,
    "bookingdates": {
      "checkin": "2026-03-01",
      "checkout": "2026-03-07"
    },
    "additionalneeds": "Dinner"
  }
}
\`\`\`

**Note the \`bookingid\`** — you'll need this to GET, UPDATE, or DELETE this specific booking.

---

### 💾 Save to a Collection

Collections are like folders for your requests. Let's save this.

1. Click **Save** (top right of the request tab)
2. Create a new collection: \`Restful-Booker Tests\`
3. Name the request: \`Create Booking\`
4. Click **Save**

Do the same for your GET requests: \`Health Check\`, \`Get All Bookings\`, \`Get Booking by ID\`.

Your sidebar now has an organised folder of saved requests you can run any time.

---

### 🔑 Reading the Response Tabs

| Tab | What's there |
|---|---|
| **Body** | The actual data the API returned |
| **Cookies** | Any cookies set by the server |
| **Headers** | Metadata (content-type, server info, etc.) |
| **Test Results** | Pass/Fail for any test scripts you write (next lesson) |

The **Status** line (200/201/etc.) and the **Time** (how long the server took) are always visible at the top of the response panel.
`,
        exercise: {
          title: 'Explore Restful-Booker with Postman',
          task: `Complete all 4 tasks in Postman and save each request to a collection called "Restful-Booker Tests":

1. Send GET /ping and confirm you get status 201 with body "Created"
2. Send GET /booking to get the list of all booking IDs — note how many there are
3. Pick any booking ID from the list and GET its full details — note the firstname, lastname and totalprice
4. Send POST /booking to create a booking with YOUR name, check-in next month and check-out one week later — note your new bookingid

Take a screenshot of your completed collection in the sidebar.`,
          hints: [
            'For the POST request, set Content-Type: application/json in Headers before adding the body',
            'The body tab must be set to "raw" and "JSON" — not "form-data"',
            'Your bookingid in the POST response is what you will use in all future requests for this booking'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'When sending a POST request with a JSON body in Postman, what must you set in the Headers tab?',
            options: [
              'Authorization: Bearer token',
              'Content-Type: application/json',
              'Accept: text/html',
              'X-Custom-Header: postman'
            ],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'In Postman, Collections are used to save and organise groups of related API requests.',
            answer: true
          },
          {
            type: 'mcq',
            q: 'The Restful-Booker /ping endpoint returns status 201. What does this tell you about the API?',
            options: [
              'It means a new resource was created',
              'It is a non-standard response — the API is alive but uses 201 as its health signal',
              'It means the request was unauthorized',
              'It means the server is returning cached data'
            ],
            answer: 1
          },
          {
            type: 'fillin',
            q: 'When creating a new booking via POST, the response includes a _______ field that identifies the new record.',
            answer: 'bookingid'
          }
        ]
      },

      // ── Lesson 3 ───────────────────────────────────────────
      {
        id: 'api-l3',
        title: 'Collections, Environments and Variables in Postman',
        type: 'lesson',
        duration: '25 min',
        whatYoullLearn: [
          'What Postman environments are and why you need them',
          'How to create and use variables to avoid repeating values',
          'How to chain requests — capturing a value from one response and using it in the next',
          'How to use pre-request scripts to set dynamic values',
          'Organising requests into folders within a collection'
        ],
        content: `
## 🗂️ Collections, Environments and Variables in Postman

Right now your requests have the base URL hardcoded. Every time the API changes domain, you'd have to update every single request. Variables fix this.

---

### 🌍 What is a Postman Environment?

An **environment** is a set of key-value pairs that your requests can use as variables.

Example:

| Variable | Dev value | Prod value |
|---|---|---|
| \`base_url\` | \`http://localhost:3000\` | \`https://api.myapp.com\` |
| \`username\` | \`test_user\` | \`real_user\` |
| \`token\` | (empty — filled by login request) | (empty — filled by login request) |

When you switch from Dev to Prod environment, all your requests automatically use the correct URLs.

---

### 🔧 Create an Environment

1. Click the **Environments** tab in the left sidebar
2. Click **+** to create new
3. Name it: \`Restful-Booker\`
4. Add these variables:

| Variable name | Initial value | Current value |
|---|---|---|
| \`base_url\` | \`https://restful-booker.herokuapp.com\` | \`https://restful-booker.herokuapp.com\` |
| \`booking_id\` | (leave empty) | (leave empty) |
| \`token\` | (leave empty) | (leave empty) |

5. Click **Save**
6. Select your environment from the dropdown (top-right of Postman window)

---

### 📌 Use Variables in Your Requests

Now update your requests to use \`{{base_url}}\` instead of the hardcoded URL:

**Before:**
\`\`\`
GET https://restful-booker.herokuapp.com/booking
\`\`\`

**After:**
\`\`\`
GET {{base_url}}/booking
\`\`\`

Postman replaces \`{{base_url}}\` with the environment value when you click Send. Orange text means the variable is recognised; red means it's not found.

---

### ⛓️ Chaining Requests — Auto-capturing the booking_id

The most powerful Postman feature: capturing data from one response and using it in the next.

When you create a booking (POST), the response includes \`bookingid\`. Instead of copying it manually every time, you can automatically save it to the \`booking_id\` variable.

**In your "Create Booking" request → go to the Tests tab and add:**
\`\`\`javascript
// Parse the response body as JSON
const response = pm.response.json();

// Save the bookingid to the environment variable
pm.environment.set("booking_id", response.bookingid);

// Verify the status was 200 or 201
pm.test("Booking created successfully", function () {
  pm.expect(pm.response.code).to.be.oneOf([200, 201]);
});

// Verify bookingid was returned
pm.test("Booking ID is present", function () {
  pm.expect(response.bookingid).to.be.a('number');
});
\`\`\`

Now every time you run "Create Booking", the \`booking_id\` variable is automatically set.

**In your "Get Booking by ID" request, use:**
\`\`\`
GET {{base_url}}/booking/{{booking_id}}
\`\`\`

This automatically uses the ID from the last booking you created.

---

### 🔐 Auth Token Flow

Restful-Booker requires a token to UPDATE or DELETE bookings. Let's automate the token capture.

**Create a new request: "Create Token"**
- Method: POST
- URL: \`{{base_url}}/auth\`
- Body (raw JSON):
\`\`\`json
{
  "username": "admin",
  "password": "password123"
}
\`\`\`

**In the Tests tab:**
\`\`\`javascript
const response = pm.response.json();
pm.environment.set("token", response.token);

pm.test("Token received", function () {
  pm.expect(response.token).to.be.a('string');
  pm.expect(response.token.length).to.be.above(0);
});
\`\`\`

Now your \`token\` variable is automatically set whenever you run "Create Token".

For DELETE and PUT requests, add a **Cookie** header:
- Key: \`Cookie\`
- Value: \`token={{token}}\`

---

### 📁 Organise with Folders

As your collection grows, use folders to group related requests:

\`\`\`
📁 Restful-Booker Tests
  📂 Auth
    → Create Token
  📂 Bookings - Read
    → Health Check
    → Get All Bookings
    → Get Booking by ID
  📂 Bookings - Write
    → Create Booking
    → Update Booking (PUT)
    → Partial Update (PATCH)
    → Delete Booking
\`\`\`

Right-click your collection → Add Folder to create folders, then drag requests in.

---

### 🏃 Run the Whole Collection

Once all requests are in order, you can run them all in sequence:

1. Click the **>** (Run) button on your collection
2. Click **Run Restful-Booker Tests**
3. Watch each request execute in order, passing or failing

The Collection Runner executes them top to bottom, so the "Create Token" → "Create Booking" → "Get Booking" → "Update" → "Delete" flow works automatically.
`,
        exercise: {
          title: 'Wire Up the Full Booking Flow',
          task: `Set up a complete chained collection in Postman:

1. Create the "Restful-Booker" environment with base_url, booking_id (empty), and token (empty) variables
2. Update all your existing requests to use {{base_url}} instead of the hardcoded URL
3. Add the Tests tab script to "Create Token" that saves {{token}}
4. Add the Tests tab script to "Create Booking" that saves {{booking_id}}
5. Create a DELETE request at {{base_url}}/booking/{{booking_id}} that uses Cookie: token={{token}}
6. Run the full collection and screenshot the runner results showing all requests passing`,
          hints: [
            'Make sure the environment is selected in the dropdown before running — otherwise {{base_url}} will show as undefined',
            'The order in the Collection Runner matters: Auth → Create → Read → Update → Delete',
            'If DELETE returns 403, your token variable was not captured — check the Create Token Tests script first'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'How do you reference an environment variable in a Postman URL?',
            options: [
              '${variable_name}',
              '{{variable_name}}',
              '[[variable_name]]',
              '%variable_name%'
            ],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'You can use pm.environment.set() in the Tests tab to save a value from a response into a variable for use in later requests.',
            answer: true
          },
          {
            type: 'mcq',
            q: 'Why is chaining requests useful in Postman?',
            options: [
              'It makes requests run faster in parallel',
              'It avoids having to manually copy values (like IDs or tokens) between requests',
              'It encrypts the data between requests',
              'It only works with POST requests'
            ],
            answer: 1
          },
          {
            type: 'fillin',
            q: 'The Restful-Booker API requires a _______ in the Cookie header to authorise UPDATE and DELETE operations.',
            answer: 'token'
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════
  // MODULE 2 — Postman Mastery
  // ═══════════════════════════════════════════════════════════
  {
    id: 'api-module-2',
    title: 'Postman Mastery',
    icon: '📮',
    lessons: [
      // ── Lesson 4 ───────────────────────────────────────────
      {
        id: 'api-l4',
        title: 'Writing Test Assertions in Postman',
        type: 'lesson',
        duration: '30 min',
        whatYoullLearn: [
          'Write test assertions using pm.test() and pm.expect()',
          'Assert status codes, response time, headers and body fields',
          'Use Chai assertion syntax (to.equal, to.include, to.be.a)',
          'Test nested JSON properties and array responses',
          'Understand what makes a good API test assertion'
        ],
        content: `
## ✅ Writing Test Assertions in Postman

Making API calls in Postman is useful for exploration. But to make them **tests**, you need assertions — checks that automatically tell you whether the response is correct.

---

### 🧪 The pm.test() Structure

Every Postman test follows this pattern:

\`\`\`javascript
pm.test("Human-readable test name", function () {
  // assertion goes here
  pm.expect(something).to.equal(expectedValue);
});
\`\`\`

- **Test name** — what you see in the Test Results tab (make it descriptive)
- **pm.expect()** — wraps the value you want to check
- **Chai assertion** — the check itself (.to.equal, .to.include, etc.)

---

### 📊 Asserting Status Codes

The most fundamental assertion — did the API return the right status?

\`\`\`javascript
// Exact match
pm.test("Status is 200", function () {
  pm.response.to.have.status(200);
});

// Accept multiple codes (e.g. 200 or 201)
pm.test("Status is success", function () {
  pm.expect(pm.response.code).to.be.oneOf([200, 201]);
});
\`\`\`

---

### ⏱️ Asserting Response Time

Slow APIs fail users silently. Always test performance:

\`\`\`javascript
pm.test("Response time is under 2 seconds", function () {
  pm.expect(pm.response.responseTime).to.be.below(2000);
});
\`\`\`

---

### 📋 Asserting Response Body Fields

First, parse the response:
\`\`\`javascript
const body = pm.response.json();
\`\`\`

Then check specific fields:
\`\`\`javascript
// Check exact value
pm.test("First name is correct", function () {
  pm.expect(body.firstname).to.equal("Sally");
});

// Check data type
pm.test("Total price is a number", function () {
  pm.expect(body.totalprice).to.be.a("number");
});

// Check boolean
pm.test("Deposit paid is boolean", function () {
  pm.expect(body.depositpaid).to.be.a("boolean");
});

// Check nested object
pm.test("Check-in date is correct", function () {
  pm.expect(body.bookingdates.checkin).to.equal("2026-03-01");
});

// Check string contains
pm.test("Additional needs contains Dinner", function () {
  pm.expect(body.additionalneeds).to.include("Dinner");
});
\`\`\`

---

### 📦 Asserting Array Responses

When the response is an array (like GET /booking):

\`\`\`javascript
const body = pm.response.json();

pm.test("Response is an array", function () {
  pm.expect(body).to.be.an("array");
});

pm.test("At least one booking exists", function () {
  pm.expect(body.length).to.be.above(0);
});

pm.test("Each item has a bookingid field", function () {
  body.forEach(function(item) {
    pm.expect(item).to.have.property("bookingid");
    pm.expect(item.bookingid).to.be.a("number");
  });
});
\`\`\`

---

### 🔑 Asserting Headers

\`\`\`javascript
pm.test("Content-Type is JSON", function () {
  pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});
\`\`\`

---

### 🏗️ Complete Test Suite for Create Booking

Here's a professional set of assertions for your POST /booking request:

\`\`\`javascript
const body = pm.response.json();

// 1. Status
pm.test("Status 200", function () {
  pm.response.to.have.status(200);
});

// 2. Performance
pm.test("Response time < 3s", function () {
  pm.expect(pm.response.responseTime).to.be.below(3000);
});

// 3. Booking ID returned
pm.test("Booking ID is a number", function () {
  pm.expect(body.bookingid).to.be.a("number");
  pm.expect(body.bookingid).to.be.above(0);
});

// 4. Data matches what we sent
pm.test("First name matches", function () {
  pm.expect(body.booking.firstname).to.equal("Sally");
});

pm.test("Last name matches", function () {
  pm.expect(body.booking.lastname).to.equal("Smith");
});

pm.test("Total price matches", function () {
  pm.expect(body.booking.totalprice).to.equal(250);
});

pm.test("Check-in date correct", function () {
  pm.expect(body.booking.bookingdates.checkin).to.equal("2026-03-01");
});

// 5. Save the ID for later
pm.environment.set("booking_id", body.bookingid);
\`\`\`

---

### 💡 What Makes a Good Assertion?

**Bad assertion:**
\`\`\`javascript
pm.test("Response is OK", function () {
  pm.response.to.have.status(200);
});
// ← Only checks the status code. Doesn't verify the data is correct.
\`\`\`

**Good assertion:**
\`\`\`javascript
pm.test("Booking returns correct customer", function () {
  const body = pm.response.json();
  pm.expect(body.firstname).to.equal("Sally");
  pm.expect(body.lastname).to.equal("Smith");
  pm.expect(body.totalprice).to.equal(250);
});
// ← Verifies the ACTUAL DATA returned, not just that something came back
\`\`\`

**Rule:** Status code = the API responded. Data assertions = the API responded *correctly*.
`,
        exercise: {
          title: 'Write Assertions for the Full Booking Lifecycle',
          task: `Add test assertions to each of your 5 saved requests. Each request should have at least 3 assertions:

1. GET /ping — assert status 201 and body contains "Created"
2. GET /booking — assert status 200, response is an array, each item has bookingid
3. POST /booking — assert status 200, bookingid is a number, firstname matches what you sent
4. PUT /booking/{{booking_id}} (update the whole booking) — assert status 200, all fields updated
5. DELETE /booking/{{booking_id}} — assert status 201 (Restful-Booker quirk)

Run the full collection and screenshot the Test Results tab showing all assertions passing.`,
          hints: [
            'Always parse the body first with: const body = pm.response.json()',
            'For PUT, you need the Cookie header with token={{token}} — make sure Create Token runs first',
            'The DELETE endpoint returns 201 with body "Created" — this is a known quirk of Restful-Booker'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'What does pm.expect(body.totalprice).to.be.a("number") assert?',
            options: [
              'That totalprice equals the number 0',
              'That totalprice is of type number (not a string or boolean)',
              'That totalprice is greater than zero',
              'That totalprice is an integer, not a float'
            ],
            answer: 1
          },
          {
            type: 'mcq',
            q: 'Which Chai assertion checks that a string contains a substring?',
            options: ['.to.equal()', '.to.include()', '.to.have.property()', '.to.be.a()'],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'A status code of 200 is sufficient to confirm an API returned the correct data.',
            answer: false
          },
          {
            type: 'fillin',
            q: 'In Postman test scripts, you call _______.json() to parse the response body into a JavaScript object.',
            answer: 'pm.response'
          }
        ]
      },

      // ── Lesson 5 ───────────────────────────────────────────
      {
        id: 'api-l5',
        title: 'Newman — Running Postman Collections from the Command Line',
        type: 'lesson',
        duration: '25 min',
        whatYoullLearn: [
          'What Newman is and why it enables CI/CD for Postman',
          'Install Newman via npm',
          'Export a Postman collection and environment to JSON files',
          'Run a collection from the terminal with Newman',
          'Generate HTML and JUnit XML reports from Newman runs'
        ],
        content: `
## 🖥️ Newman — Postman in the Terminal

Postman is a GUI tool — you click Send. But CI/CD pipelines don't have a GUI. **Newman** is Postman's command-line runner that lets you execute your collections automatically.

---

### 🔧 Install Newman

Newman is an npm package. Make sure you have Node.js installed first:

\`\`\`bash
# Check Node.js is installed
node --version   # Should show v18+ or v20+

# Install Newman globally
npm install -g newman

# Install the HTML report reporter
npm install -g newman-reporter-htmlextra

# Verify installation
newman --version
\`\`\`

---

### 📤 Export Your Collection and Environment

Newman needs the collection and environment as JSON files.

**Export Collection:**
1. In Postman, right-click your collection → **Export**
2. Choose **Collection v2.1**
3. Save as \`restful-booker-tests.json\`

**Export Environment:**
1. Click the **Environments** icon → hover over your environment → click the **...** menu → **Export**
2. Save as \`restful-booker-env.json\`

Put both files in a folder: \`api-tests/\`

---

### ▶️ Run with Newman

\`\`\`bash
# Basic run — just pass/fail in terminal
newman run api-tests/restful-booker-tests.json \\
  --environment api-tests/restful-booker-env.json

# With HTML report
newman run api-tests/restful-booker-tests.json \\
  --environment api-tests/restful-booker-env.json \\
  --reporters htmlextra \\
  --reporter-htmlextra-export api-tests/report.html

# With JUnit XML (for CI systems like Jenkins/GitHub Actions)
newman run api-tests/restful-booker-tests.json \\
  --environment api-tests/restful-booker-env.json \\
  --reporters junit \\
  --reporter-junit-export api-tests/results.xml
\`\`\`

---

### 📊 Reading Newman Terminal Output

\`\`\`
→ Health Check
  GET https://restful-booker.herokuapp.com/ping [201 Created, 243ms]
  ✓  Status is 201
  ✓  Body is Created

→ Create Token
  POST https://restful-booker.herokuapp.com/auth [200 OK, 312ms]
  ✓  Status is 200
  ✓  Token received

→ Create Booking
  POST https://restful-booker.herokuapp.com/booking [200 OK, 198ms]
  ✓  Status 200
  ✓  Booking ID is a number
  ✓  First name matches

┌─────────────────────────┬────────────────────┬───────────────────┐
│                         │           executed │            failed │
├─────────────────────────┼────────────────────┼───────────────────┤
│              iterations │                  1 │                 0 │
│                requests │                  8 │                 0 │
│            test-scripts │                  8 │                 0 │
│      prerequest-scripts │                  0 │                 0 │
│              assertions │                 24 │                 0 │
├─────────────────────────┴────────────────────┴───────────────────┤
│ total run duration: 2.4s                                          │
│ total data received: 2.38kB (approx)                              │
│ average response time: 299ms [min: 191ms, max: 402ms]            │
└──────────────────────────────────────────────────────────────────┘
\`\`\`

**Green ✓** = assertion passed. **Red ✗** = assertion failed, tells you which one.

---

### 🚦 Exit Codes — How CI Knows if Tests Passed

Newman exits with:
- **Exit code 0** — all tests passed (CI marks build as green)
- **Exit code 1** — at least one test failed (CI marks build as red/failed)

This is how you "fail the build" on API test failures in GitHub Actions.

---

### 📁 Multiple Reporters at Once

\`\`\`bash
newman run api-tests/restful-booker-tests.json \\
  --environment api-tests/restful-booker-env.json \\
  --reporters cli,htmlextra,junit \\
  --reporter-htmlextra-export api-tests/report.html \\
  --reporter-junit-export api-tests/results.xml
\`\`\`

This gives you:
- **cli** → terminal output (good for immediate feedback)
- **htmlextra** → beautiful HTML report (good for sharing)
- **junit** → XML for CI systems (good for pipeline integration)

---

### 📦 Package It with npm scripts

Create a \`package.json\` in your \`api-tests/\` folder:

\`\`\`json
{
  "name": "restful-booker-api-tests",
  "scripts": {
    "test": "newman run restful-booker-tests.json --environment restful-booker-env.json --reporters cli,htmlextra --reporter-htmlextra-export report.html"
  },
  "devDependencies": {
    "newman": "^6.0.0",
    "newman-reporter-htmlextra": "^1.22.0"
  }
}
\`\`\`

Now anyone can run your tests with just: \`npm test\`
`,
        exercise: {
          title: 'Run Your Collection with Newman',
          task: `Export your Postman collection and environment, then run them with Newman:

1. Export your "Restful-Booker Tests" collection as JSON
2. Export your "Restful-Booker" environment as JSON
3. Install Newman and newman-reporter-htmlextra globally via npm
4. Run the collection with all 3 reporters (cli, htmlextra, junit)
5. Open the generated report.html file in your browser
6. Screenshot the terminal output showing all requests passing and the HTML report open in browser`,
          hints: [
            'Put both JSON files in the same folder before running Newman from that folder',
            'If Newman says "collection not found", check the file path — use the full path if needed',
            'The htmlextra report creates a single HTML file you can open in any browser'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'Why is Newman needed when Postman already has a Collection Runner?',
            options: [
              'Newman is faster than the Postman Collection Runner',
              'Newman runs collections from the command line, enabling CI/CD automation without a GUI',
              'Newman supports more HTTP methods than Postman',
              'Newman can test GraphQL APIs while Postman cannot'
            ],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'Newman exits with code 0 when all tests pass, allowing CI pipelines to detect success or failure.',
            answer: true
          },
          {
            type: 'mcq',
            q: 'Which Newman reporter generates output compatible with Jenkins and GitHub Actions test reporting?',
            options: ['cli', 'htmlextra', 'junit', 'json'],
            answer: 2
          },
          {
            type: 'fillin',
            q: 'To include multiple reporters in a single Newman run, use the _______ flag followed by comma-separated reporter names.',
            answer: '--reporters'
          }
        ]
      },

      // ── Lesson 6 ───────────────────────────────────────────
      {
        id: 'api-l6',
        title: 'Newman in GitHub Actions — API Tests in CI',
        type: 'lesson',
        duration: '30 min',
        whatYoullLearn: [
          'Set up a GitHub repository for your API tests',
          'Write a GitHub Actions workflow that runs Newman automatically',
          'Store sensitive credentials as GitHub Secrets',
          'Publish test results as a CI artefact',
          'Fail the build when API tests fail'
        ],
        content: `
## 🚀 Newman in GitHub Actions

You now have API tests that run locally. Let's make them run automatically every time you push code — in the cloud.

---

### 📁 Repository Structure

Create a GitHub repository with this structure:

\`\`\`
restful-booker-api-tests/
├── .github/
│   └── workflows/
│       └── api-tests.yml       ← The CI pipeline
├── collections/
│   └── restful-booker.json     ← Exported Postman collection
├── environments/
│   └── restful-booker.json     ← Exported Postman environment (WITHOUT secrets)
├── reports/                    ← Newman creates this at runtime
└── package.json
\`\`\`

---

### 🔑 Handling Credentials Safely

Your environment JSON file may contain usernames/passwords. **Never commit secrets to Git.**

Instead, use **GitHub Secrets**:

1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add:
   - Name: \`API_USERNAME\`  Value: \`admin\`
   - Name: \`API_PASSWORD\`  Value: \`password123\`

In your environment JSON, replace the actual values with placeholder text — GitHub Actions will inject the real values via the workflow.

---

### 📝 The GitHub Actions Workflow

Create \`.github/workflows/api-tests.yml\`:

\`\`\`yaml
name: API Tests — Restful-Booker

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:       # Allow manual trigger from GitHub UI

jobs:
  api-tests:
    runs-on: ubuntu-latest

    steps:
      # 1. Check out the code
      - name: Checkout repository
        uses: actions/checkout@v4

      # 2. Set up Node.js
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      # 3. Install Newman and reporters
      - name: Install Newman
        run: |
          npm install -g newman
          npm install -g newman-reporter-htmlextra

      # 4. Create reports directory
      - name: Create reports directory
        run: mkdir -p reports

      # 5. Run the tests
      - name: Run API tests with Newman
        run: |
          newman run collections/restful-booker.json \\
            --environment environments/restful-booker.json \\
            --env-var "username=\${{ secrets.API_USERNAME }}" \\
            --env-var "password=\${{ secrets.API_PASSWORD }}" \\
            --reporters cli,htmlextra,junit \\
            --reporter-htmlextra-export reports/api-test-report.html \\
            --reporter-junit-export reports/api-test-results.xml

      # 6. Upload the HTML report as a downloadable artefact
      - name: Upload test report
        uses: actions/upload-artifact@v4
        if: always()     # Upload even if tests fail — so you can see what went wrong
        with:
          name: api-test-report
          path: reports/

      # 7. Publish JUnit results in the GitHub UI
      - name: Publish test results
        uses: dorny/test-reporter@v1
        if: always()
        with:
          name: Newman API Tests
          path: reports/api-test-results.xml
          reporter: java-junit
\`\`\`

---

### 🎯 What Happens When You Push

\`\`\`
git add .
git commit -m "add api tests"
git push origin main
\`\`\`

1. GitHub Actions detects the push
2. Spins up an Ubuntu machine
3. Installs Node.js + Newman
4. Runs your entire test collection
5. If all assertions pass → **green checkmark** on your commit
6. If any assertion fails → **red X** on your commit
7. HTML report uploaded → download from the Actions tab

---

### 📊 Viewing Results in GitHub

In your repository, click **Actions** tab:

\`\`\`
✅ API Tests — Restful-Booker  (pushed 2 minutes ago)
   Run #4 · main · 1m 23s

   Job: api-tests ✅
   Steps:
   ✅ Checkout repository
   ✅ Set up Node.js
   ✅ Install Newman
   ✅ Run API tests with Newman
      → 8 requests · 24 assertions · 0 failures
   ✅ Upload test report
   ✅ Publish test results
\`\`\`

Click **api-test-report** in the artefacts section to download the HTML report.

---

### 🔴 When Tests Fail

If Newman finds a failing assertion, it exits with code 1 — the step fails, the job fails, and GitHub marks the commit with a red X.

Your team sees immediately that something is broken. The downloaded report shows exactly which request failed and which assertion didn't pass.

This is **continuous API quality** — every push is automatically validated.
`,
        exercise: {
          title: 'Set Up Your First CI API Pipeline',
          task: `Create a GitHub repository and set up automated API testing:

1. Create a new public GitHub repo called "restful-booker-api-tests"
2. Add your exported collection and environment JSON files to the correct folders
3. Create the .github/workflows/api-tests.yml workflow exactly as shown
4. Add API_USERNAME and API_PASSWORD as GitHub Secrets
5. Push everything to main
6. Watch the Actions tab — wait for the workflow to complete
7. Screenshot the passing green workflow run AND download the HTML report artifact`,
          hints: [
            'Use "workflow_dispatch" in the trigger to manually re-run if you need to test without pushing',
            'The "if: always()" on the upload step is critical — without it, a failed run won\'t upload the report',
            'If the run fails at step 5, click on the failed step to see Newman\'s output and find the failing assertion'
          ]
        },
        quiz: [
          {
            type: 'mcq',
            q: 'Why should you use GitHub Secrets for API credentials instead of putting them in the environment JSON file?',
            options: [
              'GitHub Secrets are faster to access than JSON files',
              'Committing credentials to Git is a security risk — Secrets keep them out of the codebase',
              'Newman only reads credentials from GitHub Secrets',
              'JSON files cannot store string values'
            ],
            answer: 1
          },
          {
            type: 'truefalse',
            q: 'The "if: always()" condition on the upload-artifact step ensures the report is uploaded even if the tests fail.',
            answer: true
          },
          {
            type: 'fillin',
            q: 'In GitHub Actions, you reference a secret called MY_TOKEN using the syntax _______ in your workflow YAML.',
            answer: '${{ secrets.MY_TOKEN }}'
          },
          {
            type: 'mcq',
            q: 'What happens to the GitHub commit status when Newman finds a failing API assertion?',
            options: [
              'The commit gets a yellow warning indicator',
              'Nothing — Newman only reports in the terminal',
              'The commit gets a red X and the CI job is marked as failed',
              'The commit is automatically reverted'
            ],
            answer: 2
          }
        ]
      }
    ]
  }

]; // Modules 3-4 added by api-curriculum-advanced.js
