const DeviceCard = ({ device, onDelete, onEdit }) => {
  const isOnline = device.status;
  
  // 1. UBAH DISINI: Helper Gambar
  // Cek apakah ada 'device.image' (foto upload). 
  // Jika ada, pakai itu. Jika tidak, return null (agar muncul placeholder).
  const getDeviceImage = (item) => {
    if (item.image) {
      return item.image;
    }
    return null; 
  };

  // Helper Warna Tag (TETAP SAMA)
  const getTypeColor = (type) => {
    const t = type.toLowerCase();
    if (t === 'router') return 'bg-purple-100 text-purple-700';
    if (t === 'access point') return 'bg-yellow-100 text-yellow-700'; 
    if (t === 'switch') return 'bg-emerald-100 text-emerald-700';
    if (t === 'server') return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-700';
  };

  // Helper Warna Border saat Hover (TETAP SAMA)
  const getHoverBorder = (type) => {
    const t = type.toLowerCase();
    if (t === 'router') return 'hover:border-purple-500';
    if (t === 'access point') return 'hover:border-yellow-400';
    if (t === 'switch') return 'hover:border-emerald-500';
    if (t === 'server') return 'hover:border-blue-500';
    return 'hover:border-gray-400';
  };

  return (
    // CARD CONTAINER (TETAP SAMA)
    <div className={`bg-white shadow-soft rounded-[20px] p-6 relative border-2 border-gray-100 flex flex-col duration-300 hover:-translate-y-0.5 group ${getHoverBorder(device.type)}`}>
      
      {/* BADGE STATUS (TETAP SAMA) */}
      <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-2xl rounded-tr-[18px] text-xs font-bold
        ${isOnline ? 'bg-[#E2F7E8] text-[#00A76F]' : 'bg-[#FFEDED] text-[#FF5630]'}`}>
        {isOnline ? 'Online' : 'Offline'}
      </div>

      {/* HEADER (TETAP SAMA) */}
      <div className="mb-2 pr-16">
        <h3 className="font-bold text-slate-800 text-lg leading-tight truncate transition-colors group-hover:text-slate-900">
          {device.name}
        </h3>
        <p className="text-gray-400 text-sm mt-1 font-medium">{device.ip_address}</p>
      </div>

      {/* TAG TIPE (TETAP SAMA) */}
      <div className="mb-4">
        <span className={`px-3 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wider ${getTypeColor(device.type)}`}>
          {device.type}
        </span>
      </div>

      {/* 2. UBAH DISINI: GAMBAR */}
      {/* Container tetap sama, tapi isinya dibuat Kondisional */}
      <div className="h-44 flex items-center justify-center mb-6 bg-gray-50 rounded-2xl p-4 group-hover:bg-opacity-50 transition">
        {getDeviceImage(device) ? (
          // JIKA ADA FOTO: Tampilkan Foto
          <img 
            src={getDeviceImage(device)} 
            alt={device.name} 
            className="max-h-full max-w-full object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          // JIKA TIDAK ADA FOTO: Tampilkan Placeholder (Icon Gambar Rusak/Silang)
          <div className="flex flex-col items-center justify-center text-gray-300">
             <svg className="w-10 h-10 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
             <span className="text-xs font-medium">No Image</span>
          </div>
        )}
      </div>

      {/* LOKASI (TETAP SAMA) */}
      <div className="flex items-start gap-2.5 mt-auto px-1">
        <div className="mt-0.5 text-gray-400 group-hover:text-gray-600 transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
        </div>
        <p className="text-[14px] font-medium leading-relaxed">
          {device.location}
        </p>
      </div>

      {/* GARIS PEMISAH (TETAP SAMA) */}
      <div className="border-t border-gray-400 my-4 mx-1"></div>

      {/* FOOTER BUTTONS (TETAP SAMA) */}
      <div className="grid grid-cols-[1fr_1fr_auto] gap-3">
        
        <button 
          onClick={() => onDelete(device.id)}
          className="bg-[#FFEDED] border border-[#D70000] text-[#D70000] py-2.5 rounded-xl text-sm font-semibold transition hover:bg-[#FFE0E0]"
        >
          Delete
        </button>

        <button 
          onClick={() => onEdit(device)}
          className="bg-[#FFF8E1] border border-[#D67200] text-[#D67200] py-2.5 rounded-xl text-sm font-semibold transition hover:bg-[#FFF3CD]"
        >
          Edit
        </button>

        {device.status ? (
           <a 
             href={`http://${device.ip_address}`} 
             target="_blank" rel="noopener noreferrer"
             className="w-12 flex items-center justify-center bg-[#E3F2FD] border border-[#2196F3] text-[#2196F3] rounded-xl transition hover:bg-[#BBDEFB]"
             title="Open WebFig"
           >
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
           </a>
        ) : (
           <div className="w-12 flex items-center justify-center bg-gray-100 border border-gray-200 text-gray-300 rounded-xl cursor-not-allowed">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
           </div>
        )}
      </div>
    </div>
  );
};

export default DeviceCard;