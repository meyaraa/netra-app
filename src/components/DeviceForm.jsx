import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const DeviceForm = ({ onSuccess, onCancel, apiUrl, editData }) => {
  const [formData, setFormData] = useState({
    id: '', 
    name: '',
    ip_address: '',
    type: 'Router',
    location: '',
    status: true,
    image: '',
    brand: '',
    serial_number: '',
    mac_address: '',
    purchase_date: '',
    warranty_expiry: ''
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editData) {
      setFormData({
        ...editData,
        brand: editData.brand || '',
        serial_number: editData.serial_number || '',
        mac_address: editData.mac_address || '',
        purchase_date: editData.purchase_date || '',
        warranty_expiry: editData.warranty_expiry || ''
      });
      setPreviewImage(editData.image); 
    } else {
      // Reset form untuk mode Add
      setFormData({
        id: '',
        name: '',
        ip_address: '',
        type: 'Router',
        location: '',
        status: true,
        image: '',
        brand: '',
        serial_number: '',
        mac_address: '',
        purchase_date: '',
        warranty_expiry: ''
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
          
          const MAX_WIDTH = 150; 
          
          let width = img.width;
          let height = img.height;
          
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // 3. TETAP GUNAKAN PNG (Agar transparan)
          const compressedBase64 = canvas.toDataURL('image/png'); 
          
          setFormData({ ...formData, image: compressedBase64 });
          setPreviewImage(compressedBase64);
          
          if (errors.image) setErrors({ ...errors, image: '' });
        };
      };
    }
  };

  // 1. VALIDASI: SEMUA FIELD WAJIB DIISI
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.image) newErrors.image = "Photo is required *";
    if (!formData.name.trim()) newErrors.name = "Device Name is required";
    if (!formData.ip_address.trim()) newErrors.ip_address = "IP Address is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.brand.trim()) newErrors.brand = "Brand/Model is required";
    if (!formData.serial_number.trim()) newErrors.serial_number = "Serial Number is required";
    if (!formData.mac_address.trim()) newErrors.mac_address = "MAC Address is required";
    if (!formData.purchase_date) newErrors.purchase_date = "Purchase Date is required";
    if (!formData.warranty_expiry) newErrors.warranty_expiry = "Warranty Date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const url = apiUrl || 'http://localhost:3001/devices';
      const { id, ...dataToSubmit } = formData; 

      let savedId;

      if (editData && editData.id) {
        // Edit
        const updatePayload = {
            ...dataToSubmit,
            updatedAt: new Date().toISOString()
        };

        await axios.put(`${url}/${editData.id}`, updatePayload); 
        savedId = editData.id;
        onSuccess("Data has been successfully updated", savedId, true); 
      }else {
        // Add 
        
        const newData = { 
          ...dataToSubmit, 
          createdAt: new Date().toISOString()
        };

        const response = await axios.post(url, newData);
        savedId = response.data.id;
        
        onSuccess("Data has been successfully added", savedId, false);
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Failed to save data!' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-fade-in" 
        onClick={onCancel}
      ></div>

      {/* card Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all flex flex-col animate-popup">
        
        <div className="bg-gray-50 px-6 py-3 border-b flex justify-between items-center sticky top-0 z-10">
          <h3 className="text-lg font-bold text-gray-800">
            {editData ? 'Edit Device' : 'Add New Device'}
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-red-500 font-bold text-2xl">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          
          {/* Gambar */}
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

          {/* 2. Id Device */}
          {editData && (
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Device ID (Locked)</label>
              <input 
                type="text" 
                value={formData.id} 
                disabled 
                className="w-full border border-gray-200 bg-gray-100 text-gray-500 rounded-lg p-2 text-sm outline-none cursor-not-allowed font-mono"
              />
            </div>
          )}

          {/* Info */}
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

          {/* Detail */}
          <div className="grid grid-cols-2 gap-3 pt-2">
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Brand / Model</label>
                <input 
                  type="text" 
                  name="brand" 
                  placeholder="e.g Cisco / Mikrotik"
                  className={`w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 
                    ${errors.brand ? 'border-red-500 focus:border-red-500' : 'border-gray-300'}`} 
                  value={formData.brand} 
                  onChange={handleChange} 
                />
                {errors.brand && <p className="text-red-500 text-xs mt-0.5 ml-1">{errors.brand}</p>}
             </div>
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Serial Number</label>
                <input 
                  type="text" 
                  name="serial_number" 
                  placeholder="S/N"
                  className={`w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 
                    ${errors.serial_number ? 'border-red-500 focus:border-red-500' : 'border-gray-300'}`} 
                  value={formData.serial_number} 
                  onChange={handleChange} 
                />
                {errors.serial_number && <p className="text-red-500 text-xs mt-0.5 ml-1">{errors.serial_number}</p>}
             </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">MAC Address</label>
                <input 
                  type="text" 
                  name="mac_address" 
                  placeholder="00:00:00:00:00:00"
                  className={`w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-mono 
                    ${errors.mac_address ? 'border-red-500 focus:border-red-500' : 'border-gray-300'}`} 
                  value={formData.mac_address} 
                  onChange={handleChange} 
                />
                {errors.mac_address && <p className="text-red-500 text-xs mt-0.5 ml-1">{errors.mac_address}</p>}
             </div>
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                <select name="status" className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.status} onChange={handleChange}>
                  <option value="true">Online</option>
                  <option value="false">Offline</option>
                </select>
             </div>
          </div>

          {/* Tanggal */}
          <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-3 mt-1">
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Purchase Date</label>
                <input 
                  type="date" 
                  name="purchase_date" 
                  className={`w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-gray-600 
                    ${errors.purchase_date ? 'border-red-500 focus:border-red-500' : 'border-gray-300'}`} 
                  value={formData.purchase_date} 
                  onChange={handleChange} 
                />
                {errors.purchase_date && <p className="text-red-500 text-xs mt-0.5 ml-1">{errors.purchase_date}</p>}
             </div>
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Warranty Exp</label>
                <input 
                  type="date" 
                  name="warranty_expiry" 
                  className={`w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-gray-600 
                    ${errors.warranty_expiry ? 'border-red-500 focus:border-red-500' : 'border-gray-300'}`} 
                  value={formData.warranty_expiry} 
                  onChange={handleChange} 
                />
                {errors.warranty_expiry && <p className="text-red-500 text-xs mt-0.5 ml-1">{errors.warranty_expiry}</p>}
             </div>
          </div>

          {/* Lokasi */}
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

          <div className="pt-2 pb-2">
            <button type="submit" className={`w-full text-white py-2.5 rounded-xl font-bold text-sm transition shadow-lg ${editData ? 'bg-orange-500 hover:bg-orange-600 shadow-soft' : 'bg-[#240046] hover:bg-[#3c096c] shadow-soft'}`}>
              {editData ? 'Update Changes' : 'Save Device'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeviceForm;