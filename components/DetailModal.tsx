
import React, { useState, useEffect } from 'react';
import { Term, TranslationResponse } from '../types';
import { X, Volume2, BookOpen, Lightbulb, Share2, Star, Sparkles, Globe2, Loader2, Languages } from 'lucide-react';
import { translateToEnglish } from '../services/geminiService';

interface DetailModalProps {
  term: Term | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (termId: string) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ term, isOpen, onClose, isFavorite, onToggleFavorite }) => {
  const [translation, setTranslation] = useState<TranslationResponse | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when term changes or modal closes
  useEffect(() => {
    setTranslation(null);
    setError(null);
    setIsTranslating(false);
  }, [term, isOpen]);

  if (!isOpen || !term) return null;

  const handleSpeak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleTranslate = async () => {
    if (translation) {
      setTranslation(null); // Toggle off if already translated
      return;
    }
    
    setIsTranslating(true);
    setError(null);
    try {
      const result = await translateToEnglish(term.term, term.definition, term.example);
      setTranslation(result);
    } catch (err: any) {
      setError("فشل في ترجمة المحتوى.");
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
        
        {/* Header Background */}
        <div className="h-32 bg-gradient-to-br from-indigo-600 to-primary-700 relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-32 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full -ml-12 -mb-24 blur-xl"></div>
          
          <button 
            onClick={onClose}
            className="absolute top-6 left-6 bg-black/20 hover:bg-black/30 text-white p-2.5 rounded-full transition-colors backdrop-blur-md"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body - Scrollable */}
        <div className="px-8 pb-10 -mt-12 relative overflow-y-auto no-scrollbar">
          
          {/* Main Term Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">{term.term}</h2>
                <button 
                  onClick={() => handleSpeak(term.term)}
                  className="text-indigo-500 hover:text-indigo-700 bg-indigo-50 p-2 rounded-xl transition-all hover:scale-110"
                  title="نطق المصطلح"
                >
                  <Volume2 size={20} />
                </button>
              </div>
              <p className="text-2xl text-indigo-600 font-black">{term.arabicTerm}</p>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {term.isAiGenerated && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                    <Sparkles size={14} />
                    <span>مولّد ذكياً</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <BookOpen size={14} />
                  <span>{term.category}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => onToggleFavorite(term.id)}
                className={`p-4 rounded-2xl transition-all shadow-sm ${
                  isFavorite 
                    ? 'bg-amber-50 text-amber-500 border border-amber-100' 
                    : 'bg-white text-slate-400 hover:text-indigo-600 border border-slate-100 hover:border-indigo-100'
                }`}
              >
                <Star size={28} fill={isFavorite ? "currentColor" : "none"} />
              </button>
              
              <button 
                onClick={handleTranslate}
                disabled={isTranslating}
                className={`p-4 rounded-2xl transition-all shadow-sm border ${
                  translation 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                    : 'bg-white text-slate-400 hover:text-indigo-600 border-slate-100 hover:border-indigo-100'
                }`}
                title="ترجمة الشرح للإنجليزية"
              >
                {isTranslating ? <Loader2 size={28} className="animate-spin" /> : <Languages size={28} />}
              </button>
            </div>
          </div>

          <div className="mt-10 space-y-8">
            {/* Definition Section */}
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-50 p-3.5 rounded-2xl text-indigo-600 mt-1 shrink-0 shadow-sm">
                  <BookOpen size={26} />
                </div>
                <div className="flex-1">
                  <h3 className="text-slate-900 font-black text-lg mb-3">المعنى التقني</h3>
                  <p className="text-slate-600 leading-[2] text-xl font-medium">
                    {term.definition}
                  </p>
                  
                  {translation && (
                    <div className="mt-4 p-5 bg-slate-50 rounded-2xl border-r-4 border-indigo-400 animate-in slide-in-from-right-4 duration-300" dir="ltr">
                      <p className="text-slate-700 leading-relaxed font-semibold italic text-lg">
                        {translation.enDefinition}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Example Section */}
            <div className="bg-emerald-50 rounded-[2rem] p-8 border border-emerald-100 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-2 h-full bg-emerald-400"></div>
              <div className="flex items-start gap-5">
                <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-700 shrink-0 shadow-sm group-hover:rotate-12 transition-transform">
                  <Lightbulb size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-emerald-900 font-black text-lg mb-2">مثال عملي</h3>
                  <p className="text-emerald-800 leading-relaxed text-lg font-medium">
                    {term.example}
                  </p>
                  
                  {translation && (
                    <div className="mt-4 p-5 bg-white/60 rounded-2xl border-l-4 border-emerald-300 animate-in slide-in-from-left-4 duration-300" dir="ltr">
                      <p className="text-emerald-900/80 leading-relaxed font-semibold italic">
                        {translation.enExample}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm font-bold flex items-center gap-2">
              <X size={16} />
              {error}
            </div>
          )}

          {/* Action Footer */}
          <div className="mt-10 flex gap-4">
             <button className="flex-1 bg-slate-50 text-slate-700 font-black py-5 rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-3 border border-slate-100 shadow-sm hover:shadow-md">
                <Share2 size={20} />
                مشاركة المصطلح
             </button>
             <button 
                onClick={handleTranslate}
                disabled={isTranslating}
                className={`flex-1 font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md ${
                  translation 
                    ? 'bg-slate-800 text-white' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
             >
                {isTranslating ? <Loader2 size={20} className="animate-spin" /> : <Globe2 size={20} />}
                {translation ? 'إخفاء الإنجليزية' : 'عرض بالإنجليزية'}
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};
