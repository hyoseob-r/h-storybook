#!/usr/bin/env node
// ai-worker.mjs — Claude Code 로컬 프록시 서버
// 에이전트 앱과 동일한 방식: 로컬 HTTP 서버 → Supabase에 proxy_url 등록
// Storybook이 이 서버로 직접 AI 명령 전송

import http from "http";

const HUB          = "https://alfred-agent-nine.vercel.app";
const GITHUB_LOGIN = "hyoseob-r";
const PORT         = 3721; // 에이전트와 다른 포트

// ── 화면 생성기 ──────────────────────────────────────────────────────────────
function generateScreen(command) {
  const cmd = command.toLowerCase();
  if (cmd.includes("요기요") && (cmd.includes("홈") || cmd.includes("home"))) return yogiyoHome();
  // 기본 텍스트
  return [
    { id: Date.now(),   type:"frame", x:0, y:0, w:390, h:100, frameBg:"#f5f5f5", frameBorder:"#e0e0e0", frameRadius:0 },
    { id: Date.now()+1, type:"text",  x:16, y:38, w:358, h:24, content: command, style:"meta_sf_body1", color:"#333333" },
  ];
}

function yogiyoHome() {
  const id = (n) => 1000 + n;
  return [
    { id:id(1),  type:"frame", x:0,   y:0,   w:390, h:52,  frameBg:"#ffffff", frameBorder:"transparent", frameRadius:0 },
    { id:id(2),  type:"text",  x:16,  y:15,  w:220, h:20,  content:"서초대로28길 12  ▾", style:"meta_sf_body1", color:"#111111" },
    { id:id(3),  type:"text",  x:348, y:10,  w:32,  h:32,  content:"🔔", style:"meta_sf_title2", color:"#111111" },
    { id:id(4),  type:"frame", x:12,  y:60,  w:366, h:40,  frameBg:"#f4f4f4", frameBorder:"#e8e8e8", frameRadius:10 },
    { id:id(5),  type:"text",  x:24,  y:72,  w:300, h:18,  content:"🔍  음식점, 메뉴를 검색해보세요", style:"meta_sf_body2", color:"#aaaaaa" },
    { id:id(10), type:"text",  x:8,   y:118, w:60,  h:60,  content:"🍗\n치킨",   style:"meta_sf_caption1", color:"#222222" },
    { id:id(11), type:"text",  x:74,  y:118, w:60,  h:60,  content:"🍕\n피자",   style:"meta_sf_caption1", color:"#222222" },
    { id:id(12), type:"text",  x:140, y:118, w:60,  h:60,  content:"🥡\n중국집", style:"meta_sf_caption1", color:"#222222" },
    { id:id(13), type:"text",  x:206, y:118, w:60,  h:60,  content:"🍱\n한식",   style:"meta_sf_caption1", color:"#222222" },
    { id:id(14), type:"text",  x:272, y:118, w:60,  h:60,  content:"🍔\n버거",   style:"meta_sf_caption1", color:"#222222" },
    { id:id(15), type:"text",  x:338, y:118, w:52,  h:60,  content:"···\n더보기", style:"meta_sf_caption1", color:"#999999" },
    { id:id(20), type:"frame", x:12,  y:192, w:366, h:88,  frameBg:"linear-gradient(135deg,#7b2ff7 0%,#f107a3 100%)", frameBorder:"transparent", frameRadius:14 },
    { id:id(21), type:"text",  x:24,  y:204, w:240, h:16,  content:"주문할 때마다 포인트 적립", style:"meta_sf_caption1", color:"#ffffff" },
    { id:id(22), type:"text",  x:24,  y:224, w:200, h:28,  content:"최대 14% 적립", style:"meta_sf_title2", color:"#ffffff" },
    { id:id(23), type:"text",  x:24,  y:256, w:120, h:16,  content:"혜택 확인하기 →", style:"meta_sf_caption1", color:"rgba(255,255,255,0.7)" },
    { id:id(30), type:"text",  x:16,  y:296, w:240, h:22,  content:"고객님 맞춤 추천 가게 👍", style:"meta_sf_title3", color:"#111111" },
    { id:id(31), type:"text",  x:334, y:298, w:48,  h:18,  content:"더보기 >", style:"meta_sf_caption1", color:"#888888" },
    { id:id(40), type:"frame", x:12,  y:326, w:176, h:190, frameBg:"#ffffff", frameBorder:"#eeeeee", frameRadius:12 },
    { id:id(41), type:"frame", x:12,  y:326, w:176, h:104, frameBg:"#e0d4c0", frameBorder:"transparent", frameRadius:0 },
    { id:id(42), type:"text",  x:20,  y:438, w:160, h:18,  content:"착한도시락·서울강남", style:"meta_sf_body2", color:"#111111" },
    { id:id(43), type:"text",  x:20,  y:458, w:160, h:16,  content:"⭐ 4.9  ·  배달 0원", style:"meta_sf_caption1", color:"#666666" },
    { id:id(44), type:"text",  x:20,  y:476, w:160, h:14,  content:"최소 12,000원", style:"meta_sf_caption1", color:"#aaaaaa" },
    { id:id(50), type:"frame", x:202, y:326, w:176, h:190, frameBg:"#ffffff", frameBorder:"#eeeeee", frameRadius:12 },
    { id:id(51), type:"frame", x:202, y:326, w:176, h:104, frameBg:"#c0d4e0", frameBorder:"transparent", frameRadius:0 },
    { id:id(52), type:"text",  x:210, y:438, w:160, h:18,  content:"BHC치킨 · 역삼점", style:"meta_sf_body2", color:"#111111" },
    { id:id(53), type:"text",  x:210, y:458, w:160, h:16,  content:"⭐ 4.8  ·  배달 2,000원", style:"meta_sf_caption1", color:"#666666" },
    { id:id(54), type:"text",  x:210, y:476, w:160, h:14,  content:"최소 15,000원", style:"meta_sf_caption1", color:"#aaaaaa" },
    { id:id(60), type:"frame", x:0,   y:780, w:390, h:64,  frameBg:"#ffffff", frameBorder:"#eeeeee", frameRadius:0 },
    { id:id(61), type:"text",  x:20,  y:786, w:56,  h:50,  content:"🏠\n홈",   style:"meta_sf_caption1", color:"#fa0050" },
    { id:id(62), type:"text",  x:108, y:786, w:56,  h:50,  content:"🔖\n주문", style:"meta_sf_caption1", color:"#aaaaaa" },
    { id:id(63), type:"text",  x:196, y:786, w:56,  h:50,  content:"🎁\n혜택", style:"meta_sf_caption1", color:"#aaaaaa" },
    { id:id(64), type:"text",  x:284, y:786, w:56,  h:50,  content:"👤\n마이", style:"meta_sf_caption1", color:"#aaaaaa" },
  ];
}

