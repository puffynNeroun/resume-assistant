// src/resume/dto/create-resume.dto.ts
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsArray,
} from 'class-validator';

export class CreateResumeDto {
    @IsNotEmpty()
    @IsString()
    fullName: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsString()
    summary?: string;

    @IsOptional()
    @IsArray()
    experience?: any[]; // Можно позже типизировать

    @IsOptional()
    @IsArray()
    education?: any[];

    @IsOptional()
    @IsString()
    skills?: string;

    @IsOptional()
    @IsArray()
    languages?: any[];

    @IsOptional()
    @IsString()
    template?: string;
}
