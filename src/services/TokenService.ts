/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { Request } from 'express';
import { Connection } from 'typeorm';
import ApiTokenEntity from '../repositories/postgres/ApiTokenEntity';
import PostTokenReqDto from '../resources/dto/PostTokenReqDto';
import AccessControlManageResult from './dto/AccessControlManageResult';
import { DateTimeFormatString } from '../common/Transform';
import { applicationLogger } from '../common/logging';
/* eslint-enable */
import OperatorDomain from '../domains/OperatorDomain';
import AccessControlManagerService from './AccessControlManagerService';
import ApiTokenDomain from '../domains/ApiTokenDomain';
import ApiTokenRepository from '../repositories/postgres/ApiTokenRepository';
import * as uuid from 'uuid';
import Config from '../common/Config';
import AppError from '../common/AppError';
import { ResponseCode } from '../common/ResponseCode';
import { catalogSetting, operatorSetting, storeSetting, shareSetting } from '../common/ChangeRequestBody';
import PostTokenResDto from '../resources/dto/PostTokenResDto';
import config = require('config');
const moment = require('moment-timezone');
const Configure = Config.ReadConfig('./config/config.json');
const Message = Config.ReadConfig('./config/message.json');
const AccessPath = Config.ReadConfig('./config/accessPath.json');

export default class TokenService {
    // SDE-IMPL-REQUIRED サービスレイヤの処理を以下に実装します。
    /**
     * APIトークン取得
     * @param connection
     * @param dto
     * RefactorDescription:
     *  #3821 : getApiTokenParam, getApiTokenResponseDomains, searchTokenList,
     *          getAccessPath, setApplicationVersion, getService
     */
    public async getToken (connection: Connection, operator: OperatorDomain, dto: PostTokenReqDto[], req: Request) {
        // 蓄積の場合アクセス先のパスを決定する
        let path = Configure.access_manage.default_path;
        let userId: string = null;
        let service = null;
        ({ path, service, userId } = this.getAccessPath(dto, path, userId, service));
        if (path === Configure.access_manage.default_path) {
            for (const request of dto) {
                delete request.caller.requestBody;
            }
        }
        // リクエストパラメータをDB検索用の配列に保存
        const apiTokenParam: PostTokenReqDto[] = await this.getApiTokenParam(dto, operator, userId, service);

        // トークンリストを検索
        const tokenList: ApiTokenEntity[] = await this.searchTokenList(connection, apiTokenParam, operator);

        // 検索結果の配列を1行ずつチェックし生成指示依頼が必要か判定
        const requestParam: PostTokenReqDto[] = [];
        const existsTokenList: any[] = [];
        for (const param of apiTokenParam) {
            param.caller.apiCode = uuid.v4();
            // DB検索結果からapiTokenが取得できたものとできなかったものに分ける
            let allocateToRequest = true;
            for (const token of tokenList) {
                // apiTokenが取得できたものはレスポンス用の配列に保存
                if (
                    param.caller.apiUrl === token.callerApiUrl &&
                    param.target.apiUrl === token.targetApiUrl &&
                    param.target.apiMethod === token.targetApiMethod
                ) {
                    const temporaryParam = param as any;
                    temporaryParam.target.blockCode = token.targetBlockCode;
                    temporaryParam.caller.apiToken = token.token;
                    existsTokenList.push(temporaryParam);
                    allocateToRequest = false;
                    break;
                }
            }
            if (allocateToRequest) {
                requestParam.push(param);
            }
        }

        // リクエスト用の配列があればアクセス制御管理サービスにリクエストする
        let apiTokenList: AccessControlManageResult[] = [];
        if ((requestParam.length) && (requestParam.length > 0)) {
            // アクセス制御管理サービスにリクエストするパラメータを生成
            apiTokenList = await AccessControlManagerService.post(path, requestParam, operator, req);
        }

        // アクセス制御管理サービスにリクエストしてレスポンスが正常に得られたとき
        const apiTokenResponseDomains = apiTokenList.map(elem => {
            return this.getApiTokenResponseDomains(apiTokenParam, elem, operator);
        });
        if (apiTokenResponseDomains.length > 0) {
            await connection.transaction(async em => {
                const tokenRepositoryRes = new ApiTokenRepository(connection);
                for (const domain of apiTokenResponseDomains) {
                    await tokenRepositoryRes.insertRecord(em, domain);
                }
            });
        }

        const responses = existsTokenList.map(elem => {
            const ret = new PostTokenResDto();
            ret.apiUrl = elem.target.apiUrl;
            ret.apiMethod = elem.target.apiMethod;
            ret.blockCode = elem.target.blockCode;
            ret.apiToken = elem.caller.apiToken;
            return ret;
        });
        responses.push(...apiTokenResponseDomains.map(elem => {
            const ret = new PostTokenResDto();
            ret.apiUrl = elem.targetApiUrl;
            ret.apiMethod = elem.targetApiMethod;
            ret.blockCode = elem.targetBlockCode;
            ret.apiToken = elem.token;
            return ret;
        }));
        return responses;
    }

    /**
     * APIトークンパラメータ取得
     */
    private async getApiTokenParam (dto: PostTokenReqDto[], operator: OperatorDomain, userId: string, service: any) {
        const apiTokenParam: PostTokenReqDto[] = [];
        for (const request of dto) {
            request.caller.operator.type = operator.type;
            request.caller.operator.loginId = operator.loginId;
            request.caller.userId = userId;

            // ログインオペレーター種別により、必要なプロパティの追加
            if (operator.type === OperatorDomain.TYPE_WORKFLOW_NUMBER) {
                throw new AppError(Message.UNSUPPORTED_OPERATOR, ResponseCode.BAD_REQUEST);
            } else if (operator.type === OperatorDomain.TYPE_APPLICATION_NUMBER) {
                request.caller.operator.role = operator.roles;
                this.setApplicationVersion(service, request, operator);
            }

            apiTokenParam.push(request);
        }
        return apiTokenParam;
    }

