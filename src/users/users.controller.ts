import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LoginUserDto } from './dto/login-user.dto';
import { SignupUserDto } from './dto/signup-user.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { Request } from 'express';

export interface RequestWithUser extends Request {
    user: {
      userId: number;
    };
  }

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<{ message: string; accessToken: string; refreshToken: string }> {
    const { email, password } = loginUserDto;
    const user = await this.usersService.validateUser(email, password);

    if (!user) {
      return { message: 'Invalid credentials', accessToken: '', refreshToken: '' };;
    }

    const tokens = await this.authService.generateTokens(user.id);

    return {
      message: 'Login successful',
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  @Post('signup')
  async signup(
    @Body() signupUserDto: SignupUserDto): Promise<{ message: string; user: any }> {
    const user = await this.usersService.createUser(signupUserDto);
    return {
      message: 'Signup successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        majorId: user.majorId,
      },
    };

    
  }

  @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Req() req: RequestWithUser): Promise<ProfileResponseDto> {

      const user = await this.usersService.findById(Number(req.user.userId));
      return new ProfileResponseDto(user);
}
}