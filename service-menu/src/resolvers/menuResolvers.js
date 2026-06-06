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
    createMenu: async (_, { nama_paket, deskripsi }) => {
      return await Menu.create({ nama_paket, deskripsi });
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