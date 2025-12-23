
import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { TermCard } from './components/TermCard';
import { DetailModal } from './components/DetailModal';
import { CodeGenerator } from './components/CodeGenerator';
import { INITIAL_TERMS } from './constants';
import { Term, TermCategory } from './types';
import { Search, Sparkles, Loader2, BookOpen, Cpu, Globe2, TrendingUp, X } from 'lucide-react';
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
      setError("فشل الاتصال بالذكاء الاصطناعي.");
    } finally {
      setIsSearchingAi(false);
    }
  };

  const searchInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 selection:bg-indigo-100">
      <Header onSearchFocus={() => searchInputRef.current?.focus()} />

      <main className="max-w-5xl mx-auto px-4 pt-10">
        {/* Navigation Tabs - Simplified to avoid overlaps */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 bg-white rounded-2xl shadow-md border border-slate-200">
            <button
              onClick={() => setActiveTab('dictionary')}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl text-lg font-bold transition-all ${
                activeTab === 'dictionary'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <BookOpen size={20} />
              القاموس
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl text-lg font-bold transition-all ${
                activeTab === 'code'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Cpu size={20} />
              المطور
            </button>
          </div>
        </div>

        {activeTab === 'dictionary' ? (
          <div className="animate-in fade-in duration-500">
            <div className="mb-10 max-w-4xl mx-auto">
              <div className="relative shadow-xl rounded-3xl bg-white border border-slate-200 focus-within:ring-4 focus-within:ring-indigo-100 transition-all overflow-hidden">
                <div className="absolute inset-y-0 right-6 flex items-center text-slate-400">
                  {isSearchingAi ? <Loader2 size={24} className="animate-spin" /> : <Search size={24} />}
                </div>
                
                <input
                  ref={searchInputRef}
                  type="text"
                  className="block w-full pr-16 pl-40 py-6 text-slate-800 bg-transparent focus:outline-none text-xl font-bold"
                  placeholder="ابحث عن أي مصطلح تقني..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchAi()}
                />

                <div className="absolute inset-y-0 left-4 flex items-center gap-2">
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="p-2 text-slate-400 hover:text-rose-500"
                    >
                      <X size={20} />
                    </button>
                  )}
                  {searchTerm && (
                    <button 
                      onClick={handleSearchAi}
                      className="px-6 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-100"
                    >
                      بحث ذكي
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-8 overflow-x-auto no-scrollbar pb-2">
              <div className="flex gap-2 justify-center min-w-max">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      selectedCategory === cat
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto mb-20">
              {filteredTerms.map((term) => (
                <TermCard key={term.id} term={term} onClick={(t) => { setSelectedTerm(t); setIsModalOpen(true); }} />
              ))}
            </div>
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
