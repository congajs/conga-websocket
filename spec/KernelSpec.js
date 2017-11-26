const path = require('path');
const util = require('util');
const Kernel = require('@conga/framework/lib/kernel/TestKernel');
const jasmine = require('jasmine');
const io = require('socket.io-client');

describe("websocket kernel", () => {

    //jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000000;

    let kernel;
    let articleId;

    beforeAll((done) => {

        kernel = new Kernel(
            path.join(__dirname, '..', 'spec', 'data', 'projects', 'sample'),
            'app',
            'test',
            {}
        );

        kernel.addBundlePaths({
            '@conga/framework-websocket': path.join(__dirname, '..'),
            'demo-bundle': path.join(__dirname, 'data', 'projects', 'sample', 'src', 'demo-bundle'),
        });

        kernel.boot(() => {
            done();
        });

    }, 1000000000);

    afterAll(() => {
        kernel.container.get('express.server').close();
    });

    it('should have websocket routes', (done) => {

        expect(typeof kernel.container.getParameter('conga.websocket.routes')).toEqual('object');

        done();
    });

    it('should connect to server', (done) => {

        const socket = io.connect('http://localhost:5555', {
            reconnect: true
        });

        socket.on('connect', (socket) => {
            done();
        });
    });

    it('should get response from route', (done) => {

        const socket = io.connect('http://localhost:5555', {
            reconnect: true
        });

        socket.on('connect', () => {
            socket.emit('conga.request', {
                method: 'GET',
                path: '/hello'
            }, (response) => {
                expect(response.body.message).toEqual('hello world');
                done();
            });
        });
    });

    it('should get response from route with named parameters', (done) => {

        const socket = io.connect('http://localhost:5555', {
            reconnect: true
        });

        socket.on('connect', () => {
            socket.emit('conga.request', {
                method: 'GET',
                path: '/say-hello/marc'
            }, (response) => {
                expect(response.body.message).toEqual('hello marc');
                done();
            });
        });
    });

    it('should post send querystring parameters to route', (done) => {

        const socket = io.connect('http://localhost:5555', {
            reconnect: true
        });

        socket.on('connect', () => {
            socket.emit('conga.request', {
                method: 'GET',
                path: '/querystring',
                query: {
                    a: 1,
                    b: 2
                }
            }, (response) => {
                expect(response.body.querystring).toEqual({ a: 1, b: 2 });
                done();
            });
        });
    });

    it('should post data to a route', (done) => {

        const socket = io.connect('http://localhost:5555', {
            reconnect: true
        });

        socket.on('connect', () => {
            socket.emit('conga.request', {
                method: 'POST',
                path: '/post-data',
                body: {
                    a: 1,
                    b: 2,
                    c: ['a', 'b', 'c']
                }
            }, (response) => {
                expect(response.body.body).toEqual({ a: 1, b: 2, c: ['a', 'b', 'c'] });
                done();
            });
        });
    });

    it('should get an error response', (done) => {

        const socket = io.connect('http://localhost:5555', {
            reconnect: true
        });

        socket.on('connect', () => {
            socket.emit('conga.request', {
                method: 'GET',
                path: '/build-error-response'
            }, (response) => {
                expect(response.status).toEqual(403);
                expect(response.body.message).toEqual('Built using buildErrorResponse');
                done();
            });
        });
    });


    it('should get a message from handler', (done) => {

        const socket = io.connect('http://localhost:5555', {
            reconnect: true
        });

        socket.on('connect', () => {

            socket.on('connect.success', (data) => {
                expect(data.foo).toEqual('bar');
                done();
            });

        });
    });

    it('should call handler and get a response', (done) => {

        const socket = io.connect('http://localhost:5555');

        socket.on('connect', () => {

            socket.emit('hello', { name: 'bob' }, (data) => {
                expect(data).toEqual('hello bob');
                done();
            });

        });
    });
});
