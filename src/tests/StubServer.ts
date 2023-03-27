/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { Server } from 'net';

import express = require('express');
import bodyParser = require('body-parser');

// アクセス制御管理スタブサーバー
export class AccessControlManageServer {
    app: express.Express;
    server: Server;
    constructor (port: number, status: number) {
        this.app = express();
        this.app.use(bodyParser.json({ limit: '50mb' }));
        this.app.post('/access-control-manage/block', (req: express.Request, res: express.Response) => {
            const obj = req.body.map((elem: any, index: number) => {
                return {
                    apiUrl: elem.target.apiUrl,
                    apiMethod: elem.target.apiMethod,
                    apiToken: 'd0af96799512cf7e4b9ebda5234a7cc8ea49d402d29191b5e9128e15a939917' + index,
                    userId: elem.caller.userId,
                    expirationDate: '2020-12-28T14:20:34.000+0900',
                    blockCode: elem.target.blockCode || 1000109
                };
            });
            res.status(status).json(obj);
        });
        this.app.post('/access-control-manage/operator', (req, res) => {
            const obj = req.body.map((elem: any, index: number) => {
                return {
                    apiUrl: elem.target.apiUrl,
                    apiMethod: elem.target.apiMethod,
                    apiToken: 'd0af96799512cf7e4b9ebda5234a7cc8ea49d402d29191b5e9128e15a939917' + index,
                    userId: elem.caller.userId,
                    expirationDate: '2020-12-28T14:20:34.000+0900',
                    blockCode: elem.target.blockCode || 1000109
                };
            });
            res.status(status).json(obj);
        });
        this.app.post('/access-control-manage/catalog', (req, res) => {
            const obj = req.body.map((elem: any, index: number) => {
                return {
                    apiUrl: elem.target.apiUrl,
                    apiMethod: elem.target.apiMethod,
                    apiToken: 'd0af96799512cf7e4b9ebda5234a7cc8ea49d402d29191b5e9128e15a939917' + index,
                    userId: elem.caller.userId,
                    expirationDate: '2020-12-28T14:20:34.000+0900',
                    blockCode: elem.target.blockCode || 1000109
                };
            });
            res.status(status).json(obj);
        });
        this.app.post('/access-control-manage/book', (req, res) => {
            const obj = req.body.map((elem: any, index: number) => {
                return {
                    apiUrl: elem.target.apiUrl,
                    apiMethod: elem.target.apiMethod,
                    apiToken: 'd0af96799512cf7e4b9ebda5234a7cc8ea49d402d29191b5e9128e15a939917' + index,
                    userId: elem.caller.userId,
                    expirationDate: '2020-12-28T14:20:34.000+0900',
                    blockCode: elem.target.blockCode || 1000109
                };
            });
            res.status(status).json(obj);
        });
        this.server = this.app.listen(port);
    }
}

export class AccessControlManageServerStore {
    app: express.Express;
    server: Server;
    constructor (port: number) {
        this.app = express();
        this.app.use(bodyParser.json({ limit: '50mb' }));
        this.app.post('/access-control-manage/store', (req: express.Request, res: express.Response) => {
            const obj = req.body.map((elem: any, index: number) => {
                return {
                    apiUrl: elem.target.apiUrl,
                    apiMethod: elem.target.apiMethod,
                    apiToken: 'd0af96799512cf7e4b9ebda5234a7cc8ea49d402d29191b5e9128e15a939917' + index,
                    userId: elem.caller.userId,
                    expirationDate: '2020-12-28T14:20:34.000+0900',
                    blockCode: elem.target.blockCode || 1000109
                };
            });
            res.status(200).json(obj);
        });
        this.server = this.app.listen(port);
    }
}

export class AccessControlManageServerShare {
    app: express.Express;
    server: Server;
    constructor (port: number) {
        this.app = express();
        this.app.use(bodyParser.json({ limit: '50mb' }));
        this.app.post('/access-control-manage/share/continuous', (req: express.Request, res: express.Response) => {
            const obj = req.body.map((elem: any, index: number) => {
                return {
                    apiUrl: elem.target.apiUrl,
                    apiMethod: elem.target.apiMethod,
                    apiToken: 'd0af96799512cf7e4b9ebda5234a7cc8ea49d402d29191b5e9128e15a939917' + index,
                    userId: elem.caller.userId,
                    expirationDate: '2020-12-28T14:20:34.000+0900',
                    blockCode: elem.target.blockCode || 1000109
                };
            });
            res.status(200).json(obj);
        });
        this.server = this.app.listen(port);
    }
}

