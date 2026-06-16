const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const typeDefs = require('./schemas/sekolahTypeDefs');
const resolvers = require('./resolvers/sekolahResolvers');

async function startServer() {
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();
  server.applyMiddleware({ app });

  app.listen(5000, () => {
    console.log('Service Sekolah berjalan di http://localhost:5000/graphql');
  });
}

startServer();