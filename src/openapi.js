const user = {
  type: 'object',
  properties: {
    id: { type: 'integer', example: 1 },
    name: { type: 'string', example: 'Budi Santoso' },
    email: { type: 'string', example: 'budi@example.com' },
    gender: { type: 'string', enum: ['male', 'female'] },
    created_at: { type: 'string', format: 'date-time' },
  },
};

module.exports = {
  openapi: '3.0.3',
  info: { title: 'Widya Auth API', version: '1.0.0', description: 'Register, login, dan akses profile dengan JWT.' },
  components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } } },
  paths: {
    '/auth/register': {
      post: {
        summary: 'Buat akun baru',
        requestBody: { required: true, content: { 'application/json': { schema: {
          type: 'object', required: ['name', 'email', 'gender', 'password'],
          properties: {
            name: { type: 'string', example: 'Budi Santoso' },
            email: { type: 'string', example: 'budi@example.com' },
            gender: { type: 'string', enum: ['male', 'female'] },
            password: { type: 'string', minLength: 8, example: 'rahasia123' },
          } } } } },
        responses: { 201: { description: 'Akun dibuat', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, data: user } } } } }, 400: { description: 'Validasi gagal' }, 409: { description: 'Email sudah terdaftar' } },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Login dan dapatkan JWT',
        requestBody: { required: true, content: { 'application/json': { schema: {
          type: 'object', required: ['email', 'password'],
          properties: { email: { type: 'string', example: 'budi@example.com' }, password: { type: 'string', example: 'rahasia123' } } } } } },
        responses: { 200: { description: 'Token JWT' }, 401: { description: 'Kredensial salah' } },
      },
    },
    '/profile': {
      get: {
        summary: 'Lihat profile user yang sedang login',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Profile user', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, data: user } } } } }, 401: { description: 'Token hilang/tidak valid' } },
      },
    },
  },
};
