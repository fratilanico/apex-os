export type Topic = 'python' | 'javascript' | 'typescript' | 'php' | 'ai' | 'webdev' | 'tech' | 'ai-business' | 'general';
export type Status = 'new' | 'approved' | 'rejected' | 'pinned';

export interface Source {
  id: string;
  name: string;
  feed_url: string;
  topic: Topic;
  weight: number;
  active: boolean;
  last_fetched?: string;
  error_count?: number;
}

export interface DigestItem {
  id: string;
  title: string;
  url: string;
  source_id: string;
  source_name: string;
  published_at: string | null;
  topics: Topic[];
  tags: string[];
  summary_hint: string;
  score: number;
  status: Status;
  image: string | null;
  notes?: string; // For manual curation notes
}

export interface DigestData {
  run_id: string;
  generated_at: string;
  window_start: string;
  window_end: string;
  sources: Source[];
  items: DigestItem[];
}

export interface DraftSection {
  title: string;
  items: {
    title: string;
    url: string;
    summary: string;
    takeaway: string;
  }[];
}

export interface NewsletterDraft {
  generated_at: string;
  sections: DraftSection[];
  html_preview: string;
}
