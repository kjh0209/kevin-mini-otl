import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { Season } from '@prisma/client';

@Injectable()
export class SemestersService {
  constructor(private readonly prisma: PrismaService) {}

  async getCurrentSemester() {
    const now = new Date();
    const month = now.getMonth() + 1; // 1월이 0으로 시작하므로 +1

    let season: Season;
    if (3 <= month && month <= 6) {
      season = Season.SPRING;
    } else if (9 <= month && month <= 12) {
      season = Season.FALL;
    } else {
      return ["현재는 방학 기간입니다."];
    }

    const semester = await this.prisma.semester.findFirst({
      where: {
        year: now.getFullYear(),
        season,
      },
    });

    if (!semester) {
      throw new NotFoundException('해당하는 학기가 존재하지 않습니다.');
    }

    return semester;
  }
}
