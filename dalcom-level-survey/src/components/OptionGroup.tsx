'use client';

import { useEffect, useRef } from 'react';

export interface OptionItem<T extends string> {
  value: T;
  label: string;
  /** config에서 직접 지정한 aria-label (없으면 자동 생성) */
  ariaLabel?: string;
}

interface OptionGroupProps<T extends string> {
  /** 문항 번호 (1~11) */
  questionNumber: number;
  /** 질문 본문 — aria-label 생성에 사용 */
  questionTitle: string;
  options: OptionItem<T>[];
  value?: T;
  onSelect: (value: T) => void;
  /** 각 선택지 앞에 붙는 배지 텍스트 (예: A, B, C) */
  prefixes: string[];
}

/**
 * WAI-ARIA radiogroup 패턴 (수동 활성화)
 * - Tab: 그룹 진입/이탈
 * - ↑ ↓ ← →: 포커스 이동
 * - Home / End: 처음·마지막 선택지로 이동
 * - Space / Enter: 선택
 * - 1 · 2 · 3 · 4: 해당 번호 선택지 바로 선택
 */
export default function OptionGroup<T extends string>({
  questionNumber,
  questionTitle,
  options,
  value,
  onSelect,
  prefixes,
}: OptionGroupProps<T>) {
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedIndex = options.findIndex((o) => o.value === value);

  // 문항이 바뀌면 ref 배열 초기화
  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, options.length);
  }, [options.length, questionNumber]);

  const focusItem = (index: number) => {
    const nextIndex = (index + options.length) % options.length;
    itemRefs.current[nextIndex]?.focus();
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLElement>,
    index: number,
  ) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        focusItem(index + 1);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        focusItem(index - 1);
        break;
      case 'Home':
        event.preventDefault();
        focusItem(0);
        break;
      case 'End':
        event.preventDefault();
        focusItem(options.length - 1);
        break;
      case '1':
      case '2':
      case '3':
      case '4': {
        const target = Number(event.key) - 1;
        if (target < options.length) {
          event.preventDefault();
          onSelect(options[target].value);
        }
        break;
      }
      default:
        break;
    }
  };

  /** 스크린리더가 읽어줄 문장 자동 생성 */
  const buildAriaLabel = (option: OptionItem<T>, index: number) =>
    option.ariaLabel ??
    `${questionNumber}번 문항 ${questionTitle} 선택지 ${prefixes[index]}, ${option.label}`;

  return (
    <div
      role="radiogroup"
      aria-label={`${questionNumber}번 문항 ${questionTitle} 답변 선택`}
      className="flex flex-col gap-3"
    >
      {options.map((option, index) => {
        const isSelected = option.value === value;
        // roving tabindex: 선택된 항목(없으면 첫 항목)만 Tab 대상
        const isTabStop =
          selectedIndex === -1 ? index === 0 : index === selectedIndex;

        return (
          <button
            key={option.value}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={buildAriaLabel(option, index)}
            tabIndex={isTabStop ? 0 : -1}
            onClick={() => onSelect(option.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={[
              'flex w-full items-start gap-3 rounded-2xl border-2 px-4 py-4 text-left',
              'transition-colors duration-150 active:scale-[0.99]',
              'min-h-[60px] touch-manipulation',
              isSelected
                ? 'border-brand-500 bg-brand-500/10 shadow-sm'
                : 'border-slate-200 bg-white hover:border-brand-300',
            ].join(' ')}
          >
            <span
              aria-hidden="true"
              className={[
                'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold',
                isSelected
                  ? 'bg-brand-500 text-white'
                  : 'bg-slate-100 text-slate-500',
              ].join(' ')}
            >
              {prefixes[index]}
            </span>
            <span
              className={[
                'text-[15px] leading-relaxed',
                isSelected ? 'font-semibold text-brand-700' : 'text-slate-700',
              ].join(' ')}
            >
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
