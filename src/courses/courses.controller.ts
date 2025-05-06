import { Controller, Get, Post, Patch, Delete, Param, Body, Req, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { RequestWithUser } from '../auth/request-with-user.interface';
import { AdminGuard } from '../auth/admin.guard';

@Controller('api/courses')
export class CoursesController {
    constructor(
        private readonly coursesService: CoursesService,
    ) {}

    @Get()
    async getCourses() {
        return this.coursesService.getCourses(null);
    }

    

    @Get('lectures')
    async getLectures(@Query('semesterId') semesterId?: number) {
        return this.coursesService.getLectures(semesterId ? Number(semesterId) : undefined);
      }


    @Get('lectures/:lectureId/reviews')
  async getLectureReviews(@Param('lectureId') lectureId: number) {
    return this.coursesService.getReviewsByLectureId(Number(lectureId));
  }

    @Get('lectures/reviews/:reviewId')
  async getReview(@Param('reviewId') reviewId: number) {
    return this.coursesService.getReviewById(Number(reviewId));
  }

    @UseGuards(JwtAuthGuard)
    @Post('lectures/:lectureId/reviews')
  async createReview(
    @Param('lectureId') lectureId: number,
    @Req() req: RequestWithUser,
    @Body() dto: CreateReviewDto,
  ) {
    return this.coursesService.createReview(Number(lectureId), req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('lectures/:lectureId/reviews/:reviewId')
  async updateReview(
    @Param('reviewId') reviewId: string,
    @Req() req: RequestWithUser,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.coursesService.updateReview(Number(reviewId), req.user.userId, dto);
  }

  @Get(':id') //parameter
    async getCourseById(@Param('id') id: number) {
        return this.coursesService.getCourses(Number(id));
    }

    //test required
    @Get(':courseId/reviews')
    async getReviewsByCourseId(
    @Param('courseId', ParseIntPipe) courseId: number
  ) {
    return this.coursesService.getReviewsByCourseId(courseId);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':courseId/lectures/:lectureId/reviews/:reviewId')
  async deleteReview(
    @Param('courseId') courseId: string,
    @Param('lectureId') lectureId: string,
    @Param('reviewId') reviewId: string,
  ) {
    return this.coursesService.deleteReview(Number(courseId), Number(lectureId), Number(reviewId), true);
  }

  @UseGuards(JwtAuthGuard)
  @Post('lectures/reviews/:reviewId/likes')
  async likeReview(@Param('reviewId') reviewId: string, @Req() req: RequestWithUser) {
    return this.coursesService.likeReview(Number(reviewId), req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('lectures/reviews/:reviewId/likes')
  async unlikeReview(@Param('reviewId') reviewId: string, @Req() req: RequestWithUser) {
    return this.coursesService.unlikeReview(Number(reviewId), req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('lectures/reviews/:reviewId/excuse')
  async reportReview(@Param('reviewId') reviewId: string, @Req() req: RequestWithUser) {
    return this.coursesService.reportReview(Number(reviewId), req.user.userId);
  }

}
