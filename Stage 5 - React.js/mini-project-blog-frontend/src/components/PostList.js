import React from "react";

function PostList({ posts }) {
  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {posts.map((post) => (
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
  );
}

export default PostList;
