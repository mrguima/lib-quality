import request from "supertest";
import { Express } from 'express-serve-static-core';
import { app } from '../../src/';
import DBInit from '../../src/init/Database';
import MockAdapter from 'axios-mock-adapter';
import api from "../../src/service/github-api/instance";
import { ISSUES } from '../mock/issues.json';
import SearchLogController from "../../src/controller/SearchLogController";
import Logger from "../../src/util/Logger";
import ExpressPinoLogger from 'express-pino-logger';

let server: Express;

describe('APP should run successfully', () => {
    console.log = jest.fn();
    Logger.info = jest.fn();
    Logger.error = jest.fn();
    Logger.warn = jest.fn();
    Logger.debug = jest.fn();

    beforeAll(() => {
        server = app;
    });
    
    afterAll(async () => {
        await DBInit.stop();
    });

    it('should return 200', (done) => {
        request(server)
        .get('/')
        .expect(200)
        .end((err, res) => {
            if (err) return done(err)
            expect(res.body).toMatchObject({'message': `Welcome to LibQuality`})
            done()
        })
    });

    it('should search for valid repo', (done) => {
        const mock = new MockAdapter(api);
        mock.onGet('/search/repositories?q=lib-quality&order=desc&per_page=1')
        .reply(200, {
            total_count: 1, items: [{ full_name: 'dev/lib-quality' }],
        })
        .onGet('/repos/dev/lib-quality/issues?state=open&page=1&per_page=100')
        .reply(200, ISSUES)
        .onGet('/repos/dev/lib-quality/issues?state=open&page=2&per_page=100')
        .reply(200, [])
        .onGet('/user')
        .reply(200, { login: 'dev_tester' });
        
        request(server)
        .get('/search?name=lib-quality')
        .expect(200)
        .end((err, res) => {
            if (err) return done(err)
            expect(res.body).toMatchObject({
                avg_age: 60,
                issues: 1,
                std_age: 0,
                graph_points: {
                    x: ['2021-10'],
                    y: [1]
                }
            })
            done()
        })
    });

    it('should throw error for empty query', (done) => {        
        request(server)
        .get('/search?name=')
        .expect(422)
        .end((err, res) => {
            if (err) return done(err)
            expect(res.body).toMatchObject({ message: 'Unprocessable entity' })
            done()
        })
    });

    it('should throw error for repository not found', (done) => {
        const repoName = '1233fdfdf';
        const mock = new MockAdapter(api);

        mock.onGet(`/search/repositories?q=${repoName}&order=desc&per_page=1`)
        .reply(200, {
            total_count: 0, items: [],
        });
        request(server)
        .get(`/search?name=${repoName}`)
        .expect(404)
        .end((err, res) => {
            if (err) return done(err)
            expect(res.body).toMatchObject({ message: 'Repository not found' })
            done()
        })
    });

    it('should save search with valid token', (done) => {
        const mock = new MockAdapter(api);
        mock.onGet('/user')
        .reply(200, { login: 'dev_tester' });

        SearchLogController.saveSearchLog('123G3X', 'test-repo', 'dev/test-repo');

        request(server)
            .get('/list')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err)                
                expect(res.body[1]['userName']).toBe('dev_tester')
                done()
            })
    });

    it('should save search without token', (done) => {
        const mock = new MockAdapter(api);
        mock.onGet('/user')
        .reply(200, {});

        SearchLogController.saveSearchLog(undefined, 'test-repo', 'dev/test-repo');

        request(server)
            .get('/list')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err)                
                expect(res.body[2]['userName']).toBe('Unknown user')
                done()
            })
    });

    it('should save search with invalid token', async () => {
        const mock = new MockAdapter(api);
        mock.onGet('/user')
        .reply(401, {});

        await SearchLogController.saveSearchLog('invalid token', 'test-repo', 'dev/test-repo');

        expect(Logger.warn).toHaveBeenCalledWith('Invalid token, user information not available');
    });
});