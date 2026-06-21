import { createPublicClient, createWalletClient, custom, http, parseAbi } from 'viem'
import { zeroGTestnet } from './web3'

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`

export const CONTRACT_ABI = parseAbi([
  'function submitProposal(string calldata cid, string calldata title) external',
//   'function getProposal(uint256 id) external view returns (tuple(string cid, address researcher, string title, uint256 timestamp))',
  'function totalProposals() external view returns (uint256)',
  'event ProposalSubmitted(uint256 indexed id, string cid, address indexed researcher, string title, uint256 timestamp)',
])

export const publicClient = createPublicClient({
  chain: zeroGTestnet,
  transport: http(),
})

export function getWalletClient() {
  if (!window.ethereum) throw new Error('MetaMask not found')
  return createWalletClient({
    chain: zeroGTestnet,
    transport: custom(window.ethereum),
  })
}