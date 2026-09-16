# RECONERS Landing Page

B2B 웹·앱 크로스플랫폼 개발 기업 "리커너스" 원페이지 랜딩. 브랜드명은 영문(RECONERS), 본문 콘텐츠는 한글.

## 레퍼런스 취득 경로

Figma 파일 `BrVaTxFSnaAlv6IT2ZRvhs`, node `184:3` ("MORRIS" 최상위 프레임). 사용자가 처음 준 URL의
`node-id=178-2945`는 해당 파일에 존재하지 않아 폐기하고, 사용자가 재확인해준 `184:3`을 정본으로 사용.

1. `get_design_context(nodeId="184:3", forceCode=true)`로 섹션별 실측 x/y/width/height, 폰트, 색상이 포함된
   React/Tailwind 참조 코드를 받았습니다. 응답이 길어 한 번에 잘렸지만, 히어로부터 푸터까지 전 섹션
   (9개 섹션 + 푸터) 구조는 잘림 이전에 모두 확보했습니다.
2. `download_assets`로 히어로 영상 프레임, 대시보드 스크린샷, 기술 스택 로고 6종(Notion/Claude/Figma/
   React+Next.js/AWS/Node.js), 기능 카드 이미지 3종(Notion 관리 화면/브랜딩/클라우드), 섹션 배경 이미지
   2종, 장식용 벡터 3종을 실제 다운로드해 `assets/images/`에 저장했습니다 — 플레이스홀더 색상 금지 규칙에
   따라 전부 실제 에셋입니다.
3. 포트폴리오(뷰노/모두의 통근/삼미스피커/쇼:크립트/서울포레스트/청소용병/디플리) 섹션은 Figma 원본 자체가
   영상 슬롯을 회색(`#b2b2b2`) 빈 박스로 두고 있어 (`Container` 노드 안 `Video`가 비어 있음), 그 실측 색을
   그대로 `--rc-placeholder-video`로 사용했습니다. 이건 "레퍼런스에 이미지가 없을 때"의 정당한 예외입니다.

## 그리드 (가장 신경 쓴 부분)

| 섹션 | 컨테이너 | 근거 |
|---|---|---|
| Hero | full-bleed 1920×1080 | 컨텐츠 offset left 120px, 폭 1680px → `.container--rc` (max-width 1680px) 신규 정의 |
| Statement | full-bleed → 1680 | 동일 offset 120/1920 |
| Mid statement | full-bleed → 중앙 정렬 | 실측 폭 1250px, 중앙 정렬로 근사 |
| Pill row | full-bleed → 중앙 정렬 | 실측 폰트 88px 그대로 clamp() 상한값 사용 |
| Showcase | 1816px | Container 실측 1816px |
| Tech stack | full-bleed, 로고 375×492 | 로고 타일 실측 비율 그대로(≈0.762:1) 유지 |
| Portfolio | full-bleed, 아이템 636px | 정적 가로 스크롤 행 — **캐러셀 화살표 내비게이션은 하드 룰에 따라 제외** |
| Feature cards | 1816px 컨테이너, 카드 1696px | 3장 스택, padding 80px 실측 |
| Footer | full-bleed, 패딩 60px | nav 컬럼 4개, CTA 88px 실측 |

기존 디자인 킷의 `--container-wide`(1600px)가 실측(1680px)보다 좁아, 임의로 좁히지 않고
`.container--rc`(1680px)/`.container--rc-lg`(1816px)를 site.css에 새로 정의해 사용했습니다
(1440px 등 킷 기본값을 쓰면 grid fidelity 규칙 위반이라 판단).

## 색상 (실측값 그대로, 회색조 토큰화 금지)

`css/site.css`에 `--rc-*` 커스텀 프로퍼티로 선언:

- 네이비 `#071438` (배경 다수), 뮤트 네이비 `#384773` (statement 헤딩)
- 그린 `#00c47c` (2번째 기능 카드)
- 옐로우 `#ffe83a` (문장 끝 마침표 포인트)
- 블루 `#1557f3` ("비즈니스 자산" 강조), 라이트 블루 `#d6e4ff` ("Notion" 강조)
- 포트폴리오 영상 슬롯 그레이 `#b2b2b2` (Figma 원본 그대로)

한 가지 근사치: statement 섹션 본문 문단은 Figma 원본에서 `color:#111`, `opacity:30%`로 반환되었는데,
이 섹션의 실제 배경은 네이비(`#071438`)라 그대로 적용하면 텍스트가 사실상 보이지 않습니다. 스크린샷에서도
해당 문단은 옅은 회백색으로 보여, 실측 의도(저채도 반투명 텍스트)를 살리되 대비를 위해
`rgba(255,255,255,.55)`로 근사했습니다 — 색상 자체를 지어낸 것이 아니라 명도/대비만 반전한 것입니다.

## 버튼 제거 (사용자 명시 지시)

전체 페이지에서 클릭 가능한 버튼/CTA는 **"문의하기" 단 하나**만 남겼습니다.

- 상단 nav의 "문의하기"만 `.rc-btn` 버튼(→ `#contact`)으로 유지.
- 푸터 "문의하기" 컬럼 헤딩 아래에 실제 버튼(`mailto:hello@reconers.com`)을 추가.
- 제거한 것: 푸터의 "회사소개서" 다운로드 버튼+아이콘, "인스타그램" 링크+아이콘.
- 유지한 것(버튼이 아닌 텍스트/링크로 판단): 프로젝트/회사소개/구성원 nav 라벨, 프로젝트 하위 리스트
  (전체/모바일앱/반응형 웹사이트/브랜딩), 문의하기 하위 리스트(프로젝트 문의/채용 문의는 버튼 스타일이
  아니므로 순수 텍스트로 남겨 중복 버튼을 만들지 않음), 개인정보처리방침/이용약관/쿠키정책 법적 링크.
- 반응형/모바일/앱제작 pill들은 버튼이 아닌 태그(순수 `<span>`, href 없음)로 구현.

## 반응형

레퍼런스는 1920px 데스크톱 전용 디자인이라, 실측 px 값을 `clamp()`의 상한으로 두고 `vw` 기반으로
축소되도록 fluid 처리했습니다 (noksu-landing과 동일한 접근: 데스크톱 실측값을 그대로 유지하되 작은
화면에서는 비례 축소). 포트폴리오/기술스택 로고 행은 가로 스크롤로 오버플로우를 흡수합니다(화살표
버튼 없이 스와이프/스크롤만 지원 — 캐러셀 금지 규칙 준수).

## 스택

- `index.html` — 시맨틱 마크업, variant/layout 주석 포함
- `css/styles.css` — 공유 디자인 킷 (불변, 다른 sibling과 100% 동일)
- `css/site.css` — RECONERS 브랜드 토큰 + 컴포넌트
- `js/main.js` — 스티키 nav + 스크롤 reveal (캐러셀/자동재생 등 JS 애니메이션 라이브러리 없음)
- `.github/workflows/deploy.yml` — GitHub Pages 배포 (Actions, noksu-landing과 동일 패턴)

## 참고

`get_motion_context` 호출은 생략했습니다 — 레퍼런스의 모션은 `motion/react`의 단순 컨테이너 요소
등장 정도로, 이미 구현한 CSS `data-reveal` + IntersectionObserver 페이드인으로 동등하게 표현되며
별도 JS 애니메이션 라이브러리를 추가하지 않는다는 하드 룰에 부합합니다.
