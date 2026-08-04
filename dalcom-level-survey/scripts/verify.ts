/* 결과 계산 로직 검증 스크립트 (npm run verify) */
import { calculateResult, countNumeracyB } from '../src/lib/calculateResult';
import { MAX_TOTAL_SCORE, TOTAL_QUESTIONS } from '../src/config/survey.config';
import {
  LEVEL_2_CRITERIA,
  NUMERACY_QUESTION_IDS,
} from '../src/config/result.config';
import type { AgeGroup, Answers, SurveyResult } from '../src/types/survey';

/** 2~10번을 A/B 로 채운 답변 만들기 */
const build = (age: string, choices: Record<number, 'A' | 'B'>): Answers => {
  const a: Answers = { 1: age as never };
  for (let id = 2; id <= 10; id++) a[id] = choices[id] ?? 'A';
  return a;
};
/** 수·연산 6문항 중 n개만 '가능' */
const numeracy = (n: number): Record<number, 'A' | 'B'> => {
  const c: Record<number, 'A' | 'B'> = {};
  NUMERACY_QUESTION_IDS.slice(0, n).forEach((id) => (c[id] = 'B'));
  return c;
};
const allB: Record<number, 'A' | 'B'> = {};
for (let i = 2; i <= 10; i++) allB[i] = 'B';

let pass = 0, fail = 0;
const check = (name: string, got: SurveyResult, want: Partial<SurveyResult>) => {
  const ok = Object.entries(want).every(
    ([k, v]) => (got as never as Record<string, unknown>)[k] === v,
  );
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name} → ${JSON.stringify(got)}`);
  ok ? pass++ : fail++;
};

console.log(`총 ${TOTAL_QUESTIONS}문항 · 만점 ${MAX_TOTAL_SCORE}점`);
console.log(`기준 — 5세 ${LEVEL_2_CRITERIA.AGE_5?.minNumeracyB}개 / 6~7세 ${LEVEL_2_CRITERIA.AGE_6_7?.minNumeracyB}개\n`);

/* ---------- 4세: 무조건 1단계 ---------- */
check('4세 / 전부 B(만점)', calculateResult(build('AGE_4', allB)), { level: 1, reason: 'AGE', totalScore: 15 });
check('4세 / 전부 A', calculateResult(build('AGE_4', {})), { level: 1, reason: 'AGE', totalScore: 0 });

/* ---------- 5세: 수·연산 5개 이상 ---------- */
check('5세 / 수연산 6개', calculateResult(build('AGE_5', numeracy(6))), { level: 2, reason: 'LEVEL_2_READY' });
check('5세 / 수연산 5개 (경계 통과)', calculateResult(build('AGE_5', numeracy(5))), { level: 2, reason: 'LEVEL_2_READY' });
check('5세 / 수연산 4개 (1개 부족)', calculateResult(build('AGE_5', numeracy(4))), { level: 1, reason: 'MORE_FOUNDATION_NEEDED' });
check('5세 / 수연산 3개', calculateResult(build('AGE_5', numeracy(3))), { level: 1, reason: 'CORE_NOT_READY' });
check('5세 / 수연산 0개', calculateResult(build('AGE_5', {})), { level: 1, reason: 'CORE_NOT_READY', totalScore: 0 });

/* ---------- 6~7세: 수·연산 4개 이상 ---------- */
check('6~7세 / 수연산 4개 (경계 통과)', calculateResult(build('AGE_6_7', numeracy(4))), { level: 2, reason: 'LEVEL_2_READY' });
check('6~7세 / 수연산 3개 (1개 부족)', calculateResult(build('AGE_6_7', numeracy(3))), { level: 1, reason: 'MORE_FOUNDATION_NEEDED' });
check('6~7세 / 수연산 2개', calculateResult(build('AGE_6_7', numeracy(2))), { level: 1, reason: 'CORE_NOT_READY' });

/* ---------- 사고력 문항은 판정에 영향 없음 ---------- */
const thinkOnly = { 2: 'B', 3: 'B', 4: 'B', ...numeracy(4) } as Record<number, 'A' | 'B'>;
check('5세 / 사고력 3개 다 B여도 수연산 4개면 1단계',
  calculateResult(build('AGE_5', thinkOnly)), { level: 1, reason: 'MORE_FOUNDATION_NEEDED' });
check('5세 / 사고력 0개여도 수연산 5개면 2단계',
  calculateResult(build('AGE_5', numeracy(5))), { level: 2, reason: 'LEVEL_2_READY' });

/* ---------- 배점 확인 ---------- */
check('만점 15점 (사고력 3 + 수연산 12)', calculateResult(build('AGE_5', allB)), { totalScore: 15 });
check('사고력만 3개 → 3점', calculateResult(build('AGE_5', { 2: 'B', 3: 'B', 4: 'B' })), { totalScore: 3 });
check('수연산만 6개 → 12점', calculateResult(build('AGE_5', numeracy(6))), { totalScore: 12 });

/* ---------- 전수 검사 (3 x 512 = 1536가지) ---------- */
const SCORE: Record<number, number> = { 2: 1, 3: 1, 4: 1, 5: 2, 6: 2, 7: 2, 8: 2, 9: 2, 10: 2 };
let mismatch = 0;
const reasonCount: Record<string, number> = {};
const levelCount: Record<string, number> = {};
for (const age of ['AGE_4', 'AGE_5', 'AGE_6_7'] as AgeGroup[]) {
  for (let mask = 0; mask < 512; mask++) {
    const ch: Record<number, 'A' | 'B'> = {};
    for (let i = 0; i < 9; i++) ch[i + 2] = (mask >> i) & 1 ? 'B' : 'A';
    const answers = build(age, ch);
    const got = calculateResult(answers);

    // 기대값을 독립적으로 다시 계산
    const total = Object.keys(SCORE).map(Number).reduce((s, id) => s + (ch[id] === 'B' ? SCORE[id] : 0), 0);
    const c = LEVEL_2_CRITERIA[age];
    let want: SurveyResult;
    if (c === null) want = { level: 1, reason: 'AGE', totalScore: total };
    else {
      const nb = NUMERACY_QUESTION_IDS.filter((id) => ch[id] === 'B').length;
      const short = c.minNumeracyB - nb;
      want = short <= 0
        ? { level: 2, reason: 'LEVEL_2_READY', totalScore: total }
        : { level: 1, reason: short === 1 ? 'MORE_FOUNDATION_NEEDED' : 'CORE_NOT_READY', totalScore: total };
    }
    if (JSON.stringify(got) !== JSON.stringify(want)) mismatch++;
    if (countNumeracyB(answers) !== NUMERACY_QUESTION_IDS.filter((id) => ch[id] === 'B').length) mismatch++;
    reasonCount[got.reason] = (reasonCount[got.reason] ?? 0) + 1;
    levelCount[got.level] = (levelCount[got.level] ?? 0) + 1;
  }
}
check('전수 검사 1536가지 모두 일치',
  { level: 1, reason: 'AGE', totalScore: mismatch } as SurveyResult, { totalScore: 0 });

console.log('\n사유별 분포:', reasonCount);
console.log('단계별 분포:', levelCount);
console.log(`\n결과: ${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
