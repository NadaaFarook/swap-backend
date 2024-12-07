import z from "zod"

export const createPositionSchema = z.object({
    buyTokenAddress: z.string(),
    networkId: z.string(),
    sellTokenAddress: z.string(),
    buyOnPercentage: z.number(),
    sellOnPercentage: z.number(),
    aiAgentId: z.number()
})