// アクセス制御管理スタブサーバー
export class AccessControlManage1Server {
    app: express.Express;
    server: Server;
    constructor (port: number) {
        this.app = express();
        this.app.use(bodyParser.json({ limit: '50mb' }));
        this.app.post('/access-control-manage/block', (req: express.Request, res: express.Response) => {
            const obj = req.body.map((elem: any, index: number) => {
                return {
                    apiUrl: elem.target.apiUrl,
                    apiMethod: elem.target.apiMethod,
                    apiToken: 'd0af96799512cf7e4b9ebda5234a7cc8ea49d402d29191b5e9128e15a939917' + index,
                    userId: elem.caller.userId,
                    expirationDate: '2020-12-28T14:20:34.000+0900',
                    blockCode: elem.target.blockCode || 1000109
                };
            });
            res.status(200).json(obj);
        });
        this.server = this.app.listen(port);
    }
}

// アクセス制御管理スタブサーバー
export class AccessControlManage2Server {
    app: express.Express;
    server: Server;
    constructor (port: number) {
        this.app = express();
        this.app.use(bodyParser.json({ limit: '50mb' }));
        this.app.post('/access-control-manage/block', (req: express.Request, res: express.Response) => {
            const obj = req.body.map((elem: any, index: number) => {
                return {
                    apiUrl: elem.target.apiUrl,
                    apiMethod: elem.target.apiMethod,
                    apiToken: 'd0af96799512cf7e4b9ebda5234a7cc8ea49d402d29191b5e9128e15a939917' + index,
                    userId: elem.caller.userId,
                    expirationDate: '2020-12-28T14:20:34.000+0900',
                    blockCode: elem.target.blockCode || 1000109
                };
            });
            res.status(200).json(obj);
        });
        this.server = this.app.listen(port);
    }
}

// アクセス制御管理スタブサーバー
export class AccessControlManage3Server {
    app: express.Express;
    server: Server;
    constructor (port: number) {
        this.app = express();
        this.app.use(bodyParser.json({ limit: '50mb' }));
        this.app.post('/access-control-manage/block', (req: express.Request, res: express.Response) => {
            const obj = req.body.map((elem: any, index: number) => {
                return {
                    apiUrl: elem.target.apiUrl,
                    apiMethod: elem.target.apiMethod,
                    apiToken: 'd0af96799512cf7e4b9ebda5234a7cc8ea49d402d29191b5e9128e15a939917' + index,
                    userId: elem.caller.userId,
                    expirationDate: '2020-12-28T14:20:34.000+0900',
                    blockCode: elem.target.blockCode || 1000109
                };
            });
            res.status(200).json(obj);
        });
        this.server = this.app.listen(port);
    }
}

// アクセス制御管理スタブサーバー
export class AccessControlManage4Server {
    app: express.Express;
    server: Server;
    constructor (port: number) {
        this.app = express();
        this.app.use(bodyParser.json({ limit: '50mb' }));
        this.app.post('/access-control-manage/block', (req: express.Request, res: express.Response) => {
            const obj = req.body.map((elem: any, index: number) => {
                return {
                    apiUrl: elem.target.apiUrl,
                    apiMethod: elem.target.apiMethod,
                    apiToken: 'd0af96799512cf7e4b9ebda5234a7cc8ea49d402d29191b5e9128e15a939917' + index,
                    userId: elem.caller.userId,
                    expirationDate: '2020-12-28T14:20:34.000+0900',
                    blockCode: elem.target.blockCode || 1000109
                };
            });
            res.status(200).json(obj);
        });
        this.server = this.app.listen(port);
    }
}

