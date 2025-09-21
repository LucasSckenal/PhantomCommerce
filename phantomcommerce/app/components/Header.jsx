// components/Header.tsx
import { Search, Bell, MessageSquare, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="flex items-center justify-between py-4">
      <div className="flex items-center gap-8">
        <div className="text-2xl font-bold text-white">LOGO</div> {/* Substitua pelo seu logo */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-[#1F222B] text-white placeholder-gray-400 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <a href="#" className="text-gray-300 hover:text-white">Categorias</a>
        <div className="flex items-center gap-4">
          <button className="text-gray-300 hover:text-white"><Bell size={22} /></button>
          <button className="text-gray-300 hover:text-white"><MessageSquare size={22} /></button>
          <button className="text-gray-300 hover:text-white"><User size={22} /></button>
        </div>
      </div>
    </header>
  );
};

export default Header;