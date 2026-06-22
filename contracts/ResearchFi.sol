// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract ResearchFi {
    struct Proposal {
        string cid;
        address researcher;
        string title;
        uint256 timestamp;
        bool funded;
        uint256 aiScore;
    }

    struct Milestone {
        string description;
        bool released;
        uint256 amount;
    }

    Proposal[] public proposals;
    mapping(uint256 => Milestone[]) public milestones;
    mapping(address => uint256[]) public researcherProposals;
    mapping(address => uint256) public totalStaked;

    event ProposalSubmitted(
        uint256 indexed id,
        string cid,
        address indexed researcher,
        string title,
        uint256 timestamp
    );

    event MilestoneReleased(uint256 indexed proposalId, uint256 milestoneIndex);
    event Staked(uint256 indexed proposalId, address indexed funder, uint256 amount);

    function submitProposal(
        string calldata cid,
        string calldata title,
        uint256 aiScore
    ) external {
        uint256 id = proposals.length;
        proposals.push(Proposal(cid, msg.sender, title, block.timestamp, false, aiScore));
        researcherProposals[msg.sender].push(id);
        emit ProposalSubmitted(id, cid, msg.sender, title, block.timestamp);
    }

    function stakeOnProposal(uint256 proposalId) external payable {
        require(proposalId < proposals.length, "Invalid proposal");
        require(msg.value > 0, "Must stake > 0");
        totalStaked[proposals[proposalId].researcher] += msg.value;
        emit Staked(proposalId, msg.sender, msg.value);
    }

    function getReputation(address researcher) external view returns (
        uint256 proposalCount,
        uint256 stakedReceived,
        uint256 reputation
    ) {
        proposalCount = researcherProposals[researcher].length;
        stakedReceived = totalStaked[researcher];
        reputation = (proposalCount * 10) + (stakedReceived / 1e16);
        if (reputation > 100) reputation = 100;
    }

    function getProposal(uint256 id) external view returns (Proposal memory) {
        require(id < proposals.length, "Proposal does not exist");
        return proposals[id];
    }

    function totalProposals() external view returns (uint256) {
        return proposals.length;
    }

    function getResearcherProposals(address researcher) external view returns (uint256[] memory) {
        return researcherProposals[researcher];
    }
}