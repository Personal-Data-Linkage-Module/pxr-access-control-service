/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { Type } from 'class-transformer';
import {
    IsDefined,
    IsIn,
    IsNotEmpty,
    IsNotEmptyObject,
    IsObject,
    IsString,
    ValidateNested
} from 'class-validator';
/* eslint-enable */

export class CallerObject {
    @IsString()
    @IsNotEmpty()
    apiUrl: string;
}

export class TargetObject {
    @IsString()
    @IsNotEmpty()
    apiUrl: string;

    @IsString()
    @IsNotEmpty()
    @IsIn(['GET', 'POST', 'DELETE', 'PUT'])
    apiMethod: string;

    @IsString()
    @IsNotEmpty()
    apiToken: string;
}

export default class PostCollateReqDto {
    @Type(type => CallerObject)
    @IsDefined()
    @IsObject()
    @IsNotEmptyObject()
    @ValidateNested()
    caller: CallerObject;

    @Type(type => TargetObject)
    @IsDefined()
    @IsObject()
    @IsNotEmptyObject()
    @ValidateNested()
    target: TargetObject;
}
