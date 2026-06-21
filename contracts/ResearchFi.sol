// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract ResearchFi {
    struct Proposal {
        string cid;
        address researcher;
        string title;
        uint256 timestamp;
    }

    Proposal[] public proposals;

    event ProposalSubmitted(
        uint256 indexed id,
        string cid,
        address indexed researcher,
        string title,
        uint256 timestamp
    );

    function submitProposal(string calldata cid, string calldata title) external {
        uint256 id = proposals.length;
        proposals.push(Proposal(cid, msg.sender, title, block.timestamp));
        emit ProposalSubmitted(id, cid, msg.sender, title, block.timestamp);
    }

    function getProposal(uint256 id) external view returns (Proposal memory) {
        require(id < proposals.length, "Proposal does not exist");
        return proposals[id];
    }

    function totalProposals() external view returns (uint256) {
        return proposals.length;
    }
}