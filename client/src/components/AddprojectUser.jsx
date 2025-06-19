import  { useState } from 'react';
import axios from 'axios';

const AddProjectUserForm = ({ projectId, token, onUserAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/projects/${projectId}/admin-add-user`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password, // optional, backend can handle if empty
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(`${formData.name} added to project!`);
      setFormData({ name: '', email: '', password: '' });
      onUserAdded && onUserAdded(); // optional callback
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error adding user');
    }
  };

  return (
   <form onSubmit={handleSubmit} className="max-w-sm mx-auto bg-white p-6 rounded-md shadow-md space-y-4">
  <h3 className="text-xl font-semibold text-center ">Add User to Project</h3>

  {success && <p className="text-green-600 text-sm text-center">{success}</p>}
  {error && <p className="text-red-600 text-sm text-center">{error}</p>}

  <input
    type="text"
    name="name"
    placeholder="User's Name"
    value={formData.name}
    onChange={handleChange}
    required
    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  <input
    type="email"
    name="email"
    placeholder="User's Email"
    value={formData.email}
    onChange={handleChange}
    required
    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  <input
    type="text"
    name="password"
    placeholder="Temporary Password (optional)"
    value={formData.password}
    onChange={handleChange}
    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  <button
    type="submit"
    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
  >
    Add User
  </button>
</form>

  );
};

export default AddProjectUserForm;