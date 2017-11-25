const Route = require('route-parser');

module.exports = class WebsocketRouter {

    constructor() {
        this.routes = {};
    }

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

    match(namespace, method, path) {

        //console.log(this.routes);

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
