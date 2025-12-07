import React, { useState } from 'react';
import { generateCode } from '../services/geminiService';
import { Code, Terminal, Copy, Check, Loader2, Sparkles, XCircle } from 'lucide-react';

export const CodeGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');