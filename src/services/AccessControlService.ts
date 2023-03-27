/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { Connection } from 'typeorm';
import PostAccessControlReqDto from '../resources/dto/PostAccessControlReqDto';
/* eslint-enable */
import ApiAccessPermissionDomain from '../domains/ApiAccessPermissionDomain';
import ApiAccessPermissionRepository from '../repositories/postgres/ApiAccessPermissionRepository';
import OperatorDomain from '../domains/OperatorDomain';
import * as crypto from 'crypto';
import PostAccessControlResDto from '../resources/dto/PostAccessControlResDto';
import uuid = require('uuid');

export default class AccessControlService {
    /**
     * APIアクセス許可生成
     * @param connection
     * @param dto
     */
    public async createAccessPermission (connection: Connection, operator: OperatorDomain, dto: PostAccessControlReqDto[]) {
        // レスポンス用の配列を生成
        const res: PostAccessControlResDto[] = [];

        // APIトークンレコードを登録
        await connection.transaction(async em => {
            // リクエストパラメータを1件ずつトークン生成用配列にセットする
            for (const request of dto) {
                // 取得したapiCodeとuserCode(UUID)と使用期限でsha256を取りtokenとする
                const sourceStr = request['caller']['apiCode'] + uuid.v4() + request.target.expirationDate;
                const hashStr = crypto.createHash('sha256').update(sourceStr, 'utf8').digest('hex');
                let apiUrl = request.target.apiUrl;
                for (let index = 0; index < 5; index++) {
                    apiUrl = decodeURIComponent(apiUrl);
                    if (!apiUrl.includes('%')) {
                        break;
                    }
                }

                // api_access_permission を登録
                const permissionDomain = this.getPermissionDomain(request, hashStr, apiUrl, operator);
                const permissionRepository = new ApiAccessPermissionRepository(connection);
                await permissionRepository.insertRecord(em, permissionDomain);

                // レスポンスを生成
                const elem = new PostAccessControlResDto();
                elem.apiToken = hashStr;
                elem.apiUrl = request.target.apiUrl;
                elem.apiMethod = request.target.apiMethod;
                elem.userId = request.caller.userId;
                res.push(elem);
            }
        });
        // レスポンスを返す
        return res;
    }

    /**
     * 権限ドメイン取得
     * @param request
     * @param hashStr
     * @param apiUrl
     * @param operator
     */
    private getPermissionDomain (request: PostAccessControlReqDto, hashStr: string, apiUrl: string, operator: OperatorDomain) {
        const operatorType = request.caller.operator.type;
        const permissionDomain = new ApiAccessPermissionDomain();
        permissionDomain.token = hashStr;
        permissionDomain.targetBlockCode = request.target.blockCode;
        permissionDomain.targetApiUrl = apiUrl.substr(apiUrl.indexOf('/'));
        permissionDomain.targetApiMethod = request.target.apiMethod;
        permissionDomain.targetUserId = request.target.userId;
        permissionDomain.expirationDate = request.target.expirationDate;
        permissionDomain.callerBlockCode = request.caller.blockCode;
        permissionDomain.callerApiUrl = request.caller.apiUrl;
        permissionDomain.callerApiMethod = request.caller.apiMethod;
        permissionDomain.callerApiCode = request.caller.apiCode;
        if (request.caller.operator.app) {
            permissionDomain.callerAppCode = operatorType === OperatorDomain.TYPE_APPLICATION_NUMBER ? request.caller.operator.app._value : null;
            permissionDomain.callerAppVersion = operatorType === OperatorDomain.TYPE_APPLICATION_NUMBER ? request.caller.operator.app._ver : null;
        }
        permissionDomain.callerOperatorType = operatorType;
        permissionDomain.callerOperatorLoginId = request.caller.operator.loginId;
        permissionDomain.parameter = request.target.parameter;
        permissionDomain.updatedBy = operator.loginId;
        return permissionDomain;
    }
}
