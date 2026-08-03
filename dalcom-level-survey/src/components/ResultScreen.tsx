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
      <div className="flex-1">
        <p className="text-sm font-bold tracking-wide text-brand-600">
          {RESULT_UI_TEXT.eyebrow}
        </p>

        <div className="mt-4 rounded-3xl bg-white p-6 shadow-sm">
          <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-700">
            {ageGroup ? `${AGE_LABEL[ageGroup]} · ${content.badge}` : content.badge}
          </span>

          <h1
            id="result-title"
            ref={headingRef}
            tabIndex={-1}
            className="mt-3 text-[30px] font-extrabold leading-tight text-slate-900 outline-none"
          >
            {content.title}
          </h1>

          <p className="mt-3 whitespace-pre-line text-[16px] font-semibold leading-snug text-brand-700">
            {content.headline}
          </p>

          {/* 교재 표지 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={content.cover.src}
            alt={content.cover.alt}
            className="mt-5 block w-full rounded-2xl"
          />
        </div>

        <p className="mt-6 text-[15px] font-bold text-slate-800">
          {content.pointsTitle}
        </p>

        <ul className="mt-2.5 flex flex-col gap-2.5">
          {content.points.map((point) => (
            <li
              key={point}
              className="flex items-start gap-2.5 rounded-xl bg-white px-4 py-3 text-sm leading-relaxed text-slate-700"
            >
              <span
                aria-hidden="true"
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
              />
              {point}
            </li>
          ))}
        </ul>
      </div>

      <div className="sticky bottom-0 mt-6 flex flex-col gap-3 bg-brand-50 pt-4">
        <a
          href={content.cta.href}
          onClick={() => responseId && trackCtaClick(responseId)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${content.title} 상세페이지로 이동 (새 창)`}
          className="block w-full rounded-2xl bg-brand-500 px-6 py-4 text-center text-base font-bold text-white transition-colors hover:bg-brand-600 active:bg-brand-700"
        >
          {content.cta.label}
        </a>
        <button
          type="button"
          onClick={onRestart}
          aria-label="처음부터 다시 검사하기"
          className="w-full rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-600 transition-colors hover:border-slate-300"
        >
          {RESULT_UI_TEXT.restartLabel}
        </button>
      </div>
    </section>
  );
}
