# HyperVest

### *The end of equity vesting scandals. Forever.*

> **Hackin'Dau 2026** — Built on HyperEVM Testnet (Chain ID 998)

---

## The Problem Nobody Talks About

Every year, employees get promised equity. Every year, companies fold, get acquired, or simply gaslight their own workers out of what they earned. The contract is a PDF. The vesting schedule is a spreadsheet. The enforcer is an HR department.

**That's not a system. That's a handshake.**

Startups have raised billions on the promise of equity alignment between founders and employees. Yet the mechanism for enforcing that promise is a Word document stored on someone's laptop. In 2026. On a planet with programmable money.

This is embarrassing. We fixed it.

---

## What HyperVest Does

HyperVest puts equity vesting **entirely on-chain**. No intermediaries. No trust required. No way to rug your employees.

An employer creates a vesting plan in one transaction. A smart contract vault holds the tokens. The math is immutable. Once the cliff passes, tokens unlock linearly — automatically, transparently, unstoppably. The employee claims what they earned. **Nobody can take it back.**

And because equity shouldn't be a tradeable casino chip, the tokens are **Soulbound** — non-transferable until properly vested and claimed. You can't dump your unvested equity.

---

## Why HyperEVM

We didn't pick HyperEVM because it was easy. We picked it because it's the only chain fast enough to make real-time vesting feel like a product instead of a proof of concept.

Sub-second finality. Native liquidity from Hyperliquid's perpetual DEX. A growing ecosystem that actually ships. HyperVest is a native HyperEVM application — not a port, not an afterthought.

The live countdown ticking on the employee dashboard? That's not a trick. That's a 1-second client-side timer synced to an immutable on-chain schedule. **The contract is the source of truth.**

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    One transaction from the employer            │
│                                                                 │
│   VestingFactory.createVesting(employee, cliff, duration, amt)  │
│         │                                                       │
│         ├── 1. Deploys a VestingVault (one per grant)           │
│         ├── 2. Whitelists the vault on the SBT contract         │
│         └── 3. Mints tokens directly into the vault             │
│                         │                                       │
│              Tokens are locked. Math is running.               │
└─────────────────────────────────────────────────────────────────┘

SyntheticEquityToken (ERC20 Soulbound)
  — Non-transferable by default (OpenZeppelin v5 _update hook)
  — Only whitelisted vault → employee transfers allowed
  — Once claimed: yours forever, but you cannot sell it

VestingVault (immutable, one per grant)
  — Cliff period: zero vesting until elapsed
  — Linear vesting after cliff, capped at total allocation
  — release() is permissionless: anyone can trigger the claim
  — vestingSchedule() returns everything in a single RPC call
```

**3 contracts. 234 lines of Solidity. 7 passing tests. Zero trust assumptions.**

---

## Live Demo

> Contracts are deployed on HyperEVM Testnet. Everything below happens on-chain.

### Employer side — `/admin`

1. Select the **Employer** role
2. Set an employee address, cliff (e.g. 60s), duration (e.g. 300s), and allocation
3. Hit **Create Vesting Plan**
4. One transaction → vault deployed, tokens locked, schedule running

### Employee side — `/employee`

1. Select the **Employee** role
2. Enter the employer address
3. Watch the live countdown tick in real time
4. Once past cliff: hit **Claim** — tokens land in the wallet instantly
5. Try to transfer them to another wallet → transaction reverts

**"SoulboundToken: transfers are disabled"**

That's not an error message. That's a policy.

---

## Technical Stack

| Layer | Technology |
|---|---|
| Smart contracts | Solidity 0.8.28 + OpenZeppelin v5 |
| Testing | Foundry — 7 tests, all green |
| Frontend | Next.js 16, React 19, TypeScript |
| Web3 | viem 2.46.2, wagmi 3, RainbowKit |
| Chain | HyperEVM Testnet — Chain ID 998 |
| Styling | Tailwind CSS v4 |

---

## Run It Yourself

```bash
# 1. Clone and install
git clone <repo>
cd frontend && npm install

# 2. Fill frontend/.env.local
NEXT_PUBLIC_TOKEN_ADDRESS=0x604038CBEA30e8058e8a6fACC177898aAca59867
NEXT_PUBLIC_FACTORY_ADDRESS=0x091e807d200d1141cFFBBEE66e6F30C64F7Cd526
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<your_id>

# 3. Start
npm run dev
```

Open http://localhost:3000 — demo wallets are pre-loaded, no MetaMask required.

---

## Test the Contracts

```bash
cd contracts
forge test -vvv
```

```
[PASS] test_VaultDeployedAndRegistered()
[PASS] test_NothingVestsDuringCliff()
[PASS] test_LinearVestingAfterCliff()
[PASS] test_FullyVestedAfterDuration()
[PASS] test_ReleaseTransfersToBeneficiary()
[PASS] test_EmployeeCannotTransfer()
[PASS] test_MultipleVestingPlansForSameEmployee()

