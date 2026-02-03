import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Footer from './components/Footer';
import DeviceCard from './components/DeviceCard';
import DeviceForm from './components/DeviceForm';
import DeviceDetailModal from './components/DeviceDetailModal';
import logoNetra from './assets/img/netra.png'; 

function App() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // State Modal Detail
  const [showDetail, setShowDetail] = useState(false);
  const [detailItem, setDetailItem] = useState(null);

  // State Border Highlight 
  const [highlightId, setHighlightId] = useState(null); 
  const [highlightType, setHighlightType] = useState(null); // 'new' atau 'updated'

  // State Filter
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedType, setSelectedType] = useState('All Device');
  const [searchTerm, setSearchTerm] = useState('');

  // State Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); 
   //const API_URL = 'http://localhost:3001/devices';
  const API_URL = 'https://6980da3c6570ee87d51088af.mockapi.io/api/v1/devices';

  const fetchDevices = async () => {
    try {
      const response = await axios.get(API_URL);
      // Sort Data 
      const sortedData = response.data.sort((a, b) => a.name.localeCompare(b.name));
      setDevices(sortedData);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setLoading(false);
    }
  };

  useEffect(() => { fetchDevices() }, []);

  useEffect(() => {
    if (!highlightId) {
       setCurrentPage(1);
    }
  }, [filterStatus, selectedType, searchTerm]);

  const filteredDevices = devices.filter((item) => {
    let matchStatus = true;
    if (filterStatus === 'Online') matchStatus = item.status === true;
    if (filterStatus === 'Offline') matchStatus = item.status === false;
    const matchType = selectedType === 'All Device' || item.type === selectedType;
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        item.ip_address.includes(searchTerm);
    return matchStatus && matchType && matchSearch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDevices = filteredDevices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDevices.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // --- LOGIC HANDLE SUCCESS & AUTO SCROLL ---
  const handleSuccess = async (message, savedId, isEdit) => { 
    setShowForm(false);
    
    const response = await axios.get(API_URL);
    // Sort ulang A-Z
    const sortedData = response.data.sort((a, b) => a.name.localeCompare(b.name));
    setDevices(sortedData);

    if (savedId) {
        setHighlightId(savedId);
        setHighlightType(isEdit ? 'updated' : 'new'); // Set Tipe Badge

        const indexInData = sortedData.findIndex(item => String(item.id) === String(savedId));
        
        if (indexInData !== -1) {

            const targetPage = Math.ceil((indexInData + 1) / itemsPerPage);
            
            setCurrentPage(targetPage);

            // Auto Scroll Logic
            setTimeout(() => {
                const element = document.getElementById(`device-card-${savedId}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 500); 
        }
        
        // Hilangkan highlight setelah 5 detik
        setTimeout(() => {
            setHighlightId(null);
            setHighlightType(null);
        }, 5000);
    }

    Swal.fire({
      title: 'Success!',
      text: message || "Your data has been successfully saved",
      icon: 'success',
      iconColor: '#10B981',
      confirmButtonText: 'Great!',
      focusConfirm: true,
      buttonsStyling: false,
      customClass: {
        popup: 'rounded-[24px]',
        title: 'text-xl font-bold text-gray-800 mb-1',
        htmlContainer: 'text-sm text-gray-500',         
        actions: 'mt-4 mb-2',
        confirmButton: 'bg-[#240046] hover:bg-[#3c096c] text-white font-bold py-3 px-6 rounded-xl shadow-sm transition-all transform hover:scale-105',
      }
    });
  };

  const handleDelete = async (id) => {
    // Alert konfirm delete
    const result = await Swal.fire({
      title: 'Delete Device?',
      text: "You're going to delete this device permanently.",
      icon: 'warning',
      iconColor: '#DC1D1D',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete!',
      cancelButtonText: 'No, keep it.',
      reverseButtons: true,
      focusCancel: true,
      buttonsStyling: false,
      customClass: {
        popup: 'rounded-[24px]',
        title: 'text-xl font-bold text-gray-800 mb-1',
        htmlContainer: 'text-sm text-gray-500',
        actions: 'gap-3 mt-4 mb-2',
        confirmButton: 'bg-[#DC1D1D] hover:bg-[#DC1D1D] text-white font-bold py-3 px-6 rounded-xl shadow-sm transition-all transform hover:scale-105',
        cancelButton: 'bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl transition-all hover:bg-gray-300'
      }
    });

    // yes
    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchDevices();

        //Alert success delete data
        Swal.fire({
          title: 'Deleted!',
          text: 'Your device has been successfully deleted.',
          icon: 'success',
          iconColor: '#10B981', 
          confirmButtonText: 'OK',
          buttonsStyling: false,
          customClass: {
            popup: 'rounded-[24px]',
            title: 'text-xl font-bold text-gray-800 mb-1',
            htmlContainer: 'text-sm text-gray-500',
            actions: 'mt-4 mb-2',
            confirmButton: 'bg-[#240046] hover:bg-[#3c096c] text-white font-bold py-3 px-6 rounded-xl shadow-sm transition-all transform hover:scale-105',
          }
        });

      } catch (error) {
        console.error("Error deleting:", error);
        Swal.fire('Error', 'Gagal menghapus data', 'error');
      }
    }
  };

  const handleAddMode = () => { setEditItem(null); setShowForm(true); };
  const handleEditMode = (device) => { setEditItem(device); setShowForm(true); };
  const handleDetailMode = (device) => { setDetailItem(device); setShowDetail(true); };

  const typesList = [
    { name: 'All Device', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { name: 'Switch', icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: 'Access Point', icon: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0' },
    { name: 'Router', icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z' },
    { name: 'Server', icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01' },
  ];

  return (
    <div className="min-h-screen bg-[#F3F5F9] text-slate-800 pb-20">
      
      {/* Logo Netra */}
      <div className="bg-white py-4 mb-8 border-b shadow-sm">
        <img src={logoNetra} alt="NETRA Logo" className="mx-auto h-16 object-contain hover:opacity-90 transition"/>
      </div>

      <main className="container mx-auto px-6 max-w-6xl">

        {/* Filter Status */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-200 p-1.5 rounded-full flex gap-1">
            {['All', 'Online', 'Offline'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-7 py-2 rounded-full text-xs font-semibold transition-all duration-300
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

        {/* Filter Type */}
        <div className="grid grid-cols-5 gap-2 md:gap-4 mb-6">
          {typesList.map((item) => (
            <button
              key={item.name}
              onClick={() => setSelectedType(item.name)}
              className={`
                flex transition-all duration-300 group border
                /* MOBILE (Default): Flex Column (Atas-Bawah), Padding Kecil, Center */
                flex-col items-center justify-center p-2 rounded-xl
                /* DESKTOP (md keatas): Flex Row (Kiri-Kanan), Padding Besar, Space Between */
                md:flex-row md:justify-between md:p-5 md:rounded-2xl
                
                ${selectedType === item.name 
                  ? 'border-indigo-600 bg-white ring-1 ring-indigo-100 shadow-glow scale-105 z-10' 
                  : 'border-transparent bg-white shadow-soft hover:shadow-soft-hover hover:-translate-y-0.5'
                }
              `}
            >
              {/* TEKS: Kecil di HP, Normal di Desktop */}
              <span className={`
                text-[10px] font-bold text-center leading-tight mt-1
                md:text-sm md:text-left md:mt-0
                ${selectedType === item.name ? 'text-indigo-900' : 'group-hover:text-indigo-500'}
              `}>
                {item.name}
              </span>

              {/* ICON WRAPPER: Sembunyikan background abu-abu di HP, munculkan di Desktop */}
              <div className={`
                p-1.5 rounded-lg transition-colors
                /* Order: Di HP icon diatas (order-first), di Desktop icon dikanan (order-last) */
                order-first md:order-last
                ${selectedType === item.name 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' 
                  : 'bg-gray-50 text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-500'
                }
              `}>
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path></svg>
              </div>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <input 
            type="text" placeholder="Search" className="w-full py-3.5 pl-12 pr-4 rounded-full bg-white border-none outline-none text-gray-600 transition-shadow duration-300 shadow-soft focus:shadow-soft-hover focus:ring-2 focus:ring-indigo-500"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-5 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>

        {/* List Device, Add Device */}
        <div className="flex gap-6 items-center mb-6 justify-between h-14">
          <div className="flex flex-col shrink-0">
            <h2 className="text-[23px] font-bold text-slate-800">List Device</h2>
            <p className="text-sm text-gray-400 font-medium">
               Showing {filteredDevices.length > 0 ? indexOfFirstItem + 1 : 0} - {Math.min(indexOfLastItem, filteredDevices.length)} of {filteredDevices.length} Data
            </p>
          </div>
          <button onClick={handleAddMode} className="shrink-0 bg-[#240046] hover:bg-[#3c096c] text-white px-6 py-2.5 rounded-lg font-medium text-sm transition flex items-center gap-2 hover:-translate-y-0.5 h-[85%] shadow-soft">
            <span>+</span> Add Device
          </button>
        </div>

        {/* GRID DEVICES */}
        {loading ? <p className="text-center">Loading...</p> : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 min-h-[400px] content-start">
              {currentDevices.length > 0 ? (
                currentDevices.map((item) => (
                  <DeviceCard 
                    key={item.id} 
                    device={item} 
                    onDelete={handleDelete}
                    onEdit={handleEditMode}
                    onDetail={handleDetailMode}
                    isHighlighted={String(item.id) === String(highlightId)} 
                    highlightType={highlightType} // PASSING TIPE BADGE
                  />
                ))
              ) : (
                 <div className="col-span-full text-center text-gray-400 py-10 italic">No devices found.</div>
              )}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 gap-2">
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-slate-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm">Prev</button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i + 1} onClick={() => paginate(i + 1)} className={`w-10 h-10 rounded-lg font-bold text-sm transition shadow-sm ${currentPage === i + 1 ? 'bg-[#240046] text-white shadow-indigo-200 scale-105' : 'bg-white border border-gray-200 text-slate-600 hover:bg-gray-50'}`}>{i + 1}</button>
                ))}
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-slate-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm">Next</button>
              </div>
            )}
          </>
        )}
      </main>

      {/* FOOTER */}
      <Footer />

      {/* MODAL FORM */}
      {showForm && (
        <DeviceForm 
          apiUrl={API_URL}
          editData={editItem}
          onSuccess={handleSuccess} 
          onCancel={() => setShowForm(false)} 
        />
      )}

      {/* MODAL DETAIL */}
      {showDetail && detailItem && (
        <DeviceDetailModal
          device={detailItem}
          onClose={() => setShowDetail(false)}
        />
      )}


    </div>
  );
}

export default App;