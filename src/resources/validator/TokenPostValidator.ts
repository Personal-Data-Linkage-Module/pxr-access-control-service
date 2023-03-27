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
import PostTokenReqDto from '../dto/PostTokenReqDto';
import Config from '../../common/Config';
const Message = Config.ReadConfig('./config/message.json');
const Configure = Config.ReadConfig('./config/config.json');

/**
 * APIトークン取得APIのバリデーションチェッククラス
 */
@Middleware({ type: 'before' })
export default class TokenPostValidator implements ExpressMiddlewareInterface {
    async use (request: Request, response: Response, next: NextFunction) {
        // パラメータを取得
        const dto = await transformAndValidate(PostTokenReqDto, request.body);
        if (!Array.isArray(dto)) {
            throw new AppError(Message.validation.isArray, ResponseCode.BAD_REQUEST);
        }

        // 細かい確認処理
        for (const element of dto) {
            const caller = element.caller;
            const target = element.target;
            // オペレーター種別がアプリケーションではない場合、loginIdが必要
            if (
                ![2].includes(caller.operator.type) && !caller.operator.loginId
            ) {
                throw new AppError('オペレーター.ログインIDの設定が必要です', 400);
            }

            // APIトークン取得では規定のURLの場合にcodeがあるかチェック
            const requestUrl = Configure.requesturl.split(',');
            const configUrlList: any[] = [];
            for (let i = 0; i < requestUrl.length; i++) {
                const urlstr = requestUrl[i].split(':');
                configUrlList.push({
                    method: urlstr[0],
                    url: urlstr[1]
                });
            }
            for (const configUrl of configUrlList) {
                if (
                    (target['apiMethod'] === configUrl.method) &&
                    (target.apiUrl.indexOf(configUrl.url) >= 0) &&
                    (target.apiUrl.indexOf('bulk') < 0)
                ) {
                    if (!target._code || !target._code.length) {
                        throw new AppError('対象のURLへアクセスする場合、リクエストボディ.targetに_codeプロパティが必要です', 400);
                    }
                    break;
                }
            }
        }
        next();
    }
}
