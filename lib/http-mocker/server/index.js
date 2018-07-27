'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _debug2.default)('aaa:server');

class Server {

  constructor(o) {
    Object.assign(this, {
      'port': 3000,
      'workspace': '/',
      'httpHARFile': 'recording.har'
    }, o);
    this.port = this.normalizePort(this.port);

    _app2.default.set('port', this.port);
    _app2.default.set('workspace', this.workspace);
    _app2.default.set('httpHARFile', this.httpHARFile);

    this.server = _http2.default.createServer(_app2.default);
  }

  start() {
    this.server.listen(this.port);
    this.server.on('error', this.onError.bind(this));
    this.server.on('listening', this.onListening.bind(this));
  }

  close() {
    this.server.close();
  }

  onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  onListening() {
    const addr = this.server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    (0, _debug2.default)('Listening on ' + bind);
  }

  normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
      // named pipe
      return val;
    }
    if (port >= 0) {
      // port number
      return port;
    }
    return false;
  }
}
exports.default = Server;
module.exports = exports['default'];