import { useState } from 'react'

interface Milestone {
  description: string
  released: boolean
  amount: string
}

interface Props {
  proposalId: string
  milestones: Milestone[]
  isResearcher: boolean
}

export default function MilestoneTracker({ proposalId, milestones, isResearcher }: Props) {
  const [releasing, setReleasing] = useState<number | null>(null)

  const handleRelease = async (index: number) => {
    setReleasing(index)
    try {
      const { getWalletClient, CONTRACT_ADDRESS, CONTRACT_ABI } = await import('../lib/contract')
      const walletClient = getWalletClient()
      const [address] = await walletClient.getAddresses()

      await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'releaseMilestone',
        args: [BigInt(proposalId), BigInt(index)],
        account: address,
      })

      alert('Milestone released on-chain!')
    } catch (err: any) {
      alert(`Failed: ${err.message}`)
    } finally {
      setReleasing(null)
    }
  }

  if (milestones.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Milestones</h2>
        <p className="text-gray-600 text-sm">No milestones defined for this proposal.</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
        Milestones
      </h2>

      <div className="space-y-3">
        {milestones.map((m, i) => (
          <div key={i} className={`rounded-lg p-4 border ${
            m.released
              ? 'bg-emerald-950/30 border-emerald-900/50'
              : 'bg-gray-950 border-gray-800'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold ${
                  m.released ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-500'
                }`}>
                  {m.released ? '✓' : i + 1}
                </div>
                <div>
                  <p className={`text-sm font-medium ${m.released ? 'text-emerald-400' : 'text-gray-300'}`}>
                    {m.description}
                  </p>
                  {m.amount && (
                    <p className="text-gray-500 text-xs mt-1">{m.amount} OG on release</p>
                  )}
                </div>
              </div>

              {!m.released && isResearcher && (
                <button
                  onClick={() => handleRelease(i)}
                  disabled={releasing === i}
                  className="text-xs bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 text-white px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
                >
                  {releasing === i ? 'Releasing...' : 'Release'}
                </button>
              )}

              {m.released && (
                <span className="text-xs text-emerald-500 flex-shrink-0">Released</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-800">
        <div className="flex justify-between text-xs text-gray-500">
          <span>{milestones.filter(m => m.released).length} of {milestones.length} completed</span>
          <span>{Math.round((milestones.filter(m => m.released).length / milestones.length) * 100)}%</span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full mt-2 overflow-hidden">
          <div
            className="h-full bg-emerald-600 rounded-full transition-all"
            style={{ width: `${(milestones.filter(m => m.released).length / milestones.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}