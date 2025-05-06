// 유저 찾기 + 비밀번호 검증
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
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

}
