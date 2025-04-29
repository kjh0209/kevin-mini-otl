import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class CoursesService {
    constructor(private readonly prisma: PrismaService) {}
    async getCourses(courseID: number | null) {
        if (courseID === null) {            
            return this.prisma.course.findMany();
        }
        return this.prisma.course.findUnique({where: { id: Number(courseID) }});
    }
}
