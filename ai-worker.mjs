#!/usr/bin/env node
// ai-worker.mjs — Claude Code 터미널에서 실행
// Storybook AI 명령을 감지해서 화면 JSON 생성 → alfred-agent에 결과 저장

const HUB = "https://alfred-agent-nine.vercel.app";
const POLL_MS = 3000;

let lastCommandTs = null;

async function getCommand() {
  const res = await fetch(`${HUB}/api/ai-queue?role=claude`);
  if (!res.ok) return null;
  return await res.json();
}

async function postResult(items) {
  await fetch(`${HUB}/api/ai-queue`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "result", payload: { items } }),
  });
}

// ── 화면 생성기 ──────────────────────────────────────────────────────────────
// 명령 텍스트를 분석해서 items[] 배열을 반환
// Claude Code가 직접 실행하므로 API 비용 없음
function generateScreen(command) {
  const cmd = command.toLowerCase();

  // 요기요 홈
  if (cmd.includes("요기요") && (cmd.includes("홈") || cmd.includes("home"))) {
    return yogiyoHome();
  }
  // 기본 — 텍스트만
  return [
    { id: Date.now(), type:"frame", x:0, y:0, w:390, h:100, frameBg:"#f5f5f5", frameBorder:"#e0e0e0", frameRadius:0 },
    { id: Date.now()+1, type:"text", x:16, y:38, w:300, h:24, content: command, style:"meta_sf_body1", color:"#333333" },
  ];
}

