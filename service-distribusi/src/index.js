require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');

const sequelize = require('./config/db');
const typeDefs = require('./schemas/distribusiTypeDefs');
const resolvers = require('./resolvers/distribusiResolvers');

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

    server.applyMiddleware({
        app,
        path: '/graphql'
    });

    app.get('/', (req, res) => {
        res.send(`🚀 Service Distribusi (${process.env.DB_NAME}) sedang berjalan...`);
    });

    const PORT = process.env.PORT || 3005;

    try {
        await sequelize.sync({ alter: true });

        console.log('--------------------------------------------------');
        console.log(`✅ Database [${process.env.DB_NAME}] Terkoneksi & Sinkron`);
        console.log(`📖 GraphQL Playground: http://localhost:${PORT}/graphql`);
        console.log('--------------------------------------------------');

        app.listen(PORT, () => {
            console.log(`🚀 Service Distribusi GraphQL berjalan di port: ${PORT}`);
        });
    } catch (err) {
        console.error('❌ Gagal sinkronisasi database:', err.message);
    }
}

startServer();