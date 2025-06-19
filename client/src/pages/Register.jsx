import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, form);
      localStorage.setItem('token', res.data.token);
      alert('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 space-y-6"
        >
          <h2 className="text-3xl font-bold text-center text-blue-700">Register</h2>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
          >
            Register
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full text-blue-600 hover:underline text-center"
          >
            Already have an account? Login
          </button>
        </form>
      </div>

      {/* Right: Info Panel */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-blue-700 text-white">
        <div className="text-center px-10">
          <h2 className="text-4xl font-bold mb-4">Welcome to Bug Tracker</h2>
          <p className="text-lg">Collaborate with your team and fix issues faster.</p>
        </div>
      </div>
    </div>
  );
}

export default Register;
