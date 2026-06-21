import { useState } from 'react'
import Navbar from './components/NavBar'
import Home from './pages/Home'
import Submit from './pages/Submit'
import ProposalDetail from './pages/Proposal'
import type { Proposal } from './types'

export type Page = 'home' | 'submit' | 'proposal'

function App() {
  const [page, setPage] = useState<Page>('home')
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: '1',
      title: 'Decentralised Biomarker Discovery Using Federated Learning',
      abstract: 'This study proposes a privacy-preserving federated learning framework for biomarker discovery across decentralised clinical datasets, eliminating the need for centralised data aggregation while maintaining statistical power.',
      researcher: 'Dr. Amara Osei',
      walletAddress: '0x742d35Cc6634C0532925a3b8D4C9b4E35Cc1234',
      storageCid: 'QmX7bVBzpMgkW9nT2YqR4sL8uF3cJ6dK1pA5oN0eH4mW',
      txHash: '0xabc123def456',
      timestamp: Date.now() - 86400000,
      status: 'reviewed',
      aiReview: {
        summary: [
          'Proposes federated learning for biomarker discovery without centralising patient data',
          'Targets rare disease cohorts across 12 institutions in 4 countries',
          'Claims 94% diagnostic accuracy with 60% less data exposure than baseline'
        ],
        methodologyFlags: [
          'Sample size per institution not specified — federated averaging may underperform with heterogeneous local datasets',
          'No ablation study comparing federated vs centralised baseline on same data',
        ],
        score: 78,
        recommendation: 'revise'
      }
    },
    {
      id: '2',
      title: 'On-Chain Governance Models for Open Source Drug Development',
      abstract: 'We present a token-curated registry mechanism for coordinating decentralised pharmaceutical R&D, with governance rights tied to validated research contributions rather than capital.',
      researcher: 'Prof. Kenji Watanabe',
      walletAddress: '0x891e46Dd7745D1643036b5C0dA5E8FbB72345678',
      storageCid: 'QmY8cWCaqNhkX0oU3ZrS5tM9vG4dL7eL2qB6pO1fI5nX',
      txHash: '0xdef789ghi012',
      timestamp: Date.now() - 172800000,
      status: 'funded',
      aiReview: {
        summary: [
          'Novel TCR mechanism where governance weight derives from peer-validated research output',
          'Proposes sybil-resistant contribution scoring via zero-knowledge credential proofs',
          'Targets coordination failures in pre-competitive pharma R&D'
        ],
        methodologyFlags: [
          'ZK credential scheme references unpublished protocol — verifiability is unconfirmed',
          'No simulation of adversarial token accumulation scenarios'
        ],
        score: 85,
        recommendation: 'approve'
      }
    }
  ])

  const handleSelectProposal = (proposal: Proposal) => {
    setSelectedProposal(proposal)
    setPage('proposal')
  }

  const handleSubmitProposal = (proposal: Proposal) => {
    setProposals(prev => [proposal, ...prev])
    setSelectedProposal(proposal)
    setPage('proposal')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar page={page} setPage={setPage} />
      {page === 'home' && (
        <Home proposals={proposals} onSelectProposal={handleSelectProposal} setPage={setPage} />
      )}
      {page === 'submit' && (
        <Submit onSubmit={handleSubmitProposal} />
      )}
      
      {page === 'proposal' && selectedProposal && (
        <ProposalDetail proposal={selectedProposal} setPage={setPage} />
      )}
    </div>
  )
}

export default App