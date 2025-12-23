
import React, { useState } from 'react';
import { processDevCode } from '../services/geminiService';
import { DevMode, CodeAiResponse } from '../types';
import { 
  Terminal, Copy, Check, Loader2, Sparkles, XCircle, 
  Bug, Zap, ChevronDown, AlignRight,
  TrendingUp, Eye, Rocket,
  Lightbulb, ShieldCheck, Activity, Code2, Cpu, RotateCcw, Info
} from 'lucide-react';

const LANGUAGES = ['تلقائي', 'Python', 'JavaScript', 'TypeScript', 'Rust', 'Go', 'C++', 'Java', 'C#', 'SQL', 'Swift', 'PHP'];
const FRAMEWORKS = ['None', 'React', 'Node.js', 'Django', 'Flask', 'Spring Boot', 'Next.js', 'Vue', 'Laravel'];

export const CodeGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<DevMode>('generate');
  const [lang, setLang] = useState('تلقائي');
  const [framework, setFramework] = useState('None');
  const [result, setResult] = useState<CodeAiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [evolutionTab, setEvolutionTab] = useState<'basic' | 'optimized' | 'enterprise'>('optimized');

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await processDevCode(prompt, mode, lang, framework === 'None' ? undefined : framework);
      setResult(data);
    } catch (err: any) {
      if (err.message.includes("Requested entity was not found")) {
        setError("يبدو أن مفتاح الـ API المختار لا يملك صلاحية الوصول لهذا النموذج المتقدم. يرجى اختيار مفتاح من مشروع مفعل به الفوترة.");
        if (window.aistudio?.openSelectKey) {
            setTimeout(() => window.aistudio.openSelectKey(), 2000);
        }
      } else {
        setError(err.message || "حدث خطأ غير متوقع في الخادم.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetAll = () => {
    setPrompt('');
    setResult(null);
    setError(null);
  };

  const copyCode = (text?: string) => {
    const codeToCopy = text || (mode === 'evolve' && result?.evolution ? result.evolution[evolutionTab] : result?.code);
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-5xl mx-auto">
      <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-2xl border border-slate-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-lg">
              <Terminal size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900">مختبر البرمجة</h2>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">AI Engineering Assistant</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 overflow-x-auto no-scrollbar">
            {[
              { id: 'generate', label: 'بناء', icon: <Sparkles size={14}/> },
              { id: 'fix', label: 'إصلاح', icon: <Bug size={14}/> },
              { id: 'optimize', label: 'تحسين', icon: <Zap size={14}/> },
              { id: 'evolve', label: 'تطور', icon: <TrendingUp size={14}/> },
              { id: 'review', label: 'مراجعة', icon: <Eye size={14}/> },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id as DevMode)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black transition-all ${
                  mode === m.id 
                  ? 'bg-white text-indigo-600 shadow-md border border-indigo-100' 
                  : 'text-slate-500 hover:text-indigo-600'
                }`}
              >
                {m.icon}
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Improved Select wrapper to prevent label overlap */}
          <div className="space-y-2">
            <label className="text-xs font-black text-indigo-500 mr-2 uppercase tracking-tighter">اللغة البرمجية</label>
            <div className="relative">
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value)}
                className="w-full appearance-none bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
              >
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <ChevronDown className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-black text-indigo-500 mr-2 uppercase tracking-tighter">إطار العمل (اختياري)</label>
            <div className="relative">
              <select 
                value={framework} 
                onChange={(e) => setFramework(e.target.value)}
                className="w-full appearance-none bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
              >
                {FRAMEWORKS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              <ChevronDown className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            </div>
          </div>
        </div>

        <div className="relative mb-8">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="اشرح ما تريد بناءه أو أصلح الكود هنا..."
            className="w-full h-48 md:h-64 p-8 rounded-[2rem] border-2 border-slate-100 focus:border-indigo-500 focus:ring-8 focus:ring-indigo-50 transition-all resize-none text-slate-700 bg-slate-50/20 text-lg font-medium"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
              <ShieldCheck size={16} />
              <span>بيئة معالجة آمنة</span>
            </div>
            {result && (
               <button 
                  onClick={resetAll}
                  className="p-3 text-slate-400 hover:text-indigo-600 bg-slate-50 rounded-xl transition-colors"
                  title="طلب جديد"
               >
                  <RotateCcw size={20} />
               </button>
            )}
          </div>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !prompt.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-4 bg-indigo-600 text-white px-10 py-5 rounded-2xl hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-100 font-black text-xl"
          >
            {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Rocket size={24} />}
            {isLoading ? 'جاري التحليل...' : 'تنفيذ الطلب البرمجي'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 p-8 rounded-[2rem] border border-rose-100 shadow-sm animate-in shake duration-500">
          <div className="flex items-center gap-4 text-rose-700 font-black mb-2">
            <XCircle size={24} />
            <h3 className="text-xl">تنبيه تقني</h3>
          </div>
          <p className="text-rose-600 font-medium leading-relaxed">{error}</p>
          <div className="mt-4 flex gap-3">
             <button 
                onClick={handleSubmit}
                className="text-rose-700 font-bold text-sm bg-white border border-rose-200 px-4 py-2 rounded-xl hover:bg-rose-100 transition-colors"
             >
                إعادة المحاولة
             </button>
             {error.includes("مفتاح الـ API") && (
                <button 
                  onClick={() => window.aistudio?.openSelectKey?.()}
                  className="text-indigo-700 font-bold text-sm bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors"
                >
                  تغيير المفتاح
                </button>
             )}
          </div>
        </div>
      )}

      {(result || isLoading) && (
        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
          <div className="bg-[#0d1117] rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-800">
            <div className="flex items-center justify-between px-8 py-5 bg-[#161b22] border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                   <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                   <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                   <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                </div>
                <span className="text-slate-400 text-xs font-mono ml-4 tracking-widest uppercase">
                  {mode === 'evolve' ? `evolution_${evolutionTab}.code` : `output.${lang.toLowerCase()}`}
                </span>
              </div>
              <button 
                onClick={() => copyCode()} 
                className="flex items-center gap-2 bg-slate-800/50 hover:bg-indigo-600 text-slate-300 hover:text-white px-4 py-2 rounded-xl transition-all font-black text-xs border border-slate-700"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'تم النسخ' : 'نسخ الكود'}
              </button>
            </div>

            {mode === 'evolve' && result?.evolution && (
              <div className="bg-[#161b22]/50 p-2 flex gap-1 border-b border-slate-800">
                {[
                  { id: 'basic', label: 'أساسي', icon: <Cpu size={12}/> },
                  { id: 'optimized', label: 'محسّن', icon: <Activity size={12}/> },
                  { id: 'enterprise', label: 'احترافي', icon: <Info size={12}/> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setEvolutionTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-black transition-all ${
                      evolutionTab === tab.id 
                      ? 'bg-indigo-600 text-white shadow-lg' 
                      : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            )}

            <div className="p-8 overflow-x-auto min-h-[200px]">
              {isLoading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-4 bg-slate-800 rounded-full w-3/4"></div>
                  <div className="h-4 bg-slate-800 rounded-full w-1/2"></div>
                  <div className="h-4 bg-slate-800 rounded-full w-5/6"></div>
                </div>
              ) : (
                <pre className="text-[#e6edf3] font-mono text-sm leading-8" dir="ltr">
                  <code>{mode === 'evolve' ? result?.evolution?.[evolutionTab] : result?.code}</code>
                </pre>
              )}
            </div>
          </div>

          {result?.explanation && !isLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600"><AlignRight size={24}/></div>
                  <h3 className="text-2xl font-black text-slate-900">شرح معماري</h3>
                </div>
                <div className="text-slate-600 leading-relaxed text-lg whitespace-pre-line font-medium border-r-4 border-indigo-100 pr-6">
                  {result.explanation}
                </div>
              </div>

              <div className="space-y-6">
                {result.improvements && result.improvements.length > 0 && (
                  <div className="bg-emerald-50 rounded-[2rem] p-8 border border-emerald-100">
                    <div className="flex items-center gap-3 mb-4 text-emerald-700 font-black">
                      <Lightbulb size={20} />
                      <h4>فرص التحسين</h4>
                    </div>
                    <ul className="space-y-3">
                      {result.improvements.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-emerald-800 text-sm font-bold leading-relaxed">
                          <span className="shrink-0 text-emerald-400">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.detectedErrors && (
                  <div className="bg-rose-50 rounded-[2rem] p-8 border border-rose-100">
                    <div className="flex items-center gap-3 mb-4 text-rose-700 font-black">
                      <Bug size={20} />
                      <h4>ملاحظات الأمان</h4>
                    </div>
                    <p className="text-rose-800 text-sm font-bold leading-relaxed">
                      {result.detectedErrors}
                    </p>
                  </div>
                )}
                
                <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl">
                  <div className="flex items-center gap-3 mb-6 font-black text-indigo-400">
                    <Code2 size={20} />
                    <h4>تفاصيل الحل</h4>
                  </div>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                        <span className="text-slate-400 text-xs font-bold uppercase">Language</span>
                        <span className="text-sm font-mono text-indigo-300">{lang}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-xs font-bold uppercase">Status</span>
                        <span className="text-sm font-mono text-emerald-400 tracking-widest">VERIFIED</span>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
