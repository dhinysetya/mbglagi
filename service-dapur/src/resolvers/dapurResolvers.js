const Dapur = require('../models/dapur');

const resolvers = {
  Query: {
    semuaDapur: async () => {
      try {
        return await Dapur.findAll();
      } catch (err) {
        throw new Error(err.message);
      }
    },

    dapurById: async (_, { id_dapur }) => {
      try {
        const data = await Dapur.findByPk(id_dapur);
        if (!data) throw new Error('Dapur tidak ditemukan');
        return data;
      } catch (err) {
        throw new Error(err.message);
      }
    },
  },

  Mutation: {
    createDapur: async (_, { input }) => {
      try {
        return await Dapur.create(input);
      } catch (err) {
        throw new Error(err.message);
      }
    },

    updateDapur: async (_, { id_dapur, input }) => {
      try {
        const [updated] = await Dapur.update(input, { where: { id_dapur } });
        if (!updated) throw new Error('Dapur tidak ditemukan');
        return await Dapur.findByPk(id_dapur);
      } catch (err) {
        throw new Error(err.message);
      }
    },

    deleteDapur: async (_, { id_dapur }) => {
      try {
        const deleted = await Dapur.destroy({ where: { id_dapur } });
        if (!deleted) throw new Error('Dapur tidak ditemukan');
        return true;
      } catch (err) {
        throw new Error(err.message);
      }
    },
  },
};

module.exports = resolvers;