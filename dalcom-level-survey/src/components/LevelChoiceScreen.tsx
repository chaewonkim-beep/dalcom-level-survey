'use client';

import { useEffect, useRef } from 'react';
import {
  AGE_LABEL,
  LEVEL_CHOICE_CONTENT,
  RESULT_CONTENT,
  RESULT_UI_TEXT,
} from '@/config/result.config';
import type { AgeGroup, Level } from '@/types/survey';

interface LevelChoiceScreenProps {
  ageGroup?: AgeGroup;
  onChoose: (level: Level) => void;
  onRestart: () => void;
}

/**
 * 수·연산 6문항을 모두 할 수 있지만 사고력 활동 경험이 적은 아이에게만
 * 보여주는 화면. 두 단계 중 하나를 학부모가 직접 고릅니다.
 */
export default function LevelChoiceScreen({
  ageGroup,
  onChoose,
  onRestart,
}: LevelChoiceScreenProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <section
      className="flex flex-1 flex-col animate-fade-in-up"
      aria-labelledby="choice-title"
    >
      <p className="text-sm font-bold tracking-wide text-brand-600">
        {RESULT_UI_TEXT.eyebrow}
      </p>

      <div className="mt-4 rounded-3xl bg-white p-6 shadow-sm">
        {ageGroup && (
          <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-700">
            {AGE_LABEL[ageGroup]}
          </span>
        )}

        <h1
          id="choice-title"
          ref={headingRef}
          tabIndex={-1}
          className="mt-4 whitespace-pre-line text-[24px] font-extrabold leading-tight text-slate-900 outline-none"
        >
          {LEVEL_CHOICE_CONTENT.title}
        </h1>

        <p className="mt-4 whitespace-pre-line text-[13px] leading-relaxed text-slate-600">
          {LEVEL_CHOICE_CONTENT.description}
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {LEVEL_CHOICE_CONTENT.options.map((option) => {
          const level = option.level as Level;
          const content = RESULT_CONTENT[level];
          return (
            <button
              key={level}
              type="button"
              onClick={() => onChoose(level)}
              aria-label={`${content.title} 선택. ${option.reason.replace('\n', ' ')}`}
              className={[
                'flex w-full items-center gap-4 rounded-2xl bg-white px-5 py-4 text-left transition-colors',
                option.highlighted
                  ? 'border-2 border-brand-500'
                  : 'border-2 border-slate-200 hover:border-brand-300',
              ].join(' ')}
            >
              <span className="min-w-0 flex-1">
                <span
                  className={[
                    'block text-[18px] font-extrabold',
                    option.highlighted ? 'text-brand-700' : 'text-slate-900',
                  ].join(' ')}
                >
                  {content.title}
                </span>
                <span className="mt-1 block whitespace-pre-line text-[12px] leading-relaxed text-slate-500">
                  {option.reason}
                </span>
              </span>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={content.cover.src}
                alt=""
                aria-hidden="true"
                className="w-16 shrink-0 rounded-lg"
              />
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onRestart}
        aria-label="처음부터 다시 검사하기"
        className="mx-auto mt-8 block text-[13px] text-slate-500 underline underline-offset-4 transition-colors hover:text-slate-700"
      >
        {RESULT_UI_TEXT.restartLabel}
      </button>
    </section>
  );
}
