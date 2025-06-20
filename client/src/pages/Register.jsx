import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { register as registerUser } from '../api/projectApi';

function Register() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await registerUser(form); // your API call
      const { token, user } = res.data;

      login({ token, user }); // context login
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4 py-8">
      <div className="w-full max-w-5xl bg-white/20 backdrop-blur-xl rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden border border-white/30">
        
      
      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 space-y-6"
        >
          <h2 className="text-3xl font-bold text-center text-cyan-700">Register</h2>

          {error && (
            <p className="text-sm text-red-600 text-center border border-red-200 bg-red-50 p-2 rounded">
              {error}
            </p>
          )}

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />

          <button
            type="submit"
            className="w-full bg-cyan-600 text-white py-2 rounded-lg hover:bg-cyan-700 transition"
          >
            Register
          </button>

          <p className="text-sm text-center text-gray-600 mt-2">
            Already have an account?{' '}
            <span
              onClick={() => navigate('/login')}
              className="text-cyan-600 font-medium cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </form>
      </div>

      {/* Info Panel */}
       <div className="hidden md:flex w-full md:w-1/2 bg-cyan-600 text-white items-center justify-center p-10">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold">Welcome to Bug Tracker</h2>
            <p className="text-lg">Collaborate with your team and fix issues faster.</p>
            <p className="text-sm opacity-70">Your one-stop project bug management system.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
