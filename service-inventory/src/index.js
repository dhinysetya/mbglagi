require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');

const sequelize = require('./config/db');

const typeDefs = require('./schemas/inventoryTypeDefs');
const resolvers = require('./resolvers/inventoryResolvers');

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

    app.get('/', (req, res) => {
        res.send(`🚀 Service Inventory (${process.env.DB_NAME}) sedang berjalan...`);
    });

    const PORT = process.env.PORT || 5001;

    try {
        await sequelize.sync({ alter: true });

        console.log('--------------------------------------------------');
        console.log(`✅ Database [${process.env.DB_NAME}] Terkoneksi & Sinkron`);
        console.log(`📖 GraphQL Playground: http://localhost:${PORT}/graphql`);
        console.log('--------------------------------------------------');

        app.listen(PORT, () => {
            console.log(`🚀 Service Inventory GraphQL berjalan di port ${PORT}`);
        });
    } catch (err) {
        console.error('❌ Gagal sinkronisasi database:', err.message);
    }
}

startServer();