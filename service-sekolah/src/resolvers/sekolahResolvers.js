const Sekolah = require('../models/sekolah'); // Pastikan path model benar

const resolvers = {
  Query: {
    // Menggantikan getAllSekolah
    semuaSekolah: async () => {
      return await Sekolah.findAll();
    },

    // Menggantikan getSekolahById
    sekolahById: async (_, { id_sekolah }) => {
      const sekolah = await Sekolah.findByPk(id_sekolah);
      if (!sekolah) throw new Error("Sekolah tidak ditemukan");
      return sekolah;
    },
  },

  Mutation: {
    // Menggantikan createSekolah
    createSekolah: async (_, { input }) => {
      try {
        return await Sekolah.create(input);
      } catch (error) {
        throw new Error("Gagal menambah sekolah: " + error.message);
      }
    },

    // Menggantikan updateSekolah
    updateSekolah: async (_, { id_sekolah, input }) => {
      const sekolah = await Sekolah.findByPk(id_sekolah);
      if (!sekolah) throw new Error("Sekolah tidak ditemukan");
      
      return await sekolah.update(input);
    },

    // Menggantikan deleteSekolah
    deleteSekolah: async (_, { id_sekolah }) => {
      const sekolah = await Sekolah.findByPk(id_sekolah);
      if (!sekolah) throw new Error("Sekolah tidak ditemukan");
      
      await sekolah.destroy();
      return true;
    }
  }
};

module.exports = resolvers;