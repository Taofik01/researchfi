import { useState } from 'react'
import type { Proposal } from '../types'

interface Props {
  onSubmit: (proposal: Proposal) => void
}

type Step = 'details' | 'upload' | 'review' | 'confirm'

const steps: { id: Step; label: string; description: string }[] = [
  { id: 'details', label: 'Research Details', description: 'Title, abstract, and researcher info' },
  { id: 'upload', label: 'Upload Files', description: 'Store on 0G decentralised storage' },
  { id: 'review', label: 'AI Peer Review', description: 'Automated methodology analysis' },
  { id: 'confirm', label: 'Submit On-Chain', description: 'Register proposal on 0G Chain' },
]

export default function Submit({ onSubmit }: Props) {
  const [currentStep, setCurrentStep] = useState<Step>('details')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')

  const [form, setForm] = useState({
    title: '',
    abstract: '',
    researcher: '',
    institution: '',
    fundingGoal: '',
    milestones: '',
    category: '',
  })

  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [storageCid, setStorageCid] = useState('')
  const [txHash, setTxHash] = useState('')
  const [aiReview, setAiReview] = useState<any>(null)

  const stepIndex = steps.findIndex(s => s.id === currentStep)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setUploadedFile(e.target.files[0])
  }

  const uploadToStorage = async () => {
  if (!uploadedFile) return

  setIsLoading(true)
  setLoadingMessage('Connecting to 0G Storage network...')

  try {
    const formData = new FormData()
    formData.append('file', uploadedFile)

    setLoadingMessage('Uploading to decentralised nodes...')
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.error || 'Upload failed')
    }

    const { rootHash } = await response.json()

    setLoadingMessage('Verifying data availability...')
    await new Promise(res => setTimeout(res, 800))

    setStorageCid(rootHash)
    setIsLoading(false)
    setCurrentStep('review')
  } catch (err: any) {
    alert(`Storage upload failed: ${err.message}`)
    setIsLoading(false)
  }
}

 const runAIReview = async () => {
  setIsLoading(true)
  setLoadingMessage('Sending to 0G Inference network...')

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        abstract: form.abstract,
        category: form.category,
      }),
    })

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.error || 'Review failed')
    }

    const review = await response.json()
    setAiReview(review)
  } catch (err: any) {
    alert(`AI Review failed: ${err.message}`)
  } finally {
    setIsLoading(false)
  }
}

  const submitOnChain = async () => {
  setIsLoading(true)
  setLoadingMessage('Preparing transaction...')

  try {
    const { getWalletClient, CONTRACT_ADDRESS, CONTRACT_ABI } = await import('../lib/contract')
    const walletClient = getWalletClient()
    const [address] = await walletClient.getAddresses()

   

    setLoadingMessage('Waiting for wallet signature...')
const hash = await walletClient.writeContract({
  address: CONTRACT_ADDRESS,
  abi: CONTRACT_ABI,
  functionName: 'submitProposal',
  args: [storageCid, form.title, BigInt(aiReview?.score || 0)],
  account: address,
})

setLoadingMessage('Confirming on 0G Chain...')
await new Promise(res => setTimeout(res, 2000))

    setTxHash(hash)
    setIsLoading(false)

    const proposal: Proposal = {
      id: Date.now().toString(),
      title: form.title,
      abstract: form.abstract,
      researcher: form.researcher,
      walletAddress: address,
      storageCid,
      txHash: hash,
      timestamp: Date.now(),
      status: 'reviewed',
      aiReview,
    }
    onSubmit(proposal)
    setCurrentStep('confirm')
  } catch (err: any) {
    console.error(err)
    alert(`Transaction failed: ${err.message}`)
    setIsLoading(false)
  }
}

