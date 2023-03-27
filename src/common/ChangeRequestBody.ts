/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import Config from '../common/Config';
const Message = Config.ReadConfig('./config/message.json');

/**
 * レスポンスパラメータを確認する
 * @param resParam パラメータ
 * @returns パラメータのチェック結果
 */
export function resParamCheck (resParam: any): string {
    if ((!resParam) || (typeof resParam === 'undefined')) {
        return Message.MISSING_RECEIVE_VALUE;
    }
    return null;
}

/**
 * store用設定
 */
export function storeSetting (pathStr: string, permission: any, request: any): string {
    let userId;
    const codes: {}[] = [];
    if (pathStr.indexOf('document') >= 0) {
        const userIdStr = pathStr.split('/');
        userId = userIdStr[3];
        if (permission['method'] !== 'DELETE') {
            codes.push({
                code: request['caller']['requestBody']['code']['value'],
                app: request['caller']['requestBody']['app'] ? request['caller']['requestBody']['app'] : null,
                wf: null,
                userId: request['caller']['requestBody']['userId'] ? request['caller']['requestBody']['userId'] : null
            });
            request['caller']['requestBody'] = codes;
        }
    } else if (pathStr.indexOf('event') >= 0) {
        const userIdStr = pathStr.split('/');
        userId = userIdStr[3];
        if (permission['method'] !== 'DELETE') {
            codes.push({
                code: request['caller']['requestBody']['code']['value'],
                app: request['caller']['requestBody']['app'] ? request['caller']['requestBody']['app'] : null,
                wf: null,
                userId: request['caller']['requestBody']['userId'] ? request['caller']['requestBody']['userId'] : null
            });
            request['caller']['requestBody'] = codes;
        }
    } else if (pathStr.indexOf('thing') >= 0) {
        if (pathStr.indexOf('bulk') >= 0) {
            const userIdStr = pathStr.split('/');
            userId = userIdStr[4];
            if (permission['method'] !== 'DELETE') {
                for (const thing of request['caller']['requestBody']) {
                    codes.push({
                        code: thing['code']['value'],
                        app: thing['app'] ? thing['app'] : null,
                        wf: null
                    });
                }
                request['caller']['requestBody'] = codes;
            }
        } else {
            const userIdStr = pathStr.split('/');
            userId = userIdStr[3];
            if (permission['method'] !== 'DELETE') {
                codes.push({
                    code: request['caller']['requestBody']['code']['value'],
                    app: request['caller']['requestBody']['app'] ? request['caller']['requestBody']['app'] : null,
                    wf: null
                });
                request['caller']['requestBody'] = codes;
            }
        }
    }
    return userId;
}

/**
 * オペレーター用設定
 */
export function operatorSetting (request: any) {
    if (request['caller']['requestBody'] && request['caller']['requestBody']['auth']) {
        request['caller']['requestBody'] = jsonSort(request['caller']['requestBody']['auth']);
    } else {
        delete request['caller']['requestBody'];
    }
}

/**
 * カタログ用設定
 */
export function catalogSetting (request: any) {
    if ((request['target']['apiUrl'] as string).indexOf('updateSet') >= 0) {
        if ((request['target']['apiMethod'] === 'POST' || request['target']['apiMethod'] === 'PUT') && request['caller']['requestBody']) {
            const nss: string[] = [];
            if (request['caller']['requestBody']['ns']) {
                for (const ns of request['caller']['requestBody']['ns']) {
                    nss.push(ns.template.ns);
                }
            }
            if (request['caller']['requestBody']['catalog']) {
                for (const ns of request['caller']['requestBody']['catalog']) {
                    nss.push(ns.template.catalogItem.ns);
                }
            }
            request['caller']['requestBody'] = nss;
        } else {
            delete request['caller']['requestBody'];
        }
    } else {
        if ((request['target']['apiMethod'] === 'POST' || request['target']['apiMethod'] === 'PUT') &&
            request['caller']['requestBody'] && request['caller']['requestBody']['catalogItem'] && request['caller']['requestBody']['catalogItem']['ns']) {
            request['caller']['requestBody'] = request['caller']['requestBody']['catalogItem']['ns'];
        } else if (request['target']['apiMethod'] === 'DELETE') {
            const path: string = request['target']['apiUrl'];
            const codeValue = path.match(/^\/catalog\/ext\/(\d+)\/?$/);
            request['caller']['requestBody'] = codeValue[1];
        } else {
            delete request['caller']['requestBody'];
        }
    }
}

/**
 * 共有用設定
 */
export function shareSetting (request: any, path: string): string {
    delete request['caller']['requestBody']['logIdentifier'];
    if (request['caller']['requestBody']['tempShareCode']) {
        return '/share/temp';
    } else {
        return path;
    }
}

/**
 * JSONソート
 * @param json
 */
export function jsonSort (json: {}): {} {
    // レスポンスをKey名でソート
    const keys = Object.keys(json);
    keys.sort();
    const res = {};
    for (let index = 0; index < keys.length; index++) {
        if (typeof json[keys[index]] === 'object') {
            res[keys[index]] = jsonSort(json[keys[index]]);
        } else {
            res[keys[index]] = json[keys[index]];
            res[keys[index]] = null;
        }
    }
    return res;
}