// アクセス制御管理スタブサーバー
export class AccessControlManage5Server {
    app: express.Express;
    server: Server;
    constructor (port: number) {
        this.app = express();
        this.app.use(bodyParser.json({ limit: '50mb' }));
        this.app.post('/access-control-manage/operator', (req: express.Request, res: express.Response) => {
            const obj = req.body.map((elem: any, index: number) => {
                return {
                    apiUrl: '/book-manage/user/list',
                    apiMethod: elem.target.apiMethod,
                    apiToken: 'd0af96799512cf7e4b9ebda5234a7cc8ea49d402d29191b5e9128e15a939917' + index,
                    userId: elem.caller.userId,
                    expirationDate: '2020-12-28T14:20:34.000+0900',
                    blockCode: elem.target.blockCode || 1000109
                };
            });
            res.status(200).json(obj);
        });
        this.server = this.app.listen(port);
    }
}

// アクセス制御管理スタブサーバー
export class AbnormalAccessControlManageServer {
    app: express.Express;
    server: Server;
    constructor (port: number) {
        this.app = express();
        this.app.post('/access-control-manage/block', (req: express.Request, res: express.Response) => {
            res.status(500).json(
                { description: 'Unit-Test Error' }
            );
        });
        this.server = this.app.listen(port);
    }
}

