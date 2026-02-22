"""
Enable or disable big blocks on HyperEVM testnet.

Big blocks (30M gas) are required to deploy contracts.
After deployment, disable them to return to default fast blocks (2M gas).

Usage:
    pip install hyperliquid-python-sdk eth-account
    python scripts/enable_big_blocks.py --enable   # before deploy
    python scripts/enable_big_blocks.py --disable  # after deploy
"""

import argparse
import os
from eth_account import Account
from hyperliquid.exchange import Exchange
from hyperliquid.utils import constants

TESTNET_URL = "https://api.hyperliquid-testnet.xyz"


def main():
    parser = argparse.ArgumentParser(description="Toggle HyperEVM big blocks")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--enable", action="store_true", help="Enable big blocks (before deploy)")
    group.add_argument("--disable", action="store_true", help="Disable big blocks (after deploy)")
    args = parser.parse_args()

    private_key = os.environ.get("PRIVATE_KEY")
    if not private_key:
        raise ValueError("Set PRIVATE_KEY environment variable")

    wallet = Account.from_key(private_key)
    print(f"Wallet: {wallet.address}")

    exchange = Exchange(wallet, base_url=TESTNET_URL)
    enable = args.enable
    result = exchange.use_big_blocks(enable)

    action = "enabled" if enable else "disabled"
    print(f"Big blocks {action}. Response: {result}")


if __name__ == "__main__":
    main()
