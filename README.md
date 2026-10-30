# Widya Auth API

REST API portal autentikasi: buat akun, login, dan akses profile memakai JWT. Dibuat untuk Knowledge Test Software Engineer – PT Widya Informasi Nusantara.

**Stack:** Node.js (≥18), Express, PostgreSQL, JWT (`jsonwebtoken`), bcrypt (`bcryptjs`), Swagger UI.

## Menjalankan di lokal

```bash
npm install
cp .env.example .env          # sesuaikan DATABASE_URL & JWT_SECRET
docker compose up -d          # opsional: PostgreSQL via Docker
npm run migrate               # membuat tabel users
npm start                     # http://localhost:3000
npm test                      # integration test (butuh database termigrasi)
```

Dokumentasi interaktif (Swagger UI): `http://localhost:3000/docs`

## Endpoint

| Method | Path | Auth | Keterangan |
|---|---|---|---|
| POST | `/api/auth/register` | – | Buat akun: `name`, `email`, `gender` (`male`/`female`), `password` |
| POST | `/api/auth/login` | – | Mengembalikan JWT |
| GET | `/api/profile` | `Authorization: Bearer <token>` | Profile user yang login |
| GET | `/health` | – | Health check |

```bash
curl -X POST localhost:3000/api/auth/register -H 'Content-Type: application/json' \
  -d '{"name":"Budi","email":"budi@example.com","gender":"male","password":"rahasia123"}'

curl -X POST localhost:3000/api/auth/login -H 'Content-Type: application/json' \
  -d '{"email":"budi@example.com","password":"rahasia123"}'

curl localhost:3000/api/profile -H 'Authorization: Bearer <token>'
```

Semua response berbentuk JSON: `{ "success": true, "data": ... }` atau `{ "success": false, "message": "...", "errors": {...} }`.
Status: 201 dibuat, 400 validasi gagal, 401 kredensial/token salah, 409 email sudah ada.

## Desain & asumsi (catatan untuk reviewer)

- **Arsitektur berlapis:** `routes` → `middleware` (validasi, auth) → `controllers` (HTTP) → `services` (logika & query DB). `app.js` terpisah dari `server.js` agar mudah dites.
- **Asumsi:** login memakai email + password. Spesifikasi hanya menyebut nama, email, dan jenis kelamin, jadi saya menambahkan `password` karena login butuh kredensial.
- **Gender** dibatasi `male`/`female` (juga lewat CHECK constraint di DB).
- **Keamanan:** password di-hash bcrypt (tidak pernah dikembalikan di response); pesan error login sama untuk email/password salah; email unik dan dinormalisasi lowercase; JWT berisi `sub` (id user) dengan masa berlaku `JWT_EXPIRES_IN` (default 1 jam); query terparameter (anti SQL injection); body dibatasi 10kb.
- **Konfigurasi** lewat environment variable; aplikasi gagal start jika `JWT_SECRET`/`DATABASE_URL` kosong.
- **Pengembangan lanjutan (tidak dikerjakan):** rate limiting login, refresh token, verifikasi email, migrasi berversi (mis. knex), deploy ke Heroku/VPS.
