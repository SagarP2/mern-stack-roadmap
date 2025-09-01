# 📘 Stage 3: Node.js & Express Fundamentals

---

## 1. Node.js Basics (Event Loop, npm)

**Node.js** = JavaScript runtime that runs outside the browser (on servers).  
It’s built on **V8 engine** (same as Chrome).

### Event Loop
Node.js is **non-blocking** → It handles multiple requests using the **event loop** instead of creating multiple threads.

```js
console.log("Start");

setTimeout(() => {
  console.log("Inside Timeout");
}, 1000);

console.log("End");
```

Output:
```
Start
End
Inside Timeout
```

👉 This proves Node.js is **asynchronous**.

### npm (Node Package Manager)
- Comes with Node.js.  
- Used to install packages/libraries.  

Commands:
```bash
npm init -y          # Initialize project
npm install express  # Install Express
npm install dotenv   # Install dotenv
npm install nodemon  # Install dev dependency
```

---

## 2. HTTP Module

Node.js has a built-in `http` module to create servers.

```js
const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello from Node.js server!");
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
```

👉 Basic, but usually we use **Express** for easier routing.

---

## 3. Express Basics (Routing, Middleware)

Express = **minimal Node.js framework** for building APIs quickly.

### Install
```bash
npm install express
```

### Simple Server
```js
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello Express!");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
```

### Middleware
Middleware = functions that run **before request reaches final route handler**.

```js
app.use(express.json()); // built-in middleware for JSON body parsing

app.use((req, res, next) => {
  console.log("Request URL:", req.url);
  next(); // move to next middleware/route
});
```

---

## 4. REST API Basics (CRUD)

**REST = Representational State Transfer** → Standard for APIs.

👉 CRUD = Create, Read, Update, Delete

Example Express CRUD API:
```js
let users = [{ id: 1, name: "Sagar" }];

app.get("/users", (req, res) => {
  res.json(users); // Read
});

app.post("/users", (req, res) => {
  const newUser = { id: users.length + 1, name: req.body.name };
  users.push(newUser);
  res.status(201).json(newUser); // Create
});

app.put("/users/:id", (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  if (!user) return res.status(404).send("User not found");
  user.name = req.body.name;
  res.json(user); // Update
});

app.delete("/users/:id", (req, res) => {
  users = users.filter(u => u.id != req.params.id);
  res.status(204).send(); // Delete
});
```

---

## 5. Error Handling

Express allows error-handling middleware.

```js
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});
```

👉 Always handle errors gracefully (no server crashes).

---

## 6. Environment Variables (dotenv)

Keep secrets (like DB passwords, API keys) outside code.

Install dotenv:
```bash
npm install dotenv
```

Create `.env`:
```
PORT=4000
DB_URL=mongodb://localhost:27017/mydb
```

Use in app:
```js
require("dotenv").config();

const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## 7. Postman for API Testing

**Postman** is a tool to test APIs without writing frontend code.

- Send GET, POST, PUT, DELETE requests.  
- Add headers, body, and environment variables.  
- Save collections for teamwork.  

👉 For beginners: After creating an Express API, test routes in Postman.

---

# 📝 Learning Notes – Node.js & Express Fundamentals

### 1. Node.js
- Runs JS outside the browser (backend).  
- Uses **event loop** → handles async tasks efficiently.  
- Uses **npm** for packages.  

### 2. Express
- Minimal framework for APIs.  
- Handles **routing** (GET, POST, PUT, DELETE).  
- Uses **middleware** for JSON, logging, error handling.  

### 3. REST
- REST = Representational State Transfer.  
- APIs follow **CRUD pattern**.  

### 4. Environment Variables
- Store secrets safely (`.env`).  
- Use `dotenv` to load variables.  

### 5. Postman
- Helps test APIs easily.  
- No need to build frontend just for testing.  

✅ **Stage 3 Goal**:  
- Understand Node.js basics & event loop.  
- Use Express for APIs.  
- Build a simple CRUD REST API.  
- Handle errors & use `.env` securely.  
- Test APIs with Postman.  
