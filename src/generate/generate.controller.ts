import { Controller, Post, Body, UseGuards, Request, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GenerateService } from './generate.service';
import { GenerateDto } from './dto/generate.dto';
import { Response } from 'express';
import { AuthRequest } from '../../types/auth-request';

@UseGuards(JwtAuthGuard)
@Controller('generate')
export class GenerateController {
  constructor(private readonly generateService: GenerateService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async generate(@Body() dto: GenerateDto, @Request() req: AuthRequest, @Res() res: Response) {
    const pdfBuffer = await this.generateService.generateResume(dto, req.user.userId);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=resume.pdf',
    });

    res.send(pdfBuffer);
  }
}
