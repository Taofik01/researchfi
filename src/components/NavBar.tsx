import type { Page } from '../App'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'

declare global {
  interface Window {
    ethereum?: any
  }
}

interface Props {
  page: Page
  setPage: (page: Page) => void
}

export default function Navbar({ page, setPage }: Props) {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  const handleWallet = async () => {
  if (isConnected) {
    disconnect()
    return
  }

  if (typeof window.ethereum === 'undefined') {
    alert('MetaMask not detected. Please make sure MetaMask is installed and enabled in Chrome.')
    return
  }

  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
    connect({ connector: injected({ target: 'metaMask' }) })
  } catch (err) {
    console.error('Wallet connection failed:', err)
  }
}

  return (
    <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setPage('home')}>
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 bg-emerald-600 rounded-lg rotate-3" />
            <div className="absolute inset-0 bg-emerald-500 rounded-lg -rotate-1 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M8 5V11M5 6.5L8 5L11 6.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div>
            <span className="font-bold text-white text-base tracking-tight">ResearchFi</span>
            <span className="text-gray-600 text-xs ml-2">by 0G</span>
          </div>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setPage('home')}
            className={`text-sm transition-colors ${page === 'home' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Explore
          </button>
          <button
            onClick={() => setPage('submit')}
            className={`text-sm transition-colors ${page === 'submit' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Submit Research
          </button>

          {isConnected && address ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                <span className="text-gray-300 text-xs font-mono">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
              </div>
              <button
                onClick={handleWallet}
                className="text-gray-500 hover:text-red-400 text-xs transition-colors"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={handleWallet}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}