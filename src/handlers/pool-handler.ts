import { NextFunction, Router, Request, Response } from "express";
import { prisma } from "../prisma";
import { createPoolSchema } from "../schema/pool";
import { ApiError } from "../types/error";

export class PoolHandler {
    private router: Router;
    constructor(router: Router) {
        this.router = router;

        this.router.get("/pools", this.getPools.bind(this));
        this.router.post("/pools", this.createPool.bind(this));
    }

    async getPools(_req: Request, res: Response, next: NextFunction) {
        try {
            const pools = await prisma.pool.findMany();
            res.status(200).json(pools);
        } catch (e) {
            next(e);
        }
    }

    async createPool(req: Request, res: Response, next: NextFunction) {
        try {
            const request = createPoolSchema.safeParse(req.body);
            if (!request.success) {
                throw new ApiError(request.error.message, 400);
            }
            const data = request.data;
            const pool = await prisma.pool.create({
                data: {
                    name: data.name!,
                    userAddresss: data.userAddress,
                    t1TokenName: data.t1TokenName,
                    t2TokenName: data.t2TokenName,
                    t1TokenAddress: data.t1TokenAddress,
                    t2TokenAddress: data.t2TokenAddress,
                },
            });
            res.status(200).json(pool);
        } catch (e) {
            next(e);
        }
    }
}
