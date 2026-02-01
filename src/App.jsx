import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Footer from './components/Footer';
import DeviceCard from './components/DeviceCard';
import DeviceForm from './components/DeviceForm';

function App() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // STATE FILTER
  const [filterStatus, setFilterStatus] = useState('All Device');
  const [selectedType, setSelectedType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // STATE ALERT
  const [alertMessage, setAlertMessage] = useState(""); 

  // --- 1. STATE PAGINATION (BARU) ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); // Menampilkan 6 item per halaman (agar pas 2 baris x 3 kolom)

  const API_URL = 'http://localhost:3001/devices';

  const fetchDevices = async () => {
    try {
      const response = await axios.get(API_URL);
      setDevices(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Gagal ambil data:", error);
      setLoading(false);
    }
  };

  useEffect(() => { fetchDevices() }, []);

  // LOGIC ALERT
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(""); 
      }, 3000);
      return () => clearTimeout(timer); 
    }
  }, [alertMessage]);

  // --- 2. RESET HALAMAN SAAT FILTER BERUBAH (BARU) ---
  // Jika user mencari/filter, kembalikan ke halaman 1
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, selectedType, searchTerm]);

  // LOGIKA FILTER
  const filteredDevices = devices.filter((item) => {
    let matchStatus = true;
    if (filterStatus === 'Online') matchStatus = item.status === true;
    if (filterStatus === 'Offline') matchStatus = item.status === false;
    const matchType = selectedType === 'All' || item.type === selectedType;
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        item.ip_address.includes(searchTerm);
    return matchStatus && matchType && matchSearch;
  });

  // --- 3. LOGIKA SLICING DATA (BARU) ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDevices = filteredDevices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDevices.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // HANDLER CRUD
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus perangkat?', text: "Data akan hilang permanen!", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Ya, Hapus!'
    });
    if (result.isConfirmed) {
      await axios.delete(`${API_URL}/${id}`);
      fetchDevices();
      setAlertMessage("Data has been successfully deleted"); 
    }
  };

  const handleAddMode = () => { setEditItem(null); setShowForm(true); };
  const handleEditMode = (device) => { setEditItem(device); setShowForm(true); };
  
  const handleSuccess = (message) => { 
    fetchDevices(); 
    setShowForm(false);
    setAlertMessage(message || "Your data has been successfully saved"); 
  };

  const typesList = [
    { name: 'All', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { name: 'Switch', icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: 'Access Point', icon: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0' },
    { name: 'Router', icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z' },
    { name: 'Server', icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01' },
  ];

  return (
    <div className="min-h-screen bg-[#F3F5F9] text-slate-800 pb-20">
      
      {/* 1. HEADER BESAR "NETRA" */}
      <div className="bg-white py-6 mb-8 border-b">
        <h1 className="text-center text-3xl font-black tracking-wider uppercase">NETRA</h1>
      </div>

      <main className="container mx-auto px-4 max-w-5xl">

        {/* 2. FILTER STATUS */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-200 p-1.5 rounded-full flex gap-1">
            {['All Device', 'Online', 'Offline'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-8 py-2 rounded-full text-sm font-semibold transition-all duration-300
                  ${filterStatus === status 
                    ? 'bg-white text-slate-900 shadow-md' 
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* 3. FILTER TYPE */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {typesList.map((item) => (
            <button
              key={item.name}
              onClick={() => setSelectedType(item.name)}
              className={`flex flex-row items-center justify-between p-4 rounded-2xl border transition-all duration-300 group
                ${selectedType === item.name 
                  ? 'border-indigo-600 bg-white ring-1 ring-indigo-100 shadow-glow scale-105' 
                  : 'border-transparent bg-white shadow-soft hover:shadow-soft-hover hover:-translate-y-0.5'
                }`}
            >
              <span className={`text-sm font-bold ${selectedType === item.name ? 'text-indigo-900' : 'group-hover:text-indigo-500'}`}>
                {item.name}
              </span>
              
              <div className={`p-2 rounded-xl transition-colors ${selectedType === item.name ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' : 'bg-gray-50 text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-500'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path>
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* 4. SEARCH BAR */}
        <div className="relative mb-6">
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full py-3.5 pl-12 pr-4 rounded-full bg-white border-none outline-none text-gray-600 transition-shadow duration-300 shadow-soft focus:shadow-soft-hover focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-5 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>

        {/* 5. LIST HEADER & ALERT & TOMBOL ADD */}
        <div className="flex gap-6 items-center mb-6 justify-between h-14">
          <div className="flex flex-col shrink-0">
            <h2 className="text-2xl font-bold text-slate-800">List Device</h2>
            {/* TEXT INFO PAGINATION */}
            <p className="text-sm text-gray-400 font-medium">
               Showing {filteredDevices.length > 0 ? indexOfFirstItem + 1 : 0} - {Math.min(indexOfLastItem, filteredDevices.length)} of {filteredDevices.length} Data
            </p>
          </div>
          
          {/* ALERT */}
          <div className="flex-1 mx-6 flex justify-center">
            <div 
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg shadow-sm border w-full max-w-md
                bg-[#EDF9F0] border-[#B8EBC5] text-[#1E7E34]
                transition-all duration-500 ease-in-out transform
                ${alertMessage ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 invisible'}
              `}
            >
              <div className="w-6 h-6 bg-[#28A745] rounded-full flex items-center justify-center shrink-0">
                 <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                 </svg>
              </div>
              <span className="font-medium text-sm truncate">
                {alertMessage || " "} 
              </span>
            </div>
          </div>
          
          {/* TOMBOL ADD */}
          <button 
            onClick={handleAddMode}
            className="shrink-0 bg-[#240046] hover:bg-[#3c096c] text-white px-6 py-2.5 rounded-lg font-medium transition flex items-center gap-2 hover:-translate-y-0.5 h-full"
          >
            <span>+</span> Add Device
          </button>
        </div>

        {/* GRID DEVICES */}
        {loading ? <p className="text-center">Loading...</p> : (
          <>
            {/* TAMPILKAN DATA SESUAI HALAMAN (currentDevices) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[400px] content-start">
              {currentDevices.length > 0 ? (
                currentDevices.map((item) => (
                  <DeviceCard 
                    key={item.id} 
                    device={item} 
                    onDelete={handleDelete}
                    onEdit={handleEditMode}
                  />
                ))
              ) : (
                 <div className="col-span-full text-center text-gray-400 py-10 italic">
                   No devices found.
                 </div>
              )}
            </div>

            {/* --- 6. TOMBOL PAGINATION (BARU) --- */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 gap-2">
                {/* Tombol Previous */}
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-slate-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
                >
                  Prev
                </button>

                {/* Angka Halaman */}
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`w-10 h-10 rounded-lg font-bold text-sm transition shadow-sm
                      ${currentPage === i + 1 
                        ? 'bg-[#240046] text-white shadow-indigo-200 scale-105' 
                        : 'bg-white border border-gray-200 text-slate-600 hover:bg-gray-50'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}

                {/* Tombol Next */}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-slate-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* MODAL FORM */}
      {showForm && (
        <DeviceForm 
          apiUrl={API_URL}
          editData={editItem}
          onSuccess={handleSuccess} 
          onCancel={() => setShowForm(false)} 
        />
      )}
    </div>
  );
}

export default App;