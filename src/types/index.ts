export interface Proposal {
  id: string;
  title: string;
  abstract: string;
  researcher: string;
  walletAddress: string;
  storageCid: string;
  txHash: string;
  timestamp: number;
  aiReview?: AIReview;
  status: 'pending' | 'reviewing' | 'reviewed' | 'funded';
}

export interface AIReview {
  summary: string[];
  methodologyFlags: string[];
  score: number;
  recommendation: 'approve' | 'revise' | 'reject';
}