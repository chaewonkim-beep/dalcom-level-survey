/* 결과 계산 로직 검증 스크립트 (npm run verify) */
import { calculateResult } from '../src/lib/calculateResult';
import { MAX_TOTAL_SCORE } from '../src/config/survey.config';
import { LEVEL_2_CRITERIA } from '../src/config/result.config';
import type { AgeGroup, Answers, SurveyResult } from '../src/types/survey';

const build = (age: string, choices: Record<number, 'A' | 'B'>): Answers => {
  const a: Answers = { 1: age as never };
  for (let id = 2; id <= 11; id++) a[id] = choices[id] ?? 'A';
  return a;
};
const allB: Record<number, 'A' | 'B'> = {};
for (let i = 2; i <= 11; i++) allB[i] = 'B';

let pass = 0, fail = 0;
const check = (name: string, got: SurveyResult, want: Partial<SurveyResult>) => {
  const ok = Object.entries(want).every(([k, v]) => (got as never as Record<string, unknown>)[k] === v);
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name} → ${JSON.stringify(got)}`);
  ok ? pass++ : fail++;
};

console.log('만점:', MAX_TOTAL_SCORE, '\n');

/* ---------- 4세: 무조건 1단계 ---------- */
check('4세 / 전부 B', calculateResult(build('AGE_4', allB)), { level: 1, reason: 'AGE', totalScore: 13 });
check('4세 / 전부 A', calculateResult(build('AGE_4', {})), { level: 1, reason: 'AGE', totalScore: 0 });

/* ---------- 조건 ①만 충족: 총점 ---------- */
// 5세 / 5~7번 중 6번 A → 총점 11 (조건① 충족)
check('5세 / 총점11만 충족(6번 A)',
  calculateResult(build('AGE_5', { ...allB, 6: 'A' })),
  { level: 2, reason: 'LEVEL_2_READY', totalScore: 11 });
// 6~7세 / 총점 9만 충족: 5·6번 B(4점) + 2,3,4,8,9번 B(5점) = 9점, 7번 A, 준비도 3개
check('6~7세 / 총점9 충족',
  calculateResult(build('AGE_6_7', { 2: 'B', 3: 'B', 4: 'B', 5: 'B', 6: 'B', 8: 'B', 9: 'B' })),
  { level: 2, reason: 'LEVEL_2_READY', totalScore: 9 });

/* ---------- 조건 ②만 충족: 5~7번 모두 B ---------- */
check('5세 / 5~7번만 B (총점6)',
  calculateResult(build('AGE_5', { 5: 'B', 6: 'B', 7: 'B' })),
  { level: 2, reason: 'LEVEL_2_READY', totalScore: 6 });
check('6~7세 / 5~7번만 B (총점6)',
  calculateResult(build('AGE_6_7', { 5: 'B', 6: 'B', 7: 'B' })),
  { level: 2, reason: 'LEVEL_2_READY', totalScore: 6 });

/* ---------- 조건 ③만 충족: 준비도 B 개수 ---------- */
// 5세 / 4·8·9·10번 B = 준비도 4개, 총점 4점
check('5세 / 준비도4만 충족 (총점4)',
  calculateResult(build('AGE_5', { 4: 'B', 8: 'B', 9: 'B', 10: 'B' })),
  { level: 2, reason: 'LEVEL_2_READY', totalScore: 4 });
// 6~7세 / 4·8·9번 B = 준비도 3개, 총점 3점
check('6~7세 / 준비도3만 충족 (총점3)',
  calculateResult(build('AGE_6_7', { 4: 'B', 8: 'B', 9: 'B' })),
  { level: 2, reason: 'LEVEL_2_READY', totalScore: 3 });

/* ---------- 셋 다 미달 → 1단계 ---------- */
check('5세 / 전부 A', calculateResult(build('AGE_5', {})), { level: 1, reason: 'CORE_NOT_READY', totalScore: 0 });
// 5세 경계 바로 아래: 총점 9, 준비도 3개, 7번 A → 세 조건 모두 미달
check('5세 / 총점9·준비도3 (경계 아래)',
  calculateResult(build('AGE_5', { 2: 'B', 3: 'B', 4: 'B', 5: 'B', 6: 'B', 8: 'B', 9: 'B' })),
  { level: 1, reason: 'CORE_NOT_READY', totalScore: 9 });
// 6~7세 경계 바로 아래: 총점 8, 준비도 2개, 7번 A → 세 조건 모두 미달
check('6~7세 / 총점8·준비도2 (경계 아래)',
  calculateResult(build('AGE_6_7', { 2: 'B', 3: 'B', 5: 'B', 6: 'B', 8: 'B', 9: 'B' })),
  { level: 1, reason: 'CORE_NOT_READY', totalScore: 8 });

/* ---------- 전수 검사 (3 x 1024 = 3072가지) ---------- */
const CORE = [5, 6, 7];
const READY = [4, 8, 9, 10, 11];
const SCORE: Record<number, number> = { 2:1, 3:1, 4:1, 5:2, 6:2, 7:2, 8:1, 9:1, 10:1, 11:1 };
let mismatch = 0;
const reasonCount: Record<string, number> = {};
for (const age of ['AGE_4', 'AGE_5', 'AGE_6_7'] as AgeGroup[]) {
  for (let mask = 0; mask < 1024; mask++) {
    const ch: Record<number, 'A' | 'B'> = {};
    for (let i = 0; i < 10; i++) ch[i + 2] = (mask >> i) & 1 ? 'B' : 'A';
    const answers = build(age, ch);
    const got = calculateResult(answers);

    // 기대값을 독립적으로 다시 계산
    const total = Object.keys(SCORE).map(Number).reduce((s, id) => s + (ch[id] === 'B' ? SCORE[id] : 0), 0);
    const c = LEVEL_2_CRITERIA[age];
    let want: SurveyResult;
    if (c === null) want = { level: 1, reason: 'AGE', totalScore: total };
    else {
      const coreAllB = CORE.every((id) => ch[id] === 'B');
      const readyB = READY.filter((id) => ch[id] === 'B').length;
      want = (total >= c.minTotalScore || coreAllB || readyB >= c.minReadinessB)
        ? { level: 2, reason: 'LEVEL_2_READY', totalScore: total }
        : { level: 1, reason: coreAllB ? 'MORE_FOUNDATION_NEEDED' : 'CORE_NOT_READY', totalScore: total };
    }
    if (JSON.stringify(got) !== JSON.stringify(want)) mismatch++;
    reasonCount[got.reason] = (reasonCount[got.reason] ?? 0) + 1;
  }
}
check('전수 검사 3072가지 모두 일치', { level: 1, reason: 'AGE', totalScore: mismatch } as SurveyResult, { totalScore: 0 });
console.log('\n사유별 분포:', reasonCount);
console.log(`\n결과: ${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
