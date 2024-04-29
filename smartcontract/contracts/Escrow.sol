// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IBaseUltraVerifier {
    function verify(
        bytes calldata _proof,
        bytes32[] calldata _publicInputs
    ) external view returns (bool);
}

contract Escrow {
    enum EscrowStatus {
        Created,
        Locked,
        Released,
        Refunded,
        Dispute
    }

    struct EscrowTransaction {
        address buyer;
        address seller;
        uint256 amount;
        IERC20 tokenAddress;
        EscrowStatus status;
    }
    address verifierContractAddress;
    address public arbitrator;
    uint256 public transactionCounter;
    uint256 proofCount;
    mapping(bytes => bool) proofLists;
    mapping(uint256 => EscrowTransaction) private escrowTransactions;

    event EscrowCreated(
        uint256 indexed transactionId,
        address indexed buyer,
        address indexed seller,
        uint256 amount
    );

    event EscrowLocked(uint256 indexed transactionId);
    event EscrowReleased(uint256 indexed transactionId);

    error ValidationError(string _reason);
    error OperationError(string _reason);

    constructor(address _verifierContractAddress) {
        arbitrator = msg.sender;
        transactionCounter = 0;
        verifierContractAddress = _verifierContractAddress;
    }

    function createEscrow(
        address buyer,
        uint256 amount,
        IERC20 tokenAddress
    ) external payable returns (uint256 txnId) {
        address seller = msg.sender;
        uint256 transactionId = transactionCounter;
        transactionCounter++;

        bool success = IERC20(tokenAddress).transferFrom(seller, buyer, amount);

        if (success) {
            escrowTransactions[transactionId] = EscrowTransaction({
                buyer: buyer,
                seller: seller,
                amount: msg.value,
                tokenAddress: tokenAddress,
                status: EscrowStatus.Created
            });

            txnId = transactionId;

            emit EscrowCreated(transactionId, buyer, seller, msg.value);
        } else {
            revert OperationError("Failed to transfer token into the contract");
        }
    }

    function releaseEscrow(
        uint256 transactionId,
        bytes calldata _proof,
        bytes32[] calldata _publicInputs
    ) external {
        inStatus(transactionId, EscrowStatus.Locked);

        // address seller = payable(escrowTransactions[transactionId].seller);
        address buyer = payable(escrowTransactions[transactionId].buyer);
        uint256 amount = escrowTransactions[transactionId].amount;

        if (buyer != msg.sender) {
            revert ValidationError("Escrow is NOT ASSIGNED to you");
        }
        if (escrowTransactions[transactionId].status != EscrowStatus.Locked) {
            revert ValidationError("Escrow is LOCKED");
        }
        if (escrowTransactions[transactionId].status != EscrowStatus.Released) {
            revert ValidationError("Escrow has been RELEASED");
        }
        if (proofLists[_proof] != true) {
            revert ValidationError("Escrow PROOF has been USED");
        }

        bool verifyResult = IBaseUltraVerifier(verifierContractAddress).verify(
            _proof,
            _publicInputs
        );

        proofLists[_proof] = true;
        proofCount++;

        IERC20 tokenAddress = escrowTransactions[transactionId].tokenAddress;

        if (verifyResult) {
            IERC20(tokenAddress).transfer(buyer, amount);

            emit EscrowReleased(transactionId);
        } else {
            revert OperationError("Verification of proof and inputs failed");
        }
    }

    function onlyArbitrator() internal view {
        if (msg.sender != arbitrator) {
            revert ValidationError(
                "Only the arbitrator can perform this action."
            );
        }
    }

    function inStatus(uint256 transactionId, EscrowStatus status) internal view {
        if (escrowTransactions[transactionId].status != status) {
            revert ValidationError("Transaction is not in the required state.");
        }
    }

    function lockEscrow(uint256 transactionId) external {
        onlyArbitrator();
        inStatus(transactionId, EscrowStatus.Locked);

        escrowTransactions[transactionId].status = EscrowStatus.Locked;

        emit EscrowLocked(transactionId);
    }

    function getEscrowStatus(
        uint256 transactionId
    ) external view returns (EscrowStatus) {
        return escrowTransactions[transactionId].status;
    }

}