// ── HTTP 서버 ─────────────────────────────────────────────────────────────────
const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.writeHead(200); res.end(); return; }

  // 헬스체크
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, service: "storybook-ai-worker" }));
    return;
  }

  // AI 명령 처리
  if (req.method === "POST" && req.url === "/api/ai-draw") {
    let body = "";
    req.on("data", d => body += d);
    req.on("end", () => {
      try {
        const { command } = JSON.parse(body);
        console.log(`\n📥 명령: "${command}"`);
        const items = generateScreen(command);
        console.log(`✅ ${items.length}개 아이템 생성`);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, items }));
      } catch (e) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  res.writeHead(404); res.end();
});

server.listen(PORT, async () => {
  const proxyUrl = `http://localhost:${PORT}`;
  console.log(`🤖 AI Worker 시작 — ${proxyUrl}`);

  // alfred-agent에 proxy_url 등록
  try {
    await fetch(`${HUB}/api/save-proxy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ github_login: GITHUB_LOGIN, proxy_url: proxyUrl }),
    });
    console.log(`✅ 프록시 등록 완료 (${HUB})`);
  } catch (e) {
    console.log(`⚠️  프록시 등록 실패: ${e.message}`);
  }

  console.log("   Storybook에서 AI 명령 입력하면 바로 처리됩니다.\n");
});
