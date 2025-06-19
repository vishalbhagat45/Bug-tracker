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
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 space-y-6"
        >
          <h2 className="text-3xl font-bold text-center text-blue-700">Register</h2>

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
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </button>

          <p className="text-sm text-center text-gray-600 mt-2">
            Already have an account?{' '}
            <span
              onClick={() => navigate('/login')}
              className="text-blue-600 font-medium cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </form>
      </div>

      {/* Info Panel */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-blue-700 text-white">
        <div className="text-center max-w-lg px-8">
          <h2 className="text-4xl font-bold mb-4">Welcome to Bug Tracker</h2>
          <p className="text-lg">Collaborate with your team and fix issues faster.</p>
        </div>
      </div>
    </div>
  );
}

export default Register;
