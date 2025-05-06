import { IsEmail, IsNotEmpty, IsString, IsInt, IsOptional, IsBoolean  } from 'class-validator';

export class SignupUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsInt()
  majorId: number;

  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean = false;
}
