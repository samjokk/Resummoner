const express = require('express');
const inject = require('require-all');
const config = require('config');
const cors = require('cors');
const path = require('path');
const { connect } = require('./src/modules/users/main');
// const https = require('https');
// const fs = require('fs');
connect();
const router = express.Router;
const app = express();
const port = config.get('port');


app.use(cors());
app.use(express.json({ extended: true, limit: '50MB' }));
// app.use(bodyParser.urlencoded());
// app.use(bodyParser.json());

// API connecting...
try {
  const controllers = inject(__dirname + '/api/v1.1/controllers');

  for (const name in controllers) {
    app.use(`/api/${name}`, controllers[name](router));
  }
}
catch (e) {
  console.error(e);
}

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
  });
}

// const httpsOptions = {
//   key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
//   cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
// };

// Starting...
app.listen(port, () => console.log(`App was started in localhost:${port}`));
