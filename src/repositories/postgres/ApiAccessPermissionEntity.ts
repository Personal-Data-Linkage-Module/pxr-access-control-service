/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import {
    Entity,
    BaseEntity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';

/**
 * APIアクセス許可テーブル エンティティクラス
 */
@Entity('api_access_permission')
export default class ApiAccessPermissionEntity extends BaseEntity {
    /**
     * ID
     */
    @PrimaryGeneratedColumn({ type: 'bigint' })
    readonly id!: number;

    /**
     * トークン
     */
    @Column({ type: 'varchar', length: 255, nullable: false, name: 'token' })
    token: string;

    /**
     * 呼出先ブロックカタログコード
     */
    @Column({ type: 'bigint', nullable: true, name: 'target_block_code' })
    targetBlockCode: number;

    /**
     * 呼出先APIURL
     */
    @Column({ type: 'text', nullable: false, name: 'target_api_url' })
    targetApiUrl: string;

    /**
     * 呼出先APIメソッド
     */
    @Column({ type: 'varchar', length: 255, nullable: false, name: 'target_api_method' })
    targetApiMethod: string;

    /**
     * 呼出先利用者ID
     */
    @Column({ type: 'varchar', length: 255, nullable: true, name: 'target_user_id' })
    targetUserId: string;

    /**
     * 有効期限
     */
    @Column({ type: 'timestamp without time zone', nullable: false, name: 'expiration_date' })
    expirationDate: Date;

    /**
     * 呼出元ブロックカタログコード
     */
    @Column({ type: 'bigint', nullable: false, name: 'caller_block_code' })
    callerBlockCode: number;

    /**
     * 呼出元APIURL
     */
    @Column({ type: 'text', nullable: false, name: 'caller_api_url' })
    callerApiUrl: string;

    /**
     * 呼出元APIメソッド
     */
    @Column({ type: 'varchar', length: 255, nullable: false, name: 'caller_api_method' })
    callerApiMethod: string;

    /**
     * 呼出元先APIコード
     */
    @Column({ type: 'varchar', length: 255, nullable: false, name: 'caller_api_code' })
    callerApiCode: string;

    /**
     * 呼出元ワークフローカタログコード
     */
    @Column({ type: 'bigint', nullable: true, name: 'caller_wf_code' })
    callerWfCode: number;

    /**
     * 呼出元ワークフローカタログバージョン
     */
    @Column({ type: 'bigint', nullable: true, name: 'caller_wf_version' })
    callerWfVersion: number;

    /**
     * 呼出元アプリケーションカタログコード
     */
    @Column({ type: 'bigint', nullable: true, name: 'caller_app_code' })
    callerAppCode: number;

    /**
     * 呼出元アプリケーションカタログバージョン
     */
    @Column({ type: 'bigint', nullable: true, name: 'caller_app_version' })
    callerAppVersion: number;

    /**
     * 呼出元オペレータタイプ
     */
    @Column({ type: 'smallint', nullable: false, name: 'caller_operator_type' })
    callerOperatorType: number;

    /**
     * 呼出元オペレータ
     */
    @Column({ type: 'varchar', length: 255, nullable: false, name: 'caller_operator_login_id' })
    callerOperatorLoginId: string;

    /**
     * パラメータ
     */
    @Column({ type: 'text', nullable: false, name: 'parameter' })
    parameter: string;

    /**
     * 削除フラグ
     */
    @Column({ type: 'boolean', nullable: false, default: false, name: 'is_disabled' })
    isDisabled: boolean = false;

    /**
     * 登録者
     */
    @Column({ type: 'varchar', length: 255, nullable: false, name: 'created_by' })
    createdBy: string;

    /**
     * 登録日時
     */
    @CreateDateColumn({ type: 'timestamp without time zone', nullable: false, default: 'NOW()', name: 'created_at' })
    readonly createdAt!: Date;

    /**
     * 更新者
     */
    @Column({ type: 'varchar', length: 255, nullable: false, name: 'updated_by' })
    updatedBy: string;

    /**
     * 更新日時
     */
    @UpdateDateColumn({ type: 'timestamp without time zone', nullable: false, default: 'NOW()', name: 'updated_at', onUpdate: 'now()' })
    readonly updatedAt!: Date;

    /**
     * コンストラクタ
     * @param info
     */
    public constructor (info: {}) {
        super();
        if (info) {
            this.id = Number(info['id']);
            this.token = info['token'];
            this.targetBlockCode = Number(info['target_block_code']);
            this.targetApiUrl = info['target_api_url'];
            this.targetApiMethod = info['target_api_method'];
            this.targetUserId = info['target_user_id'];
            this.expirationDate = new Date(info['expiration_date']);
            this.callerBlockCode = Number(info['caller_block_code']);
            this.callerApiUrl = info['caller_api_url'];
            this.callerApiMethod = info['caller_api_method'];
            this.callerApiCode = info['caller_api_code'];
            this.callerWfCode = null;
            this.callerWfVersion = null;
            this.callerAppCode = Number(info['caller_app_code']);
            this.callerAppVersion = Number(info['caller_app_version']);
            this.callerOperatorType = Number(info['caller_operator_type']);
            this.callerOperatorLoginId = info['caller_operator_login_id'];
            this.parameter = info['parameter'];
            this.isDisabled = Boolean(info['is_disabled']);
            this.createdBy = info['created_by'];
            this.createdAt = new Date(info['created_at']);
            this.updatedBy = info['updated_by'];
            this.updatedAt = new Date(info['updated_at']);
        }
    }
}
