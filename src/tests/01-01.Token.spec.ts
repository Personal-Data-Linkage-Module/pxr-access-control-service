/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import * as supertest from 'supertest';
import Application from '../index';
import Common, { Url } from './Common';
import { Session } from './Session';
import { AccessControlManage5Server, AccessControlManageServer, AccessControlManageServerShare, AccessControlManageServerStore, CatalogServer, OperatorServer } from './StubServer';

// 対象アプリケーションを取得
const expressApp = Application.express.app;
const common = new Common();

// スタブサーバを起動
let accessControlManageServer: AccessControlManageServer | AccessControlManageServerStore = null;
let catalogServer: CatalogServer = null;
let operatorServer: OperatorServer = new OperatorServer(200, 3);

/**
 * access-control API のユニットテスト
 */
describe('access-control API', () => {
    /**
     * 全テスト実行の前処理
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
     * 全テスト実行の後処理
     */
    afterAll(async () => {
        // サーバ停止
        await Application.stop();
        // スタブサーバー停止
        operatorServer.server.close();
        operatorServer = null;
    });

    /**
     * APIトークン取得開始
     */
    describe('APIトークン取得開始', () => {
        test('異常: アクセス制御管理サービスとの接続に失敗', async () => {
            catalogServer = new CatalogServer(3001, 1000001, 200);
            const response = await supertest(expressApp)
                .post(Url.tokenURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.app)) })
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
                        }
                    ]
                ));

            expect(response.status).toBe(500);
        });
        test('異常: アクセス制御管理サービス側からレスポンスが異常', async () => {
            accessControlManageServer = new AccessControlManageServer(3014, 400);
            catalogServer = new CatalogServer(3001, 1000001, 200);
            const response = await supertest(expressApp)
                .post(Url.tokenURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.app)) })
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
                        }
                    ]
                ));

            expect(response.status).toBe(400);
        });
        test('異常: アクセス制御管理サービス側の内部処理に失敗', async () => {
            accessControlManageServer = new AccessControlManageServer(3014, 503);
            catalogServer = new CatalogServer(3001, 1000001, 200);
            const response = await supertest(expressApp)
                .post(Url.tokenURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.app)) })
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
                        }
                    ]
                ));

            expect(response.status).toBe(503);
        });

        test('異常: アクセス制御管理から取得したトークンとリクエストが一致しない', async () => {
            accessControlManageServer = new AccessControlManage5Server(3014);
            catalogServer = new CatalogServer(3001, 1000001, 200);
            const response = await supertest(expressApp)
                .post(Url.tokenURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.app)) })
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
                        }
                    ]
                ));

            // Expect status Success Code
            expect(response.status).toBe(400);
        });

        test('正常: APIトークンテーブルにデータがない', async () => {
            accessControlManageServer = new AccessControlManageServer(3014, 200);
            catalogServer = new CatalogServer(3001, 1000001, 200);
            const response = await supertest(expressApp)
                .post(Url.tokenURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.app)) })
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
                        }
                    ]
                ));

            // Expect status Success Code
            expect(response.status).toBe(200);
        });

        test('正常: APIトークンテーブルにデータがない(アプリケーション)', async () => {
            // DB初期化
            await common.executeSqlFile('initialData.sql');
            accessControlManageServer = new AccessControlManageServer(3014, 200);
            catalogServer = new CatalogServer(3001, 1000001, 200);
            const response = await supertest(expressApp)
                .post(Url.tokenURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.app)) })
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
                        }
                    ]
                ));

            // Expect status Success Code
            expect(response.status).toBe(200);
        });

        test('正常: APIトークンテーブルにデータがない', async () => {
            await common.executeSqlFile('initialData.sql');
            accessControlManageServer = new AccessControlManageServer(3014, 200);
            catalogServer = new CatalogServer(3001, 1000001, 200);
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
                                apiUrl: '/book-manage',
                                apiMethod: 'POST'
                            }
                        }
                    ]
                ));

            // Expect status Success Code
            expect(response.status).toBe(200);
        });

        test('正常: ヘッダーにアクセストークンあり', async () => {
            await common.executeSqlFile('initialData.sql');
            accessControlManageServer = new AccessControlManageServer(3014, 200);
            catalogServer = new CatalogServer(3001, 1000001, 200);
            const response = await supertest(expressApp)
                .post(Url.tokenURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json', 'access-token': 'test-token' })
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
                                apiUrl: '/book-manage',
                                apiMethod: 'POST'
                            }
                        }
                    ]
                ));

            // Expect status Success Code
            expect(response.status).toBe(200);
        });

        test('正常: APIトークンテーブルにデータがある(Tokenなし)', async () => {
            accessControlManageServer = new AccessControlManageServer(3014, 200);
            catalogServer = new CatalogServer(3001, 1000001, 200);
            // 事前データ準備
            await common.executeSqlString(`
            DELETE FROM pxr_access_control.api_token;
            SELECT SETVAL('pxr_access_control.api_token_id_seq', 1, false);
            INSERT INTO pxr_access_control.api_token
                (
                    token,
                    target_block_code, target_api_url, target_api_method, target_user_id,
                    expiration_date,
                    caller_block_code, caller_api_url, caller_api_method,
                    caller_api_code,
                    caller_wf_code, caller_wf_version,
                    caller_app_code, caller_app_version,
                    caller_operator_type,
                    caller_operator_login_id,
                    is_disabled, created_by, created_at, updated_by, updated_at
                )
                VALUES
                (
                    'ee5fd41305d043e45f6d2ed00e03844f06ee89d0e044541641166306a7d11929',
                    2222222, '/info-account-manage/{userId}/contract', 'GET', 'xxx_yyy.pxr-root',
                    '2030/12/31 00:00:00.000',
                    1111111, '/book-manage/{userId}/contract', 'GET',
                    '',
                    0, 0,
                    0, 0,
                    0,
                    'xxx_yyy.pxr-root',
                    false, 'pxr_user', NOW(), 'pxr_user', NOW()
                );
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
                                },
                                requestBody: { operator: { } }
                            },
                            target: {
                                blockCode: 2222222,
                                apiUrl: '/operator/11111',
                                apiMethod: 'PUT'
                            }
                        }
                    ]
                ));

            // Expect status Success Code
            expect(response.status).toBe(200);
        });

        test('正常: APIトークンテーブルにデータがある(Tokenあり)', async () => {
            accessControlManageServer = new AccessControlManageServer(3014, 200);
            catalogServer = new CatalogServer(3001, 1000001, 200);
            // 事前データ準備
            await common.executeSqlString(`
            DELETE FROM pxr_access_control.api_token;
            SELECT SETVAL('pxr_access_control.api_token_id_seq', 1, false);
            INSERT INTO pxr_access_control.api_token
                (
                    token,
                    target_block_code, target_api_url, target_api_method, target_user_id,
                    expiration_date,
                    caller_block_code, caller_api_url, caller_api_method,
                    caller_api_code,
                    caller_wf_code, caller_wf_version,
                    caller_app_code, caller_app_version,
                    caller_operator_type,
                    caller_operator_login_id,
                    is_disabled, created_by, created_at, updated_by, updated_at
                )
                VALUES
                (
                    'ee5fd41305d043e45f6d2ed00e03844f06ee89d0e044541641166306a7d11929',
                    2222222, '/info-account-manage/{userId}/contract', 'GET', null,
                    '2030/12/31 00:00:00.000',
                    1111111, '/book-manage/{userId}/contract', 'GET',
                    '',
                    0, 0,
                    0, 0,
                    3,
                    'loginid',
                    false, 'pxr_user', NOW(), 'pxr_user', NOW()
                );
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
                                apiUrl: '/info-account-manage/{userId}/contract',
                                apiMethod: 'GET'
                            }
                        }
                    ]
                ));

            // Expect status Success Code
            expect(response.status).toBe(200);
        });

        test('正常: APIトークンテーブルにデータがある(Tokenあり)', async () => {
            accessControlManageServer = new AccessControlManageServer(3014, 200);
            catalogServer = new CatalogServer(3001, 1000001, 200);
            // 事前データ準備
            await common.executeSqlString(`
            DELETE FROM pxr_access_control.api_token;
            SELECT SETVAL('pxr_access_control.api_token_id_seq', 1, false);
            INSERT INTO pxr_access_control.api_token
                (
                    token,
                    target_block_code, target_api_url, target_api_method, target_user_id,
                    expiration_date,
                    caller_block_code, caller_api_url, caller_api_method,
                    caller_api_code,
                    caller_wf_code, caller_wf_version,
                    caller_app_code, caller_app_version,
                    caller_operator_type,
                    caller_operator_login_id,
                    is_disabled, created_by, created_at, updated_by, updated_at
                )
                VALUES
                (
                    'ee5fd41305d043e45f6d2ed00e03844f06ee89d0e044541641166306a7d11929',
                    2222222, '/info-account-manage/{userId}/contract', 'GET', null,
                    '2030/12/31 00:00:00.000',
                    1111111, '/book-manage/{userId}/contract', 'GET',
                    '',
                    0, 0,
                    0, 0,
                    3,
                    'loginid',
                    false, 'pxr_user', NOW(), 'pxr_user', NOW()
                );
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
                                },
                                requestBody: {}
                            },
                            target: {
                                blockCode: 2222222,
                                apiUrl: '/catalog/ext/10003',
                                apiMethod: 'PUT'
                            }
                        }
                    ]
                ));

            // Expect status Success Code
            expect(response.status).toBe(200);
        });

        test('正常: APIトークンテーブルにデータがある(Tokenあり)', async () => {
            accessControlManageServer = new AccessControlManageServer(3014, 200);
            catalogServer = new CatalogServer(3001, 1000001, 200);
            // 事前データ準備
            await common.executeSqlString(`
            DELETE FROM pxr_access_control.api_token;
            SELECT SETVAL('pxr_access_control.api_token_id_seq', 1, false);
            INSERT INTO pxr_access_control.api_token
                (
                    token,
                    target_block_code, target_api_url, target_api_method, target_user_id,
                    expiration_date,
                    caller_block_code, caller_api_url, caller_api_method,
                    caller_api_code,
                    caller_wf_code, caller_wf_version,
                    caller_app_code, caller_app_version,
                    caller_operator_type,
                    caller_operator_login_id,
                    is_disabled, created_by, created_at, updated_by, updated_at
                )
                VALUES
                (
                    'ee5fd41305d043e45f6d2ed00e03844f06ee89d0e044541641166306a7d11929',
                    2222222, '/info-account-manage/{userId}/contract', 'GET', null,
                    '2030/12/31 00:00:00.000',
                    1111111, '/book-manage/{userId}/contract', 'GET',
                    '',
                    0, 0,
                    0, 0,
                    3,
                    'loginid',
                    false, 'pxr_user', NOW(), 'pxr_user', NOW()
                );
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
                                apiUrl: '/info-account-manage/{userId}/contract',
                                apiMethod: 'GET'
                            }
                        },
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
                                apiMethod: 'POST'
                            }
                        }
                    ]
                ));

            // Expect status Success Code
            expect(response.status).toBe(200);
        });

        test('正常: APIトークンテーブルにデータがある(Tokenなし)', async () => {
            accessControlManageServer = new AccessControlManageServer(3014, 200);
            catalogServer = new CatalogServer(3001, 1000001, 200);
            // 事前データ準備
            await common.executeSqlString(`
                DELETE FROM pxr_access_control.api_token;
                SELECT SETVAL('pxr_access_control.api_token_id_seq', 1, false);
                INSERT INTO pxr_access_control.api_token
                (
                    token,
                    target_block_code, target_api_url, target_api_method, target_user_id,
                    expiration_date,
                    caller_block_code, caller_api_url, caller_api_method,
                    caller_api_code,
                    caller_wf_code, caller_wf_version,
                    caller_app_code, caller_app_version,
                    caller_operator_type,
                    caller_operator_login_id,
                    is_disabled, created_by, created_at, updated_by, updated_at
                )
                VALUES
                (
                    'ee5fd41305d043e45f6d2ed00e03844f06ee89d0e044541641166306a7d11920',
                    4444444, '/book-operate/store/{userId}/event', 'POST', '',
                    '2030/12/31 00:00:00.000',
                    4444444, '/book-operate/store/{userId}/event', 'POST',
                    '',
                    0, 0,
                    1000099, 1,
                    2,
                    'xxx_yyy.pxr-root',
                    false, 'pxr_user', NOW(), 'pxr_user', NOW()
                );
            `);
            const response = await supertest(expressApp)
                .post(Url.tokenURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 4444444,
                                apiUrl: '/book-operate/store/{userId}/event',
                                apiMethod: 'POST',
                                userId: 'xxx_yyy.pxr-root',
                                apiCode: '0abdbf81-686c-423b-823a-ac0d889b0ae6',
                                operator: {
                                    type: 2,
                                    app: {
                                        _value: 1000099,
                                        _ver: 1
                                    }
                                }
                            },
                            target: {
                                blockCode: 4444444,
                                apiUrl: '/book-operate/store/{userId}/event',
                                apiMethod: 'POST'
                            }
                        }
                    ]
                ));
            // Expect status Success Code
            expect(response.status).toBe(200);
        });

        test('正常: アクセス制御管理のURLでstoreを呼び出し', async () => {
            accessControlManageServer = new AccessControlManageServerStore(3014);
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
                                },
                                requestBody: {
                                    code: {
                                        value: 1000001
                                    },
                                    app: {
                                        app: {
                                            value: {
                                                _value: 1000005,
                                                _ver: 1
                                            }
                                        }
                                    }
                                }
                            },
                            target: {
                                blockCode: 2222222,
                                apiUrl: '/book-operate/event/{userId}',
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

        test('正常: アクセス制御管理のURLでshareを呼び出し', async () => {
            accessControlManageServer = new AccessControlManageServerShare(3014);
            catalogServer = new CatalogServer(3001, 1000001, 200);
            await common.executeSqlString(`
                DELETE FROM pxr_access_control.api_token;
                SELECT SETVAL('pxr_access_control.api_token_id_seq', 1, false);
            `);
            const response = await supertest(expressApp)
                .post(Url.tokenURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.app)) })
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
                                },
                                requestBody: {
                                    code: {
                                        value: 1000001
                                    },
                                    app: {
                                        app: {
                                            value: {
                                                _value: 1000005,
                                                _ver: 1
                                            }
                                        }
                                    }
                                }
                            },
                            target: {
                                blockCode: 2222222,
                                apiUrl: '/book-operate/share/search',
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

        test('正常: opeatorとtargetのblockCodeが同じ', async () => {
            accessControlManageServer = new AccessControlManageServerShare(3014);
            catalogServer = new CatalogServer(3001, 1000001, 200);
            await common.executeSqlString(`
                DELETE FROM pxr_access_control.api_token;
                SELECT SETVAL('pxr_access_control.api_token_id_seq', 1, false);
            `);
            const response = await supertest(expressApp)
                .post(Url.tokenURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.app)) })
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
                                },
                                requestBody: {
                                    code: {
                                        value: 1000001
                                    },
                                    app: {
                                        app: {
                                            value: {
                                                _value: 1000005,
                                                _ver: 1
                                            }
                                        }
                                    }
                                }
                            },
                            target: {
                                blockCode: 1000110,
                                apiUrl: '/book-operate/share/search',
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

        test('正常: クッキーにセッションIDがある', async () => {
            accessControlManageServer = new AccessControlManageServerStore(3014);
            catalogServer = new CatalogServer(3001, 1000001, 200);
            await common.executeSqlString(`
                DELETE FROM pxr_access_control.api_token;
                SELECT SETVAL('pxr_access_control.api_token_id_seq', 1, false);
            `);
            const response = await supertest(expressApp)
                .post(Url.tokenURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set('Cookie', ['operator_type3_session=sessionId'])
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
                                },
                                requestBody: {
                                    code: {
                                        value: 1000001
                                    },
                                    app: {
                                        app: {
                                            value: {
                                                _value: 1000005,
                                                _ver: 1
                                            }
                                        }
                                    }
                                }
                            },
                            target: {
                                blockCode: 2222222,
                                apiUrl: '/book-operate/event/{userId}',
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

        test('正常: アクセス制御管理のURLでstoreを呼び出しユーザIDあり', async () => {
            accessControlManageServer = new AccessControlManageServerStore(3014);
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
                                },
                                requestBody: {
                                    code: {
                                        value: 1000001
                                    },
                                    app: {
                                        app: {
                                            value: {
                                                _value: 1000005,
                                                _ver: 1
                                            }
                                        }
                                    }
                                }
                            },
                            target: {
                                blockCode: 2222222,
                                apiUrl: '/book-operate/event/xxx_yyy.pxr-root/',
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

        test('正常: targetのURLが設定値でcodeが複数', async () => {
            accessControlManageServer = new AccessControlManageServerStore(3014);
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
                                },
                                requestBody: {
                                    code: {
                                        value: 1000001
                                    },
                                    app: {
                                        app: {
                                            value: {
                                                _value: 1000005,
                                                _ver: 1
                                            }
                                        }
                                    }
                                }
                            },
                            target: {
                                blockCode: 2222222,
                                apiUrl: '/book-operate/event/{userId}',
                                apiMethod: 'POST',
                                _code: [
                                    {
                                        _value: 10000001,
                                        _ver: 1
                                    },
                                    {
                                        _value: 10000002,
                                        _ver: 2
                                    }
                                ]
                            }
                        }
                    ]
                ));

            // Expect status Success Code
            expect(response.status).toBe(200);
        });

        test('正常: targetのURLが設定値ではない', async () => {
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
                                apiUrl: '/info-account-manage/{userId}/contract',
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

        test('正常: targetのURLが設定値ではなくcodeも未設定', async () => {
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
                                apiUrl: '/info-account-manage/{userId}/contract',
                                apiMethod: 'POST',
                                _code: [
                                ]
                            }
                        }
                    ]
                ));

            // Expect status Success Code
            expect(response.status).toBe(200);
        });

        test('異常: 空のパラメーター', async () => {
            const response = await supertest(expressApp)
                .post(Url.tokenURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send('');

            // Expect status Bad Request
            expect(response.status).toBe(400);
        });

        test('異常: 空のbody', async () => {
            const response = await supertest(expressApp)
                .post(Url.tokenURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send();

            // Expect status Bad Request
            expect(response.status).toBe(400);
        });

        test('異常: 呼出元ブロックコードが存在しない', async () => {
            const response = await supertest(expressApp)
                .post(Url.tokenURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: '',
                                apiUrl: '/book-manage/{userId}/contract',
                                apiMethod: 'GET',
                                userId: 'xxx_yyy.pxr-root',
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
                    // caller blockCodeは必須値
                ));

            // Expect status Bad Request
            expect(response.status).toBe(400);
        });

        test('異常: オペレータタイプが存在しない', async () => {
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
                                operator: {
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
                    // caller blockCodeは必須値
                ));

            // Expect status Bad Request
            expect(response.status).toBe(400);
        });

        test('異常: 呼出元loginIdが存在しない', async () => {
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
                                operator: {
                                    type: 0
                                }
                            },
                            target: {
                                blockCode: 2222222,
                                apiUrl: '/info-account-manage/{userId}/contract',
                                apiMethod: 'GET'
                            }
                        }
                    ]
                    // operator loginIdはtype2以外では必須値
                ));

            // Expect status Bad Request
            expect(response.status).toBe(400);
        });

        // オペレータタイプ値が規定外
        test('異常: オペレータタイプ値が規定しない値(type != 0, 2, 3)', async () => {
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
                                operator: {
                                    type: 4,
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

            // Expect status Bad Request
            expect(response.status).toBe(400);
        });

        test('異常: オペレータタイプが0で呼出先ブロックコードが無効な型(数値)', async () => {
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
                                operator: {
                                    type: 0,
                                    loginId: 'xxx_yyy.pxr-root'
                                }
                            },
                            target: {
                                blockCode: 'a', // Not Num
                                apiUrl: '/info-account-manage/{userId}/contract',
                                apiMethod: 'GET'
                            }
                        }
                    ]
                ));

            // Expect status Bad Request
            expect(response.status).toBe(400);
        });

        test('異常: オペレータタイプが2でappコードなし', async () => {
            const response = await supertest(expressApp)
                .post(Url.tokenURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 4444444,
                                apiUrl: '/book-operate/store/{userId}/event',
                                apiMethod: 'POST',
                                userId: 'xxx_yyy.app',
                                operator: {
                                    type: 2,
                                    app: {
                                        _value: '',
                                        _ver: 1
                                    }
                                }
                            },
                            target: {
                                blockCode: 4444444,
                                apiUrl: '/book-operate/store/{userId}/event',
                                apiMethod: 'POST'
                            }
                        }
                    ]
                ));

            // Expect status Bad Request
            expect(response.status).toBe(400);
        });

        test('異常: オペレータタイプが2でappバージョンなし', async () => {
            const response = await supertest(expressApp)
                .post(Url.tokenURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 4444444,
                                apiUrl: '/book-operate/store/{userId}/event',
                                apiMethod: 'POST',
                                userId: 'xxx_yyy.app',
                                operator: {
                                    type: 2,
                                    app: {
                                        _value: 10000099,
                                        _ver: ''
                                    }
                                }
                            },
                            target: {
                                blockCode: 4444444,
                                apiUrl: '/book-operate/store/{userId}/event',
                                apiMethod: 'POST'
                            }
                        }
                    ]));

            // Expect status Bad Request
            expect(response.status).toBe(400);
        });

        test('異常: targetのURLが設定値だがcodeなし', async () => {
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
                                apiUrl: '/book-operate/event/{userId}',
                                apiMethod: 'POST',
                                _code: [
                                ]
                            }
                        }
                    ]
                ));

            // Expect status Success Code
            expect(response.status).toBe(400);
        });

        test('異常: targetのURLが設定値だがcode異常（value数字以外）', async () => {
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
                                apiUrl: '/book-operate/event/{userId}',
                                apiMethod: 'POST',
                                _code: [
                                    {
                                        _value: 'a',
                                        _ver: 1
                                    }
                                ]
                            }
                        }
                    ]
                ));

            // Expect status Success Code
            expect(response.status).toBe(400);
        });

        test('異常: targetのURLが設定値だがcode異常（value数字以外）', async () => {
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
                                apiUrl: '/book-operate/event/{userId}',
                                apiMethod: 'POST',
                                _code: [
                                    {
                                        _value: '',
                                        _ver: 1
                                    }
                                ]
                            }
                        }
                    ]
                ));

            // Expect status Success Code
            expect(response.status).toBe(400);
        });

        test('異常: targetのURLが設定値だがcode異常（valueがnull）', async () => {
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
                                apiUrl: '/book-operate/event/{userId}',
                                apiMethod: 'POST',
                                _code: [
                                    {
                                        _value: null,
                                        _ver: 1
                                    }
                                ]
                            }
                        }
                    ]
                ));

            // Expect status Success Code
            expect(response.status).toBe(400);
        });

        test('異常: targetのURLが設定値だがcode異常（ver数字以外）', async () => {
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
                                apiUrl: '/book-operate/event/{userId}',
                                apiMethod: 'POST',
                                _code: [
                                    {
                                        _value: 10000001,
                                        _ver: 'a'
                                    }
                                ]
                            }
                        }
                    ]
                ));

            // Expect status Success Code
            expect(response.status).toBe(400);
        });

        test('異常: targetのURLが設定値だがcode異常（ver数字以外）', async () => {
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
                                apiUrl: '/book-operate/event/{userId}',
                                apiMethod: 'POST',
                                _code: [
                                    {
                                        _value: 10000001,
                                        _ver: ''
                                    }
                                ]
                            }
                        }
                    ]
                ));

            // Expect status Success Code
            expect(response.status).toBe(400);
        });

        test('異常: targetのURLが設定値だがcode異常（verがnull）', async () => {
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
                                apiUrl: '/book-operate/event/{userId}',
                                apiMethod: 'POST',
                                _code: [
                                    {
                                        _value: 10000001,
                                        _ver: null
                                    }
                                ]
                            }
                        }
                    ]
                ));

            // Expect status Success Code
            expect(response.status).toBe(400);
        });
    });
});
