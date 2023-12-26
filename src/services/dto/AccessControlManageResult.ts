/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { Transform } from 'class-transformer';
import { IsDate, IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { transformToDateTime, transformToNumber } from '../../common/Transform';
/* eslint-enable */

export default class {
    @IsString()
    @IsNotEmpty()
        apiUrl: string;

    @IsString()
    @IsNotEmpty()
        apiMethod: string;

    @IsString()
    @IsNotEmpty()
        apiToken: string;

    @IsString()
    @IsOptional()
        userId: string;

    @IsDate()
    @IsDefined()
    @Transform(({ value }) => { return transformToDateTime(value); })
        expirationDate: Date;

    @IsNumber()
    @IsDefined()
    @Transform(({ value }) => { return transformToNumber(value); })
        blockCode: number;
}
