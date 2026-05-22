import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // CHANGE THIS TO YOUR RAILWAY BACKEND URL AFTER DEPLOYMENT
  const API_URL = "http://localhost:5000/api/auth/login";

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(API_URL, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 class="text-3xl font-bold text-center text-blue-600 mb-6">Team Task Manager</h2>
        {error && <div class="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
        <form onSubmit={handleLogin} class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" required class="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" required class="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" class="w-full bg-blue-600 text-white p-2 rounded font-semibold hover:bg-blue-700 transition">Sign In</button>
        </form>
        <p class="mt-4 text-center text-sm text-gray-600">Don't have an account? <Link to="/register" class="text-blue-600 hover:underline">Register here</Link></p>
      </div>
    </div>
  );
}