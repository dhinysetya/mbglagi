require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const cors = require('cors');  
const sequelize = require('./config/db');
const typeDefs = require('./schemas/dapurTypeDefs');
const resolvers = require('./resolvers/dapurResolvers');

async function startServer() {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  await server.start();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  server.applyMiddleware({ app, path: '/graphql' });

  app.get('/', (req, res) => {
    res.send(`🚀 Service Dapur (${process.env.DB_NAME}) sedang berjalan...`);
  });

  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('✅ Koneksi database Dapur berhasil.');

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log('--------------------------------------------------');
      console.log(`✅ Database [${process.env.DB_NAME}] Terkoneksi & Sinkron`);
      console.log(`🚀 Service Dapur berjalan di http://localhost:${PORT}/graphql`);
      console.log('--------------------------------------------------');
    });
  } catch (error) {
    console.error('❌ Koneksi database Dapur gagal:', error.message);
  }
}

startServer();
