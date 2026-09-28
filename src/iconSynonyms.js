// YDS Icon Synonym Map — Claude가 아이콘 이름을 정확히 찾을 수 있도록 동의어 매핑
// 사용법: import { findIcon } from "../iconSynonyms";
//         findIcon("장바구니") → { name: "cart", confidence: "exact" }

const SYNONYM_MAP = {
  // ── 네비게이션 ──
  "뒤로": ["arrow_left", "arrow_left_s", "chevron_left", "chevron_left_s"],
  "back": ["arrow_left", "arrow_left_s", "chevron_left", "chevron_left_s"],
  "앞으로": ["arrow_right", "arrow_right_s", "chevron_right", "chevron_right_s"],
  "forward": ["arrow_right", "arrow_right_s", "chevron_right", "chevron_right_s"],
  "위로": ["arrow_up", "arrow_up_s", "chevron_up", "chevron_up_s"],
  "up": ["arrow_up", "arrow_up_s", "chevron_up", "chevron_up_s"],
  "아래로": ["arrow_down", "arrow_down_s", "chevron_down", "chevron_down_s"],
  "down": ["arrow_down", "arrow_down_s", "chevron_down", "chevron_down_s"],
  "펼치기": ["chevron_down", "chevron_down_s", "expand"],
  "접기": ["chevron_up", "chevron_up_s", "close_fullscreen"],
  "더보기": ["chevron_right_s", "more_horiz", "more_vert_s"],
  "expand": ["expand", "chevron_down", "chevron_down_s"],

  // ── 닫기/삭제 ──
  "닫기": ["close", "close_s", "close_filled"],
  "close": ["close", "close_s", "close_filled"],
  "x": ["close", "close_s", "close_filled"],
  "삭제": ["delete", "close", "remove", "remove_s"],
  "delete": ["delete", "remove", "remove_s"],
  "지우기": ["delete", "remove", "remove_s"],
  "remove": ["remove", "remove_s", "delete"],
  "빼기": ["remove", "remove_s"],
  "minus": ["remove", "remove_s"],

  // ── 추가 ──
  "추가": ["add", "add_s"],
  "add": ["add", "add_s"],
  "더하기": ["add", "add_s"],
  "plus": ["add", "add_s"],
  "새로만들기": ["add", "add_s"],

  // ── 검색 ──
  "검색": ["search"],
  "search": ["search"],
  "찾기": ["search"],
  "find": ["search"],
  "돋보기": ["search"],
  "magnifying": ["search"],

  // ── 장바구니/쇼핑 ──
  "장바구니": ["cart", "bag"],
  "cart": ["cart"],
  "카트": ["cart"],
  "basket": ["cart", "bag"],
  "bag": ["bag"],
  "가방": ["bag"],
  "쇼핑": ["cart", "bag"],
  "shopping": ["cart", "bag"],

  // ── 홈 ──
  "홈": ["house", "house_filled", "nav_house", "nav_house_filled"],
  "home": ["house", "house_filled", "nav_house", "nav_house_filled"],
  "집": ["house", "house_filled"],

  // ── 하트/좋아요 ──
  "좋아요": ["heart", "heart_filled", "thumb_up", "thumb_up_filled"],
  "like": ["heart", "heart_filled", "thumb_up", "thumb_up_filled"],
  "하트": ["heart", "heart_filled", "nav_heart", "nav_heart_filled"],
  "heart": ["heart", "heart_filled"],
  "찜": ["heart", "heart_filled", "nav_heart", "nav_heart_filled"],
  "favorite": ["heart", "heart_filled"],
  "wish": ["heart", "heart_filled"],
  "추천": ["thumb_up", "thumb_up_filled"],

  // ── 주문/영수증 ──
  "주문": ["order", "order_filled", "receipt"],
  "order": ["order", "order_filled"],
  "영수증": ["receipt", "nav_receipt", "nav_receipt_filled"],
  "receipt": ["receipt", "nav_receipt", "nav_receipt_filled"],
  "주문내역": ["order", "order_filled", "receipt"],

  // ── 쿠폰/혜택 ──
  "쿠폰": ["coupon", "coupon_filled", "coupon_ticket"],
  "coupon": ["coupon", "coupon_filled", "coupon_ticket"],
  "할인": ["coupon", "coupon_ticket"],
  "혜택": ["benefit", "nav_benefit", "nav_benefit_filled"],
  "benefit": ["benefit", "nav_benefit", "nav_benefit_filled"],
  "선물": ["gift"],
  "gift": ["gift"],
  "포인트": ["point"],
  "point": ["point"],

  // ── 가게 ──
  "가게": ["store", "store_filled", "store_door"],
  "store": ["store", "store_filled", "store_door"],
  "매장": ["store", "store_filled", "open_store"],
  "shop": ["store", "store_filled"],
  "오픈": ["open_store"],
  "영업중": ["open_store"],
  "마감": ["closed_store"],
  "영업종료": ["closed_store"],

  // ── 설정 ──
  "설정": ["gear", "gear_filled"],
  "settings": ["gear", "gear_filled"],
  "gear": ["gear", "gear_filled"],
  "톱니바퀴": ["gear", "gear_filled"],

  // ── 시간 ──
  "시간": ["clock", "clock_filled"],
  "time": ["clock", "clock_filled"],
  "clock": ["clock", "clock_filled"],
  "시계": ["clock", "clock_filled"],
  "알람": ["alarm"],
  "alarm": ["alarm"],
  "알림": ["alarm", "notice"],

  // ── 캘린더 ──
  "캘린더": ["calendar", "calendar_month"],
  "calendar": ["calendar", "calendar_month"],
  "달력": ["calendar", "calendar_month"],
  "일정": ["calendar", "calendar_month", "event_available"],

  // ── 카메라/사진 ──
  "카메라": ["camera"],
  "camera": ["camera"],
  "사진": ["picture", "camera"],
  "photo": ["picture", "camera"],
  "picture": ["picture"],
  "이미지": ["picture"],
  "image": ["picture"],

  // ── 공유/링크 ──
  "공유": ["share"],
  "share": ["share"],
  "링크": ["link", "link_off"],
  "link": ["link"],
  "외부링크": ["open_in_new", "linkarrow_filled"],
  "새창": ["open_in_new"],

  // ── 복사 ──
  "복사": ["copy", "copy_filled"],
  "copy": ["copy", "copy_filled"],

  // ── 작성/리뷰 ──
  "작성": ["write"],
  "write": ["write"],
  "글쓰기": ["write"],
  "리뷰": ["review", "write"],
  "review": ["review"],
  "평가": ["review", "thumb_up"],

  // ── 전화 ──
  "전화": ["phone"],
  "phone": ["phone"],
  "call": ["phone"],
  "연락": ["phone"],

  // ── 채팅/상담 ──
  "채팅": ["counseling_chat", "chat_quit"],
  "chat": ["counseling_chat", "chat_quit"],
  "상담": ["counseling_chat"],
  "메시지": ["counseling_chat"],
  "message": ["counseling_chat"],

  // ── 결제/카드 ──
  "결제": ["card"],
  "카드": ["card"],
  "card": ["card"],
  "payment": ["card"],

  // ── 배달 ──
  "배달": ["helmet", "helmet_filled"],
  "delivery": ["helmet", "helmet_filled"],
  "라이더": ["helmet", "helmet_filled"],
  "포장": ["takeout"],
  "takeout": ["takeout"],
  "픽업": ["takeout"],

  // ── 위치 ──
  "위치": ["location_l", "gps"],
  "location": ["location_l", "gps"],
  "gps": ["gps"],
  "지도": ["location_l"],
  "map": ["location_l"],

  // ── 필터/정렬 ──
  "필터": ["filter", "filter_list"],
  "filter": ["filter", "filter_list"],
  "정렬": ["filter_list", "switch_vertical"],

  // ── 파일/다운로드 ──
  "파일": ["file", "file_check", "file_upload", "file_upload_s"],
  "file": ["file", "file_check"],
  "업로드": ["file_upload", "file_upload_s"],
  "upload": ["file_upload", "file_upload_s"],
  "다운로드": ["download"],
  "download": ["download"],
  "첨부": ["attached"],
  "attach": ["attached"],

  // ── 정보 ──
  "정보": ["information", "information_filled"],
  "info": ["information", "information_filled"],
  "안내": ["information", "information_filled", "notice"],
  "공지": ["notice"],
  "notice": ["notice"],
  "경고": ["warning", "exclamation", "exclamation_filled"],
  "warning": ["warning"],
  "주의": ["warning", "exclamation"],
  "느낌표": ["exclamation", "exclamation_filled"],

  // ── 확인/체크 ──
  "확인": ["check", "check_s"],
  "check": ["check", "check_s"],
  "완료": ["check", "check_s", "event_available"],
  "done": ["check", "check_s"],
  "ok": ["check", "check_s"],

  // ── 새로고침 ──
  "새로고침": ["refresh"],
  "refresh": ["refresh"],
  "reload": ["refresh"],

  // ── 기타 ──
  "메뉴": ["hamburger", "more_horiz", "more_vert_s"],
  "menu": ["hamburger"],
  "햄버거": ["hamburger"],
  "이메일": ["email"],
  "email": ["email"],
  "mail": ["email"],
  "안전": ["safety_hygiene"],
  "위생": ["safety_hygiene"],
  "의료": ["medical"],
  "병원": ["medical"],
  "로봇": ["robo"],
  "ai": ["robo"],
  "간판": ["sign"],
  "숟가락": ["spoon"],
  "음식": ["spoon"],
  "food": ["spoon"],
  "모니터": ["monitor"],
  "화면": ["monitor"],
  "new": ["new_filled"],
  "신규": ["new_filled"],
  "마이메뉴": ["mymenu", "nav_mymenu", "nav_mymenu_filled"],
  "마이페이지": ["mymenu", "nav_mymenu", "nav_mymenu_filled"],
  "my": ["mymenu", "nav_mymenu", "nav_mymenu_filled"],
  "내정보": ["mymenu", "nav_mymenu"],
  "할일": ["task"],
  "task": ["task"],
  "todo": ["task"],
};

