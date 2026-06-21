import type { Proposal } from '../types'

interface Props {
  proposal: Proposal
  onClick: () => void
}

const statusColors = {
  pending: 'bg-yellow-950 text-yellow-400 border-yellow-800',
  reviewing: 'bg-blue-950 text-blue-400 border-blue-800',
  reviewed: 'bg-emerald-950 text-emerald-400 border-emerald-800',
  funded: 'bg-purple-950 text-purple-400 border-purple-800',
}

const recommendationColor = {
  approve: 'text-emerald-400',
  revise: 'text-yellow-400',
  reject: 'text-red-400',
}

export default function ProposalCard({ proposal, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="bg-gray-900 border border-gray-800 rounded-xl p-5 cursor-pointer hover:border-emerald-800 hover:bg-gray-900/80 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <span className={`text-xs px-2 py-1 rounded-md border font-medium ${statusColors[proposal.status]}`}>
          {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
        </span>
        {proposal.aiReview && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500">AI Score</span>
            <span className={`text-sm font-bold ${recommendationColor[proposal.aiReview.recommendation]}`}>
              {proposal.aiReview.score}/100
            </span>
          </div>
        )}
      </div>

      <h3 className="text-white font-semibold mb-2 group-hover:text-emerald-400 transition-colors leading-snug">
        {proposal.title}
      </h3>
      <p className="text-gray-500 text-sm line-clamp-2 mb-4">
        {proposal.abstract}
      </p>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-gray-400 text-sm font-medium">{proposal.researcher}</div>
          <div className="text-gray-600 text-xs font-mono mt-0.5">
            {proposal.walletAddress.slice(0, 6)}...{proposal.walletAddress.slice(-4)}
          </div>
        </div>
        {proposal.aiReview && (
          <div className="text-xs text-gray-600 flex items-center gap-1">
            <span>🤖</span> AI Reviewed
          </div>
        )}
      </div>

      {/* Storage CID */}
      <div className="mt-4 pt-4 border-t border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">0G Storage</span>
          <span className="text-xs font-mono text-gray-500 truncate">{proposal.storageCid.slice(0, 20)}...</span>
        </div>
      </div>
    </div>
  )
}