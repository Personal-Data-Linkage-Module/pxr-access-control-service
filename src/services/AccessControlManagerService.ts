/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { Request } from 'express';
import { doPostRequest } from '../common/DoRequest';
import AppError from '../common/AppError';
import OperatorDomain from '../domains/OperatorDomain';
import request = require('request');
import Config from '../common/Config';
import { ResponseCode } from '../common/ResponseCode';
const Message = Config.ReadConfig('./config/message.json');
const Configure = Config.ReadConfig('./config/config.json');
import urljoin = require('url-join');
import fs = require('fs');
import AccessControlManageResult from './dto/AccessControlManageResult';
import { transformAndValidate } from 'class-transformer-validator';
/* eslint-enable */

/**
 * アクセス制御管理サービスとの連携クラス
 */
export default class AccessControlManagerService {
    /**
     * アクセス制御管理サービスから、APIトークンを取得する
     * @param code カタログコード
     * @param operator オペレータ情報
     */
    public static async post (path: string, parameter: {}, operator: OperatorDomain, req: Request) {
        const url = urljoin(Configure.access_manage.base_url, path);
        const postDataStr = JSON.stringify(parameter);
        const option: request.CoreOptions = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': Buffer.byteLength(postDataStr),
                session: operator.encoded
            },
            cert: fs.readFileSync(Configure.cert.client_crt),
            key: fs.readFileSync(Configure.cert.client_key),
            rejectUnauthorized: false,
            body: postDataStr
        };
        if (req.headers['access-token']) {
            option.headers['access-token'] = req.headers['access-token'] as string;
        }
        try {
            const result = await doPostRequest(url, option);

            const { statusCode } = result.response;
            if (statusCode === ResponseCode.NO_CONTENT || statusCode === ResponseCode.BAD_REQUEST) {
                throw new AppError(result.body.message, ResponseCode.BAD_REQUEST);
            } else if (statusCode !== ResponseCode.OK) {
                throw new AppError(Message.FAILED_CREATE_TOKEN, statusCode);
            }

            const dto = await transformAndValidate(AccessControlManageResult, result.body) as AccessControlManageResult[];
            return dto;
        } catch (err) {
            if (err instanceof AppError) {
                throw err;
            }
            throw new AppError(Message.FAILED_CONNECT_TO_ACCESS_CONTROL_MANAGE, ResponseCode.INTERNAL_SERVER_ERROR, err);
        }
    }
}
