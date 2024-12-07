import express, { type Application } from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import { errorMiddleware } from "./middleware/error";

export default class App {
    public app: Application;
    public port: string | number;
    public production: boolean;

    constructor(routes: any[]) {
        this.app = express();
        this.port = process.env.PORT || 5000;
        this.production = process.env.ENV === "production";

        this.initializeMiddleware();
        this.initializeRoutes(routes);
        this.app.use(errorMiddleware);
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log("=====================================");
            console.log("Welcome to Qiro Marketplace server");
            console.log(
                `Server running ${this.production ? "PRODUCTION" : "LOCAL"} env`,
            );
            console.log(`Server is listening on port ${this.port}`);
            console.log("=====================================");
            console.log("Connected App", env.APP_URI);
        });
    }

    private initializeRoutes(routes: any[]) {
        routes.forEach((route) => {
            this.app.use("/api", route.router);
        });
    }

    private initializeMiddleware() {
        // Security middlewares first
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(hpp());

        // Parse request body and cookies
        this.app.use(express.json({ limit: "10kb" }));
        this.app.use(express.urlencoded({ extended: true }));

        // Logging middleware
        this.app.use(morgan(this.production ? "combined" : "dev"));
    }
}
