import 'reflect-metadata'
import config from 'config'
import http2 from 'node:http2'
import https from 'node:https'
import { expect } from 'vitest'
import port from "../../src/webapi/server.js"

// The server uses a self-signed certificate (see tls.sh / Dockerfile).
const tls = { rejectUnauthorized: false };

expect(config.util.getEnv('NODE_ENV')).toEqual('test');

interface Result { protocol: string, status: number, body: string, poweredBy: unknown }

function http2Get (path: string): Promise<Result> {
    return new Promise((resolve, reject) => {
        const session = http2.connect(`https://localhost:${port}`, tls);
        session.on('error', reject);
        const req = session.request({ ':path': path });
        let status = 0, body = '', poweredBy: unknown;
        req.setEncoding('utf8');
        req.on('response', headers => { status = Number(headers[':status']); poweredBy = headers['x-powered-by']; });
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            const protocol = session.alpnProtocol ?? '';
            session.close();
            resolve({ protocol, status, body, poweredBy });
        });
        req.on('error', reject);
        req.end();
    });
}

function http1Get (path: string): Promise<Result> {
    return new Promise((resolve, reject) => {
        https.get({ host: 'localhost', port, path, ...tls }, res => {
            let body = '';
            res.setEncoding('utf8');
            res.on('data', chunk => { body += chunk; });
            res.on('end', () => resolve({ protocol: `HTTP/${res.httpVersion}`, status: res.statusCode ?? 0, body, poweredBy: res.headers['x-powered-by'] }));
        }).on('error', reject);
    });
}

describe('HTTP/2 server tests', () => {
    it('serves Express routes over HTTP/2', async () => {
        const res = await http2Get('/health/live');
        expect(res.protocol).toBe('h2');
        expect(res.status).toBe(200);
        expect(res.body).toBe('OK');
    });
    it('does not send an X-Powered-By header', async () => {
        expect((await http2Get('/health/live')).poweredBy).toBeUndefined();
        expect((await http1Get('/health/live')).poweredBy).toBeUndefined();
    });
    it('returns Express 404 handling over HTTP/2', async () => {
        const res = await http2Get('/no-such-route');
        expect(res.protocol).toBe('h2');
        expect(res.status).toBe(404);
    });
    it('still serves HTTP/1.1 clients on the same port', async () => {
        const res = await http1Get('/health/live');
        expect(res.protocol).toBe('HTTP/1.1');
        expect(res.status).toBe(200);
        expect(res.body).toBe('OK');
    });
});
