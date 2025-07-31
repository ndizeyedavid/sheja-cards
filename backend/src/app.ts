import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import routes from "./routes";
import { errorHandler } from "./middlewares/error.middleware";

class App {
    public app: Express;

    constructor() {
        this.app = express();
        this.configureMiddlewares();
        this.configureRoutes();
        this.configureErrorHandling();
    }

    private configureMiddlewares(): void {
        // Security middlewares
        this.app.use(helmet());
        this.app.use(cors());

        // Request parsing
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        // Logging in development
        if (process.env.NODE_ENV === "development") {
            this.app.use(morgan("dev"));
        }

        // Compression
        this.app.use(compression());

        // Serve static files from uploads directory
        this.app.use("/uploads", express.static("uploads"));
    }

    private configureRoutes(): void {
        this.app.use("/api/v1", routes);
    }

    private configureErrorHandling(): void {
        this.app.use(errorHandler);
    }

    public async connectToDatabase(): Promise<void> {
        try {
            const mongoUri = process.env.MONGO_URI;
            if (!mongoUri) {
                throw new Error("MongoDB URI is not defined");
            }

            await mongoose.connect(mongoUri);
            console.log("Connected to MongoDB");
        } catch (error) {
            console.error("MongoDB connection error:", error);
            process.exit(1);
        }
    }

    public listen(): void {
        const port = process.env.PORT || 5000;
        this.app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
}

export default App;
