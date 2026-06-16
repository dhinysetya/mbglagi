const Shipment = require('../models/shipment');
const axios = require('axios');

const resolvers = {
  Query: {
    // 1. getAllShipments
    allShipments: async () => {
      try {
        const shipments = await Shipment.findAll();
        return await Promise.all(shipments.map(async (s) => {
          const shipData = s.toJSON();
          // Fetch data dari service lain (Microservices)
          const [sekolahRes, dapurRes, menuRes] = await Promise.all([
            axios.get(`${process.env.URL_SERVICE_SEKOLAH}/api/sekolah/${shipData.id_sekolah}`).catch(() => null),
            axios.get(`${process.env.URL_SERVICE_DAPUR}/api/dapur/${shipData.id_dapur}`).catch(() => null),
            axios.get(`${process.env.URL_SERVICE_MENU}/api/menu/${shipData.id_menu}`).catch(() => null)
          ]);

          return {
            ...shipData,
            nama_sekolah: sekolahRes?.data?.nama_sekolah || "N/A",
            nama_dapur: dapurRes?.data?.nama_dapur || "N/A",
            nama_menu: menuRes?.data?.nama_paket || "N/A"
          };
        }));
      } catch (error) {
        throw new Error(error.message);
      }
    },

    // 2. getShipmentById
    shipmentById: async (_, { id }) => {
      const shipment = await Shipment.findByPk(id);
      if (!shipment) throw new Error('Data tidak ditemukan');
      return shipment;
    },

    // 3. checkMenuStatus (isProcessing)
    checkMenuStatus: async (_, { id_menu }) => {
      const activeShipment = await Shipment.findOne({
        where: {
          id_menu: id_menu,
          status_kirim: ['Persiapan', 'Proses', 'Pending', 'Dikirim']
        }
      });
      return { isProcessing: !!activeShipment };
    }
  },

  Mutation: {
    // 1. createShipment
    createShipment: async (_, args) => {
      return await Shipment.create({
        ...args,
        status_kirim: args.status,
        waktu_sampai: args.waktu_sampai || null
      });
    },

    // 2. updateShipment
    updateShipment: async (_, { id, ...args }) => {
      const updateData = {
        ...args,
        status_kirim: args.status,
        waktu_sampai: args.status === 'Diterima' ? new Date() : (args.waktu_sampai || null)
      };
      await Shipment.update(updateData, { where: { id_shipment: id } });
      return { message: "Pengiriman berhasil diperbarui" };
    },

    // 3. deleteShipment
    deleteShipment: async (_, { id }) => {
      await Shipment.destroy({ where: { id_shipment: id } });
      return { message: "Data pengiriman dihapus" };
    }
  }
};

module.exports = resolvers;