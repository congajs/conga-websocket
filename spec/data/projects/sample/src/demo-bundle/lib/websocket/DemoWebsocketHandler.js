module.exports = class DemoWebsocketHandler {

    constructor(container) {
        this.container = container;
    }

    connect(socket) {

        socket.emit('connect.success', { foo: 'bar' });

        socket.on('hello', (data, cb) => {
            cb('hello ' + data.name);
        });
    }
}
