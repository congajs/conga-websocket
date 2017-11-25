/*
 * This file is part of the conga-socketio module.
 *
 * (c) Marc Roulias <marc@lampjunkie.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// native modules
const path = require('path');
const url = require('url');

// third-party modules
const _ = require('lodash');

// local modules
const WebsocketAnnotation = require('../WebsocketAnnotation');

/**
 * The WebsocketAnnotationHandler finds all websocket annotations within the registered
 * controllers and configures the websocket routes
 *
 * @author Marc Roulias <marc@lampjunkie.com>
 */
module.exports = class WebsocketAnnotationHandler {

    /**
     * Get the annotation paths that should be parsed
     *
     * @return {Array}
     */
    getAnnotationPaths() {
        return [
            path.join(__dirname, '..', 'WebsocketAnnotation')
        ];
    }

    /**
     * Handle all of the websocket annotations on a controller
     *
     * @param {Container} container
     * @param {Reader} reader
     * @param {Object} controller
     * @return {Array}
     */
    handleAnnotations(container, reader, controller) {

        // parse the routes from the controller
        const routes = this.parseRoutesFromFile(container, reader, controller);

        if (routes.length > 0) {

            // make sure that container has routes array
            if (!container.hasParameter('conga.websocket.routes')) {
                container.setParameter('conga.websocket.routes', []);
            }

            // store routes for socket.io to use later on
            container.setParameter('conga.websocket.routes', container.getParameter('conga.websocket.routes').concat(routes));
        }
    }

    /**
     * Find the annotations in a controller and build all the routes based
     * on the annotation data
     *
     * @param {Container} container
     * @param {Reader} reader
     * @param {Object} controller
     * @return {Array}
     */
    parseRoutesFromFile(container, reader, controller) {

        const congaRoutes = container.getParameter('conga.routes');
        const routes = [];

        reader.parse(controller.filePath);
        const definitionAnnotations = reader.definitionAnnotations;
        const methodAnnotations = reader.methodAnnotations;

        // find constructor annotations
        definitionAnnotations.forEach((annotation) => {

            // @WebsocketRest annotation
            if (annotation instanceof WebsocketAnnotation) {

                congaRoutes.forEach((route) => {
                    if (route.controller === controller.serviceId) {
                        route.websocketNamespace = annotation.namespace;
                        routes.push(route);
                    }
                });

            }

        }, this);

        // // find method annotations
        // methodAnnotations.forEach((annotation) => {
        //
        //     // @Websocket annotation
        //     if (annotation.annotation === 'WebsocketAnnotation') {
        //
        //         // create the route configuration
        //         routes.push({
        //             name: annotation.name,
        //             controller: controller.serviceId,
        //             action: annotation.target
        //         });
        //     }
        // });

        return routes;
    }
}
