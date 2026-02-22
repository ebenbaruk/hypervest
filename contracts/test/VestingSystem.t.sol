// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {SyntheticEquityToken} from "../src/SyntheticEquityToken.sol";
import {VestingVault} from "../src/VestingVault.sol";
import {VestingFactory} from "../src/VestingFactory.sol";

contract VestingSystemTest is Test {
    SyntheticEquityToken internal token;
    VestingFactory internal factory;

    address internal employer = makeAddr("employer");
    address internal employee = makeAddr("employee");
    address internal stranger = makeAddr("stranger");

    uint256 internal constant CLIFF    = 30 days;
    uint256 internal constant DURATION = 365 days;
    uint256 internal constant ALLOC    = 100_000e18;

    VestingVault internal vault;

    function setUp() public {
        token = new SyntheticEquityToken("HyperVest Equity", "HVE", address(this));
        factory = new VestingFactory(address(token));
        token.transferOwnership(address(factory));

        vm.prank(employer);
        vault = VestingVault(factory.createVesting(employee, CLIFF, DURATION, ALLOC));
    }

    // 1. Vault deployed and registered
    function test_VaultDeployedAndRegistered() public view {
        address[] memory vaults = factory.getVaultsForEmployee(employer, employee);
        assertEq(vaults.length, 1);
        assertEq(vaults[0], address(vault));
        assertTrue(token.vestingVaults(address(vault)));
        assertEq(token.balanceOf(address(vault)), ALLOC);
    }

    // 2. Nothing vests during cliff
    function test_NothingVestsDuringCliff() public {
        vm.warp(block.timestamp + CLIFF - 1);
        assertEq(vault.vestedAmount(), 0);
        assertEq(vault.releasable(), 0);
    }

    // 3. Linear vesting after cliff
    function test_LinearVestingAfterCliff() public {
        vm.warp(block.timestamp + DURATION / 2);
        uint256 expected = (ALLOC * (DURATION / 2)) / DURATION;
        assertApproxEqAbs(vault.vestedAmount(), expected, 1);
        assertGt(vault.vestedAmount(), 0);
    }

    // 4. Fully vested after duration
    function test_FullyVestedAfterDuration() public {
        vm.warp(block.timestamp + DURATION + 1);
        assertEq(vault.vestedAmount(), ALLOC);
        assertEq(vault.releasable(), ALLOC);
    }

    // 5. release() transfers tokens to beneficiary
    function test_ReleaseTransfersToBeneficiary() public {
        vm.warp(block.timestamp + CLIFF + 1 days);
        uint256 claimable = vault.releasable();
        assertGt(claimable, 0);

        vm.prank(stranger);
        vault.release();

        assertEq(token.balanceOf(employee), claimable);
        assertEq(vault.released(), claimable);
    }

    // 6. Employee cannot transfer tokens (soulbound)
    function test_EmployeeCannotTransfer() public {
        vm.warp(block.timestamp + DURATION);
        vault.release();
        assertGt(token.balanceOf(employee), 0);

        vm.prank(employee);
        vm.expectRevert("SoulboundToken: transfers are disabled");
        token.transfer(stranger, 1);
    }

    // 7. Employer can create multiple vesting plans for the same employee
    function test_MultipleVestingPlansForSameEmployee() public {
        vm.prank(employer);
        address vault2 = factory.createVesting(employee, CLIFF, DURATION, ALLOC);

        address[] memory vaults = factory.getVaultsForEmployee(employer, employee);
        assertEq(vaults.length, 2);
        assertEq(vaults[1], vault2);

        // Each vault holds its own allocation
        assertEq(token.balanceOf(vault2), ALLOC);
        assertEq(factory.vaultCount(), 2);
    }
}
