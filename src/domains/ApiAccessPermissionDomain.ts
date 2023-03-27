/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/**
 *
 *
 *
 * $Date$
 * $Revision$
 * $Author$
 *
 * TEMPLATE VERSION:  76463
 */

// SDE-IMPL-REQUIRED 本ファイルをコピーし適切なファイル名、クラス名に変更したうえで実際の業務処理を実装してください。

export default class ApiAccessPermissionDomain {
    /**
     * ID
     */
    id: number = null;

    /**
     * トークン
     */
    token: string = null;

    /**
     * 呼出先Blockカタログコード
     */
    targetBlockCode: number = null;

    /**
     * 呼出先APIURL
     */
    targetApiUrl: string = null;

    /**
     * 呼出先APIメソッド
     */
    targetApiMethod: string = null;

    /**
     * 利用者ID
     */
    targetUserId: string = null;

    /**
     * 有効期限
     */
    expirationDate: Date = null;

    /**
     * 呼出元Blockカタログコード
     */
    callerBlockCode: number = null;

    /**
     * 呼出元APIURL
     */
    callerApiUrl: string = null;

    /**
     * 呼出元APIメソッド
     */
    callerApiMethod: string = null;

    /**
     * 呼出元APIコード
     */
    callerApiCode: string = null;

    /**
     * 呼出元ワークフローカタログコード
     */
    callerWfCode: number = null;

    /**
     * 呼出元ワークフローカタログバージョン
     */
    callerWfVersion: number = null;

    /**
     * 呼出元アプリケーションカタログコード
     */
    callerAppCode: number = null;

    /**
     * 呼出元アプリケーションカタログバージョン
     */
    callerAppVersion: number = null;

    /**
     * 呼出元オペレータタイプ
     */
    callerOperatorType: number = null;

    /**
     * 呼出元オペレータ
     */
    callerOperatorLoginId: string = null;

    /**
     * パラメータ
     */
    parameter: string = null;

    /**
     * 更新者
     */
    updatedBy: string = null;
}
