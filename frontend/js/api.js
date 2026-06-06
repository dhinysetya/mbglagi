const BASE_URL = {
    DAPUR: "http://localhost:3001/api/dapur",
    MENU: "http://localhost:3002/api/menu",
    INVENTORY: "http://localhost:3004/api/inventory",
    SEKOLAH: "http://localhost:3003/api/sekolah",
    DISTRIBUSI: "http://localhost:3005/api/distribusi"
};

const API = {
    dapur: {
        getAll: () => axios.get(`${BASE_URL.DAPUR}/dapur`),
        create: (data) => axios.post(`${BASE_URL.DAPUR}/dapur`, data),
        delete: (id) => axios.delete(`${BASE_URL.DAPUR}/dapur/${id}`)
    },
    menu: {
        getAll: () => axios.get(`${BASE_URL.MENU}/menus`),
        create: (data) => axios.post(`${BASE_URL.MENU}/menus`, data),
        delete: (id) => axios.delete(`${BASE_URL.MENU}/menus/${id}`)
    },
    inventory: {
        getAll: () => axios.get(`${BASE_URL.INVENTORY}/inventories`),
        create: (data) => axios.post(`${BASE_URL.INVENTORY}/inventories`, data),
        delete: (id) => axios.delete(`${BASE_URL.INVENTORY}/inventories/${id}`)
    },
    sekolah: {
        getAll: () => axios.get(`${BASE_URL.SEKOLAH}/sekolah`),
        create: (data) => axios.post(`${BASE_URL.SEKOLAH}/sekolah`, data)
    },
    distribusi: {
        getAll: () => axios.get(`${BASE_URL.DISTRIBUSI}/distribusi`),
        create: (data) => axios.post(`${BASE_URL.DISTRIBUSI}/distribusi`, data),
        delete: (id) => axios.delete(`${BASE_URL.DISTRIBUSI}/distribusi/${id}`)
    }
};