// 전체 아이콘 이름 목록
const ALL_ICONS = ["19_circle","add","add_s","alarm","arrow_down","arrow_down_s","arrow_left","arrow_left_s","arrow_right","arrow_right_s","arrow_up","arrow_up_s","attached","bag","benefit","calendar","calendar_month","camera","card","cart","chat_quit","check","check_s","chevron_down","chevron_down_filled","chevron_down_s","chevron_left","chevron_left_s","chevron_right","chevron_right_filled","chevron_right_s","chevron_up","chevron_up_s","clock","clock_filled","close","close_filled","close_fullscreen","close_s","closed_store","copy","copy_filled","counseling_chat","coupon","coupon_filled","coupon_ticket","delete","doublechevron_left_s","doublechevron_right_s","download","email","event_available","exclamation","exclamation_filled","expand","file","file_check","file_upload","file_upload_s","filter","filter_list","gear","gear_filled","gift","gps","hamburger","heart","heart_filled","helmet","helmet_filled","house","house_filled","information","information_filled","link","link_off","linkarrow_filled","location_l","medical","monitor","more_horiz","more_vert_s","mymenu","nav_benefit","nav_benefit_filled","nav_heart","nav_heart_filled","nav_house","nav_house_filled","nav_mymenu","nav_mymenu_filled","nav_receipt","nav_receipt_filled","new_filled","notice","open_in_new","open_store","order","order_filled","phone","picture","point","receipt","refresh","remove","remove_s","review","robo","safety_hygiene","search","share","sign","spoon","store","store_door","store_filled","switch_horizontal","switch_vertical","takeout","task","thumb_up","thumb_up_filled","triangle_down","triangle_down_s","triangle_left","triangle_left_s","triangle_right","triangle_right_s","triangle_up","triangle_up_s","warning","write"];

