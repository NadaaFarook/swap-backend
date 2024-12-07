import { NextFunction, Router, Response, Request } from "express";
import { prisma } from "../prisma";
import { createTxSchema } from "../schema/tx-schema";
import { ApiError } from "../types/error";

export class TxHandler {
    private router: Router;
    constructor(router: Router) {
        this.router = router;

        this.router.get("/txs", this.getTxs.bind(this));
        this.router.post("/txs", this.createTx.bind(this));
    }

    async getTxs(req: Request, res: Response, next: NextFunction) {
        try {
            const userAddress = req.query?.userAddress?.toString();
            const poolId = Number(req.query?.poolId);
            const txs = await prisma.transaction.findMany({
                where: {
                    userAddresss: userAddress,
                    poolId: poolId,
                },
            });

            res.status(200).json(txs);
        } catch (e) {
            next(e);
        }
    }
    async createTx(req: Request, res: Response, next: NextFunction) {
        try {
            const request = createTxSchema.safeParse(req.body);
            if (!request.success) {
                throw new ApiError(request.error.message, 400);
            }
            const data = request.data;
            const tx = await prisma.transaction.create({
                data: {
                    fee: data.fee,
                    inputAmount: data.inputAmount,
                    inputTokenAddress: data.inputTokenAddress,
                    outputAmount: data.outputAmount,
                    outputTokenAddress: data.outputTokenAddress,
                    userAddresss: data.userAddress,
                    transactionHash: data.transactionHash,

                    Pool: {
                        connect: {
                            id: data.poolId,
                        },
                    },
                },
            });
            res.status(200).json(tx);
        } catch (e) {
            next(e);
        }
    }
}
