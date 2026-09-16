'use client';

import { useEffect, useRef } from 'react';
import { AGE_LABEL, RESULT_CONTENT, RESULT_UI_TEXT } from '@/config/result.config';
import { trackCtaClick } from '@/lib/analytics';
import type { AgeGroup, SurveyResult } from '@/types/survey';

interface ResultScreenProps {
  result: SurveyResult;
  ageGroup?: AgeGroup;
  /** 응답 수집용 식별값 */
  responseId?: string;
  onRestart: () => void;
}

/**
 * 결과 화면 순서
 *   추천 결과 → 지금 우리 아이에게 필요한 건? (항목 3개)
 *   → 추천 단계 · 한 줄 요약 → 교재 표지 → 지금 시작하기 → 다시 검사하기
 */
export default function ResultScreen({
  result,
  ageGroup,
  responseId,
  onRestart,
}: ResultScreenProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const content = RESULT_CONTENT[result.level];

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <section
      className="flex flex-1 flex-col animate-fade-in-up"
      aria-labelledby="result-title"
    >
      <p className="text-sm font-bold tracking-wide text-brand-600">
        {RESULT_UI_TEXT.eyebrow}
      </p>

      {/* 1. 지금 우리 아이에게 필요한 건? */}
      <p className="mt-3 text-[17px] font-extrabold text-slate-900">
        {content.pointsTitle}
      </p>

      <ul className="mt-3 flex flex-col gap-3 rounded-2xl bg-white px-5 py-5">
        {content.points.map((point) => (
          <li
            key={point}
            className="flex items-start gap-3 text-sm leading-relaxed text-slate-700"
          >
            <span
              aria-hidden="true"
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
            />
            {point}
          </li>
        ))}
      </ul>

      {/* 2. 추천 단계 */}
      <span className="mt-8 inline-block self-start rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-700">
        {ageGroup ? AGE_LABEL[ageGroup] : content.badge}
      </span>

      <h1
        id="result-title"
        ref={headingRef}
        tabIndex={-1}
        className="mt-3 text-[30px] font-extrabold leading-tight text-slate-900 outline-none"
      >
        {content.title}
      </h1>

      <p className="mt-3 whitespace-pre-line text-[14px] font-semibold leading-relaxed text-brand-700">
        {content.headline}
      </p>

      {/* 3. 교재 표지 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={content.cover.src}
        alt={content.cover.alt}
        className="mx-auto mt-6 block w-[150px] max-w-full rounded-2xl"
      />

      {/* 4. 상세페이지로 */}
      <a
        href={content.cta.href}
        onClick={() => responseId && trackCtaClick(responseId)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${content.title} 상세페이지로 이동 (새 창)`}
        className="mx-auto mt-7 block w-[200px] max-w-full rounded-full bg-brand-500 px-6 py-4 text-center text-[17px] font-bold text-white transition-colors hover:bg-brand-600 active:bg-brand-700"
      >
        {content.cta.label}
      </a>

      <button
        type="button"
        onClick={onRestart}
        aria-label="처음부터 다시 검사하기"
        className="mx-auto mt-7 block text-[13px] text-slate-500 underline underline-offset-4 transition-colors hover:text-slate-700"
      >
        {RESULT_UI_TEXT.restartLabel}
      </button>
    </section>
  );
}
