'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import QuestionScreen from './QuestionScreen';
import ResultScreen from './ResultScreen';
import StartScreen from './StartScreen';
import { QUESTIONS, TOTAL_QUESTIONS } from '@/config/survey.config';
import { calculateResult } from '@/lib/calculateResult';
import {
  createResponseId,
  trackComplete,
  trackStart,
} from '@/lib/analytics';
import type { AgeGroup, AnswerValue, Answers } from '@/types/survey';

type Step = 'start' | 'question' | 'result';

/** 선택 후 다음 문항으로 자동 이동하기까지의 지연(ms) */
const AUTO_ADVANCE_DELAY = 260;

export default function SurveyApp() {
  const [step, setStep] = useState<Step>('start');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** 응답 수집용 — 개인 식별과 무관한 임의의 값 */
  const responseIdRef = useRef<string>('');
  const startedAtRef = useRef<number>(0);
  const sentRef = useRef(false);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => clearTimer, []);

  const question = QUESTIONS[index];
  const isLast = index === TOTAL_QUESTIONS - 1;

  const goNext = useCallback(() => {
    clearTimer();
    if (index < TOTAL_QUESTIONS - 1) {
      setIndex(index + 1);
    } else {
      setStep('result');
    }
  }, [index]);

  const goPrev = useCallback(() => {
    clearTimer();
    setIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleSelect = useCallback(
    (value: AnswerValue) => {
      clearTimer();
      setAnswers((prev) => ({ ...prev, [question.id]: value }));
      // 선택 후 잠시 뒤 자동으로 다음 문항으로 이동 (마지막 문항은 결과로)
      timerRef.current = setTimeout(goNext, AUTO_ADVANCE_DELAY);
    },
    [goNext, question.id],
  );

  const handleStart = useCallback(() => {
    clearTimer();
    setAnswers({});
    setIndex(0);
    setStep('question');

    responseIdRef.current = createResponseId();
    startedAtRef.current = Date.now();
    sentRef.current = false;
    trackStart(responseIdRef.current);
  }, []);

  const handleRestart = useCallback(() => {
    clearTimer();
    setAnswers({});
    setIndex(0);
    setStep('start');
  }, []);

  const result = useMemo(
    () => (step === 'result' ? calculateResult(answers) : null),
    [step, answers],
  );

  // 결과 화면에 도달하면 한 번만 전송합니다
  useEffect(() => {
    if (step !== 'result' || !result || sentRef.current) return;
    sentRef.current = true;
    trackComplete(
      responseIdRef.current,
      answers,
      result,
      startedAtRef.current,
    );
  }, [step, result, answers]);

  return (
    <>
      {/* 스크린리더 전용 진행 안내 */}
      <div aria-live="polite" className="sr-only">
        {step === 'question'
          ? `${TOTAL_QUESTIONS}문항 중 ${index + 1}번째 문항입니다.`
          : step === 'result'
            ? '검사가 완료되었습니다. 결과 화면입니다.'
            : ''}
      </div>

      {step === 'start' && <StartScreen onStart={handleStart} />}

      {step === 'question' && (
        <QuestionScreen
          question={question}
          index={index}
          answer={answers[question.id]}
          onSelect={handleSelect}
          onPrev={goPrev}
          onNext={goNext}
          canGoPrev={index > 0}
          isLast={isLast}
        />
      )}

      {step === 'result' && result && (
        <ResultScreen
          result={result}
          ageGroup={answers[1] as AgeGroup | undefined}
          responseId={responseIdRef.current}
          onRestart={handleRestart}
        />
      )}
    </>
  );
}
