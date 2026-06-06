const Inventory = require('../models/inventory');

const resolvers = {
  Query: {
    semuaInventory: async () => await Inventory.findAll(),
    inventoryByDapur: async (_, { id_dapur }) => await Inventory.findAll({ where: { id_dapur } }),
    inventoryById: async (_, { id }) => await Inventory.findByPk(id),
  },
  Mutation: {
    createInventory: async (_, { input }) => await Inventory.create(input),
    updateInventory: async (_, { id, input }) => {
      await Inventory.update(input, { where: { id_inventory: id } });
      return await Inventory.findByPk(id);
    },
    deleteInventory: async (_, { id }) => {
      const deleted = await Inventory.destroy({ where: { id_inventory: id } });
      return !!deleted;
    }
  }
};

module.exports = resolvers;