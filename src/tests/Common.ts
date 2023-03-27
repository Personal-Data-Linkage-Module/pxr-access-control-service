/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import { connectDatabase } from '../common/Connection';
import path = require('path');
import fs = require('fs');

// テスト用にlisten数を無制限に設定
require('events').EventEmitter.defaultMaxListeners = 0;

/**
 * URL
 */
export namespace Url {
    /**
     * ベースURL
     */
    export const baseURI: string = '/access-control';

    /**
     * APIトークン取得URL
     */
    export const tokenURI: string = baseURI + '/token';

    /**
     * APIアクセス許可生成URL
     */
    export const accessControlURI: string = baseURI + '/';

    /**
     * APIアクセス許可照合URL
     */
    export const collateURI: string = baseURI + '/collate';
}

/**
 * テスト用共通クラス
 */
export default class Common {
    /**
     * SQLファイル実行
     * @param fileName
     */
    public async executeSqlFile (fileName: string) {
        // ファイルをオープン
        const fd: number = fs.openSync(path.join('./ddl/unit-test/', fileName), 'r');

        // ファイルからSQLを読込
        const sql: string = fs.readFileSync(fd, 'UTF-8');

        // ファイルをクローズ
        fs.closeSync(fd);

        // DBを初期化
        await (await connectDatabase()).query(sql);
    }

    /**
     * SQL実行
     * @param sql
     */
    public async executeSqlString (sql: string) {
        // DBを初期化
        await (await connectDatabase()).query(sql);
    }
}
