
const Navbar = ({ onAddClick }) => {
  return (
    <nav className="bg-blue-600 shadow-lg mb-8">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold">
            N
          </div>
          <h1 className="text-white text-xl font-bold tracking-wider">
            NetInventory
          </h1>
        </div>
        {/* Saat diklik, panggil fungsi onAddClick */}
        <button 
          onClick={onAddClick}
          className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition shadow-lg border border-blue-500"
        >
          + Tambah Perangkat
        </button>
      </div>
    </nav>
  );
};

export default Navbar;