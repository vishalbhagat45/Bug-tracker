import { useState } from 'react';
import axios from '../api/axios';
import { toast } from 'react-toastify';

const UploadForm = ({ ticketId }) => {
  const [file, setFile] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select a file');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`/tickets/${ticketId}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Uploaded successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <form onSubmit={handleUpload} className="my-4">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-2"
      />
      <button className="bg-green-600 text-white px-4 py-1 rounded">Upload</button>
    </form>
  );
};

export default UploadForm;
