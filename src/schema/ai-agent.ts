import z from "zod"

export const createAiAgentSchema = z.object({
    name: z.string(),
    ownerAddress: z.string()
})