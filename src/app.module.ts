import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaService } from './common/prisma/prisma.service';
import { UsersController } from './users/users.controller';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import { LoggerMiddleware } from './common/middleware/logger.middleware';


@Module({
  controllers: [UsersController],
  providers: [PrismaService, UsersService],
  imports: [AuthModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // 모든 라우트에 적용
  }
}