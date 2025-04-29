import { IsEmail, IsNotEmpty, IsString, IsInt } from 'class-validator';

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
}
