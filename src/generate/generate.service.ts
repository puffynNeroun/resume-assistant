import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { PrismaService } from '../../prisma/prisma.service';
import { buildSmartResumePrompt } from './prompts/resume.prompt';
import { generateStructuredPDF } from './utils/pdf-generator';
import toBuffer from 'stream-to-buffer';
import { Readable } from 'stream';
import { GenerateDto } from './dto/generate.dto';
import { ParsedResume } from '../../types/parsed-resume.interface';

@Injectable()
export class GenerateService {
  private openai: OpenAI;

  constructor(private prisma: PrismaService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  createPrompt(
      fullName: string,
      email: string,
      phone?: string,
      location?: string,
      position = 'Frontend Developer',
      userPrompt?: string,
  ): string {
    return buildSmartResumePrompt(fullName, email, phone, location, position, userPrompt);
  }

  async callOpenAI(prompt: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Ты помощник, который генерирует качественные резюме.' },
        { role: 'user', content: prompt },
      ],
    });

    return response.choices[0]?.message?.content || '';
  }

  async generateResume(dto: GenerateDto, userId: string): Promise<Buffer> {
    const finalPrompt = this.createPrompt(
        dto.fullName,
        dto.email || 'не указан',
        dto.phone,
        dto.location,
        dto.position,
        dto.userPrompt,
    );

    const rawContent = await this.callOpenAI(finalPrompt);

    let parsed: ParsedResume;
    try {
      parsed = JSON.parse(rawContent);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      throw new Error(`Ошибка разбора JSON от OpenAI: ${message}`);
    }

    const pdfStream = generateStructuredPDF(parsed);
    const pdfBuffer: Buffer = await new Promise((resolve, reject) => {
      toBuffer(pdfStream as unknown as Readable, (err, buffer) => {
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
        summary: parsed.summary || dto.position,

        experience: parsed.experience ?? [],
        education: parsed.education ?? [],
        skills: Array.isArray(parsed.skills)
            ? parsed.skills.map((s) => `${s.name} — ${s.level}`).join(', ')
            : parsed.skills ?? '',

        languages: Array.isArray(parsed.languages)
            ? parsed.languages.map((l) =>
                typeof l === 'string' ? l : `${l.name} — ${l.level}`,
            )
            : [],

        rawPrompt: finalPrompt,
        rawContent,
        template: 'default',
      },
    });


    return pdfBuffer;
  }
}
