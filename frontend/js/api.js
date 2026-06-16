const GRAPHQL = {
    DAPUR: "http://localhost:3001/graphql",
    MENU: "http://localhost:3002/graphql",
    SEKOLAH: "http://localhost:3003/graphql",
    INVENTORY: "http://localhost:3004/graphql",
    DISTRIBUSI: "http://localhost:3005/graphql"
};

async function gql(endpoint, query, variables = {}) {
    const response = await axios.post(endpoint, {
        query,
        variables
    });

    if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
    }

    return response.data.data;
}

const API = {
    dapur: {
        getAll: () =>
            gql(
                GRAPHQL.DAPUR,
                `
                query {
                    semuaDapur {
                        id_dapur
                        nama_dapur
                        lokasi
                        kapasitas_porsi
                    }
                }
                `
            ),

        create: (input) =>
            gql(
                GRAPHQL.DAPUR,
                `
                mutation($input:DapurInput!){
                    createDapur(input:$input){
                        id_dapur
                    }
                }
                `,
                { input }
            ),

        delete: (id_dapur) =>
            gql(
                GRAPHQL.DAPUR,
                `
                mutation($id_dapur:ID!){
                    deleteDapur(id_dapur:$id_dapur)
                }
                `,
                { id_dapur }
            )
    },

    sekolah: {
        getAll: () =>
            gql(
                GRAPHQL.SEKOLAH,
                `
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
                `
            ),

        create: (input) =>
            gql(
                GRAPHQL.SEKOLAH,
                `
                mutation($input:SekolahInput!){
                    createSekolah(input:$input){
                        id_sekolah
                    }
                }
                `,
                { input }
            )
    },

    menu: {
        getAll: () =>
            gql(
                GRAPHQL.MENU,
                `
                query {
                    getSemuaMenu {
                        id_menu
                        nama_paket
                        deskripsi
                    }
                }
                `
            ),

        create: (nama_paket, deskripsi) =>
            gql(
                GRAPHQL.MENU,
                `
                mutation($nama_paket:String!,$deskripsi:String){
                    createMenu(
                        nama_paket:$nama_paket,
                        deskripsi:$deskripsi
                    ){
                        id_menu
                    }
                }
                `,
                { nama_paket, deskripsi }
            ),

        delete: (id) =>
            gql(
                GRAPHQL.MENU,
                `
                mutation($id:Int!){
                    deleteMenu(id:$id)
                }
                `,
                { id }
            )
    },

    inventory: {
        getAll: () =>
            gql(
                GRAPHQL.INVENTORY,
                `
                query {
                    semuaInventory {
                        id_inventory
                        id_dapur
                        nama_bahan
                        stok
                        satuan
                    }
                }
                `
            ),

        create: (input) =>
            gql(
                GRAPHQL.INVENTORY,
                `
                mutation($input:InventoryInput!){
                    createInventory(input:$input){
                        id_inventory
                    }
                }
                `,
                { input }
            ),

        delete: (id) =>
            gql(
                GRAPHQL.INVENTORY,
                `
                mutation($id:ID!){
                    deleteInventory(id:$id)
                }
                `,
                { id }
            )
    },

    distribusi: {
        getAll: () =>
            gql(
                GRAPHQL.DISTRIBUSI,
                `
                query {
                    semuaDistribusi {
                        id_distribusi
                        id_menu
                        id_dapur
                        jumlah_distribusi
                        tanggal_distribusi
                    }
                }
                `
            ),

        create: (input) =>
            gql(
                GRAPHQL.DISTRIBUSI,
                `
                mutation($input:DistribusiInput!){
                    createDistribusi(input:$input){
                        id_distribusi
                    }
                }
                `,
                { input }
            ),

        delete: (id_distribusi) =>
            gql(
                GRAPHQL.DISTRIBUSI,
                `
                mutation($id_distribusi:ID!){
                    deleteDistribusi(id_distribusi:$id_distribusi)
                }
                `,
                { id_distribusi }
            )
    }
};