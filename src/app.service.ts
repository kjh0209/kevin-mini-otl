import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prismaClient: PrismaService) {}
  getHello(): string {
    return 'Hello World!';
  }
  async getProducts() {
    return await this.prismaClient.course.findMany();
  }
}
