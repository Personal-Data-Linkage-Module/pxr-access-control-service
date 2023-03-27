/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import * as supertest from 'supertest';
import Application from '../index';
import Common, { Url } from './Common';
import { Session } from './Session';
import { AccessControlManageServerStore } from './StubServer';

// 対象アプリケーションを取得
const expressApp = Application.express.app;
const common = new Common();

// スタブサーバを起動
const accessControlManageServer = new AccessControlManageServerStore(3014);
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
        test('正常: APIトークンテーブルにデータがない アプリケーションが個人のデータを蓄積する場合', async () => {
            /* eslint-disable */
            const response = await supertest(expressApp)
                .post(Url.tokenURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 4444444,
                                apiUrl: '/book-operate/event/{userId}/event',
                                apiMethod: 'POST',
                                userId: 'xxx_yyy.app',
                                operator: {
                                    type: 2,
                                    app: {
                                        _value: 1000099,
                                        _ver: 1
                                    }
                                },
                                requestBody: {
                                    _code: {
                                        _value: 1,
                                        _ver: 1
                                    },
                                    code: {
                                        _value: 1,
                                        _ver: 1
                                    },
                                    app: {
                                        code: {
                                            value: {
                                                _value: 1000098,
                                                _ver: 1
                                            }
                                        },
                                        app: {
                                            value: {
                                                _value: 1000099,
                                                _ver: 1
                                            }
                                        }
                                    }
                                }
                            },
                            target: {
                                _code: [{
                                    _value: 1,
                                    _ver: 1
                                }],
                                blockCode: 4444444,
                                apiUrl: '/book-operate/event/xxx_yyy.app/',
                                apiMethod: 'POST'
                            }
                        }
                    ]
                ));
            /* eslint-enable */
            // Expect status Success Code
            expect(response.status).toBe(200);
        });
        test('正常: APIトークンテーブルにデータがない APPが個人のデータを蓄積する場合(モノ複数追加)', async () => {
            /* eslint-disable */
            // DB初期化
            await common.executeSqlFile('initialData.sql');
            const response = await supertest(expressApp)
                .post(Url.tokenURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.app)) })
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 4444444,
                                apiUrl: '/book-operate/thing/bulk/{userId}/{eventId}',
                                apiMethod: 'POST',
                                userId: 'xxx_yyy.app',
                                operator: {
                                    type: 2,
                                    app: {
                                        _value: 1000101,
                                        _ver: 1
                                    }
                                },
                                requestBody: [
                                    {
                                        "_code": {
                                            "_value": "1001362",
                                            "_ver": "1"
                                        },
                                        "code": {
                                            "index": "4_1_2",
                                            "value": {
                                                "_value": "1001362",
                                                "_ver": "1"
                                            }
                                        },
                                        "env": null,
                                        "id": {
                                            "index": "4_1_1",
                                            "value": null
                                        },
                                        "photo_uuid": {
                                            "index": "4_2_3_1_1",
                                            "value": "binary/uploader_user0001.1000481.app/sample.png"
                                        },
                                        "shooting_time": {
                                            "index": "4_2_2_1",
                                            "value": "2021-09-29 13:00:00"
                                        },
                                        "sourceId": "20211207135232792",
                                        "app": {
                                            "code": {
                                                "index": "3_5_1",
                                                "value": {
                                                    "_value": "1000438",
                                                    "_ver": "1"
                                                }
                                            },
                                            "app": {
                                                "index": "3_5_2",
                                                "value": {
                                                    "_value": "1000481",
                                                    "_ver": "88"
                                                }
                                            }
                                        }
                                    }
                                ]
                            },
                            target: {
                                _code: [{
                                    _value: 1,
                                    _ver: 1
                                }],
                                blockCode: 4444444,
                                apiUrl: '/book-operate/thing/bulk/test_user/123456/',
                                apiMethod: 'POST'
                            }
                        }
                    ]
                ));
            /* eslint-enable */
            // Expect status Success Code
            expect(response.status).toBe(200);
        });
    });
});
