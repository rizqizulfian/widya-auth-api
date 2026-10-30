const bcrypt = require('bcryptjs');
const pool = require('../db/pool');
const { HttpError } = require('../errors');

const PUBLIC_COLUMNS = 'id, name, email, gender, created_at';

async function register({ name, email, gender, password }) {
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, gender, password_hash)
       VALUES ($1, $2, $3, $4) RETURNING ${PUBLIC_COLUMNS}`,
      [name, email, gender, passwordHash]
    );
    return rows[0];
  } catch (err) {
    if (err.code === '23505') throw new HttpError(409, 'Email sudah terdaftar');
    throw err;
  }
}

async function authenticate(email, password) {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = rows[0];
  // Pesan sama untuk email salah / password salah agar tidak membocorkan akun.
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new HttpError(401, 'Email atau password salah');
  }
  return user;
}

async function findById(id) {
  const { rows } = await pool.query(`SELECT ${PUBLIC_COLUMNS} FROM users WHERE id = $1`, [id]);
  return rows[0];
}

module.exports = { register, authenticate, findById };
