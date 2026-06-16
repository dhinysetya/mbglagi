const Inventory = require('../models/inventory');

exports.getAllInventory = async (req, res) => {
    try { res.json(await Inventory.findAll()); } 
    catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getInventoryByDapur = async (req, res) => {
    try {
        const data = await Inventory.findAll({ where: { id_dapur: req.params.id_dapur } });
        res.json(data);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getInventoryById = async (req, res) => {
    try {
        const item = await Inventory.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Data tidak ditemukan' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.reduceBulkStock = async (req, res) => {
    try {
        const { id_dapur, bahan, items } = req.body; 
        const daftarBahan = bahan || items;

        if (!daftarBahan || !Array.isArray(daftarBahan)) {
            return res.status(400).json({ message: "Payload tidak valid atau resep kosong" });
        }
        
        for (let item of daftarBahan) {
            const inv = await Inventory.findOne({ where: { id_inventory: item.id_inventory, id_dapur } });
            if (inv) {
                inv.stok = parseFloat(inv.stok) - parseFloat(item.total_kurangi);
                await inv.save();
            }
        }
        res.json({ message: "Stok berhasil diperbarui" });
    } catch (err) {
        res.status(500).json({ message: "Gagal update stok: " + err.message });
    }
};

exports.createInventory = async (req, res) => {
    try { res.status(201).json(await Inventory.create(req.body)); } 
    catch (err) { res.status(400).json({ message: err.message }); }
};

exports.updateInventory = async (req, res) => {
    try {
        await Inventory.update(req.body, { where: { id_inventory: req.params.id } });
        res.json({ message: 'Stok diupdate' });
    } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteInventory = async (req, res) => {
    try {
        await Inventory.destroy({ where: { id_inventory: req.params.id } });
        res.json({ message: 'Bahan baku dihapus' });
    } catch (err) { res.status(500).json({ message: err.message }); }
};