const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

/**
 * @openapi
 * /api/inventory:
 * get:
 * summary: Ambil semua daftar stok bahan baku
 * tags: [Inventory]
 * post:
 * summary: Tambah bahan baku baru
 * tags: [Inventory]
 */
router.get('/', inventoryController.getAllInventory);
router.post('/', inventoryController.createInventory);

/**
 * @openapi
 * /api/inventory/reduce-bulk:
 * post:
 * summary: Mengurangi stok dalam jumlah banyak (Dipanggil oleh Service Menu)
 * tags: [Inventory]
 */
router.post('/reduce-bulk', inventoryController.reduceBulkStock);

/**
 * @openapi
 * /api/inventory/dapur/{id_dapur}:
 * get:
 * summary: Filter stok berdasarkan ID Dapur
 * tags: [Inventory]
 */
router.get('/dapur/:id_dapur', inventoryController.getInventoryByDapur);
router.get('/:id', inventoryController.getInventoryById);

/**
 * @openapi
 * /api/inventory/{id}:
 * put:
 * summary: Update data stok
 * tags: [Inventory]
 * delete:
 * summary: Hapus bahan baku
 * tags: [Inventory]
 */
router.put('/:id', inventoryController.updateInventory);
router.delete('/:id', inventoryController.deleteInventory);

module.exports = router;