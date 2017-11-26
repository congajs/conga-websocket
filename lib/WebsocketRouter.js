/*
 * This file is part of the conga-websocket module.
 *
 * (c) Marc Roulias <marc@lampjunkie.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const Route = require('route-parser');

/**
 * The WebsocketRouter handles routing websocket requests to annotated/registered controllers
 */
module.exports = class WebsocketRouter {

    /**
     * @constructor
     */
    constructor() {
        this.routes = {};
    }

    /**
     * Set the routes
     *
     * @param {Object}
     */
    setRoutes(routes) {

        routes.forEach((route) => {

            if (typeof this.routes[route.websocketNamespace] === 'undefined') {
                this.routes[route.websocketNamespace] = {};
            }

            if (typeof this.routes[route.websocketNamespace][route.method] === 'undefined') {
                this.routes[route.websocketNamespace][route.method] = [];
            }

            const r = new Route(route.path);
            r.route = route;

            this.routes[route.websocketNamespace][route.method].push(r);
        });

    }

    /**
     * Try to match the combination of namespace/method/path to a route
     *
     * @param  {String} namespace the namespace (i.e. "/", "/my-namespace")
     * @param  {String} method    the HTTP method (i.e. GET/POST/PUT/etc.)
     * @param  {String} path      the URL path (i.e. /my-controller/action)
     * @return {Object}
     */
    match(namespace, method, path) {

        if (typeof this.routes[namespace] === 'undefined') {
            return null;
        }

        if (typeof this.routes[namespace][method] === 'undefined') {
            return null;
        }

        for (let i = 0; i < this.routes[namespace][method].length; i++) {

            const match = this.routes[namespace][method][i].match(path);

            if (match) {

                return {
                    route: this.routes[namespace][method][i].route,
                    params: match
                }
            }
        }

        return false;
    }

}
