# HyperVest

### *Programmable Equity. Not just vesting on a blockchain — equity that unlocks when value is created.*

> **Hackin'Dau 2026** — Built on HyperEVM Testnet (Chain ID 998)

---

## The Broken System Nobody Wants to Fix

The startup equity system is worth $13 trillion. It runs on PDFs, spreadsheets, and lawyers who bill by the hour.

Here are the three ways it fails — every single day.

### 1. It costs a fortune and takes forever

Issuing stock-options or BSPCEs costs thousands in legal fees. Every. Single. Time. Managing a cap table with employees across 5 countries means a new lawyer in each jurisdiction, a different legal framework, months of back-and-forth — just to give someone shares they earned.

A developer in Lagos. A designer in Seoul. A founding engineer in Paris. Today, giving any of them real equity is either legally impossible or prohibitively expensive. So companies give up. They pay in cash instead. The alignment disappears.

**The legal industry has made itself the mandatory middleware for employee ownership. We remove it.**

### 2. It rewards presence, not performance

The standard cliff model — 1 year cliff, 4 years total — was invented for a world where showing up was enough. Today it's a slow-motion disaster.

An employee can coast for 11 months, hit their cliff, grab 25% of their equity, and quit on day 366. The company is out talent and capital. The team is demoralised. The cap table is diluted for nothing.

**Vesting based on time passing is skeuomorphic. It's the old world wearing a blockchain costume.**

### 3. Employees never "feel" their equity

The agreement gets signed. Then it goes in a drawer. The employee doesn't see it, doesn't feel it accumulating, doesn't connect their daily work to the value they're building. Equity becomes a vague promise that might pay off in 7 years. Motivation flatlines.

---

## The Market

| | |
|---|---|
| **$13 000 000 000 000** | Global private equity market — frozen, illiquid, managed with 1990s technology |
| **~$30 000 / year** | Average legal spend per startup just to manage equity grants |
| **73%** | Startups that now hire internationally — and face a legal wall when trying to give them ownership |

The entire private equity market is waiting to be programmable. Nobody has done it right yet.

---

## HyperVest: Programmable Equity

We built the infrastructure to make equity smart. Not just time-locked — **performance-driven**.

### What that means in practice

**Company-level vesting acceleration**
The startup hits its MRR target. Stripe confirms it on-chain via oracle. The smart contract automatically accelerates vesting for the entire team. Real profit sharing — in real time. Not at the next board meeting. Not in the next annual review. Now.

**Individual KPI triggers**
A developer closes a critical bug. A sales rep signs a major contract. A GitHub commit ships a key feature. The smart contract detects the event and drops an equity bonus directly into their wallet. No HR form. No manager approval. The code is the judge.

**Full transparency, always**
Every employee sees their equity accumulating in real time. Every token that has unlocked, every token still locked, every second ticking toward the next release. The dashboard doesn't lie. It can't — it's reading directly from the chain.

This is what a16z meant when they wrote: *"Tokenization is often skeuomorphic — anchored in how assets work today, and not taking advantage of crypto-native features."*

**Putting time-based vesting on a blockchain is skeuomorphic. Linking equity to real-time performance via smart contracts is crypto-native.**

---

## Live Demo

> Contracts are deployed on HyperEVM Testnet. Everything below is real and on-chain.

### Employer side — `/admin`

1. Select the **Employer** role — no wallet setup required
2. Set a beneficiary address, cliff period, total duration, and token allocation
3. Hit **Create Vesting Plan** — one transaction
4. A vault is deployed, tokens are locked, the schedule is running

*In production: the cliff and duration parameters would be fed by oracle data — MRR growth, GitHub activity, revenue milestones. The smart contract interface is already designed for it.*

### Employee side — `/employee`

1. Select the **Employee** role
2. Enter the employer address
3. Watch the equity unlock **live** — the counter ticks every second
4. Once past cliff: hit **Claim** — tokens land in the wallet instantly
5. Try to transfer them to another address → the transaction reverts

**"SoulboundToken: transfers are disabled"**

That's not an error. That's the policy. Equity is earned, not traded.

