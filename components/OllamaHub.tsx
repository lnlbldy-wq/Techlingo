
import React, { useState } from 'react';
import { 
  Server, Box, FileCode, Play, Copy, Check, ExternalLink, 
  Cpu, Terminal, Download, Rocket, Info, ChevronRight, CheckCircle2
} from 'lucide-react';

export const OllamaHub: React.FC = () => {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const copyToClipboard = (text: string, fileName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(fileName);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const packageJson = `{
  "name": "local-ai-system",
  "version": "1.0.0",
  "main": "server.js",
  "type": "module",
  "dependencies": {
    "express": "^4.18.2",
    "node-fetch": "^3.3.0"
  },
  "scripts": {
    "start": "node server.js"
  }
}`;

  const serverJs = `import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = 3000;

app.use(express.json());

// نقطة النهاية للدردشة ومعالجة الأكواد
app.post('/chat', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'الرجاء إدخال نص (prompt)' });
  }

  // ميزة التحليل: إذا كان النص يحتوي على كود، نطلب من النموذج التركيز على التصحيح
  let systemInstruction = "أنت مساعد ذكي متخصص في البرمجة والتقنية.";
  if (prompt.includes('\` \` \`') || prompt.toLowerCase().includes('code')) {
    systemInstruction = "أنت مهندس برمجيات محترف. قم بتحليل الكود التالي، حدد الأخطاء، وقدم النسخة المصححة مع شرح بسيط.";
  }

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        model: 'llama3', // أو mistral
        prompt: \`\${systemInstruction}\\n\\nالمستخدم: \${prompt}\`,
        stream: false
      })
    });

    const data = await response.json();
    res.json({
      success: true,
      ai_response: data.response
    });

  } catch (error) {
    res.status(500).json({ 
      error: 'فشل الاتصال بـ Ollama. تأكد من تشغيل التطبيق محلياً.',
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(\`✅ الخادم يعمل على: http://localhost:\${PORT}\`);
});`;

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex p-4 bg-indigo-600 rounded-3xl text-white shadow-xl mb-4">
          <Server size={40} />
        </div>
        <h2 className="text-4xl font-black text-slate-900">مختبر الذكاء الاصطناعي المحلي</h2>
        <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
          تعلم كيف تبني خادم ذكاء اصطناعي خاص بك يعمل 100% بدون إنترنت وبدون مفاتيح API باستخدام Ollama و Node.js.
        </p>
      </div>

      {/* Steps List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: <Download />, title: "1. تثبيت Ollama", desc: "تحميل البرنامج وتشغيل موديل llama3 محلياً." },
          { icon: <FileCode />, title: "2. برمجة الخادم", desc: "إنشاء تطبيق Node.js للربط بين المستخدم والموديل." },
          { icon: <Play />, title: "3. التشغيل والربط", desc: "تشغيل النظام وتجربة طلبات التصحيح والدردشة." },
        ].map((step, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">{step.icon}</div>
            <h4 className="font-black text-slate-900">{step.title}</h4>
            <p className="text-xs text-slate-500 font-bold">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* Prerequisites section */}
      <section className="bg-indigo-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
          <div className="shrink-0">
             <div className="w-20 h-20 bg-indigo-500/30 rounded-full flex items-center justify-center border border-white/20">
                <Info size={40} />
             </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-black">قبل البدء: المتطلبات الأساسية</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <li className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl">
                <CheckCircle2 size={18} className="text-emerald-400" />
                <span className="text-sm font-bold">تثبيت Node.js (إصدار 18+)</span>
              </li>
              <li className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl">
                <CheckCircle2 size={18} className="text-emerald-400" />
                <span className="text-sm font-bold">تحميل Ollama من <a href="https://ollama.com" target="_blank" className="underline">هنا</a></span>
              </li>
              <li className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl">
                <CheckCircle2 size={18} className="text-emerald-400" />
                <span className="text-sm font-bold">تشغيل الأمر: <code className="bg-black/20 px-2 rounded">ollama run llama3</code></span>
              </li>
              <li className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl">
                <CheckCircle2 size={18} className="text-emerald-400" />
                <span className="text-sm font-bold">معرفة أساسيات Express</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Code Files Section */}
      <div className="space-y-8">
        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
          <Terminal size={24} className="text-indigo-600" />
          ملفات المشروع الأساسية
        </h3>

        {/* package.json */}
        <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-800">
          <div className="flex items-center justify-between px-6 py-4 bg-slate-800/50">
            <div className="flex items-center gap-2">
              <Box size={18} className="text-amber-400" />
              <span className="text-slate-300 font-mono text-xs font-bold uppercase">package.json</span>
            </div>
            <button 
              onClick={() => copyToClipboard(packageJson, 'package')}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              {copiedFile === 'package' ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              <span className="text-xs font-bold">{copiedFile === 'package' ? 'تم النسخ' : 'نسخ الكود'}</span>
            </button>
          </div>
          <pre className="p-6 overflow-x-auto text-amber-300 font-mono text-sm leading-relaxed" dir="ltr">
            <code>{packageJson}</code>
          </pre>
        </div>

        {/* server.js */}
        <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-800">
          <div className="flex items-center justify-between px-6 py-4 bg-slate-800/50">
            <div className="flex items-center gap-2">
              <FileCode size={18} className="text-indigo-400" />
              <span className="text-slate-300 font-mono text-xs font-bold uppercase">server.js</span>
            </div>
            <button 
              onClick={() => copyToClipboard(serverJs, 'server')}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              {copiedFile === 'server' ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              <span className="text-xs font-bold">{copiedFile === 'server' ? 'تم النسخ' : 'نسخ الكود'}</span>
            </button>
          </div>
          <pre className="p-6 overflow-x-auto text-indigo-300 font-mono text-sm leading-7" dir="ltr">
            <code>{serverJs}</code>
          </pre>
        </div>
      </div>

      {/* Instructions Section */}
      <section className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100">
        <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
          <Rocket size={24} className="text-indigo-600" />
          خطوات التشغيل النهائية
        </h3>
        <div className="space-y-6">
          {[
            { title: "إنشاء المجلد", text: "قم بإنشاء مجلد جديد باسم local-ai وافتح Terminal داخله." },
            { title: "تجهيز الملفات", text: "انسخ كود الملفين أعلاه وضعهما في ملفات بنفس الأسماء." },
            { title: "تثبيت المكتبات", text: "شغل الأمر npm install لتثبيت express و node-fetch." },
            { title: "بدء الخادم", text: "شغل الخادم باستخدام npm start." },
            { title: "التجربة", text: "استخدم برنامج Postman لإرسال طلب POST إلى الرابط http://localhost:3000/chat." },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 group">
              <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                {i + 1}
              </div>
              <div>
                <h4 className="font-black text-slate-900 mb-1">{item.title}</h4>
                <p className="text-slate-500 font-medium text-sm">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Postman Example */}
      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-8 text-center">
        <h4 className="font-black text-slate-700 mb-4">مثال لطلب POST (Request Body):</h4>
        <div className="bg-white p-4 rounded-xl border border-slate-200 inline-block font-mono text-sm text-indigo-600" dir="ltr">
          {`{ "prompt": "حلل هذا الكود: print('hi' + 1)" }`}
        </div>
      </div>
    </div>
  );
};
