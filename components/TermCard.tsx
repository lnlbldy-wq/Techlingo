import React from 'react';
import { Term } from '../types';
import { ChevronLeft, Cpu, Cloud, Code, Wifi, Globe, Sparkles } from 'lucide-react';

interface TermCardProps {
  term: Term;
  onClick: (term: Term) => void;
}

const getIconForCategory = (category: string) => {
  if (category.includes('برمجة')) return <Code size={18} className="text-purple-500" />;
  if (category.includes('سحابة')) return <Cloud size={18} className="text-sky-500" />;
  if (category.includes('عتاد')) return <Cpu size={18} className="text-orange-500" />;
  if (category.includes('شبكات')) return <Wifi size={18} className="text-green-500" />;
  if (category.includes('ذكاء')) return <Sparkles size={18} className="text-rose-500" />;
  return <Globe size={18} className="text-gray-500" />;
};

export const TermCard: React.FC<TermCardProps> = ({ term, onClick }) => {
  return (
    <div 
      onClick={() => onClick(term)}
      className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-200 transition-all cursor-pointer flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-primary-50 transition-colors">
          <span className="text-lg font-bold text-gray-700 group-hover:text-primary-600">
            {term.term.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
            {term.term}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-600">{term.arabicTerm}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
              {getIconForCategory(term.category)}
              <span>{term.category}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="text-gray-300 group-hover:text-primary-500 transition-transform group-hover:-translate-x-1">
        <ChevronLeft size={24} />
      </div>
    </div>
  );
};
