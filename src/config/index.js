require('dotenv').config();

const config = {
  port: Number(process.env.PORT) || 3000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
};

// Gagal cepat jika konfigurasi wajib tidak ada.
for (const key of ['databaseUrl', 'jwtSecret']) {
  if (!config[key]) throw new Error(`Konfigurasi ${key} belum diisi (lihat .env.example)`);
}

module.exports = config;
