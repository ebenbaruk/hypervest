// Deployed contract addresses — fill from forge script output
export const TOKEN_ADDRESS =
  (process.env.NEXT_PUBLIC_TOKEN_ADDRESS as `0x${string}`) ?? "0x";
export const FACTORY_ADDRESS =
  (process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`) ?? "0x";

export const FACTORY_ABI = [
  {
    type: "function",
    name: "createVesting",
    inputs: [
      { name: "beneficiary", type: "address" },
      { name: "cliff", type: "uint256" },
      { name: "duration", type: "uint256" },
      { name: "totalAlloc", type: "uint256" },
    ],
    outputs: [{ name: "vault", type: "address" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getVaultForEmployee",
    inputs: [
      { name: "employer", type: "address" },
      { name: "employee", type: "address" },
    ],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getVaultsForEmployee",
    inputs: [
      { name: "employer", type: "address" },
      { name: "employee", type: "address" },
    ],
    outputs: [{ name: "", type: "address[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "vaultCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "VestingCreated",
    inputs: [
      { name: "employer", type: "address", indexed: true },
      { name: "beneficiary", type: "address", indexed: true },
      { name: "vault", type: "address", indexed: false },
      { name: "cliff", type: "uint256", indexed: false },
      { name: "duration", type: "uint256", indexed: false },
      { name: "totalAllocation", type: "uint256", indexed: false },
    ],
  },
] as const;

export const VAULT_ABI = [
  {
    type: "function",
    name: "vestingSchedule",
    inputs: [],
    outputs: [
      { name: "_beneficiary", type: "address" },
      { name: "_employer", type: "address" },
      { name: "_start", type: "uint256" },
      { name: "_cliff", type: "uint256" },
      { name: "_duration", type: "uint256" },
      { name: "_totalAllocation", type: "uint256" },
      { name: "_released", type: "uint256" },
      { name: "_vestedAmount", type: "uint256" },
      { name: "_releasable", type: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "release",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "releasable",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "TokensReleased",
    inputs: [
      { name: "beneficiary", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
] as const;

export const TOKEN_ABI = [
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "symbol",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
] as const;
