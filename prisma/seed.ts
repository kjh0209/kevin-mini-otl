import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // --- Step 1: Department 데이터 추가 ---
  await prisma.department.createMany({
    data: [
      { id: 1, nameKr: '기계공학과', nameEn: 'Mechanical Engineering', code: 'ME' },
      { id: 2, nameKr: '전기및전자공학부', nameEn: 'Electrical Engineering', code: 'EE' },
      { id: 3, nameKr: '기술경영학부', nameEn: 'Business Technology Management', code: 'BTM' },
      { id: 4, nameKr: '산업디자인학과', nameEn: 'Industrial Design', code: 'ID' },
      { id: 5, nameKr: '산업및시스템공학과', nameEn: 'Industrial & Systems Engineering', code: 'IE' },
      { id: 6, nameKr: '융합인재학부', nameEn: 'Transdisciplinary Studies', code: 'TS' },
      { id: 7, nameKr: '전산학부', nameEn: 'Computer Science', code: 'CS' },
    ],
  });

  const dept = {
    EE: 2,
    BTM: 3,
    CS: 7,
    ID: 4,
    TS: 6,
    IE: 5,
  };

  // --- Step 2: Professor 데이터 추가 ---
  await Promise.all([
    prisma.professor.create({
      data: {
        name: 'larry',
        departments: { create: [{ departmentId: dept.EE }, { departmentId: dept.BTM }] },
      },
    }),
    prisma.professor.create({
      data: {
        name: 'platypus',
        departments: { create: [{ departmentId: dept.CS }, { departmentId: dept.ID }] },
      },
    }),
    prisma.professor.create({
      data: {
        name: 'tom',
        departments: { create: [{ departmentId: dept.TS }, { departmentId: dept.CS }] },
      },
    }),
    prisma.professor.create({
      data: {
        name: 'yumyum',
        departments: { create: [{ departmentId: dept.CS }, { departmentId: dept.ID }] },
      },
    }),
    prisma.professor.create({
      data: {
        name: 'duncan',
        departments: { create: [{ departmentId: dept.CS }, { departmentId: dept.EE }] },
      },
    }),
    prisma.professor.create({
      data: {
        name: 'april',
        departments: { create: [{ departmentId: dept.IE }, { departmentId: dept.CS }] },
      },
    }),
  ]);

  // --- Step 3: Course 데이터 추가 ---
  await prisma.course.createMany({
    data: [
      { nameKr: 'PM의 역할과 이해', nameEn: 'Understanding PM Roles', code: '203', type: 'Lecture', credit: 3, departmentId: dept.ID },
      { nameKr: '융합형 인재 개론', nameEn: 'Introduction to TS', code: '200', type: 'Lecture', credit: 3, departmentId: dept.TS },
      { nameKr: 'OTL에서 기술 리더로 살아남는 법', nameEn: 'Surviving as Tech Leader', code: '330', type: 'Lecture', credit: 3, departmentId: dept.CS },
      { nameKr: '알차게 휴학하는 방법', nameEn: 'Effective Leave Strategy', code: '442', type: 'Lecture', credit: 3, departmentId: dept.BTM },
      { nameKr: '대학원 진학과 군문제 해결', nameEn: 'Graduate & Military Issues', code: '327', type: 'Lecture', credit: 3, departmentId: dept.EE },
      { nameKr: '즐거운 대학원 생활', nameEn: 'Enjoying Graduate School', code: '444', type: 'Lecture', credit: 3, departmentId: dept.EE },
    ],
  });

  // --- Step 4: Semester 데이터 추가 ---
  const spring2025 = await prisma.semester.create({
    data: { year: 2025, season: 'SPRING' },
  });

  const fall2025 = await prisma.semester.create({
    data: { year: 2025, season: 'FALL' },
  });

  // --- Step 5: Lecture 데이터 추가 (교수 + 과목 + 학기 + 시간) ---
  const pmCourse = await prisma.course.findFirst({ where: { code: '203' } });
  const yumyumProfessor = await prisma.professor.findFirst({ where: { name: 'yumyum' } });

  await prisma.lecture.create({
    data: {
      courseId: pmCourse!.id,
      professorId: yumyumProfessor!.id,
      semesterId: spring2025.id,
      startTime: '10:30',
      daysOfWeek: 'Mon,Wed',
    },
  });

  // 여기에 추가로 다른 과목, 교수에 대한 Lecture들도 계속 생성할 수 있음
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
