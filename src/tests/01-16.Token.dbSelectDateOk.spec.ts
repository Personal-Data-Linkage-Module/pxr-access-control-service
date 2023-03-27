/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import * as supertest from 'supertest';
import Application from '../index';
import Common, { Url } from './Common';
import { Session } from './Session';
// eslint-disable-next-line no-unused-vars
import { AccessControlManageServer } from './StubServer';

// 対象アプリケーションを取得
const expressApp = Application.express.app;
const common = new Common();

// スタブサーバを起動
const accessControlManageServer = new AccessControlManageServer(3014, 200);

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
        // スタブサーバーの停止
        accessControlManageServer.server.close();
    });

    /**
     * APIトークン取得開始
     */
    describe('APIトークン取得開始 異常系', () => {
        test('DBエラー（Select）', async () => {
            await common.executeSqlString(`
                INSERT INTO pxr_access_control.api_token
                (
                    token,
                    target_block_code,
                    target_api_url,
                    target_api_method,
                    target_user_id,
                    expiration_date,
                    caller_block_code,
                    caller_api_url,
                    caller_api_method,
                    caller_api_code,
                    caller_wf_code,
                    caller_wf_version,
                    caller_app_code,
                    caller_app_version,
                    caller_operator_type,
                    caller_operator_login_id,
                    is_disabled,
                    created_by,
                    created_at,
                    updated_by,
                    updated_at
                )
                VALUES
                (
                    'aaaaaaaaa',
                    2222222, 
                    '/info-account-manage/{userId}/contract',
                    'GET',
                    'xxx_yyy.pxr-root',
                    '2030-12-31 23:59:59.999',
                    1111111,
                    '/book-manage/{userId}/contract',
                    'GET',
                    'XXXXXXXX-XXXX-4XXX-rXXX-XXXXXXXXXXXX',
                    0,
                    0,
                    0,
                    0,
                    0,
                    'xxx_yyy.pxr-root',
                    false, 'test_user', NOW(), 'test_user', NOW()
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
    });
});
