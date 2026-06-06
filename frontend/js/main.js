const URL_DAPUR = "http://localhost:3001/api/dapur";
const URL_SEKOLAH = "http://localhost:3003/api/sekolah";
const URL_MENU = "http://localhost:3002/api/menu";
const URL_INVENTORY = "http://localhost:3004/api/inventory";
const URL_DISTRIBUSI = "http://localhost:3005/api/distribusi";

document.addEventListener('DOMContentLoaded', async () => {
    console.log("Sistem Terinisialisasi...");
    fetchDapur();
    fetchSekolah();
    fetchMenu();
    fetchInventory();
    setupFormDapur();
    setupFormSekolah();
    setupFormMenu();
    setupFormInventory();
    fillDapurDropdown();
    fillDapurMenuDropdown();
    fetchDistribusi();
    setupFormDistribusi();
    fillDistribusiDropdowns();
});

async function fetchDapur() {
    const containerGrid = document.getElementById('dapur-container');
    const tableBody = document.getElementById('table-body-dapur');

    if (!containerGrid && !tableBody) return;

    try {
        const res = await axios.get(URL_DAPUR);
        const data = res.data;

        if (containerGrid) {
            if (data.length === 0) {
                containerGrid.innerHTML = `
                    <div class="col-span-full py-20 text-center">
                        <p class="text-gray-400">Belum ada unit dapur yang terdaftar.</p>
                    </div>`;
            } else {
                containerGrid.innerHTML = data.map(k => `
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
                            <button onclick="deleteDapur(${k.id_dapur})" class="w-10 h-10 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </div>`).join('');
            }
        }

        if (tableBody) {
            if (data.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="3" class="px-8 py-10 text-center text-gray-400">Belum ada data unit dapur.</td></tr>`;
            } else {
                tableBody.innerHTML = data.map(k => `
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
                                <button onclick="editDapur(${k.id_dapur})" class="w-9 h-9 rounded-lg bg-blue-50 text-blue-400 hover:bg-blue-500 hover:text-white transition-all">
                                    <i class="fa-solid fa-pencil text-xs"></i>
                                </button>
                                <button onclick="deleteDapur(${k.id_dapur})" class="w-9 h-9 rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                                    <i class="fa-solid fa-trash-can text-xs"></i>
                                </button>
                            </div>
                        </td>
                    </tr>`).join('');
            }
        }

    } catch (err) {
        console.error("Error Fetch Dapur:", err);
    }
}

async function setupFormDapur() {
    const form = document.getElementById('form-dapur');
    if (!form) return;

    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('id');

    if (editId) {

        const formTitle = document.querySelector('h3');
        const submitBtn = form.querySelector('button[type="submit"]');
        if (formTitle) formTitle.innerText = "Edit Unit Dapur";
        if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-save mr-2"></i>Simpan Perubahan';

        try {
            const res = await axios.get(`${URL_DAPUR}/${editId}`);
            const k = res.data;

            document.getElementById('nama_dapur').value      = k.nama_dapur || '';
            document.getElementById('kapasitas_porsi').value = k.kapasitas_porsi || 0;
            document.getElementById('lokasi').value          = k.lokasi || '';
        } catch (err) {
            console.error("Gagal load data dapur untuk edit:", err);
            alert("Gagal memuat data untuk diedit. Cek koneksi backend.");
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const payload = {
            nama_dapur:      document.getElementById('nama_dapur').value,
            lokasi:          document.getElementById('lokasi').value,
            kapasitas_porsi: parseInt(document.getElementById('kapasitas_porsi').value)
        };

        try {
            if (editId) {
                await axios.put(`${URL_DAPUR}/${editId}`, payload);
                alert("Unit Dapur Berhasil Diperbarui!");
                window.location.href = 'dapur.html';
            } else {
                const res = await axios.post(URL_DAPUR, payload);
                if (res.status === 201 || res.status === 200) {
                    alert("Unit Dapur Berhasil Ditambahkan!");
                    form.reset();
                    fetchDapur();
                }
            }
        } catch (err) {
            console.error("Gagal Simpan:", err);
            alert("Terjadi kesalahan saat menyimpan data.");
        }
    });
}

async function deleteDapur(id) {
    if (confirm('Apakah Anda yakin ingin menghapus unit dapur ini?')) {
        try {
            await axios.delete(`${URL_DAPUR}/${id}`);
            fetchDapur();
        } catch (err) {
            console.error("Gagal Hapus:", err);
            alert("Gagal menghapus data.");
        }
    }
}

function editDapur(id) {
    window.location.href = `crudDapur.html?id=${id}`;
}

async function fetchSekolah() {
    const containerGrid = document.getElementById('sekolah-container');
    const tableBody = document.getElementById('table-body-sekolah');
    const countText = document.getElementById('count-sekolah');

    if (!containerGrid && !tableBody) return;

    try {
        const res = await axios.get(URL_SEKOLAH);
        const data = res.data;

        if (countText) countText.innerText = `${data.length} Terdaftar`;

        if (tableBody) {
            if (data.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="5" class="px-8 py-10 text-center">Data Kosong</td></tr>`;
                return;
            }
            tableBody.innerHTML = data.map(s => `
                <tr class="hover:bg-gray-50 transition-colors text-sm">
                    <td class="px-8 py-4 font-mono text-gray-400">${s.npsn || '-'}</td>
                    <td class="px-8 py-4 font-bold text-[#113F67]">${s.nama_sekolah}</td>
                    <td class="px-8 py-4 text-center"><span class="bg-gray-100 px-2 py-1 rounded text-[10px]">${s.jenjang || '-'}</span></td>
                    <td class="px-8 py-4 text-center font-bold text-gray-600">${s.jumlah_siswa}</td>
                    <td class="px-8 py-4 text-center flex justify-center gap-2">
                    <button onclick="editSekolah(${s.id_sekolah})" 
                        class="w-8 h-8 rounded-lg bg-blue-50 text-blue-400 hover:bg-blue-500 hover:text-white transition-all">
                        <i class="fa-solid fa-pencil text-xs"></i>
                    </button>
                    <button onclick="deleteSekolah(${s.id_sekolah})" 
                        class="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                        <i class="fa-solid fa-trash-can text-xs"></i>
                    </button>
                </td>
                </tr>`).join('');
        }

        if (containerGrid) {
            containerGrid.innerHTML = data.map(s => `
                <div class="bg-white p-8 rounded-[35px] shadow-sm border border-gray-100">
                    <h3 class="text-xl font-bold text-[#113F67]">${s.nama_sekolah}</h3>
                    <p class="text-gray-400 text-xs mb-4">NPSN: ${s.npsn}</p>
                    <div class="flex justify-between items-center pt-4 border-t border-gray-50">
                        <span class="text-sm font-bold text-blue-500">${s.jumlah_siswa} Siswa</span>
                        <span class="text-xs bg-gray-50 px-3 py-1 rounded-full text-gray-400">${s.jenjang}</span>
                    </div>
                    
                </div>`).join('');
        }
    } catch (err) {
        console.error("Gagal load sekolah:", err);
    }
}


