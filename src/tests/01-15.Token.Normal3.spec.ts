/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import * as supertest from 'supertest';
import Application from '../index';
import Common, { Url } from './Common';
import { Session } from './Session';
import { AccessControlManage1Server } from './StubServer';

// 対象アプリケーションを取得
const expressApp = Application.express.app;
const common = new Common();

// スタブサーバを起動
const accessControlManageServer = new AccessControlManage1Server(3014);

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
    describe('APIトークン取得開始', () => {
        test('正常: APIトークンテーブルにデータなしオペレータタイプ2', async () => {
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
    });
});
