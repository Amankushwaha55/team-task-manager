import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  
  // Forms inputs
  const [pTitle, setPTitle] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [tTitle, setTTitle] = useState('');
  const [tDesc, setTDesc] = useState('');
  const [tProj, setTProj] = useState('');
  const [tAssign, setTAssign] = useState('');
  const [tDue, setTDue] = useState('');
  const [tPriority, setTPriority] = useState('Medium');

  const navigate = useNavigate();
  
  // API URL helper — CHANGE TO PRODUCTION RAILWAY LINK LATER
  const BASE_URL = "http://localhost:5000/api";

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedUser) {
      navigate('/');
      return;
    }
    setUser(loggedUser);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const resTasks = await axios.get(`${BASE_URL}/tasks`, getHeaders());
      setTasks(resTasks.data);
      
      const resProj = await axios.get(`${BASE_URL}/projects`, getHeaders());
      setProjects(resProj.data);

      const loggedUser = JSON.parse(localStorage.getItem('user'));
      if (loggedUser.role === 'Admin') {
        const resUsers = await axios.get(`${BASE_URL}/auth/users`, getHeaders());
        setUsers(resUsers.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const createProject = async (e) => {
    e.preventDefault();
    try {
      // Add all user IDs as members for ease of MVP access
      const memberIds = users.map(u => u._id);
      await axios.post(`${BASE_URL}/projects`, { title: pTitle, description: pDesc, members: memberIds }, getHeaders());
      setPTitle(''); setPDesc('');
      fetchData();
    } catch (err) { alert('Error creating project'); }
  };

  const createTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/tasks`, { title: tTitle, description: tDesc, project: tProj, assignedTo: tAssign, dueDate: tDue, priority: tPriority }, getHeaders());
      setTTitle(''); setTDesc('');
      fetchData();
    } catch (err) { alert('Error creating task'); }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`${BASE_URL}/tasks/${id}`, { status: newStatus }, getHeaders());
      fetchData();
    } catch (err) { alert('Failed status update'); }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/tasks/${id}`, getHeaders());
      fetchData();
    } catch (err) { alert('Error deleting task'); }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Stats Logic
  const totalTasks = tasks.length;
  const completed = tasks.filter(t => t.status === 'Completed').length;
  const pending = tasks.filter(t => t.status === 'In Progress' || t.status === 'Todo').length;

  return (
    <div class="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav class="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div>
          <h1 class="text-2xl font-bold">Team Manager Dashboard</h1>
          <p class="text-xs text-blue-100">Welcome, {user.name} ({user.role})</p>
        </div>
        <button onClick={logout} class="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-semibold transition">Logout</button>
      </nav>

      <div class="max-w-7xl mx-auto p-6 grid grid-cols-1 gap-6">
        {/* Stats Grid */}
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
            <h3 class="text-sm font-medium text-gray-500 uppercase">Total Tasks</h3>
            <p class="text-2xl font-bold mt-1 text-gray-900">{totalTasks}</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
            <h3 class="text-sm font-medium text-gray-500 uppercase">Completed</h3>
            <p class="text-2xl font-bold mt-1 text-green-600">{completed}</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
            <h3 class="text-sm font-medium text-gray-500 uppercase">Pending</h3>
            <p class="text-2xl font-bold mt-1 text-yellow-600">{pending}</p>
          </div>
        </div>

        {/* Admin Section: Forms */}
        {user.role === 'Admin' && (
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Create Project */}
            <div class="bg-white p-6 rounded-lg shadow">
              <h2 class="text-xl font-bold text-gray-800 mb-4">Create New Project</h2>
              <form onSubmit={createProject} class="space-y-3">
                <input type="text" placeholder="Project Title" required class="w-full p-2 border rounded outline-none" value={pTitle} onChange={e => setPTitle(e.target.value)} />
                <textarea placeholder="Description" class="w-full p-2 border rounded outline-none" value={pDesc} onChange={e => setPDesc(e.target.value)}></textarea>
                <button class="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700">Add Project</button>
              </form>
            </div>

            {/* Create Task */}
            <div class="bg-white p-6 rounded-lg shadow">
              <h2 class="text-xl font-bold text-gray-800 mb-4">Assign New Task</h2>
              <form onSubmit={createTask} class="space-y-3">
                <input type="text" placeholder="Task Title" required class="w-full p-2 border rounded outline-none" value={tTitle} onChange={e => setTTitle(e.target.value)} />
                <textarea placeholder="Task Details" class="w-full p-2 border rounded outline-none" value={tDesc} onChange={e => setTDesc(e.target.value)}></textarea>
                
                <div class="grid grid-cols-2 gap-2">
                  <select required class="p-2 border rounded bg-white outline-none" value={tProj} onChange={e => setTProj(e.target.value)}>
                    <option value="">Select Project</option>
                    {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                  </select>
                  <select required class="p-2 border rounded bg-white outline-none" value={tAssign} onChange={e => setTAssign(e.target.value)}>
                    <option value="">Assign To</option>
                    {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
                  </select>
                </div>

                <div class="grid grid-cols-2 gap-2">
                  <input type="date" required class="p-2 border rounded outline-none" value={tDue} onChange={e => setTDue(e.target.value)} />
                  <select class="p-2 border rounded bg-white outline-none" value={tPriority} onChange={e => setTPriority(e.target.value)}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <button class="bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700">Assign Task</button>
              </form>
            </div>
          </div>
        )}

        {/* Tasks List */}
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Your Team Tasks</h2>
          <div class="space-y-4">
            {tasks.length === 0 ? (
              <p class="text-gray-500 text-center py-4">No tasks found.</p>
            ) : (
              tasks.map(task => (
                <div key={task._id} class="p-4 border rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-50 gap-4">
                  <div>
                    <div class="flex items-center gap-2">
                      <h3 class="text-lg font-bold text-gray-900">{task.title}</h3>
                      <span class={`text-xs px-2 py-0.5 rounded-full font-semibold ${task.priority === 'High' ? 'bg-red-100 text-red-700' : task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{task.priority}</span>
                    </div>
                    <p class="text-gray-600 text-sm mt-1">{task.description}</p>
                    <div class="text-xs text-gray-500 mt-2 space-y-1">
                      <p>📁 Project: <span class="font-medium text-gray-700">{task.project?.title || 'General'}</span></p>
                      <p>👤 Assigned To: <span class="font-medium text-gray-700">{task.assignedTo?.name || 'Unassigned'}</span></p>
                      <p>📅 Due: <span class="font-medium text-gray-700">{new Date(task.dueDate).toLocaleDateString()}</span></p>
                    </div>
                  </div>

                  <div class="flex items-center gap-3">
                    <select class="p-1.5 border rounded bg-white text-sm outline-none font-medium" value={task.status} onChange={e => updateStatus(task._id, e.target.value)}>
                      <option value="Todo">Todo</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>

                    {user.role === 'Admin' && (
                      <button onClick={() => deleteTask(task._id)} class="text-red-500 hover:text-red-700 text-sm font-semibold border border-red-200 px-2 py-1.5 rounded hover:bg-red-50 transition">Delete</button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}