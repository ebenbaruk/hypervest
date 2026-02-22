// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title VestingVault
/// @notice Holds allocated equity tokens for a single employee.
///         Implements cliff + linear vesting. Anyone can call release();
///         tokens always go to the beneficiary.
contract VestingVault {
    IERC20 public immutable token;
    address public immutable beneficiary;
    address public immutable employer;
    uint256 public immutable start;
    uint256 public immutable cliff;
    uint256 public immutable duration;
    uint256 public immutable totalAllocation;

    uint256 public released;

    event TokensReleased(address indexed beneficiary, uint256 amount);

    constructor(
        address _token,
        address _beneficiary,
        address _employer,
        uint256 _cliff,
        uint256 _duration,
        uint256 _totalAllocation
    ) {
        require(_token != address(0), "VestingVault: zero token");
        require(_beneficiary != address(0), "VestingVault: zero beneficiary");
        require(_duration > 0, "VestingVault: zero duration");
        require(_cliff <= _duration, "VestingVault: cliff exceeds duration");
        require(_totalAllocation > 0, "VestingVault: zero allocation");

        token = IERC20(_token);
        beneficiary = _beneficiary;
        employer = _employer;
        start = block.timestamp;
        cliff = _cliff;
        duration = _duration;
        totalAllocation = _totalAllocation;
    }

    /// @notice Cumulative tokens vested as of now.
    function vestedAmount() public view returns (uint256) {
        uint256 elapsed = block.timestamp - start;
        if (elapsed < cliff) return 0;
        if (elapsed >= duration) return totalAllocation;
        return (totalAllocation * elapsed) / duration;
    }

    /// @notice Tokens claimable right now.
    function releasable() public view returns (uint256) {
        return vestedAmount() - released;
    }

    /// @notice All vesting params in one call — used by frontend.
    function vestingSchedule()
        external
        view
        returns (
            address _beneficiary,
            address _employer,
            uint256 _start,
            uint256 _cliff,
            uint256 _duration,
            uint256 _totalAllocation,
            uint256 _released,
            uint256 _vestedAmount,
            uint256 _releasable
        )
    {
        return (
            beneficiary,
            employer,
            start,
            cliff,
            duration,
            totalAllocation,
            released,
            vestedAmount(),
            releasable()
        );
    }

    /// @notice Release all currently claimable tokens to the beneficiary.
    function release() external {
        uint256 amount = releasable();
        require(amount > 0, "VestingVault: nothing to release");
        released += amount;
        emit TokensReleased(beneficiary, amount);
        token.transfer(beneficiary, amount);
    }
}
