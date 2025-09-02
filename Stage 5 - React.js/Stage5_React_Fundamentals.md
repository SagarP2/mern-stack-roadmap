# 📘 Stage 5: React Fundamentals

---

## 1. React Basics (Components, JSX)

- **React** is a JavaScript library for building user interfaces.  
- **Component** = reusable block of UI.  
- **JSX** = JavaScript + HTML syntax (must be inside one parent element).  

Example Component:
```jsx
function Welcome() {
  return <h1>Hello, React!</h1>;
}
```

---

## 2. Props & State

- **Props** → data passed *from parent to child*.  
- **State** → data that belongs to a component, can change over time.  

Example:
```jsx
function Greeting(props) {
  return <h2>Hello, {props.name}</h2>;
}

function App() {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <Greeting name="Sagar" />
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

---

## 3. Event Handling

React uses **camelCase** for events.  

```jsx
<button onClick={() => alert("Clicked!")}>Click Me</button>
```

---

## 4. Conditional Rendering

Render UI based on conditions.  

```jsx
function User({ isLoggedIn }) {
  return isLoggedIn ? <h1>Welcome!</h1> : <h1>Please Login</h1>;
}
```

---

## 5. Lists & Keys

Render arrays using `map()`.  

```jsx
const items = ["Apple", "Banana", "Mango"];

<ul>
  {items.map((item, index) => (
    <li key={index}>{item}</li>
  ))}
</ul>
```

👉 Always use a **unique key** when rendering lists.

---

## 6. Hooks (useState, useEffect)

- **useState** → manage local state.  
- **useEffect** → perform side effects (API calls, timers).  

```jsx
function Counter() {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    console.log("Count changed:", count);
  }, [count]);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}
```

---

## 7. Controlled vs Uncontrolled Components

- **Controlled** → value controlled by React state.  
```jsx
function Form() {
  const [input, setInput] = React.useState("");

  return (
    <input 
      value={input} 
      onChange={(e) => setInput(e.target.value)} 
    />
  );
}
```

- **Uncontrolled** → uses `ref`, not state.  
```jsx
function Form() {
  const inputRef = React.useRef();

  function handleSubmit() {
    alert(inputRef.current.value);
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleSubmit}>Submit</button>
    </>
  );
}
```

---

## 8. Context API

Share data globally without prop drilling.  

```jsx
const ThemeContext = React.createContext();

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Child />
    </ThemeContext.Provider>
  );
}

function Child() {
  const theme = React.useContext(ThemeContext);
  return <h1>Theme: {theme}</h1>;
}
```

---

## 9. React Router (SPA Navigation)

Install:  
```bash
npm install react-router-dom
```

Example:
```jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>

      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/about" element={<h1>About</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 10. Axios for API Calls

Install:  
```bash
npm install axios
```

Example:
```jsx
import axios from "axios";
import React from "react";

function App() {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/posts")
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <ul>
      {data.slice(0, 5).map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

---

# 📝 Learning Notes – React

- Components = **reusable UI blocks**.  
- **Props** pass data down, **state** manages internal changes.  
- **JSX** is HTML-like, but must return a single parent element.  
- **Hooks (useState, useEffect)** are key to modern React.  
- **Controlled components** use state, **uncontrolled** use refs.  
- **Context API** helps avoid prop drilling.  
- **React Router** makes single-page apps possible.  
- **Axios** is commonly used for API requests.  

✅ **Stage 5 Goal**:  
- Understand React components, JSX, props & state.  
- Handle events, conditions, and lists.  
- Use hooks for state & effects.  
- Work with forms (controlled/uncontrolled).  
- Share data with Context API.  
- Build SPAs using React Router.  
- Fetch data with Axios.  
