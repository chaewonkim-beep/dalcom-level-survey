/* 실제 빌드된 화면을 브라우저 엔진에 올려 처음부터 끝까지 풀어보는 검사
   사용법:  npm run build && npx next start -p 3300 &  → node scripts/e2e.js 3300 */
const { JSDOM } = require('jsdom');
const webStreams = require('node:stream/web');
const PORT = process.argv[2] || 3300;

function boot(url) {
  return JSDOM.fromURL(url, {
    runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true,
    beforeParse(w) {
      w.ReadableStream = webStreams.ReadableStream;
      w.WritableStream = webStreams.WritableStream;
      w.TransformStream = webStreams.TransformStream;
      w.TextEncoder = TextEncoder; w.TextDecoder = TextDecoder;
      w.MessageChannel = require('worker_threads').MessageChannel;
      w.fetch = (...a) => fetch(...a);
      w.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
      w.scrollTo = () => {};
    },
  });
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** age: 0=4세 1=5세 2=6세 3=7세 / thinking·numeracy: 0=A 1=B */
async function run(age, thinking, numeracy) {
  const dom = await boot(`http://127.0.0.1:${PORT}/`);
  const doc = dom.window.document;
  const qa = (s) => [...doc.querySelectorAll(s)];
  const txt = () => (doc.body.textContent || '').replace(/\s+/g, ' ');
  await sleep(5000);
  const startBtn = qa('button').find((b) => {
    const t = (b.textContent || '').trim();
    return t === 'Start!' || t.includes('확인하기') || t.includes('시작');
  });
  if (!startBtn) throw new Error('시작 버튼을 찾지 못했습니다');
  startBtn.click();
  await sleep(700);
  const nextBtn = () => qa('button').find((b) => ['다음', '결과 보기'].includes((b.textContent || '').trim()));
  const ans = async (i) => {
    qa('[role=radio]')[i].click(); await sleep(400);
    const n = nextBtn(); if (n && !n.disabled) n.click(); await sleep(500);
  };
  await ans(age);
  for (let i = 0; i < 3; i++) await ans(thinking);
  for (let i = 0; i < 6; i++) await ans(numeracy);
  await sleep(1500);
  return { doc, qa, txt: txt() };
}

let pass = 0, fail = 0;
const ok = (n, c) => { console.log(`${c ? 'PASS' : 'FAIL'}  ${n}`); c ? pass++ : fail++; };

(async () => {
  // 예외 케이스 — 7세 · 사고력 전부 A · 수·연산 전부 B
  let r = await run(3, 0, 1);
  ok('예외 케이스 → 단계 선택 화면', /목표에 따라 단계가 달라져요/.test(r.txt));
  ok('선택지 두 개 노출', /유아 2단계.*유아 1단계/.test(r.txt));
  const cards = r.qa('button').filter((b) => /유아 [12]단계/.test(b.textContent || ''));
  if (cards.length >= 2) {
    cards[1].click(); await sleep(900);
    ok('유아 1단계를 고르면 1단계 결과', /유아 1단계.*기초부터 차근차근/.test((r.doc.body.textContent || '').replace(/\s+/g, ' ')));
  } else ok('유아 1단계를 고르면 1단계 결과', false);

  // 일반 케이스 — 사고력도 전부 B
  r = await run(2, 1, 1);
  ok('사고력 있으면 선택 화면 없이 2단계', !/목표에 따라/.test(r.txt) && /유아 2단계/.test(r.txt));

  // 4세는 항상 1단계
  r = await run(0, 1, 1);
  ok('4세는 만점이어도 1단계', !/목표에 따라/.test(r.txt) && /유아 1단계/.test(r.txt));

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
