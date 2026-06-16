require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');

const sequelize = require('./config/db');

const typeDefs = require('./schemas/menuTypeDefs');
const resolvers = require('./resolvers/menuResolvers');

async function startServer() {
    const app = express();

    const server = new ApolloServer({
        typeDefs,
        resolvers
    });

    await server.start();

    app.use(cors());

    server.applyMiddleware({
        app,
        path: '/graphql'
    });

    const PORT = process.env.PORT || 3000;

    try {
        await sequelize.sync({ alter: true });

        console.log(`✅ Database ${process.env.DB_NAME} sinkron`);

        app.listen(PORT, () => {
            console.log(`🚀 Service Menu berjalan di port ${PORT}`);
            console.log(`📖 GraphQL: http://localhost:${PORT}/graphql`);
        });
    } catch (err) {
        console.error(err);
    }
}

startServer();