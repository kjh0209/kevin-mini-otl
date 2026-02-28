# CHARTER.md

## 1. 이 프로젝트는 무엇인가
kevin-mini-otl 프로젝트는 효율적이고 확장 가능한 서버-사이드 애플리케이션을 구축하기 위한 Node.js 기반의 NestJS 프레임워크를 활용하여 개발된 시스템입니다. 이 프로젝트는 복잡한 백엔드 로직을 관리할 수 있는 견고한 구조를 제공하는 것을 목표로 합니다.

## 2. 기술 스택
- **프레임워크**: NestJS
- **언어**: TypeScript
- **데이터베이스 ORM**: Prisma
- **테스트**: Jest, Supertest
- **컨테이너화**: Docker
- **인증**: Passport, JWT

## 3. 폴더 구조와 역할
- `.gitignore`: Git으로 추적하지 않을 파일 목록
- `.prettierrc`: Prettier 코드 포맷팅 설정 파일
- `docker-compose.yaml`: Docker 컨테이너 설정 파일
- `eslint.config.mjs`: ESLint 설정 파일
- `nest-cli.json`: NestJS CLI 설정 파일
- `package-lock.json`: NPM 패키지 버전 관리 파일
- `package.json`: 프로젝트 종속성 및 스크립트 정의 파일
- `prisma/`: Prisma 관련 스키마 및 마이그레이션 파일
- `src/`: 애플리케이션 소스 코드
- `test/`: 테스트 코드
- `tsconfig.build.json`, `tsconfig.json`: TypeScript 컴파일러 설정 파일

## 4. 현재 구현된 기능 맵
| 기능 | 위치 | 담당 | 이슈 | 상태 |
|------|------|------|------|------|
<!-- TODO: 채워주세요 -->

## 5. 핵심 설계 결정
- **RESTful API 설계**: API는 RESTful 원칙에 따라 설계되었습니다.
- **모듈화 아키텍처**: NestJS의 모듈 시스템을 최대한 활용하여 다양한 기능들을 모듈로 분리하였습니다.
<!-- TODO: 추가적인 설계 결정이 있으면 채워주세요 -->

## 6. 절대 하면 안 되는 것
- **동일 ORM 내 직접 SQL 쿼리 작성 금지** [Guardian이 자동 검사]
- **프레임워크 비대칭성 코드 작성 금지** [Guardian이 자동 검사]: NestJS의 의도와 맞지 않는 방법으로 코드를 작성하지 말 것
- **로깅 없는 예외 무시 금지** [Guardian이 자동 검사]: 예외 사항이 발생했을 때 반드시 로깅 처리할 것

<!-- TODO: 추가 금지할 패턴이 있으면 채워주세요 -->