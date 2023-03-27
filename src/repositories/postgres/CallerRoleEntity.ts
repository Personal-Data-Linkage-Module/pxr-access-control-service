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
 * 呼出元ロールテーブル エンティティクラス
 */
@Entity('caller_role')
export default class CallerRoleEntity extends BaseEntity {
    /**
     * ID
     */
    @PrimaryGeneratedColumn({ type: 'bigint' })
    readonly id!: number;

    /**
     * APIアクセス許可ID
     */
    @Column({ type: 'bigint', nullable: false, name: 'api_access_permission_id' })
    apiAccessPermissionId: number;

    /**
     * 呼出元ロールカタログコード
     */
    @Column({ type: 'bigint', nullable: false, name: 'role_catalog_code' })
    roleCatalogCode: number;

    /**
     * 呼出元ロールカタログバージョン
     */
    @Column({ type: 'bigint', nullable: false, name: 'role_catalog_version' })
    roleCatalogVersion: number;

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
}
