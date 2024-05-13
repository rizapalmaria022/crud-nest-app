import { Role } from '@prisma/client';
import { IsNotEmpty, IsString, IsEmail, Length, IsInt, IsOptional } from 'class-validator';

export class UserDto {
    @IsNotEmpty()
    @IsString()
    public firstname: string;

    @IsNotEmpty()
    @IsString()
    public lastname: string;

    @IsNotEmpty()
    @IsString()
    public username: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    public email: string;


    @IsNotEmpty()
    @IsString()
    public role: Role;

    @IsNotEmpty()
    @IsString()
    @Length(3, 20, { message: 'Passowrd has to be at between 3 and 20 chars' })
    public password: string;
}

export class UserUpdateDto {
    @IsNotEmpty()
    @IsString()
    public firstname: string;

    @IsNotEmpty()
    @IsString()
    public lastname: string;

    @IsNotEmpty()
    @IsString()
    public username: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    public email: string;


    @IsNotEmpty()
    @IsString()
    public role: Role;
}