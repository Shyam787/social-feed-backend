import { IsInt, IsOptional, Max, Min } from "class-validator";
import { Type } from "class-transformer";


export class PaginationQueryDto {

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1; // prevents invalid pagination

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    limit: number = 10; 

}