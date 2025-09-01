# 📘 Stage 1: JavaScript Fundamentals

---

## 1. Variables (var, let, const)

Variables are containers for storing data.

- **`var`** → *Function-scoped*, old way (avoid in modern JS).  
- **`let`** → *Block-scoped*, value can be reassigned.  
- **`const`** → *Block-scoped*, cannot be reassigned (but arrays/objects can still be modified).  

```js
var old = "I am var"; // function-scoped
let age = 20;         // block-scoped
const name = "Sagar"; // constant
```

👉 **Best practice**: Use `const` by default, use `let` if the value changes. Avoid `var`.

---

## 2. Data Types & Type Conversion

### Primitive (immutable)
- **Number** → `42`
- **String** → `"Hello"`
- **Boolean** → `true / false`
- **Null** → `null`
- **Undefined** → `undefined`
- **Symbol** → unique values
- **BigInt** → very large numbers (`123n`)

### Non-Primitive (mutable)
- **Object** → `{ key: value }`
- **Array** → `[1, 2, 3]`
- **Function** → `function() {}`

### Type Conversion
```js
let num = "123";
console.log(Number(num));  // 123
console.log(String(123));  // "123"
console.log(Boolean(0));   // false
```

👉 Automatic conversion by JS is called **type coercion**.  

---

## 3. Functions

Functions are reusable blocks of code.

### Normal Function
```js
function greet(name) {
  return "Hello, " + name;
}
console.log(greet("Sagar"));
```

### Arrow Function
```js
const greet = (name) => "Hello, " + name;
```

### Callback Function
A function passed as an argument to another function.
```js
function processUserInput(callback) {
  let name = "Priyanshu";
  callback(name);
}

processUserInput((name) => {
  console.log("Hello " + name);
});
```

---

## 4. Scope & Hoisting

### Scope
- **Global Scope** → Accessible everywhere.  
- **Function Scope** → Variables inside a function.  
- **Block Scope (`let`, `const`)** → Inside `{}`.  

### Hoisting
JavaScript moves declarations to the top of their scope.

```js
console.log(a); // undefined
var a = 10;

console.log(b); // ❌ Error
let b = 20;
```

👉 `var` is hoisted with *undefined*.  
👉 `let` and `const` are hoisted but not initialized.

---

## 5. DOM Manipulation

The **DOM (Document Object Model)** represents the web page structure.

### Selecting Elements
```js
document.getElementById("myId");
document.querySelector(".myClass");
```

### Changing Content
```js
document.getElementById("myId").innerText = "New text!";
```

### Creating & Appending
```js
let p = document.createElement("p");
p.innerText = "Hello DOM!";
document.body.appendChild(p);
```

### Event Listeners
```js
document.getElementById("btn").addEventListener("click", () => {
  alert("Button Clicked!");
});
```

---

## 6. ES6+ Features

Modern syntax used in React & Node.

### Destructuring
```js
const person = { name: "Sagar", age: 22 };
const { name, age } = person;
```

### Spread Operator
```js
let arr = [1, 2, 3];
let newArr = [...arr, 4, 5]; // [1, 2, 3, 4, 5]
```

### Template Literals
```js
let name = "Sagar";
console.log(`Hello, ${name}!`);
```

---

## 7. Async JavaScript

JS is **single-threaded** → async helps handle long tasks like API calls.

### Promises
```js
let promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve("Done!"), 1000);
});

promise.then((res) => console.log(res));
```

### Async/Await
```js
async function fetchData() {
  let response = await fetch("https://jsonplaceholder.typicode.com/posts/1");
  let data = await response.json();
  console.log(data);
}
fetchData();
```

---

## 8. JSON & API Calls

**JSON (JavaScript Object Notation)** → lightweight data format.

```js
let user = { name: "Sagar", age: 22 };
console.log(JSON.stringify(user)); // object → JSON string
console.log(JSON.parse('{"name":"Sagar","age":22}')); // string → object
```

### Fetch API
```js
fetch("https://jsonplaceholder.typicode.com/posts")
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
```

---

# 📝 Learning Notes – JavaScript Fundamentals

### 1. JavaScript powers both frontend & backend
- Originally built for **browsers** (web interactivity).  
- With **Node.js**, it runs on servers too.  
- Meaning:  
  - **Frontend** → React.js (UI).  
  - **Backend** → Node.js + Express (APIs, databases).  
- **Advantage** → One language for full stack.  

👉 That’s why JS is the backbone of the **MERN Stack**.

---

### 2. ES6 Syntax is mandatory
- Introduced in **2015 (ES6)** → modern, cleaner JS.  
- Key features:  
  - `let` / `const`  
  - Arrow functions  
  - Template literals  
  - Destructuring  
  - Spread/rest operator  
  - Modules (`import/export`)  
  - Async/await  

👉 React & Node both heavily rely on ES6. Without it, code looks old and harder to manage.  

---

### 3. Event Loop – How JS Executes Code
JS is **single-threaded** → runs **one task at a time**.  
But it supports async tasks using the **event loop**.

- **Call Stack** → runs synchronous code line by line.  
- **Web APIs** → handles async tasks (`setTimeout`, `fetch`).  
- **Callback Queue** → completed async tasks wait here.  
- **Event Loop** → moves tasks from queue → stack when stack is free.  

Example:
```js
console.log("Start");

setTimeout(() => console.log("Inside Timeout"), 1000);

console.log("End");
```

Output:
```
Start
End
Inside Timeout
```

👉 Even though `setTimeout` comes before `"End"`, it runs later because async tasks wait for the event loop.

---

### 4. Why these notes matter for juniors
- Knowing **variables, functions, scope, DOM, ES6, async, and APIs** →  
  you can already build **basic websites**.  
- These fundamentals directly apply to:  
  - React → heavy ES6 usage.  
  - Node.js → async everywhere.  
  - Real projects → APIs, JSON, DOM events.  

👉 If you skip fundamentals → you will struggle in React/Node.  
👉 Mastering fundamentals = strong MERN foundation.

---

✅ **Stage 1 Goal**  
- Learn syntax + concepts.  
- Understand **why ES6 & async matter**.  
- Build a **solid base** before moving to frameworks.  
