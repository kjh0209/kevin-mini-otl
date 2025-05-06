import { Controller, Get } from '@nestjs/common';
import { SemestersService } from './semesters.service';

@Controller('api/semesters')
export class SemestersController {
  constructor(private readonly semestersService: SemestersService) {}

  @Get()
  async getSemesters() {
    return this.semestersService.getCurrentSemester();
  }
}
