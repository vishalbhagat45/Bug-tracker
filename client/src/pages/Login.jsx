import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, form);
      localStorage.setItem('token', res.data.token);
      
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login error');
    }
  };

  const goToRegister = () => {
    navigate('/register');
  };

  return (
    <div className='min-h-screen w-full flex'>
     <div className="w-full lg:w-1/2 flex items-center justify-center bg-transparent">
      <form 
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-blue-700">Welcome Back</h2>
        <p className="text-sm text-center ">Login to your account</p>

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition"
        >
          Login
        </button>

        <button
          type="button"
          onClick={goToRegister}
          className="w-full text-blue-600 hover:underline text-center"
        >
          Don't have an account? Register
        </button>
      </form>
    </div>
     <div className="hidden lg:flex w-1/2 items-center justify-center bg-blue-600 text-white">
    <div className="text-center p-10">
      <h2 className="text-3xl font-bold mb-4">Welcome to ProjectHub</h2>
      <p className="text-lg">Collaborate. Track. Succeed.</p>
    </div>
  </div>
    
</div>

  );
}

export default Login;