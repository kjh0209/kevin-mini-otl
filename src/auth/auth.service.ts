// JWT 토큰 발급 담당
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async generateTokens(userId: number): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
  
    if (!user) {
      throw new Error('User no found');
    }

    const payload = {
      userId: user.id,
      isAdmin: user.isAdmin,
    };
  
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    });
  
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '30d',
    });
  
    return { accessToken, refreshToken };
  }
  
}
