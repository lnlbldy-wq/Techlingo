
import React, { useState } from 'react';
import { processDevCode } from '../services/geminiService';
import { DevMode, CodeAiResponse } from '../types';
import { 
  Terminal, Copy, Check, Loader2, Sparkles, XCircle, 
  Bug, Zap, ChevronDown, AlignRight,
  TrendingUp, ShieldAlert, Eye, Rocket, Layers,
  Lightbulb, ShieldCheck, Activity, Code2, Cpu
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
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
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
      {/* Configuration Panel */}
      <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-indigo-100/50 border border-slate-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-indigo-600 rounded-[1.2rem] text-white shadow-xl shadow-indigo-200 ring-4 ring-indigo-50">
              <Terminal size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">مختبر البرمجة الذكي</h2>
              <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mt-1">Advanced Architecture Engine</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1.5 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-100">
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
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-black transition-all duration-300 ${
                  mode === m.id 
                  ? 'bg-white text-indigo-600 shadow-md border border-indigo-100 scale-105' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                }`}
              >
                {m.icon}
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <div className="relative group">
            <label className="absolute -top-3 right-4 px-2 bg-white text-[10px] font-black text-indigo-500 uppercase z-10">اللغة</label>
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value)}
              className="w-full appearance-none bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all text-base group-hover:border-slate-200"
            >
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <ChevronDown className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
          </div>
          <div className="relative group">
            <label className="absolute -top-3 right-4 px-2 bg-white text-[10px] font-black text-indigo-500 uppercase z-10">إطار العمل</label>
            <select 
              value={framework} 
              onChange={(e) => setFramework(e.target.value)}
              className="w-full appearance-none bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all text-base group-hover:border-slate-200"
            >
              {FRAMEWORKS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <ChevronDown className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
          </div>
        </div>

        <div className="relative mb-8">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="مثلاً: اكتب دالة للتحقق من صحة البريد الإلكتروني مع شرح معايير الأمان..."
            className="w-full h-56 p-8 rounded-3xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-8 focus:ring-indigo-50 transition-all resize-none text-slate-700 bg-slate-50/20 text-lg leading-relaxed font-medium placeholder:text-slate-300"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 text-emerald-500 font-bold text-sm bg-emerald-50/50 px-4 py-2 rounded-full border border-emerald-100">
            <ShieldCheck size={16} />
            <span>بيئة تطوير آمنة ومنعزلة</span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !prompt.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-4 bg-indigo-600 text-white px-12 py-5 rounded-2xl hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-2xl shadow-indigo-100 font-black text-xl"
          >
            {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Rocket size={24} />}
            {isLoading ? 'جاري التحليل...' : 'تنفيذ المهمة البرمجية'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 p-6 rounded-2xl flex items-center gap-4 text-red-600 border border-red-100 font-black shadow-sm">
          <XCircle size={24} />
          <p>{error}</p>
        </div>
      )}

      {/* Result Section */}
      {(result || isLoading) && (
        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
          
          <div className="bg-[#0d1117] rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-800">
            {/* Terminal Header */}
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
                  { id: 'enterprise', label: 'احترافي', icon: <ShieldAlert size={12}/> },
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

            <div className="p-8 overflow-x-auto min-h-[250px]">
              {isLoading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-4 bg-slate-800 rounded-full w-3/4"></div>
                  <div className="h-4 bg-slate-800 rounded-full w-1/2"></div>
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
                  <h3 className="text-2xl font-black text-slate-900">التحليل الهندسي</h3>
                </div>
                <div className="text-slate-600 leading-relaxed text-lg whitespace-pre-line font-medium border-r-4 border-indigo-100 pr-6">
                  {result.explanation}
                </div>
              </div>

              <div className="space-y-6">
                {result.improvements && (
                  <div className="bg-emerald-50/50 rounded-[2rem] p-8 border border-emerald-100">
                    <div className="flex items-center gap-3 mb-4 text-emerald-700 font-black">
                      <Lightbulb size={20} />
                      <h4>نصائح للتحسين</h4>
                    </div>
                    <ul className="space-y-3">
                      {result.improvements.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-emerald-800 text-sm font-bold">
                          <span className="shrink-0">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.detectedErrors && (
                  <div className="bg-rose-50/50 rounded-[2rem] p-8 border border-rose-100">
                    <div className="flex items-center gap-3 mb-4 text-rose-700 font-black">
                      <Bug size={20} />
                      <h4>الملاحظات</h4>
                    </div>
                    <p className="text-rose-800 text-sm font-bold leading-relaxed">
                      {result.detectedErrors}
                    </p>
                  </div>
                )}
                
                <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
                  <div className="flex items-center gap-3 mb-6 font-black text-indigo-400">
                    <Code2 size={20} />
                    <h4>بنية الحل</h4>
                  </div>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                        <span className="text-slate-400 text-xs font-bold uppercase">Lang</span>
                        <span className="text-sm font-mono">{lang}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-xs font-bold uppercase">Status</span>
                        <span className="text-sm font-mono text-emerald-400">READY</span>
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
