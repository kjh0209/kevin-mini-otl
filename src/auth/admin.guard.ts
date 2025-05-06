import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 실제 관리자 여부는 DB 조회 또는 isAdmin 필드로 판단
    if (!user?.isAdmin) {
      throw new ForbiddenException('관리자만 접근 가능합니다.');
    }

    return true;
  }
}
