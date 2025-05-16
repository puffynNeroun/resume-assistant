// src/resume/resume.module.ts
import { Module } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { ResumeController } from './resume.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { GenerateModule } from '../generate/generate.module'; 

@Module({
    imports: [GenerateModule],
    controllers: [ResumeController],
    providers: [ResumeService, PrismaService],
})
export class ResumeModule {}
