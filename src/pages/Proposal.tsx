import type { Proposal } from '../types'
import type { Page } from '../App'
import { useAccount } from 'wagmi'
import { publicClient, CONTRACT_ADDRESS, CONTRACT_ABI } from '../lib/contract'
import { useEffect, useState } from 'react'
import MilestoneTracker from '../components/MilestoneTracker'

interface Props {
  proposal: Proposal
  setPage: (page: Page) => void
}

const recommendationConfig = {
  approve: { label: 'Approved', color: 'text-emerald-400', bg: 'bg-emerald-950 border-emerald-800' },
  revise: { label: 'Revisions Suggested', color: 'text-yellow-400', bg: 'bg-yellow-950 border-yellow-800' },
  reject: { label: 'Not Recommended', color: 'text-red-400', bg: 'bg-red-950 border-red-800' },
}

const statusColors = {
  pending: 'bg-yellow-950 text-yellow-400 border-yellow-800',
  reviewing: 'bg-blue-950 text-blue-400 border-blue-800',
  reviewed: 'bg-emerald-950 text-emerald-400 border-emerald-800',
  funded: 'bg-purple-950 text-purple-400 border-purple-800',
}

export default function ProposalDetail({ proposal, setPage }: Props) {
  const rec = proposal.aiReview ? recommendationConfig[proposal.aiReview.recommendation] : null
  const timeAgo = Math.floor((Date.now() - proposal.timestamp) / 86400000)
  const { address } = useAccount()
const isResearcher = address?.toLowerCase() === proposal.walletAddress?.toLowerCase()
const [reputation, setReputation] = useState<{ proposalCount: bigint; stakedReceived: bigint; reputation: bigint } | null>(null)

useEffect(() => {
  if (!proposal.walletAddress) return
  publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getReputation',
    args: [proposal.walletAddress as `0x${string}`],
  }).then((result: any) => {
    setReputation({
      proposalCount: result[0],
      stakedReceived: result[1],
      reputation: result[2],
    })
  }).catch(console.error)
}, [proposal.walletAddress])

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">

      {/* Back */}
      <button
        onClick={() => setPage('home')}
        className="text-gray-500 hover:text-white text-sm transition-colors mb-8 flex items-center gap-2"
      >
        ← Back to Proposals
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className={`text-xs px-2.5 py-1 rounded-md border font-medium ${statusColors[proposal.status]}`}>
            {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
          </span>
          <span className="text-gray-600 text-xs">
            {timeAgo === 0 ? 'Submitted today' : `Submitted ${timeAgo}d ago`}
          </span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
          {proposal.title}
        </h1>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-emerald-900 rounded-full flex items-center justify-center">
              <span className="text-emerald-400 text-xs font-bold">
                {proposal.researcher.split(' ').pop()?.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-white text-sm font-medium">{proposal.researcher}</p>
              <p className="text-gray-600 text-xs font-mono">{proposal.walletAddress.slice(0, 8)}...{proposal.walletAddress.slice(-6)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">

        {/* Main content */}
        <div className="col-span-2 space-y-6">

          {/* Abstract */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Abstract</h2>
            <p className="text-gray-300 leading-relaxed text-sm">{proposal.abstract}</p>
          </div>

          {/* AI Review */}
          {proposal.aiReview && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-lg">🧠</div>
                  <div>
                    <h2 className="text-white font-semibold text-sm">AI Peer Review</h2>
                    <p className="text-gray-600 text-xs">0G Inference Network</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {proposal.aiReview.score}<span className="text-gray-600 text-sm">/100</span>
                  </div>
                </div>
              </div>

              {rec && (
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium mb-6 ${rec.bg} ${rec.color}`}>
                  {proposal.aiReview.recommendation === 'approve' ? '✓' : proposal.aiReview.recommendation === 'revise' ? '⚠' : '✗'} {rec.label}
                </div>
              )}

              {/* Score bar */}
              <div className="mb-6">
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all"
                    style={{ width: `${proposal.aiReview.score}%` }}
                  />
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-3 font-medium">Summary</p>
                  <ul className="space-y-2">
                    {proposal.aiReview.summary.map((s, i) => (
                      <li key={i} className="flex gap-2.5 text-sm text-gray-400">
                        <span className="text-emerald-600 flex-shrink-0 mt-0.5">→</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-3 font-medium">Methodology Flags</p>
                  <ul className="space-y-2">
                    {proposal.aiReview.methodologyFlags.map((f, i) => (
                      <li key={i} className="flex gap-2.5 text-sm text-yellow-500/80 bg-yellow-950/20 border border-yellow-900/30 rounded-lg px-3 py-2.5">
                        <span className="flex-shrink-0">⚠</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* On-chain proof */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">On-Chain Proof</h2>
            <div className="space-y-3">
              <div className="bg-gray-950 rounded-lg p-4">
                <p className="text-gray-600 text-xs mb-1.5">0G Storage CID</p>
                <p className="text-gray-300 text-xs font-mono break-all">{proposal.storageCid}</p>
              </div>
              <div className="bg-gray-950 rounded-lg p-4">
                <p className="text-gray-600 text-xs mb-1.5">Transaction Hash</p>
                <p className="text-gray-300 text-xs font-mono break-all">{proposal.txHash}</p>
                <a
                  href={`https://chainscan-galileo.0g.ai/tx/${proposal.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-500 hover:text-emerald-400 text-xs mt-2 inline-block transition-colors"
                >
                  View on 0G Explorer →
                </a>
              </div>
            </div>
          </div>
        </div>

        {proposal.milestones && proposal.milestones.length > 0 && (
  <MilestoneTracker
    proposalId={proposal.id}
    milestones={proposal.milestones}
    isResearcher={isResearcher}
  />
)}

        {/* Sidebar */}
        <div className="space-y-4">

          {/* Fund this research */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-white font-semibold text-sm mb-4">Fund This Research</h3>

            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Funded</span>
                <span>2,400 / 5,000 OG</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: '48%' }} />
              </div>
              <p className="text-gray-600 text-xs mt-1.5">48% · 12 funders</p>
            </div>

            <div className="space-y-2 mb-4">
              {['100', '500', '1000'].map(amt => (
                <button key={amt} className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm py-2 rounded-lg transition-colors">
                  Stake {amt} OG
                </button>
              ))}
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Custom amount"
                  className="flex-1 bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-emerald-600"
                />
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-2 rounded-lg transition-colors">
                  Stake
                </button>
              </div>
            </div>

            <p className="text-gray-600 text-xs">
              Funds held in escrow. Released when milestones are verified on-chain.
            </p>
          </div>

          {/* Stats */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
            <h3 className="text-white font-semibold text-sm">Proposal Stats</h3>
            {[
              { label: 'Reputation Score', value: reputation ? `${reputation.reputation.toString()}/100` : '—' },
              { label: 'Funders', value: '12' },
              { label: 'Total Staked', value: '2,400 OG' },
              { label: 'Milestones', value: '3 defined' },
            ].map(s => (
              <div key={s.label} className="flex justify-between">
                <span className="text-gray-500 text-xs">{s.label}</span>
                <span className="text-white text-xs font-medium">{s.value}</span>
              </div>
            ))}
          </div>

          {/* Share */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-white font-semibold text-sm mb-3">Share</h3>
            <div className="flex gap-2">
              {['Twitter', 'Copy Link'].map(s => (
                <button key={s} className="flex-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-400 py-2 rounded-lg transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}