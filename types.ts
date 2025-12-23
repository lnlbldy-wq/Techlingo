
export interface Term {
  id: string;
  term: string;
  arabicTerm: string;
  definition: string;
  example: string;
  category: TermCategory;
  isAiGenerated?: boolean;
}

export enum TermCategory {
  GENERAL = 'عام',
  PROGRAMMING = 'برمجة',
  HARDWARE = 'عتاد',
  AI = 'ذكاء اصطناعي',
  NETWORKING = 'شبكات',
  CLOUD = 'سحابة'
}

export type DevMode = 'generate' | 'fix' | 'optimize' | 'refactor' | 'review' | 'evolve';

export interface CodeAiResponse {
  code: string;
  explanation: string;
  detectedErrors?: string;
  improvements?: string[];
  evolution?: {
    basic: string;
    optimized: string;
    enterprise: string;
  };
  reviewFeedbacks?: {
    line: string;
    comment: string;
    type: 'security' | 'performance' | 'style';
  }[];
}

export interface AiResponse {
  arabicTerm: string;
  definition: string;
  example: string;
  category: string;
}

export interface TranslationResponse {
  enDefinition: string;
  enExample: string;
}
