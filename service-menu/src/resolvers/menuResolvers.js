const { Menu, MenuRecipe } = require('../models/menu');
const axios = require('axios');

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
    // Diubah untuk menghandle input bulk/nested insert
    createMenu: async (_, { input }) => {
      try {
        const newMenu = await Menu.create(input, {
          include: [MenuRecipe] // Kunci utamanya ada di sini!
        });
        return newMenu;
      } catch (error) {
        throw new Error("Gagal membuat menu beserta resep: " + error.message);
      }
    },
    updateMenu: async (_, { id, nama_paket, deskripsi }) => {
      const menu = await Menu.findByPk(id);
      if (!menu) throw new Error("Menu tidak ditemukan");
      await menu.update({ nama_paket, deskripsi });
      return menu;
    },
    deleteMenu: async (_, { id }) => {
      const menu = await Menu.findByPk(id);
      if (!menu) throw new Error("Menu tidak ditemukan");

      const distribusiRes = await axios.get(`http://localhost:3005/api/distribusi/check-menu/${id}`);
      if (distribusiRes.data.isProcessing) {
        throw new Error("Menu sedang digunakan dalam distribusi aktif!");
      }

      await Menu.destroy({ where: { id_menu: id } });
      return true;
    }
  }
};

module.exports = resolvers;