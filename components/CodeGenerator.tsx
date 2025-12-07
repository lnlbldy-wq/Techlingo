import React, { useState } from 'react';
import { generateCode } from '../services/geminiService';
import { Terminal, Copy, Check, Loader2, Sparkles, XCircle } from 'lucide-react';

export const CodeGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setCode('');
    setError(null);
    
    try {
      const result = await generateCode(prompt);
      if (result) {
        setCode(result);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "حدث خطأ أثناء توليد الكود. تحقق من الاتصال أو مفتاح API.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Input Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-4 text-gray-800">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <Terminal size={20} />
          </div>
          <h2 className="text-lg font-bold">اطلب الكود</h2>
        </div>
        
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="اكتب وصف الكود الذي تريده... (مثال: كود بايثون لترتيب قائمة أرقام، أو صفحة HTML لتسجيل الدخول)"
          className="w-full h-32 p-4 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all resize-none text-gray-700 bg-gray-50 text-lg"
          dir="rtl"
        />
        
        {/* Error Message */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700 animate-in fade-in">
            <XCircle size={20} className="shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                جاري الكتابة...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                اكتب الكود
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output Section */}
      {(code || isLoading) && !error && (
        <div className="bg-[#1e1e1e] rounded-2xl overflow-hidden shadow-xl border border-gray-800">
          <div className="flex items-center justify-between px-4 py-3 bg-[#2d2d2d] border-b border-gray-700">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            {code && (
              <button 
                onClick={copyToClipboard}
                className="text-gray-400 hover:text-white flex items-center gap-2 text-sm transition-colors"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'تم النسخ' : 'نسخ الكود'}
              </button>
            )}
          </div>
          
          <div className="p-6 overflow-x-auto">
            {isLoading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
              </div>
            ) : (
              <pre className="text-gray-100 font-mono text-sm leading-relaxed whitespace-pre-wrap" dir="ltr">
                <code>{code}</code>
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
};