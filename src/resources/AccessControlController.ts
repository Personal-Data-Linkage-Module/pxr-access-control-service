/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { Request } from 'express';
import {
    JsonController, Post, Body, Header, Req, UseBefore
} from 'routing-controllers';
import PostAccessControlReqDto from './dto/PostAccessControlReqDto';
/* eslint-enable */
import EnableSimpleBackPressure from './backpressure/EnableSimpleBackPressure';
import AccessControlService from '../services/AccessControlService';
import AccessControlPostValidator from './validator/AccessControlPostValidator';
import OperatorService from '../services/OperatorService';
import { getConnection } from 'typeorm';

@JsonController('/access-control')
export default class AccessControlController {
    @Post('/')
    @Header('X-Content-Type-Options', 'nosniff')
    @Header('X-XSS-Protection', '1; mode=block')
    @Header('X-Frame-Options', 'deny')
    @EnableSimpleBackPressure()
    @UseBefore(AccessControlPostValidator)
    async postAccessControl (@Req() req: Request, @Body() dto: PostAccessControlReqDto[]) {
        // オペレーターセッション情報を取得
        const operator = await OperatorService.authMe(req);

        // サービス層の処理を実行
        const service = new AccessControlService();
        const retList = await service.createAccessPermission(getConnection('postgres'), operator, dto);

        // レスポンスを返す
        return retList;
    }
}
