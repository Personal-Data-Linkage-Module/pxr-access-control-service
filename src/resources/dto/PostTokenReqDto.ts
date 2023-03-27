/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import {
    IsDefined,
    IsString,
    IsNumber,
    ValidateNested,
    IsNotEmpty,
    IsOptional,
    IsArray,
    IsObject,
    IsNotEmptyObject,
    IsIn
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { transformToNumber } from '../../common/Transform';
/* eslint-enable */

export class CodeObject {
    @IsDefined()
    @IsNumber()
    @Transform(transformToNumber)
    _value: number;

    @IsDefined()
    @IsNumber()
    @Transform(transformToNumber)
    _ver: number;
}

export class OperatorObject {
    @IsDefined()
    @IsNumber()
    @Transform(transformToNumber)
    @IsIn([0, 2, 3])
    type: number;

    @Type(() => CodeObject)
    @IsOptional()
    @IsObject()
    @IsNotEmptyObject()
    @ValidateNested()
    app?: CodeObject;

    @IsOptional()
    @IsObject()
    @IsNotEmptyObject()
    @ValidateNested()
    wf?: CodeObject;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    role?: CodeObject[];

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    loginId?: string;

    @IsOptional()
    requestBody: any;
}

export class CallerObject {
    @IsDefined()
    @IsNumber()
    @Transform(transformToNumber)
    blockCode: number;

    @IsString()
    @IsNotEmpty()
    apiUrl: string;

    @IsString()
    @IsNotEmpty()
    @IsIn(['GET', 'POST', 'DELETE', 'PUT'])
    apiMethod: 'GET' | 'POST' | 'DELETE' | 'PUT';

    @Type(() => OperatorObject)
    @IsDefined()
    @ValidateNested()
    @IsObject()
    @IsNotEmptyObject()
    operator: OperatorObject;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    userId?: string;

    @IsOptional()
    requestBody?: any;

    apiCode: string;
}

export class TargetObject {
    @IsOptional()
    @IsNumber()
    @Transform(transformToNumber)
    blockCode: number;

    @IsString()
    @IsNotEmpty()
    apiUrl: string;

    @IsString()
    @IsNotEmpty()
    @IsIn(['GET', 'POST', 'DELETE', 'PUT'])
    apiMethod: 'GET' | 'POST' | 'DELETE' | 'PUT';

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    userId?: string;

    @IsOptional()
    parameter: any;

    @Type(() => CodeObject)
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    _code: CodeObject[];
}

export default class {
    @Type(() => CallerObject)
    @IsDefined()
    @ValidateNested()
    @IsObject()
    @IsNotEmptyObject()
    caller: CallerObject;

    @Type(() => TargetObject)
    @IsDefined()
    @ValidateNested()
    @IsObject()
    @IsNotEmptyObject()
    target: TargetObject;
}
