import express from "express";
import routes from "./routes/index.js";
import { PORT } from "./config/constants.js";
import { connectDB, disconnectDB } from "./lib/db.js";
import "./config/passport.js";
import { connectRedis } from "./lib/redis.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

async function startServer() {
    await connectDB();
    await connectRedis();
    
    const server = app.listen(PORT, () => {
        console.log(`Auth Server is running on port ${PORT}`);
    });

    const shutdown = async (signal: string) => {
        console.log(`\n${signal} received. Shutting down gracefully...`);
        server.close(async () => {
            await disconnectDB();
            console.log("Server closed");
            process.exit(0);
        });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
}

startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});

export default app;