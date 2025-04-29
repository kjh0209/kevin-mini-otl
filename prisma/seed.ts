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
      { nameKr: '슬기로운 대학원 생활', nameEn: 'Smart Grad Life', code: '445', type: 'Lecture', credit: 3, departmentId: dept.EE },
      { nameKr: '편하게 군대 다녀오기', nameEn: 'Easy Military Service', code: '210', type: 'Lecture', credit: 3, departmentId: dept.EE },
      { nameKr: '스팍스에서 디자이너로 살아남기', nameEn: 'How to Survive as Designer in SPARCS', code: '312', type: 'Lecture', credit: 3, departmentId: dept.ID },
      { nameKr: '피그마 개론 1', nameEn: 'Figma Intro 1', code: '320', type: 'Lecture', credit: 3, departmentId: dept.ID},
      { nameKr: '피그마 개론 심화 2', nameEn: 'Figma Intro Advanced 2', code: '330', type: 'Lecture', credit: 3, departmentId: dept.ID},
      { nameKr: '우당탕탕 자취개론', nameEn: 'Introduction to the wild and wild life of a single person', code: '201', type: 'Lecture', credit: 3, departmentId: dept.BTM},
      { nameKr: '자바스크립트 개론', nameEn: 'Introduction to javascript', code: '200', type: 'Lecture', credit: 3, departmentId: dept.CS},  
      { nameKr: '타입스크립트 개론', nameEn: 'Introduction to typescript', code: '300', type: 'Lecture', credit: 3, departmentId: dept.CS}
    ],
  });

  // --- Step 4: Semester 데이터 추가 ---
  const spring2025 = await prisma.semester.create({
    data: { year: 2025, season: 'SPRING' },
  });

  const fall2025 = await prisma.semester.create({
    data: { year: 2025, season: 'FALL' },
  });


// --- Step 6: 여러 Lecture 데이터 추가 ---

