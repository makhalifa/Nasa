const http = require('http')

const app = require('./app')

const { loadPlanetDate } = require('./models/planets.model')

const PORT = process.env.PORT || 5000

const server = http.createServer(app)

async function startServer() {
    await loadPlanetDate()
    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`)
    })
}

startServer()