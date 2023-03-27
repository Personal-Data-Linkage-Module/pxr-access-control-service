/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { Request } from 'express';
import {
    JsonController, Post, Header, Req, UseBefore, Body} from 'routing-controllers';
import PostCollateReqDto from './dto/PostCollateReqDto';
/* eslint-enable */
import EnableSimpleBackPressure from './backpressure/EnableSimpleBackPressure';
import CollateService from '../services/CollateService';
import CollatePostValidator from './validator/CollatePostValidator';
import OperatorService from '../services/OperatorService';
import { getConnection } from 'typeorm';

@JsonController('/access-control')
export default class CollateController {
    @Post('/collate')
    @Header('X-Content-Type-Options', 'nosniff')
    @Header('X-XSS-Protection', '1; mode=block')
    @Header('X-Frame-Options', 'deny')
    @EnableSimpleBackPressure()
    @UseBefore(CollatePostValidator)
    async postCollate (@Req() req: Request, @Body() dto: PostCollateReqDto) {
        // オペレーターセッション情報を取得
        await OperatorService.authMe(req);
        // サービス層の処理を実行
        const service = new CollateService();
        const retList = await service.matchToken(getConnection('postgres'), dto);
        // 取得したデータから利用者ID、パラメータを取得
        let userID: string = null;
        let parameter: string = null;
        for (let index = 0; index < retList.length; index++) {
            if (dto.target.apiToken === retList[index].token) {
                userID = retList[index].targetUserId;
                parameter = retList[index].parameter;
                break;
            }
        }

        // レスポンスを返す
        return {
            userId: userID,
            parameter: parameter
        };
    }
}
