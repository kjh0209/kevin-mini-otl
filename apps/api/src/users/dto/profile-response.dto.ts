import { Department } from '@prisma/client';

export class ProfileResponseDto {
  email: string;
  firstName: string;
  lastName: string;
  major: Department;
  isAdmin: boolean;

  constructor(user: any) {
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.major = user.major;
    this.isAdmin = user.isAdmin;
  }
}
