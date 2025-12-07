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

export interface AiResponse {
  arabicTerm: string;
  definition: string;
  example: string;
  category: string;
}
