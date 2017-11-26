const Controller = require('@conga/framework/lib/controller/Controller');

/**
 * @Route("/")
 */
module.exports = class DefaultController extends Controller {

    /**
     * @Route("/", methods=["GET"])
     */
    index(req, res) {
        res.return({
            message: 'it works!'
        })
    }
}
