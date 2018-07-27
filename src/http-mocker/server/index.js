
import app from './app'
import debug from 'debug'
import http from 'http'

export default class Server {

  constructor (o) {
    Object.assign(this, {
      'port': 3000
    }, o)

    this.port = this.normalizePort(this.port)
    app.set('port', this.port)
    this.server = http.createServer(app)
    debug('aaa:server')
  }

  start () {
    this.server.listen(this.port)
    this.server.on('error', this.onError.bind(this))
    this.server.on('listening', this.onListening.bind(this))
  }

  stop () {

  }

  onError (error) {
    if (error.syscall !== 'listen') {
      throw error
    }
    const bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges')
        process.exit(1)
        break
      case 'EADDRINUSE':
        console.error(bind + ' is already in use')
        process.exit(1)
        break
      default:
        throw error
    }
  }

  onListening () {
    const addr = this.server.address()
    const bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port
    debug('Listening on ' + bind)
  }

  normalizePort (val) {
    const port = parseInt(val, 10)
    if (isNaN(port)) {
      // named pipe
      return val
    }
    if (port >= 0) {
      // port number
      return port
    }
    return false
  }
}
