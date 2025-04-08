// src/resume/resume.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ResumeService } from './resume.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';

@UseGuards(JwtAuthGuard)
@Controller('resume')
export class ResumeController {
    constructor(private readonly resumeService: ResumeService) {}

    @Get()
    findAll(@Request() req) {
        return this.resumeService.findAll(req.user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        return this.resumeService.findOne(id, req.user.userId);
    }

    @Post()
    create(@Body() dto: CreateResumeDto, @Request() req) {
        return this.resumeService.create(dto, req.user.userId);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateResumeDto, @Request() req) {
        return this.resumeService.update(id, dto, req.user.userId);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.resumeService.delete(id, req.user.userId);
    }
}
