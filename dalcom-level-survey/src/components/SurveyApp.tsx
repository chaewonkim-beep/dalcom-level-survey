'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import LevelChoiceScreen from './LevelChoiceScreen';
import QuestionScreen from './QuestionScreen';
import ResultScreen from './ResultScreen';
import StartScreen from './StartScreen';
import { QUESTIONS, TOTAL_QUESTIONS } from '@/config/survey.config';
import { calculateResult, isLevelChoiceCase } from '@/lib/calculateResult';
import {
  createResponseId,
  trackComplete,
  trackStart,
} from '@/lib/analytics';
import type { AgeGroup, AnswerValue, Answers, Level } from '@/types/survey';

type Step = 'start' | 'question' | 'choice' | 'result';

/** 선택 후 다음 문항으로 자동 이동하기까지의 지연(ms) */
const AUTO_ADVANCE_DELAY = 260;

export default function SurveyApp() {
  const [step, setStep] = useState<Step>('start');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  /** 예외 케이스에서 학부모가 직접 고른 단계 */
  const [chosenLevel, setChosenLevel] = useState<Level | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /**
   * 최신 답변을 그대로 담아두는 곳.
   * 자동 넘김(setTimeout)이 실행될 때 state 갱신이 아직 반영되지 않아
   * 마지막 문항 답변이 빠진 채로 다음 화면을 정하는 문제를 막습니다.
   */
  const answersRef = useRef<Answers>({});
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
      return;
    }
    // 수·연산은 완벽하지만 사고력 경험이 적으면 학부모가 직접 고르게 합니다
    setStep(isLevelChoiceCase(answersRef.current) ? 'choice' : 'result');
  }, [index]);

  const goPrev = useCallback(() => {
    clearTimer();
    setIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleSelect = useCallback(
    (value: AnswerValue) => {
      clearTimer();
      const next = { ...answersRef.current, [question.id]: value };
      answersRef.current = next;
      setAnswers(next);
      // 선택 후 잠시 뒤 자동으로 다음 문항으로 이동 (마지막 문항은 결과로)
      timerRef.current = setTimeout(goNext, AUTO_ADVANCE_DELAY);
    },
    [goNext, question.id],
  );

  const handleStart = useCallback(() => {
    clearTimer();
    answersRef.current = {};
    setAnswers({});
    setIndex(0);
    setChosenLevel(null);
    setStep('question');

    responseIdRef.current = createResponseId();
    startedAtRef.current = Date.now();
    sentRef.current = false;
    trackStart(responseIdRef.current);
  }, []);

  const handleRestart = useCallback(() => {
    clearTimer();
    answersRef.current = {};
    setAnswers({});
    setIndex(0);
    setChosenLevel(null);
    setStep('start');
  }, []);

  const handleChoose = useCallback((level: Level) => {
    setChosenLevel(level);
    setStep('result');
  }, []);

  const result = useMemo(() => {
    if (step !== 'result') return null;
    const computed = calculateResult(answers);
    // 학부모가 직접 골랐다면 그 단계로 보여줍니다
    return chosenLevel ? { ...computed, level: chosenLevel } : computed;
  }, [step, answers, chosenLevel]);

  // 결과 화면에 도달하면 한 번만 전송합니다
  useEffect(() => {
    if (step !== 'result' || !result || sentRef.current) return;
    sentRef.current = true;
    trackComplete(
      responseIdRef.current,
      answers,
      result,
      startedAtRef.current,
      chosenLevel,
    );
  }, [step, result, answers, chosenLevel]);

  return (
    <>
      {/* 스크린리더 전용 진행 안내 */}
      <div aria-live="polite" className="sr-only">
        {step === 'question'
          ? `${TOTAL_QUESTIONS}문항 중 ${index + 1}번째 문항입니다.`
          : step === 'choice'
            ? '검사가 완료되었습니다. 단계를 선택해 주세요.'
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

      {step === 'choice' && (
        <LevelChoiceScreen
          ageGroup={answers[1] as AgeGroup | undefined}
          onChoose={handleChoose}
          onRestart={handleRestart}
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
