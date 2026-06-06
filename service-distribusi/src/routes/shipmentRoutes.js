const express = require('express');
const router = express.Router();
const shipmentsController = require('../controllers/shipmentsController');

/**
 * @openapi
 * /api/distribusi:
 * get:
 * summary: Ambil semua data pengiriman (Data agregat dari Dapur, Menu, & Sekolah)
 * tags: [Distribusi]
 * post:
 * summary: Buat jadwal pengiriman baru
 * tags: [Distribusi]
 */
router.get('/', shipmentsController.getAllShipments);
router.get('/:id', shipmentsController.getShipmentById);
router.post('/', shipmentsController.createShipment);

// =========================================================================
// ROUTE BARU: Endpoint untuk dicek oleh Service Menu sebelum hapus data
// =========================================================================
// Harus ditaruh di router milik service_distribusi, BUKAN service-menu
router.get('/check-menu/:id_menu', shipmentsController.checkMenuStatus);

/**
 * @openapi
 * /api/distribusi/{id}:
 * put:
 * summary: Update status pengiriman & waktu sampai otomatis
 * tags: [Distribusi]
 * delete:
 * summary: Hapus riwayat pengiriman
 * tags: [Distribusi]
 */
router.put('/:id', shipmentsController.updateShipment);
router.delete('/:id', shipmentsController.deleteShipment);

module.exports = router;