// カタログスタブサーバー
export class CatalogServer {
    app: express.Express;
    server: Server;
    constructor (port: number, code: number, status: number, getNsStatus?: number) {
        // イベントハンドラー
        const _listener = (req: express.Request, res: express.Response) => {
            if (status === 200) {
                if (code === 1000001) {
                    // 正常(pxr-root)
                    res.status(status).json({
                        catalogItem: {
                            ns: 'catalog/ext/test-org/actor/pxr-root',
                            name: '流通制御組織',
                            _code: {
                                _value: 1000001,
                                _ver: 1
                            },
                            inherit: {
                                _value: 50,
                                _ver: 1
                            },
                            description: '流通制御組織の定義です。'
                        },
                        template: {
                            _code: {
                                _value: 1000001,
                                _ver: 1
                            },
                            wf: [
                                {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            ],
                            workflow: [
                                {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            ],
                            application: [
                                {
                                    _value: 1000009,
                                    _ver: 1
                                }
                            ]
                        }
                    });
                }
                return;
            } else if (status === 500) {
                res.status(500).json({
                    id: 0
                });
                return;
            }
            res.status(status).end();
        };
        const _listener2 = (req: express.Request, res: express.Response) => {
            res.status(status);
            res.json({
                ext_name: 'test-org'
            });
            res.end();
            if (getNsStatus === 999) {
                this.server.close();
            }
        };
        const _listener3 = (req: express.Request, res: express.Response) => {
            if (getNsStatus) {
                res.status(getNsStatus).end();
                return;
            }
            const ns = req.query['ns'];
            res.status(status);
            if (ns === 'catalog/ext/test-org/actor/wf/actor_1000001/store') {
                res.status(status).json([
                    {
                        catalogItem: {
                            ns: 'catalog/ext/aaa-healthcare-consortium/actor/wf/actor_1000438/store',
                            name: '外来診療が蓄積可能なデータ',
                            _code: {
                                _value: 1000489,
                                _ver: 1
                            },
                            inherit: {
                                _value: 44,
                                _ver: 1
                            },
                            description: '外来診療が蓄積可能なデータ定義です。'
                        },
                        template: {
                            _code: {
                                _value: 1000489,
                                _ver: 1
                            },
                            store: null
                        },
                        prop: [
                            {
                                key: 'store',
                                type: {
                                    of: 'inner[]',
                                    inner: 'Store',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '蓄積定義',
                                isInherit: true
                            }
                        ],
                        attribute: null
                    },
                    {
                        catalogItem: {
                            ns: 'catalog/ext/aaa-healthcare-consortium/actor/wf/actor_1000438/store',
                            name: '外来診療が蓄積可能なデータ',
                            _code: {
                                _value: 1000489,
                                _ver: 1
                            },
                            inherit: {
                                _value: 44,
                                _ver: 1
                            },
                            description: '外来診療が蓄積可能なデータ定義です。'
                        },
                        template: {
                            _code: {
                                _value: 1000489,
                                _ver: 1
                            },
                            store: [
                                {
                                    id: '5589c2b6-e79b-eb17-c78b-8a9f4425a737',
                                    role: null,
                                    event: [
                                        {
                                            code: {
                                                _value: 1000811,
                                                _ver: 1
                                            },
                                            requireConsent: true,
                                            thing: [
                                                {
                                                    code: {
                                                        _value: 1000814,
                                                        _ver: 1
                                                    },
                                                    requireConsent: true
                                                },
                                                {
                                                    code: {
                                                        _value: 1000815,
                                                        _ver: 1
                                                    },
                                                    requireConsent: true
                                                },
                                                {
                                                    code: {
                                                        _value: 1000816,
                                                        _ver: 1
                                                    },
                                                    requireConsent: true
                                                },
                                                {
                                                    code: {
                                                        _value: 1000817,
                                                        _ver: 1
                                                    },
                                                    requireConsent: true
                                                },
                                                {
                                                    code: {
                                                        _value: 1000818,
                                                        _ver: 1
                                                    },
                                                    requireConsent: true
                                                },
                                                {
                                                    code: {
                                                        _value: 1000819,
                                                        _ver: 1
                                                    },
                                                    requireConsent: true
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        prop: [
                            {
                                key: 'store',
                                type: {
                                    of: 'inner[]',
                                    inner: 'Store',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '蓄積定義',
                                isInherit: true
                            }
                        ],
                        attribute: null
                    },
                    {
                    catalogItem: {
                        ns: 'catalog/ext/aaa-healthcare-consortium/actor/wf/actor_1000438/store',
                        name: '外来診療が蓄積可能なデータ',
                        _code: {
                            _value: 1000489,
                            _ver: 1
                        },
                        inherit: {
                            _value: 44,
                            _ver: 1
                        },
                        description: '外来診療が蓄積可能なデータ定義です。'
                    },
                    template: {
                        _code: {
                            _value: 1000489,
                            _ver: 1
                        },
                        store: [
                            {
                                id: '5589c2b6-e79b-eb17-c78b-8a9f4425a737',
                                role: [
                                    {
                                        _value: 9999999,
                                        _ver: 1
                                    },
                                    {
                                        _value: 1,
                                        _ver: 1
                                    }
                                ],
                                event: [
                                    {
                                        code: {
                                            _value: 1000811,
                                            _ver: 1
                                        },
                                        requireConsent: true,
                                        thing: [
                                            {
                                                code: {
                                                    _value: 1000814,
                                                    _ver: 1
                                                },
                                                requireConsent: true
                                            },
                                            {
                                                code: {
                                                    _value: 1000815,
                                                    _ver: 1
                                                },
                                                requireConsent: true
                                            },
                                            {
                                                code: {
                                                    _value: 1000816,
                                                    _ver: 1
                                                },
                                                requireConsent: true
                                            },
                                            {
                                                code: {
                                                    _value: 1000817,
                                                    _ver: 1
                                                },
                                                requireConsent: true
                                            },
                                            {
                                                code: {
                                                    _value: 1000818,
                                                    _ver: 1
                                                },
                                                requireConsent: true
                                            },
                                            {
                                                code: {
                                                    _value: 1000819,
                                                    _ver: 1
                                                },
                                                requireConsent: true
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    prop: [
                        {
                            key: 'store',
                            type: {
                                of: 'inner[]',
                                inner: 'Store',
                                cmatrix: null,
                                candidate: null
                            },
                            description: '蓄積定義',
                            isInherit: true
                        }
                    ],
                    attribute: null
                }
            ]);
            } else if (ns === 'catalog/ext/test-org/actor/wf/actor_1000001/workflow') {
                res.status(status).json([
                    {
                        "catalogItem": {
                            "ns": "catalog/ext/aaa-healthcare-consortium/actor/wf/actor_1000438/workflow",
                            "name": "外来診療",
                            "_code": {
                                "_value": 1000481,
                                "_ver": 1
                            },
                            "inherit": {
                                "_value": 46,
                                "_ver": 1
                            },
                            "description": "外来診療の定義です。"
                        },
                        "template": {
                            "_code": {
                                "_value": 1000481,
                                "_ver": 1
                            },
                            "information-site": null,
                            "region-alliance": null,
                            "share": [
                                {
                                    "_value": 1000485,
                                    "_ver": 1
                                },
                                {
                                    "_value": 1000486,
                                    "_ver": 1
                                }
                            ],
                            "store": null
                        },
                        "prop": [
                            {
                                "key": "information-site",
                                "type": {
                                    "of": "string",
                                    "cmatrix": null,
                                    "format": null,
                                    "unit": null,
                                    "candidate": null
                                },
                                "description": "ワークフローの情報サイト",
                                "isInherit": true
                            },
                            {
                                "key": "region-alliance",
                                "type": {
                                    "of": "code[]",
                                    "cmatrix": null,
                                    "candidate": {
                                        "ns": null,
                                        "_code": null,
                                        "base": {
                                            "_value": 48,
                                            "_ver": 1
                                        }
                                    }
                                },
                                "description": "参加している領域運営サービスプロバイダーのリージョンコード配列",
                                "isInherit": true
                            },
                            {
                                "key": "share",
                                "type": {
                                    "of": "code[]",
                                    "cmatrix": null,
                                    "candidate": {
                                        "ns": null,
                                        "_code": null,
                                        "base": {
                                            "_value": 45,
                                            "_ver": 1
                                        }
                                    }
                                },
                                "description": "ワークフローが提供する状態共有機能の定義",
                                "isInherit": true
                            },
                            {
                                "key": "store",
                                "type": {
                                    "of": "code[]",
                                    "cmatrix": null,
                                    "candidate": {
                                        "ns": null,
                                        "_code": null,
                                        "base": {
                                            "_value": 44,
                                            "_ver": 1
                                        }
                                    }
                                },
                                "description": "ワークフローが蓄積可能なデータの定義",
                                "isInherit": true
                            }
                        ],
                        "attribute": null
                    },
                    {
                        "catalogItem": {
                            "ns": "catalog/ext/aaa-healthcare-consortium/actor/wf/actor_1000438/workflow",
                            "name": "外来診療",
                            "_code": {
                                "_value": 1000481,
                                "_ver": 1
                            },
                            "inherit": {
                                "_value": 46,
                                "_ver": 1
                            },
                            "description": "外来診療の定義です。"
                        },
                        "template": {
                            "_code": {
                                "_value": 1000481,
                                "_ver": 1
                            },
                            "information-site": null,
                            "region-alliance": null,
                            "share": [
                                {
                                    "_value": 1000485,
                                    "_ver": 1
                                },
                                {
                                    "_value": 1000486,
                                    "_ver": 1
                                }
                            ],
                            "store": [
                                {
                                    "_value": 9000489,
                                    "_ver": 1
                                }
                            ]
                        },
                        "prop": [
                            {
                                "key": "information-site",
                                "type": {
                                    "of": "string",
                                    "cmatrix": null,
                                    "format": null,
                                    "unit": null,
                                    "candidate": null
                                },
                                "description": "ワークフローの情報サイト",
                                "isInherit": true
                            },
                            {
                                "key": "region-alliance",
                                "type": {
                                    "of": "code[]",
                                    "cmatrix": null,
                                    "candidate": {
                                        "ns": null,
                                        "_code": null,
                                        "base": {
                                            "_value": 48,
                                            "_ver": 1
                                        }
                                    }
                                },
                                "description": "参加している領域運営サービスプロバイダーのリージョンコード配列",
                                "isInherit": true
                            },
                            {
                                "key": "share",
                                "type": {
                                    "of": "code[]",
                                    "cmatrix": null,
                                    "candidate": {
                                        "ns": null,
                                        "_code": null,
                                        "base": {
                                            "_value": 45,
                                            "_ver": 1
                                        }
                                    }
                                },
                                "description": "ワークフローが提供する状態共有機能の定義",
                                "isInherit": true
                            },
                            {
                                "key": "store",
                                "type": {
                                    "of": "code[]",
                                    "cmatrix": null,
                                    "candidate": {
                                        "ns": null,
                                        "_code": null,
                                        "base": {
                                            "_value": 44,
                                            "_ver": 1
                                        }
                                    }
                                },
                                "description": "ワークフローが蓄積可能なデータの定義",
                                "isInherit": true
                            }
                        ],
                        "attribute": null
                    },
                    {
                        "catalogItem": {
                            "ns": "catalog/ext/aaa-healthcare-consortium/actor/wf/actor_1000438/workflow",
                            "name": "外来診療",
                            "_code": {
                                "_value": 1000481,
                                "_ver": 1
                            },
                            "inherit": {
                                "_value": 46,
                                "_ver": 1
                            },
                            "description": "外来診療の定義です。"
                        },
                        "template": {
                            "_code": {
                                "_value": 1000481,
                                "_ver": 1
                            },
                            "information-site": null,
                            "region-alliance": null,
                            "share": [
                                {
                                    "_value": 1000485,
                                    "_ver": 1
                                },
                                {
                                    "_value": 1000486,
                                    "_ver": 1
                                }
                            ],
                            "store": [
                                {
                                    "_value": 1000489,
                                    "_ver": 1
                                }
                            ]
                        },
                        "prop": [
                            {
                                "key": "information-site",
                                "type": {
                                    "of": "string",
                                    "cmatrix": null,
                                    "format": null,
                                    "unit": null,
                                    "candidate": null
                                },
                                "description": "ワークフローの情報サイト",
                                "isInherit": true
                            },
                            {
                                "key": "region-alliance",
                                "type": {
                                    "of": "code[]",
                                    "cmatrix": null,
                                    "candidate": {
                                        "ns": null,
                                        "_code": null,
                                        "base": {
                                            "_value": 48,
                                            "_ver": 1
                                        }
                                    }
                                },
                                "description": "参加している領域運営サービスプロバイダーのリージョンコード配列",
                                "isInherit": true
                            },
                            {
                                "key": "share",
                                "type": {
                                    "of": "code[]",
                                    "cmatrix": null,
                                    "candidate": {
                                        "ns": null,
                                        "_code": null,
                                        "base": {
                                            "_value": 45,
                                            "_ver": 1
                                        }
                                    }
                                },
                                "description": "ワークフローが提供する状態共有機能の定義",
                                "isInherit": true
                            },
                            {
                                "key": "store",
                                "type": {
                                    "of": "code[]",
                                    "cmatrix": null,
                                    "candidate": {
                                        "ns": null,
                                        "_code": null,
                                        "base": {
                                            "_value": 44,
                                            "_ver": 1
                                        }
                                    }
                                },
                                "description": "ワークフローが蓄積可能なデータの定義",
                                "isInherit": true
                            }
                        ],
                        "attribute": null
                    }
                ]);
            }
            res.end();
        };
        // ハンドラーのイベントリスナーを追加、アプリケーションの起動
        this.app = express();
        this.app.get('/catalog/name', _listener2);
        this.app.get('/catalog/:catalogItemCode', _listener);
        this.app.get('/catalog', _listener3);
        this.server = this.app.listen(port);
    }
}

// オペレータサーバー
export class OperatorServer {
    app: express.Express;
    server: Server;

    constructor (status: number, type: number) {
        this.app = express();

        // イベントハンドラー
        const _listener = (req: express.Request, res: express.Response) => {
            res.status(status);
            res.json({
                sessionId: 'sessionId',
                operatorId: 1,
                type: type,
                loginId: 'loginid',
                name: 'test-user',
                mobilePhone: '0311112222',
                auth: {
                    add: true,
                    update: true,
                    delete: true
                },
                lastLoginAt: '2020-01-01T00:00:00.000+0900',
                attributes: {},
                roles: [
                    {
                        _value: 1,
                        _ver: 1
                    }
                ],
                block: {
                    _value: 1000110,
                    _ver: 1
                },
                actor: {
                    _value: 1000001,
                    _ver: 1
                }
            });
        };

        // ハンドラーのイベントリスナーを追加、アプリケーションの起動
        this.app.post('/operator/session', _listener);
        this.server = this.app.listen(3000);
    }
}
/* eslint-enable */
