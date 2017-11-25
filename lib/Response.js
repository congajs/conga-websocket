/**
 * This file is part of the conga-socketio module.
 *
 * (c) Marc Roulias <marc@lampjunkie.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * The WebsocketResponse holds all the response information
 * that a controller needs and mocks an expressjs response
 *
 * @author  Marc Roulias <marc@lampjunkie.com>
 */
module.exports = class WebsocketResponse {

    constructor(cb) {
        this.cb = cb;
        this.websocket = true;
        this.headers = {};
    }

    status(status) {
        this.status = status;
        return this;
    }

    json(body) {
        this.cb({
            status: this.status,
            body: body,
            headers: this.headers
        });
    }

    header(name, value) {
        this.headers[name] = value;
        return this;
    }

    return(data) {
        console.log('>>>>> in response return');
        console.log(data);
    }

    error(data) {
        console.log(data);
    }
}
