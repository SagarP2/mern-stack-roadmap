# 📘 Stage 6: Full MERN Integration

**Goal** → Connect **React (frontend)** with **Node.js + Express (backend)** and **MongoDB (database)**.  

---

## 1. Connecting Frontend & Backend

- React runs on port `3000` (frontend).  
- Express runs on port `5000` (backend).  
- Use **Axios** in React to call Express API.  

Example (React):  
```jsx
import axios from "axios";
import React, { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/users")
      .then(res => setUsers(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <ul>
      {users.map(user => <li key={user._id}>{user.name}</li>)}
    </ul>
  );
}

export default App;
```

---

## 2. CORS Issues

If frontend & backend run on different ports, you’ll face **CORS errors**.  
Fix by enabling `cors` in backend:  

```bash
npm install cors
```

In `server.js`:  
```js
const cors = require("cors");
app.use(cors({ origin: "http://localhost:3000" }));
```

👉 Allows React (frontend) to talk with Express (backend).  

---

## 3. Axios in React for API Calls

Use Axios to interact with backend APIs.  
Example (POST request for signup):  

```jsx
axios.post("http://localhost:5000/api/register", {
  name: "Sagar",
  email: "sagar@test.com",
  password: "123456"
})
.then(res => console.log(res.data))
.catch(err => console.log(err));
```

---

## 4. Authentication & JWT

- **JWT (JSON Web Token)** → secure way to authenticate users.  
- Flow:
  1. User logs in → backend validates → generates JWT.  
  2. JWT is sent to frontend → stored in **localStorage**.  
  3. For protected routes → frontend sends JWT in headers.  

Backend example:  
```js
const jwt = require("jsonwebtoken");

app.post("/login", (req, res) => {
  const user = { id: 1, name: "Sagar" };
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Middleware to protect routes
function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).send("Token required");

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send("Invalid Token");
    req.user = decoded;
    next();
  });
}

app.get("/protected", verifyToken, (req, res) => {
  res.send("This is a protected route");
});
```

---

## 5. Protected Routes in React

Use React Router + token check.  

```jsx
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}
```

Usage:  
```jsx
<Routes>
  <Route path="/dashboard" element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } />
</Routes>
```

---

## 6. Deployment (Vercel, Render, Railway)

- **Frontend (React)** → deploy on **Vercel** or **Netlify**.  
- **Backend (Express)** → deploy on **Render**, **Railway**, or **Heroku**.  
- **Database (MongoDB)** → use **MongoDB Atlas**.  

👉 Best MERN Deployment Setup:  
- React → Vercel  
- Node.js/Express → Render  
- MongoDB → Atlas  

---

# 📝 Learning Notes – MERN Integration

- MERN = MongoDB + Express + React + Node.js.  
- **Frontend & backend need to communicate via APIs**.  
- CORS must be handled when running on different domains.  
- JWT is the standard for authentication in MERN apps.  
- Protected routes ensure only logged-in users access certain pages.  
- Deployment requires hosting frontend, backend, and DB separately.  

✅ **Stage 6 Goal**:  
- Connect React with Node & MongoDB.  
- Handle CORS issues.  
- Use Axios for API calls.  
- Implement JWT authentication.  
- Protect frontend routes.  
- Deploy full MERN app online.  
