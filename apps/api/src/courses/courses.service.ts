import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class CoursesService {
    constructor(private readonly prisma: PrismaService) {}
    async getCourses(courseID?: number|null) {
      if (!courseID) {
        return this.prisma.course.findMany();
      }
      return this.prisma.course.findUnique({
        where: { id: courseID },
      });
    }
    

  async getReviewsByCourseId(courseId: number) {
    return this.prisma.review.findMany({
      where: { lecture: { courseId : courseId }, deletedAt: null},
      include: {
            user: true,
            lecture: true,
          },
    });
  }

  async getLectures(semesterId?: number) {
    const where = semesterId ? { semesterId } : {};
    return this.prisma.lecture.findMany({
      where,
      include: { course: true, professor: true, semester: true },
    });
  }
  
  

  async getReviewsByLectureId(lectureId: number) {
    return this.prisma.review.findMany({
      where: { lectureId, deletedAt: null },
      include: {
        user: true,
        lecture: true,
      },
    });
  }

  async getReviewById(reviewId: number) {
    return this.prisma.review.findFirst({
      where: { id: reviewId, deletedAt: null },
      include: {
        user: true,
        lecture: true,
      },
    });
  }

  async createReview(lectureId: number, userId: number, dto: CreateReviewDto) {
    return this.prisma.review.create({
      data: {
        userId,
        lectureId,
        ...dto,
      },
    });
  }

  async updateReview(reviewId: number, userId: number, dto: UpdateReviewDto) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('Review not found');
    if (review.userId !== userId) throw new ForbiddenException('You can only edit your own review');

    return this.prisma.review.update({
      where: { id: reviewId },
      data: dto,
    });
  }

  async deleteReview(courseId: number, lectureId: number, reviewId: number, isAdmin: boolean) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: { reports: true },
    });
  
    if (!review) throw new NotFoundException('Review not found');
    if (!isAdmin) throw new ForbiddenException('Only admin can delete reviews');
    if (review.reports.length === 0) throw new ForbiddenException('Only reported reviews can be deleted');
  
    // Soft delete by setting deletedAt
    return this.prisma.review.update({
      where: { id: reviewId },
      data: { deletedAt: new Date(), },
    });
  }
  

  async likeReview(reviewId: number, userId: number) {
    return this.prisma.reviewLike.create({
      data: {
        reviewId,
        userId,
      },
    });
  }

  async unlikeReview(reviewId: number, userId: number) {
    return this.prisma.reviewLike.delete({
      where: {
        userId_reviewId: {
          userId,
          reviewId,
        },
      },
    });
  }

  async reportReview(reviewId: number, userId: number) {
    return this.prisma.reviewReport.create({
      data: {
        reviewId,
        userId,
      },
    });
  }
}