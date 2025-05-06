import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Grade } from '@prisma/client';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(Grade)
  grade: Grade;

  @IsEnum(Grade)
  easiness: Grade;

  @IsEnum(Grade)
  lectureEval: Grade;
}
