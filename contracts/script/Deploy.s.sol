// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {SyntheticEquityToken} from "../src/SyntheticEquityToken.sol";
import {VestingFactory} from "../src/VestingFactory.sol";

/// @title Deploy
/// @notice Deploys SyntheticEquityToken + VestingFactory, then transfers
///         token ownership to the factory.
///
/// Run:
///   forge script script/Deploy.s.sol:Deploy \
///     --rpc-url $RPC_URL \
///     --private-key $PRIVATE_KEY \
///     --broadcast \
///     --legacy
contract Deploy is Script {
    function run() external {
        address deployer = vm.envAddress("DEPLOYER_ADDRESS");

        vm.startBroadcast();

        // 1. Deploy token
        SyntheticEquityToken token = new SyntheticEquityToken(
            "HyperVest Equity",
            "HVE",
            deployer
        );
        console.log("SyntheticEquityToken:", address(token));

        // 2. Deploy factory
        VestingFactory factory = new VestingFactory(address(token));
        console.log("VestingFactory:", address(factory));

        // 3. Transfer ownership to factory (CRITICAL — without this factory cannot mint)
        token.transferOwnership(address(factory));
        console.log("Token ownership transferred to factory");

        vm.stopBroadcast();

        console.log("---");
        console.log("Copy to frontend/.env.local:");
        console.log("NEXT_PUBLIC_TOKEN_ADDRESS=", vm.toString(address(token)));
        console.log("NEXT_PUBLIC_FACTORY_ADDRESS=", vm.toString(address(factory)));
    }
}
