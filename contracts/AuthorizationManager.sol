// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract AuthorizationManager {
    using ECDSA for bytes32;

    address public immutable authorizer;
    mapping(bytes32 => bool) public consumed;

    event AuthorizationConsumed(bytes32 indexed authHash);

    constructor(address _authorizer) {
        require(_authorizer != address(0), "Invalid authorizer");
        authorizer = _authorizer;
    }

    function verifyAuthorization(
        address vault,
        address recipient,
        uint256 amount,
        uint256 nonce,
        bytes calldata signature
    ) external returns (bool) {
        bytes32 authHash = keccak256(
            abi.encode(
                block.chainid,
                vault,
                recipient,
                amount,
                nonce
            )
        );

        require(!consumed[authHash], "Authorization already used");

        bytes32 ethSigned = authHash.toEthSignedMessageHash();
        address signer = ethSigned.recover(signature);

        require(signer == authorizer, "Invalid signature");

        consumed[authHash] = true;

        emit AuthorizationConsumed(authHash);
        return true;
    }
}
