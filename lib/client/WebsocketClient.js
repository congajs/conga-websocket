const io = require('socket.io-client');

export default class WebsocketClient {

    connect(url, options) {
        this.socket = io.connect(url, options);
    }

    on(event, cb) {
        this.socket.on(event, cb);
    }

    emit(event, data, cb) {
        this.socket.emit(event, data, cb);
    }

    get(path, query) {
        return this.request('GET', path, query);
    }

    post(path, body, query = null) {
        return this.request('POST', path, query, body);
    }

    put(path, body, query) {
        return this.request('PUT', path, query, body);
    }

    patch(path, body, query) {
        return this.request('PATCH', path, query, body);
    }

    delete(path, body, query) {
        return this.request('DELETE', path, query, body);
    }

    request(method, path, query = null, body = null) {

        return new Promise((resolve, reject) => {

            this.socket.emit('conga.request', {
                method: method,
                path: path,
                query: query,
                body: body
            }, (response) => {

                if (response.status < 300) {
                    resolve(response);
                } else {
                    reject(response);
                }

            });

        });

    }

    watch(resource, watcher) {

    }

    unwatch(resource) {
        
    }
}
