const DeviceCard = ({ device, onDelete, onEdit, onDetail, isHighlighted, highlightType }) => {
  const isOnline = device.status;
  
  const getDeviceImage = (item) => {
    if (item.image) return item.image;
    return null; 
  };

  const getTypeColor = (type) => {
    const t = type.toLowerCase();
    if (t === 'router') return 'bg-purple-100 text-purple-700';
    if (t === 'access point') return 'bg-yellow-100 text-yellow-700'; 
    if (t === 'switch') return 'bg-emerald-100 text-emerald-700';
    if (t === 'server') return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getHoverBorder = (type) => {
    const t = type.toLowerCase();
    if (t === 'router') return 'hover:border-purple-500';
    if (t === 'access point') return 'hover:border-yellow-400';
    if (t === 'switch') return 'hover:border-emerald-500';
    if (t === 'server') return 'hover:border-blue-500';
    return 'hover:border-gray-400';
  };

  const getCardStyle = () => {
    if (isHighlighted) {
        if (highlightType === 'updated') {
            return 'ring-2 md:ring-4 ring-orange-200 shadow-xl scale-[1.02] z-10 border-[#E97C00]';
        }
        return 'ring-2 md:ring-4 ring-indigo-300 shadow-xl scale-[1.02] z-10 border-indigo-500';
    }
    return `shadow-soft border-2 border-gray-100 hover:-translate-y-0.5 ${getHoverBorder(device.type)}`;
  };

  return (
    <div 
      id={`device-card-${device.id}`}
      className={`
        bg-white rounded-xl md:rounded-[20px] 
        /* Padding lebih kecil di mobile (p-3) dibanding desktop (p-6) */
        p-3 md:p-6 
        relative flex flex-col duration-500 group 
        ${getCardStyle()}
      `}
    >
    
      {isHighlighted && (
         <div className={`absolute -top-2 -left-2 md:-top-3 md:-left-3 text-white text-[8px] md:text-[10px] font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full shadow-md animate-bounce z-20 
            ${highlightType === 'updated' ? 'bg-[#E97C00]' : 'bg-indigo-600'}`}>
            {highlightType === 'updated' ? 'UPDATED' : 'NEW'}
         </div>
      )}

      {/* Status Online/Ofline */}
      <div className={`absolute top-0 right-0 px-3 py-1 md:px-6 md:py-2 rounded-bl-xl md:rounded-bl-2xl rounded-tr-[10px] md:rounded-tr-[18px] text-[10px] md:text-xs font-bold
        ${isOnline ? 'bg-[#E2F7E8] text-[#00A76F]' : 'bg-[#FFEDED] text-[#FF5630]'}`}>
        {isOnline ? 'Online' : 'Offline'}
      </div>

      {/* Nama Device */}
      <div className="mb-1 md:mb-2 pr-2 mt-4 md:mt-0">
        <h3 className="font-bold text-slate-800 text-sm md:text-[20px] leading-tight truncate transition-colors group-hover:text-slate-900">
          {device.name}
        </h3>
        <p className="text-gray-400 text-[10px] md:text-sm mt-0.5 md:mt-1 font-medium truncate">{device.ip_address}</p>
      </div>

      {/* Tipe */}
      <div className="mb-2 md:mb-4">
        <span className={`px-2 py-1 md:px-3 md:py-1.5 rounded-full text-[10px] md:text-[12px] font-bold uppercase tracking-wider ${getTypeColor(device.type)}`}>
          {device.type}
        </span>
      </div>

      {/* Gambar */}
      <div className="h-24 md:h-44 flex items-center justify-center mb-3 md:mb-6 bg-gray-50 rounded-lg md:rounded-2xl p-2 md:p-4 group-hover:bg-opacity-50 transition">
        {getDeviceImage(device) ? (
          <img 
            src={getDeviceImage(device)} 
            alt={device.name} 
            className="max-h-full max-w-full object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-300">
             <svg className="w-8 h-8 md:w-10 md:h-10 mb-1 md:mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
             <span className="text-[10px] md:text-xs font-medium">No Image</span>
          </div>
        )}
      </div>

      {/* Deskripsi Lokasi */}
      <div className="flex items-start gap-1.5 md:gap-2.5 mt-auto px-0.5 mb-3 md:mb-0">
        <div className="mt-0.5 text-gray-400 group-hover:text-gray-600 transition-colors">
            <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
        </div>
        <p className="text-[10px] md:text-[14px] font-medium leading-tight md:leading-relaxed line-clamp-1">
          {device.location}
        </p>
      </div>

      <div className="border-t border-gray-200 md:border-gray-400 my-2 md:my-4 mx-0 md:mx-1"></div>

      {/* Button Delete Edit Info */}
      <div className="grid grid-cols-[1fr_1fr_auto] gap-1.5 md:gap-3">
        <button onClick={() => onDelete(device.id)}
          className="bg-[#FFE0E0] border border-[#D70000] text-[#D70000] py-1.5 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-sm font-medium transition hover:bg-[#FFC2C2]">
          Delete
        </button>

        <button 
          onClick={() => onEdit(device)}
          className="bg-[#FFF3CD] border border-[#D67200] text-[#D67200] py-1.5 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-sm font-medium transition hover:bg-[#FFDCA3]">
          Edit
        </button>

        <button 
          onClick={() => onDetail(device)}
          className="w-8 md:w-12 flex items-center justify-center bg-blue-100 border border-blue-900 text-blue-900 rounded-lg md:rounded-xl transition hover:bg-blue-200"
          title="View Details">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 w-3.5 h-3.5 md:w-6 md:h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
        </button>

      </div>
    </div>
  );
};

export default DeviceCard;