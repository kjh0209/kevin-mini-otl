// 유저 찾기 + 비밀번호 검증
import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

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
  
}
