import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { TermCard } from './components/TermCard';
import { DetailModal } from './components/DetailModal';
import { CodeGenerator } from './components/CodeGenerator';
import { INITIAL_TERMS } from './constants';
import { Term, TermCategory } from './types';
import { Search, Sparkles, AlertCircle, Loader2, Bookmark, BookOpen, Terminal, XCircle } from 'lucide-react';
import { fetchTermDefinition } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dictionary' | 'code'>('dictionary');
  
  // Dictionary State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Robust localStorage handling to prevent crashes
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('techlingo_favs');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error parsing favorites:", e);
      return [];
    }
  });
  
  const [terms, setTerms] = useState<Term[]>(INITIAL_TERMS);
  const [isSearchingAi, setIsSearchingAi] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');

  // Save favorites
  useEffect(() => {
    try {
      localStorage.setItem('techlingo_favs', JSON.stringify(favorites));
    } catch (e) {
      console.error("Error saving favorites:", e);
    }
  }, [favorites]);

  const toggleFavorite = (termId: string) => {
    setFavorites(prev => 
      prev.includes(termId) 
        ? prev.filter(id => id !== termId)
        : [...prev, termId]
    );
  };

  const categories = ['الكل', ...Object.values(TermCategory)];

  // Filtering Logic
  const filteredTerms = useMemo(() => {
    let result = terms;

    // Filter by Category
    if (selectedCategory !== 'الكل') {
      result = result.filter(t => t.category === selectedCategory);
    }

    // Filter by Search
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(t => 
        t.term.toLowerCase().includes(lowerSearch) || 
        t.arabicTerm.includes(lowerSearch) ||
        t.definition.includes(lowerSearch)
      );
    }

    // Sort: Favorites first, then alphabetical
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
          term: searchTerm, // Use user's search term capitalized ideally, but raw is fine
          arabicTerm: result.arabicTerm,
          definition: result.definition,
          example: result.example,
          category: result.category as TermCategory || TermCategory.GENERAL,
          isAiGenerated: true
        };
        
        setTerms(prev => [newTerm, ...prev]);
        setSelectedTerm(newTerm);
        setIsModalOpen(true);
      }
    } catch (error: any) {
      console.error("Failed to fetch AI term", error);
      setError(error.message || "عذراً، حدث خطأ في الاتصال. تأكد من اتصال الإنترنت.");
    } finally {
      setIsSearchingAi(false);
    }
  };

  const handleTermClick = (term: Term) => {
    setSelectedTerm(term);
    setIsModalOpen(true);
  };

  const searchInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header onSearchFocus={() => searchInputRef.current?.focus()} />

      <main className="max-w-4xl mx-auto px-4 pt-6">
        
        {/* Tab Switcher */}
        <div className="flex p-1 bg-white rounded-xl shadow-sm border border-gray-200 mb-8 w-fit mx-auto">
          <button
            onClick={() => setActiveTab('dictionary')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'dictionary'
                ? 'bg-primary-50 text-primary-600 shadow-sm'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <BookOpen size={18} />
            القاموس
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'code'
                ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Terminal size={18} />
            المبرمج الذكي
          </button>
        </div>

        {activeTab === 'dictionary' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Search Hero */}
            <div className="mb-4">
              <div className="relative shadow-sm rounded-2xl bg-white overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                  <Search size={22} />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  className="block w-full pr-12 pl-4 py-4 text-gray-900 placeholder-gray-400 focus:outline-none text-lg"
                  placeholder="ابحث عن مصطلح (مثال: API, Cloud)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && filteredTerms.length === 0 && !isSearchingAi) {
                      handleSearchAi();
                    }
                  }}
                />
                {searchTerm && (
                  <div className="absolute inset-y-0 left-0 pl-2 flex items-center">
                     <button 
                      onClick={() => setSearchTerm('')}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
                     >
                       <AlertCircle size={18} className="rotate-45" />
                     </button>
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
                <XCircle size={20} className="shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Categories */}
            <div className="mb-8 overflow-x-auto no-scrollbar pb-2">
              <div className="flex gap-2 min-w-max">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                      selectedCategory === cat
                        ? 'bg-primary-600 text-white shadow-md shadow-primary-200'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-xl font-bold text-gray-800">
                {filteredTerms.length > 0 ? 'المصطلحات' : 'لا توجد نتائج'}
              </h2>
              <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                {filteredTerms.length} مصطلح
              </span>
            </div>

            {/* Content Area */}
            {filteredTerms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTerms.map((term) => (
                  <div key={term.id} className="relative">
                     {favorites.includes(term.id) && (
                       <div className="absolute top-[-6px] left-4 z-10 text-yellow-400 drop-shadow-sm">
                          <Bookmark fill="currentColor" size={16} />
                       </div>
                     )}
                    <TermCard term={term} onClick={handleTermClick} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300">
                <div className="mx-auto w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4 text-primary-500">
                  <Sparkles size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">المصطلح غير موجود؟</h3>
                <p className="text-gray-500 mb-6 max-w-xs mx-auto">
                  لا تقلق، الذكاء الاصطناعي يمكنه شرح المصطلح لك فوراً وبشكل مبسط.
                </p>
                <button
                  onClick={handleSearchAi}
                  disabled={!searchTerm.trim() || isSearchingAi}
                  className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSearchingAi ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      جاري البحث والتحليل...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      اسأل الذكاء الاصطناعي عن "{searchTerm || '...'}"
                    </>
                  )}
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