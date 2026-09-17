'use client';

import { INTRO_CONTENT, TOTAL_QUESTIONS } from '@/config/survey.config';

interface StartScreenProps {
  onStart: () => void;
}

/**
 * 시작 화면.
 * 교재 표지 두 권은 뺀 상태입니다. 다시 넣으려면 subText 아래에
 *   <div className="mt-6 grid grid-cols-2 items-start gap-3"> … </div>
 * 로 `/images/cover-level1.jpg`, `/images/cover-level2.jpg` 를 넣으면 됩니다.
 * (두 파일은 결과 화면에서도 쓰이므로 public/images 에 그대로 있습니다)
 */
export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <section
      className="flex flex-1 flex-col animate-fade-in-up"
      aria-labelledby="start-title"
    >
      <div className="flex flex-1 flex-col justify-center py-6">
        {INTRO_CONTENT.eyebrow && (
          <p className="mb-3 text-sm font-bold tracking-wide text-brand-600">
            {INTRO_CONTENT.eyebrow}
          </p>
        )}

        <h1
          id="start-title"
          className="whitespace-pre-line text-[36px] font-extrabold leading-tight text-slate-900"
        >
          {INTRO_CONTENT.title}
        </h1>

        <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-slate-600">
          {INTRO_CONTENT.description}
        </p>

        <p className="mt-5 inline-flex self-start rounded-full bg-white px-3.5 py-1.5 text-[13px] font-semibold text-slate-500">
          {INTRO_CONTENT.subText}
        </p>
      </div>

      <div className="sticky bottom-0 bg-brand-50 pt-4">
        <button
          type="button"
          onClick={onStart}
          aria-label={`${INTRO_CONTENT.startLabel}, 총 ${TOTAL_QUESTIONS}개 문항`}
          className="w-full rounded-2xl bg-brand-500 px-6 py-4 text-base font-bold text-white transition-colors hover:bg-brand-600 active:bg-brand-700"
        >
          {INTRO_CONTENT.startLabel}
        </button>
      </div>
    </section>
  );
}
