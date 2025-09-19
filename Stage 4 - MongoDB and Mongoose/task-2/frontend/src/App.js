import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/users";

export default function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get(API);
    setUsers(res.data);
  };

  const create = async () => {
    await axios.post(API, {
      name: "Test",
      email: `t${Date.now()}@x.com`,
      password: "123",
    });
    fetchUsers();
  };

  const edit = async (u) => {
    const name = window.prompt("Enter new name", u.name);
    if (!name) return;
    await axios.put(`${API}/${u._id}`, { name });
    fetchUsers();
  };

  const del = async (id) => {
    if (!window.confirm("Delete?")) return;
    await axios.delete(`${API}/${id}`);
    fetchUsers();
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={create}>Create quick user</button>
      <ul>
        {users.map((u) => (
          <li key={u._id}>
            {u.name} ({u.email})
            <button onClick={() => edit(u)}>Edit</button>
            <button onClick={() => del(u._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
