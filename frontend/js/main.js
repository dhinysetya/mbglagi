/**
 * main.js — Logic Frontend Sistem MBG
 * Semua CRUD menggunakan object API dari api.js (GraphQL).
 * Disesuaikan 100% dengan schema dan api.js.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("[main.js] DOMContentLoaded — inisialisasi...");

    if (typeof API === "undefined") {
        console.error(
            "[main.js] FATAL: API tidak terdefinisi!\n" +
            "Pastikan:\n" +
            "  1. <script src='js/api.js'> ada SEBELUM <script src='js/main.js'>\n" +
            "  2. File api.js tidak ada error (cek tab Network & Console)\n" +
            "  3. Axios CDN dimuat SEBELUM api.js"
        );
        return;
    }

    // Panggil semua fetch dengan logging
    fetchDapur();
    fetchSekolah();
    fetchMenu();
    fetchInventory();
    fetchDistribusi();

    // Setup form (hanya akan aktif jika elemen form ada)
    setupFormDapur();
    setupFormSekolah();
    setupFormMenu();
    setupFormInventory();
    setupFormDistribusi();

    // Dropdown helpers
    fillDapurDropdown();
    fillDistribusiDropdowns();
});


// ═══════════════════════════════════════════════════════════════════════════════
// DAPUR
// ═══════════════════════════════════════════════════════════════════════════════

async function fetchDapur() {
    console.log("[fetchDapur] Dipanggil...");
    const containerGrid = document.getElementById('dapur-container');
    const tableBody     = document.getElementById('table-body-dapur');
    if (!containerGrid && !tableBody) {
        console.warn("[fetchDapur] Tidak ada container/tbody, skip.");
        return;
    }

    try {
        const data = await API.dapur.getAll();
        const list = data.semuaDapur || [];
        console.log("[fetchDapur] Data diterima:", list);

        if (containerGrid) {
            if (list.length === 0) {
                containerGrid.innerHTML = `<div class="col-span-full py-20 text-center text-gray-400">Belum ada unit dapur terdaftar.</div>`;
            } else {
                containerGrid.innerHTML = list.map(k => `
                    <div class="bg-white p-8 rounded-[35px] shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
                        <div class="flex justify-between items-start mb-6">
                            <div class="bg-blue-50 p-4 rounded-2xl group-hover:bg-[#113F67] transition-colors">
                                <i class="fa-solid fa-kitchen-set text-[#113F67] text-2xl group-hover:text-white"></i>
                            </div>
                            <span class="text-[10px] font-black text-gray-300 uppercase tracking-widest">ID: ${k.id_dapur}</span>
                        </div>
                        <h3 class="text-2xl font-bold text-[#113F67] mb-2">${k.nama_dapur}</h3>
                        <p class="text-gray-500 text-sm mb-6 flex items-center gap-2">
                            <i class="fa-solid fa-location-dot text-[#33A1E0]"></i> ${k.lokasi || '-'}
                        </p>
                        <div class="flex justify-between items-center mt-6 pt-6 border-t border-gray-50">
                            <div>
                                <p class="text-[10px] font-bold text-gray-400 uppercase mb-1">Kapasitas</p>
                                <p class="font-bold text-[#113F67]">${k.kapasitas_porsi} Porsi</p>
                            </div>
                            <button onclick="deleteDapur(${k.id_dapur})" 
                                class="w-10 h-10 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                `).join('');
            }
        }

        if (tableBody) {
            if (list.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="3" class="px-8 py-10 text-center text-gray-400">Belum ada data unit dapur.</td></tr>`;
            } else {
                tableBody.innerHTML = list.map(k => `
                    <tr class="hover:bg-gray-50 transition-colors">
                        <td class="px-8 py-4">
                            <div class="font-bold text-[#113F67]">${k.nama_dapur}</div>
                            <div class="text-[11px] text-gray-400 mt-1"><i class="fa-solid fa-map-pin"></i> ${k.lokasi || '-'}</div>
                        </td>
                        <td class="px-8 py-4 text-center">
                            <span class="font-bold text-gray-700">${k.kapasitas_porsi}</span>
                            <span class="text-[10px] text-gray-400 block uppercase">Porsi/Hari</span>
                        </td>
                        <td class="px-8 py-4 text-center">
                            <div class="flex justify-center gap-2">
                                <button onclick="editDapur(${k.id_dapur})" 
                                    class="w-9 h-9 rounded-lg bg-blue-50 text-blue-400 hover:bg-blue-500 hover:text-white transition-all">
                                    <i class="fa-solid fa-pencil text-xs"></i>
                                </button>
                                <button onclick="deleteDapur(${k.id_dapur})" 
                                    class="w-9 h-9 rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                                    <i class="fa-solid fa-trash-can text-xs"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('');
            }
        }

    } catch (err) {
        console.error("[fetchDapur] Error:", err);
        if (containerGrid) {
            containerGrid.innerHTML = `<div class="col-span-full text-center text-red-500 py-10">Gagal memuat data dapur: ${err.message}</div>`;
        }
    }
}

async function setupFormDapur() {
    const form = document.getElementById('form-dapur');
    if (!form) return;

    const editId = new URLSearchParams(window.location.search).get('id');

    if (editId) {
        const formTitle = document.querySelector('h3');
        const submitBtn = form.querySelector('button[type="submit"]');
        if (formTitle) formTitle.innerText = "Edit Unit Dapur";
        if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-save mr-2"></i>Simpan Perubahan';

        try {
            const data = await API.dapur.getById(editId);
            const k = data.dapurById;
            document.getElementById('nama_dapur').value      = k.nama_dapur      || '';
            document.getElementById('kapasitas_porsi').value = k.kapasitas_porsi  || 0;
            document.getElementById('lokasi').value          = k.lokasi           || '';
        } catch (err) {
            console.error("[setupFormDapur] Gagal load data edit:", err);
            alert("Gagal memuat data dapur untuk diedit.");
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const input = {
            nama_dapur:      document.getElementById('nama_dapur').value,
            lokasi:          document.getElementById('lokasi').value,
            kapasitas_porsi: parseInt(document.getElementById('kapasitas_porsi').value)
        };

        try {
            if (editId) {
                await API.dapur.update(editId, input);
                alert("Unit Dapur berhasil diperbarui!");
                window.location.href = 'dapur.html';
            } else {
                await API.dapur.create(input);
                alert("Unit Dapur berhasil ditambahkan!");
                form.reset();
                fetchDapur();
            }
        } catch (err) {
            console.error("[setupFormDapur] Gagal simpan:", err);
            alert("Terjadi kesalahan saat menyimpan data dapur.");
        }
    });
}

async function deleteDapur(id) {
    if (!confirm('Hapus unit dapur ini?')) return;
    try {
        await API.dapur.delete(id);
        fetchDapur();
    } catch (err) {
        console.error("[deleteDapur] Error:", err);
        alert("Gagal menghapus unit dapur.");
    }
}

function editDapur(id) {
    window.location.href = `crudDapur.html?id=${id}`;
}


// ═══════════════════════════════════════════════════════════════════════════════
// SEKOLAH
// ═══════════════════════════════════════════════════════════════════════════════

async function fetchSekolah() {
    console.log("[fetchSekolah] Dipanggil...");
    const containerGrid = document.getElementById('sekolah-container');
    const tableBody     = document.getElementById('table-body-sekolah');
    const countText     = document.getElementById('count-sekolah');
    if (!containerGrid && !tableBody) return;

    try {
        const data = await API.sekolah.getAll();
        const list = data.semuaSekolah || [];
        console.log("[fetchSekolah] Data diterima:", list);

        if (countText) countText.innerText = `${list.length} Terdaftar`;

        if (tableBody) {
            if (list.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="5" class="px-8 py-10 text-center text-gray-400">Data Kosong</td></tr>`;
            } else {
                tableBody.innerHTML = list.map(s => `
                    <tr class="hover:bg-gray-50 transition-colors text-sm">
                        <td class="px-8 py-4 font-mono text-gray-400">${s.npsn || '-'}</td>
                        <td class="px-8 py-4 font-bold text-[#113F67]">${s.nama_sekolah}</td>
                        <td class="px-8 py-4 text-center">
                            <span class="bg-gray-100 px-2 py-1 rounded text-[10px]">${s.jenjang || '-'}</span>
                        </td>
                        <td class="px-8 py-4 text-center font-bold text-gray-600">${s.jumlah_siswa}</td>
                        <td class="px-8 py-4 text-center">
                            <div class="flex justify-center gap-2">
                                <button onclick="editSekolah(${s.id_sekolah})" 
                                    class="w-8 h-8 rounded-lg bg-blue-50 text-blue-400 hover:bg-blue-500 hover:text-white transition-all">
                                    <i class="fa-solid fa-pencil text-xs"></i>
                                </button>
                                <button onclick="deleteSekolah(${s.id_sekolah})" 
                                    class="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                                    <i class="fa-solid fa-trash-can text-xs"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('');
            }
        }

        if (containerGrid) {
            if (list.length === 0) {
                containerGrid.innerHTML = `<div class="col-span-full py-20 text-center text-gray-400">Belum ada sekolah terdaftar.</div>`;
            } else {
                containerGrid.innerHTML = list.map(s => `
                    <div class="bg-white p-8 rounded-[35px] shadow-sm border border-gray-100">
                        <h3 class="text-xl font-bold text-[#113F67]">${s.nama_sekolah}</h3>
                        <p class="text-gray-400 text-xs mb-4">NPSN: ${s.npsn}</p>
                        <div class="flex justify-between items-center pt-4 border-t border-gray-50">
                            <span class="text-sm font-bold text-blue-500">${s.jumlah_siswa} Siswa</span>
                            <span class="text-xs bg-gray-50 px-3 py-1 rounded-full text-gray-400">${s.jenjang}</span>
                        </div>
                    </div>
                `).join('');
            }
        }

    } catch (err) {
        console.error("[fetchSekolah] Error:", err);
        if (containerGrid) {
            containerGrid.innerHTML = `<div class="col-span-full text-center text-red-500 py-10">Gagal memuat data sekolah: ${err.message}</div>`;
        }
    }
}

async function setupFormSekolah() {
    const form = document.getElementById('form-sekolah');
    if (!form) return;

    const editId = new URLSearchParams(window.location.search).get('id');

    if (editId) {
        const formTitle = document.querySelector('h3');
        const submitBtn = form.querySelector('button[type="submit"]');
        if (formTitle) formTitle.innerText = "Edit Data Sekolah";
        if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-save mr-2"></i>Simpan Perubahan';

        try {
            const data = await API.sekolah.getById(editId);
            const s = data.sekolahById;
            document.getElementById('npsn').value           = s.npsn            || '';
            document.getElementById('nama_sekolah').value   = s.nama_sekolah    || '';
            document.getElementById('jenjang').value        = s.jenjang         || 'SD';
            document.getElementById('jumlah_siswa').value   = s.jumlah_siswa    || 0;
            document.getElementById('alamat_sekolah').value = s.alamat_sekolah  || '';
        } catch (err) {
            console.error("[setupFormSekolah] Gagal load:", err);
            alert("Gagal memuat data sekolah untuk diedit.");
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const input = {
            npsn:           document.getElementById('npsn').value,
            nama_sekolah:   document.getElementById('nama_sekolah').value,
            jenjang:        document.getElementById('jenjang').value,
            jumlah_siswa:   parseInt(document.getElementById('jumlah_siswa').value),
            alamat_sekolah: document.getElementById('alamat_sekolah').value
        };

        try {
            if (editId) {
                await API.sekolah.update(editId, input);
                alert("Data Sekolah berhasil diperbarui!");
                window.location.href = 'sekolah.html';
            } else {
                await API.sekolah.create(input);
                alert("Sekolah berhasil ditambahkan!");
                form.reset();
                fetchSekolah();
            }
        } catch (err) {
            console.error("[setupFormSekolah] Gagal simpan:", err);
            alert("Gagal memproses data sekolah.");
        }
    });
}

function editSekolah(id) {
    window.location.href = `crudSekolah.html?id=${id}`;
}

async function deleteSekolah(id) {
    if (!confirm('Hapus data sekolah ini?')) return;
    try {
        await API.sekolah.delete(id);
        fetchSekolah();
    } catch (err) {
        console.error("[deleteSekolah] Error:", err);
        alert("Gagal menghapus data sekolah.");
    }
}


// ═══════════════════════════════════════════════════════════════════════════════
// MENU
// ═══════════════════════════════════════════════════════════════════════════════

async function fetchMenu() {
    console.log("[fetchMenu] Dipanggil...");
    const containerGrid = document.getElementById('menu-container');
    const tableBody     = document.getElementById('table-body-menu');
    const countMenu     = document.getElementById('count-menu');
    if (!containerGrid && !tableBody) return;

    try {
        const data = await API.menu.getAll();
        const list = data.getSemuaMenu || [];
        console.log("[fetchMenu] Data diterima:", list);

        if (countMenu) countMenu.innerText = `${list.length} Menu Terdaftar`;

        if (containerGrid) {
            if (list.length === 0) {
                containerGrid.innerHTML = `<div class="col-span-full flex flex-col items-center justify-center py-32 opacity-50">
                    <i class="fa-solid fa-bowl-food text-gray-300 text-5xl mb-4"></i>
                    <p class="text-gray-400 font-bold italic">Belum ada menu terdaftar.</p>
                    <a href="crudMenu.html" class="mt-4 bg-[#113F67] text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-[#33A1E0] transition-all">
                        + Tambah Menu Pertama
                    </a>
                </div>`;
            } else {
                containerGrid.innerHTML = list.map(m => {
                    const recipes = m.MenuRecipes || [];
                    const recipeHtml = recipes.length > 0
                        ? recipes.map(r => `
                            <span class="text-[9px] bg-gray-50 px-2 py-1 rounded-md text-gray-500 border border-gray-100">
                                Bahan ID: ${r.id_inventory} (${r.jumlah_kebutuhan})
                            </span>`).join('')
                        : '<span class="text-[9px] text-gray-300 italic">Belum ada resep</span>';

                    return `
                    <div class="bg-white p-6 rounded-[30px] shadow-sm border border-gray-100 hover:shadow-md transition-all">
                        <div class="flex justify-between items-start mb-4">
                            <span class="bg-blue-50 text-blue-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase">Paket Menu</span>
                            <p class="text-xs text-gray-400 italic">ID: ${m.id_menu}</p>
                        </div>
                        <h3 class="text-xl font-bold text-[#113F67] mb-1">${m.nama_paket}</h3>
                        <p class="text-gray-400 text-xs mb-4 line-clamp-2">${m.deskripsi || 'Tanpa deskripsi'}</p>
                        <div class="pt-4 border-t border-gray-50">
                            <p class="text-[10px] font-black text-gray-300 uppercase mb-2">Komposisi Bahan:</p>
                            <div class="flex flex-wrap gap-1">${recipeHtml}</div>
                        </div>
                        <div class="flex justify-end gap-2 mt-4">
                            <button onclick="editMenu(${m.id_menu})" 
                                class="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center">
                                <i class="fa-solid fa-pen-to-square text-xs"></i>
                            </button>
                            <button onclick="deleteMenu(${m.id_menu})" 
                                class="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center">
                                <i class="fa-solid fa-trash-can text-xs"></i>
                            </button>
                        </div>
                    </div>
                `}).join('');
            }
        }

        if (tableBody) {
            if (list.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="3" class="px-8 py-10 text-center text-gray-400 italic">Belum ada menu.</td></tr>`;
            } else {
                tableBody.innerHTML = list.map(m => `
                    <tr class="hover:bg-gray-50 transition-colors">
                        <td class="px-8 py-4 font-bold text-[#113F67]">${m.nama_paket}</td>
                        <td class="px-8 py-4 text-xs text-gray-500">${m.deskripsi || '-'}</td>
                        <td class="px-8 py-4 text-center">
                            <div class="flex justify-center gap-2">
                                <button onclick="editMenu(${m.id_menu})" 
                                    class="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center">
                                    <i class="fa-solid fa-pen-to-square text-xs"></i>
                                </button>
                                <button onclick="deleteMenu(${m.id_menu})" 
                                    class="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center">
                                    <i class="fa-solid fa-trash-can text-xs"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('');
            }
        }

    } catch (err) {
        console.error("[fetchMenu] Error:", err);
        if (containerGrid) {
            containerGrid.innerHTML = `<div class="col-span-full text-center text-red-500 py-10">Gagal memuat data menu: ${err.message}</div>`;
        }
    }
}

async function setupFormMenu() {
    const form = document.getElementById('form-menu');
    if (!form) return;

    const editId = document.getElementById('id_menu')?.value || new URLSearchParams(window.location.search).get('id');

    if (editId) {
        const formTitle = document.querySelector('h3');
        const submitBtn = form.querySelector('button[type="submit"]');
        if (formTitle) formTitle.innerText = "Edit Menu";
        if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-save mr-2"></i>Simpan Perubahan';

        try {
            const data = await API.menu.getById(editId);
            const m = data.getMenuById;
            document.getElementById('nama_paket').value = m.nama_paket || '';
            document.getElementById('deskripsi').value   = m.deskripsi || '';
            const hiddenId = document.getElementById('id_menu');
            if (hiddenId) hiddenId.value = m.id_menu;
        } catch (err) {
            console.error("[setupFormMenu] Gagal load:", err);
            alert("Gagal memuat data menu untuk diedit.");
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nama_paket = document.getElementById('nama_paket').value;
        const deskripsi  = document.getElementById('deskripsi').value;
        const idMenu     = document.getElementById('id_menu')?.value;

        try {
            if (idMenu) {
                await API.menu.update(idMenu, nama_paket, deskripsi);
                alert("Menu berhasil diperbarui!");
                window.location.href = 'menu.html';
            } else {
                await API.menu.create(nama_paket, deskripsi);
                alert("Menu berhasil disimpan!");
                form.reset();
                fetchMenu();
            }
        } catch (err) {
            console.error("[setupFormMenu] Gagal:", err);
            alert("Error: " + err.message);
        }
    });
}

async function editMenu(id) {
    window.location.href = `crudMenu.html?id=${id}`;
}

async function deleteMenu(id) {
    if (!confirm('Hapus menu ini?')) return;
    try {
        await API.menu.delete(id);
        fetchMenu();
    } catch (err) {
        console.error("[deleteMenu] Error:", err);
        alert("Gagal menghapus menu.");
    }
}


// ═══════════════════════════════════════════════════════════════════════════════
// INVENTORY
// ═══════════════════════════════════════════════════════════════════════════════

async function fetchInventory() {
    console.log("[fetchInventory] Dipanggil...");
    const containerGrid = document.getElementById('inventory-container');
    const tableBody     = document.getElementById('table-body-inventory');
    if (!containerGrid && !tableBody) return;

    try {
        const data = await API.inventory.getAll();
        const list = data.getInventories || [];
        console.log("[fetchInventory] Data diterima:", list);

        if (containerGrid) {
            if (list.length === 0) {
                containerGrid.innerHTML = `<div class="col-span-full py-20 text-center opacity-50 text-gray-400">Belum ada bahan baku terdaftar.</div>`;
            } else {
                containerGrid.innerHTML = list.map(i => `
                    <div class="bg-white p-6 rounded-[30px] shadow-sm border border-gray-100 hover:shadow-md transition-all">
                        <div class="flex justify-between items-start mb-4">
                            <div class="bg-blue-50 p-3 rounded-xl">
                                <i class="fa-solid fa-boxes-stacked text-[#113F67] text-lg"></i>
                            </div>
                            <span class="text-[10px] font-black text-gray-300 uppercase tracking-widest">ID: ${i.id_inventory}</span>
                        </div>
                        <h3 class="text-lg font-bold text-[#113F67] mb-1">${i.nama_bahan}</h3>
                        <p class="text-xs text-gray-400 mb-4 flex items-center gap-1">
                            <i class="fa-solid fa-kitchen-set text-[#33A1E0]"></i> Dapur ID: ${i.id_dapur}
                        </p>
                        <div class="flex justify-between items-center pt-4 border-t border-gray-50">
                            <div>
                                <p class="text-[10px] font-bold text-gray-400 uppercase mb-1">Stok Tersedia</p>
                                <p class="font-black text-[#113F67]">${i.stok} <span class="text-xs font-normal text-gray-400">${i.satuan}</span></p>
                            </div>
                            <span class="text-[10px] bg-green-50 text-green-600 font-bold px-3 py-1 rounded-full uppercase">${i.satuan}</span>
                        </div>
                    </div>
                `).join('');
            }
        }

        if (tableBody) {
            if (list.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="4" class="px-8 py-10 text-center text-gray-400">Belum ada bahan baku terdaftar.</td></tr>`;
            } else {
                tableBody.innerHTML = list.map(i => `
                    <tr class="hover:bg-gray-50 transition-colors text-sm">
                        <td class="px-8 py-5 font-bold text-[#113F67]">${i.nama_bahan}</td>
                        <td class="px-8 py-5">
                            <span class="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-lg">
                                <i class="fa-solid fa-house-chimney text-[10px] mr-1"></i> Dapur #${i.id_dapur}
                            </span>
                        </td>
                        <td class="px-8 py-5 text-center">
                            <span class="font-black text-[#113F67]">${i.stok}</span>
                            <span class="text-[10px] text-gray-400 uppercase"> ${i.satuan}</span>
                        </td>
                        <td class="px-8 py-5 text-center">
                            <div class="flex justify-center gap-2">
                                <button onclick="editInventory(${i.id_inventory})" 
                                    class="w-8 h-8 rounded-lg bg-blue-50 text-blue-400 hover:bg-blue-500 hover:text-white transition-all">
                                    <i class="fa-solid fa-pencil text-xs"></i>
                                </button>
                                <button onclick="deleteInventory(${i.id_inventory})" 
                                    class="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                                    <i class="fa-solid fa-trash-can text-xs"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('');
            }
        }

    } catch (err) {
        console.error("[fetchInventory] Error:", err);
        if (containerGrid) {
            containerGrid.innerHTML = `<div class="col-span-full text-center text-red-500 py-10">Gagal memuat data inventory: ${err.message}</div>`;
        }
    }
}

async function setupFormInventory() {
    const form = document.getElementById('form-inventory');
    if (!form) return;

    const editId = new URLSearchParams(window.location.search).get('id');

    if (editId) {
        const formTitle = document.querySelector('h3');
        const submitBtn = form.querySelector('button[type="submit"]');
        if (formTitle) formTitle.innerText = "Edit Bahan Baku";
        if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-save mr-2"></i>Simpan Perubahan';

        try {
            await fillDapurDropdown();

            const allData = await API.inventory.getAll();
            const i = allData.getInventories.find(x => String(x.id_inventory) === String(editId));
            if (!i) throw new Error(`Inventory ID ${editId} tidak ditemukan`);

            document.getElementById('id_dapur').value   = i.id_dapur   || '';
            document.getElementById('nama_bahan').value = i.nama_bahan  || '';
            document.getElementById('stok').value       = i.stok        || 0;
            document.getElementById('satuan').value     = i.satuan      || 'kg';

            document.getElementById('id_dapur').disabled   = true;
            document.getElementById('nama_bahan').disabled = true;
            document.getElementById('satuan').disabled     = true;

        } catch (err) {
            console.error("[setupFormInventory] Gagal load:", err);
            alert("Gagal memuat data inventori untuk diedit.");
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const stok = parseFloat(document.getElementById('stok').value);

        try {
            if (editId) {
                await API.inventory.update(editId, stok);
                alert("Stok berhasil diperbarui!");
                window.location.href = 'inventory.html';
            } else {
                const input = {
                    id_dapur:   document.getElementById('id_dapur').value,
                    nama_bahan: document.getElementById('nama_bahan').value,
                    stok:       stok,
                    satuan:     document.getElementById('satuan').value
                };
                await API.inventory.create(input);
                alert("Bahan Baku berhasil disimpan!");
                form.reset();
                fetchInventory();
            }
        } catch (err) {
            console.error("[setupFormInventory] Gagal simpan:", err);
            alert("Gagal menyimpan bahan baku: " + err.message);
        }
    });
}

function editInventory(id) {
    window.location.href = `crudInventory.html?id=${id}`;
}

async function deleteInventory(id) {
    if (!confirm('Hapus bahan baku ini?')) return;
    try {
        await API.inventory.delete(id);
        fetchInventory();
    } catch (err) {
        console.error("[deleteInventory] Error:", err);
        alert("Gagal menghapus bahan baku.");
    }
}


// ═══════════════════════════════════════════════════════════════════════════════
// DISTRIBUSI
// ═══════════════════════════════════════════════════════════════════════════════

async function fetchDistribusi() {
    console.log("[fetchDistribusi] Dipanggil...");
    const containerGrid = document.getElementById('distribusi-container');
    const tableBody     = document.getElementById('table-body-distribusi');
    if (!containerGrid && !tableBody) {
        console.warn("[fetchDistribusi] Tidak ada container/tbody, skip.");
        return;
    }

    try {
        const data = await API.distribusi.getAll();
        const list = data.allShipments || [];
        console.log("[fetchDistribusi] Data diterima:", list);

        // Render ke grid
        if (containerGrid) {
            if (list.length === 0) {
                containerGrid.innerHTML = `<div class="col-span-full py-10 text-center text-gray-400">Belum ada pengiriman.</div>`;
            } else {
                containerGrid.innerHTML = list.map(d => {
                    // Fallback jika nama null
                    const namaSekolah = d.nama_sekolah || `Sekolah ID: ${d.id_sekolah}`;
                    const namaMenu    = d.nama_menu    || `Menu ID: ${d.id_menu}`;
                    const namaDapur   = d.nama_dapur   || `Dapur ID: ${d.id_dapur}`;
                    const waktuSampai = d.waktu_sampai ? new Date(d.waktu_sampai).toLocaleDateString('id-ID') : 'Belum ada estimasi';
                    const status      = d.status_kirim || 'PROSES';

                    return `
                    <div class="bg-white p-8 rounded-[35px] shadow-sm border border-gray-100">
                        <div class="flex justify-between items-start mb-4">
                            <span class="bg-blue-50 text-[#33A1E0] text-[10px] font-black px-3 py-1 rounded-full uppercase">${status}</span>
                            <p class="text-xs text-gray-400">ID: ${d.id_shipment}</p>
                        </div>
                        <h3 class="text-xl font-black text-[#113F67] mb-1">${namaSekolah}</h3>
                        <p class="text-sm text-gray-500 mb-2 italic">${namaMenu}</p>
                        <p class="text-xs text-gray-400 mb-3 flex items-center gap-1">
                            <i class="fa-solid fa-clock text-[#33A1E0]"></i> Tiba: ${waktuSampai}
                        </p>
                        <div class="flex justify-between items-center pt-4 border-t border-gray-50">
                            <div class="flex items-center gap-2">
                                <i class="fa-solid fa-box-open text-gray-300"></i>
                                <span class="font-bold text-[#113F67]">${d.jumlah_porsi || 0} Porsi</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <div class="flex items-center gap-1 text-xs text-gray-400">
                                    <i class="fa-solid fa-shop"></i> <span>${namaDapur}</span>
                                </div>
                                <button onclick="editDistribusi(${d.id_shipment})" 
                                    class="w-8 h-8 rounded-lg bg-blue-50 text-blue-400 hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center">
                                    <i class="fa-solid fa-pencil text-xs"></i>
                                </button>
                                <button onclick="deleteDistribusi(${d.id_shipment})" 
                                    class="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center">
                                    <i class="fa-solid fa-trash-can text-xs"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `}).join('');
            }
        }

        // Render ke table jika ada
        if (tableBody) {
            if (list.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="4" class="px-8 py-10 text-center text-gray-400">Belum ada data distribusi.</td></tr>`;
            } else {
                tableBody.innerHTML = list.map(d => `
                    <tr class="hover:bg-gray-50 transition-colors">
                        <td class="px-8 py-4 font-bold text-[#113F67]">${d.nama_sekolah || `ID: ${d.id_sekolah}`}</td>
                        <td class="px-8 py-4">${d.nama_menu || `ID: ${d.id_menu}`}</td>
                        <td class="px-8 py-4 text-center">${d.jumlah_porsi || 0}</td>
                        <td class="px-8 py-4 text-center">
                            <div class="flex justify-center gap-2">
                                <button onclick="editDistribusi(${d.id_shipment})" 
                                    class="w-8 h-8 rounded-lg bg-blue-50 text-blue-400 hover:bg-blue-500 hover:text-white transition-all">
                                    <i class="fa-solid fa-pencil text-xs"></i>
                                </button>
                                <button onclick="deleteDistribusi(${d.id_shipment})" 
                                    class="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                                    <i class="fa-solid fa-trash-can text-xs"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('');
            }
        }

    } catch (err) {
        console.error("[fetchDistribusi] Error:", err);
        if (containerGrid) {
            containerGrid.innerHTML = `<div class="col-span-full text-center text-red-500 py-10">Gagal memuat data distribusi: ${err.message}</div>`;
            console.log("[fetchDistribusi] Render selesai, data:", list);
        }
    }
}

async function setupFormDistribusi() {
    const form = document.getElementById('form-distribusi');
    if (!form) return;

    const editId = new URLSearchParams(window.location.search).get('id');

    if (editId) {
        const formTitle = document.querySelector('h3');
        const submitBtn = form.querySelector('button[type="submit"]');
        if (formTitle) formTitle.innerText = "Edit Pengiriman";
        if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-save mr-2"></i> SIMPAN PERUBAHAN';

        try {
            await fillDistribusiDropdowns();

            const data = await API.distribusi.getById(editId);
            const d = data.shipmentById;

            document.getElementById('id_sekolah_dist').value = d.id_sekolah   || '';
            document.getElementById('id_menu_dist').value    = d.id_menu      || '';
            document.getElementById('id_dapur_dist').value   = d.id_dapur     || '';
            document.getElementById('jumlah_porsi').value    = d.jumlah_porsi || 0;
            document.getElementById('status_kirim').value    = d.status_kirim || 'Persiapan';

            const waktuInput = document.getElementById('waktu_sampai');
            if (waktuInput && d.waktu_sampai) {
                waktuInput.value = d.waktu_sampai.split('T')[0];
            }
        } catch (err) {
            console.error("[setupFormDistribusi] Gagal load:", err);
            alert("Gagal memuat data pengiriman untuk diedit.");
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const statusKirim = document.getElementById('status_kirim').value;
        const waktuSampai = document.getElementById('waktu_sampai')?.value;

        const input = {
            id_sekolah:   document.getElementById('id_sekolah_dist').value,
            id_menu:      document.getElementById('id_menu_dist').value,
            id_dapur:     document.getElementById('id_dapur_dist').value,
            jumlah_porsi: parseInt(document.getElementById('jumlah_porsi').value),
            status_kirim: statusKirim,
            waktu_sampai: statusKirim === 'Diterima'
                ? new Date().toISOString().split('T')[0]
                : (waktuSampai || null)
        };

        try {
            if (editId) {
                await API.distribusi.update(editId, input);
                alert("Pengiriman berhasil diperbarui!");
            } else {
                await API.distribusi.create(input);
                alert("Pengiriman berhasil dikonfirmasi!");
            }
            window.location.href = "distribusi.html";
        } catch (err) {
            console.error("[setupFormDistribusi] Gagal:", err);
            alert("Gagal: " + err.message);
        }
    });
}

function editDistribusi(id) {
    window.location.href = `crudDistribusi.html?id=${id}`;
}

async function deleteDistribusi(id) {
    if (!confirm("Hapus data pengiriman ini?")) return;
    try {
        await API.distribusi.delete(id);
        alert("Data pengiriman berhasil dihapus!");
        fetchDistribusi();
    } catch (err) {
        console.error("[deleteDistribusi] Error:", err);
        alert("Gagal menghapus data pengiriman.");
    }
}


// ═══════════════════════════════════════════════════════════════════════════════
// DROPDOWN HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

async function fillDapurDropdown() {
    const dropdown = document.getElementById('id_dapur');
    if (!dropdown) return;
    try {
        const data = await API.dapur.getAll();
        const list = data.semuaDapur || [];
        dropdown.innerHTML =
            '<option value="">-- Pilih Unit Dapur --</option>' +
            list.map(d => `<option value="${d.id_dapur}">${d.nama_dapur}</option>`).join('');
    } catch (err) {
        console.error("[fillDapurDropdown] Error:", err);
        dropdown.innerHTML = '<option value="">Gagal memuat dapur</option>';
    }
}

async function fillDistribusiDropdowns() {
    const sekolahSelect = document.getElementById('id_sekolah_dist');
    const menuSelect    = document.getElementById('id_menu_dist');
    const dapurSelect   = document.getElementById('id_dapur_dist');
    if (!sekolahSelect || !menuSelect || !dapurSelect) return;

    try {
        const [sekolahData, menuData, dapurData] = await Promise.all([
            API.sekolah.getAll(),
            API.menu.getAll(),
            API.dapur.getAll()
        ]);

        sekolahSelect.innerHTML =
            '<option value="">Pilih Sekolah...</option>' +
            (sekolahData.semuaSekolah || []).map(s =>
                `<option value="${s.id_sekolah}">${s.nama_sekolah}</option>`
            ).join('');

        menuSelect.innerHTML =
            '<option value="">Pilih Menu...</option>' +
            (menuData.getSemuaMenu || []).map(m =>
                `<option value="${m.id_menu}">${m.nama_paket}</option>`
            ).join('');

        dapurSelect.innerHTML =
            '<option value="">Pilih Dapur...</option>' +
            (dapurData.semuaDapur || []).map(d =>
                `<option value="${d.id_dapur}">${d.nama_dapur}</option>`
            ).join('');

    } catch (err) {
        console.error("[fillDistribusiDropdowns] Error:", err);
    }
}