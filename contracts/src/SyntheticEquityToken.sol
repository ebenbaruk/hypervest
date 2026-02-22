// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title SyntheticEquityToken (SBT)
/// @notice Non-transferable ERC20 representing vested equity.
///         Only minting and vault-to-employee releases are allowed.
///         All other transfers revert — true Soulbound Token.
contract SyntheticEquityToken is ERC20, Ownable {
    /// @dev Whitelisted VestingVault contracts that may transfer tokens.
    mapping(address => bool) public vestingVaults;

    event VestingVaultAdded(address indexed vault);

    constructor(
        string memory name,
        string memory symbol,
        address initialOwner
    ) ERC20(name, symbol) Ownable(initialOwner) {}

    /// @notice Register a VestingVault so it can release tokens to beneficiaries.
    function addVestingVault(address vault) external onlyOwner {
        require(vault != address(0), "SyntheticEquityToken: zero address");
        vestingVaults[vault] = true;
        emit VestingVaultAdded(vault);
    }

    /// @notice Mint tokens into a VestingVault. Only the owner (factory) can mint.
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /// @dev OZ v5 unified transfer hook — enforces soulbound constraint.
    function _update(address from, address to, uint256 value) internal override {
        // Allow: minting
        if (from == address(0)) {
            super._update(from, to, value);
            return;
        }
        // Allow: whitelisted vault releasing to beneficiary
        if (vestingVaults[from]) {
            super._update(from, to, value);
            return;
        }
        // Block: all other transfers
        revert("SoulboundToken: transfers are disabled");
    }
}
