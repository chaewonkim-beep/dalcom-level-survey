/**
 * 설문 응답을 구글 스프레드시트로 넘겨주는 중계 지점.
 *
 * 브라우저가 구글 주소로 직접 보내지 않고 이 경로를 거치게 해서
 *  - 스프레드시트 주소가 소스에 노출되지 않고
 *  - 브라우저 보안(CORS) 문제도 생기지 않습니다.
 *
 * 환경변수 SHEET_WEBHOOK_URL 이 없으면 아무것도 하지 않고 넘어갑니다.
 * (수집 설정 전에도 설문은 정상 동작합니다)
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const webhookUrl = process.env.SHEET_WEBHOOK_URL;

  // 수집이 꺼져 있어도 설문에는 영향이 없도록 조용히 성공 처리
  if (!webhookUrl) return new Response(null, { status: 204 });

  try {
    const body = await request.text();
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body,
      redirect: 'follow',
    });
  } catch {
    // 수집 실패가 사용자에게 보이지 않도록 무시합니다
  }

  return new Response(null, { status: 204 });
}
