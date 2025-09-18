import React, { useEffect, useState } from "react";
import PostList from "./components/PostList";

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts");
      if (!res.ok) throw new Error("Network error");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      setError("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>📖 Blog Posts</h1>
      <button onClick={fetchPosts} style={{ marginBottom: 15 }}>
        Refresh
      </button>

      {loading && <h3>Loading...</h3>}
      {error && <h3 style={{ color: "red" }}>{error}</h3>}

      {!loading && !error && <PostList posts={posts.slice(0, 10)} />}
    </div>
  );
}

export default App;
