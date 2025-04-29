import { Controller, Get, Post, Patch, Delete, Param } from '@nestjs/common';
import { CoursesService } from './courses.service';


@Controller('api/courses')
export class CoursesController {
    constructor(
        private readonly coursesService: CoursesService,
    ) {}

    @Get()
    async getCourses() {
        return this.coursesService.getCourses(null);
    }

    @Get(':id') //parameter
    async getCourseById(@Param('id') id: number) {
        return this.coursesService.getCourses(id);
    }
}