async function setupFormSekolah() {
    const form = document.getElementById('form-sekolah');
    if (!form) return;

    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('id');

    if (editId) {
        const formTitle = document.querySelector('h3');
        const submitBtn = form.querySelector('button[type="submit"]');
        if (formTitle) formTitle.innerText = "Edit Data Sekolah";
        if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-save mr-2"></i>Simpan Perubahan';

        try {
            const res = await axios.get(`${URL_SEKOLAH}/${editId}`);
            const s = res.data;

            document.getElementById('npsn').value           = s.npsn || '';
            document.getElementById('nama_sekolah').value   = s.nama_sekolah || '';
            document.getElementById('jenjang').value        = s.jenjang || 'SD';
            document.getElementById('jumlah_siswa').value   = s.jumlah_siswa || 0;
            document.getElementById('alamat_sekolah').value = s.alamat_sekolah || '';
        } catch (err) {
            console.error("Gagal load data sekolah untuk edit:", err);
            alert("Gagal memuat data untuk diedit. Cek koneksi backend.");
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const payload = {
            npsn:          document.getElementById('npsn').value,
            nama_sekolah:  document.getElementById('nama_sekolah').value,
            jenjang:       document.getElementById('jenjang').value,
            jumlah_siswa:  parseInt(document.getElementById('jumlah_siswa').value),
            alamat_sekolah: document.getElementById('alamat_sekolah').value
        };

        try {
            if (editId) {
                await axios.put(`${URL_SEKOLAH}/${editId}`, payload);
                alert("Data Sekolah Berhasil Diperbarui!");
                window.location.href = 'sekolah.html';
            } else {
                await axios.post(URL_SEKOLAH, payload);
                alert("Sekolah Berhasil Ditambahkan!");
                form.reset();
                fetchSekolah();
            }
        } catch (err) {
            console.error("Gagal Simpan:", err);
            alert("Gagal memproses data sekolah. Cek koneksi backend!");
        }
    });
}

