import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // ⬅️ импортируем
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ResumeModule } from './resume/resume.module';
import { GenerateModule } from './generate/generate.module'; // исправил путь

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ⬅️ вот это ключевое
    AuthModule,
    ResumeModule,
    GenerateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
