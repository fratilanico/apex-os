export type IntelligenceCategory = 'Frontend' | 'Backend' | 'AI' | 'Infra' | 'Mobile' | 'Security';
export type IntelligenceStatus = 'draft' | 'manifested' | 'archived';

export interface FrontierIntelligence {
  id: string;
  title: string;
  description: string;
  logic: string;
  source_url?: string;
  category: IntelligenceCategory;
  tags: string[];
  is_active: boolean;
  status: IntelligenceStatus;
  manifested_node_id?: string;
  created_at: string;
  updated_at: string;
}

export interface IntelligenceDraftRequest {
  title: string;
  description: string;
  logic: string;
  source_url: string;
  category: IntelligenceCategory;
  tags: string[];
}
