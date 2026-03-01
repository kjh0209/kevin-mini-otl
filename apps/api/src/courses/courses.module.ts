import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { PrismaService } from '../common/prisma/prisma.service';

@Module({
  controllers: [CoursesController],
  providers: [PrismaService, CoursesService]
})
export class CoursesModule {}
