export type IndexingStatus = 'pending' | 'crawled' | 'indexed' | 'failed';

export interface SubmittedUrl {
  id: string;
  url: string;
  status: IndexingStatus;
  submittedAt: string;
  statusUpdatedAt: string;
  email?: string;
  errorMessage?: string;
}

export interface SummaryStats {
  total: number;
  indexed: number;
  pending: number;
  crawled: number;
  failed: number;
}
 
