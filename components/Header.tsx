import React from 'react';
import { BookOpen, Search } from 'lucide-react';

interface HeaderProps {
  onSearchFocus: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearchFocus }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary-600 p-2 rounded-xl text-white">
            <BookOpen size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">TechLingo</h1>
            <p className="text-xs text-gray-500 font-medium">قاموسك التقني الذكي</p>
          </div>
        </div>
        
        <button 
          onClick={onSearchFocus}
          className="md:hidden bg-gray-100 p-2 rounded-full text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <Search size={20} />
        </button>
      </div>
    </header>
  );
};
