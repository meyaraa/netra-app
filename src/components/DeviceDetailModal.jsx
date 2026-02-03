import React from 'react';

const DeviceDetailModal = ({ device, onClose }) => {
  if (!device) return null;

  const isOnline = device.status;

  const getTypeColor = (type) => {
    const t = type.toLowerCase();
    if (t === 'router') return 'bg-purple-100 text-purple-700';
    if (t === 'access point') return 'bg-yellow-100 text-yellow-700';
    if (t === 'switch') return 'bg-emerald-100 text-emerald-700';
    if (t === 'server') return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-700';
  };

  const InfoRow = ({ label, value, isMono = false }) => (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 px-2 rounded-lg transition">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 sm:mb-0">{label}</span>
      <span className={`font-medium text-slate-700 ${isMono ? 'font-mono text-sm bg-gray-100 px-2 py-0.5 rounded' : ''}`}>
        {value || '-'} 
      </span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
        <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-fade-in" 
        onClick={onClose}>
        </div>

      {/* Card Modal Detail */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden transform transition-all flex flex-col md:flex-row max-h-[90vh] md:max-h-none overflow-y-auto animate-popup">
        
        {/* Gambar */}
        <div className="w-full md:w-[35%] bg-gray-100 flex items-center justify-center p-6 relative min-h-[250px]">
            <div className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm z-10
                ${isOnline ? 'bg-[#E2F7E8] text-[#00A76F]' : 'bg-[#FFEDED] text-[#FF5630]'}`}>
                {isOnline ? '● Online' : '● Offline'}
            </div>

            {device.image ? (
                <img 
                    src={device.image} 
                    alt={device.name} 
                    className="max-h-64 object-contain drop-shadow-xl transition-transform hover:scale-105 duration-500"
                />
            ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                    <svg className="w-16 h-16 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <span className="text-sm font-medium">No Image</span>
                </div>
            )}
        </div>

        {/* Info */}
        <div className="w-full md:w-[65%] p-8 flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="mb-2">
                         <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getTypeColor(device.type)}`}>
                            {device.type}
                        </span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 leading-tight">
                        {device.name}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1 flex items-center gap-1">
                        Device ID: <span className="font-mono text-gray-600">#{device.id}</span>
                    </p>
                </div>
                <button onClick={onClose} className="text-gray-300 hover:text-red-500 transition font-bold text-3xl leading-none">&times;</button>
            </div>

            {/* Grid Informasi */}
            <div className="space-y-1 overflow-y-auto pr-2 custom-scrollbar">
                
                {/* Section 1: Network & Location */}
                <h4 className="text-sm font-bold text-indigo-900 border-b border-gray-100 pb-2 mb-2 mt-2">Network & Location</h4>
                <div className="bg-white rounded-xl mb-4">
                     <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-gray-50 px-2 rounded-lg hover:bg-gray-50">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">IP Address</span>
                        <div className="flex items-center gap-2">
                             <span className="font-mono text-sm bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100 font-bold">
                                {device.ip_address}
                            </span>
                            <button 
                                onClick={() => navigator.clipboard.writeText(device.ip_address)}
                                className="text-gray-400 hover:text-indigo-600 transition" title="Copy IP"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                            </button>
                        </div>
                     </div>
                     <InfoRow label="Location" value={device.location} />
                     <InfoRow label="MAC Address" value={device.mac_address} isMono={true} />
                </div>

                {/* Section 2: Asset Details  */}
                <h4 className="text-sm font-bold text-indigo-900 border-b border-gray-100 pb-2 mb-2 mt-4">Asset Details</h4>
                <div className="bg-white rounded-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                        <InfoRow label="Serial Number" value={device.serial_number} isMono={true} />
                        <InfoRow label="Model / Brand" value={device.brand || "Unknown"} />
                        <InfoRow label="Purchase Date" value={device.purchase_date} />
                        <InfoRow label="Warranty Exp" value={device.warranty_expiry} />
                    </div>
                </div>
            </div>

            {/* Footer Action */}
            <div className="mt-6 pt-4 border-t border-gray-100">
                <a 
                    href={`http://${device.ip_address}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full gap-2 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-200 group"
                >
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    Open WebFig / Config Interface
                </a>
            </div>
        </div>

      </div>
    </div>
  );
};

export default DeviceDetailModal;