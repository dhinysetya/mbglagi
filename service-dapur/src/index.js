require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const sequelize = require('./config/db'); // Pastikan path ini benar
const typeDefs = require('./schemas/dapurTypeDefs');
const resolvers = require('./resolvers/dapurResolvers');

async function startServer() {
  const app = express();
  
  // Inisialisasi Apollo Server
  const server = new ApolloServer({ 
    typeDefs, 
    resolvers 
  });

  await server.start();
  server.applyMiddleware({ app });

  // Sinkronisasi Database
  try {
    // Sync model ke database
    await sequelize.authenticate();
    await sequelize.sync({ alter: true }); 
    console.log('✅ Koneksi database Dapur berhasil.');
    
    // Jalankan Server
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 Service Dapur berjalan di http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error('❌ Koneksi database Dapur gagal:', error.message);
  }
}

startServer();