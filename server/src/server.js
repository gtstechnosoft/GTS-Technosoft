const app = require('./app');
const config = require('./config/env');
const prisma = require('./config/prisma');

const startServer = async () => {
  try {
    // Verify DB connectivity
    await prisma.$connect();
    console.log('[+] Connected to PostgreSQL Database via Prisma.');

    const server = app.listen(config.PORT, () => {
      console.log(`========================================================`);
      console.log(`  GTS TECHNOSOFT AI LLP - KavachIQ API Server`);
      console.log(`  Running on: http://localhost:${config.PORT}`);
      console.log(`  Environment: ${config.NODE_ENV}`);
      console.log(`  API Base URL: http://localhost:${config.PORT}/api/v1`);
      console.log(`========================================================`);
    });

    const shutdown = async (signal) => {
      console.log(`\nReceived ${signal}. Gracefully shutting down...`);
      server.close(async () => {
        await prisma.$disconnect();
        console.log('[+] Database connection closed. Exiting process.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err) {
    console.error('[-] Failed to start API server:', err);
    process.exit(1);
  }
};

startServer();
