/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { Request } from 'express';
import {
    JsonController, Post, Header, Req, UseBefore, Body} from 'routing-controllers';
import PostTokenReqDto from './dto/PostTokenReqDto';
/* eslint-enable */
import EnableSimpleBackPressure from './backpressure/EnableSimpleBackPressure';
import OperatorService from '../services/OperatorService';
import TokenService from '../services/TokenService';
import TokenPostValidator from './validator/TokenPostValidator';
import { getConnection } from 'typeorm';
import { applicationLogger } from '../common/logging';

@JsonController('/access-control')
export default class TokenController {
    @Post('/token')
    @Header('X-Content-Type-Options', 'nosniff')
    @Header('X-XSS-Protection', '1; mode=block')
    @Header('X-Frame-Options', 'deny')
    @EnableSimpleBackPressure()
    @UseBefore(TokenPostValidator)
    async postToken (@Req() req: Request, @Body() dto: PostTokenReqDto[]) {
        // オペレーターセッション情報を取得
        const operator = await OperatorService.authMe(req);
        applicationLogger.info('access-token:' + req.headers['access-token']);
        // サービス層の処理を実行
        const service = new TokenService();
        const ret = await service.getToken(getConnection('postgres'), operator, dto, req);
        return ret;
    }
}