function editSekolah(id) {
    window.location.href = `crudSekolah.html?id=${id}`; 
}


async function deleteSekolah(id) {
    if (confirm('Hapus data sekolah ini?')) {
        try {
            await axios.delete(`${URL_SEKOLAH}/${id}`);
            fetchSekolah();
        } catch (err) {
            alert("Gagal hapus sekolah");
        }
    }
}

async function fetchMenu() {
    const containerGrid = document.getElementById('menu-container');
    const tableBody = document.getElementById('table-body-menu');
    const countMenu = document.getElementById('count-menu');

    if (!containerGrid && !tableBody) return;

    try {
        const res = await axios.get(URL_MENU);
        const data = res.data;

        if (countMenu) countMenu.innerText = `${data.length} Menu Terdaftar`;

        if (containerGrid) {
            if (data.length === 0) {
                containerGrid.innerHTML = `
                    <div class="col-span-full flex flex-col items-center justify-center py-32 opacity-50">
                        <i class="fa-solid fa-bowl-food text-gray-300 text-5xl mb-4"></i>
                        <p class="text-gray-400 font-bold italic">Belum ada menu terdaftar.</p>
                        <a href="crudMenu.html" class="mt-4 bg-[#113F67] text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-[#33A1E0] transition-all">
                            + Tambah Menu Pertama
                        </a>
                    </div>`;
            } else {
                containerGrid.innerHTML = data.map(m => `
                    <div class="bg-white p-6 rounded-[30px] shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                        <div class="flex justify-between items-start mb-4">
                            <span class="bg-blue-50 text-blue-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase">Paket Menu</span>
                            <p class="text-xs text-gray-400 italic">${m.createdAt ? new Date(m.createdAt).toLocaleDateString('id-ID') : '-'}</p>
                        </div>
                        <h3 class="text-xl font-bold text-[#113F67] mb-1">${m.nama_paket}</h3>
                        <p class="text-gray-400 text-xs mb-4 line-clamp-2">${m.deskripsi || 'Tanpa deskripsi'}</p>
                        <div class="pt-4 border-t border-gray-50">
                            <p class="text-[10px] font-black text-gray-300 uppercase mb-2">Komposisi Bahan:</p>
                            <div class="flex flex-wrap gap-1">
                            ${m.MenuRecipes && m.MenuRecipes.length > 0
                                ? m.MenuRecipes.map(b => `
                                    <span class="text-[9px] bg-gray-50 px-2 py-1 rounded-md text-gray-500 border border-gray-100">
                                        ${b.nama_bahan} (${b.jumlah_kebutuhan} ${b.satuan})
                                    </span>`).join('')
                                : '<span class="text-[9px] text-gray-300 italic">Belum ada resep</span>'
                            }
                            </div>
                        </div>
                    </div>`).join('');
            }
        }

        if (tableBody) {
            if (data.length === 0) {
                tableBody.innerHTML = `
                    <tr><td colspan="3" class="px-8 py-10 text-center text-gray-400 italic">
                        Belum ada menu. Tambahkan menu pertama di form kiri.
                    </td></tr>`;
                return;
            }
            tableBody.innerHTML = data.map(m => `
                <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-8 py-4 font-bold text-[#113F67]">${m.nama_paket}</td>
                    <td class="px-8 py-4 text-xs text-gray-500">${m.deskripsi || '-'}</td>
                    <td class="px-8 py-4 text-center">
                        <div class="flex justify-center gap-2">
                            <button onclick="editMenu(${m.id_menu})" class="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center">
                                <i class="fa-solid fa-pen-to-square text-xs"></i>
                            </button>
                            <button onclick="deleteMenu(${m.id_menu})" class="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center">
                                <i class="fa-solid fa-trash-can text-xs"></i>
                            </button>
                        </div>
                    </td>
                </tr>`).join('');
        }
    } catch (err) {
        console.error("Gagal load menu:", err);
    }
}

