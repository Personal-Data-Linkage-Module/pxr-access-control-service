/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import * as supertest from 'supertest';
import Application from '../index';
import Common, { Url } from './Common';
import { AccessControlManageServer, CatalogServer, OperatorServer } from './StubServer';
import OperatorDomain from '../domains/OperatorDomain';

// 対象アプリケーションを取得
const expressApp = Application.express.app;
const common = new Common();

// スタブサーバを起動
let accessControlManageServer:any = null;
let catalogServer: CatalogServer = null;
let operatorServer: OperatorServer = null;

/**
 * access-control API のユニットテスト
 */
describe('access-control API', () => {
    /**
     * 全テスト実行後の前処理
     */
    beforeAll(async () => {
        await Application.start();
        // DB初期化
        await common.executeSqlFile('initialData.sql');
    });
    /**
     * 各テスト実行の後処理
     */
    afterEach(async () => {
        // スタブサーバー停止
        if (accessControlManageServer) {
            accessControlManageServer.server.close();
            accessControlManageServer = null;
        }
        if (catalogServer) {
            catalogServer.server.close();
            catalogServer = null;
        }
        if (operatorServer) {
            operatorServer.server.close();
            operatorServer = null;
        }
    });
    /**
     * 全テスト実行後の後処理
     */
    afterAll(async () => {
        // サーバ停止
        await Application.stop();
    });

    /**
     * APIトークン取得開始
     */
    describe('APIトークン取得開始', () => {
        test('正常: Cookie 個人', async () => {
            accessControlManageServer = new AccessControlManageServer(3014, 200);
            catalogServer = new CatalogServer(3001, 1000001, 200);
            operatorServer = new OperatorServer(200, 0);
            await common.executeSqlString(`
                DELETE FROM pxr_access_control.api_token;
                SELECT SETVAL('pxr_access_control.api_token_id_seq', 1, false);
            `);
            const response = await supertest(expressApp)
                .post(Url.tokenURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set('Cookie', [OperatorDomain.TYPE_PERSONAL_KEY + '=81654181b851542feec3ee0ba3be7695f1472af4702f3aa2a6aa1971c5e3d645'])
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 1111111,
                                apiUrl: '/book-manage/{userId}/contract',
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
                                apiUrl: '/info-account-manage/{userId}/contract',
                                apiMethod: 'GET'
                            }
                        }
                    ]
                ));

            // Expect status Success Code
            expect(response.status).toBe(200);
        });
        test('正常: Cookie アプリケーション', async () => {
            accessControlManageServer = new AccessControlManageServer(3014, 200);
            catalogServer = new CatalogServer(3001, 1000001, 200);
            operatorServer = new OperatorServer(200, 2);
            await common.executeSqlString(`
                DELETE FROM pxr_access_control.api_token;
                SELECT SETVAL('pxr_access_control.api_token_id_seq', 1, false);
            `);
            const response = await supertest(expressApp)
                .post(Url.tokenURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set('Cookie', [OperatorDomain.TYPE_APPLICATION_KEY + '=81654181b851542feec3ee0ba3be7695f1472af4702f3aa2a6aa1971c5e3d645'])
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 1111111,
                                apiUrl: '/book-manage/{userId}/contract',
                                apiMethod: 'GET',
                                userId: 'xxx_yyy.pxr-root',
                                apiCode: '0abdbf81-686c-423b-823a-ac0d889b0ae6',
                                operator: {
                                    type: 2,
                                    app: {
                                        _value: 1000001,
                                        _ver: 1
                                    }
                                }
                            },
                            target: {
                                blockCode: 2222222,
                                apiUrl: '/info-account-manage/{userId}/contract',
                                apiMethod: 'GET'
                            }
                        }
                    ]
                ));

            // Expect status Success Code
            expect(response.status).toBe(200);
        });
        test('正常: Cookie 運営メンバー', async () => {
            accessControlManageServer = new AccessControlManageServer(3014, 200);
            catalogServer = new CatalogServer(3001, 1000001, 200);
            operatorServer = new OperatorServer(200, 3);
            await common.executeSqlString(`
                DELETE FROM pxr_access_control.api_token;
                SELECT SETVAL('pxr_access_control.api_token_id_seq', 1, false);
            `);
            const response = await supertest(expressApp)
                .post(Url.tokenURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set('Cookie', [OperatorDomain.TYPE_MANAGER_KEY + '=81654181b851542feec3ee0ba3be7695f1472af4702f3aa2a6aa1971c5e3d645'])
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 1111111,
                                apiUrl: '/book-manage/{userId}/contract',
                                apiMethod: 'GET',
                                userId: 'xxx_yyy.pxr-root',
                                apiCode: '0abdbf81-686c-423b-823a-ac0d889b0ae6',
                                operator: {
                                    type: 3,
                                    loginId: 'xxx_yyy.pxr-root'
                                }
                            },
                            target: {
                                blockCode: 2222222,
                                apiUrl: '/info-account-manage/{userId}/contract',
                                apiMethod: 'GET'
                            }
                        }
                    ]
                ));

            // Expect status Success Code
            expect(response.status).toBe(200);
        });
        test('異常: セッションなし', async () => {
            accessControlManageServer = new AccessControlManageServer(3014, 200);
            catalogServer = new CatalogServer(3001, 1000001, 200);
            operatorServer = new OperatorServer(200, 3);
            await common.executeSqlString(`
                DELETE FROM pxr_access_control.api_token;
                SELECT SETVAL('pxr_access_control.api_token_id_seq', 1, false);
            `);
            const response = await supertest(expressApp)
                .post(Url.tokenURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 1111111,
                                apiUrl: '/book-manage/{userId}/contract',
                                apiMethod: 'GET',
                                userId: 'xxx_yyy.pxr-root',
                                apiCode: '0abdbf81-686c-423b-823a-ac0d889b0ae6',
                                operator: {
                                    type: 3,
                                    loginId: 'xxx_yyy.pxr-root'
                                }
                            },
                            target: {
                                blockCode: 2222222,
                                apiUrl: '/info-account-manage/{userId}/contract',
                                apiMethod: 'GET'
                            }
                        }
                    ]
                ));

            // Expect status Success Code
            expect(response.status).toBe(401);
        });
        test('異常: オペレータ取得エラー 未起動', async () => {
            accessControlManageServer = new AccessControlManageServer(3014, 200);
            catalogServer = new CatalogServer(3001, 1000001, 200);
            await common.executeSqlString(`
                DELETE FROM pxr_access_control.api_token;
                SELECT SETVAL('pxr_access_control.api_token_id_seq', 1, false);
            `);
            const response = await supertest(expressApp)
                .post(Url.tokenURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set('Cookie', [OperatorDomain.TYPE_MANAGER_KEY + '=81654181b851542feec3ee0ba3be7695f1472af4702f3aa2a6aa1971c5e3d645'])
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 1111111,
                                apiUrl: '/book-manage/{userId}/contract',
                                apiMethod: 'GET',
                                userId: 'xxx_yyy.pxr-root',
                                apiCode: '0abdbf81-686c-423b-823a-ac0d889b0ae6',
                                operator: {
                                    type: 3,
                                    loginId: 'xxx_yyy.pxr-root'
                                }
                            },
                            target: {
                                blockCode: 2222222,
                                apiUrl: '/info-account-manage/{userId}/contract',
                                apiMethod: 'GET'
                            }
                        }
                    ]
                ));

            // Expect status Success Code
            expect(response.status).toBe(500);
        });
        test('異常: オペレータ取得エラー 500系', async () => {
            accessControlManageServer = new AccessControlManageServer(3014, 200);
            catalogServer = new CatalogServer(3001, 1000001, 200);
            operatorServer = new OperatorServer(500, 0);
            await common.executeSqlString(`
                DELETE FROM pxr_access_control.api_token;
                SELECT SETVAL('pxr_access_control.api_token_id_seq', 1, false);
            `);
            const response = await supertest(expressApp)
                .post(Url.tokenURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set('Cookie', [OperatorDomain.TYPE_MANAGER_KEY + '=81654181b851542feec3ee0ba3be7695f1472af4702f3aa2a6aa1971c5e3d645'])
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 1111111,
                                apiUrl: '/book-manage/{userId}/contract',
                                apiMethod: 'GET',
                                userId: 'xxx_yyy.pxr-root',
                                apiCode: '0abdbf81-686c-423b-823a-ac0d889b0ae6',
                                operator: {
                                    type: 3,
                                    loginId: 'xxx_yyy.pxr-root'
                                }
                            },
                            target: {
                                blockCode: 2222222,
                                apiUrl: '/info-account-manage/{userId}/contract',
                                apiMethod: 'GET'
                            }
                        }
                    ]
                ));

            // Expect status Success Code
            expect(response.status).toBe(500);
        });
        test('異常: オペレータ取得エラー 400系', async () => {
            accessControlManageServer = new AccessControlManageServer(3014, 200);
            catalogServer = new CatalogServer(3001, 1000001, 200);
            operatorServer = new OperatorServer(400, 0);
            await common.executeSqlString(`
                DELETE FROM pxr_access_control.api_token;
                SELECT SETVAL('pxr_access_control.api_token_id_seq', 1, false);
            `);
            const response = await supertest(expressApp)
                .post(Url.tokenURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set('Cookie', [OperatorDomain.TYPE_MANAGER_KEY + '=81654181b851542feec3ee0ba3be7695f1472af4702f3aa2a6aa1971c5e3d645'])
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 1111111,
                                apiUrl: '/book-manage/{userId}/contract',
                                apiMethod: 'GET',
                                userId: 'xxx_yyy.pxr-root',
                                apiCode: '0abdbf81-686c-423b-823a-ac0d889b0ae6',
                                operator: {
                                    type: 3,
                                    loginId: 'xxx_yyy.pxr-root'
                                }
                            },
                            target: {
                                blockCode: 2222222,
                                apiUrl: '/info-account-manage/{userId}/contract',
                                apiMethod: 'GET'
                            }
                        }
                    ]
                ));

            // Expect status Success Code
            expect(response.status).toBe(401);
        });
    });
});
