# 📘 Stage 7: Advanced MERN Topics  

**Goal** → Prepare for **real-world MERN applications** with advanced tools & best practices.  

---

## 1. Redux / Zustand for State Management  

When apps grow, **state management** becomes complex.  
- **Redux** → industry standard, centralized store, predictable.  
- **Zustand** → lightweight alternative (simpler syntax).  

Redux example:  
```bash
npm install @reduxjs/toolkit react-redux
```

```js
// store.js
import { configureStore, createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { name: "" },
  reducers: {
    setUser: (state, action) => { state.name = action.payload; }
  }
});

export const { setUser } = userSlice.actions;
export const store = configureStore({ reducer: { user: userSlice.reducer } });
```

```jsx
// App.js
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "./store";

function App() {
  const user = useSelector(state => state.user.name);
  const dispatch = useDispatch();

  return (
    <div>
      <h1>Hello {user}</h1>
      <button onClick={() => dispatch(setUser("Sagar"))}>Set User</button>
    </div>
  );
}
```

---

## 2. File Uploads (Multer, Cloudinary)  

- **Multer** → upload files to server.  
- **Cloudinary** → store media in cloud.  

```bash
npm install multer cloudinary
```

Example with Multer:  
```js
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), (req, res) => {
  res.send("File uploaded: " + req.file.originalname);
});
```

---

## 3. Security Best Practices  

Install:  
```bash
npm install helmet express-rate-limit express-validator
```

- **Helmet** → secure HTTP headers.  
- **Rate Limiting** → prevent DDoS attacks.  
- **Validation** → sanitize user input.  

Example:  
```js
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");

app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.post("/register",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors.array());
    res.send("User registered");
  }
);
```

---

## 4. Testing  

- **Backend** → Jest & Supertest.  
- **Frontend** → React Testing Library.  

Example (React Testing Library):  
```bash
npm install --save-dev @testing-library/react jest
```

```jsx
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders hello text", () => {
  render(<App />);
  expect(screen.getByText(/hello/i)).toBeInTheDocument();
});
```

---

## 5. Docker for Containerization  

Package full MERN app into containers.  

`Dockerfile` for Node.js:  
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

👉 Benefits: portable, consistent environment, easy deployment.  

---

## 6. CI/CD with GitHub Actions  

Automate testing & deployment.  

`.github/workflows/node.yml`:  
```yaml
name: Node.js CI

on:
  push:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm test
```

👉 Every push runs tests before merging/deploying.  

---

# 📝 Learning Notes – Advanced MERN  

- **State Management** → use Redux or Zustand for large apps.  
- **File Uploads** → Multer (local) or Cloudinary (cloud).  
- **Security** → Helmet, rate limiting, input validation are must.  
- **Testing** → ensures apps don’t break during changes.  
- **Docker** → helps run apps in any environment.  
- **CI/CD** → automates testing & deployment, used in real-world teams.  

✅ **Stage 7 Goal**:  
- Learn production-ready MERN stack.  
- Add state management, security, file uploads.  
- Write tests.  
- Use Docker & CI/CD for deployment.  
