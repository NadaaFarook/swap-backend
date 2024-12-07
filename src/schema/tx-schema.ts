import z from "zod";

export const createTxSchema = z.object({
    userAddress: z.string(),
    fee: z.string(),
    inputTokenAddress: z.string(),
    outputTokenAddress: z.string(),
    inputAmount: z.string(),
    outputAmount: z.string(),
    transactionHash: z.string(),
    poolId: z.number(),
});