function yogiyoHome() {
  const id = (n) => 1000 + n;
  return [
    // 상단 주소바
    { id:id(1), type:"frame", x:0, y:0, w:390, h:52, frameBg:"#ffffff", frameBorder:"transparent", frameRadius:0 },
    { id:id(2), type:"text", x:16, y:15, w:220, h:20, content:"서초대로28길 12  ▾", style:"meta_sf_body1", color:"#111111" },
    { id:id(3), type:"text", x:348, y:10, w:32, h:32, content:"🔔", style:"meta_sf_title2", color:"#111111" },
    // 검색바
    { id:id(4), type:"frame", x:12, y:60, w:366, h:40, frameBg:"#f4f4f4", frameBorder:"#e8e8e8", frameRadius:10 },
    { id:id(5), type:"text", x:24, y:72, w:300, h:18, content:"🔍  음식점, 메뉴를 검색해보세요", style:"meta_sf_body2", color:"#aaaaaa" },
    // 카테고리
    { id:id(10), type:"text", x:8,   y:118, w:60, h:60, content:"🍗\n치킨",   style:"meta_sf_caption1", color:"#222222" },
    { id:id(11), type:"text", x:74,  y:118, w:60, h:60, content:"🍕\n피자",   style:"meta_sf_caption1", color:"#222222" },
    { id:id(12), type:"text", x:140, y:118, w:60, h:60, content:"🥡\n중국집", style:"meta_sf_caption1", color:"#222222" },
    { id:id(13), type:"text", x:206, y:118, w:60, h:60, content:"🍱\n한식",   style:"meta_sf_caption1", color:"#222222" },
    { id:id(14), type:"text", x:272, y:118, w:60, h:60, content:"🍔\n버거",   style:"meta_sf_caption1", color:"#222222" },
    { id:id(15), type:"text", x:338, y:118, w:52, h:60, content:"···\n더보기", style:"meta_sf_caption1", color:"#999999" },
    // 배너
    { id:id(20), type:"frame", x:12, y:192, w:366, h:88, frameBg:"linear-gradient(135deg,#7b2ff7 0%,#f107a3 100%)", frameBorder:"transparent", frameRadius:14 },
    { id:id(21), type:"text", x:24, y:204, w:240, h:16, content:"주문할 때마다 포인트 적립", style:"meta_sf_caption1", color:"#ffffff" },
    { id:id(22), type:"text", x:24, y:224, w:200, h:28, content:"최대 14% 적립", style:"meta_sf_title2", color:"#ffffff" },
    { id:id(23), type:"text", x:24, y:256, w:120, h:16, content:"혜택 확인하기 →", style:"meta_sf_caption1", color:"rgba(255,255,255,0.7)" },
    // 추천 섹션 헤더
    { id:id(30), type:"text", x:16, y:296, w:240, h:22, content:"고객님 맞춤 추천 가게 👍", style:"meta_sf_title3", color:"#111111" },
    { id:id(31), type:"text", x:334, y:298, w:48, h:18, content:"더보기 >", style:"meta_sf_caption1", color:"#888888" },
    // 가게 카드 1
    { id:id(40), type:"frame", x:12, y:326, w:176, h:190, frameBg:"#ffffff", frameBorder:"#eeeeee", frameRadius:12 },
    { id:id(41), type:"frame", x:12, y:326, w:176, h:104, frameBg:"#e0d4c0", frameBorder:"transparent", frameRadius:0 },
    { id:id(42), type:"text", x:20, y:438, w:160, h:18, content:"착한도시락·서울강남", style:"meta_sf_body2", color:"#111111" },
    { id:id(43), type:"text", x:20, y:458, w:160, h:16, content:"⭐ 4.9  ·  배달 0원", style:"meta_sf_caption1", color:"#666666" },
    { id:id(44), type:"text", x:20, y:476, w:160, h:14, content:"최소 12,000원", style:"meta_sf_caption1", color:"#aaaaaa" },
    { id:id(45), type:"frame", x:20, y:496, w:64, h:20, frameBg:"#fff0f0", frameBorder:"transparent", frameRadius:4 },
    { id:id(46), type:"text", x:24, y:498, w:56, h:16, content:"쿠폰 3장", style:"meta_sf_caption1", color:"#fa0050" },
    // 가게 카드 2
    { id:id(50), type:"frame", x:202, y:326, w:176, h:190, frameBg:"#ffffff", frameBorder:"#eeeeee", frameRadius:12 },
    { id:id(51), type:"frame", x:202, y:326, w:176, h:104, frameBg:"#c0d4e0", frameBorder:"transparent", frameRadius:0 },
    { id:id(52), type:"text", x:210, y:438, w:160, h:18, content:"BHC치킨 · 역삼점", style:"meta_sf_body2", color:"#111111" },
    { id:id(53), type:"text", x:210, y:458, w:160, h:16, content:"⭐ 4.8  ·  배달 2,000원", style:"meta_sf_caption1", color:"#666666" },
    { id:id(54), type:"text", x:210, y:476, w:160, h:14, content:"최소 15,000원", style:"meta_sf_caption1", color:"#aaaaaa" },
    // 하단 탭바
    { id:id(60), type:"frame", x:0, y:780, w:390, h:64, frameBg:"#ffffff", frameBorder:"#eeeeee", frameRadius:0 },
    { id:id(61), type:"text", x:20,  y:786, w:56, h:50, content:"🏠\n홈",   style:"meta_sf_caption1", color:"#fa0050" },
    { id:id(62), type:"text", x:108, y:786, w:56, h:50, content:"🔖\n주문", style:"meta_sf_caption1", color:"#aaaaaa" },
    { id:id(63), type:"text", x:196, y:786, w:56, h:50, content:"🎁\n혜택", style:"meta_sf_caption1", color:"#aaaaaa" },
    { id:id(64), type:"text", x:284, y:786, w:56, h:50, content:"👤\n마이", style:"meta_sf_caption1", color:"#aaaaaa" },
  ];
}

// ── 메인 폴링 루프 ────────────────────────────────────────────────────────────
console.log("🤖 AI Worker 시작 — Storybook 명령 대기 중...");
console.log(`   허브: ${HUB}`);
console.log("   Ctrl+C로 종료\n");

async function loop() {
  try {
    const data = await getCommand();
    if (data && data.command && data.timestamp !== lastCommandTs) {
      lastCommandTs = data.timestamp;
      console.log(`\n📥 명령 수신: "${data.command}"`);
      const items = generateScreen(data.command);
      await postResult(items);
      console.log(`✅ 완료 — ${items.length}개 아이템 생성`);
    }
  } catch(e) {
    // 네트워크 오류는 조용히 무시
  }
  setTimeout(loop, POLL_MS);
}

loop();
