/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import * as supertest from 'supertest';
import Application from '../index';
import Common, { Url } from './Common';
import { Session } from './Session';

// 対象アプリケーションを取得
const expressApp = Application.express.app;
const common = new Common();

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
     * 全テスト実行後の後処理
     */
    afterAll(async () => {
        // サーバ停止
        await Application.stop();
    });

    /**
     * APIアクセス許可照合
     */
    describe('APIアクセス許可照合', () => {
        test('正常: APIトークンテーブルにデータがある', async () => {
            // 事前データ準備
            await common.executeSqlString(`
                INSERT INTO pxr_access_control.api_access_permission
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
                    '82887e0e25fb3b83ff6bd0442bdd903eac793566469b5847fbf29c5517b2a8e4',
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
                .post(Url.collateURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(JSON.stringify(
                    {
                        caller: {
                            apiUrl: '/book-manage/{userId}/contract'
                        },
                        target: {
                            apiUrl: '/info-account-manage/{userId}/contract',
                            apiMethod: 'GET',
                            apiToken: '82887e0e25fb3b83ff6bd0442bdd903eac793566469b5847fbf29c5517b2a8e4'
                        }
                    }
                ));

            // Expect status Success Code
            expect(response.status).toBe(200);
        });

        test('異常: APIトークンテーブルにデータがある(ハッシュ値不一致)', async () => {
            // 事前データ準備
            await common.executeSqlString(`
                INSERT INTO pxr_access_control.api_access_permission
                (
                    token,
                    target_block_code, target_api_url, target_api_method, target_user_id, expiration_date,
                    caller_block_code, caller_api_url, caller_api_method, caller_api_code,
                    caller_wf_code, caller_wf_version, 
                    caller_app_code, caller_app_version,
                    caller_operator_type, caller_operator_login_id, 
                    parameter, 
                    is_disabled,
                    created_by, created_at, updated_by, updated_at
                )
                VALUES(
                    'aaaaaaaaaaa',
                    1, '/info-account-manage/{userId}/contract', 'GET', '', '2030-01-01 00:00:00', 
                    1, '/book-manage/{userId}/contract', '', '', 
                    1, 1, 
                    1, 1, 
                    1, '', 
                    NULL,
                    false,
                    'pxr_user', NOW(), 'pxr_user', NOW()
                );
            `);
            const response = await supertest(expressApp)
                .post(Url.collateURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(JSON.stringify(
                    {
                        caller: {
                            apiUrl: '/book-manage/{userId}/contract'
                        },
                        target: {
                            apiUrl: '/info-account-manage/{userId}/contract',
                            apiMethod: 'GET',
                            apiToken: 'F2887e0e25fb3b83ff6bd0442bdd903eac793566469b5847fbf29c5517b2a8e4'
                        }
                    }
                ));

            // Expect status Bad Request Code
            expect(response.status).toBe(400);
        });

        test('正常: APIトークンテーブルにデータがある(ハッシュ値一致)', async () => {
            // 事前データ準備
            await common.executeSqlString(`
                INSERT INTO pxr_access_control.api_access_permission
                (
                    token,
                    target_block_code, target_api_url, target_api_method, target_user_id, expiration_date,
                    caller_block_code, caller_api_url, caller_api_method, caller_api_code,
                    caller_wf_code, caller_wf_version, 
                    caller_app_code, caller_app_version,
                    caller_operator_type, caller_operator_login_id, 
                    parameter, 
                    is_disabled,
                    created_by, created_at, updated_by, updated_at
                )
                VALUES(
                    'bbbbbbbbb',
                    1, '/info-account-manage/{userId}/contract', 'GET', '', '2030-01-01 00:00:00', 
                    1, '/book-manage/{userId}/contract', '', '', 
                    1, 1, 
                    1, 1, 
                    1, '', 
                    NULL,
                    false,
                    'pxr_user', NOW(), 'pxr_user', NOW()
                );
            `);
            const response = await supertest(expressApp)
                .post(Url.collateURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(JSON.stringify(
                    {
                        caller: {
                            apiUrl: '/book-manage/{userId}/contract'
                        },
                        target: {
                            apiUrl: '/info-account-manage/{userId}/contract',
                            apiMethod: 'GET',
                            apiToken: 'bbbbbbbbb'
                        }
                    }
                ));

            // Expect status Success Code
            expect(response.status).toBe(200);
        });

        test('異常: パラメーター不足(caller)', async () => {
            const response = await supertest(expressApp)
                .post(Url.collateURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(
                    {
                        target: {
                            apiUrl: '/info-account-manage/{userId}/contract',
                            apiMethod: 'GET',
                            apiToken: 'ee5fd41305d043e45f6d2ed00e03844f06ee89d0e044541641166306a7d11929'
                        }
                    }
                );

            // Expect status Bad Request
            expect(response.status).toBe(400);
        });

        test('異常: パラメーター不足(caller.apiUrl)', async () => {
            const response = await supertest(expressApp)
                .post(Url.collateURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(
                    {
                        caller: {},
                        target: {
                            apiUrl: '/info-account-manage/{userId}/contract',
                            apiMethod: 'GET',
                            apiToken: 'ee5fd41305d043e45f6d2ed00e03844f06ee89d0e044541641166306a7d11929'
                        }
                    }
                );

            // Expect status Bad Request
            expect(response.status).toBe(400);
        });

        test('異常: パラメーター不足(target)', async () => {
            const response = await supertest(expressApp)
                .post(Url.collateURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(
                    {
                        caller: {
                            apiUrl: '/book-manage/{userId}/contract'
                        }
                    }
                );

            // Expect status Bad Request
            expect(response.status).toBe(400);
        });

        test('異常: パラメーター不足(target.apiUrl)', async () => {
            const response = await supertest(expressApp)
                .post(Url.collateURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(
                    {
                        caller: {
                            apiUrl: '/book-manage/{userId}/contract'
                        },
                        target: {
                            apiMethod: 'GET',
                            apiToken: 'ee5fd41305d043e45f6d2ed00e03844f06ee89d0e044541641166306a7d11929'
                        }
                    }
                );

            // Expect status Bad Request
            expect(response.status).toBe(400);
        });

        test('異常: パラメーター不足(target.apiMethod)', async () => {
            const response = await supertest(expressApp)
                .post(Url.collateURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(
                    {
                        caller: {
                            apiUrl: '/book-manage/{userId}/contract'
                        },
                        target: {
                            apiUrl: '/info-account-manage/{userId}/contract',
                            apiToken: 'ee5fd41305d043e45f6d2ed00e03844f06ee89d0e044541641166306a7d11929'
                        }
                    }
                );

            // Expect status Bad Request
            expect(response.status).toBe(400);
        });

        test('異常: パラメーター不足(target.apiToken)', async () => {
            const response = await supertest(expressApp)
                .post(Url.collateURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(
                    {
                        caller: {
                            apiUrl: '/book-manage/{userId}/contract'
                        },
                        target: {
                            apiUrl: '/info-account-manage/{userId}/contract',
                            apiMethod: 'GET'
                        }
                    }
                );

            // Expect status Bad Request
            expect(response.status).toBe(400);
        });

        test('異常: パラメーター不足(全て)', async () => {
            const response = await supertest(expressApp)
                .post(Url.collateURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send({});

            // Expect status Bad Request
            expect(response.status).toBe(400);
        });
    });
});
