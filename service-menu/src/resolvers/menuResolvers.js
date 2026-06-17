const { Menu, MenuRecipe } = require('../models/menu');

const resolvers = {
  Query: {
    getSemuaMenu: async () => {
      return await Menu.findAll({ include: [MenuRecipe] });
    },
    getMenuById: async (_, { id }) => {
      return await Menu.findByPk(id, { include: [MenuRecipe] });
    }
  },
  Mutation: {
    createMenu: async (_, { nama_paket, deskripsi }) => {
      return await Menu.create({ nama_paket, deskripsi });
    },
    updateMenu: async (_, { id, nama_paket, deskripsi }) => {
      const menu = await Menu.findByPk(id);
      if (!menu) throw new Error("Menu tidak ditemukan");
      await menu.update({ nama_paket, deskripsi });
      return await Menu.findByPk(id, { include: [MenuRecipe] });
    },
    deleteMenu: async (_, { id }) => {
      const menu = await Menu.findByPk(id);
      if (!menu) throw new Error("Menu tidak ditemukan");
      // Hapus recipe dulu, baru menu
      await MenuRecipe.destroy({ where: { id_menu: id } });
      await menu.destroy();
      return true;
    },
    createMenuRecipe: async (_, { id_menu, id_inventory, jumlah_kebutuhan }) => {
        return await MenuRecipe.create({
            id_menu,
            id_inventory,
            jumlah_kebutuhan
        });
    },

    deleteByMenu: async (_, { id_menu }) => {
        await MenuRecipe.destroy({
            where: { id_menu }
        });

        return true;
    },
  }
};

module.exports = resolvers;