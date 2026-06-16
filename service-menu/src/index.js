const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const typeDefs = require('./schemas/menuTypeDefs');
const resolvers = require('./resolvers/menuResolvers');

async function startServer() {
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();
  server.applyMiddleware({ app });

  app.listen(3002, () => {
    console.log('Service Menu GraphQL berjalan di http://localhost:3002/graphql');
  });
}

startServer();