/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { Connection, EntityManager, InsertResult } from 'typeorm';
import { Service } from 'typedi';
import ApiAccessPermissionDomain from '../../domains/ApiAccessPermissionDomain';
import ApiAccessPermissionEntity from './ApiAccessPermissionEntity';
/* eslint-enable */
import Log from '../../common/LogDecorator';

@Service()
export default class ApiAccessPermissionRepository {
    /**
     * DB接続オブジェクト
     */
    private connection: Connection;

    /**
     * コンストラクタ
     * @param connection
     */
    public constructor (connection: Connection) {
        this.connection = connection;
    }

    /**
     * APIアクセス許可取得
     * @param domain
     */
    @Log()
    public async getRecord (domain: ApiAccessPermissionDomain): Promise<ApiAccessPermissionEntity[]> {
        // SQLを生成
        const sql = this.connection
            .createQueryBuilder()
            .from(ApiAccessPermissionEntity, 'api_access_permission')
            .where('is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('token = :token', { token: domain.token })
            .andWhere('caller_api_url = :caller_api_url', { caller_api_url: domain.callerApiUrl })
            .andWhere('target_api_url = :target_api_url', { target_api_url: domain.targetApiUrl })
            .andWhere('target_api_method = :target_api_method', { target_api_method: domain.targetApiMethod })
            .orderBy('id', 'ASC');

        // SQLを実行
        const ret = await sql.getRawMany();
        const list: ApiAccessPermissionEntity[] = [];
        for (const info of ret) {
            list.push(new ApiAccessPermissionEntity(info));
        }
        return list;
    }

    /**
     * APIアクセス許可追加
     * @param em
     * @param domain
     */
    @Log()
    public async insertRecord (em: EntityManager, domain: ApiAccessPermissionDomain): Promise<InsertResult> {
        const ret = await em
            .createQueryBuilder()
            .insert()
            .into(ApiAccessPermissionEntity)
            .values({
                token: domain.token,
                targetBlockCode: domain.targetBlockCode,
                targetApiUrl: domain.targetApiUrl,
                targetApiMethod: domain.targetApiMethod,
                targetUserId: domain.targetUserId,
                expirationDate: domain.expirationDate,
                callerBlockCode: domain.callerBlockCode,
                callerApiUrl: domain.callerApiUrl,
                callerApiMethod: domain.callerApiMethod,
                callerApiCode: domain.callerApiCode,
                callerWfCode: null,
                callerWfVersion: null,
                callerAppCode: domain.callerAppCode,
                callerAppVersion: domain.callerAppVersion,
                callerOperatorType: domain.callerOperatorType,
                callerOperatorLoginId: domain.callerOperatorLoginId,
                parameter: domain.parameter,
                isDisabled: false,
                createdBy: domain.updatedBy,
                updatedBy: domain.updatedBy
            })
            .execute();
        return ret;
    }
}
