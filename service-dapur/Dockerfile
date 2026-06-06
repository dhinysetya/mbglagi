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

# Expose port yang digunakan aplikasi (sesuaikan dengan port di code Anda)
EXPOSE 3001

# Perintah untuk menjalankan aplikasi
CMD ["node", "src/index.js"]