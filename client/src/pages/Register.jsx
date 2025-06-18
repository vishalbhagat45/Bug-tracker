import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'developer' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/auth/register', form);
    navigate('/login');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      <input className="w-full mb-3 p-2 border" placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
      <input className="w-full mb-3 p-2 border" placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="password" className="w-full mb-3 p-2 border" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <select className="w-full mb-3 p-2 border" onChange={e => setForm({ ...form, role: e.target.value })}>
        <option value="developer">Developer</option>
        <option value="manager">Manager</option>
      </select>
      <button className="bg-blue-600 text-white px-4 py-2">Register</button>
    </form>
  );
};

export default Register;
