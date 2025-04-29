// JWT 토큰 발급 담당
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateTokens(userId: number) {
    const accessToken = this.jwtService.sign(
      { sub: userId },
      { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '1h' },
    );

    const refreshToken = this.jwtService.sign(
      { sub: userId },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '30d' },
    );

    return { accessToken, refreshToken };
  }
}