/**
 * 키워드로 아이콘 찾기
 * @param {string} query - 한글 또는 영어 키워드
 * @returns {{ name: string, confidence: "exact"|"synonym"|"partial"|"none", alternatives: string[] }}
 */
export function findIcon(query) {
  const q = query.toLowerCase().trim();

  // 1. 정확히 일치하는 아이콘 이름
  if (ALL_ICONS.includes(q)) {
    return { name: q, confidence: "exact", alternatives: [] };
  }

  // 2. synonym 매핑에서 찾기
  if (SYNONYM_MAP[q]) {
    const matches = SYNONYM_MAP[q].filter(n => ALL_ICONS.includes(n));
    if (matches.length > 0) {
      return { name: matches[0], confidence: "synonym", alternatives: matches.slice(1) };
    }
  }

  // 3. 부분 문자열 매칭 (아이콘 이름에 query가 포함된 경우)
  const partials = ALL_ICONS.filter(n => n.includes(q));
  if (partials.length > 0) {
    return { name: partials[0], confidence: "partial", alternatives: partials.slice(1) };
  }

  // 4. synonym 값에서 역방향 검색 (query가 synonym의 키에 부분 포함)
  for (const [key, icons] of Object.entries(SYNONYM_MAP)) {
    if (key.includes(q) || q.includes(key)) {
      const matches = icons.filter(n => ALL_ICONS.includes(n));
      if (matches.length > 0) {
        return { name: matches[0], confidence: "partial", alternatives: matches.slice(1) };
      }
    }
  }

  return { name: null, confidence: "none", alternatives: [] };
}

/**
 * 여러 키워드로 검색 (OR)
 */
export function findIcons(queries) {
  return queries.map(q => ({ query: q, ...findIcon(q) }));
}

export { ALL_ICONS, SYNONYM_MAP };
