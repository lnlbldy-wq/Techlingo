
import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { TermCard } from './components/TermCard';
import { DetailModal } from './components/DetailModal';
import { CodeGenerator } from './components/CodeGenerator';
import { INITIAL_TERMS } from './constants';
import { Term, TermCategory } from './types';
import { Search, Sparkles, Loader2, BookOpen, Cpu, Globe2, TrendingUp, X, Key } from 'lucide-react';
import { fetchTermDefinition } from './services/geminiService';

const SUGGESTIONS = ['Containerization', 'Serverless', 'DevOps', 'Machine Learning', 'Quantum Computing'];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dictionary' | 'code'>('dictionary');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean>(true); // Assume true until checked

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('techlingo_favs');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });
  
  const [terms, setTerms] = useState<Term[]>(() => {
    try {
      const saved = localStorage.getItem('techlingo_custom_terms');
      return saved ? [...INITIAL_TERMS, ...JSON.parse(saved)] : INITIAL_TERMS;
    } catch (e) { return INITIAL_TERMS; }
  });
  
  const [isSearchingAi, setIsSearchingAi] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');

  useEffect(() => {
    localStorage.setItem('techlingo_favs', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const customTerms = terms.filter(t => t.isAiGenerated);
    localStorage.setItem('techlingo_custom_terms', JSON.stringify(customTerms));
  }, [terms]);

  // Check API key for Pro features
  useEffect(() => {
    if (activeTab === 'code') {
      const checkKey = async () => {
        if (window.aistudio?.hasSelectedApiKey) {
          const selected = await window.aistudio.hasSelectedApiKey();
          setHasApiKey(selected);
        }
      };
      checkKey();
    }
  }, [activeTab]);

  const handleOpenSelectKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true); // Proceed after calling open
    }
  };

  const toggleFavorite = (termId: string) => {
    setFavorites(prev => prev.includes(termId) ? prev.filter(id => id !== termId) : [...prev, termId]);
  };

  const categories = ['الكل', ...Object.values(TermCategory)];

  const filteredTerms = useMemo(() => {
    let result = terms;
    if (selectedCategory !== 'الكل') result = result.filter(t => t.category === selectedCategory);
    
    if (searchTerm.trim()) {
      const s = searchTerm.toLowerCase().trim();
      result = result.filter(t => {
        const termLower = t.term.toLowerCase();
        const arabicLower = t.arabicTerm.toLowerCase();
        return termLower.includes(s) || arabicLower.includes(s);
      });
    }

    return [...result].sort((a, b) => {
      const aFav = favorites.includes(a.id);
      const bFav = favorites.includes(b.id);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return a.term.localeCompare(b.term);
    });
  }, [terms, searchTerm, selectedCategory, favorites]);

  const handleSearchAi = async () => {
    if (!searchTerm.trim()) return;
    setIsSearchingAi(true);
    setError(null);
    try {
      const result = await fetchTermDefinition(searchTerm);
      if (result) {
        const newTerm: Term = {
          id: `ai-${Date.now()}`,
          term: searchTerm.length <= 5 ? searchTerm.toUpperCase() : searchTerm,
          arabicTerm: result.arabicTerm,
          definition: result.definition,
          example: result.example,
          category: result.category as TermCategory || TermCategory.GENERAL,
          isAiGenerated: true
        };
        setTerms(prev => {
          if (prev.some(t => t.term.toLowerCase() === newTerm.term.toLowerCase())) return prev;
          return [newTerm, ...prev];
        });
        setSelectedTerm(newTerm);
        setIsModalOpen(true);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSearchingAi(false);
    }
  };

  const searchInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="min-h-screen bg-[#fcfdfe] pb-20 selection:bg-indigo-100 selection:text-indigo-700">
      <Header onSearchFocus={() => searchInputRef.current?.focus()} />

      <main className="max-w-5xl mx-auto px-4 pt-8">
        {/* Improved Tab Navigation to avoid overlaps */}
        <div className="flex p-1.5 bg-white rounded-2xl shadow-xl border border-slate-100 mb-10 w-fit mx-auto sticky top-20 z-30 backdrop-blur-md bg-white/90">
          <button
            onClick={() => setActiveTab('dictionary')}
            className={`flex items-center gap-3 px-8 py-3.5 rounded-xl text-base font-black transition-all duration-300 ${
              activeTab === 'dictionary'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            <BookOpen size={20} />
            القاموس
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-3 px-8 py-3.5 rounded-xl text-base font-black transition-all duration-300 ${
              activeTab === 'code'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Cpu size={20} />
            المطور
          </button>
        </div>

        {activeTab === 'dictionary' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-12 group max-w-4xl mx-auto">
              <div className="relative shadow-2xl rounded-[2rem] bg-white overflow-hidden border-2 border-slate-100 focus-within:border-indigo-500 transition-all">
                <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none text-slate-400">
                  {isSearchingAi ? <Loader2 size={24} className="animate-spin" /> : <Search size={24} />}
                </div>
                
                <input
                  ref={searchInputRef}
                  type="text"
                  className="block w-full pr-16 pl-48 py-6 text-slate-800 placeholder:text-slate-400 bg-transparent focus:outline-none text-xl font-bold"
                  placeholder="ابحث عن أي مصطلح تقني هنا..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (filteredTerms.length === 0 ? handleSearchAi() : null)}
                />

                <div className="absolute inset-y-0 left-4 flex items-center gap-2">
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="p-2 text-slate-400 hover:text-rose-500 bg-slate-50 rounded-xl"
                    >
                      <X size={20} />
                    </button>
                  )}
                  {searchTerm && (
                    <button 
                      onClick={handleSearchAi}
                      className="px-6 py-2.5 flex items-center text-indigo-600 font-black text-sm bg-indigo-50 rounded-xl border border-indigo-100"
                    >
                      <Globe2 size={16} className="ml-2" />
                      بحث عالمي
                    </button>
                  )}
                </div>
              </div>
              
              {!searchTerm && (
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  {SUGGESTIONS.map(s => (
                    <button key={s} onClick={() => setSearchTerm(s)} className="text-xs font-bold text-slate-500 bg-white border border-slate-100 hover:border-indigo-500 hover:text-indigo-600 px-4 py-2 rounded-xl shadow-sm transition-all">
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-10 overflow-x-auto no-scrollbar">
              <div className="flex gap-2 min-w-max pb-2 justify-center">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-3 rounded-xl text-xs font-black transition-all ${
                      selectedCategory === cat
                        ? 'bg-slate-900 text-white shadow-lg'
                        : 'bg-white text-slate-500 border border-slate-100 hover:border-indigo-200 shadow-sm'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24 max-w-5xl mx-auto">
              {filteredTerms.map((term) => (
                <TermCard key={term.id} term={term} onClick={(t) => { setSelectedTerm(t); setIsModalOpen(true); }} />
              ))}
            </div>
          </div>
        ) : (
          !hasApiKey ? (
            <div className="max-w-2xl mx-auto mt-20 text-center p-12 bg-white rounded-[3rem] shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-500">
               <div className="bg-amber-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-amber-600">
                  <Key size={48} />
               </div>
               <h2 className="text-3xl font-black text-slate-900 mb-4">تفعيل مختبر البرمجة</h2>
               <p className="text-slate-600 mb-8 leading-relaxed font-medium">
                 للوصول إلى ميزات المطور المتقدمة (Gemini 3 Pro)، يرجى تفعيل مفتاح الـ API الخاص بك من مشروع مدفوع.
                 <br />
                 <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-indigo-600 underline">تعرف على وثائق الفوترة</a>
               </p>
               <button 
                  onClick={handleOpenSelectKey}
                  className="bg-indigo-600 text-white px-12 py-5 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl font-black text-xl flex items-center gap-3 mx-auto"
               >
                  <Sparkles size={24} />
                  اختر مفتاح API للبدء
               </button>
            </div>
          ) : (
            <CodeGenerator />
          )
        )}
      </main>

      <DetailModal 
        term={selectedTerm}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isFavorite={selectedTerm ? favorites.includes(selectedTerm.id) : false}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
};

export default App;
