const Shipment = require('../models/shipment');
const axios = require('axios');

exports.getAllShipments = async (req, res) => {
    try {
        const shipments = await Shipment.findAll();

        const detailedShipments = await Promise.all(shipments.map(async (s) => {
            const shipData = s.toJSON();
            try {
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
            } catch {
                return { ...shipData, note: "Beberapa data service tidak tersedia" };
            }
        }));

        res.json(detailedShipments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createShipment = async (req, res) => {
    try {
        const { id_sekolah, id_menu, id_dapur, jumlah_porsi, status, waktu_sampai } = req.body;
        const newShipment = await Shipment.create({
            id_sekolah,
            id_menu,
            id_dapur,
            jumlah_porsi, 
            status_kirim: status,
            waktu_sampai: waktu_sampai || null
        });
        res.status(201).json(newShipment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateShipment = async (req, res) => {
    try {
        const { id_sekolah, id_menu, id_dapur, jumlah_porsi, status, waktu_sampai } = req.body;

        const updateData = {
            id_sekolah,
            id_menu,
            id_dapur,
            jumlah_porsi,
            status_kirim: status,
            waktu_sampai: status === 'Diterima' 
                ? new Date() 
                : (waktu_sampai || null)
        };

        await Shipment.update(updateData, { where: { id_shipment: req.params.id } });
        res.json({ message: "Pengiriman berhasil diperbarui" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getShipmentById = async (req, res) => {
    try {
        const shipment = await Shipment.findByPk(req.params.id);
        if (!shipment) return res.status(404).json({ message: 'Data tidak ditemukan' });
        res.json(shipment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteShipment = async (req, res) => {
    try {
        await Shipment.destroy({ where: { id_shipment: req.params.id } });
        res.json({ message: "Data pengiriman dihapus" });
    } catch (error) { 
        res.status(500).json({ message: error.message }); 
    }
};

// =========================================================================
// PERBAIKAN: Menambahkan status 'Persiapan' agar dilarang menghapus menu
// =========================================================================
exports.checkMenuStatus = async (req, res) => {
    try {
        const { id_menu } = req.params;

        // Mencari shipment dengan status pengiriman yang dianggap masih aktif berjalan/dipersiapkan
        const activeShipment = await Shipment.findOne({
            where: {
                id_menu: id_menu,
                status_kirim: [
                    'Persiapan', 'persiapan', 'PERSIAPAN', 
                    'Proses', 'proses', 
                    'Pending', 'pending', 
                    'Dikirim', 'dikirim'
                ]
            }
        });

        // Jika shipment dengan status-status di atas ditemukan, kunci menu!
        if (activeShipment) {
            return res.json({ isProcessing: true });
        }

        // Jika status pengiriman adalah 'Diterima' atau data shipment kosong, baru boleh dihapus
        return res.json({ isProcessing: false });

    } catch (error) {
        res.status(500).json({ message: "Gagal cek status shipment: " + error.message });
    }
};