import app from "./app";
import { env } from "./config/env";
import prisma from "./config/prisma";

const startServer = async () => {
  try {
    await prisma.$connect();

    console.log("====================================");
    console.log("Recovery+ Backend Started");
    console.log(`Environment: ${env.NODE_ENV}`);
    console.log(`Server running on: http://localhost:${env.PORT}`);
    console.log("✅ Prisma connected to PostgreSQL");
    console.log("====================================");

    app.listen(env.PORT, () => {
      console.log(`Recovery+ API listening on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start Recovery+ backend:");
    console.error(error);

    await prisma.$disconnect();
    process.exit(1);
  }
};

startServer();