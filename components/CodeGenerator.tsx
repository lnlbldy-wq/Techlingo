
import React, { useState } from 'react';
import { processDevCode } from '../services/geminiService';
import { DevMode, CodeAiResponse } from '../types';
import { 
  Terminal, Copy, Check, Loader2, Sparkles, XCircle, 
  Bug, Zap, ChevronDown, AlignRight,
  TrendingUp, Eye, Rocket,
  Lightbulb, ShieldCheck, Activity, Code2, RotateCcw
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
      setError("عذراً، حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى.");
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
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-xl text-white">
              <Terminal size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">مختبر البرمجة</h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">AI Engineering Hub</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
            {[
              { id: 'generate', label: 'بناء', icon: <Sparkles size={14}/> },
              { id: 'fix', label: 'إصلاح', icon: <Bug size={14}/> },
              { id: 'optimize', label: 'تحسين', icon: <Zap size={14}/> },
              { id: 'evolve', label: 'تطور', icon: <TrendingUp size={14}/> },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id as DevMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  mode === m.id 
                  ? 'bg-white text-indigo-600 shadow-sm border border-indigo-100' 
                  : 'text-slate-500 hover:text-indigo-600'
                }`}
              >
                {m.icon}
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-500 mr-2">اللغة البرمجية</span>
            <div className="relative">
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 focus:border-indigo-500 outline-none"
              >
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-500 mr-2">إطار العمل</span>
            <div className="relative">
              <select 
                value={framework} 
                onChange={(e) => setFramework(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 focus:border-indigo-500 outline-none"
              >
                {FRAMEWORKS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="اكتب طلبك البرمجي هنا..."
            className="w-full h-48 p-6 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all resize-none text-slate-700 bg-slate-50 text-lg"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
              <ShieldCheck size={14} />
              <span>معالج آمن</span>
            </div>
            {result && (
               <button 
                  onClick={resetAll}
                  className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 rounded-lg"
                  title="مسح"
               >
                  <RotateCcw size={18} />
               </button>
            )}
          </div>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !prompt.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-lg font-bold text-lg"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Rocket size={20} />}
            {isLoading ? 'جاري العمل...' : 'بدء المعالجة'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100 text-rose-700 flex items-center gap-3 font-bold animate-in slide-in-from-top-4">
          <XCircle size={20} />
          {error}
        </div>
      )}

      {(result || isLoading) && (
        <div className="space-y-6 pb-20">
          <div className="bg-[#0d1117] rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
            <div className="flex items-center justify-between px-6 py-4 bg-[#161b22] border-b border-slate-800">
              <div className="flex gap-1.5">
                 <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                 <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                 <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              </div>
              <button 
                onClick={() => copyCode()} 
                className="flex items-center gap-2 bg-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition-all font-bold text-xs border border-slate-700"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                نسخ
              </button>
            </div>

            <div className="p-6 overflow-x-auto min-h-[200px]">
              {isLoading ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                </div>
              ) : (
                <pre className="text-[#e6edf3] font-mono text-sm leading-7" dir="ltr">
                  <code>{mode === 'evolve' ? result?.evolution?.[evolutionTab] : result?.code}</code>
                </pre>
              )}
            </div>
          </div>

          {result?.explanation && !isLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-lg border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600"><AlignRight size={20}/></div>
                  <h3 className="text-xl font-black text-slate-900">شرح المطور</h3>
                </div>
                <div className="text-slate-600 leading-relaxed text-lg whitespace-pre-line font-medium">
                  {result.explanation}
                </div>
              </div>

              <div className="space-y-4">
                {result.improvements && result.improvements.length > 0 && (
                  <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                    <h4 className="text-emerald-700 font-bold mb-3 flex items-center gap-2">
                      <Lightbulb size={18} /> مقترحات
                    </h4>
                    <ul className="space-y-2 text-emerald-800 text-sm font-medium">
                      {result.improvements.slice(0, 3).map((item, idx) => (
                        <li key={idx}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl">
                  <h4 className="text-indigo-400 font-bold mb-4 flex items-center gap-2">
                    <Code2 size={18} /> الحالة
                  </h4>
                  <div className="space-y-2 text-xs font-mono">
                     <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-400">LANG</span>
                        <span>{lang}</span>
                     </div>
                     <div className="flex justify-between pt-1">
                        <span className="text-slate-400">STATUS</span>
                        <span className="text-emerald-400">OK</span>
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
