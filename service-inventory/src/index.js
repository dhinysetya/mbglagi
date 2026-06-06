require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const inventoryRoutes = require('./routes/inventoryRoutes');

const app = express();

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API MBG Barokah - Service Inventory',
            version: '1.0.0',
            description: 'Dokumentasi API untuk Manajemen Stok Bahan Baku Dapur',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3004}`,
            },
        ],
    },
    apis: ['./src/routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/inventory', inventoryRoutes);

app.get('/', (req, res) => {
    res.send(`🚀 Service Inventory (${process.env.DB_NAME}) sedang berjalan...`);
});

app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint tidak ditemukan!' });
});

const PORT = process.env.PORT || 3004;

sequelize.sync({ alter: true }) 
    .then(() => {
        console.log('--------------------------------------------------');
        console.log(`✅ Database [${process.env.DB_NAME}] Terkoneksi & Sinkron`);
        console.log(`📖 Dokumentasi API: http://localhost:${PORT}/api-docs`);
        console.log('--------------------------------------------------');
        app.listen(PORT, () => {
            console.log(`🚀 Service Inventory berjalan di port: ${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Gagal sinkronisasi database:', err.message);
    });