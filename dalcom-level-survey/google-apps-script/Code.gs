/**
 * 달콤 유아 사고력 단계 추천 설문 — 응답 수집 스크립트
 * ------------------------------------------------------------------
 * 설문에서 보내는 이벤트를 구글 스프레드시트에 한 줄씩 쌓습니다.
 * 같은 응답ID의 이벤트는 같은 줄에 모읍니다.
 *
 *   start     검사 시작하기를 눌렀을 때
 *   complete  마지막 문항까지 답하고 결과 화면에 도달했을 때
 *   cta_click 결과 화면에서 '자세히 보기'를 눌렀을 때
 *
 * 개인정보는 수집하지 않습니다. (이름·연락처·IP 없음)
 * 설치 방법은 DEPLOY.md 를 참고하세요.
 */

/** 응답이 쌓일 시트 이름 */
var SHEET_NAME = '응답';

/** 표 맨 윗줄 */
var HEADERS = [
  '응답ID',
  '시작시각',
  '완료시각',
  '연령',
  '2번 달콤 프로젝트 경험',
  '3번 사고력 문제집 경험',
  '4번 문제 이해',
  '5번 개수 세기',
  '6번 가르기 모으기',
  '7번 덧셈 뺄셈',
  '8번 위치 이해',
  '9번 패턴',
  '10번 게임 규칙',
  '11번 스스로 시도',
  '총점',
  '추천 단계',
  '판정 사유',
  '소요시간(초)',
  '상세보기 클릭',
  '기기',
  '유입 경로',
];

var AGE_LABEL = { AGE_4: '4세', AGE_5: '5세', AGE_6_7: '6~7세' };
var LEVEL_LABEL = { 1: '유아 1단계', 2: '유아 2단계' };
var REASON_LABEL = {
  AGE: '4세',
  CORE_NOT_READY: '조건 미달',
  MORE_FOUNDATION_NEEDED: '기초 보완 필요',
  LEVEL_2_READY: '2단계 조건 충족',
};

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // 동시에 여러 명이 제출해도 줄이 섞이지 않도록 잠급니다 (최대 30초 대기)
    lock.waitLock(30000);
    var data = JSON.parse(e.postData.contents);
    saveEvent(data);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** 브라우저에서 주소를 열어 확인할 때 쓰는 응답 */
function doGet() {
  return json({ ok: true, message: '달콤 설문 수집기가 동작 중입니다.' });
}

function saveEvent(data) {
  var sheet = getSheet();
  var responseId = String(data.responseId || '');
  if (!responseId) return;

  var row = findRow(sheet, responseId);
  if (!row) {
    sheet.appendRow([responseId]);
    row = sheet.getLastRow();
  }

  var now = new Date();

  if (data.event === 'start') {
    setCell(sheet, row, '시작시각', now);
    setCell(sheet, row, '기기', data.device || '');
    setCell(sheet, row, '유입 경로', data.referrer || '직접 접속');
  }

  if (data.event === 'complete') {
    setCell(sheet, row, '완료시각', now);
    setCell(sheet, row, '연령', AGE_LABEL[data.ageGroup] || data.ageGroup || '');
    for (var id = 2; id <= 11; id++) {
      var header = findHeaderByQuestion(id);
      if (header) setCell(sheet, row, header, (data.answers && data.answers[id]) || '');
    }
    setCell(sheet, row, '총점', data.totalScore);
    setCell(sheet, row, '추천 단계', LEVEL_LABEL[data.level] || data.level);
    setCell(sheet, row, '판정 사유', REASON_LABEL[data.reason] || data.reason);
    if (data.durationSec != null) setCell(sheet, row, '소요시간(초)', data.durationSec);
    // 시작 이벤트가 유실됐을 때를 대비
    if (!getCell(sheet, row, '기기')) setCell(sheet, row, '기기', data.device || '');
    if (!getCell(sheet, row, '유입 경로')) {
      setCell(sheet, row, '유입 경로', data.referrer || '직접 접속');
    }
  }

  if (data.event === 'cta_click') {
    setCell(sheet, row, '상세보기 클릭', 'O');
  }
}

/* ----------------------------- 도우미 ----------------------------- */

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

function columnOf(header) {
  var index = HEADERS.indexOf(header);
  return index === -1 ? null : index + 1;
}

function setCell(sheet, row, header, value) {
  var col = columnOf(header);
  if (col) sheet.getRange(row, col).setValue(value);
}

function getCell(sheet, row, header) {
  var col = columnOf(header);
  return col ? sheet.getRange(row, col).getValue() : '';
}

function findRow(sheet, responseId) {
  var last = sheet.getLastRow();
  if (last < 2) return null;
  var ids = sheet.getRange(2, 1, last - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === responseId) return i + 2;
  }
  return null;
}

function findHeaderByQuestion(id) {
  for (var i = 0; i < HEADERS.length; i++) {
    if (HEADERS[i].indexOf(id + '번 ') === 0) return HEADERS[i];
  }
  return null;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
