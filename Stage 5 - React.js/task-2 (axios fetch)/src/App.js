import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // fetch posts function
  const loadPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("https://jsonplaceholder.typicode.com/posts");
      setPosts(res.data);
    } catch (err) {
      setError("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  // fetch on mount
  useEffect(() => {
    loadPosts();
  }, []);

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2 style={{ color: "red" }}>{error}</h2>;

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Fetched Posts</h1>
      <button onClick={loadPosts} style={{ marginBottom: 15 }}>
        Refresh
      </button>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {posts.slice(0, 10).map((post) => (
          <li
            key={post.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 6,
              padding: 10,
              marginBottom: 10,
              background: "#f9f9f9",
            }}
          >
            <h3 style={{ margin: "0 0 6px 0" }}>{post.title}</h3>
            <p style={{ margin: 0 }}>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
