'use client';

import { useEffect, useRef } from 'react';
import OptionGroup, { type OptionItem } from './OptionGroup';
import QuestionImages from './QuestionImages';
import ProgressBar from './ProgressBar';
import { QUESTION_NOTICE, TOTAL_QUESTIONS } from '@/config/survey.config';
import type { AnswerValue, Question } from '@/types/survey';

const AGE_PREFIXES = ['A', 'B', 'C', 'D'];
const CHOICE_PREFIXES = ['A', 'B'];

interface QuestionScreenProps {
  question: Question;
  /** 0-based */
  index: number;
  answer?: AnswerValue;
  onSelect: (value: AnswerValue) => void;
  onPrev: () => void;
  onNext: () => void;
  canGoPrev: boolean;
  isLast: boolean;
}

export default function QuestionScreen({
  question,
  index,
  answer,
  onSelect,
  onPrev,
  onNext,
  canGoPrev,
  isLast,
}: QuestionScreenProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  // 문항이 바뀔 때마다 제목으로 포커스를 옮겨 스크린리더가 새 문항을 읽도록 함
  useEffect(() => {
    headingRef.current?.focus();
  }, [question.id]);

  const prefixes = question.type === 'age' ? AGE_PREFIXES : CHOICE_PREFIXES;

  return (
    <section className="flex flex-1 flex-col" aria-labelledby="question-title">
      <ProgressBar current={index + 1} total={TOTAL_QUESTIONS} />

      <div key={question.id} className="mt-7 flex-1 animate-fade-in-up">
        <h1
          id="question-title"
          ref={headingRef}
          tabIndex={-1}
          className="text-[21px] font-extrabold leading-snug text-slate-900 outline-none"
        >
          <span className="sr-only">
            {TOTAL_QUESTIONS}문항 중 {index + 1}번째 문항.{' '}
          </span>
          {question.title}
        </h1>

        <div className="mt-6">
          <OptionGroup<string>
            questionNumber={question.id}
            questionTitle={question.title}
            options={question.options as OptionItem<string>[]}
            value={answer}
            onSelect={(value) => onSelect(value as AnswerValue)}
            prefixes={prefixes}
          />
        </div>

        {/* 사진은 참고용이라 선택지 아래에 둡니다 */}
        {question.images && <QuestionImages images={question.images} />}

        {/* 지정한 문항에서만 한 번 보여주는 안내 */}
        {index === QUESTION_NOTICE.questionNumber - 1 && QUESTION_NOTICE.text && (
          <p className="mt-6 whitespace-pre-line rounded-2xl bg-brand-100/70 px-4 py-3.5 text-center text-[13px] font-semibold leading-relaxed text-brand-700">
            {QUESTION_NOTICE.text}
          </p>
        )}

        {/* 화면에는 보이지 않지만 스크린리더 사용자에게는 조작법을 안내 */}
        <p className="sr-only">
          위아래 화살표 키로 이동하고 스페이스 또는 엔터 키로 선택할 수 있습니다.
        </p>
      </div>

      <div className="sticky bottom-0 mt-6 flex gap-3 bg-brand-50 pt-4">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canGoPrev}
          aria-label="이전 문항으로 돌아가기"
          className="flex-1 rounded-2xl border-2 border-slate-200 bg-white px-4 py-3.5 text-sm font-bold text-slate-600 transition-colors hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          이전
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={answer === undefined}
          aria-label={
            isLast ? '결과 확인하기' : '다음 문항으로 이동'
          }
          className="flex-[2] rounded-2xl bg-brand-500 px-4 py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isLast ? '결과 보기' : '다음'}
        </button>
      </div>
    </section>
  );
}
