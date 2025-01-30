import { z } from 'zod';

const TimeRange = z.object({
  start: z.number().nullable(),
  end: z.number().nullable(),
});

const TokenFilter = z.object({
  tokenAddress: z.string(),
  amountLessThan: z.number().nullable(),
  amountGreaterThan: z.number().nullable(),
  direction: z.enum(['sent', 'received']).nullable(),
});

const FeeFilter = z.object({
  feeGreaterThan: z.number().nullable(),
  feeLessThan: z.number().nullable(),
});

const InstructionCountFilter = z.object({
  greaterThan: z.number().nullable(),
  lessThan: z.number().nullable(),
});

const FilterSchema = z.object({
  account: z.string(),
  types: z.array(z.enum(['SOLTransfer', 'TokenTransfer', 'NFTMint', 'Staking'])).nullable(),
  programs: z.array(z.string()).nullable(),
  timeRange: TimeRange.nullable(),
  tokenFilter: z.array(TokenFilter).nullable(),
  status: z.enum(['successful', 'failed']).nullable(),
  memo: z.string().nullable(),
  feeFilter: FeeFilter.nullable(),
  instructionCountFilter: InstructionCountFilter.nullable(),
  txNum: z.number().nullable(),
});

export { FilterSchema };

export type TimeRange = {
  start: number | null;  // Unix timestamp (seconds since the epoch), e.g., 1672531200
  end: number | null;    // Unix timestamp (seconds since the epoch), e.g., 1672617600
};

export type TokenFilter = {
  tokenAddress: string;          // Token mint address
  amountLessThan: number | null;      // Filter by amount less than specified value
  amountGreaterThan: number | null;   // Filter by amount greater than specified value
  direction: 'sent' | 'received' | null; // Filter by transaction direction
};

export type FeeFilter = {
  feeGreaterThan: number | null;      // Filter by transactions with fees greater than the specified value
  feeLessThan: number | null;         // Filter by transactions with fees less than the specified value
};

export type InstructionCountFilter = {
  greaterThan: number | null;          // Filter by transactions with more than the specified number of instructions
  lessThan: number | null;             // Filter by transactions with less than the specified number of instructions
};

export type Filter = {
  account: string; // Account serched for
  types: ('SOLTransfer' | 'TokenTransfer' | 'NFTMint' | 'Staking')[] | null; // Transaction types currently supported
  programs: string[] | null;             // Program ID (e.g., "TOKEN_2022_PROGRAM_ID")
  timeRange: TimeRange | null;       // Time range filter
  tokenFilter: TokenFilter[] | null;  // Token-related filter (e.g., amount, token address)
  status: 'successful' | 'failed' | null; // Status filter
  memo: string | null;                // Filter by memo text
  feeFilter: FeeFilter | null;       // Fee-related filter
  instructionCountFilter: InstructionCountFilter | null; // Instruction count filter
  txNum: number | null;              // Number of transactions returned
};
