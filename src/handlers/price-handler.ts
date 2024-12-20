import { NextFunction, Router, Response, Request } from "express";
import { fetchTokenPrice } from "../utils";
import { ethers } from "ethers";

const contractAddress = "0x3A18D3628828e8F04982A02beFff4e4CfC8c8Dbd";
const stablecoins = ["0xFff0DbC56e4f1812B7ab1866a252932E0853733D"]; // USDC

interface Order {
  sellToken: string;
  buyToken: string;
  sellAmount: string;
  buyAmount: string;
  feeAmount: string;
  kind: string;
  partiallyFillable: boolean;
}

export class PriceHandler {
  private router: Router;
  private privateKey: string; // Load this securely from env
  private signer: ethers.Wallet;

  constructor(router: Router) {
    this.router = router;
    this.privateKey = process.env.SIGNER_PRIVATE_KEY || "";
    this.signer = new ethers.Wallet(this.privateKey);
    this.router.post("/quote", this.getQuote.bind(this));
  }

  async getQuote(req: Request, res: Response, next: NextFunction) {
    try {
      const { token1, token2, amount, isSell } = req.body;

      let token1Price, token2Price;

      // Optimize price fetching for stablecoins
      if (stablecoins.includes(token1)) {
        token1Price = 1;
        token2Price = await fetchTokenPrice({
          tokenAddress: token2,
        });

        token2Price = token2Price[token2.toLowerCase()].usd;
      } else if (stablecoins.includes(token2)) {
        token1Price = await fetchTokenPrice({
          tokenAddress: token1,
        });
        token2Price = 1;
        token1Price = token1Price[token1.toLowerCase()].usd;
      } else {
        [token1Price, token2Price] = await Promise.all([
          fetchTokenPrice({ tokenAddress: token1 }),
          fetchTokenPrice({ tokenAddress: token2 }),
        ]);
        token1Price = token1Price[token1.toLowerCase()].usd;
        token2Price = token2Price[token2.toLowerCase()].usd;
      }

      // Calculate quote, if sell, amount * token1Price / token2Price, if buy, amount * token2Price / token1Price
      const quote = isSell
        ? (amount * token1Price) / token2Price
        : (amount * token2Price) / token1Price;

      // Create and sign order
      const order: Order = {
        sellToken: isSell ? token1 : token2,
        buyToken: isSell ? token2 : token1,
        sellAmount: ethers.parseUnits(amount.toString(), 18).toString(),
        buyAmount: ethers.parseUnits(quote.toString(), 18).toString(),
        feeAmount: "0",
        kind: isSell ? "sell" : "buy",
        partiallyFillable: false,
      };
      const ORDER_TYPE = {
        Order: [
          { name: "sellToken", type: "address" },
          { name: "buyToken", type: "address" },
          { name: "sellAmount", type: "uint256" },
          { name: "buyAmount", type: "uint256" },
          { name: "feeAmount", type: "uint256" },
          { name: "kind", type: "string" },
          { name: "partiallyFillable", type: "bool" },
        ],
      };
      // eip712 sign order
      const orderDigest = ethers.TypedDataEncoder.hash(
        {
          name: "Vault2",
          version: "1",
          chainId: ethers.toBigInt(1),
          verifyingContract: contractAddress,
        },
        ORDER_TYPE,
        order
      );
      console.log(orderDigest);
      // Sign the digest
      const signature = await this.signer.signMessage(
        ethers.getBytes(orderDigest)
      );
      console.log(signature);
      res.status(200).json({
        quote,
        order,
        signature,
        orderDigest,
      });
    } catch (e) {
      next(e);
    }
  }
}