async function setupFormMenu() {
    const form = document.getElementById('form-menu');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const idMenu = document.getElementById('id_menu').value;
        
        const recipeRows = document.querySelectorAll('.recipe-row');
        const resep = Array.from(recipeRows).map(row => ({
            id_inventory: row.querySelector('.id_bahan').value,
            jumlah_kebutuhan: parseFloat(row.querySelector('.jumlah_kebutuhan').value)
        })).filter(item => item.id_inventory !== "" && !isNaN(item.jumlah_kebutuhan));

        const payload = {
            nama_paket: document.getElementById('nama_paket').value,
            deskripsi: document.getElementById('deskripsi').value,
            id_dapur: document.getElementById('id_dapur_menu').value,
            MenuRecipes: resep.map(r => ({  
                id_inventory: r.id_inventory,
                jumlah_kebutuhan: r.jumlah_kebutuhan
            }))
        };

        try {
            if (idMenu) {

                await axios.put(`${URL_MENU}/${idMenu}`, payload);
                alert("Menu Berhasil Diperbarui!");
            } else {
                await axios.post(URL_MENU, payload);
                alert("Menu & Resep Berhasil Disimpan!");
            }

            form.reset();
            document.getElementById('id_menu').value = '';
            document.querySelector('#form-menu button[type="submit"]').innerText = "Simpan Menu & Resep";
            
            const container = document.getElementById('recipe-container');
            if(container) container.innerHTML = ''; 
            addRecipeRow(); 
            
            fetchMenu();
        } catch (err) {
            console.error("Gagal proses:", err);
            alert("Error: " + (err.response?.data?.message || err.message));
        }
    });
}

async function deleteMenu(id) {
    if (confirm('Hapus menu ini?')) {
        try {
            await axios.delete(`${URL_MENU}/${id}`);
            fetchMenu();
        } catch (err) {
            alert("Gagal hapus menu");
        }
    }
}

function addRecipeRow() {
    const container = document.getElementById('recipe-container');
    if (!container) return;

    const row = document.createElement('div');
    row.className = "recipe-row";
    row.style.cssText = "display:grid; grid-template-columns: 1fr 80px 32px; gap:8px; margin-bottom:8px; align-items:center;";
    row.innerHTML = `
        <select class="id_bahan w-full p-3 bg-gray-50 rounded-xl border-none text-sm outline-none">
            <option value="">Pilih Bahan...</option>
        </select>
        <input type="number" step="0.01" class="jumlah_kebutuhan w-full p-3 bg-gray-50 rounded-xl border-none text-sm outline-none" placeholder="Jml">
        <button type="button" onclick="this.parentElement.remove()" 
            class="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center">
            <i class="fa-solid fa-minus text-xs"></i>
        </button>
    `;
    container.appendChild(row);
    fillRecipeBahanDropdown(row.querySelector('.id_bahan'));
}

async function fillRecipeBahanDropdown(selectElement) {
    try {
        const res = await axios.get(URL_INVENTORY);
        const data = res.data;
        
        data.forEach(bahan => {
            const opt = document.createElement('option');
            opt.value = bahan.id_inventory;
            opt.text = `${bahan.nama_bahan} (${bahan.satuan})`;
            selectElement.appendChild(opt);
        });
    } catch (err) {
        console.error("Gagal memuat list bahan resep:", err);
    }
}

