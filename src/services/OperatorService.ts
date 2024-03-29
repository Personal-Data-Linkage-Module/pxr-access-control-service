/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import AppError from '../common/AppError';
import OperatorDomain from '../domains/OperatorDomain';
import { Request } from 'express';
import { doPostRequest } from '../common/DoRequest';
import Config from '../common/Config';
import { ResponseCode } from '../common/ResponseCode';
import request = require('request');
/* eslint-enable */
import config = require('config');
const Message = Config.ReadConfig('./config/message.json');

/**
 * オペレーターサービスとの連携クラス
 */
export default class OperatorService {
    /**
     * オペレーターのセッション情報を取得する
     * @param req リクエストオブジェクト
     */
    static async authMe (req: Request): Promise<OperatorDomain> {
        const { cookies } = req;
        const sessionId = cookies[OperatorDomain.TYPE_PERSONAL_KEY]
            ? cookies[OperatorDomain.TYPE_PERSONAL_KEY]
            : cookies[OperatorDomain.TYPE_APPLICATION_KEY]
                ? cookies[OperatorDomain.TYPE_APPLICATION_KEY]
                : cookies[OperatorDomain.TYPE_MANAGER_KEY];
        // Cookieからセッションキーが取得できた場合、オペレーターサービスに問い合わせる
        if (typeof sessionId === 'string' && sessionId.length > 0) {
            const bodyData = JSON.stringify({ sessionId });
            const options: request.CoreOptions = {
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(bodyData)
                },
                body: bodyData
            };
            try {
                const result = await doPostRequest(
                    config.get('operatorService.session'),
                    options
                );
                // ステータスコードにより制御
                const { statusCode } = result.response;
                if (statusCode === ResponseCode.NO_CONTENT || statusCode === ResponseCode.BAD_REQUEST) {
                    throw new AppError(Message.NOT_AUTHORIZED, ResponseCode.UNAUTHORIZED);
                } else if (statusCode !== 200) {
                    throw new AppError(Message.FAILED_TAKE_SESSION, ResponseCode.INTERNAL_SERVER_ERROR);
                }
                let data = result.body;
                while (typeof data === 'string') {
                    data = JSON.parse(data);
                }
                return new OperatorDomain(data);
            } catch (err) {
                if (err instanceof AppError) {
                    throw err;
                }
                throw new AppError(Message.FAILED_CONNECT_TO_OPERATOR, ResponseCode.INTERNAL_SERVER_ERROR, err);
            }

        // ヘッダーにセッション情報があれば、それを流用する
        } else if (req.headers.session) {
            let data = decodeURIComponent(req.headers.session + '');
            while (typeof data === 'string') {
                data = JSON.parse(data);
            }
            return new OperatorDomain(data, req.headers.session + '');

        // セッション情報が存在しない場合、未ログインとしてエラーをスローする
        } else {
            throw new AppError(Message.NOT_AUTHORIZED, 401);
        }
    }
}
