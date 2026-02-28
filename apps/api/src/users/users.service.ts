// 유저 찾기 + 비밀번호 검증
import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignupUserDto } from './dto/signup-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }

  async createUser(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    majorId: number;
    isAdmin?: boolean;
  }) {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        majorId: data.majorId,
        isAdmin: data.isAdmin || false,
      },
    });

    return user;
  }

  async findById(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        major: true, // 전공 정보 포함
      },
    });
  }
 
  async getLikedReviews(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        reviewLikes: {
          where: { review: {deletedAt: null} },
          include: {
            review: {
              include: {
                lecture: true,
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');

    // 좋아요한 리뷰만 추출
    return user.reviewLikes.map((like) => like.review);
  }

  async getTimetables(userId: number) {
    return this.prisma.timetable.findMany({
      where: { userId, deletedAt: null },
      include: { entries: true },
    });
  }

  async createTimetable(userId: number) {
    const currentSemester = await this.getCurrentSemester();
    if (!currentSemester) {
      throw new NotFoundException('Current semester not found');
    }
    return this.prisma.timetable.create({
      data: {
        userId,
        semesterId: currentSemester.id,
      },
    });
  }

  async addLectureToTimetable(userId: number, timetableId: number, lectureId: number) {
    const timetable = await this.prisma.timetable.findFirst({
      where: { id: timetableId, userId, deletedAt: null }, include: { entries: { include: { lecture: { include: { lectureDays: true } } } } },
    });
    if (!timetable) throw new NotFoundException('Timetable not found');

    const lectureToAdd = await this.prisma.lecture.findFirst({
      where: { id: lectureId, semesterId: timetable.semesterId, deletedAt: null }, include: { lectureDays: true },
    });
    if (!lectureToAdd) throw new ForbiddenException('Lecture is not in the current semester');
    const newStart = parseTime(lectureToAdd.startTime);
    const newEnd = parseTime(lectureToAdd.endTime);

    for (const entry of timetable.entries) {
      if (entry.removedfromTimetableAt) continue; // 이미 삭제된 강의는 무시
      const existingLecture = entry.lecture;
      const existingStart = parseTime(existingLecture.startTime);
      const existingEnd = parseTime(existingLecture.endTime);
      for (const newDay of lectureToAdd.lectureDays) {
        if (existingLecture.lectureDays.some(d => d.dayOfWeek === newDay.dayOfWeek)) {
         const overlap =
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd);

        if (overlap) {
        throw new ConflictException(
          `Time conflict with existing lecture on ${newDay.dayOfWeek}`,
        );
        }
      }
    }
  }
  function parseTime(timeStr: string): Date {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0); // 시, 분, 초, 밀리초
    return date;
  }

  for (const entry of timetable.entries) {
    if (entry.lectureId === lectureId) {
      entry.removedfromTimetableAt = null; // 복원 처리
      return this.prisma.timetableEntry.update({
        where: {
          timetableId_lectureId: { timetableId, lectureId },
        },
        data: {
          removedfromTimetableAt: null,
        },
      });
  }
  }
    return this.prisma.timetableEntry.create({
      data: {
        timetableId,
        lectureId,
        removedfromTimetableAt: null,
      },
    });
  }

  async removeLectureFromTimetable(userId: number, timetableId: number, lectureId: number) {
    const entry = await this.prisma.timetableEntry.findFirst({
      where: {
        timetableId,
        lectureId,
        timetable: { userId, deletedAt: null },
      },
    });

    if (!entry) throw new NotFoundException('Lecture not found in timetable');

    // Soft delete 처리
    return this.prisma.timetable.update({
      where: { id: timetableId },
      data: {
        entries: {
          updateMany: {
            where: { lectureId },
            data: { removedfromTimetableAt: new Date() },
          },
        },
      },
    });
  }

  async getTimetableDetail(userId: number, timetableId: number) {
    const timetable = await this.prisma.timetable.findFirst({
      where: { id: timetableId, userId, deletedAt: null },
      include: {
        entries: {
          where: { removedfromTimetableAt: null },
          include: {
            lecture: {
              include: {
                course: true,
                professor: true,
                semester: true,
              },
            },
          },
        },
      },
    });
    if (!timetable) throw new NotFoundException('Timetable not found');
    return timetable;
  }

  private async getCurrentSemester() {
    const now = new Date();
    const month = now.getMonth() + 1;

    let season;
    if (3 <= month && month <= 6) season = 'SPRING';
    else if (9 <= month && month <= 12) season = 'FALL';
    else throw new NotFoundException('No semester for current date');

    return await this.prisma.semester.findFirst({
      where: { year: now.getFullYear(), season },
    });
  }

}
