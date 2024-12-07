import { NextFunction, Router, Response, Request } from "express";
import { ApiError } from "../types/error";
import { fetchTokenPrice } from "../utils";

export class PriceHandler {
    private router: Router;
    constructor(router: Router) {
        this.router = router;
        this.router.post("/price", this.getPrice.bind(this));
        this.router.post("/qoute", this.getQoute.bind(this));
    }

    async getPrice(req: Request, res: Response, next: NextFunction) {
        try {
            const network_id = req.query.network_id?.toString();
            const tokenAddress = req.query.tokenAddress?.toString();
            if (!network_id || !tokenAddress) {
                throw new ApiError("BAD REQUEST", 400);
            }

            const data = await fetchTokenPrice({ network_id, tokenAddress });
            res.status(200).json(data);
        } catch (e) {
            next(e);
        }
    }

    async getQoute(req: Request, res: Response, next: NextFunction) {
        try {
            const inputTokenPrice = Number(req.query.inputTokenPrice);
            const outputTokenPrice = Number(req.query.outputTokenPrice);
            const inputAmount = Number(req.query.inputAmount);
            if (!inputTokenPrice || !outputTokenPrice) {
                throw new ApiError("Bad Request, prices are missing", 400);
            }

            const inputValueUsd = inputAmount * inputTokenPrice;
            const outputAmount = inputValueUsd / outputTokenPrice;

            res.status(200).json(outputAmount);
        } catch (e) {
            next(2);
        }
    }
}
