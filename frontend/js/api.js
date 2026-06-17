/**
 * api.js — Konfigurasi GraphQL untuk Sistem MBG
 * Disesuaikan 100% dengan schema tiap microservice.
 *
 * DAPUR     → port 3001  (DapurInput, dapurById(id_dapur), updateDapur, deleteDapur→Boolean)
 * MENU      → port 3002  (flat params, getMenuById(id:Int!), deleteMenu(id:Int!)→Boolean)
 * SEKOLAH   → port 3003  (SekolahInput & UpdateSekolahInput terpisah, sekolahById(id_sekolah))
 * INVENTORY → port 3004  (flat params, getInventories, getInventoryById, updateInventory→stok only)
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

        delete: (id_dapur) => gql(GRAPHQL.DAPUR, `
            mutation($id_dapur: ID!) {
                deleteDapur(id_dapur: $id_dapur)
            }
        `, { id_dapur })
    },

    // ── SEKOLAH ────────────────────────────────────────────────────────────────
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
        menuRecipe: {

            create: ({ id_menu, id_inventory, jumlah_kebutuhan }) =>
                gql(GRAPHQL.MENU, `
                    mutation(
                        $id_menu:Int!,
                        $id_inventory:Int!,
                        $jumlah_kebutuhan:Float!
                    ){
                        createMenuRecipe(
                            id_menu:$id_menu,
                            id_inventory:$id_inventory,
                            jumlah_kebutuhan:$jumlah_kebutuhan
                        ){
                            id_recipe
                        }
                    }
                `,{
                    id_menu,
                    id_inventory,
                    jumlah_kebutuhan
                }),

            deleteByMenu:(id_menu)=>
                gql(GRAPHQL.MENU,`
                    mutation($id_menu:Int!){
                        deleteMenuRecipeByMenu(
                            id_menu:$id_menu
                        )
                    }
                `,{
                    id_menu
                })

        },

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

        create: (nama_paket, deskripsi) => gql(GRAPHQL.MENU, `
            mutation($nama_paket: String!, $deskripsi: String) {
                createMenu(nama_paket: $nama_paket, deskripsi: $deskripsi) {
                    id_menu
                    nama_paket
                }
            }
        `, { nama_paket, deskripsi }),

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

        getById: (id_inventory) => gql(GRAPHQL.INVENTORY, `
            query($id_inventory: ID!) {
                getInventoryById(id_inventory: $id_inventory) {
                    id_inventory
                    id_dapur
                    nama_bahan
                    stok
                    satuan
                }
            }
        `, { id_inventory: String(id_inventory) }),

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
                    createdAt
                    updatedAt
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
                    createdAt
                    updatedAt
                }
            }
        `, { id }),

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
                status: status_kirim,
                waktu_sampai: waktu_sampai || null
            }),

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