async function editMenu(id) {
    try {
        const res = await axios.get(`${URL_MENU}/${id}`);
        const m = res.data;

        document.getElementById('id_menu').value    = m.id_menu;
        document.getElementById('nama_paket').value = m.nama_paket;
        document.getElementById('deskripsi').value  = m.deskripsi || '';

        await fillDapurMenuDropdown();
        document.getElementById('id_dapur_menu').value = m.id_dapur || '';

        const container = document.getElementById('recipe-container');
        container.innerHTML = '';

        if (m.MenuRecipes && m.MenuRecipes.length > 0) {
            for (const b of m.MenuRecipes) {
                await addRecipeRowWithData(b.id_inventory, b.jumlah_kebutuhan);
            }
        } else {
            addRecipeRow();
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.querySelector('#form-menu button[type="submit"]').innerText = "Update Menu & Resep";

    } catch (err) {
        console.error("Gagal mengambil detail menu:", err);
        alert("Gagal mengambil data detail menu");
    }
}

async function addRecipeRowWithData(idBahan, jumlah) {
    const container = document.getElementById('recipe-container');
    const row = document.createElement('div');
    row.className = "recipe-row";
    row.style.cssText = "display:grid; grid-template-columns: 1fr 80px 32px; gap:8px; margin-bottom:8px; align-items:center;";
    row.innerHTML = `
        <select class="id_bahan w-full p-3 bg-gray-50 rounded-xl border-none text-sm outline-none">
            <option value="">Pilih Bahan...</option>
        </select>
        <input type="number" step="0.01" value="${jumlah}" class="jumlah_kebutuhan w-full p-3 bg-gray-50 rounded-xl border-none text-sm outline-none" placeholder="Jml">
        <button type="button" onclick="this.parentElement.remove()" 
            class="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center">
            <i class="fa-solid fa-minus text-xs"></i>
        </button>
    `;
    container.appendChild(row);
    
    const select = row.querySelector('.id_bahan');
    await fillRecipeBahanDropdown(select);
    select.value = idBahan;
}

async function fetchInventory() {
    const containerGrid = document.getElementById('inventory-container'); 
    const tableBody = document.getElementById('table-body-inventory'); 

    if (!containerGrid && !tableBody) return;

    try {
        const res = await axios.get(URL_INVENTORY);
        const data = res.data;


        if (containerGrid) {
            if (data.length === 0) {
                containerGrid.innerHTML = `
                    <div class="col-span-full py-20 text-center opacity-50">
                        <i class="fa-solid fa-box-open text-gray-300 text-4xl mb-4"></i>
                        <p class="text-gray-400 italic">Belum ada bahan baku terdaftar.</p>
                    </div>`;
            } else {
                containerGrid.innerHTML = data.map(i => `
                    <div class="bg-white p-6 rounded-[30px] shadow-sm border border-gray-100 hover:shadow-md transition-all">
                        <div class="flex justify-between items-start mb-4">
                            <div class="bg-blue-50 p-3 rounded-xl">
                                <i class="fa-solid fa-boxes-stacked text-[#113F67] text-lg"></i>
                            </div>
                            <span class="text-[10px] font-black text-gray-300 uppercase tracking-widest">ID: ${i.id_inventory}</span>
                        </div>
                        <h3 class="text-lg font-bold text-[#113F67] mb-1">${i.nama_bahan}</h3>
                        <p class="text-xs text-gray-400 mb-4 flex items-center gap-1">
                            <i class="fa-solid fa-kitchen-set text-[#33A1E0]"></i> ${i.nama_dapur || 'Unit Dapur'}
                        </p>
                        <div class="flex justify-between items-center pt-4 border-t border-gray-50">
                            <div>
                                <p class="text-[10px] font-bold text-gray-400 uppercase mb-1">Stok Tersedia</p>
                                <p class="font-black text-[#113F67]">${i.stok} <span class="text-xs font-normal text-gray-400">${i.satuan}</span></p>
                            </div>
                            <span class="text-[10px] bg-green-50 text-green-600 font-bold px-3 py-1 rounded-full uppercase">${i.satuan}</span>
                        </div>
                    </div>`).join('');
            }
        }

        if (tableBody) {
            if (data.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="4" class="px-8 py-10 text-center text-gray-400">Belum ada logistik terdaftar.</td></tr>`;
                return;
            }
            tableBody.innerHTML = data.map(i => `
                <tr class="hover:bg-gray-50 transition-colors text-sm">
                    <td class="px-8 py-5 font-bold text-[#113F67]">${i.nama_bahan}</td>
                    <td class="px-8 py-5">
                        <span class="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-lg">
                            <i class="fa-solid fa-house-chimney text-[10px] mr-1"></i> ${i.nama_dapur || 'Unit Dapur'}
                        </span>
                    </td>
                    <td class="px-8 py-5 text-center">
                        <span class="font-black text-[#113F67]">${i.stok}</span> 
                        <span class="text-[10px] text-gray-400 uppercase">${i.satuan}</span>
                    </td>
                    <td class="px-8 py-5 text-center">
                        <div class="flex justify-center gap-2">
                            <button onclick="editInventory(${i.id_inventory})" class="w-8 h-8 rounded-lg bg-blue-50 text-blue-400 hover:bg-blue-500 hover:text-white transition-all">
                                <i class="fa-solid fa-pencil text-xs"></i>
                            </button>
                            <button onclick="deleteInventory(${i.id_inventory})" class="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                                <i class="fa-solid fa-trash-can text-xs"></i>
                            </button>
                        </div>
                    </td>
                </tr>`).join('');
        }
    } catch (err) {
        console.error("Gagal load inventory:", err);
    }
}

async function setupFormInventory() {
    const form = document.getElementById('form-inventory');
    if (!form) return;

    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('id');

    if (editId) {
        const formTitle = document.querySelector('h3');
        const submitBtn = form.querySelector('button[type="submit"]');
        if (formTitle) formTitle.innerText = "Edit Bahan Baku";
        if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-save mr-2"></i>Simpan Perubahan';

        try {
            const res = await axios.get(`${URL_INVENTORY}/${editId}`);
            const i = res.data;

            await fillDapurDropdown();

            document.getElementById('id_dapur').value  = i.id_dapur || '';
            document.getElementById('nama_bahan').value = i.nama_bahan || '';
            document.getElementById('stok').value       = i.stok || 0;
            document.getElementById('satuan').value     = i.satuan || 'kg';
        } catch (err) {
            console.error("Gagal load data inventory untuk edit:", err);
            alert("Gagal memuat data untuk diedit. Cek koneksi backend.");
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const payload = {
            id_dapur:   document.getElementById('id_dapur').value,
            nama_bahan: document.getElementById('nama_bahan').value,
            stok:       parseFloat(document.getElementById('stok').value),
            satuan:     document.getElementById('satuan').value
        };

        try {
            if (editId) {
                await axios.put(`${URL_INVENTORY}/${editId}`, payload);
                alert("Bahan Baku Berhasil Diperbarui!");
                window.location.href = 'inventory.html';
            } else {
                await axios.post(URL_INVENTORY, payload);
                alert("Logistik Berhasil Disimpan!");
                form.reset();
                fetchInventory();
            }
        } catch (err) {
            alert("Gagal simpan inventori: " + err.message);
        }
    });
}

async function deleteInventory(id) {
    if (confirm('Hapus bahan baku ini?')) {
        try {
            await axios.delete(`${URL_INVENTORY}/${id}`);
            fetchInventory();
        } catch (err) {
            alert("Gagal menghapus");
        }
    }
}

function editInventory(id) {
    window.location.href = `crudInventory.html?id=${id}`;
}


async function fillDapurDropdown() {
    const dropdown = document.getElementById('id_dapur');
    if (!dropdown) return;

    try {
        const res = await axios.get(URL_DAPUR);
        const data = res.data;

        dropdown.innerHTML = '<option value="">-- Pilih Unit Dapur --</option>' + 
            data.map(d => `<option value="${d.id_dapur}">${d.nama_dapur}</option>`).join('');
    } catch (err) {
        dropdown.innerHTML = '<option value="">Gagal memuat dapur</option>';
    }
}

async function fillDapurMenuDropdown() {
    const dropdown = document.getElementById('id_dapur_menu');
    if (!dropdown) return;

    try {
        const res = await axios.get(URL_DAPUR);
        dropdown.innerHTML = '<option value="">-- Pilih Unit Dapur --</option>' +
            res.data.map(d => `<option value="${d.id_dapur}">${d.nama_dapur}</option>`).join('');
    } catch (err) {
        dropdown.innerHTML = '<option value="">Gagal memuat dapur</option>';
    }
}

async function fetchDistribusi() {
    const containerGrid = document.getElementById('distribusi-container');
    const tableBody = document.getElementById('table-body-distribusi');

    if (!containerGrid && !tableBody) return;

    try {
        const res = await axios.get(URL_DISTRIBUSI);
        const data = res.data;

        if (containerGrid) {
            if (data.length === 0) {
                containerGrid.innerHTML = `<div class="col-span-full py-10 text-center text-gray-400">Belum ada pengiriman hari ini.</div>`;
                return;
            }
            containerGrid.innerHTML = data.map(d => `
                <div class="bg-white p-8 rounded-[35px] shadow-sm border border-gray-100">
                    <div class="flex justify-between items-start mb-4">
                        <span class="bg-blue-50 text-[#33A1E0] text-[10px] font-black px-3 py-1 rounded-full uppercase">
                            ${d.status_kirim || 'PROSES'}
                        </span>
                        <p class="text-xs text-gray-400">
                            ${d.createdAt ? new Date(d.createdAt).toLocaleDateString('id-ID') : 'Baru Saja'}
                        </p>
                    </div>
                    <h3 class="text-xl font-black text-[#113F67] mb-1">${d.nama_sekolah}</h3>
                    <p class="text-sm text-gray-500 mb-2 italic">${d.nama_menu || 'Menu belum tertera'}</p>

                    ${d.waktu_sampai ? `
                    <p class="text-xs text-gray-400 mb-3 flex items-center gap-1">
                        <i class="fa-solid fa-clock text-[#33A1E0]"></i> 
                        Tiba: ${new Date(d.waktu_sampai).toLocaleDateString('id-ID')}
                    </p>` : ''}

                    <div class="flex justify-between items-center pt-4 border-t border-gray-50">
                        <div class="flex items-center gap-2">
                            <i class="fa-solid fa-box-open text-gray-300"></i>
                            <span class="font-bold text-[#113F67]">${d.jumlah_porsi || 0} Porsi</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="flex items-center gap-1 text-xs text-gray-400">
                                <i class="fa-solid fa-shop"></i>
                                <span>${d.nama_dapur}</span>
                            </div>
                            <!-- ✅ Tombol Edit & Hapus -->
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
                </div>`).join('');
        }

        if (tableBody) {
            tableBody.innerHTML = data.map(d => `
                <tr>
                    <td class="px-8 py-4 font-bold">${d.nama_sekolah}</td>
                    <td class="px-8 py-4">${d.nama_menu || '-'}</td>
                    <td class="px-8 py-4 text-center">${d.jumlah_porsi || 0}</td>
                    <td class="px-8 py-4 text-center">
                        <div class="flex justify-center gap-2">
                            <button onclick="editDistribusi(${d.id_shipment})" class="w-8 h-8 rounded-lg bg-blue-50 text-blue-400 hover:bg-blue-500 hover:text-white transition-all">
                                <i class="fa-solid fa-pencil text-xs"></i>
                            </button>
                            <button onclick="deleteDistribusi(${d.id_shipment})" class="text-red-400 hover:text-red-600">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </td>
                </tr>`).join('');
        }
    } catch (err) {
        console.error("Gagal load distribusi:", err);
    }
}

async function fillDistribusiDropdowns() {
    const sekolahSelect = document.getElementById('id_sekolah_dist');
    const menuSelect = document.getElementById('id_menu_dist');
    const dapurSelect = document.getElementById('id_dapur_dist');

    if (!sekolahSelect || !menuSelect || !dapurSelect) return;

    try {
        const [resSekolah, resMenu, resDapur] = await Promise.all([
            axios.get(URL_SEKOLAH),
            axios.get(URL_MENU),
            axios.get(URL_DAPUR)
        ]);

        sekolahSelect.innerHTML = '<option value="">Pilih Sekolah...</option>' + 
            resSekolah.data.map(s => `<option value="${s.id_sekolah}">${s.nama_sekolah}</option>`).join('');

        menuSelect.innerHTML = '<option value="">Pilih Menu...</option>' + 
            resMenu.data.map(m => `<option value="${m.id_menu}">${m.nama_paket}</option>`).join('');

        dapurSelect.innerHTML = '<option value="">Pilih Dapur...</option>' + 
            resDapur.data.map(d => `<option value="${d.id_dapur}">${d.nama_dapur}</option>`).join('');
            
    } catch (err) {
        console.error("Gagal memuat data dropdown:", err);
    }
}

async function setupFormDistribusi() {
    const form = document.getElementById('form-distribusi');
    if (!form) return;

    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('id');

    if (editId) {
        const formTitle = document.querySelector('h3');
        const submitBtn = form.querySelector('button[type="submit"]');
        if (formTitle) formTitle.innerText = "Edit Pengiriman";
        if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-save mr-2"></i> SIMPAN PERUBAHAN';

        try {
            await fillDistribusiDropdowns();

            const res = await axios.get(`${URL_DISTRIBUSI}/${editId}`);
            const d = res.data;

            document.getElementById('id_sekolah_dist').value = d.id_sekolah || '';
            document.getElementById('id_menu_dist').value    = d.id_menu || '';
            document.getElementById('id_dapur_dist').value   = d.id_dapur || '';
            document.getElementById('jumlah_porsi').value    = d.jumlah_porsi || 0;
            document.getElementById('status_kirim').value    = d.status_kirim || 'Persiapan';

            const waktuInput = document.getElementById('waktu_sampai');
            if (waktuInput && d.waktu_sampai) {
                waktuInput.value = d.waktu_sampai.split('T')[0];
            }
        } catch (err) {
            console.error("Gagal load data distribusi untuk edit:", err);
            alert("Gagal memuat data. Cek koneksi backend.");
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const waktuSampai = document.getElementById('waktu_sampai')?.value;
        const statusKirim = document.getElementById('status_kirim').value;

        const payload = {
            id_sekolah:   document.getElementById('id_sekolah_dist').value,
            id_menu:      document.getElementById('id_menu_dist').value,
            id_dapur:     document.getElementById('id_dapur_dist').value,
            jumlah_porsi: parseInt(document.getElementById('jumlah_porsi').value),
            status:       statusKirim,
            waktu_sampai: statusKirim === 'Diterima' 
                ? new Date().toISOString().split('T')[0]
                : (waktuSampai || null),
            tanggal: new Date().toISOString().split('T')[0]
        };

        try {
            if (editId) {
                await axios.put(`${URL_DISTRIBUSI}/${editId}`, payload);
                alert("Pengiriman Berhasil Diperbarui!");
            } else {
                await axios.post(URL_DISTRIBUSI, payload);
                alert("Pengiriman Berhasil Dikonfirmasi!");
            }
            window.location.href = "distribusi.html";
        } catch (err) {
            console.error(err);
            alert("Gagal: " + (err.response?.data?.message || err.message));
        }
    });
}

function editDistribusi(id) {
    window.location.href = `crudDistribusi.html?id=${id}`;
}

async function deleteDistribusi(id) {
    if (!confirm("Hapus data pengiriman ini?")) return;
    try {
        await axios.delete(`${URL_DISTRIBUSI}/${id}`);
        alert("Data pengiriman berhasil dihapus!");
        fetchDistribusi();
    } catch (err) {
        alert("Gagal menghapus data!");
    }
}

function editDistribusi(id) {
    window.location.href = `crudDistribusi.html?id=${id}`;
}
