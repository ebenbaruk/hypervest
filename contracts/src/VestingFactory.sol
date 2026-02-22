// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {VestingVault} from "./VestingVault.sol";
import {SyntheticEquityToken} from "./SyntheticEquityToken.sol";

/// @title VestingFactory
/// @notice Deployed once. Employers call createVesting() to issue equity.
///         Multiple vesting plans can be created for the same employee.
contract VestingFactory {
    SyntheticEquityToken public immutable token;

    /// @dev employer => employee => list of vaults (one per grant)
    mapping(address => mapping(address => address[])) public beneficiaryVaults;

    address[] public allVaults;

    event VestingCreated(
        address indexed employer,
        address indexed beneficiary,
        address vault,
        uint256 cliff,
        uint256 duration,
        uint256 totalAllocation
    );

    constructor(address _token) {
        require(_token != address(0), "VestingFactory: zero token");
        token = SyntheticEquityToken(_token);
    }

    /// @notice Create a vesting plan for an employee.
    ///         Multiple plans per employee are allowed (e.g. annual grants).
    function createVesting(
        address beneficiary,
        uint256 cliff,
        uint256 duration,
        uint256 totalAlloc
    ) external returns (address vault) {
        require(beneficiary != address(0), "VestingFactory: zero beneficiary");

        // 1. Deploy vault
        VestingVault newVault = new VestingVault(
            address(token),
            beneficiary,
            msg.sender,
            cliff,
            duration,
            totalAlloc
        );
        vault = address(newVault);

        // 2. Whitelist vault BEFORE minting
        token.addVestingVault(vault);

        // 3. Mint tokens into the vault
        token.mint(vault, totalAlloc);

        // 4. Record
        beneficiaryVaults[msg.sender][beneficiary].push(vault);
        allVaults.push(vault);

        emit VestingCreated(msg.sender, beneficiary, vault, cliff, duration, totalAlloc);
    }

    /// @notice Get all vaults for an employee under a given employer.
    function getVaultsForEmployee(
        address employer,
        address employee
    ) external view returns (address[] memory) {
        return beneficiaryVaults[employer][employee];
    }

    /// @notice Get the latest vault for an employee (backwards compat).
    function getVaultForEmployee(
        address employer,
        address employee
    ) external view returns (address) {
        address[] memory vaults = beneficiaryVaults[employer][employee];
        if (vaults.length == 0) return address(0);
        return vaults[vaults.length - 1];
    }

    function vaultCount() external view returns (uint256) {
        return allVaults.length;
    }
}
