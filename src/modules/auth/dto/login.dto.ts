import { 
    IsEmail, 
    IsNotEmpty, 
    IsOptional, 
    IsString, 
    MaxLength,
    MinLength 
} from "class-validator";

export class LoginDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(20)
    username?: string;

    @IsOptional()
    @IsEmail()
    @IsNotEmpty()
    email?: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    password!: string;
}