'use client';

import { useEffect, useRef, useState } from 'react';
import {
  IMAGE_COMPARE_CAPTION,
  IMAGE_ZOOM_HINT,
} from '@/config/survey.config';
import type { QuestionImage } from '@/types/survey';

interface QuestionImagesProps {
  images: QuestionImage[];
}

/**
 * 문항 이해를 돕는 교재 이미지.
 * - 1장이면 그대로 한 장, 아래에 image.label
 * - 2장이면 왼쪽 = 유아 1단계, 오른쪽 = 유아 2단계 로 나란히,
 *   아래에 '유아 1단계, 2단계 비교'
 * 탭(또는 Enter / Space)하면 전체 화면으로 크게 볼 수 있고 Esc로 닫습니다.
 */
export default function QuestionImages({ images }: QuestionImagesProps) {
  const [zoomed, setZoomed] = useState<QuestionImage | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!zoomed) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomed]);

  const open = (image: QuestionImage, element: HTMLButtonElement) => {
    triggerRef.current = element;
    setZoomed(image);
  };

  const close = () => {
    setZoomed(null);
    triggerRef.current?.focus();
  };

  const isCompare = images.length === 2;

  // 이미지 1장이면 문항 본문과 같은 폭(화면 전체)으로 넣습니다.
  // 2장이면 좌우로 나눠 담습니다.
  const frameClass = isCompare
    ? 'grid grid-cols-2 items-start gap-2'
    : 'w-full';

  return (
    <>
      <figure className="mt-5">
        <div className={frameClass}>
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={(event) => open(image, event.currentTarget)}
              aria-label={
                isCompare
                  ? `${image.label} 이미지 크게 보기`
                  : `${image.label} 이미지 크게 보기`
              }
              className="group relative block w-full overflow-hidden rounded-2xl border-2 border-slate-200 bg-white"
            >
              {/* 교재 스캔 이미지라 next/image 최적화 없이 그대로 사용 */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                alt={image.alt}
                loading={index === 0 ? 'eager' : 'lazy'}
                className="block w-full"
              />

              {/* 커서를 올리면 어두워지면서 + 표시가 뜹니다 */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-900/50 text-[40px] font-light leading-none text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 group-active:opacity-100"
              >
                +
              </span>
            </button>
          ))}
        </div>

        {/* 이미지 2장(1단계·2단계 비교)일 때만 각 이미지 아래에 단계 표시 */}
        {isCompare && (
          <>
            <div
              aria-hidden="true"
              className="mt-1.5 grid grid-cols-2 gap-2 text-center text-[11px] font-bold text-slate-500"
            >
              {images.map((image) => (
                <span key={image.src}>{image.label}</span>
              ))}
            </div>
            <p className="sr-only">{IMAGE_COMPARE_CAPTION}</p>
          </>
        )}

        {/* 이미지 아래에는 단계 라벨 대신 클릭 안내를 둡니다 */}
        <figcaption className="mt-2 text-center text-xs text-slate-500">
          {IMAGE_ZOOM_HINT}
        </figcaption>
      </figure>

      {zoomed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${zoomed.label} 확대 보기`}
          onClick={close}
          className="fixed inset-0 z-50 flex flex-col bg-slate-900/90 p-4"
        >
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-white/15 px-3 py-1.5 text-sm font-bold text-white">
              {zoomed.label}
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="확대 보기 닫기"
              className="rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-slate-700"
            >
              닫기
            </button>
          </div>
          <div className="mt-3 flex-1 overflow-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={zoomed.src}
              alt={zoomed.alt}
              onClick={(event) => event.stopPropagation()}
              className="mx-auto w-full max-w-3xl rounded-xl bg-white"
            />
          </div>
        </div>
      )}
    </>
  );
}
