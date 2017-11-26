/*
 * This file is part of the conga-websocket module.
 *
 * (c) Marc Roulias <marc@lampjunkie.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * The WebsocketResponse holds all the response information
 * that a controller needs and mocks an expressjs response
 */
module.exports = class WebsocketResponse {

    /**
     * Create the WebsocketResponse with the websocket callback to respond to
     *
     * @param  {Function} cb
     */
    constructor(cb) {
        this.cb = cb;
        this.websocket = true;
        this.headers = {};
        this.stat = 200;
    }

    /**
     * Set the HTTP response status
     *
     * @param  {Number} status
     * @return {WebsocketResponse}
     */
    status(status) {
        this.stat = status;
        return this;
    }

    /**
     * Send the JSON response
     *
     * @param  {Mixed} body
     * @return {void}
     */
    json(body) {
        this.cb({
            status: this.stat,
            body: body,
            headers: this.headers
        });
    }

    /**
     * Set a header
     *
     * @param  {String} name
     * @param  {String} value
     * @return {WebsocketResponse}
     */
    header(name, value) {
        this.headers[name] = value;
        return this;
    }

    // return(data) {
    //     console.log('>>>>> in response return');
    //     console.log(data);
    // }
    //
    // error(data) {
    //     console.log(data);
    // }
}
