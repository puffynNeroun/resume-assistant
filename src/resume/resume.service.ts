    import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
    import { PrismaService } from '../../prisma/prisma.service';
    import { GenerateService } from '../generate/generate.service';
    import { CreateResumeDto } from './dto/create-resume.dto';
    import { UpdateResumeDto } from './dto/update-resume.dto';
    import { ParsedResume } from '../../types/parsed-resume.interface';

    @Injectable()
    export class ResumeService {
        constructor(
            private prisma: PrismaService,
            private generateService: GenerateService,
        ) {}

        async findAll(userId: string) {
            return this.prisma.resume.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
            });
        }

        async findOne(id: string, userId: string) {
            const resume = await this.prisma.resume.findUnique({ where: { id } });

            if (!resume) throw new NotFoundException('Резюме не найдено');
            if (resume.userId !== userId) throw new ForbiddenException('Нет доступа к этому резюме');

            return resume;
        }

        async create(data: CreateResumeDto, userId: string) {
            const dto = {
                fullName: data.fullName,
                email: data.email,
                phone: data.phone,
                location: data.location,
                position: data.summary || 'Frontend Developer',
                userPrompt: '', // в будущем можно прокинуть из формы
            };

            const prompt = this.generateService.createPrompt(
                dto.fullName,
                dto.email,
                dto.phone,
                dto.location,
                dto.position,
                dto.userPrompt
            );

            const content = await this.generateService.callOpenAI(prompt);

            let parsed: ParsedResume;
            try {
                parsed = JSON.parse(content);
            } catch (e) {
                throw new Error('Невозможно разобрать JSON-ответ от OpenAI');
            }

            return this.prisma.resume.create({
                data: {
                    userId,
                    fullName: dto.fullName,
                    email: dto.email || '',
                    phone: dto.phone,
                    location: dto.location,
                    summary: parsed.summary || dto.position,

                    experience: parsed.experience && Array.isArray(parsed.experience)
                        ? parsed.experience
                        : parsed.projects ?? [],

                    education: typeof parsed.education === 'string'
                        ? [{ institution: parsed.education }]
                        : parsed.education ?? [],

                    skills: Array.isArray(parsed.skills)
                        ? parsed.skills.map(s => `${s.name} — ${s.level}`).join(', ')
                        : parsed.skills ?? '',

                    languages: Array.isArray(parsed.languages)
                        ? parsed.languages.map(l => typeof l === 'string' ? l : `${l.name} — ${l.level}`)
                        : [],

                    rawPrompt: prompt,
                    rawContent: content,
                    template: 'default',
                },
            });


        }

        async update(id: string, data: UpdateResumeDto, userId: string) {
            const resume = await this.prisma.resume.findUnique({ where: { id } });

            if (!resume) throw new NotFoundException('Резюме не найдено');
            if (resume.userId !== userId) throw new ForbiddenException('Нет доступа к этому резюме');

            return this.prisma.resume.update({
                where: { id },
                data,
            });
        }

        async delete(id: string, userId: string) {
            const resume = await this.prisma.resume.findUnique({ where: { id } });

            if (!resume) throw new NotFoundException('Резюме не найдено');
            if (resume.userId !== userId) throw new ForbiddenException('Нет доступа к этому резюме');

            await this.prisma.resume.delete({ where: { id } });

            return { message: 'Резюме удалено' };
        }
    }
