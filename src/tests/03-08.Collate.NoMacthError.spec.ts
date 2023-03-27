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
    describe('APIアクセス許可照合 異常系', () => {
        test('正常: APIトークンテーブルにデータがある(ハッシュ不一致)', async () => {
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
                    1, '/info-account-manage/{userId}/contract', 'GET', 'xxx_yyy.pxr-root', '2030-01-01 00:00:00', 
                    1, '/book-manage/{userId}/contract', 'GET', '', 
                    1, 1, 
                    1, 1, 
                    1, 'xxx_yyy.pxr-root',
                    'dataType: [{_value: 1000008,_ver: 1}]', 
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
                            apiToken: 'aaaaaaaaaaa'
                        }
                    }
                ));

            // Expect status Bad Request Code
            expect(response.status).toBe(400);
        });
    });
});
