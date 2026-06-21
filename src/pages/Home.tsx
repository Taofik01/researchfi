import type { Proposal } from '../types'
import type { Page } from '../App'
import ProposalCard from '../components/ProposalCard'

interface Props {
  proposals: Proposal[]
  onSelectProposal: (p: Proposal) => void
  setPage: (page: Page) => void
}

const stats = [
  { label: 'Research Proposals', value: '142', delta: '+12 this week' },
  { label: 'OG Staked', value: '48,200', delta: '≈ $96,400' },
  { label: 'Milestones Released', value: '31', delta: '4 pending' },
  { label: 'AI Reviews Generated', value: '139', delta: '97.9% coverage' },
]

const steps = [
  {
    number: '01',
    title: 'Upload Your Research',
    description: 'Submit your proposal or paper. Files are stored permanently on 0G decentralised storage — censorship-resistant and verifiable by anyone.',
    tag: '0G Storage',
    icon: '📄',
  },
  {
    number: '02',
    title: 'AI Peer Review',
    description: 'An AI agent running on 0G Inference reads your submission, flags methodology gaps, and generates a plain-language summary so non-experts can evaluate what they\'re funding.',
    tag: '0G Inference',
    icon: '🤖',
  },
  {
    number: '03',
    title: 'Community Staking',
    description: 'Token holders stake OG to back studies they believe in. Smart contracts hold funds in escrow and release them automatically when milestones are verified.',
    tag: '0G Chain',
    icon: '💎',
  },
  {
    number: '04',
    title: 'On-Chain Reputation',
    description: 'Every review, stake, and milestone builds your on-chain reputation. Better track record means more weight in future governance decisions.',
    tag: '0G Chain',
    icon: '⭐',
  },
]

const features = [
  {
    title: 'Permanent Storage',
    description: 'Every proposal lives on 0G decentralised storage. No central server, no takedowns, no data loss.',
    icon: '🗄️',
  },
  {
    title: 'Trustless Escrow',
    description: 'Funds are held in smart contracts and released automatically when milestone conditions are met on-chain.',
    icon: '🔐',
  },
  {
    title: 'AI Peer Review',
    description: 'No waiting months for reviewers. Get an objective AI assessment in minutes, flagging real methodology gaps.',
    icon: '🧠',
  },
  {
    title: 'Reputation Layer',
    description: 'Your history as a researcher, reviewer, or funder is public and immutable. Trust is earned, not assumed.',
    icon: '📊',
  },
  {
    title: 'Open Governance',
    description: 'No gatekeepers. Any wallet can fund research. Any researcher can submit. Community decides what gets built.',
    icon: '🌐',
  },
  {
    title: 'Data Availability',
    description: '0G\'s DA layer guarantees your research data is always accessible and verifiable — not just stored.',
    icon: '✅',
  },
]

export default function Home({ proposals, onSelectProposal, setPage }: Props) {
  return (
    <main className="max-w-7xl mx-auto px-6">

      {/* Hero */}
      <section className="py-24 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 to-transparent rounded-3xl pointer-events-none" />
        <div className="relative">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-12 bg-emerald-700" />
            <span className="text-emerald-500 text-xs tracking-widest uppercase font-medium">
              Decentralised Science Infrastructure
            </span>
            <div className="h-px w-12 bg-emerald-700" />
          </div>

          <h1 className="text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
            Science Funding,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
              On-Chain and Open
            </span>
          </h1>

          <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            ResearchFi brings transparent, community-driven funding to scientific research.
            Upload proposals to decentralised storage, get AI peer review, and unlock
            milestone-based funding — all on 0G Chain.
          </p>

          <div className="flex items-center justify-center gap-4 mb-16">
            <button
              onClick={() => setPage('submit')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3.5 rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-emerald-900"
            >
              Submit Research
            </button>
            <button className="border border-gray-700 hover:border-emerald-700 text-gray-300 hover:text-white px-8 py-3.5 rounded-lg font-medium transition-all">
              Read the Docs
            </button>
          </div>

          {/* Tech stack pills */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {['0G Storage', '0G DA Layer', '0G Inference', '0G Chain'].map(tech => (
              <span key={tech} className="text-xs px-3 py-1.5 rounded-full bg-gray-900 border border-gray-800 text-gray-400">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
        {stats.map(s => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-3xl font-bold text-white mb-1">{s.value}</div>
            <div className="text-gray-500 text-sm mb-2">{s.label}</div>
            <div className="text-emerald-500 text-xs">{s.delta}</div>
          </div>
        ))}
      </section>

      {/* How It Works */}
      <section className="mb-24">
        <div className="text-center mb-12">
          <div className="text-emerald-500 text-xs tracking-widest uppercase font-medium mb-3">
            How It Works
          </div>
          <h2 className="text-3xl font-bold text-white">
            From Idea to Funded Research
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            Four steps. Fully on-chain. No intermediaries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((step) => (
            <div key={step.number} className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex gap-5">
              <div className="text-3xl mt-1">{step.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-emerald-600 text-xs font-mono font-bold">{step.number}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-900 text-emerald-400">
                    {step.tag}
                  </span>
                </div>
                <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Active Proposals */}
      <section className="mb-24">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Active Proposals</h2>
            <p className="text-gray-500 text-sm mt-1">Community-submitted research open for funding</p>
          </div>
          <div className="flex gap-2">
            {['All', 'Pending', 'Reviewed', 'Funded'].map(f => (
              <button key={f} className="text-sm px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors">
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {proposals.map(p => (
            <ProposalCard key={p.id} proposal={p} onClick={() => onSelectProposal(p)} />
          ))}
        </div>

        <div className="text-center">
          <button className="text-sm text-gray-500 hover:text-emerald-400 transition-colors border border-gray-800 hover:border-emerald-900 px-6 py-2.5 rounded-lg">
            View all proposals →
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mb-24">
        <div className="text-center mb-12">
          <div className="text-emerald-500 text-xs tracking-widest uppercase font-medium mb-3">
            Why ResearchFi
          </div>
          <h2 className="text-3xl font-bold text-white">
            Infrastructure for Open Science
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map(f => (
            <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-emerald-900 transition-colors">
              <div className="text-2xl mb-4">{f.icon}</div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mb-24">
        <div className="bg-gradient-to-r from-emerald-950 to-gray-900 border border-emerald-900/50 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Fund the Future of Science?
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-8">
            Join 140+ researchers and funders building a more open, transparent,
            and community-driven scientific ecosystem on 0G Chain.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setPage('submit')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3.5 rounded-lg font-medium transition-colors"
            >
              Submit Your Research
            </button>
            <button className="border border-emerald-800 hover:border-emerald-600 text-emerald-400 hover:text-emerald-300 px-8 py-3.5 rounded-lg font-medium transition-colors">
              Explore Proposals
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-10 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">R</span>
            </div>
            <span className="text-gray-400 text-sm">ResearchFi — Built on 0G Labs</span>
          </div>
          <div className="flex gap-6">
            {['Docs', 'GitHub', 'Twitter', '0G Labs'].map(link => (
              <a key={link} href="#" className="text-gray-600 hover:text-gray-400 text-sm transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>

    </main>
  )
}