require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');


const sequelize = require('./src/config/db');
const typeDefs = require('./src/schemas/distribusiTypeDefs');
const resolvers = require('./src/resolvers/distribusiResolvers');
const shipmentRoutes = require('./src/routes/shipmentRoutes');

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

async function startServer() {
  const app = express();

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

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
    apis: ['./src/routes/*.js'],
  };
  const swaggerSpec = swaggerJsdoc(swaggerOptions);

  app.use(cors());
  app.use(express.json());
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/api/distribusi', shipmentRoutes);

  const PORT = process.env.PORT || 3005;
  try {

    await sequelize.sync({ alter: true });
    console.log(`Database [db_distribusi] Terkoneksi`);
    
    app.listen(PORT, () => {
      console.log(`Swagger: http://localhost:${PORT}/api-docs`);
      console.log(`GraphQL: http://localhost:${PORT}${server.graphqlPath}`);
      console.log(`Server berjalan di port: ${PORT}`);
    });
  } catch (err) {
    console.error('Gagal sinkronisasi database:', err.message);
  }
}

startServer();