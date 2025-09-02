# 📘 Stage 4: MongoDB Fundamentals

---

## 1. NoSQL vs SQL

- **SQL (Relational DBs like MySQL, PostgreSQL)**  
  - Data stored in **tables (rows & columns)**.  
  - Strong schema (fixed structure).  
  - Example: Students table → each row = student.  

- **NoSQL (MongoDB, Firebase, Cassandra)**  
  - Data stored in **documents** (JSON-like).  
  - Flexible schema (can store different fields in different docs).  
  - Example: A student document may or may not have "phone".  

👉 MongoDB = **NoSQL, document-based** DB.  

---

## 2. MongoDB Basics

- **Database** → like a folder for collections.  
- **Collection** → like a table, holds many documents.  
- **Document** → like a row, but in JSON format.  

Example Document:  
```json
{
  "name": "Sagar",
  "age": 22,
  "skills": ["JavaScript", "Node", "MongoDB"]
}
```

---

## 3. CRUD in MongoDB

CRUD = Create, Read, Update, Delete.  

### Create
```js
db.users.insertOne({ name: "Priyanshu", age: 20 });
db.users.insertMany([{ name: "Rohil" }, { name: "Sagar" }]);
```

### Read
```js
db.users.find();         // all users
db.users.findOne({ name: "Sagar" });
```

### Update
```js
db.users.updateOne(
  { name: "Sagar" },
  { $set: { age: 23 } }
);
```

### Delete
```js
db.users.deleteOne({ name: "Rohil" });
```

---

## 4. Connecting MongoDB to Express using Mongoose

Install mongoose:
```bash
npm install mongoose
```

Connect in `app.js`:
```js
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));
```

---

## 5. Schema & Models

- **Schema** → defines structure of documents.  
- **Model** → object we use to interact with collection.  

Example:  
```js
const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String
});

const User = mongoose.model("User", userSchema);

// create
const newUser = new User({ name: "Sagar", age: 22, email: "sagar@test.com" });
await newUser.save();
```

---

## 6. MongoDB Atlas (Cloud)

- Free cloud database service by MongoDB.  
- Steps:
  1. Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas).  
  2. Create cluster → Database → Get connection string.  
  3. Copy URI → put into `.env` as:  
     ```
     MONGO_URI="your_connection_string"
     ```

---

# 📝 Learning Notes – MongoDB

- MongoDB stores data as **JSON-like documents**.  
- NoSQL → schema-less, flexible, great for modern apps.  
- Always use `.env` for DB credentials → never push to GitHub.  
- Mongoose helps with schemas & validation.  
- Atlas = best option for hosting DB online.  

✅ **Stage 4 Goal**:  
- Understand SQL vs NoSQL differences.  
- Perform CRUD in MongoDB.  
- Connect MongoDB with Express using Mongoose.  
- Work with schemas & models.  
- Use MongoDB Atlas with secure `.env` config.  
