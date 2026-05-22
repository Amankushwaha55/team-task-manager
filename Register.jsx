import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Member');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_URL = "http://localhost:5000/api/auth/register";

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(API_URL, { name, email, password, role });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 class="text-3xl font-bold text-center text-blue-600 mb-6">Create Account</h2>
        {error && <div class="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
        <form onSubmit={handleRegister} class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" required class="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" required class="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" required class="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setPassword(e.target.value)} />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Select Role</label>
            <select class="mt-1 w-full p-2 border rounded bg-white outline-none" value={role} onChange={e => setRole(e.target.value)}>
              <option value="Member">Team Member</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button type="submit" class="w-full bg-blue-600 text-white p-2 rounded font-semibold hover:bg-blue-700 transition">Register</button>
        </form>
        <p class="mt-4 text-center text-sm text-gray-600">Already have an account? <Link to="/" class="text-blue-600 hover:underline">Log in</Link></p>
      </div>
    </div>
  );
}