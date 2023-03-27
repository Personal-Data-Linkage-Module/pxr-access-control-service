/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import supertest = require('supertest');
import Application from '../index';
/* eslint-enable */

const expressApp = Application.express.app;

describe('Access Control Service', () => {
    beforeAll(async () => {
        await Application.start();
    });
    afterAll(async () => {
        await Application.stop();
    });

    describe('トークン取得API', () => {
        test('配列ではない', async () => {
            const response = await supertest(expressApp)
                .post('/access-control/token')
                .set({
                    'content-type': 'application/json',
                    accept: 'application/json'
                })
                .send({
                    caller: {
                        blockCode: 1111111,
                        apiUrl: '/book-manage/{userId}/contract',
                        apiMethod: 'GET',
                        userId: 'xxx_yyy.pxr-root',
                        apiCode: '0abdbf81-686c-423b-823a-ac0d889b0ae6',
                        operator: {
                            type: 0,
                            loginId: 'xxx_yyy.pxr-root'
                        },
                        requestBody: {
                            auth: {
                                member: {
                                    update: true,
                                    delete: true
                                }
                            }
                        }
                    },
                    target: {
                        blockCode: 2222222,
                        apiUrl: '/operator/11111',
                        apiMethod: 'PUT'
                    }
                });

            expect(JSON.stringify(response.body)).toBe(JSON.stringify({ status: 400, message: '配列ではありません' }));
            expect(response.status).toBe(400);
        });
        test('オペレーター種別がアプリケーションではない場合、loginIdが必要', async () => {
            const response = await supertest(expressApp)
                .post('/access-control/token')
                .set({
                    'content-type': 'application/json',
                    accept: 'application/json'
                })
                .send([{
                    caller: {
                        blockCode: 1111111,
                        apiUrl: '/book-manage/{userId}/contract',
                        apiMethod: 'GET',
                        userId: 'xxx_yyy.pxr-root',
                        apiCode: '0abdbf81-686c-423b-823a-ac0d889b0ae6',
                        operator: {
                            type: 0,
                            loginId: null
                        },
                        requestBody: {
                            auth: {
                                member: {
                                    update: true,
                                    delete: true
                                }
                            }
                        }
                    },
                    target: {
                        blockCode: 2222222,
                        apiUrl: '/operator/11111',
                        apiMethod: 'POST'
                    }
                }]);

            expect(JSON.stringify(response.body)).toBe(JSON.stringify(
                { status: 400, message: 'オペレーター.ログインIDの設定が必要です' }
            ));
            expect(response.status).toBe(400);
        });
        test('リクエストボディ.targetの_codeプロパティがオブジェクト', async () => {
            const response = await supertest(expressApp)
                .post('/access-control/token')
                .set({
                    'content-type': 'application/json',
                    accept: 'application/json'
                })
                .send([{
                    caller: {
                        blockCode: 1111111,
                        apiUrl: '/book-manage/{userId}/contract',
                        apiMethod: 'GET',
                        userId: 'xxx_yyy.pxr-root',
                        apiCode: '0abdbf81-686c-423b-823a-ac0d889b0ae6',
                        operator: {
                            type: 0,
                            loginId: 'xxx_yyy.pxr-root'
                        },
                        requestBody: {
                            auth: {
                                member: {
                                    update: true,
                                    delete: true
                                }
                            }
                        }
                    },
                    target: {
                        blockCode: 2222222,
                        apiUrl: '/book-operate/document/xxx_yyy.pxr-root',
                        apiMethod: 'POST'
                    }
                }]);

            expect(JSON.stringify(response.body)).toBe(JSON.stringify(
                { status: 400, message: '対象のURLへアクセスする場合、リクエストボディ.targetに_codeプロパティが必要です' }
            ));
            expect(response.status).toBe(400);
        });
    });

    describe('トークン発行API', () => {
        test('リクエストボディが空', async () => {
            const response = await supertest(expressApp)
                .post('/access-control')
                .set({
                    'content-type': 'application/json',
                    accept: 'application/json'
                })
                .send({});

            expect(JSON.stringify(response.body)).toBe(JSON.stringify({ status: 400, message: 'リクエストが空です' }));
            expect(response.status).toBe(400);
        });
        test('配列ではない', async () => {
            const response = await supertest(expressApp)
                .post('/access-control')
                .set({
                    'content-type': 'application/json',
                    accept: 'application/json'
                })
                .send({
                    caller: {
                        blockCode: 1111111,
                        apiUrl: 'https://~~~/book-manage/{userId}/contract',
                        apiMethod: 'GET',
                        userId: 'xxx_yyy.pxr-root',
                        apiCode: '0abdbf81-686c-423b-823a-ac0d889b0ae6',
                        operator: {
                            type: 0,
                            loginId: 'xxx_yyy.pxr-root'
                        }
                    },
                    target: {
                        blockCode: 2222222,
                        apiUrl: 'https://~~~/info-account-manage/{userId}/contract',
                        apiMethod: 'GET',
                        expirationDate: '2020-11-19T10:06:34.000+0900',
                        parameter: null
                    }
                });

            expect(JSON.stringify(response.body)).toBe(JSON.stringify({ status: 400, message: '配列ではありません' }));
            expect(response.status).toBe(400);
        });
        test('オペレーター種別がアプリケーションではない場合、loginIdが必要', async () => {
            const response = await supertest(expressApp)
                .post('/access-control')
                .set({
                    'content-type': 'application/json',
                    accept: 'application/json'
                })
                .send([{
                    caller: {
                        blockCode: 1111111,
                        apiUrl: 'https://~~~/book-manage/{userId}/contract',
                        apiMethod: 'GET',
                        userId: 'xxx_yyy.pxr-root',
                        apiCode: '0abdbf81-686c-423b-823a-ac0d889b0ae6',
                        operator: {
                            type: 0
                        }
                    },
                    target: {
                        blockCode: 2222222,
                        apiUrl: 'https://~~~/info-account-manage/{userId}/contract',
                        apiMethod: 'GET',
                        expirationDate: '2020-11-19T10:06:34.000+0900',
                        parameter: null
                    }
                }]);

            expect(JSON.stringify(response.body)).toBe(JSON.stringify(
                { status: 400, message: 'オペレーター.ログインIDの設定が必要です' }
            ));
            expect(response.status).toBe(400);
        });
        test('オペレーター種別がアプリケーションではない場合、loginIdが必要', async () => {
            const response = await supertest(expressApp)
                .post('/access-control')
                .set({
                    'content-type': 'application/json',
                    accept: 'application/json'
                })
                .send([{
                    caller: {
                        blockCode: 1111111,
                        apiUrl: 'https://~~~/book-manage/{userId}/contract',
                        apiMethod: 'GET',
                        userId: 'xxx_yyy.pxr-root',
                        apiCode: '0abdbf81-686c-423b-823a-ac0d889b0ae6',
                        operator: {
                            type: 0,
                            loginId: 'xxx_yyy.pxr-root'
                        }
                    },
                    target: {
                        blockCode: 2222222,
                        apiUrl: 'https://~~~/info-account-manage/{userId}/contract',
                        apiMethod: 'GET',
                        expirationDate: '2020-11-19T10:06:34.000+0900',
                        parameter: null
                    }
                }]);

            expect(JSON.stringify(response.body)).toBe(JSON.stringify(
                { status: 400, message: '有効期限を現在日時より過去を設定することはできません' }
            ));
            expect(response.status).toBe(400);
        });
    });

    describe('トークン照合API', () => {
        test('配列ではない', async () => {
            const response = await supertest(expressApp)
                .post('/access-control/collate')
                .set({
                    'content-type': 'application/json',
                    accept: 'application/json'
                })
                .send([{
                    caller: {
                        apiUrl: '/book-manage/{userId}/contract'
                    },
                    target: {
                        apiUrl: '/info-account-manage/{userId}/contract',
                        apiMethod: 'GET',
                        apiToken: '82887e0e25fb3b83ff6bd0442bdd903eac793566469b5847fbf29c5517b2a8e4'
                    }
                }]);

            expect(JSON.stringify(response.body));
            expect(response.status).toBe(400);
        });
    });
});
