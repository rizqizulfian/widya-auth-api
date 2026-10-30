const config = require('./config');
const app = require('./app');

app.listen(config.port, () => console.log(`API berjalan di http://localhost:${config.port} (docs: /docs)`));
