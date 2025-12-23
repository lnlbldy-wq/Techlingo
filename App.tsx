
import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { TermCard } from './components/TermCard';
import { DetailModal } from './components/DetailModal';
import { CodeGenerator } from './components/CodeGenerator';
import { INITIAL_TERMS } from './constants';
import { Term, TermCategory } from './types';
import { Search, Sparkles, Loader2, Bookmark, BookOpen, Terminal, XCircle, Globe2, TrendingUp, Cpu, Info, History } from 'lucide-react';
import { fetchTermDefinition } from './services/geminiService';

const SUGGESTIONS = ['Containerization', 'Serverless', 'DevOps', 'Machine Learning', 'Quantum Computing'];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dictionary' | 'code'>('dictionary');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
        {/* Navigation Tabs */}
        <div className="flex p-1.5 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 mb-12 w-fit mx-auto sticky top-24 z-10 backdrop-blur-xl bg-white/90">
          <button
            onClick={() => setActiveTab('dictionary')}
            className={`flex items-center gap-3 px-10 py-4 rounded-[1.2rem] text-lg font-black transition-all duration-300 ${
              activeTab === 'dictionary'
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            <BookOpen size={24} />
            القاموس
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-3 px-10 py-4 rounded-[1.2rem] text-lg font-black transition-all duration-300 ${
              activeTab === 'code'
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Cpu size={24} />
            المطور
          </button>
        </div>

        {activeTab === 'dictionary' ? (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Optimized Search Section */}
            <div className="mb-12 group max-w-4xl mx-auto">
              <div className="relative shadow-2xl shadow-indigo-100/30 rounded-[2.5rem] bg-white overflow-hidden border-2 border-slate-100 focus-within:border-indigo-500 focus-within:ring-8 focus-within:ring-indigo-50 transition-all duration-500">
                {/* Search Icon at the Start (Right in RTL) */}
                <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  {isSearchingAi ? <Loader2 size={24} className="animate-spin" /> : <Search size={24} />}
                </div>
                
                <input
                  ref={searchInputRef}
                  type="text"
                  className="block w-full pr-16 pl-36 py-6 text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none text-xl font-semibold leading-relaxed"
                  placeholder="ابحث عن أي مصطلح تقني هنا..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && filteredTerms.length === 0 && handleSearchAi()}
                />

                {searchTerm && (
                  <button 
                    onClick={handleSearchAi}
                    className="absolute inset-y-0 left-4 px-6 flex items-center text-indigo-600 font-black text-sm hover:scale-105 transition-transform bg-indigo-50 my-3 rounded-2xl hover:bg-indigo-100 border border-indigo-100 shadow-sm"
                  >
                    <Globe2 size={18} className="ml-2" />
                    بحث عالمي
                  </button>
                )}
              </div>
              
              {!searchTerm && (
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                   <span className="text-slate-400 text-xs font-black ml-3 flex items-center gap-2 uppercase tracking-tight">
                     <TrendingUp size={14} /> مقترحات:
                   </span>
                  {SUGGESTIONS.map(s => (
                    <button key={s} onClick={() => setSearchTerm(s)} className="text-xs font-bold text-slate-600 bg-white border border-slate-100 hover:border-indigo-500 hover:text-indigo-600 px-5 py-2.5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Smart Banner */}
            <div className="mb-10 bg-gradient-to-br from-indigo-50/80 to-blue-50/80 p-6 rounded-[2.5rem] border border-indigo-100/50 flex flex-col md:flex-row items-center justify-between max-w-4xl mx-auto gap-6 shadow-sm">
              <div className="flex items-center gap-5">
                 <div className="bg-white p-3.5 rounded-2xl shadow-sm text-indigo-600">
                    <Sparkles size={26} />
                 </div>
                 <div>
                    <h4 className="text-slate-900 font-black text-lg">الذكاء الاصطناعي مفعّل</h4>
                    <p className="text-slate-500 text-sm font-medium">نبحث لك في أحدث الموسوعات العالمية عند عدم توفر المصطلح محلياً.</p>
                 </div>
              </div>
              <div className="flex gap-6 items-center">
                 <div className="text-center">
                    <div className="text-indigo-600 font-black text-2xl">{terms.length}</div>
                    <div className="text-slate-400 text-[11px] font-black uppercase tracking-widest">مصطلح</div>
                 </div>
                 <div className="h-10 w-px bg-indigo-100"></div>
                 <div className="bg-white px-5 py-2.5 rounded-2xl border border-indigo-100 flex items-center gap-2 text-indigo-600 font-black text-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>محدّث الآن</span>
                 </div>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-10 overflow-x-auto no-scrollbar">
              <div className="flex gap-3 min-w-max pb-3 px-2 justify-center">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-8 py-3.5 rounded-2xl text-xs font-black transition-all border-2 ${
                      selectedCategory === cat
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xl scale-105'
                        : 'bg-white text-slate-500 border-slate-100 hover:border-indigo-300 shadow-sm'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24 max-w-5xl mx-auto">
              {filteredTerms.map((term) => (
                <div key={term.id} className="relative transition-transform hover:scale-[1.01]">
                  <TermCard term={term} onClick={(t) => { setSelectedTerm(t); setIsModalOpen(true); }} />
                </div>
              ))}
            </div>

            {filteredTerms.length === 0 && searchTerm && (
              <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-slate-100 max-w-3xl mx-auto shadow-inner">
                <Globe2 size={64} className="mx-auto text-indigo-200 mb-8 animate-pulse" />
                <h3 className="text-3xl font-black text-slate-900 mb-6">هل تريد البحث عن "{searchTerm}" عالمياً؟</h3>
                <button
                  onClick={handleSearchAi}
                  disabled={isSearchingAi}
                  className="bg-indigo-600 text-white px-14 py-6 rounded-[2rem] hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 font-black text-xl flex items-center gap-4 mx-auto"
                >
                  {isSearchingAi ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />}
                  استخدام الذكاء الاصطناعي
                </button>
              </div>
            )}
          </div>
        ) : (
          <CodeGenerator />
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