    /**
     * APIトークンレスポンスドメイン取得
     */
    private getApiTokenResponseDomains (apiTokenParam: PostTokenReqDto[], elem: AccessControlManageResult, operator: OperatorDomain) {
        const param = apiTokenParam.find(p => p.target.apiUrl === elem.apiUrl &&
            p.target.apiMethod === elem.apiMethod &&
            p.caller.userId === elem.userId
        );
        if (!param) {
            throw new AppError(Message.NOT_EXISTS_REQUEST_PARAM, 400);
        }
        const { type } = param.caller.operator;
        const domain = new ApiTokenDomain();
        domain.token = elem.apiToken;
        domain.callerApiUrl = param.caller.apiUrl;
        domain.callerApiCode = param.caller.apiCode;
        domain.callerApiMethod = param.caller.apiMethod;
        domain.callerBlockCode = param.caller.blockCode;
        domain.callerOperatorType = type;
        domain.callerOperatorLoginId = param.caller.operator.loginId;
        if (param.caller.operator.app) {
            domain.callerAppCode = type === OperatorDomain.TYPE_APPLICATION_NUMBER ? param.caller.operator.app._value : null;
            domain.callerAppVersion = type === OperatorDomain.TYPE_APPLICATION_NUMBER ? param.caller.operator.app._ver : null;
        }
        domain.targetUserId = elem.userId;
        domain.targetApiUrl = (url => url.substr(url.indexOf('/')))(elem.apiUrl);
        domain.targetApiMethod = elem.apiMethod;
        domain.targetBlockCode = elem.blockCode;
        domain.expirationDate = elem.expirationDate;
        domain.attribute = param.caller.requestBody;
        domain.updatedBy = operator.loginId;
        return domain;
    }

    /**
     * トークンリスト検索
     */
    private async searchTokenList (connection: Connection, apiTokenParam: PostTokenReqDto[], operator: OperatorDomain) {
        const tokenList: ApiTokenEntity[] = [];
        const now = moment(new Date()).tz(config.get('timezone')).format(DateTimeFormatString);
        applicationLogger.info('now:' + now);
        const tokenRepository = new ApiTokenRepository(connection);
        for (const param of apiTokenParam) {
            const domain = new ApiTokenDomain();
            domain.callerApiUrl = param.caller.apiUrl;
            domain.targetApiUrl = param.target.apiUrl;
            domain.targetApiMethod = param.target.apiMethod;
            domain.attribute = param.caller.requestBody;
            domain.callerOperatorLoginId = operator.loginId;
            domain.expirationDate = now;
            domain.callerBlockCode = param.caller.blockCode;
            if (param.target.blockCode !== operator.blockCode) {
                domain.targetBlockCode = param.target.blockCode;
            }
            const tempList = await tokenRepository.getRecord(domain);
            tokenList.push(...tempList);
        }
        return tokenList;
    }

    /**
     * アクセスパス取得
     */
    private getAccessPath (dto: PostTokenReqDto[], path: any, userId: string, service: any) {
        for (let index = 0; index < AccessPath.length; index++) {
            for (const targetApi of AccessPath[index]['targetApi']) {
                for (const request of dto) {
                    const pattern: RegExp = RegExp(targetApi['url']);
                    if (request.target.apiMethod === targetApi['method'] &&
                        pattern.test(request.target.apiUrl)) {
                        path = AccessPath[index]['controlManagePath'];
                        const pathStr: string = request.target.apiUrl;

                        if (path === '/store') {
                            service = this.getService(pathStr, request);
                            userId = storeSetting(pathStr, targetApi, request);
                        } else if (path === '/operator' && (request.target.apiMethod === 'POST' || request.target.apiMethod === 'PUT')) {
                            operatorSetting(request);
                        } else if (path === '/catalog') {
                            catalogSetting(request);
                        } else if (path === '/share/continuous') {
                            path = shareSetting(request, path);
                        } else {
                            delete request.caller.requestBody;
                        }
                        break;
                    }
                }
                if (path !== Configure.access_manage.default_path) {
                    break;
                }
            }
        }
        return { path, service, userId };
    }

    /**
     * Applicationバージョン設定
     */
    private setApplicationVersion (service: any, request: PostTokenReqDto, operator: OperatorDomain) {
        if (service) {
            request.caller.operator.app = {
                _value: service['_value'],
                _ver: service['_ver']
            };
        } else {
            request.caller.operator.app = {
                _value: operator.roles[0]['_value'],
                _ver: operator.roles[0]['_ver']
            };
        }
    }

    /**
     * サービス情報取得
     */
    private getService (pathStr: string, request: PostTokenReqDto) {
        let service = null;
        if (pathStr.indexOf('bulk') >= 0) {
            if (request['caller']['requestBody'][0]['app'] && request['caller']['requestBody'][0]['app']['app'] && request['caller']['requestBody'][0]['app']['app']['value']) {
                service = request['caller']['requestBody'][0]['app']['app']['value'];
            }
        } else {
            if (request['caller']['requestBody']['app'] && request['caller']['requestBody']['app']['app'] && request['caller']['requestBody']['app']['app']['value']) {
                service = request['caller']['requestBody']['app']['app']['value'];
            }
        }
        return service;
    }
}
