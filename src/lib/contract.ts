import { createPublicClient, createWalletClient, custom, http, parseAbi } from 'viem'
import { zeroGTestnet } from './web3'

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`

export const CONTRACT_ABI = parseAbi([
  'function submitProposal(string calldata cid, string calldata title, uint256 aiScore) external',
  'function stakeOnProposal(uint256 proposalId) external payable',
  'function getReputation(address researcher) external view returns (uint256 proposalCount, uint256 stakedReceived, uint256 reputation)',
  'function totalProposals() external view returns (uint256)',
  'function getResearcherProposals(address researcher) external view returns (uint256[])',
  'event ProposalSubmitted(uint256 indexed id, string cid, address indexed researcher, string title, uint256 timestamp)',
  'event Staked(uint256 indexed proposalId, address indexed funder, uint256 amount)',
  'function addMilestone(uint256 proposalId, string calldata description, uint256 amount) external',
'function releaseMilestone(uint256 proposalId, uint256 milestoneIndex) external',
'function getMilestones(uint256 proposalId) external view returns (tuple(string description, bool released, uint256 amount)[])',
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