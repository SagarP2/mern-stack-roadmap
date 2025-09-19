import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  const loadTasks = async () => {
    try {
      const { data } = await API.get('/tasks');
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!title) return;
    await API.post('/tasks', { title });
    setTitle('');
    loadTasks();
  };

  const toggleComplete = async (id, completed) => {
    await API.put(`/tasks/${id}`, { completed: !completed });
    loadTasks();
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    loadTasks();
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => { loadTasks(); }, []);

  return (
    <div>
      <h2>Your Tasks</h2>
      <button onClick={logout}>Logout</button>
      <form onSubmit={addTask}>
        <input placeholder="New task title" value={title} onChange={e=>setTitle(e.target.value)} />
        <button type="submit">Add</button>
      </form>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            <span style={{textDecoration: task.completed ? 'line-through':'none'}}
              onClick={()=>toggleComplete(task._id,task.completed)}>
              {task.title}
            </span>
            <button onClick={()=>deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
