import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, form);
      localStorage.setItem('token', res.data.token);
      alert('Registered successfully!');
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
      
    }
  };
  const goToLogin = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
        <form 
          onSubmit={handleSubmit} 
          className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-md space-y-6"
        >
          <h2 className="text-3xl font-bold text-center text-blue-700">Register</h2>
          
          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            type="email"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          
          <button
            type="submit"
            className="w-full  bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
          >
            Register
          </button>
          <button
          type="button"
          onClick={goToLogin}
          className="w-full text-blue-600 hover:underline text-center"
        >
          Already have an account? Login
        </button>
        </form>
      </div>

      {/* Right - Optional Illustration / Info */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-indigo-600 text-white">
        <div className="text-center px-10">
          <h2 className="text-4xl font-bold mb-4">Join ProjectHub</h2>
          <p className="text-lg">Create your account and start collaborating today!</p>
        </div>
      </div>
    </div>
  );
}

export default Register;