Suite result: ok. 7 passed; 0 failed
```

---

## Deploy Fresh Contracts

```bash
# Enable HyperEVM big blocks (needed for contract deployment)
PRIVATE_KEY=0x... python scripts/enable_big_blocks.py --enable

# Deploy
cd contracts
forge script script/Deploy.s.sol:Deploy \
  --rpc-url https://rpc.hyperliquid-testnet.xyz/evm \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --legacy

# Disable big blocks
PRIVATE_KEY=0x... python scripts/enable_big_blocks.py --disable
```

---

## What Makes This Different

Most hackathon vesting projects are a Gnosis Safe with a time-lock. We built the entire primitive from scratch:

- **Multiple grants per employee** — annual refreshes, milestone bonuses, all tracked independently
- **Permissionless release** — the employer, employee, or anyone can trigger `release()`. The math is the authorization.
- **Soulbound by design** — equity is earned, not traded. The token contract enforces this at the EVM level, not in a terms-of-service
- **Single RPC call for the full schedule** — `vestingSchedule()` returns all 9 parameters in one call; no chatty multi-call patterns
- **Real-time UI without hammering the RPC** — 1-second client-side interpolation + 30-second on-chain sync

---

## Layer 2: What You Can Build on Top

HyperVest is a **primitive**. The vesting contract is not the product — it's the foundation. Because the on-chain token mathematically proves *"this employee owns X equity in startup Y, unlocking on this schedule"*, an entirely new financial layer becomes possible. One that doesn't exist anywhere in traditional finance.

Here's what gets unlocked.

---

### A — Collateralized Lending Against Unvested Equity

> *"I have $100k vesting next year. I need $20k today."*

A lending protocol reads the vesting vault directly. No credit score. No bank. No application. The smart contract is the proof of collateral. The employee borrows USDC against their locked tokens — and on Hyperliquid, that borrowed USDC can be deployed as initial margin to trade perps. **Your equity becomes your trading account.**

The liquidation logic is clean: if the startup fails and the tokens go to zero, the lender's collateral evaporates — priced in by the LTV ratio. If the startup moons, the employee repays and reclaims full ownership. Trustless. Bilateral. Instant.

---

### B — OTC Vesting Factoring (The Lawyers Are Crying)

> *"I need cash now. I'll take a discount."*

The employee can't transfer their SBT tokens — they're soulbound. But they can sign a transaction that says: *"I assign the right to claim my next 1,000 vested tokens to this address, in exchange for 800 USDC right now."*

That's invoice factoring. On-chain. With no lawyers, no notaries, no 30-day wire transfer delays, and no middleman taking 15%. A secondary OTC market for private startup equity — accessible to any liquidity provider in the world, settling in seconds.

The discount rate becomes a real-time signal of how the market values a startup's survival odds.

---

### C — Synthetic Pre-IPO Perpetuals (The Hyperliquid Native Play)

> *"Let traders speculate on whether your startup is going to make it."*

HyperVest mints a **$ACME-PERP** market. The underlying is the startup's implied valuation, derived from on-chain vesting activity and OTC deal flow. Traders go long or short on private companies — years before any IPO.

For the employee, this is a hedge. **They can short their own company** to offset concentration risk while holding their full equity position. For the ecosystem, this is price discovery on private markets that has never existed before. For Hyperliquid, this is a new class of perpetual that no other exchange can offer — because no other chain has the vesting primitive underneath.

This is not DeFi cosplay. This is the Bloomberg terminal for startup equity, running on-chain.

---

### D — Talent Index Vaults (The Diversification Play)

> *"What if 9 startups fail but one becomes the next OpenAI?"*

Employees from different companies pool their vesting rights into a shared vault. The vault issues a single token — call it `$AI-TALENT-2026`. One token represents a fractional claim across 50 startup equity positions simultaneously.

If 49 fail, the one that wins covers everyone. It's diversification across the private market — a thing that today requires being a VC fund with $100M AUM and a Sequoia referral. On HyperVest, any employee with a vesting schedule can access it.

This is the ultimate hedge against the startup lottery. A decentralized index fund for human capital.

---

### The Stack Vision

```
Layer 2 — DeFi primitives (lending, OTC, perps, vaults)
    └── reads from ↓

Layer 1 — HyperVest (on-chain vesting, SBT equity tokens)
    └── runs on ↓

HyperEVM — the only chain with the speed and liquidity to make this real
```

HyperVest does not try to build all of Layer 2 in a hackathon weekend. It builds the one thing that makes Layer 2 possible: **a credible, immutable, on-chain proof of equity ownership.**

Everything else is composability. That's the whole point.

---

## Block Explorer

https://testnet.purrsec.com

---

*Built for Hackin'Dau 2026. Deployed on HyperEVM. Tested on mainnet trust issues.*
