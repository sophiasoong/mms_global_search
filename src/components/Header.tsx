import React from 'react';
import { 
  Menu, 
  Search, 
  HelpCircle, 
  Bell, 
  Globe, 
  ChevronDown,
  User
} from 'lucide-react';

interface HeaderProps {
  onSearchClick: () => void;
  onMenuClick: () => void;
}

export default function Header({ onSearchClick, onMenuClick }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <button 
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 rounded-md text-gray-500"
        >
          <Menu size={20} />
        </button>
      </div>
      
      {/* Centered Long Search Bar */}
      <div className="flex-1 flex justify-center px-4">
        <div 
          onClick={onSearchClick}
          className="w-full max-w-[648px] relative group cursor-pointer"
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>
          <div className="w-full bg-gray-100 border border-transparent hover:border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm text-gray-500 transition-all truncate">
            Global Search
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden md:flex items-center gap-1 text-sm text-orange-500 font-medium cursor-pointer hover:underline whitespace-nowrap">
          返回MMS 1.0
        </div>
        
        <div className="flex items-center gap-1 sm:gap-3 sm:border-l border-gray-200 sm:pl-4">
          <button className="hidden sm:flex p-2 hover:bg-gray-100 rounded-full text-gray-500 relative">
            <HelpCircle size={20} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500 relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1 rounded-full border-2 border-white">
              99+
            </span>
          </button>
          <button className="hidden lg:flex items-center gap-1 p-2 hover:bg-gray-100 rounded-md text-gray-600 text-sm whitespace-nowrap">
            繁體中文 <ChevronDown size={14} />
          </button>
          
          <div className="flex items-center gap-2 sm:pl-2 sm:border-l border-gray-200">
            <div className="w-8 h-8 bg-[#5244EE]/10 rounded-full flex items-center justify-center text-[#5244EE] shrink-0">
              <User size={18} />
            </div>
            <div className="hidden sm:flex items-center gap-1 text-sm font-medium text-gray-700 cursor-pointer whitespace-nowrap">
              Wayne Su <ChevronDown size={14} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
