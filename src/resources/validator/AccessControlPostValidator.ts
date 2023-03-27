/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { Request, Response, NextFunction } from 'express';
import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
/* eslint-enable */
import { transformAndValidate } from 'class-transformer-validator';
import AppError from '../../common/AppError';
import { ResponseCode } from '../../common/ResponseCode';
import PostAccessControlReqDto from '../dto/PostAccessControlReqDto';
import Config from '../../common/Config';
const Message = Config.ReadConfig('./config/message.json');

/**
 * APIアクセス許可照合APIのバリデーションチェッククラス
 */
@Middleware({ type: 'before' })
export default class AccessControlPostValidator implements ExpressMiddlewareInterface {
    async use (request: Request, response: Response, next: NextFunction) {
        // 空かどうか判定し、空と判定した場合にはエラーをスローする
        if (!request.body || JSON.stringify(request.body) === JSON.stringify({})) {
            throw new AppError(Message.REQUEST_IS_EMPTY, ResponseCode.BAD_REQUEST);
        }
        // パラメータを取得
        const dto = await transformAndValidate(PostAccessControlReqDto, request.body);
        if (!Array.isArray(dto)) {
            throw new AppError(Message.validation.isArray, ResponseCode.BAD_REQUEST);
        }

        // 細かい確認処理
        for (const element of dto) {
            const caller = element.caller;
            const target = element.target;
            // // オペレーター種別がアプリケーションではない場合、loginIdが必要
            if (
                ![2].includes(caller.operator.type) && !caller.operator.loginId
            ) {
                throw new AppError('オペレーター.ログインIDの設定が必要です', 400);
            }

            const expirationDate = target.expirationDate;
            const nowDate = new Date();
            if (expirationDate < nowDate) {
                throw new AppError('有効期限を現在日時より過去を設定することはできません', 400);
            }
        }

        next();
    }
}
