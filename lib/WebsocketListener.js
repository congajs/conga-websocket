/*
 * This file is part of the conga-websocket module.
 *
 * (c) Marc Roulias <marc@lampjunkie.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// built-in modules
const http = require('http');

// local modules
const WebsocketRequest = require('./WebsocketRequest');
const WebsocketResponse = require('./WebsocketResponse');

/**
 * The WebsocketListener registers and starts socket.io on the kernel
 */
module.exports = class WebsocketListener {

    /**
     * Configure and start the socket.io server on the kernel's
     * server boot event
     *
     * @param  {Object}   event
     * @param  {Function} next
     * @return {void}
     */
    onServerBoot(event, next) {

        const container = event.container;

        container.get('logger').debug('[conga-websocket] - setting up socket.io');

        const config = container.get('config').get('websockets');
        const io = require('socket.io')(
            container.get('express.server'),
            this.setupSocketIoConfig(container, config.socketio)
        );

        // store socket.io on the container
        container.set('io', io);

        container.get('conga.websocket.router').setRoutes(
            container.getParameter('conga.websocket.routes')
        );

        this.setup(container, io, config, next);

    }

    /**
     * Build final socket.io server config
     *
     * @param  {Container}   container
     * @param  {Object}      config
     * @return {void}
     */
    setupSocketIoConfig(container, config) {

        const ioConfig = Object.assign({}, config);

        const factory = require(container.get('namespace.resolver').resolveWithSubpath(
            config.adapter.factory, 'lib') + '.js'
        );

        ioConfig.adapter = factory.factory(container, config.adapter.options);

        return ioConfig;
    }

    /**
     * Set up the websocket routing and handlers
     *
     * @param  {Container}   container
     * @param  {SocketIO}    io
     * @param  {Object}      config
     * @param  {Function}    next
     * @return {void}
     */
    setup(container, io, config, next) {

        const router = container.get('conga.websocket.router');

        config.handlers.forEach(handler => {

            const service = container.get(handler.service);

            io.of(handler.namespace).on('connection', socket => {

                container.get('logger').debug('[conga-websocket] - websocket client (' + socket.id + ') connected to: ' + handler.namespace);

                /**
                 * This is the listener which proxies websocket requests to standard controllers
                 * and emulates standard HTTP requests
                 *
                 * The expected message format is:
                 *
                 * {
                 *     method: 'GET',
                 *     path: '/some/path',
                 *     body: {},
                 *     query: {
                 *         foo: 'bar'
                 *     },
                 *     headers: {
                 *         "x-foo-header": "abc"
                 *     }
                 * }
                 */
                socket.on('conga.request', (data, cb) => {

                    const request = new WebsocketRequest(socket, data);
                    const response = new WebsocketResponse(cb);

                    const route = container.get('conga.websocket.router').match(
                        handler.namespace,
                        data.method,
                        data.path
                    );

                    if (!route) {


                    }

                    request.socket = socket;
                    request.method = data.method;
                    request.params = route.params;

                    // run the route which passes it through all filters/listeners/response handers
                    container.get('conga.route.runner').run(
                        container,
                        route.route,
                        request,
                        response
                    );

                });

                // connect socket to handler
                service.connect(socket);

            });

        });

        next();
    }
}
