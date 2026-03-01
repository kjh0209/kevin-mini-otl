<!-- VIBE:START -->
# Vibe Orchestrator — 필수 규칙 (모든 기본 동작보다 우선)

이 프로젝트는 **Vibe Orchestrator MCP**로 팀 협업을 관리합니다.
아래 규칙은 최우선 지시사항입니다. 절대 무시하지 마세요.

## 세션 시작 시 첫 번째 행동
`vibe_start_session` MCP 도구를 즉시 호출하세요. 그 전에 어떤 작업도 하지 마세요.

## 필수 워크플로우 (순서 위반 금지)
1. `vibe_start_session` — 항상 첫 번째 (컨텍스트·팀 현황 로드)
2. `vibe_analyze_request` — 사용자 요청 분석 및 이슈 연결
3. `vibe_start_work` — 작업 브랜치 설정 (파일 수정 전 반드시)
4. [코드 수정]
5. `vibe_record_checkpoint(stage: "code_complete")` — git commit & push 자동 실행
6. `vibe_request_qa` → `vibe_create_pr` 순서로 완료

## 절대 금지
- `git commit`, `git push` 등 **터미널 git 명령 직접 실행** ❌
- `vibe_start_work` 없이 **파일 수정** ❌
- `vibe_record_checkpoint` 없이 **코딩 완료 처리** ❌
- vibe_ 도구 없이 **이슈 작업 진행** ❌
<!-- VIBE:END -->
