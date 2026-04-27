#!/usr/bin/env node
// ai-worker.mjs — Claude Code 로컬 워커
// alfred-agent 허브를 폴링 → 명령 수신 → Claude CLI 실행 → 결과 허브에 저장

import http from "http";
import { spawnSync } from "child_process";

const HUB          = "https://alfred-agent-nine.vercel.app";
const GITHUB_LOGIN = "hyoseob-r";
const PORT         = 3721;
const POLL_MS      = 2000;

const SYSTEM_PROMPT = `당신은 모바일 앱 화면 생성 AI입니다.
사용자의 명령을 받아서 시뮬레이터에 렌더링할 수 있는 items[] JSON 배열을 생성합니다.

디바이스 캔버스: 너비 390px, 높이 844px, 좌상단 (0,0) 기준

사용 가능한 item 타입:

frame (컨테이너/배경/카드):
{ "id": 숫자, "type": "frame", "x": 숫자, "y": 숫자, "w": 숫자, "h": 숫자, "frameBg": "#색상 또는 linear-gradient(...)", "frameBorder": "#색상 또는 transparent", "frameRadius": 숫자 }

text (텍스트):
{ "id": 숫자, "type": "text", "x": 숫자, "y": 숫자, "w": 숫자, "h": 숫자, "content": "내용", "style": "meta_sf_body1", "color": "#색상" }
style 옵션: meta_sf_title1(28px bold), meta_sf_title2(22px bold), meta_sf_title3(17px bold), meta_sf_body1(15px), meta_sf_body2(13px), meta_sf_caption1(11px)

규칙:
- id는 1001부터 순차 숫자
- 상태바: y=0~52 (흰 frame)
- 탭바: y=780~844 (하단 고정)
- 콘텐츠: y=52~780
- 요기요 메인 색상: #FA0050
- 카드: frameBg #ffffff, frameBorder #eeeeee, frameRadius 12
- 이모지로 아이콘 대체

반드시 JSON 배열만 출력. 설명이나 마크다운 코드블록 없이 [ 로 시작해서 ] 로 끝나는 순수 JSON만.`;

function generateScreen(command) {
  const fullPrompt = `다음 화면을 그려주세요: ${command}\n\n반드시 JSON 배열만 출력. [ 로 시작해서 ] 로 끝나는 순수 JSON만.`;

  const r = spawnSync("/usr/local/bin/claude", [
    "--print",
    "--dangerously-skip-permissions",
    "--allowedTools", "",
    "--system-prompt", SYSTEM_PROMPT,
    fullPrompt,
  ], {
    encoding: "utf-8",
    timeout: 180000,
    maxBuffer: 8 * 1024 * 1024,
    env: { ...process.env, HOME: "/Users/h", PATH: `/usr/local/bin:/usr/bin:/bin:${process.env.PATH || ""}` },
  });

  if (r.error) { console.error("⚠ spawn error:", r.error.message); return null; }
  if (r.status !== 0) { console.error("⚠ Claude exit:", r.status, r.stderr?.slice(0, 300)); return null; }

  const jsonMatch = (r.stdout || "").match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    try {
      const items = JSON.parse(jsonMatch[0]);
      if (Array.isArray(items) && items.length > 0) return items;
    } catch {}
  }
  console.error("⚠ JSON 파싱 실패:", r.stdout?.slice(0, 300));
  return null;
}

// ── 허브 폴링 루프 ────────────────────────────────────────────────────────────
let lastCommandTs = 0;
let busy = false;

async function pollHub() {
  if (busy) return;
  try {
    const res  = await fetch(`${HUB}/api/ai-queue?role=claude`);
    const data = await res.json();
    if (!data?.command || !data?.ts) return;
    if (data.ts <= lastCommandTs) return; // 이미 처리한 명령

    busy = true;
    lastCommandTs = data.ts;
    const { command } = data;
    console.log(`\n📥 명령: "${command}"`);
    console.log("⏳ Claude가 화면 생성 중...");

    const items = generateScreen(command);

    if (items) {
      console.log(`✅ ${items.length}개 아이템 생성 완료`);
      await fetch(`${HUB}/api/ai-queue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "result", payload: { items, ts: data.ts } }),
      });
    } else {
      console.error("⚠ 생성 실패 — 결과 없음");
      await fetch(`${HUB}/api/ai-queue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "result", payload: { error: "생성 실패", ts: data.ts } }),
      });
    }
  } catch (e) {
    console.error("⚠ 허브 통신 오류:", e.message);
  } finally {
    busy = false;
  }
}

// ── 상태 확인용 HTTP 서버 (포트 3721) ────────────────────────────────────────
const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, service: "storybook-ai-worker", busy }));
    return;
  }
  res.writeHead(404); res.end();
});

server.listen(PORT, async () => {
  console.log(`🤖 AI Worker 시작 — 허브 폴링 모드`);
  // 허브에 프록시 등록 (기존 호환)
  try {
    await fetch(`${HUB}/api/save-proxy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ github_login: GITHUB_LOGIN, proxy_url: `http://localhost:${PORT}` }),
    });
    console.log("✅ 허브 등록 완료");
  } catch (e) {
    console.log(`⚠️  허브 등록 실패: ${e.message}`);
  }
  console.log(`   ${HUB} 폴링 중...\n`);
  setInterval(pollHub, POLL_MS);
});
