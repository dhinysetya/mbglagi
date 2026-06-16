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