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
import PostCollateReqDto from '../dto/PostCollateReqDto';
import Config from '../../common/Config';
const Message = Config.ReadConfig('./config/message.json');

/**
 * APIアクセス許可照合APIのバリデーションチェッククラス
 */
@Middleware({ type: 'before' })
export default class CollatePostValidator implements ExpressMiddlewareInterface {
    async use (request: Request, response: Response, next: NextFunction) {
        // パラメータを取得
        const dto = await transformAndValidate(PostCollateReqDto, request.body);
        if (Array.isArray(dto)) {
            throw new AppError(Message.REQUEST_IS_ARRAY, 400);
        }

        next();
    }
}
