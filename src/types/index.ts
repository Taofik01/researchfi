export interface Milestone {
  description: string
  released: boolean
  amount: string
}
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
  milestones?: Milestone[];
}

export interface AIReview {
  summary: string[];
  methodologyFlags: string[];
  score: number;
  recommendation: 'approve' | 'revise' | 'reject';
}