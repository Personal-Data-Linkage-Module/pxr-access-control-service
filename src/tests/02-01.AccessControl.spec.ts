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
     * APIトークン取得開始
     */
    describe('APIトークン取得開始', () => {
        test('正常系: アプリケーションが継続的データ共有で個人のデータを取得する場合', async () => {
            const response = await supertest(expressApp)
                .post(Url.accessControlURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 3333333,
                                apiUrl: 'https://~~~/book-operate/share/{userId}',
                                apiMethod: 'POST',
                                userId: 'xxx_yyy.app2',
                                apiCode: '0abdbf81-686c-423b-823a-ac0d889b0ae6',
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
                                blockCode: 6666666,
                                apiUrl: 'https://~~~/book-operate/share',
                                apiMethod: 'GET',
                                expirationDate: '2022-11-19T10:06:34.000+0900',
                                parameter: {
                                    dataType: [
                                        {
                                            _value: 1000008,
                                            _ver: 1
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                ));

            // Expect status Success Code
            expect(response.status).toBe(200);
        });

        test('正常系: アプリケーションが個人のデータを蓄積する場合', async () => {
            const response = await supertest(expressApp)
                .post(Url.accessControlURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 4444444,
                                apiUrl: 'https://~~~/book-operate/store/{userId}/event',
                                apiMethod: 'POST',
                                userId: 'xxx_yyy.app',
                                apiCode: '0abdbf81-686c-423b-823a-ac0d889b0ae6',
                                operator: {
                                    type: 2,
                                    app: {
                                        _value: 1000099,
                                        _ver: 1
                                    },
                                    loginId: 'app_operator'
                                }
                            },
                            target: {
                                blockCode: 4444444,
                                apiUrl: 'https://~~~/book-operate/store/{userId}/event',
                                apiMethod: 'POST',
                                expirationDate: '2022-11-19T10:06:34.000+0900',
                                parameter: {
                                    dataType: [
                                        {
                                            _value: 1001111,
                                            _ver: 1
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                ));

            // Expect status Success Code
            expect(response.status).toBe(200);
        });

        test('正常系: アプリケーションが継続的データ共有で個人のデータを取得する場合', async () => {
            const response = await supertest(expressApp)
                .post(Url.accessControlURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 3333333,
                                apiUrl: 'https://~~~/book-operate/share/{userId}',
                                apiMethod: 'POST',
                                userId: 'xxx_yyy.app2',
                                apiCode: '0abdbf81-686c-423b-823a-ac0d889b0ae6',
                                operator: {
                                    type: 2,
                                    app: {
                                        _value: 1000007,
                                        _ver: 1
                                    },
                                    role: [
                                        {
                                            _value: 1000005,
                                            _ver: 1
                                        }
                                    ],
                                    loginId: 'app_member01'
                                }
                            },
                            target: {
                                blockCode: 6666666,
                                apiUrl: 'https://~~~/book-operate/share',
                                apiMethod: 'GET',
                                expirationDate: '2022-11-19T10:06:34.000+0900',
                                parameter: {
                                    dataType: [
                                        {
                                            _value: 1000008,
                                            _ver: 1
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                ));

            // Expect status Success Code
            expect(response.status).toBe(200);
        });

        test('正常系: アプリケーションが個人のデータを蓄積する場合', async () => {
            const response = await supertest(expressApp)
                .post(Url.accessControlURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 4444444,
                                apiUrl: 'https://~~~/book-operate/store/{userId}/event',
                                apiMethod: 'POST',
                                userId: 'xxx_yyy.app',
                                apiCode: '0abdbf81-686c-423b-823a-ac0d889b0ae6',
                                operator: {
                                    type: 2,
                                    app: {
                                        _value: 1000099,
                                        _ver: 1
                                    },
                                    role: [
                                        {
                                            _value: 1000005,
                                            _ver: 1
                                        }
                                    ],
                                    loginId: 'app_operator'
                                }
                            },
                            target: {
                                blockCode: 4444444,
                                apiUrl: 'https://~~~/book-operate/store/{userId}/event/%253Fns%253D%252Fabc',
                                apiMethod: 'POST',
                                expirationDate: '2022-11-19T10:06:34.000+0900',
                                parameter: {
                                    dataType: [
                                        {
                                            _value: 1001111,
                                            _ver: 1
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                ));

            // Expect status Success Code
            expect(response.status).toBe(200);
        });

        test('正常系: アプリケーションが継続的データ共有で個人のデータを取得する場合の複数件リクエスト', async () => {
            const response = await supertest(expressApp)
                .post(Url.accessControlURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 3333333,
                                apiUrl: 'https://~~~/book-operate/share/{userId}',
                                apiMethod: 'POST',
                                userId: 'xxx_yyy.app2',
                                apiCode: '0abdbf81-686c-423b-823a-ac0d889b0ae6',
                                operator: {
                                    type: 2,
                                    app: {
                                        _value: 1000007,
                                        _ver: 1
                                    },
                                    role: [
                                        {
                                            _value: 1000005,
                                            _ver: 1
                                        }
                                    ],
                                    loginId: 'app_member01'
                                }
                            },
                            target: {
                                blockCode: 6666666,
                                apiUrl: 'https://~~~/book-operate/share',
                                apiMethod: 'GET',
                                expirationDate: '2022-11-19T10:06:34.000+0900',
                                parameter: {
                                    dataType: [
                                        {
                                            _value: 1000008,
                                            _ver: 1
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            caller: {
                                blockCode: 4444444,
                                apiUrl: 'https://~~~/book-operate/share/{userId}',
                                apiMethod: 'POST',
                                userId: 'xxx_yyy.app2',
                                apiCode: '0abdbf81-686c-423b-823a-ac0d889b0ae6',
                                operator: {
                                    type: 2,
                                    app: {
                                        _value: 1000007,
                                        _ver: 1
                                    },
                                    role: [
                                        {
                                            _value: 1000005,
                                            _ver: 1
                                        },
                                        {
                                            _value: 1000015,
                                            _ver: 2
                                        }
                                    ],
                                    loginId: 'app_member01'
                                }
                            },
                            target: {
                                blockCode: 7777777,
                                apiUrl: 'https://~~~/book-operate/share',
                                apiMethod: 'GET',
                                expirationDate: '2022-11-19T10:06:34.000+0900',
                                parameter: {
                                    dataType: [
                                        {
                                            _value: 1000008,
                                            _ver: 1
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                ));

            // Expect status Success Code
            expect(response.status).toBe(200);
        });

        test('正常系: アプリケーションが個人のデータを蓄積する場合の複数件リクエスト', async () => {
            const response = await supertest(expressApp)
                .post(Url.accessControlURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 4444444,
                                apiUrl: 'https://~~~/book-operate/store/{userId}/event',
                                apiMethod: 'POST',
                                userId: 'xxx_yyy.app',
                                apiCode: '0abdbf81-686c-423b-823a-ac0d889b0ae6',
                                operator: {
                                    type: 2,
                                    app: {
                                        _value: 1000099,
                                        _ver: 1
                                    },
                                    loginId: 'app_operator'
                                }
                            },
                            target: {
                                blockCode: 4444444,
                                apiUrl: 'https://~~~/book-operate/store/{userId}/event',
                                apiMethod: 'POST',
                                expirationDate: '2022-11-19T10:06:34.000+0900',
                                parameter: {
                                    dataType: [
                                        {
                                            _value: 1001111,
                                            _ver: 1
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            caller: {
                                blockCode: 5555555,
                                apiUrl: 'https://~~~/book-operate/store/{userId}/event',
                                apiMethod: 'POST',
                                userId: 'xxx_yyy.app',
                                apiCode: '0abdbf81-686c-423b-823a-ac0d889b0ae6',
                                operator: {
                                    type: 2,
                                    app: {
                                        _value: 1000099,
                                        _ver: 1
                                    },
                                    loginId: 'app_operator'
                                }
                            },
                            target: {
                                blockCode: 5555555,
                                apiUrl: 'https://~~~/book-operate/store/{userId}/event',
                                apiMethod: 'POST',
                                expirationDate: '2022-11-19T10:06:34.000+0900',
                                parameter: {
                                    dataType: [
                                        {
                                            _value: 1001111,
                                            _ver: 1
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                ));

            // Expect status Success Code
            expect(response.status).toBe(200);
        });

        test('異常: JSONではないリクエスト', async () => {
            const response = await supertest(expressApp)
                .post(Url.accessControlURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send('');

            // Expect status Bad Request
            expect(response.status).toBe(400);
        });

        test('異常: リクエストボディが空', async () => {
            const response = await supertest(expressApp)
                .post(Url.accessControlURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .send({}); // 空を送る

            // Expect status Bad Request
            expect(response.status).toBe(400);
        });

        test('異常系: リクエストボディが配列でない', async () => {
            const response = await supertest(expressApp)
                .post(Url.accessControlURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(JSON.stringify(
                    {
                        caller: {
                            blockCode: 1111111,
                            apiUrl: 'https://~~~/book-manage/{userId}/contract',
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
                            apiUrl: 'https://~~~/info-account-manage/{userId}/contract',
                            apiMethod: 'GET',
                            expirationDate: '2020-11-19T10:06:34.000+0900',
                            parameter: null
                        }
                    }
                ));
            // Expect status Success Code
            expect(response.status).toBe(400);
        });

        test('異常: リクエストオペレータータイプが規定外(operatorType != 0, 2, 3)', async () => {
            const response = await supertest(expressApp)
                .post(Url.accessControlURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 1111111,
                                apiUrl: 'https://~~~/book-manage/{userId}/contract',
                                apiMethod: 'GET',
                                userId: 'xxx_yyy.pxr-root',
                                apiCode: '0abdbf81-686c-423b-823a-ac0d889b0ae6',
                                operator: {
                                    type: 4,
                                    loginId: 'xxx_yyy.pxr-root'
                                }
                            },
                            target: {
                                blockCode: 2222222,
                                apiUrl: 'https://~~~/info-account-manage/{userId}/contract',
                                apiMethod: 'GET',
                                expirationDate: '2020-11-19T10:06:34.000+0900',
                                parameter: null
                            }
                        }
                    ]
                ));

            // Expect status Bad Request
            expect(response.status).toBe(400);
        });

        test('異常: caller_blockCodeが数値でない', async () => {
            const response = await supertest(expressApp)
                .post(Url.accessControlURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 'aaaaa',
                                apiUrl: 'https://~~~/book-manage/{userId}/contract',
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
                                apiUrl: 'https://~~~/info-account-manage/{userId}/contract',
                                apiMethod: 'GET',
                                expirationDate: '2020-11-19T10:06:34.000+0900',
                                parameter: null
                            }
                        }
                    ]
                ));

            // Expect status Bad Request
            expect(response.status).toBe(400);
        });

        test('異常: target_blockCodeが数値でない', async () => {
            const response = await supertest(expressApp)
                .post(Url.accessControlURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 1111111,
                                apiUrl: 'https://~~~/book-manage/{userId}/contract',
                                apiMethod: 'GET',
                                userId: 'xxx_yyy.pxr-root',
                                apiCode: '0abdbf81-686c-423b-823a-ac0d889b0ae6',
                                operator: {
                                    type: 0,
                                    loginId: 'xxx_yyy.pxr-root'
                                }
                            },
                            target: {
                                blockCode: 'bbbbb',
                                apiUrl: 'https://~~~/info-account-manage/{userId}/contract',
                                apiMethod: 'GET',
                                expirationDate: '2020-11-19T10:06:34.000+0900',
                                parameter: null
                            }
                        }
                    ]
                ));

            // Expect status Bad Request
            expect(response.status).toBe(400);
        });

        test('異常: caller apiCodeがない', async () => {
            const response = await supertest(expressApp)
                .post(Url.accessControlURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 1111111,
                                apiUrl: 'https://~~~/book-manage/{userId}/contract',
                                apiMethod: 'GET',
                                userId: 'xxx_yyy.pxr-root',
                                apiCode: '',
                                operator: {
                                    type: 0,
                                    loginId: 'xxx_yyy.pxr-root'
                                }
                            },
                            target: {
                                blockCode: 2222222,
                                apiUrl: 'https://~~~/info-account-manage/{userId}/contract',
                                apiMethod: 'GET',
                                expirationDate: '2020-11-19T10:06:34.000+0900',
                                parameter: null
                            }
                        }
                    ]
                ));

            // Expect status Bad Request
            expect(response.status).toBe(400);
        });

        test('異常: target expirationDateがない)', async () => {
            const response = await supertest(expressApp)
                .post(Url.accessControlURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 1111111,
                                apiUrl: 'https://~~~/book-manage/{userId}/contract',
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
                                apiUrl: 'https://~~~/info-account-manage/{userId}/contract',
                                apiMethod: 'GET',
                                expirationDate: '',
                                parameter: null
                            }
                        }
                    ]
                ));

            // Expect status Bad Request
            expect(response.status).toBe(400);
        });

        test('異常: 有効期限が無効な形式', async () => {
            const response = await supertest(expressApp)
                .post(Url.accessControlURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 1111111,
                                apiUrl: 'https://~~~/book-manage/{userId}/contract',
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
                                apiUrl: 'https://~~~/info-account-manage/{userId}/contract',
                                apiMethod: 'GET',
                                expirationDate: '2020/11/19',
                                parameter: null
                            }
                        }
                    ]
                ));

            // Expect status Bad Request
            expect(response.status).toBe(400);
        });

        test('異常: 有効期限が日付ではない形式', async () => {
            const response = await supertest(expressApp)
                .post(Url.accessControlURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 1111111,
                                apiUrl: 'https://~~~/book-manage/{userId}/contract',
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
                                apiUrl: 'https://~~~/info-account-manage/{userId}/contract',
                                apiMethod: 'GET',
                                expirationDate: 'aaaaa',
                                parameter: null
                            }
                        }
                    ]
                ));

            // Expect status Bad Request
            expect(response.status).toBe(400);
        });

        test('異常: 有効期限が期限切れ', async () => {
            const response = await supertest(expressApp)
                .post(Url.accessControlURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 1111111,
                                apiUrl: 'https://~~~/book-manage/{userId}/contract',
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
                                apiUrl: 'https://~~~/info-account-manage/{userId}/contract',
                                apiMethod: 'GET',
                                expirationDate: '2020-01-19T10:06:34.000+0900',
                                parameter: null
                            }
                        }
                    ]
                ));

            // Expect status Bad Request
            expect(response.status).toBe(400);
        });

        test('異常: 必須値がcallerとtargetで複数足りない', async () => {
            const response = await supertest(expressApp)
                .post(Url.accessControlURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 1111111,
                                operator: {
                                    type: 0,
                                    loginId: 'xxx_yyy.pxr-root'
                                }
                            },
                            target: {
                                blockCode: 2222222
                            }
                        }
                    ]
                ));

            // Expect status Bad Request
            expect(response.status).toBe(400);
        });

        test('異常: caller apiCodeが存在しない', async () => {
            const response = await supertest(expressApp)
                .post(Url.accessControlURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 1111111,
                                apiUrl: 'https://~~~/book-manage/{userId}/contract',
                                apiMethod: 'GET',
                                userId: 'xxx_yyy.pxr-root',
                                operator: {
                                    type: 0,
                                    loginId: 'xxx_yyy.pxr-root'
                                }
                            },
                            target: {
                                blockCode: 2222222,
                                apiUrl: 'https://~~~/info-account-manage/{userId}/contract',
                                apiMethod: 'GET',
                                expirationDate: '2020-11-19T10:06:34.000+0900',
                                parameter: null
                            }
                        }
                    ]
                ));

            // Expect status Bad Request
            expect(response.status).toBe(400);
        });

        test('異常: target exprirationDateがない)', async () => {
            const response = await supertest(expressApp)
                .post(Url.accessControlURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 1111111,
                                apiUrl: 'https://~~~/book-manage/{userId}/contract',
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
                                apiUrl: 'https://~~~/info-account-manage/{userId}/contract',
                                apiMethod: 'GET',
                                parameter: null
                            }
                        }
                    ]
                ));

            // Expect status Bad Request
            expect(response.status).toBe(400);
        });

        test('異常: operator role _value が数値でない', async () => {
            const response = await supertest(expressApp)
                .post(Url.accessControlURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 3333333,
                                apiUrl: 'https://~~~/book-operate/share/{userId}',
                                apiMethod: 'POST',
                                userId: 'xxx_yyy.app2',
                                apiCode: '0abdbf81-686c-423b-823a-ac0d889b0ae6',
                                operator: {
                                    type: 2,
                                    app: {
                                        _value: 1000007,
                                        _ver: 1
                                    },
                                    role: [
                                        {
                                            _value: 'bbbb',
                                            _ver: 1
                                        }
                                    ],
                                    loginId: 'app_member01'
                                }
                            },
                            target: {
                                blockCode: 6666666,
                                apiUrl: 'https://~~~/book-operate/share',
                                apiMethod: 'GET',
                                expirationDate: '2020-11-19T10:06:34.000+0900',
                                parameter: {
                                    dataType: [
                                        {
                                            _value: 1000008,
                                            _ver: 1
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                ));

            // Expect status Bad Request
            expect(response.status).toBe(400);
        });

        test('異常: operator role _value がない', async () => {
            const response = await supertest(expressApp)
                .post(Url.accessControlURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 3333333,
                                apiUrl: 'https://~~~/book-operate/share/{userId}',
                                apiMethod: 'POST',
                                userId: 'xxx_yyy.app2',
                                apiCode: '0abdbf81-686c-423b-823a-ac0d889b0ae6',
                                operator: {
                                    type: 2,
                                    app: {
                                        _value: 1000007,
                                        _ver: 1
                                    },
                                    role: [
                                        {
                                            _ver: 1
                                        }
                                    ],
                                    loginId: 'app_member01'
                                }
                            },
                            target: {
                                blockCode: 6666666,
                                apiUrl: 'https://~~~/book-operate/share',
                                apiMethod: 'GET',
                                expirationDate: '2020-11-19T10:06:34.000+0900',
                                parameter: {
                                    dataType: [
                                        {
                                            _value: 1000008,
                                            _ver: 1
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                ));

            // Expect status Bad Request
            expect(response.status).toBe(400);
        });

        test('異常: operator role _value がない', async () => {
            const response = await supertest(expressApp)
                .post(Url.accessControlURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 3333333,
                                apiUrl: 'https://~~~/book-operate/share/{userId}',
                                apiMethod: 'POST',
                                userId: 'xxx_yyy.app2',
                                apiCode: '0abdbf81-686c-423b-823a-ac0d889b0ae6',
                                operator: {
                                    type: 2,
                                    app: {
                                        _value: 1000007,
                                        _ver: 1
                                    },
                                    role: [
                                        {
                                            _value: '',
                                            _ver: 1
                                        }
                                    ],
                                    loginId: 'app_member01'
                                }
                            },
                            target: {
                                blockCode: 6666666,
                                apiUrl: 'https://~~~/book-operate/share',
                                apiMethod: 'GET',
                                expirationDate: '2020-11-19T10:06:34.000+0900',
                                parameter: {
                                    dataType: [
                                        {
                                            _value: 1000008,
                                            _ver: 1
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                ));

            // Expect status Bad Request
            expect(response.status).toBe(400);
        });

        test('異常: operator role _ver が数値でない', async () => {
            const response = await supertest(expressApp)
                .post(Url.accessControlURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 3333333,
                                apiUrl: 'https://~~~/book-operate/share/{userId}',
                                apiMethod: 'POST',
                                userId: 'xxx_yyy.app2',
                                apiCode: '0abdbf81-686c-423b-823a-ac0d889b0ae6',
                                operator: {
                                    type: 2,
                                    app: {
                                        _value: 1000007,
                                        _ver: 1
                                    },
                                    role: [
                                        {
                                            _value: 1000005,
                                            _ver: 'a'
                                        }
                                    ],
                                    loginId: 'app_member01'
                                }
                            },
                            target: {
                                blockCode: 6666666,
                                apiUrl: 'https://~~~/book-operate/share',
                                apiMethod: 'GET',
                                expirationDate: '2020-11-19T10:06:34.000+0900',
                                parameter: {
                                    dataType: [
                                        {
                                            _value: 1000008,
                                            _ver: 1
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                ));

            // Expect status Bad Request
            expect(response.status).toBe(400);
        });

        test('異常: operator role _ver がない', async () => {
            const response = await supertest(expressApp)
                .post(Url.accessControlURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 3333333,
                                apiUrl: 'https://~~~/book-operate/share/{userId}',
                                apiMethod: 'POST',
                                userId: 'xxx_yyy.app2',
                                apiCode: '0abdbf81-686c-423b-823a-ac0d889b0ae6',
                                operator: {
                                    type: 2,
                                    app: {
                                        _value: 1000007,
                                        _ver: 1
                                    },
                                    role: [
                                        {
                                            _value: 1000005
                                        }
                                    ],
                                    loginId: 'app_member01'
                                }
                            },
                            target: {
                                blockCode: 6666666,
                                apiUrl: 'https://~~~/book-operate/share',
                                apiMethod: 'GET',
                                expirationDate: '2020-11-19T10:06:34.000+0900',
                                parameter: {
                                    dataType: [
                                        {
                                            _value: 1000008,
                                            _ver: 1
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                ));

            // Expect status Bad Request
            expect(response.status).toBe(400);
        });

        test('異常: operator role _ver がない', async () => {
            const response = await supertest(expressApp)
                .post(Url.accessControlURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 3333333,
                                apiUrl: 'https://~~~/book-operate/share/{userId}',
                                apiMethod: 'POST',
                                userId: 'xxx_yyy.app2',
                                apiCode: '0abdbf81-686c-423b-823a-ac0d889b0ae6',
                                operator: {
                                    type: 2,
                                    app: {
                                        _value: 1000007,
                                        _ver: 1
                                    },
                                    role: [
                                        {
                                            _value: 1000005,
                                            _ver: ''
                                        }
                                    ],
                                    loginId: 'app_member01'
                                }
                            },
                            target: {
                                blockCode: 6666666,
                                apiUrl: 'https://~~~/book-operate/share',
                                apiMethod: 'GET',
                                expirationDate: '2020-11-19T10:06:34.000+0900',
                                parameter: {
                                    dataType: [
                                        {
                                            _value: 1000008,
                                            _ver: 1
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                ));

            // Expect status Bad Request
            expect(response.status).toBe(400);
        });

        test('異常: operator app _value が数値でない', async () => {
            const response = await supertest(expressApp)
                .post(Url.accessControlURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 4444444,
                                apiUrl: 'https://~~~/book-operate/store/{userId}/event',
                                apiMethod: 'POST',
                                userId: 'xxx_yyy.app',
                                apiCode: '0abdbf81-686c-423b-823a-ac0d889b0ae6',
                                operator: {
                                    type: 2,
                                    app: {
                                        _value: 'abcd',
                                        _ver: 1
                                    }
                                }
                            },
                            target: {
                                blockCode: 4444444,
                                apiUrl: 'https://~~~/book-operate/store/{userId}/event',
                                apiMethod: 'POST',
                                expirationDate: '2020-11-19T10:06:34.000+0900',
                                parameter: {
                                    dataType: [
                                        {
                                            _value: 1001111,
                                            _ver: 1
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                ));

            // Expect status Bad Request
            expect(response.status).toBe(400);
        });

        test('異常: operator app _ver が数値でない', async () => {
            const response = await supertest(expressApp)
                .post(Url.accessControlURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 4444444,
                                apiUrl: 'https://~~~/book-operate/store/{userId}/event',
                                apiMethod: 'POST',
                                userId: 'xxx_yyy.app',
                                apiCode: '0abdbf81-686c-423b-823a-ac0d889b0ae6',
                                operator: {
                                    type: 2,
                                    app: {
                                        _value: 1000099,
                                        _ver: 'a'
                                    }
                                }
                            },
                            target: {
                                blockCode: 4444444,
                                apiUrl: 'https://~~~/book-operate/store/{userId}/event',
                                apiMethod: 'POST',
                                expirationDate: '2020-11-19T10:06:34.000+0900',
                                parameter: {
                                    dataType: [
                                        {
                                            _value: 1001111,
                                            _ver: 1
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                ));

            // Expect status Bad Request
            expect(response.status).toBe(400);
        });

        test('異常: expirationDateが規定外', async () => {
            const response = await supertest(expressApp)
                .post(Url.accessControlURI)
                .set({ 'Content-Type': 'application/json', accept: 'application/json' })
                .set({ session: encodeURIComponent(JSON.stringify(Session.pxrRoot)) })
                .send(JSON.stringify(
                    [
                        {
                            caller: {
                                blockCode: 4444444,
                                apiUrl: 'https://~~~/book-operate/store/{userId}/event',
                                apiMethod: 'POST',
                                userId: 'xxx_yyy.app',
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
                                apiUrl: 'https://~~~/book-operate/store/{userId}/event',
                                apiMethod: 'POST',
                                expirationDate: 'abcd',
                                parameter: {
                                    dataType: [
                                        {
                                            _value: 1001111,
                                            _ver: 1
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                ));

            // Expect status Bad Request
            expect(response.status).toBe(400);
        });
    });
});
