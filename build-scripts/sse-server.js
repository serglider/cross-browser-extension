const http = require('http');
const EventEmitter = require('events');

EventEmitter.defaultMaxListeners = 50;

module.exports = function createSSEServer() {
    const ee = new EventEmitter();
    http.createServer(function (req, res) {
        if (req.headers.accept && req.headers.accept === 'text/event-stream') {
            if (req.url === '/events') {
                sendSSE(res, ee);
            } else {
                res.writeHead(404);
                res.end();
            }
        }
    }).listen(8125);

    return ee;
};

function sendSSE(res, ee) {
    const id = new Date().toLocaleTimeString();

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
    });

    ee.on('reload', () => {
        res.write('id: ' + id + '\n');
        res.write('data: update' + '\n\n');
    });
}
