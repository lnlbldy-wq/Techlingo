import React from 'react';
import { Term } from '../types';
import { X, Volume2, BookOpen, Lightbulb, Share2, Star, Sparkles } from 'lucide-react';

interface DetailModalProps {
  term: Term | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (termId: string) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ term, isOpen, onClose, isFavorite, onToggleFavorite }) => {
  if (!isOpen || !term) return null;

  const handleSpeak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Background */}
        <div className="h-32 bg-gradient-to-br from-primary-600 to-indigo-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-32 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full -ml-12 -mb-24 blur-xl"></div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 bg-black/20 hover:bg-black/30 text-white p-2 rounded-full transition-colors backdrop-blur-md"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="px-8 pb-8 -mt-12 relative">
          
          {/* Main Term Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{term.term}</h2>
                <button 
                  onClick={() => handleSpeak(term.term)}
                  className="text-primary-500 hover:text-primary-700 bg-primary-50 p-1.5 rounded-full transition-colors"
                >
                  <Volume2 size={18} />
                </button>
              </div>
              <p className="text-xl text-primary-600 font-bold font-arabic">{term.arabicTerm}</p>
              
              {term.isAiGenerated && (
                <div className="flex items-center gap-1 mt-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-md w-fit border border-amber-100">
                  <Sparkles size={12} />
                  <span>مولّد بواسطة الذكاء الاصطناعي</span>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => onToggleFavorite(term.id)}
              className={`p-3 rounded-xl transition-all ${
                isFavorite 
                  ? 'bg-yellow-50 text-yellow-500' 
                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
              }`}
            >
              <Star size={24} fill={isFavorite ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="mt-8 space-y-6">
            {/* Definition Section */}
            <div className="relative">
              <div className="absolute -right-10 top-0 bottom-0 w-1 bg-gray-100 rounded-full"></div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-3 rounded-xl text-blue-600 mt-1 shrink-0">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h3 className="text-gray-900 font-bold mb-2">المعنى</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {term.definition}
                  </p>
                </div>
              </div>
            </div>

            {/* Example Section */}
            <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
              <div className="flex items-start gap-4">
                <div className="bg-emerald-100 p-2 rounded-lg text-emerald-700 shrink-0">
                  <Lightbulb size={20} />
                </div>
                <div>
                  <h3 className="text-emerald-900 font-bold mb-1">مثال عملي</h3>
                  <p className="text-emerald-800 leading-relaxed">
                    {term.example}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-8 flex gap-3">
             <button className="flex-1 bg-gray-50 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                <Share2 size={18} />
                مشاركة
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};
