/**
 * api.js — Konfigurasi GraphQL untuk Sistem MBG
 * Disesuaikan 100% dengan schema tiap microservice.
 *
 * DAPUR     → port 3001  (DapurInput, dapurById, updateDapur, deleteDapur→Boolean)
 * MENU      → port 3002  (flat params, getMenuById(id:Int!), deleteMenu(id:Int!))
 * SEKOLAH   → port 3003  (SekolahInput & UpdateSekolahInput terpisah, sekolahById)
 * INVENTORY → port 3004  (flat params, getInventories, updateInventory→stok only)
 * DISTRIBUSI→ port 3005  (allShipments, shipmentById(id), createShipment, updateShipment, deleteShipment)
 */

const GRAPHQL = {
    DAPUR:      "http://localhost:3001/graphql",
    MENU:       "http://localhost:3002/graphql",
    SEKOLAH:    "http://localhost:3003/graphql",
    INVENTORY:  "http://localhost:3004/graphql",
    DISTRIBUSI: "http://localhost:3005/graphql"
};

async function gql(endpoint, query, variables = {}) {
    if (typeof axios === "undefined") {
        throw new Error("[api.js] axios belum tersedia. Pastikan CDN axios dimuat sebelum api.js.");
    }
    const response = await axios.post(endpoint, { query, variables }, {
        headers: { "Content-Type": "application/json" }
    });
    if (response.data.errors && response.data.errors.length > 0) {
        const msg = response.data.errors.map(e => e.message).join("; ");
        throw new Error(`[GraphQL Error] ${msg}`);
    }
    return response.data.data;
}

