const Sekolah = require('../models/sekolah'); 

const resolvers = {
  Query: {
    semuaSekolah: async () => {
      return await Sekolah.findAll();
    },

    sekolahById: async (_, { id_sekolah }) => {
      const sekolah = await Sekolah.findByPk(id_sekolah);
      if (!sekolah) throw new Error("Sekolah tidak ditemukan");
      return sekolah;
    },
  },

  Mutation: {
    createSekolah: async (_, { input }) => {
      try {
        return await Sekolah.create(input);
      } catch (error) {
        throw new Error("Gagal menambah sekolah: " + error.message);
      }
    },

    updateSekolah: async (_, { id_sekolah, input }) => {
      const sekolah = await Sekolah.findByPk(id_sekolah);
      if (!sekolah) throw new Error("Sekolah tidak ditemukan");
      
      return await sekolah.update(input);
    },

    deleteSekolah: async (_, { id_sekolah }) => {
      const sekolah = await Sekolah.findByPk(id_sekolah);
      if (!sekolah) throw new Error("Sekolah tidak ditemukan");
      
      await sekolah.destroy();
      return true;
    }
  }
};

module.exports = resolvers;