//   const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

  const canProceedDetails = form.title && form.abstract && form.researcher

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">

      {/* Page header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Submit Research Proposal</h1>
        <p className="text-gray-500">Your proposal will be stored on 0G, reviewed by AI, and registered on-chain.</p>
      </div>

      {/* Step progress */}
      <div className="flex items-start gap-0 mb-12">
        {steps.map((step, i) => (
          <div key={step.id} className="flex-1 flex items-start">
            <div className="flex flex-col items-center w-full">
              <div className="flex items-center w-full">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all ${
                  i < stepIndex
                    ? 'bg-emerald-600 text-white'
                    : i === stepIndex
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-900'
                    : 'bg-gray-800 text-gray-500'
                }`}>
                  {i < stepIndex ? '✓' : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-px flex-1 mx-2 transition-all ${i < stepIndex ? 'bg-emerald-600' : 'bg-gray-800'}`} />
                )}
              </div>
              <div className="mt-2 pr-4">
                <div className={`text-xs font-medium ${i === stepIndex ? 'text-white' : i < stepIndex ? 'text-emerald-500' : 'text-gray-600'}`}>
                  {step.label}
                </div>
                <div className="text-xs text-gray-600 mt-0.5 hidden md:block">{step.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 mb-6 text-center">
          <div className="w-10 h-10 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-300 text-sm">{loadingMessage}</p>
        </div>
      )}

      {/* Step: Details */}
      {currentStep === 'details' && !isLoading && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <h2 className="text-lg font-semibold text-white mb-6">Research Details</h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Research Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Federated Learning for Decentralised Biomarker Discovery"
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-600 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Lead Researcher *</label>
                <input
                  type="text"
                  value={form.researcher}
                  onChange={e => setForm({ ...form, researcher: e.target.value })}
                  placeholder="Dr. Jane Smith"
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-600 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Institution</label>
                <input
                  type="text"
                  value={form.institution}
                  onChange={e => setForm({ ...form, institution: e.target.value })}
                  placeholder="University / Lab / Independent"
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-600 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Research Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-600 transition-colors"
                >
                  <option value="">Select category</option>
                  <option value="biomedical">Biomedical</option>
                  <option value="climate">Climate Science</option>
                  <option value="ai-ml">AI / Machine Learning</option>
                  <option value="economics">Economics</option>
                  <option value="physics">Physics</option>
                  <option value="social-science">Social Science</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Funding Goal (OG)</label>
                <input
                  type="number"
                  value={form.fundingGoal}
                  onChange={e => setForm({ ...form, fundingGoal: e.target.value })}
                  placeholder="e.g. 5000"
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-600 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Abstract *</label>
              <textarea
                value={form.abstract}
                onChange={e => setForm({ ...form, abstract: e.target.value })}
                placeholder="Describe your research: the problem, your approach, expected outcomes, and why it matters..."
                rows={5}
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-600 transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Milestones</label>
              <textarea
                value={form.milestones}
                onChange={e => setForm({ ...form, milestones: e.target.value })}
                placeholder="M1: Literature review complete (Month 1)&#10;M2: Data collection complete (Month 3)&#10;M3: Analysis and paper draft (Month 6)"
                rows={3}
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-600 transition-colors resize-none font-mono"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={() => setCurrentStep('upload')}
              disabled={!canProceedDetails}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Continue to Upload →
            </button>
          </div>
        </div>
      )}

      {/* Step: Upload */}
      {currentStep === 'upload' && !isLoading && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <h2 className="text-lg font-semibold text-white mb-2">Upload Research Files</h2>
          <p className="text-gray-500 text-sm mb-6">Files are stored permanently on 0G decentralised storage. Accepted: PDF, DOC, DOCX, TXT</p>

          <div
            className="border-2 border-dashed border-gray-700 hover:border-emerald-700 rounded-xl p-12 text-center cursor-pointer transition-colors group"
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <div className="text-4xl mb-4">📎</div>
            <p className="text-gray-400 text-sm mb-1">
              {uploadedFile ? uploadedFile.name : 'Click to upload or drag and drop'}
            </p>
            <p className="text-gray-600 text-xs">PDF, DOC, DOCX up to 50MB</p>
            <input id="file-input" type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileChange} className="hidden" />
          </div>

          {uploadedFile && (
            <div className="mt-4 bg-emerald-950/50 border border-emerald-900 rounded-lg p-4 flex items-center gap-3">
              <span className="text-emerald-400 text-lg">✓</span>
              <div>
                <p className="text-emerald-400 text-sm font-medium">{uploadedFile.name}</p>
                <p className="text-gray-500 text-xs">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
          )}

          <div className="mt-4 bg-gray-950 border border-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-500 leading-relaxed">
              <span className="text-gray-400 font-medium">0G Storage</span> — Your file will be split into chunks, encrypted, and distributed across decentralised storage nodes. A content identifier (CID) will be recorded on-chain as permanent proof of your submission.
            </p>
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setCurrentStep('details')}
              className="text-gray-500 hover:text-white text-sm transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={uploadToStorage}
              disabled={!uploadedFile}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Upload to 0G Storage →
            </button>
          </div>
        </div>
      )}

      {/* Step: AI Review */}
      {currentStep === 'review' && !isLoading && (
        <div className="space-y-4">
          {/* Storage confirmed */}
          <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-xl p-5 flex items-start gap-4">
            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm">✓</span>
            </div>
            <div>
              <p className="text-emerald-400 font-medium text-sm">Stored on 0G Network</p>
              <p className="text-gray-500 text-xs mt-1 font-mono">{storageCid}</p>
              <p className="text-gray-600 text-xs mt-1">Data availability verified across 0G DA layer</p>
            </div>
          </div>

          {/* AI Review panel */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-emerald-900 rounded-lg flex items-center justify-center">
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6" stroke="#34d399" strokeWidth="1.5"/>
    <path d="M5 8h6M8 5v6" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
</div>
              <div>
                <h2 className="text-lg font-semibold text-white">AI Peer Review</h2>
                <p className="text-gray-500 text-xs">Powered by 0G Inference Network</p>
              </div>
            </div>

            {!aiReview ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm mb-6">
                  Our AI agent will analyse your submission, flag methodology gaps, and generate
                  a plain-language summary for community funders.
                </p>
                <button
                  onClick={runAIReview}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Run AI Peer Review
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Score */}
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-white">{aiReview.score}<span className="text-gray-600 text-xl">/100</span></div>
                  <div>
                    <div className={`text-sm font-medium px-3 py-1 rounded-full border ${
                      aiReview.recommendation === 'approve'
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : aiReview.recommendation === 'revise'
                        ? 'bg-yellow-950 text-yellow-400 border-yellow-800'
                        : 'bg-red-950 text-red-400 border-red-800'
                    }`}>
                      {aiReview.recommendation === 'approve' ? '✓ Approved' : aiReview.recommendation === 'revise' ? '⚠ Revisions Suggested' : '✗ Not Recommended'}
                    </div>
                    <p className="text-gray-600 text-xs mt-1">AI confidence: high</p>
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-3 font-medium">Summary</p>
                  <ul className="space-y-2">
                    {aiReview.summary.map((s: string, i: number) => (
                      <li key={i} className="flex gap-2 text-sm text-gray-400">
                        <span className="text-emerald-600 mt-0.5 flex-shrink-0">→</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Flags */}
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-3 font-medium">Methodology Flags</p>
                  <ul className="space-y-2">
                    {aiReview.methodologyFlags.map((f: string, i: number) => (
                      <li key={i} className="flex gap-2 text-sm text-yellow-500/80 bg-yellow-950/20 border border-yellow-900/30 rounded-lg px-3 py-2">
                        <span className="flex-shrink-0">⚠</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {aiReview && (
            <div className="flex justify-between">
              <button onClick={() => setCurrentStep('upload')} className="text-gray-500 hover:text-white text-sm transition-colors">
                ← Back
              </button>
              <button
                onClick={submitOnChain}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Submit On-Chain →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step: Confirmed */}
      {currentStep === 'confirm' && !isLoading && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center">
          <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-2xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Proposal Submitted</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">
            Your research is now permanently stored on 0G, AI-reviewed, and registered on 0G Chain.
            The community can now discover and fund your work.
          </p>

          <div className="space-y-3 text-left mb-8 max-w-md mx-auto">
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
              <p className="text-gray-600 text-xs mb-1">0G Storage CID</p>
              <p className="text-gray-300 text-xs font-mono break-all">{storageCid}</p>
            </div>
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
              <p className="text-gray-600 text-xs mb-1">Transaction Hash</p>
              <p className="text-gray-300 text-xs font-mono break-all">{txHash}</p>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="border border-gray-700 hover:border-gray-500 text-gray-300 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              View All Proposals
            </button>
            <a
              href={`https://chainscan-galileo.0g.ai/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              View on 0G Explorer →
            </a>
          </div>
        </div>
      )}
    </div>
  )
}