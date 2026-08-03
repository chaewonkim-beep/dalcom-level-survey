import { IMAGE_COMPARE_CAPTION } from '@/config/survey.config';
import type { QuestionImage } from '@/types/survey';

interface QuestionImagesProps {
  images: QuestionImage[];
}

/**
 * 문항 이해를 돕는 교재 이미지.
 * - 1장이면 문항 본문과 같은 폭으로 그대로 보여줍니다.
 * - 2장이면 왼쪽 = 유아 1단계, 오른쪽 = 유아 2단계 로 나란히 놓고
 *   각 이미지 아래에 단계를 표시합니다.
 *
 * 확대 보기는 넣지 않았습니다. 모바일에서 화면을 벌려 확대하면 충분히 보입니다.
 */
export default function QuestionImages({ images }: QuestionImagesProps) {
  const isCompare = images.length === 2;

  return (
    <figure className="mt-5">
      <div className={isCompare ? 'grid grid-cols-2 items-start gap-2' : 'w-full'}>
        {images.map((image, index) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={image.src}
            src={image.src}
            alt={image.alt}
            loading={index === 0 ? 'eager' : 'lazy'}
            className="block w-full rounded-2xl border-2 border-slate-200 bg-white"
          />
        ))}
      </div>

      {/* 이미지 2장(1단계·2단계 비교)일 때만 각 이미지 아래에 단계 표시 */}
      {isCompare && (
        <figcaption className="mt-1.5 grid grid-cols-2 gap-2 text-center text-[11px] font-bold text-slate-500">
          {images.map((image) => (
            <span key={image.src}>{image.label}</span>
          ))}
          <span className="sr-only">{IMAGE_COMPARE_CAPTION}</span>
        </figcaption>
      )}
    </figure>
  );
}
