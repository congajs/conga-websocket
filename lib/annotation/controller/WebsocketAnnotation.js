/*
 * This file is part of the conga-framework module.
 *
 * (c) Marc Roulias <marc@lampjunkie.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const Annotation = require('@conga/annotations').Annotation;

/**
 * The @Websocket specifies that an entire controller or individual
 * action should be exposed through websockets
 *
 * @author Marc Roulias <marc@lampjunkie.com>
 *
 * @param {Object} data
 */
module.exports = class WebsocketAnnotation extends Annotation {

    /**
     * Define the annotation string to find
     *
     * @var {String}
     */
    static get annotation() { return 'Websocket:Controller'; }

    /**
     * The possible targets
     *
     * (Annotation.DEFINITION, Annotation.CONSTRUCTOR, Annotation.PROPERTY, Annotation.METHOD)
     *
     * @type {Array}
     */
    static get targets() { return [Annotation.DEFINITION] }

    init(data) {
        this.namespace = data.namespace || '/';
        this.websocketOnly = data.websocketOnly || false;
    }
}
