/**
 * main.js — Logic Frontend Sistem MBG
 * Semua CRUD menggunakan object API dari api.js (GraphQL).
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

    fetchDapur();
    fetchSekolah();
    fetchMenu();
    fetchInventory();
    fetchDistribusi();

    setupFormDapur();
    setupFormSekolah();
    setupFormMenu();
    setupFormInventory();
    setupFormDistribusi();

    fillDapurDropdown();
    fillDapurMenuDropdown();
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
// MENU — Tampilkan Nama Bahan Baku & Komposisi Resep Dinamis
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

        let inventoryMap = {};
        try {
            const invData = await API.inventory.getAll();
            (invData.getInventories || []).forEach(i => {
                inventoryMap[i.id_inventory] = i.nama_bahan;
            });
        } catch (e) {
            console.warn("[fetchMenu] Gagal fetch inventory untuk nama bahan:", e.message);
        }

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
                        ? recipes.map(r => {
                            const namaBahan = inventoryMap[r.id_inventory] || `Bahan #${r.id_inventory}`;
                            return `<span class="text-[9px] bg-gray-50 px-2 py-1 rounded-md text-gray-500 border border-gray-100">
                                ${namaBahan} (${r.jumlah_kebutuhan})
                            </span>`;
                        }).join('')
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
                                class="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-all">
                                <i class="fa-solid fa-pencil text-xs"></i>
                            </button>
                            <button onclick="deleteMenu(${m.id_menu})" 
                                class="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                                <i class="fa-solid fa-trash-can text-xs"></i>
                            </button>
                        </div>
                    </div>`;
                }).join('');
            }
        }
    } catch (err) {
        console.error("[fetchMenu] Error:", err);
    }
}

async function setupFormMenu() {
    const form = document.getElementById('form-menu');
    if (!form) return;

    const editId = new URLSearchParams(window.location.search).get('id');

    if (editId) {
        const formTitle = document.querySelector('h3');
        const submitBtn = form.querySelector('button[type="submit"]');
        if (formTitle) formTitle.innerText = "Edit Menu & Resep";
        if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-save mr-2"></i>Simpan Perubahan';

        try {
            const data = await API.menu.getById(editId);
            const m = data.getMenuById;
            
            document.getElementById('nama_paket').value = m.nama_paket;
            document.getElementById('deskripsi').value = m.deskripsi || '';
            
            const container = document.getElementById('recipe-container');
            if (container) container.innerHTML = '';
            
            if (m.MenuRecipes && m.MenuRecipes.length > 0) {
                for (const r of m.MenuRecipes) {
                    await addRecipeRow(r.id_inventory, r.jumlah_kebutuhan);
                }
            } else {
                await addRecipeRow();
            }
        } catch (err) {
            console.error("[setupFormMenu] Gagal load data edit:", err);
            alert("Gagal memuat data menu.");
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nama_paket = document.getElementById('nama_paket').value;
        const deskripsi = document.getElementById('deskripsi').value;

        try {
            let id_menu = editId;

            if (editId) {
                await API.menu.update(editId, nama_paket, deskripsi);
                await API.menu.menuRecipe.deleteByMenu(parseInt(editId));
            } else {
                const dataMenu = await API.menu.create(nama_paket, deskripsi);
                id_menu = dataMenu.createMenu.id_menu;
            }

            const rows = document.querySelectorAll('.recipe-row');
            for (const row of rows) {
                const id_inventory = row.querySelector('.recipe-inventory').value;
                const jumlah_kebutuhan = row.querySelector('.recipe-qty').value;

                if (id_inventory && jumlah_kebutuhan) {
                    await API.menu.menuRecipe.create({
                        id_menu: parseInt(id_menu),
                        id_inventory: parseInt(id_inventory),
                        jumlah_kebutuhan: parseFloat(jumlah_kebutuhan)
                    });
                }
            }

            alert(editId ? "Menu & Resep diperbarui!" : "Menu & Resep berhasil disimpan!");
            window.location.href = 'menu.html';
        } catch (err) {
            console.error("[setupFormMenu] Gagal menyimpan:", err);
            alert("Error: " + err.message);
        }
    });
}

async function addRecipeRow(selectedInventoryId = '', qty = '') {
    const container = document.getElementById('recipe-container');
    if (!container) return;

    const rowId = 'row-' + Date.now() + Math.random().toString(36).substr(2, 5);
    let optionsHtml = '<option value="">-- Pilih Bahan --</option>';
    try {
        const invData = await API.inventory.getAll();
        const listBahan = invData.getInventories || [];
        optionsHtml += listBahan.map(i => `
            <option value="${i.id_inventory}" ${String(i.id_inventory) === String(selectedInventoryId) ? 'selected' : ''}>
                ${i.nama_bahan} (${i.satuan})
            </option>
        `).join('');
    } catch (e) {
        console.error(e);
    }

    const div = document.createElement('div');
    div.id = rowId;
    div.className = "recipe-row flex gap-2 items-center mb-2";
    div.innerHTML = `
        <select required class="recipe-inventory flex-1 p-3 bg-gray-50 rounded-xl border-none text-xs focus:ring-2 focus:ring-[#33A1E0]">
            ${optionsHtml}
        </select>
        <input type="number" step="0.01" placeholder="Jumlah" required value="${qty}"
            class="recipe-qty w-24 p-3 bg-gray-50 rounded-xl border-none text-xs focus:ring-2 focus:ring-[#33A1E0]">
        <button type="button" onclick="document.getElementById('${rowId}').remove()" class="text-red-400 hover:text-red-600 px-2">
            <i class="fa-solid fa-trash"></i>
        </button>
    `;
    container.appendChild(div);
}

function editMenu(id) {
    window.location.href = `crudMenu.html?id=${id}`;
}

async function deleteMenu(id) {
    if (!confirm('Hapus menu ini beserta seluruh resepnya?')) return;
    try {
        await API.menu.menuRecipe.deleteByMenu(parseInt(id));
        await API.menu.delete(id);
        fetchMenu();
    } catch (err) {
        alert("Gagal menghapus: " + err.message);
    }
}


// ═══════════════════════════════════════════════════════════════════════════════
// INVENTORY
// ═══════════════════════════════════════════════════════════════════════════════

async function fetchInventory() {
    const tableBody = document.getElementById('table-body-inventory');
    if (!tableBody) return;

    try {
        const data = await API.inventory.getAll();
        const list = data.getInventories || [];

        let dapurMap = {};
        try {
            const dData = await API.dapur.getAll();
            (dData.semuaDapur || []).forEach(d => dapurMap[d.id_dapur] = d.nama_dapur);
        } catch (e) { console.warn(e); }

        if (list.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4" class="px-8 py-10 text-center text-gray-400">Stok kosong.</td></tr>`;
            return;
        }

        tableBody.innerHTML = list.map(i => `
            <tr class="hover:bg-gray-50 transition-colors text-sm">
                <td class="px-8 py-4 font-bold text-[#113F67]">${i.nama_bahan}</td>
                <td class="px-8 py-4 text-gray-500">${dapurMap[i.id_dapur] || `Dapur ID: ${i.id_dapur}`}</td>
                <td class="px-8 py-4 font-semibold text-center">${i.stok} <span class="text-xs text-gray-400 font-normal">${i.satuan}</span></td>
                <td class="px-8 py-4 text-center">
                    <button onclick="editInventory(${i.id_inventory})" class="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-all"><i class="fa-solid fa-pencil text-xs"></i></button>
                    <button onclick="deleteInventory(${i.id_inventory})" class="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all"><i class="fa-solid fa-trash-can text-xs"></i></button>
                </td>
            </tr>
        `).join('');
    } catch (err) { console.error(err); }
}

async function setupFormInventory() {
    const form = document.getElementById('form-inventory');
    if (!form) return;

    const editId = new URLSearchParams(window.location.search).get('id');

    if (editId) {
        document.getElementById('id_dapur').disabled = true;
        document.getElementById('nama_bahan').disabled = true;
        document.getElementById('satuan').disabled = true;

        try {
            const res = await API.inventory.getById(editId);
            const iv = res.getInventoryById;
            document.getElementById('id_dapur').value = iv.id_dapur;
            document.getElementById('nama_bahan').value = iv.nama_bahan;
            document.getElementById('stok').value = iv.stok;
            document.getElementById('satuan').value = iv.satuan;
        } catch (e) { alert("Gagal memuat inventory."); }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const stok = parseFloat(document.getElementById('stok').value);

        try {
            if (editId) {
                await API.inventory.update(editId, stok);
                alert("Stok berhasil diperbarui!");
            } else {
                const input = {
                    id_dapur: document.getElementById('id_dapur').value,
                    nama_bahan: document.getElementById('nama_bahan').value,
                    stok: stok,
                    satuan: document.getElementById('satuan').value
                };
                await API.inventory.create(input);
                alert("Bahan baku ditambahkan!");
            }
            window.location.href = 'inventory.html';
        } catch (err) { alert("Gagal menyimpan stok."); }
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
    } catch (e) { alert("Gagal hapus."); }
}


// ═══════════════════════════════════════════════════════════════════════════════
// DISTRIBUSI (SHIPMENT)
// ═══════════════════════════════════════════════════════════════════════════════

async function fetchDistribusi() {
    const tableBody = document.getElementById('table-body-distribusi');
    if (!tableBody) return;

    try {
        const data = await API.distribusi.getAll();
        const list = data.allShipments || [];

        if (list.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="px-8 py-10 text-center text-gray-400">Belum ada pengiriman.</td></tr>`;
            return;
        }

        tableBody.innerHTML = list.map(sh => {
            let badgeColor = "bg-yellow-550 text-yellow-600";
            if (sh.status_kirim === "Selesai" || sh.status_kirim === "Diterima") badgeColor = "bg-green-50 text-green-600";
            if (sh.status_kirim === "Batal") badgeColor = "bg-red-50 text-red-600";

            return `
                <tr class="hover:bg-gray-50 transition-colors text-sm">
                    <td class="px-8 py-4 font-bold text-[#113F67]">${sh.nama_sekolah || `ID: ${sh.id_sekolah}`}</td>
                    <td class="px-8 py-4 text-gray-500">${sh.nama_dapur || `ID: ${sh.id_dapur}`}</td>
                    <td class="px-8 py-4 text-gray-600">${sh.nama_menu || `ID: ${sh.id_menu}`}</td>
                    <td class="px-8 py-4 text-center font-bold">${sh.jumlah_porsi}</td>
                    <td class="px-8 py-4 text-center">
                        <span class="px-3 py-1 text-[11px] font-bold rounded-full ${badgeColor}">${sh.status_kirim}</span>
                    </td>
                    <td class="px-8 py-4 text-center">
                        <button onclick="editDistribusi('${sh.id_shipment}')" class="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-all"><i class="fa-solid fa-pencil text-xs"></i></button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (e) { console.error(e); }
}

async function setupFormDistribusi() {
    const form = document.getElementById('form-distribusi');
    if (!form) return;

    const editId = new URLSearchParams(window.location.search).get('id');

    if (editId) {
        try {
            const res = await API.distribusi.getById(editId);
            const sh = res.shipmentById;
            document.getElementById('id_sekolah').value = sh.id_sekolah;
            document.getElementById('id_dapur').value = sh.id_dapur;
            document.getElementById('id_menu').value = sh.id_menu;
            document.getElementById('jumlah_porsi').value = sh.jumlah_porsi;
            document.getElementById('status_kirim').value = sh.status_kirim;
        } catch (e) { console.error(e); }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            id_sekolah: document.getElementById('id_sekolah').value,
            id_dapur: document.getElementById('id_dapur').value,
            id_menu: document.getElementById('id_menu').value,
            jumlah_porsi: document.getElementById('jumlah_porsi').value,
            status_kirim: document.getElementById('status_kirim').value,
            waktu_sampai: new Date().toISOString()
        };

        try {
            if (editId) {
                await API.distribusi.update(editId, payload);
                alert("Pengiriman diperbarui!");
            } else {
                await API.distribusi.create(payload);
                alert("Pengiriman baru dijadwalkan!");
            }
            window.location.href = 'distribusi.html';
        } catch (e) { alert("Gagal memproses distribusi."); }
    });
}

function editDistribusi(id) {
    window.location.href = `crudDistribusi.html?id=${id}`;
}


// ═══════════════════════════════════════════════════════════════════════════════
// UI DROPDOWN FILLERS
// ═══════════════════════════════════════════════════════════════════════════════

async function fillDapurDropdown() {
    const select = document.getElementById('id_dapur');
    if (!select) return;
    try {
        const data = await API.dapur.getAll();
        select.innerHTML = '<option value="">-- Pilih Unit Dapur --</option>' + 
            (data.semuaDapur || []).map(d => `<option value="${d.id_dapur}">${d.nama_dapur}</option>`).join('');
    } catch (e) { console.error(e); }
}

async function fillDapurMenuDropdown() {
    const select = document.getElementById('id_dapur_menu');
    if (!select) return;
    try {
        const data = await API.dapur.getAll();
        select.innerHTML = '<option value="">-- Pilih Unit Dapur --</option>' + 
            (data.semuaDapur || []).map(d => `<option value="${d.id_dapur}">${d.nama_dapur}</option>`).join('');
    } catch (e) { console.error(e); }
}

async function fillDistribusiDropdowns() {
    const sSekolah = document.getElementById('id_sekolah');
    const sDapur = document.getElementById('id_dapur');
    const sMenu = document.getElementById('id_menu');

    if (!sSekolah || !sDapur || !sMenu) return;

    try {
        const sch = await API.sekolah.getAll();
        sSekolah.innerHTML = (sch.semuaSekolah || []).map(s => `<option value="${s.id_sekolah}">${s.nama_sekolah}</option>`).join('');

        const dpr = await API.dapur.getAll();
        sDapur.innerHTML = (dpr.semuaDapur || []).map(d => `<option value="${d.id_dapur}">${d.nama_dapur}</option>`).join('');

        const mnu = await API.menu.getAll();
        sMenu.innerHTML = (mnu.getSemuaMenu || []).map(m => `<option value="${m.id_menu}">${m.nama_paket}</option>`).join('');
    } catch (e) { console.error(e); }
}