---

## Why HyperEVM

Performance-based vesting isn't a batch job. It's a continuous stream of events — oracle price feeds, GitHub webhooks, revenue APIs — each one potentially triggering a smart contract execution.

For that, you need infrastructure that is:
- Fast enough to handle real-time event streams without users waiting
- Cheap enough that microtransactions (small equity releases) don't cost more in gas than they're worth
- Liquid enough that the equity tokens are useful the moment they land

HyperEVM is the only chain where all three are true simultaneously. Sub-second finality. Minimal gas costs. Native access to Hyperliquid's perpetual orderbook — which becomes the settlement layer the moment this equity needs to move.

HyperVest is not a port of an Ethereum project. It is a native HyperEVM application, designed from the first line of code for this infrastructure.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                     Employer: one transaction                        │
│                                                                      │
│  VestingFactory.createVesting(employee, cliff, duration, allocation) │
│        │                                                             │
│        ├── 1. Deploys a VestingVault (one per grant)                 │
│        ├── 2. Whitelists the vault on the SBT contract               │
│        └── 3. Mints tokens directly into the vault                   │
│                          │                                           │
│    Tokens are locked. Math is running. Performance decides the rest. │
└──────────────────────────────────────────────────────────────────────┘

SyntheticEquityToken (ERC20 Soulbound)
  — Non-transferable by default (OpenZeppelin v5 _update hook)
  — Only whitelisted vault → employee transfers are allowed
  — Once claimed: yours permanently, non-transferable

VestingVault (immutable, one per grant)
  — Cliff period: zero unlocking until condition is met
  — Linear release after cliff, capped at total allocation
  — release() is permissionless: anyone can trigger a claim
  — vestingSchedule() returns all parameters in a single RPC call
  — Architecture ready for oracle-driven cliff and duration parameters
```

**3 contracts. 234 lines of Solidity. 7 passing tests. Zero trust assumptions.**

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
git clone https://github.com/ebenbaruk/hypervest
cd frontend && npm install

# 2. Copy and fill the env file
cp .env.local.example .env.local
# Add your WalletConnect project ID (free at cloud.walletconnect.com)
# Contract addresses are pre-filled — contracts are already deployed

# 3. Start
npm run dev
```

Open http://localhost:3000 — demo wallets are pre-loaded, no MetaMask needed.

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
# Enable HyperEVM big blocks (required for contract deployment)
PRIVATE_KEY=0x... python scripts/enable_big_blocks.py --enable

# Deploy
cd contracts
forge script script/Deploy.s.sol:Deploy \
  --rpc-url https://rpcs.chain.link/hyperevm/testnet \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --legacy

# Disable big blocks
PRIVATE_KEY=0x... python scripts/enable_big_blocks.py --disable
```

---

## What This Unlocks Tomorrow

HyperVest is Layer 1 of a larger stack. Because the vesting contract mathematically proves on-chain that *"this contributor holds X equity in company Y, unlocking on this schedule"*, a new financial layer becomes composable on top.

**Collateralized lending** — borrow USDC against unvested equity, deploy it as margin on Hyperliquid's orderbook.

**OTC factoring** — assign future claim rights to a liquidity provider for immediate cash, no lawyers, settling in seconds.

**Synthetic pre-IPO perpetuals** — let the market go long or short on private companies years before any IPO. Employees hedge their concentration risk. Traders get a new asset class. Hyperliquid gets a perpetual product that no other exchange can list — because no other chain has the primitive underneath.

**Talent index vaults** — pool vesting rights across companies into a single diversified token. The index fund for human capital, accessible to any contributor worldwide.

```
Layer 2 — DeFi (lending, OTC, perps, index vaults)
    └── reads from ↓

Layer 1 — HyperVest (programmable equity, SBT tokens)
    └── runs on ↓

HyperEVM — speed + liquidity to make real-time equity real
```

---

## Block Explorer

https://testnet.purrsec.com

---

*Built for Hackin'Dau 2026. Deployed on HyperEVM. Replacing lawyers with smart contracts since day one.*
