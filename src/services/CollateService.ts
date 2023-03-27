/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { Connection } from 'typeorm';
import AppError from '../common/AppError';
import { ResponseCode } from '../common/ResponseCode';
import Config from '../common/Config';
import ApiAccessPermissionDomain from '../domains/ApiAccessPermissionDomain';
import ApiAccessPermissionRepository from '../repositories/postgres/ApiAccessPermissionRepository';
import PostCollateReqDto from '../resources/dto/PostCollateReqDto';
const Message = Config.ReadConfig('./config/message.json');
/* eslint-enable */

export default class CollateService {
    /**
     * APIアクセス許可照合
     * @param connection
     * @param dto
     */
    public async matchToken (connection: Connection, dto: PostCollateReqDto) {
        // APIトークンを検索
        const permissionDomain = new ApiAccessPermissionDomain();
        permissionDomain.token = dto.target.apiToken;
        permissionDomain.callerApiUrl = dto.caller.apiUrl;
        let apiUrl = dto.target.apiUrl;
        for (let index = 0; index < 5; index++) {
            apiUrl = decodeURIComponent(apiUrl);
            if (!apiUrl.includes('%')) {
                break;
            }
        }
        permissionDomain.targetApiUrl = apiUrl;
        permissionDomain.targetApiMethod = dto.target.apiMethod;
        const permissionRepository = new ApiAccessPermissionRepository(connection);
        const permissionInfo = await permissionRepository.getRecord(permissionDomain);
        if (!permissionInfo || permissionInfo.length <= 0) {
            // APIトークンが存在しない場合、エラーをthrow
            throw new AppError(Message.FAILED_GET_TOKEN, ResponseCode.BAD_REQUEST);
        }
        // レスポンスを返す
        return permissionInfo;
    }
}
