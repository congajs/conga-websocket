export default class SocketClient {

    constructor(socket) {
        this.socket = socket;
    }

    /**
     * Make a GET request
     *
     * @param  {String} path  the path
     * @param  {Object} query hash of querystring parameters
     *
     * @return {Object}
     */
    get(path, query = null) {
        return this.request('GET', path, null, query);
    }

    /**
     * Make a POST request
     *
     * @param  {String} path  the path
     * @param  {Object} body  the request body
     * @param  {Object} query hash of querystring parameters
     *
     * @return {Object}
     */
    post(path, body = null, query = null) {
        return this.request('POST', path, body, query);
    }

    /**
     * Make a PUT request
     *
     * @param  {String} path  the path
     * @param  {Object} body  the request body
     * @param  {Object} query hash of querystring parameters
     *
     * @return {Object}
     */
    put(path, body = null, query = null) {

    }

    /**
     * Make a PATCH request
     *
     * @param  {String} path  the path
     * @param  {Object} body  the request body
     * @param  {Object} query hash of querystring parameters
     *
     * @return {Object}
     */
    patch(path, body = null, query = null) {

    }

    /**
     * Make a DELETE request
     *
     * @param  {String} path  the path
     * @param  {Object} query hash of querystring parameters
     *
     * @return {Object}
     */
    delete(path, query = null) {

    }

    /**
     * Make a request
     *
     * @param  {String} method the HTTP method
     * @param  {String} path   the path
     * @param  {Object} body   the request body
     * @param  {Object} query  hash of querystring parameters
     *
     * @return {Object}
     */
    request(method, path, body = null, query = null) {

        return new Promise((resolve, reject) => {
            this.socket.emit('conga.request', {
                method: method,
                path: path,
                body: body,
                query: query
            }, (response) => {
                if (response.status >= 200 && < 300) {
                    resolve(response.body);
                } else {
                    reject(response);
                }
            });
        });

    }
}
