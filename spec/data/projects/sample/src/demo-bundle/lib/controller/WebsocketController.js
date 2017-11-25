const Controller = require('@conga/framework/lib/controller/Controller');

/**
 * @Route("/")
 * @Websocket:Controller
 */
module.exports = class WebsocketController extends Controller {

    /**
     * @Route("/hello")
     */
    hello(req, res) {
        res.return({
            message: 'hello world'
        });
    }

    /**
     * @Route("/say-hello/:name")
     */
    sayHello(req, res) {
        res.return({
            message: 'hello ' + req.params.name
        });
    }

    /**
     * @Route("/post-data", methods=['POST'])
     */
    postData(req, res) {

        res.return({
            body: req.body
        });
    }

    /**
     * @Route("/querystring", methods=['GET'])
     */
    querystring(req, res) {

        res.return({
            querystring: req.query
        });
    }

    /**
     * @Route("/build-error-response", methods=["GET"])
     */
    buildErrorResponseTest(req, res) {
        res.error(this.buildErrorResponse({
            message: 'Built using buildErrorResponse',
            status: 403
        }, 403));
    }
}
