/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { Connection, EntityManager, InsertResult, UpdateResult } from 'typeorm';
import { Service } from 'typedi';
import ApiTokenDomain from '../../domains/ApiTokenDomain';
import ApiTokenEntity from './ApiTokenEntity';
/* eslint-enable */
import Log from '../../common/LogDecorator';

@Service()
export default class ApiTokenRepository {
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
     * APIトークン取得
     * @param domain
     */
    @Log()
    public async getRecord (domain: ApiTokenDomain): Promise<ApiTokenEntity[]> {
        // SQLを生成
        let sql = this.connection
            .createQueryBuilder()
            .from(ApiTokenEntity, 'api_token')
            .where('is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('expiration_date >= :expiration_date', { expiration_date: domain.expirationDate });

        sql = sql.andWhere('caller_api_url = :caller_api_url', { caller_api_url: domain.callerApiUrl });
        sql = sql.andWhere('caller_operator_login_id = :caller_operator_login_id', { caller_operator_login_id: domain.callerOperatorLoginId });
        sql = sql.andWhere('target_api_url = :target_api_url', { target_api_url: domain.targetApiUrl });
        sql = sql.andWhere('target_api_method = :target_api_method', { target_api_method: domain.targetApiMethod });
        sql = sql.andWhere('caller_block_code = :caller_block_code', { caller_block_code: domain.callerBlockCode });
        if (domain.attribute) {
            sql = sql.andWhere('attribute = :attribute', { attribute: domain.attribute });
        }
        if (domain.targetBlockCode) {
            sql.andWhere('target_block_code = :target_block_code', { target_block_code: domain.targetBlockCode });
        }
        sql = sql.orderBy('id', 'ASC');

        // SQLを実行
        const ret = await sql.getRawMany();
        const list: ApiTokenEntity[] = [];
        for (const info of ret) {
            list.push(new ApiTokenEntity(info));
        }
        return list;
    }

    /**
     * APIトークン追加
     * @param em
     * @param domain
     */
    @Log()
    public async insertRecord (em: EntityManager, domain: ApiTokenDomain): Promise<InsertResult> {
        const ret = await em
            .createQueryBuilder()
            .insert()
            .into(ApiTokenEntity)
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
                attribute: domain.attribute,
                isDisabled: false,
                createdBy: domain.updatedBy,
                updatedBy: domain.updatedBy
            })
            .execute();
        return ret;
    }
}
