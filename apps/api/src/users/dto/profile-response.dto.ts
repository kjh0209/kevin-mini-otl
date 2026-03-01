import { Department } from '@prisma/client';

export class ProfileResponseDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  major: Department;
  isAdmin: boolean;

  constructor(user: any) {
    this.id = user.id;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.major = user.major;
    this.isAdmin = user.isAdmin;
  }
}