const API = {

    // ── DAPUR ──────────────────────────────────────────────────────────────────
    // Query : semuaDapur | dapurById(id_dapur: ID!)
    // Mutation: createDapur(input: DapurInput!) | updateDapur(id_dapur,input) | deleteDapur(id_dapur)→Boolean
    dapur: {
        getAll: () => gql(GRAPHQL.DAPUR, `
            query {
                semuaDapur {
                    id_dapur
                    nama_dapur
                    lokasi
                    kapasitas_porsi
                }
            }
        `),

        getById: (id_dapur) => gql(GRAPHQL.DAPUR, `
            query($id_dapur: ID!) {
                dapurById(id_dapur: $id_dapur) {
                    id_dapur
                    nama_dapur
                    lokasi
                    kapasitas_porsi
                }
            }
        `, { id_dapur }),

        create: (input) => gql(GRAPHQL.DAPUR, `
            mutation($input: DapurInput!) {
                createDapur(input: $input) {
                    id_dapur
                    nama_dapur
                }
            }
        `, { input }),

        update: (id_dapur, input) => gql(GRAPHQL.DAPUR, `
            mutation($id_dapur: ID!, $input: DapurInput!) {
                updateDapur(id_dapur: $id_dapur, input: $input) {
                    id_dapur
                    nama_dapur
                }
            }
        `, { id_dapur, input }),

        // deleteDapur → Boolean (bukan String/MessageResponse)
        delete: (id_dapur) => gql(GRAPHQL.DAPUR, `
            mutation($id_dapur: ID!) {
                deleteDapur(id_dapur: $id_dapur)
            }
        `, { id_dapur })
    },

    // ── SEKOLAH ────────────────────────────────────────────────────────────────
    // Query : semuaSekolah | sekolahById(id_sekolah: ID!)
    // Mutation: createSekolah(input: SekolahInput!) | updateSekolah(id_sekolah, input: UpdateSekolahInput!) | deleteSekolah→Boolean
    // UpdateSekolahInput hanya: nama_sekolah, alamat_sekolah, jumlah_siswa  (TIDAK ada npsn & jenjang)
    sekolah: {
        getAll: () => gql(GRAPHQL.SEKOLAH, `
            query {
                semuaSekolah {
                    id_sekolah
                    npsn
                    nama_sekolah
                    alamat_sekolah
                    jenjang
                    jumlah_siswa
                }
            }
        `),

        getById: (id_sekolah) => gql(GRAPHQL.SEKOLAH, `
            query($id_sekolah: ID!) {
                sekolahById(id_sekolah: $id_sekolah) {
                    id_sekolah
                    npsn
                    nama_sekolah
                    alamat_sekolah
                    jenjang
                    jumlah_siswa
                }
            }
        `, { id_sekolah }),

        create: (input) => gql(GRAPHQL.SEKOLAH, `
            mutation($input: SekolahInput!) {
                createSekolah(input: $input) {
                    id_sekolah
                    nama_sekolah
                }
            }
        `, { input }),

        // update memakai UpdateSekolahInput (bukan SekolahInput) — hanya 3 field
        update: (id_sekolah, input) => gql(GRAPHQL.SEKOLAH, `
            mutation($id_sekolah: ID!, $input: UpdateSekolahInput!) {
                updateSekolah(id_sekolah: $id_sekolah, input: $input) {
                    id_sekolah
                    nama_sekolah
                }
            }
        `, { id_sekolah, input }),

        delete: (id_sekolah) => gql(GRAPHQL.SEKOLAH, `
            mutation($id_sekolah: ID!) {
                deleteSekolah(id_sekolah: $id_sekolah)
            }
        `, { id_sekolah })
    },

    // ── MENU ───────────────────────────────────────────────────────────────────
    // Query : getSemuaMenu | getMenuById(id: Int!)
    // Mutation: createMenu(nama_paket, deskripsi) | updateMenu(id, nama_paket, deskripsi) | deleteMenu(id: Int!)→Boolean
    // CATATAN: schema Menu TIDAK punya id_dapur dan TIDAK bisa simpan MenuRecipes lewat mutation ini.
    //          MenuRecipe hanya punya: id_recipe, id_menu, id_inventory, jumlah_kebutuhan
    //          (tidak ada nama_bahan / satuan di schema Menu service)
    menu: {
        getAll: () => gql(GRAPHQL.MENU, `
            query {
                getSemuaMenu {
                    id_menu
                    nama_paket
                    deskripsi
                    MenuRecipes {
                        id_recipe
                        id_inventory
                        jumlah_kebutuhan
                    }
                }
            }
        `),

        getById: (id) => gql(GRAPHQL.MENU, `
            query($id: Int!) {
                getMenuById(id: $id) {
                    id_menu
                    nama_paket
                    deskripsi
                    MenuRecipes {
                        id_recipe
                        id_inventory
                        jumlah_kebutuhan
                    }
                }
            }
        `, { id: parseInt(id) }),

        // flat params — tidak ada input object
        create: (nama_paket, deskripsi) => gql(GRAPHQL.MENU, `
            mutation($nama_paket: String!, $deskripsi: String) {
                createMenu(nama_paket: $nama_paket, deskripsi: $deskripsi) {
                    id_menu
                    nama_paket
                }
            }
        `, { nama_paket, deskripsi }),

        // flat params — tidak ada input object, tidak ada MenuRecipes
        update: (id, nama_paket, deskripsi) => gql(GRAPHQL.MENU, `
            mutation($id: Int!, $nama_paket: String, $deskripsi: String) {
                updateMenu(id: $id, nama_paket: $nama_paket, deskripsi: $deskripsi) {
                    id_menu
                    nama_paket
                }
            }
        `, { id: parseInt(id), nama_paket, deskripsi }),

        delete: (id) => gql(GRAPHQL.MENU, `
            mutation($id: Int!) {
                deleteMenu(id: $id)
            }
        `, { id: parseInt(id) })
    },

    // ── INVENTORY ──────────────────────────────────────────────────────────────
    // Query : getInventories | getInventoryByDapur(id_dapur: Int!)
    // Mutation: createInventory(flat) | updateInventory(id_inventory, stok)→Inventory | deleteInventory(id_inventory)→String
    inventory: {
        getAll: () => gql(GRAPHQL.INVENTORY, `
            query {
                getInventories {
                    id_inventory
                    id_dapur
                    nama_bahan
                    stok
                    satuan
                }
            }
        `),

        getByDapur: (id_dapur) => gql(GRAPHQL.INVENTORY, `
            query($id_dapur: Int!) {
                getInventoryByDapur(id_dapur: $id_dapur) {
                    id_inventory
                    id_dapur
                    nama_bahan
                    stok
                    satuan
                }
            }
        `, { id_dapur: parseInt(id_dapur) }),

        create: ({ id_dapur, nama_bahan, stok, satuan }) => gql(GRAPHQL.INVENTORY, `
            mutation($id_dapur: Int!, $nama_bahan: String!, $stok: Float!, $satuan: String!) {
                createInventory(id_dapur: $id_dapur, nama_bahan: $nama_bahan, stok: $stok, satuan: $satuan) {
                    id_inventory
                    nama_bahan
                }
            }
        `, { id_dapur: parseInt(id_dapur), nama_bahan, stok: parseFloat(stok), satuan }),

        // schema updateInventory hanya terima stok
        update: (id_inventory, stok) => gql(GRAPHQL.INVENTORY, `
            mutation($id_inventory: ID!, $stok: Float!) {
                updateInventory(id_inventory: $id_inventory, stok: $stok) {
                    id_inventory
                    stok
                }
            }
        `, { id_inventory, stok: parseFloat(stok) }),

        delete: (id_inventory) => gql(GRAPHQL.INVENTORY, `
            mutation($id_inventory: ID!) {
                deleteInventory(id_inventory: $id_inventory)
            }
        `, { id_inventory })
    },

    // ── DISTRIBUSI (Shipment) ──────────────────────────────────────────────────
    // Query : allShipments | shipmentById(id: ID!)
    // Mutation: createShipment(flat, pakai "status" bukan "status_kirim")
    //           updateShipment(id, flat, pakai "status") → MessageResponse {message}
    //           deleteShipment(id) → MessageResponse {message}
    // Field Shipment: id_shipment, id_sekolah, id_dapur, id_menu, jumlah_porsi,
    //                 status_kirim, waktu_sampai, nama_sekolah, nama_dapur, nama_menu
    distribusi: {
        getAll: () => gql(GRAPHQL.DISTRIBUSI, `
            query {
                allShipments {
                    id_shipment
                    id_sekolah
                    id_dapur
                    id_menu
                    jumlah_porsi
                    status_kirim
                    waktu_sampai
                    nama_sekolah
                    nama_dapur
                    nama_menu
                }
            }
        `),

        getById: (id) => gql(GRAPHQL.DISTRIBUSI, `
            query($id: ID!) {
                shipmentById(id: $id) {
                    id_shipment
                    id_sekolah
                    id_dapur
                    id_menu
                    jumlah_porsi
                    status_kirim
                    waktu_sampai
                    nama_sekolah
                    nama_dapur
                    nama_menu
                }
            }
        `, { id }),

        // "status" bukan "status_kirim" — sesuai nama param di schema createShipment
        create: ({ id_sekolah, id_dapur, id_menu, jumlah_porsi, status_kirim, waktu_sampai }) =>
            gql(GRAPHQL.DISTRIBUSI, `
                mutation(
                    $id_sekolah: ID!
                    $id_dapur: ID!
                    $id_menu: ID!
                    $jumlah_porsi: Int
                    $status: String
                    $waktu_sampai: String
                ) {
                    createShipment(
                        id_sekolah: $id_sekolah
                        id_dapur: $id_dapur
                        id_menu: $id_menu
                        jumlah_porsi: $jumlah_porsi
                        status: $status
                        waktu_sampai: $waktu_sampai
                    ) {
                        id_shipment
                    }
                }
            `, {
                id_sekolah, id_dapur, id_menu,
                jumlah_porsi: parseInt(jumlah_porsi),
                status: status_kirim,   // mapping: status_kirim → status
                waktu_sampai: waktu_sampai || null
            }),

        // updateShipment → MessageResponse {message}, param "id" dan "status"
        update: (id, { id_sekolah, id_dapur, id_menu, jumlah_porsi, status_kirim, waktu_sampai }) =>
            gql(GRAPHQL.DISTRIBUSI, `
                mutation(
                    $id: ID!
                    $id_sekolah: ID
                    $id_dapur: ID
                    $id_menu: ID
                    $jumlah_porsi: Int
                    $status: String
                    $waktu_sampai: String
                ) {
                    updateShipment(
                        id: $id
                        id_sekolah: $id_sekolah
                        id_dapur: $id_dapur
                        id_menu: $id_menu
                        jumlah_porsi: $jumlah_porsi
                        status: $status
                        waktu_sampai: $waktu_sampai
                    ) {
                        message
                    }
                }
            `, {
                id, id_sekolah, id_dapur, id_menu,
                jumlah_porsi: jumlah_porsi ? parseInt(jumlah_porsi) : null,
                status: status_kirim,
                waktu_sampai: waktu_sampai || null
            }),

        // deleteShipment(id) → MessageResponse {message}
        delete: (id) => gql(GRAPHQL.DISTRIBUSI, `
            mutation($id: ID!) {
                deleteShipment(id: $id) {
                    message
                }
            }
        `, { id })
    }
};

window.API = API;
console.log("[api.js] API object berhasil dimuat.", Object.keys(API));
