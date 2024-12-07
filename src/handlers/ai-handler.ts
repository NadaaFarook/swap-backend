import { NextFunction, Router, Request, Response } from "express";
import { prisma } from "../prisma";
import { ApiError } from "../types/error";
import { Coinbase, Wallet } from "@coinbase/coinbase-sdk";
import { createAiAgentSchema } from "src/schema/aiAgent";
import { createPositionSchema } from "src/schema/position";
import cron from "node-cron"
import crypto from "crypto"
import { fetchTokenPrice } from "src/utils";

Coinbase.configureFromJson({ filePath: './config.json' });

export class AiAgentHandler {
    private router: Router;
    constructor(router: Router) {
        this.router = router;

        this.router.get("/agent", this.getAgents.bind(this));
        this.router.post("/agent", this.createAgent.bind(this));
        this.router.get("/agent/position", this.getPositions.bind(this));
        this.router.post("/agent/position", this.createPosition.bind(this));
    }

    runCronJob() {
        cron.schedule("* * * * *", async () => {
            const positions = await prisma.position.findMany({
                include: {
                    aiAgent: true
                }
            })

            const promises = positions.map(async position => {
                const wallet = await Wallet.import({
                    seed: position.aiAgent.seedPhrase,
                    walletId: position.aiAgent.walletId
                })

                const priceJson = await fetchTokenPrice({
                    network_id: position.networkId,
                    tokenAddress: position.buyTokenAddress
                })

                const price = Number(priceJson[position.buyTokenAddress].usd)

                const percentage = ((price - position.lastBuyTokenPrice) / position.lastBuyTokenPrice) * 100

                if(position.buyOnPercentage <= percentage) {
                    // buy token
                }

                if(position.sellOnPercentage >= percentage) {
                    // sell token
                }
            })
        })
    }

    async getAgents(req: Request, res: Response, next: NextFunction) {
        try {
            const address = req.query["address"]
            const aiAgents = await prisma.aIAgent.findMany({
                where: {
                    ownerAddress: {
                        equals: address as string,
                        mode: "insensitive"
                    }
                }
            });
            res.status(200).json(aiAgents);
        } catch (e) {
            next(e);
        }
    }

    async createAgent(req: Request, res: Response, next: NextFunction) {
        try {
            const request = createAiAgentSchema.safeParse(req.body);
            if (!request.success) {
                throw new ApiError(request.error.message, 400);
            }
            const data = request.data;

            const wallet = await Wallet.create()

            const save = wallet.export()

            var cipher = crypto.createCipheriv("aes-256-gcm", crypto.scryptSync("something", "salt", 32), crypto.randomBytes(12));  
            var encrypted = cipher.update(save.seed)

            const aiAgent = await prisma.aIAgent.create({
                data: {
                    agentName: data.name,
                    ownerAddress: data.ownerAddress,
                    agentAddress: (await wallet.getDefaultAddress()).toString(),
                    seedPhrase: encrypted.toString(),
                    walletId: wallet.getId()!
                },
            });
            res.status(200).json(aiAgent);
        } catch (e) {
            next(e);
        }
    }

    async getPositions(req: Request, res: Response, next: NextFunction) {
        try {
            const aiAgentId = req.query["id"]
            const positions = await prisma.position.findMany({
                where: {
                    aiAgentId: Number(aiAgentId)
                }
            });
            res.status(200).json(positions);
        } catch (e) {
            next(e);
        }
    }

    async createPosition(req: Request, res: Response, next: NextFunction) {
        try {
            const request = createPositionSchema.safeParse(req.body);
            if (!request.success) {
                throw new ApiError(request.error.message, 400);
            }
            const data = request.data;

            const position = await prisma.position.create({
                data: {
                    aiAgentId: data.aiAgentId,
                    networkId: data.networkId,
                    buyOnPercentage: data.buyOnPercentage,
                    sellOnPercentage: data.sellOnPercentage,
                    buyTokenAddress: data.buyTokenAddress,
                    sellTokenAddress: data.sellTokenAddress
                },
            });
            res.status(200).json(position);
        } catch (e) {
            next(e);
        }
    }
}
