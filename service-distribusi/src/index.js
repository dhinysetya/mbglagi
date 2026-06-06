require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');

// Import Config, Schema, Resolver, & Routes (Path disesuaikan ke folder src/)
const sequelize = require('./src/config/db');
const typeDefs = require('./src/schemas/distribusiTypeDefs');
const resolvers = require('./src/resolvers/distribusiResolvers');
const shipmentRoutes = require('./src/routes/shipmentRoutes');

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

async function startServer() {
  const app = express();

  // 1. Setup GraphQL Apollo
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

  // 2. Setup Swagger REST API
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API MBG Barokah - Service Distribusi',
        version: '1.0.0',
        description: 'Dokumentasi API Monitoring Pengiriman',
      },
      servers: [{ url: `http://localhost:${process.env.PORT || 3005}` }],
    },
    // Pastikan path ini menunjuk ke file route yang benar
    apis: ['./src/routes/*.js'],
  };
  const swaggerSpec = swaggerJsdoc(swaggerOptions);

  // 3. Middleware
  app.use(cors());
  app.use(express.json());
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/api/distribusi', shipmentRoutes);

  // 4. Sinkronisasi Database & Listen
  const PORT = process.env.PORT || 3005;
  try {
    // Sync database
    await sequelize.sync({ alter: true });
    console.log(`✅ Database [db_distribusi] Terkoneksi`);
    
    app.listen(PORT, () => {
      console.log(`📖 Swagger: http://localhost:${PORT}/api-docs`);
      console.log(`🚀 GraphQL: http://localhost:${PORT}${server.graphqlPath}`);
      console.log(`🚀 Server berjalan di port: ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Gagal sinkronisasi database:', err.message);
  }
}

startServer();