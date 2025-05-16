// src/resume/resume.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ResumeService {
    constructor(private prisma: PrismaService) {}

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

    async create(data: any, userId: string) {
        return this.prisma.resume.create({
            data: {
                ...data,
                user: {
                    connect: { id: userId },
                },
            },
        });
    }


    async update(id: string, data: any, userId: string) {
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
