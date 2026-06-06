# Gunakan base image node yang ringan
FROM node:18-alpine

# Tentukan direktori kerja di dalam container
WORKDIR /usr/src/app

# Salin file konfigurasi dependensi
COPY package*.json ./

# Install dependensi
RUN npm install --legacy-peer-deps

# Salin sisa kode proyek
COPY . .

# PENTING: Sesuaikan port dengan yang ada di index.js (Misal: 5000)
EXPOSE 5000

# Perintah untuk menjalankan aplikasi
CMD ["node", "src/index.js"]