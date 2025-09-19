const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // serve frontend

let posts = [];
let idCounter = 1;

// 🏠 Home (serves index.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ➕ Create
app.post("/posts", (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ message: "Title and content required" });
  const newPost = { id: idCounter++, title, content };
  posts.push(newPost);
  res.status(201).json(newPost);
});

// 📖 Read all
app.get("/posts", (req, res) => res.json(posts));

// 📖 Read one
app.get("/posts/:id", (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
});

// ✏️ Update
app.put("/posts/:id", (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ message: "Post not found" });

  const { title, content } = req.body;
  if (title) post.title = title;
  if (content) post.content = content;

  res.json(post);
});

// 🗑️ Delete
app.delete("/posts/:id", (req, res) => {
  const index = posts.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Post not found" });

  posts.splice(index, 1);
  res.json({ message: "Deleted" });
});

// 🚀 Start
app.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`));
