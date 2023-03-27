/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import * as supertest from 'supertest';
import Application from '../index';
import Common, { Url } from './Common';
import { Session } from './Session';
import { AccessControlManage2Server } from './StubServer';

// 対象アプリケーションを取得
const expressApp = Application.express.app;
const common = new Common();

// スタブサーバを起動
const accessControlManageServer = new AccessControlManage2Server(3014);

/**
 * access-control API のユニットテスト
 */
describe('access-control API', () => {
    /**
     * 全テスト実行後の前処理
     */
    beforeAll(async () => {
        // サーバをlisten
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
        test('アクセス制御管理サービスからトークンなし応答', async () => {
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
