import type { AgeGroup, Answers, SurveyResult } from '@/types/survey';

/* ==================================================================
 * 응답 수집
 * ------------------------------------------------------------------
 * 익명 데이터만 보냅니다. 이름·연락처·IP는 수집하지 않습니다.
 * 전송이 실패해도 설문은 아무 영향 없이 계속 진행됩니다.
 * ================================================================== */

const ENDPOINT = '/api/track';

type TrackEvent = 'start' | 'complete' | 'cta_click';

interface BasePayload {
  event: TrackEvent;
  responseId: string;
}

interface StartPayload extends BasePayload {
  event: 'start';
  device: string;
  referrer: string;
}

interface CompletePayload extends BasePayload {
  event: 'complete';
  ageGroup?: AgeGroup;
  answers: Record<number, string>;
  totalScore: number;
  level: 1 | 2;
  reason: string;
  durationSec: number;
  device: string;
  referrer: string;
}

interface CtaPayload extends BasePayload {
  event: 'cta_click';
}

type Payload = StartPayload | CompletePayload | CtaPayload;

/** 응답 하나를 구분하는 임의의 값 (개인 식별과 무관) */
export function createResponseId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function getDevice(): string {
  if (typeof navigator === 'undefined') return '';
  return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
    ? '모바일'
    : '데스크톱';
}

function getReferrer(): string {
  if (typeof document === 'undefined') return '';
  return document.referrer || '';
}

/** 전송은 실패해도 조용히 넘어갑니다 */
function send(payload: Payload): void {
  if (typeof window === 'undefined') return;

  const body = JSON.stringify(payload);
  try {
    // 페이지를 떠나는 중에도 전송이 보장되도록 sendBeacon 우선
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'text/plain;charset=UTF-8' });
      if (navigator.sendBeacon(ENDPOINT, blob)) return;
    }
    void fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body,
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // 수집 실패가 설문을 막지 않도록 무시합니다
  }
}

/** 검사 시작 */
export function trackStart(responseId: string): void {
  send({
    event: 'start',
    responseId,
    device: getDevice(),
    referrer: getReferrer(),
  });
}

/** 결과 화면 도달 */
export function trackComplete(
  responseId: string,
  answers: Answers,
  result: SurveyResult,
  startedAt: number,
): void {
  const choices: Record<number, string> = {};
  for (let id = 2; id <= 11; id++) {
    const value = answers[id];
    if (typeof value === 'string') choices[id] = value;
  }

  send({
    event: 'complete',
    responseId,
    ageGroup: answers[1] as AgeGroup | undefined,
    answers: choices,
    totalScore: result.totalScore,
    level: result.level,
    reason: result.reason,
    durationSec: Math.round((Date.now() - startedAt) / 1000),
    device: getDevice(),
    referrer: getReferrer(),
  });
}

/** 결과 화면의 '자세히 보기' 클릭 */
export function trackCtaClick(responseId: string): void {
  send({ event: 'cta_click', responseId });
}
