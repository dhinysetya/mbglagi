const Inventory = require('../models/inventory');

const inventoryResolvers = {
  Query: {
    getInventories: async () => {
      return await Inventory.findAll();
    },
    getInventoryByDapur: async (_, { id_dapur }) => {
      return await Inventory.findAll({
        where: { id_dapur }
      });
    },
    getInventoryById: async (_, { id_inventory }) => {
      const item = await Inventory.findByPk(id_inventory);
      if (!item) throw new Error(`Inventory ID ${id_inventory} tidak ditemukan`);
      return item;
    }
  },
  Mutation: {
    createInventory: async (_, { id_dapur, nama_bahan, stok, satuan }) => {
      return await Inventory.create({
        id_dapur,
        nama_bahan,
        stok,
        satuan
      });
    },
    updateInventory: async (_, { id_inventory, stok }) => {
      const item = await Inventory.findByPk(id_inventory);
      if (!item) throw new Error('Data tidak ditemukan');
      
      item.stok = stok;
      await item.save();
      return item;
    },
    deleteInventory: async (_, { id_inventory }) => {
      const item = await Inventory.findByPk(id_inventory);
      if (!item) throw new Error('Data tidak ditemukan');
      
      await item.destroy();
      return "Data berhasil dihapus";
    }
  }
};

module.exports = inventoryResolvers;