async function fetchCoursesAndProfessors(spring2025: { id: number }, fall2025: { id: number }) {
  const [
    PM,
    TS,
    OTL,
    BREAK,
    GradArmy,
    HappyGrad,
    SmartGrad,
    EasyArmy,
    SparcsDesigner,
    Figma1,
    Figma2,
    SelfLiving,
    JS_intro,
    TS_intro
  ] = await Promise.all([
    prisma.course.findFirst({ where: { code: '203' } }),
    prisma.course.findFirst({ where: { code: '200' } }),
    prisma.course.findFirst({ where:  { code: '330', departmentId: dept.CS } }),
    prisma.course.findFirst({ where: { code: '442' } }),
    prisma.course.findFirst({ where: { code: '327' } }),
    prisma.course.findFirst({ where: { code: '444' } }),
    prisma.course.findFirst({ where: { code: '445' } }),
    prisma.course.findFirst({ where: { code: '210' } }),
    prisma.course.findFirst({ where: { code: '312' } }),
    prisma.course.findFirst({ where: { code: '320' } }),
    prisma.course.findFirst({ where: { code: '330' , departmentId: dept.ID } }),
    prisma.course.findFirst({ where:  { code: '201', departmentId: dept.BTM } }),
    prisma.course.findFirst({ where:  { code: '200', departmentId: dept.CS } }),
    prisma.course.findFirst({ where:  { code: '300', departmentId: dept.CS } })
    
    
  ]);
  
  const [
      larry,
      platypus,
      tom,
      yumyum,
      duncan,
      april,
    ] = await Promise.all([
      prisma.professor.findFirst({ where: { name: 'larry' } }),
      prisma.professor.findFirst({ where: { name: 'platypus' } }),
      prisma.professor.findFirst({ where: { name: 'tom' } }),
      prisma.professor.findFirst({ where: { name: 'yumyum' } }),
      prisma.professor.findFirst({ where: { name: 'duncan' } }),
      prisma.professor.findFirst({ where: { name: 'april' } }),
    ]);
  
    await prisma.lecture.create({ data: { courseId: PM!.id, professorId: yumyum!.id, semesterId: spring2025.id, startTime: '10:30', endTime: '12:00', lectureDays: { create: [{ dayOfWeek: 'Mon' }, { dayOfWeek: 'Wed' }] } }});
    await prisma.lecture.create({ data: { courseId: PM!.id, professorId: yumyum!.id, semesterId: fall2025.id, startTime: '10:30', endTime: '12:00', lectureDays: { create: [{ dayOfWeek: 'Mon' }, { dayOfWeek: 'Wed' }] } }});
    await prisma.lecture.create({ data: { courseId: TS!.id, professorId: tom!.id, semesterId: spring2025.id, startTime: '13:00', endTime: '14:30', lectureDays: { create: [{ dayOfWeek: 'Tue' }, { dayOfWeek: 'Thu' }] } }});
    await prisma.lecture.create({ data: { courseId: TS!.id, professorId: tom!.id, semesterId: fall2025.id, startTime: '13:00', endTime: '14:30', lectureDays: { create: [{ dayOfWeek: 'Tue' }, { dayOfWeek: 'Thu' }] } }});
    await prisma.lecture.create({ data: { courseId: OTL!.id, professorId: platypus!.id, semesterId: spring2025.id, startTime: '10:30', endTime: '12:00', lectureDays: { create: [{ dayOfWeek: 'Mon' }, { dayOfWeek: 'Wed' }] } }});
    await prisma.lecture.create({ data: { courseId: OTL!.id, professorId: platypus!.id, semesterId: fall2025.id, startTime: '10:30', endTime: '12:00', lectureDays: { create: [{ dayOfWeek: 'Mon' }, { dayOfWeek: 'Wed' }] } }});
    await prisma.lecture.create({ data: { courseId: BREAK!.id, professorId: larry!.id, semesterId: spring2025.id, startTime: '13:00', endTime: '14:30', lectureDays: { create: [{ dayOfWeek: 'Tue' }, { dayOfWeek: 'Thu' }] } }});
    await prisma.lecture.create({ data: { courseId: BREAK!.id, professorId: larry!.id, semesterId: fall2025.id, startTime: '13:00', endTime: '14:30', lectureDays: { create: [{ dayOfWeek: 'Tue' }, { dayOfWeek: 'Thu' }] } }});
    await prisma.lecture.create({ data: { courseId: GradArmy!.id, professorId: duncan!.id, semesterId: spring2025.id, startTime: '10:30', endTime: '12:00', lectureDays: { create: [{ dayOfWeek: 'Tue' }, { dayOfWeek: 'Thu' }] } }});
    await prisma.lecture.create({ data: { courseId: GradArmy!.id, professorId: duncan!.id, semesterId: fall2025.id, startTime: '10:30', endTime: '12:00', lectureDays: { create: [{ dayOfWeek: 'Tue' }, { dayOfWeek: 'Thu' }] } }});
    await prisma.lecture.create({ data: { courseId: EasyArmy!.id, professorId: larry!.id, semesterId: spring2025.id, startTime: '10:30', endTime: '12:00', lectureDays: { create: [{ dayOfWeek: 'Tue' }, { dayOfWeek: 'Thu' }] } }});
    await prisma.lecture.create({ data: { courseId: EasyArmy!.id, professorId: larry!.id, semesterId: fall2025.id, startTime: '10:30', endTime: '12:00', lectureDays: { create: [{ dayOfWeek: 'Tue' }, { dayOfWeek: 'Thu' }] } }});
    await prisma.lecture.create({ data: { courseId: SparcsDesigner!.id, professorId: yumyum!.id, semesterId: spring2025.id, startTime: '14:30', endTime: '16:00', lectureDays: { create: [{ dayOfWeek: 'Mon' }, { dayOfWeek: 'Wed' }] } }});
    await prisma.lecture.create({ data: { courseId: SparcsDesigner!.id, professorId: yumyum!.id, semesterId: fall2025.id, startTime: '14:30', endTime: '16:00', lectureDays: { create: [{ dayOfWeek: 'Mon' }, { dayOfWeek: 'Wed' }] } }});
    await prisma.lecture.create({ data: { courseId: SelfLiving!.id, professorId: april!.id, semesterId: fall2025.id, startTime: '14:30', endTime: '16:00', lectureDays: { create: [{ dayOfWeek: 'Mon' }, { dayOfWeek: 'Wed' }] } }});
    await prisma.lecture.create({ data: { courseId: TS_intro!.id, professorId: platypus!.id, semesterId: fall2025.id, startTime: '14:30', endTime: '16:00', lectureDays: { create: [{ dayOfWeek: 'Tue' }, { dayOfWeek: 'Thu' }] } }});
    await prisma.lecture.create({ data: { courseId: JS_intro!.id, professorId: april!.id, semesterId: spring2025.id, startTime: '14:30', endTime: '16:00', lectureDays: { create: [{ dayOfWeek: 'Tue' }, { dayOfWeek: 'Thu' }] } }});
    await prisma.lecture.create({ data: { courseId: Figma1!.id, professorId: yumyum!.id, semesterId: spring2025.id, startTime: '13:00', endTime: '14:30', lectureDays: { create: [{ dayOfWeek: 'Mon' }, { dayOfWeek: 'Wed' }] } }});
    await prisma.lecture.create({ data: { courseId: Figma2!.id, professorId: yumyum!.id, semesterId: fall2025.id, startTime: '13:00', endTime: '14:30', lectureDays: { create: [{ dayOfWeek: 'Mon' }, { dayOfWeek: 'Wed' }] } }});
    await prisma.lecture.create({ data: { courseId: HappyGrad!.id, professorId: duncan!.id, semesterId: spring2025.id, startTime: '13:00', endTime: '16:00', lectureDays: { create: [{ dayOfWeek: 'Fri' }] } }});
    await prisma.lecture.create({ data: { courseId: SmartGrad!.id, professorId: duncan!.id, semesterId: fall2025.id, startTime: '13:00', endTime: '16:00', lectureDays: { create: [{ dayOfWeek: 'Fri' }] } }});
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
