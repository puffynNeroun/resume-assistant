import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { PrismaService } from '../../prisma/prisma.service';
import toBuffer from 'stream-to-buffer';
import { Readable } from 'stream';
import { GenerateDto } from './dto/generate.dto';
import { buildSmartResumePrompt } from './prompts/resume.prompt';
import { generateStructuredPDF } from './utils/pdf-generator';
import { ParsedResume } from '../../types/parsed-resume.interface';

@Injectable()
export class GenerateService {
  private openai: OpenAI;

  constructor(private prisma: PrismaService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateResume(dto: GenerateDto, userId: string): Promise<Buffer> {
    const finalPrompt = buildSmartResumePrompt(
      dto.fullName,
      dto.email || 'не указан',
      dto.phone,
      dto.location,
      dto.position,
      dto.userPrompt,
    );

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Ты помощник, который генерирует качественные резюме.' },
        { role: 'user', content: finalPrompt },
      ],
    });

    const rawContent = response.choices[0]?.message?.content || '';

    let parsed: ParsedResume;
    try {
      parsed = JSON.parse(rawContent);
    } catch (err) {
      throw new Error('Ошибка разбора JSON от OpenAI: ' + err);
    }

    const pdf = generateStructuredPDF(parsed);

    const resultBuffer: Buffer = await new Promise((resolve, reject) => {
      toBuffer(pdf as unknown as Readable, (err, buffer) => {
        if (err) return reject(err);
        resolve(buffer);
      });
    });

    await this.prisma.resume.create({
      data: {
        userId,
        fullName: dto.fullName,
        email: dto.email || '',
        phone: dto.phone,
        location: dto.location,
        summary: dto.position,
        rawPrompt: finalPrompt,
        rawContent,
      },
    });

    return resultBuffer;
  }
}
