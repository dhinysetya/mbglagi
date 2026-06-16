const Shipment = require('../src/models/shipment');
const axios = require('axios');

const resolvers = {
  Query: {
    allShipments: async () => {
      try {
        const shipments = await Shipment.findAll();
        return await Promise.all(shipments.map(async (s) => {
          const shipData = s.toJSON();
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

    shipmentById: async (_, { id }) => {
      const shipment = await Shipment.findByPk(id);
      if (!shipment) throw new Error('Data tidak ditemukan');
      return shipment;
    },

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
    createShipment: async (_, args) => {
        let porsiFinal = args.jumlah_porsi;

        if (!porsiFinal || porsiFinal === 0) {
          try {
            const sekolahRes = await axios.get(`${process.env.URL_SERVICE_SEKOLAH}/api/sekolah/${args.id_sekolah}`);
            porsiFinal = sekolahRes?.data?.jumlah_siswa || 0;
            
            if (porsiFinal === 0) throw new Error("Jumlah siswa di sekolah tersebut tidak valid.");
          } catch (error) {
            throw new Error("Gagal terhubung ke Service Sekolah untuk mengambil data porsi: " + error.message);
          }
        }

        return await Shipment.create({
          ...args,
          jumlah_porsi: porsiFinal,
          status_kirim: args.status,
          waktu_sampai: args.waktu_sampai || null
        });
      },

    updateShipment: async (_, { id, ...args }) => {
      const updateData = {
        ...args,
        status_kirim: args.status,
        waktu_sampai: args.status === 'Diterima' ? new Date() : (args.waktu_sampai || null)
      };
      await Shipment.update(updateData, { where: { id_shipment: id } });
      return { message: "Pengiriman berhasil diperbarui" };
    },

    deleteShipment: async (_, { id }) => {
      await Shipment.destroy({ where: { id_shipment: id } });
      return { message: "Data pengiriman dihapus" };
    }
  }
};

module.exports = resolvers;