const fs = require('fs');
const https = require('https');

const app = require('./app');

const { mongoConnect } = require('./services/mongo');
const { loadPlanetDate } = require('./models/planets.model');
const { loadLaunchData } = require('./models/launches.model');

const PORT = process.env.PORT || 3000;

const server = https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
},app);

async function startServer() {
  await mongoConnect();
  await loadPlanetDate();
  await loadLaunchData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}

startServer();
