const path = require('path');
const jasmine = require('jasmine');

const WebsocketRouter = require('../lib/WebsocketRouter');


describe("WebsocketRouter", () => {

    let router;

    beforeAll(() => {

        router = new WebsocketRouter();
        router.setRoutes([
            {
                method: 'GET',
                path: '/test/path',
                serviceId: 'my.service.id',
                websocketNamespace: '/'
            },
            {
                method: 'GET',
                path: '/route/with/params/:one/:two',
                serviceId: 'my.other.service.id',
                websocketNamespace: '/'
            }
        ]);
    });

    it("should find route for exact path match", () => {

        const route = router.match('/', 'GET', '/test/path');
        expect(route.route.serviceId).toEqual('my.service.id');

    });

    it("should find route with params", () => {

        const route = router.match('/', 'GET', '/route/with/params/foo/bar');
        expect(route.route.serviceId).toEqual('my.other.service.id');
        expect(route.params.one).toEqual('foo');
        expect(route.params.two).toEqual('bar');

    });

    it("should return false when match isn't found", () => {
        const route = router.match('/', 'GET', '/route/not/defined');
        expect(route).toEqual(false);
    });
});
