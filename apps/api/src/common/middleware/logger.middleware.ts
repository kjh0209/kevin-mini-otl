// 모든 API 요청을 가로채서 로깅
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    if (process.env.NODE_ENV === 'development') {
      this.logger.log(`${req.method} ${req.originalUrl} has been executed`);
    }
    next();
  }
}
