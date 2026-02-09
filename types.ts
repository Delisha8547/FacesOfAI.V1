
export interface User {
  name: string;
  email: string;
}

export interface AIPersona {
  id: string;
  name: string;
  role: string;
  character: string; 
  description: string;
  knowledgeBase: string[];
  brainType: 'standard' | 'high-performance';
  createdAt: number;
  apiKey: string;
  creatorEmail: string; // Used to filter projects by user
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface CreationStep {
  id: number;
  title: string;
}
