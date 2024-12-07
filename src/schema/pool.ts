import z from "zod";

export const createPoolSchema = z.object({
    userAddress: z.string(),
    t1TokenName: z.string(),
    t2TokenName: z.string(),
    t1TokenAddress: z.string(),
    t2TokenAddress: z.string(),
    name: z.string().optional(),
});
