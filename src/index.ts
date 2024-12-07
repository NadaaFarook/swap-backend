import { Router } from "express";
import dotenv from "dotenv";
import App from "./server";
import { PoolHandler } from "./handlers/pool-handler";
import { TxHandler } from "./handlers/tx-handler";
import { PriceHandler } from "./handlers/price-handler";

dotenv.config({ path: process.env.DOTENV_CONFIG_PATH });

const router = Router();

const routes: any[] = [
    new PoolHandler(router),
    new TxHandler(router),
    new PriceHandler(router),
];

const app = new App(routes);
app.listen();
