import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const DeviceForm = ({ onSuccess, onCancel, apiUrl, editData }) => {
  const [formData, setFormData] = useState({
    name: '',
    ip_address: '',
    type: 'Router',
    location: '',
    status: true,
    image: '' 
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editData) {
      setFormData(editData);
      setPreviewImage(editData.image); 
    } else {
      setFormData({
        name: '',
        ip_address: '',
        type: 'Router',
        location: '',
        status: true,
        image: ''
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = name === 'status' ? value === 'true' : value;
    
    setFormData({ ...formData, [name]: finalValue });

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400; 
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          
          setFormData({ ...formData, image: compressedBase64 });
          setPreviewImage(compressedBase64);
          
          if (errors.image) {
            setErrors({ ...errors, image: '' });
          }
        };
      };
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.image) newErrors.image = "Photo is required *";
    if (!formData.name.trim()) newErrors.name = "Device Name is required";
    if (!formData.ip_address.trim()) newErrors.ip_address = "IP Address is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const url = apiUrl || 'http://localhost:3001/devices';
      if (editData) {
        await axios.put(`${url}/${editData.id}`, formData);
        onSuccess("Data has been successfully updated");
      } else {
        await axios.post(url, formData);
        onSuccess("Data has been successfully added");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Failed to save data!', });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onCancel}></div>

      {/* UPDATE 1: max-h-[90vh] & overflow-y-auto (Supaya bisa discroll jika layar pendek) */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all scale-100 flex flex-col">
        
        {/* Header Lebih Tipis (py-3) */}
        <div className="bg-gray-50 px-6 py-3 border-b flex justify-between items-center sticky top-0 z-10">
          <h3 className="text-lg font-bold text-gray-800">
            {editData ? 'Edit Device' : 'Add New Device'}
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-red-500 font-bold text-2xl">&times;</button>
        </div>
        
        {/* Padding dikurangi (p-5) dan Spacing dikurangi (space-y-3) */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          
          {/* UPDATE 2: Tinggi Box Upload dikurangi jadi h-28 (112px) */}
          <div className="flex flex-col items-center justify-center mb-2">
            <div className={`relative w-full h-28 border-2 border-dashed rounded-xl bg-gray-50 flex flex-col items-center justify-center overflow-hidden group transition cursor-pointer
              ${errors.image ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-indigo-400'}`}>
              
              {previewImage ? (
                <img src={previewImage} alt="Preview" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center p-2">
                  <svg className={`mx-auto h-8 w-8 ${errors.image ? 'text-red-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  <p className={`mt-1 text-xs ${errors.image ? 'text-red-500 font-bold' : 'text-gray-500'}`}>Upload Photo</p>
                </div>
              )}
              
              <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>
            {errors.image && <p className="text-red-500 text-xs mt-1 font-medium">{errors.image}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Device Name</label>
            <input 
              type="text" 
              name="name" 
              className={`w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 
                ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-300'}`} 
              value={formData.name} 
              onChange={handleChange} 
            />
            {errors.name && <p className="text-red-500 text-xs mt-0.5 ml-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">IP Address</label>
              <input 
                type="text" 
                name="ip_address" 
                className={`w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 
                  ${errors.ip_address ? 'border-red-500 focus:border-red-500' : 'border-gray-300'}`} 
                value={formData.ip_address} 
                onChange={handleChange} 
              />
              {errors.ip_address && <p className="text-red-500 text-xs mt-0.5 ml-1">{errors.ip_address}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
              <select name="type" className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.type} onChange={handleChange}>
                <option value="Router">Router</option>
                <option value="Switch">Switch</option>
                <option value="Access Point">Access Point</option>
                <option value="Server">Server</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
            <select name="status" className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.status} onChange={handleChange}>
              <option value="true">Online</option>
              <option value="false">Offline</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Location</label>
            <textarea 
              name="location" 
              rows="2" 
              className={`w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 
                ${errors.location ? 'border-red-500 focus:border-red-500' : 'border-gray-300'}`} 
              value={formData.location} 
              onChange={handleChange}
            ></textarea>
            {errors.location && <p className="text-red-500 text-xs mt-0.5 ml-1">{errors.location}</p>}
          </div>

          <div className="pt-2">
            <button type="submit" className={`w-full text-white py-3 rounded-xl font-bold transition  
                    ${editData ? 'bg-[#D67200] hover:bg-[#E97C00] shadow-soft' : 'bg-[#240046] hover:bg-[#3c096c] shadow-soft'}`}>
                    {editData ? 'Update Changes' : 'Save Device'}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default DeviceForm;