const Shipment = require('../models/shipment');
const axios = require('axios');

const resolvers = {
  Query: {
    // allShipments — fetch dengan detail nama dari service lain
    allShipments: async () => {
      try {
        const shipments = await Shipment.findAll({
          order: [['createdAt', 'DESC']]
        });

        console.log(`[allShipments] Fetch ${shipments.length} shipments dari DB`);

        return await Promise.all(shipments.map(async (s) => {
          const shipData = s.toJSON();
          
          const axiosConfig = {
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            timeout: 5000
          };

          // Fetch nama dari service lain via axios
          const [sekolahRes, dapurRes, menuRes] = await Promise.all([
            // Service Sekolah
            axios.post(`${process.env.URL_SERVICE_SEKOLAH}/graphql`, {
              query: `
                query GetSekolah($id: ID!) {
                  sekolahById(id: $id) {
                    nama_sekolah
                  }
                }
              `,
              variables: { id: String(shipData.id_sekolah) }
            }, axiosConfig).catch((err) => {
              console.warn(`[allShipments] Gagal fetch sekolah ${shipData.id_sekolah}:`, err.message);
              return null;
            }),
            
            // Service Dapur
            axios.post(`${process.env.URL_SERVICE_DAPUR}/graphql`, {
              query: `
                query GetDapur($id: ID!) {
                  dapurById(id: $id) {
                    nama_dapur
                  }
                }
              `,
              variables: { id: String(shipData.id_dapur) }
            }, axiosConfig).catch((err) => {
              console.warn(`[allShipments] Gagal fetch dapur ${shipData.id_dapur}:`, err.message);
              return null;
            }),
            
            // Service Menu — FIX: getMenuById dengan capital M, Int bukan ID
            axios.post(`${process.env.URL_SERVICE_MENU}/graphql`, {
              query: `
                query GetMenu($id: Int!) {
                  getMenuById(id: $id) {
                    nama_paket
                  }
                }
              `,
              variables: { id: parseInt(shipData.id_menu) }
            }, axiosConfig).catch((err) => {
              console.warn(`[allShipments] Gagal fetch menu ${shipData.id_menu}:`, err.message);
              return null;
            })
          ]);

          // Map response dengan fallback
          const result = {
            ...shipData,
            nama_sekolah: sekolahRes?.data?.data?.sekolahById?.nama_sekolah || null,
            nama_dapur: dapurRes?.data?.data?.dapurById?.nama_dapur || null,
            nama_menu: menuRes?.data?.data?.getMenuById?.nama_paket || null,
            // PENTING: Include field tanggal
            createdAt: shipData.createdAt,
            updatedAt: shipData.updatedAt
          };

          console.log(`[allShipments] Shipment ${shipData.id_shipment}:`, {
            nama_sekolah: result.nama_sekolah,
            nama_dapur: result.nama_dapur,
            nama_menu: result.nama_menu,
            createdAt: result.createdAt
          });

          return result;
        }));
      } catch (error) {
        console.error('[allShipments] Error:', error.message);
        throw new Error(`Gagal fetch shipments: ${error.message}`);
      }
    },

    // shipmentById — fetch single shipment dengan detail nama
    shipmentById: async (_, { id }) => {
      try {
        const shipment = await Shipment.findByPk(id);
        if (!shipment) throw new Error(`Shipment ${id} tidak ditemukan`);
        
        const shipData = shipment.toJSON();
        
        const axiosConfig = {
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 5000
        };

        // Fetch nama dari service lain
        const [sekolahRes, dapurRes, menuRes] = await Promise.all([
          axios.post(`${process.env.URL_SERVICE_SEKOLAH}/graphql`, {
            query: `
              query GetSekolah($id: ID!) {
                sekolahById(id: $id) {
                  nama_sekolah
                }
              }
            `,
            variables: { id: String(shipData.id_sekolah) }
          }, axiosConfig).catch(() => null),
          
          axios.post(`${process.env.URL_SERVICE_DAPUR}/graphql`, {
            query: `
              query GetDapur($id: ID!) {
                dapurById(id: $id) {
                  nama_dapur
                }
              }
            `,
            variables: { id: String(shipData.id_dapur) }
          }, axiosConfig).catch(() => null),
          
          axios.post(`${process.env.URL_SERVICE_MENU}/graphql`, {
            query: `
              query GetMenu($id: Int!) {
                getMenuById(id: $id) {
                  nama_paket
                }
              }
            `,
            variables: { id: parseInt(shipData.id_menu) }
          }, axiosConfig).catch(() => null)
        ]);

        return {
          ...shipData,
          nama_sekolah: sekolahRes?.data?.data?.sekolahById?.nama_sekolah || null,
          nama_dapur: dapurRes?.data?.data?.dapurById?.nama_dapur || null,
          nama_menu: menuRes?.data?.data?.getMenuById?.nama_paket || null,
          createdAt: shipData.createdAt,
          updatedAt: shipData.updatedAt
        };
      } catch (error) {
        console.error('[shipmentById] Error:', error.message);
        throw new Error(error.message);
      }
    },

    // checkMenuStatus
    checkMenuStatus: async (_, { id_menu }) => {
      try {
        const activeShipment = await Shipment.findOne({
          where: {
            id_menu: id_menu,
            // Menggunakan $in operator Sequelize untuk multiple values
            status_kirim: ['Persiapan', 'Proses', 'Pending', 'Dikirim']
          }
        });
        return { isProcessing: !!activeShipment };
      } catch (error) {
        console.error('[checkMenuStatus] Error:', error.message);
        throw new Error(error.message);
      }
    }
  },

  Mutation: {
    // createShipment
    createShipment: async (_, args) => {
      try {
        console.log('[createShipment] Input:', args);
        
        const shipment = await Shipment.create({
          id_sekolah: args.id_sekolah,
          id_dapur: args.id_dapur,
          id_menu: args.id_menu,
          jumlah_porsi: args.jumlah_porsi,
          status_kirim: args.status,  // status → status_kirim
          waktu_sampai: args.waktu_sampai || null
        });

        const result = shipment.toJSON();
        console.log('[createShipment] Created:', result);
        return result;
      } catch (error) {
        console.error('[createShipment] Error:', error.message);
        throw new Error(`Gagal buat shipment: ${error.message}`);
      }
    },

    // updateShipment
    updateShipment: async (_, { id, ...args }) => {
      try {
        console.log('[updateShipment] ID:', id, 'Args:', args);

        const updateData = {};
        
        if (args.id_sekolah !== undefined && args.id_sekolah !== null) 
          updateData.id_sekolah = args.id_sekolah;
        if (args.id_dapur !== undefined && args.id_dapur !== null) 
          updateData.id_dapur = args.id_dapur;
        if (args.id_menu !== undefined && args.id_menu !== null) 
          updateData.id_menu = args.id_menu;
        if (args.jumlah_porsi !== undefined && args.jumlah_porsi !== null) 
          updateData.jumlah_porsi = args.jumlah_porsi;
        if (args.status !== undefined && args.status !== null) {
          updateData.status_kirim = args.status;
          if (args.status === 'Diterima') {
            updateData.waktu_sampai = new Date();
          }
        }
        if (args.waktu_sampai !== undefined && args.waktu_sampai !== null) 
          updateData.waktu_sampai = args.waktu_sampai;

        const result = await Shipment.update(updateData, { 
          where: { id_shipment: id },
          returning: true
        });

        if (result[0] === 0) {
          throw new Error(`Shipment ${id} tidak ditemukan`);
        }

        console.log('[updateShipment] Success');
        return { message: "Pengiriman berhasil diperbarui" };
      } catch (error) {
        console.error('[updateShipment] Error:', error.message);
        throw new Error(error.message);
      }
    },

    // deleteShipment
    deleteShipment: async (_, { id }) => {
      try {
        console.log('[deleteShipment] ID:', id);

        const result = await Shipment.destroy({ 
          where: { id_shipment: id } 
        });

        if (result === 0) {
          throw new Error(`Shipment ${id} tidak ditemukan`);
        }

        console.log('[deleteShipment] Success');
        return { message: "Data pengiriman dihapus" };
      } catch (error) {
        console.error('[deleteShipment] Error:', error.message);
        throw new Error(error.message);
      }
    }
  }
};

module.exports = resolvers;