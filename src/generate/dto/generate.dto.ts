// src/generate/dto/generate.dto.ts
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GenerateDto {
    @IsString() @IsNotEmpty()
    fullName: string;

    @IsString() @IsOptional()
    email?: string;

    @IsString() @IsOptional()
    phone?: string;

    @IsString() @IsOptional()
    location?: string;

    @IsString() @IsNotEmpty()
    position: string;

    @IsString() @IsOptional()
    userPrompt?: string;
}
