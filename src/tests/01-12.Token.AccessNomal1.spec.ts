/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import * as supertest from 'supertest';
import Application from '../index';
import Common, { Url } from './Common';
import { Session } from './Session';
import { AccessControlManage3Server } from './StubServer';

// 対象アプリケーションを取得
const expressApp = Application.express.app;
const common = new Common();

// スタブサーバを起動
const accessControlManageServer = new AccessControlManage3Server(3014);

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
    describe('APIトークン取得開始', () => {
        test('正常: APIトークンテーブルにデータがない appが継続的データ共有で個人のデータを取得する場合', async () => {
            const response = await supertest(expressApp)
                .post(Url.tokenURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 3333333,
                                apiUrl: '/book-operate/share/{userId}',
                                apiMethod: 'POST',
                                userId: 'xxx_yyy.app1',
                                operator: {
                                    type: 2,
                                    app: {
                                        _value: 1000007,
                                        _ver: 1
                                    },
                                    loginId: 'app_member01'
                                }
                            },
                            target: {
                                blockCode: null,
                                apiUrl: '/book-operate/share',
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
