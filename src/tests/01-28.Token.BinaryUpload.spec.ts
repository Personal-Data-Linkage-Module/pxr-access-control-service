/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import * as supertest from 'supertest';
import Application from '../index';
import Common, { Url } from './Common';
import { Session } from './Session';
import { AccessControlManageServer, CatalogServer } from './StubServer';

// 対象アプリケーションを取得
const expressApp = Application.express.app;
const common = new Common();

// スタブサーバを起動
let accessControlManageServer:any = null;
let catalogServer: CatalogServer = null;

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
        test('正常：バイナリアップロードエンド', async () => {
            accessControlManageServer = new AccessControlManageServer(3014, 200);
            catalogServer = new CatalogServer(3001, 1000001, 200);
            await common.executeSqlString(`
                DELETE FROM pxr_access_control.api_token;
                SELECT SETVAL('pxr_access_control.api_token_id_seq', 1, false);
            `);
            const response = await supertest(expressApp)
                .post(Url.tokenURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
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
                                apiUrl: '/binary-manage/upload/end/{userId}',
                                apiMethod: 'POST',
                                _code: [
                                    {
                                        _value: 10000001,
                                        _ver: 1
                                    }
                                ]
                            }
                        }
                    ]
                ));

            // Expect status Success Code
            expect(response.status).toBe(200);
        });

        test('正常：バイナリアップロードキャンセル', async () => {
            accessControlManageServer = new AccessControlManageServer(3014, 200);
            catalogServer = new CatalogServer(3001, 1000001, 200);
            await common.executeSqlString(`
                DELETE FROM pxr_access_control.api_token;
                SELECT SETVAL('pxr_access_control.api_token_id_seq', 1, false);
            `);
            const response = await supertest(expressApp)
                .post(Url.tokenURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
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
                                apiUrl: '/binary-manage/upload/cancel/{userId}',
                                apiMethod: 'POST',
                                _code: [
                                    {
                                        _value: 10000001,
                                        _ver: 1
                                    }
                                ]
                            }
                        }
                    ]
                ));

            // Expect status Success Code
            expect(response.status).toBe(200);
        });

        test('正常：バイナリアップロードその他', async () => {
            accessControlManageServer = new AccessControlManageServer(3014, 200);
            catalogServer = new CatalogServer(3001, 1000001, 200);
            await common.executeSqlString(`
                DELETE FROM pxr_access_control.api_token;
                SELECT SETVAL('pxr_access_control.api_token_id_seq', 1, false);
            `);
            const response = await supertest(expressApp)
                .post(Url.tokenURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
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
                                apiUrl: '/binary-manage/upload/set/{userId}',
                                apiMethod: 'POST',
                                _code: [
                                    {
                                        _value: 10000001,
                                        _ver: 1
                                    }
                                ]
                            }
                        }
                    ]
                ));

            // Expect status Success Code
            expect(response.status).toBe(200);
        });
    });
});
