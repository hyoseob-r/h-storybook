// Figma → Code Generation Engine
// Ported from alfred-agent/src/components/FigmaPreviewBubble.jsx

const PROXY_URL = "https://alfred-agent-nine.vercel.app/api/chat";
const MAX_ITER = 2;

// ── YDS 토큰 텍스트 (프롬프트용) ────────────────────────────────────────────
const YDS_TOKENS = `
=== YDS 2.0 디자인 토큰 (반드시 반영) ===

[컬러]
primary=#fa0050 (요기요 레드/CTA), primary_i=#ff3072
secondary=#0c74e4 (파랑), secondary_i=#1f8bff
green=#05947f, yellow=#ffcb2e, white=#ffffff, black=#000000
primary_a_100=#feccdc, primary_b=#28343c, primary_b_100=#dee5ea
accent=#0c80e4, accent_100=#c5e2fb
ygy_green=#05947f, ygy_orange=#f04600
gray800=#333333(본문텍스트), gray600=#666666, gray400=#999999
gray250=#bfbfbf, gray100=#e5e5e5, gray50=#f2f2f2, gray25=#f6f6f6
bg_primary=#ffffff, bg_bottom=#f2f2f2
dim1=#000000e5, dim2=#00000099
variant_primary25=#fff5f8, variant_primary50=#ffe6ee, variant_primary800=#640020
variant_secondary25=#f0f7fa, variant_green25=#f0f7f6, variant_red25=#fef4f4

[타이포그래피] size/weight/lineHeight
10r: 10/400/14,  10b: 10/700/14
12r: 12/400/16,  12b: 12/700/16
13r: 13/400/18,  13b: 13/700/18
14r: 14/400/19 (기본),  14b: 14/700/19
16r: 16/400/22,  16b: 16/700/22
18b: 18/700/24,  20b: 20/700/27
24b: 24/700/32,  32b: 32/700/43
폰트: SD Neo Gothic, Pretendard, sans-serif

[스페이싱] (px)
s1:2, s2:4, s3:6, s4:8, s5:10, s6:12
s7:16, s8:20, s9:24, s10:28, s11:32, s12:36, s13:40

[라디우스] (px)
r0:0, r1:4, r2:8, r3:10, r4:12, r5:16, r6:20, rfull:360

[그림자]
level0: none
level1: 0 1px 8px rgba(25,48,64,0.10), 0 0 2px rgba(25,48,64,0.08)
level2: 0 2px 12px rgba(25,48,64,0.24), 0 0 4px rgba(25,48,64,0.12)
================================`;

const SCROLL_RULES = `- 스크롤 규칙 (반드시 적용):
  * scroll:overflow-x:scroll 또는 "가로 스크롤" → style={{ display:"flex", overflowX:"auto", WebkitOverflowScrolling:"touch" }}, 자식: style={{ flexShrink:0 }}
  * scroll:overflow-y:scroll 또는 "세로 스크롤" → style={{ overflowY:"auto", WebkitOverflowScrolling:"touch" }}
  * scroll:overflow:scroll 또는 "양방향 스크롤" → style={{ overflow:"auto" }}`;

const FORMAT_PROMPT = `구현 규칙:
- React 함수형 컴포넌트 (export default function ComponentName)
- colors와 metaTokens는 전역 변수로 주입됨. import 문 작성 금지. 바로 사용 가능.
- 모든 스타일은 style={{}} inline 객체. 색상·간격·라디우스·그림자는 반드시 아래 토큰 값으로 참조.
- 한국어 현실적 콘텐츠
- 이미지: https://picsum.photos/[w]/[h]?random=[n] 실제 URL 사용
${SCROLL_RULES}
${YDS_TOKENS}
[React 토큰 사용법]
색상: colors.foundation.primary.value 또는 "#fa0050" 하드코딩
타이포: fontSize:metaTokens.typography.meta_sf_14_r.size, fontWeight:metaTokens.typography.meta_sf_14_r.weight, lineHeight:metaTokens.typography.meta_sf_14_r.lineHeight+"px"
스페이싱: padding:metaTokens.spacing.meta_s4 (숫자, px 불필요)
라디우스: borderRadius:metaTokens.radius.meta_r4
그림자: boxShadow:metaTokens.elevation.meta_level_1.css
⚠️ 응답 형식: JSX 코드만 반환. 설명·주석·마크다운 절대 금지. 첫 줄: export default function`;

// ── YDS 토큰 JSON (iframe 프리뷰용) ────────────────────────────────────────
export const YDS_TOKENS_JSON = JSON.stringify({
  metaTokens: {
    typography: {
      meta_sf_10_r:{size:10,weight:400,lineHeight:14},meta_sf_10_b:{size:10,weight:700,lineHeight:14},
      meta_sf_12_r:{size:12,weight:400,lineHeight:16},meta_sf_12_b:{size:12,weight:700,lineHeight:16},
      meta_sf_13_r:{size:13,weight:400,lineHeight:18},meta_sf_13_b:{size:13,weight:700,lineHeight:18},
      meta_sf_14_r:{size:14,weight:400,lineHeight:19},meta_sf_14_b:{size:14,weight:700,lineHeight:19},
      meta_sf_16_r:{size:16,weight:400,lineHeight:22},meta_sf_16_b:{size:16,weight:700,lineHeight:22},
      meta_sf_18_r:{size:18,weight:400,lineHeight:24},meta_sf_18_b:{size:18,weight:700,lineHeight:24},
      meta_sf_20_r:{size:20,weight:400,lineHeight:27},meta_sf_20_b:{size:20,weight:700,lineHeight:27},
      meta_sf_24_r:{size:24,weight:400,lineHeight:32},meta_sf_24_b:{size:24,weight:700,lineHeight:32},
    },
    spacing: { meta_s1:2,meta_s2:4,meta_s3:6,meta_s4:8,meta_s5:10,meta_s6:12,meta_s7:16,meta_s8:20,meta_s9:24,meta_s10:28,meta_s11:32,meta_s12:36,meta_s13:40 },
    radius: { rfull:360,meta_r0:0,meta_r1:4,meta_r2:8,meta_r3:10,meta_r4:12,meta_r5:16,meta_r6:20 },
    elevation: { meta_level_0:{css:"none"},meta_level_1:{css:"0 1px 8px rgba(25,48,64,0.10), 0 0 2px rgba(25,48,64,0.08)"},meta_level_2:{css:"0 2px 12px rgba(25,48,64,0.24), 0 0 4px rgba(25,48,64,0.12)"} },
  },
  colors: {
    foundation: { primary:{value:"#fa0050"},primary_i:{value:"#ff3072"},secondary:{value:"#0c74e4"},secondary_i:{value:"#1f8bff"},green:{value:"#05947f"},yellow:{value:"#ffcb2e"},white:{value:"#ffffff"},black:{value:"#000000"} },
    light: { primary_a:{value:"#fa0050"},primary_a_100:{value:"#feccdc"},primary_b:{value:"#28343c"},primary_b_100:{value:"#dee5ea"},accent:{value:"#0c80e4"},accent_100:{value:"#c5e2fb"},ygy_green:{value:"#05947f"},ygy_orange:{value:"#f04600"} },
    gray: { gray800:{value:"#333333"},gray600:{value:"#666666"},gray400:{value:"#999999"},gray250:{value:"#bfbfbf"},gray100:{value:"#e5e5e5"},gray50:{value:"#f2f2f2"},gray25:{value:"#f6f6f6"} },
    background: { primary:{value:"#ffffff"},bottom:{value:"#f2f2f2"},dim1:{value:"#000000e5"},dim2:{value:"#00000099"} },
    variant: { primary25:{value:"#fff5f8"},primary50:{value:"#ffe6ee"},primary800:{value:"#640020"},secondary25:{value:"#f0f7fa"},green25:{value:"#f0f7f6"},red25:{value:"#fef4f4"},yellow25:{value:"#fff9f0"} },
  },
});

// ── URL 파싱 ─────────────────────────────────────────────────────────────────
export function parseFigmaUrl(url) {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/");
    const idx = parts.findIndex(p => p === "design" || p === "file");
    if (idx < 0) return null;
    const fileKey = parts[idx + 1];
    const rawNode = u.searchParams.get("node-id");
    const nodeId = rawNode ? rawNode.replace(/-/g, ":") : null;
    return fileKey ? { fileKey, nodeId } : null;
  } catch { return null; }
}

// ── Figma API ────────────────────────────────────────────────────────────────
export async function fetchFigmaImageUrl(fileKey, nodeId, token) {
  const resp = await fetch(
    `https://api.figma.com/v1/images/${fileKey}?ids=${encodeURIComponent(nodeId)}&format=png&scale=2`,
    { headers: { "X-Figma-Token": token } }
  );
  if (!resp.ok) throw new Error(`Figma API ${resp.status} — 토큰을 확인해 주세요.`);
  const data = await resp.json();
  if (data.err) throw new Error(`Figma: ${data.err}`);
  const imgUrl = data.images?.[nodeId];
  if (!imgUrl) throw new Error("Figma 이미지 URL을 받지 못했습니다.");
  return imgUrl;
}

export async function fetchFigmaNodeData(fileKey, nodeId, token) {
  const resp = await fetch(
    `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${encodeURIComponent(nodeId)}&geometry=paths`,
    { headers: { "X-Figma-Token": token } }
  );
  if (!resp.ok) throw new Error(`Figma 노드 API ${resp.status}`);
  const data = await resp.json();
  const nodes = data.nodes;
  if (!nodes) throw new Error("Figma 노드 데이터 없음");
  const nodeKey = Object.keys(nodes)[0];
  return nodes[nodeKey]?.document;
}

// ── 색상 변환 ────────────────────────────────────────────────────────────────
function colorStr(c) {
  if (!c) return "transparent";
  const r = Math.round((c.r || 0) * 255);
  const g = Math.round((c.g || 0) * 255);
  const b = Math.round((c.b || 0) * 255);
  const a = c.a !== undefined ? c.a : 1;
  if (a >= 0.99) return `#${r.toString(16).padStart(2,"0")}${g.toString(16).padStart(2,"0")}${b.toString(16).padStart(2,"0")}`;
  return `rgba(${r},${g},${b},${a.toFixed(2)})`;
}

// ── Figma 노드 → 디자인 스펙 텍스트 ────────────────────────────────────────
export function nodeToSpec(node, depth = 0, parentBb = null, parentHasAutoLayout = false) {
  if (!node || depth > 5) return "";
  const indent = "  ".repeat(depth);
  const lines = [];
  const bb = node.absoluteBoundingBox;
  const size = bb ? ` (${Math.round(bb.width)}×${Math.round(bb.height)}px)` : "";
  lines.push(`${indent}[${node.type}] "${node.name}"${size}`);

  const hasAutoLayout = !!(node.layoutMode && node.layoutMode !== "NONE");

  if (hasAutoLayout) {
    const dir = node.layoutMode === "HORIZONTAL" ? "row" : "column";
    const pad = node.paddingTop !== undefined
      ? ` padding:${node.paddingTop}/${node.paddingRight}/${node.paddingBottom}/${node.paddingLeft}px` : "";
    const gap = node.itemSpacing ? ` gap:${Math.round(node.itemSpacing)}px` : "";
    const main = node.primaryAxisAlignItems ? ` mainAxis:${node.primaryAxisAlignItems}` : "";
    const cross = node.counterAxisAlignItems ? ` crossAxis:${node.counterAxisAlignItems}` : "";
    lines.push(`${indent}  flex:${dir}${pad}${gap}${main}${cross}`);
  }

  // 스크롤 방향
  const scrollMap = {
    "HORIZONTAL": "overflow-x:scroll (가로 스크롤)",
    "HORIZONTAL_SCROLLING": "overflow-x:scroll (가로 스크롤)",
    "VERTICAL": "overflow-y:scroll (세로 스크롤)",
    "VERTICAL_SCROLLING": "overflow-y:scroll (세로 스크롤)",
    "HORIZONTAL_AND_VERTICAL": "overflow:scroll (양방향 스크롤)",
    "HORIZONTAL_AND_VERTICAL_SCROLLING": "overflow:scroll (양방향 스크롤)",
  };
  if (node.overflowDirection && node.overflowDirection !== "NONE") {
    lines.push(`${indent}  scroll:${scrollMap[node.overflowDirection] || node.overflowDirection}`);
  } else if (node.clipsContent && hasAutoLayout && node.layoutMode === "HORIZONTAL" && bb) {
    const children = node.children || [];
    const spacing = node.itemSpacing || 0;
    const totalChildW = children.reduce((s, c) => s + (c.absoluteBoundingBox?.width || 0), 0)
                        + Math.max(0, children.length - 1) * spacing;
    if (totalChildW > bb.width * 1.1) {
      lines.push(`${indent}  scroll:overflow-x:scroll (가로 스크롤)`);
    }
  }

  // 절대 위치
  if (bb && parentBb) {
    const isAbsoluteChild = node.layoutPositioning === "ABSOLUTE" || !parentHasAutoLayout;
    if (isAbsoluteChild) {
      const top = Math.round(bb.y - parentBb.y);
      const left = Math.round(bb.x - parentBb.x);
      lines.push(`${indent}  position:absolute top:${top}px left:${left}px`);
    }
  }
  if (!hasAutoLayout && (node.children || []).length > 0) {
    lines.push(`${indent}  layout:absolute-container (use position:relative on this element)`);
  }

  const solidFills = (node.fills || []).filter(f => f.visible !== false && f.type === "SOLID");
  if (solidFills.length) lines.push(`${indent}  background:${solidFills.map(f => colorStr(f.color)).join(", ")}`);

  const solidStrokes = (node.strokes || []).filter(s => s.type === "SOLID");
  if (solidStrokes.length) lines.push(`${indent}  border:${solidStrokes.map(s => `${colorStr(s.color)} ${node.strokeWeight || 1}px`).join(", ")}`);

  if (node.cornerRadius) lines.push(`${indent}  borderRadius:${node.cornerRadius}px`);

  (node.effects || []).filter(e => e.visible !== false && e.type === "DROP_SHADOW").forEach(e => {
    lines.push(`${indent}  shadow:${e.offset?.x || 0}px ${e.offset?.y || 0}px ${e.radius || 0}px ${colorStr(e.color)}`);
  });

  if (node.type === "TEXT") {
    const s = node.style || {};
    lines.push(`${indent}  text:"${(node.characters || "").slice(0, 80)}"`);
    lines.push(`${indent}  font:${s.fontFamily || "unknown"} weight:${s.fontWeight || 400} size:${s.fontSize || 14}px`);
    if (s.lineHeightPx) lines.push(`${indent}  lineHeight:${Math.round(s.lineHeightPx)}px`);
    if (s.letterSpacing) lines.push(`${indent}  letterSpacing:${s.letterSpacing}px`);
    const tc = solidFills[0];
    if (tc) lines.push(`${indent}  color:${colorStr(tc.color)}`);
    if (s.textAlignHorizontal) lines.push(`${indent}  textAlign:${s.textAlignHorizontal}`);
  }

  (node.children || []).forEach(child => {
    const childSpec = nodeToSpec(child, depth + 1, bb, hasAutoLayout);
    if (childSpec) lines.push(childSpec);
  });

  return lines.join("\n");
}

// ── 스트리밍 코드 생성 (alfred-agent proxy 경유) ────────────────────────────
export async function generateCode(spec, onChunk) {
  const resp = await fetch(PROXY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      stream: true,
      messages: [{
        role: "user",
        content: `${FORMAT_PROMPT}\n\n=== Figma 디자인 스펙 ===\n${spec}\n=========================\n\n위 스펙을 React + YDS 코드로 구현해줘. 코드만 반환. 설명·요약·마크다운 금지.`,
      }],
    }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error?.message || `API 오류 (${resp.status})`);
  }

  let full = "";
  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop();
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6);
      if (data === "[DONE]") continue;
      try {
        const parsed = JSON.parse(data);
        const delta = parsed.delta?.text || "";
        if (delta) {
          full += delta;
          onChunk?.(full);
        }
      } catch {}
    }
  }

  return full.replace(/^```[\w]*\n?/i, "").replace(/\n?```\s*$/i, "").trim();
}

// ── 검증/수정 ────────────────────────────────────────────────────────────────
export async function compareAndFix(spec, currentCode, onChunk) {
  const resp = await fetch(PROXY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      stream: true,
      messages: [{
        role: "user",
        content: `Figma 스펙과 React + YDS 코드를 비교해서:
- 스펙과 일치하면 → DONE 한 단어만 반환
- 차이가 있으면 → 수정된 전체 코드만 반환 (설명·마크다운 절대 금지, 첫 줄부터 바로 코드 시작)

=== Figma 스펙 ===
${spec}
==================

=== 현재 코드 ===
${currentCode.slice(0, 8000)}
=================`,
      }],
    }),
  });

  if (!resp.ok) throw new Error(`검증 API 오류 (${resp.status})`);

  let full = "";
  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop();
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6);
      if (data === "[DONE]") continue;
      try {
        const parsed = JSON.parse(data);
        const delta = parsed.delta?.text || "";
        if (delta) {
          full += delta;
          onChunk?.(delta, full);
        }
      } catch {}
    }
  }

  const text = full.trim();
  const lines2 = text.split("\n").map(l => l.trim());
  const hasDone = lines2.some(l => l === "DONE" || l.startsWith("DONE"));

  if (hasDone) {
    const doneIdx = lines2.findIndex(l => l === "DONE" || l.startsWith("DONE"));
    const analysis = lines2.slice(0, doneIdx).join("\n").trim();
    return { done: true, code: currentCode, analysis };
  }

  const codeBlockMatch = text.match(/```[\w]*\n?([\s\S]*?)\n?```/);
  const rawCode = codeBlockMatch ? codeBlockMatch[1] : text;
  const code = rawCode.trim();
  const isValid = code.includes("export") || code.includes("function") || code.includes("=>");
  if (!isValid) return { done: true, code: currentCode, analysis: "" };
  return { done: false, code, analysis: "" };
}

// ── React 코드 → iframe HTML ────────────────────────────────────────────────
export function buildPreviewHtml(code) {
  const nameMatch = code.match(/export\s+default\s+function\s+(\w+)/) || code.match(/function\s+(\w+)\s*\(/g);
  const compName = nameMatch ? (nameMatch[1] || nameMatch[0]?.match(/function\s+(\w+)/)?.[1]) : null;

  const cleanCode = code
    .replace(/^import\s+.*?;?\s*$/gm, "")
    .replace(/export\s+default\s+/g, "")
    .replace(/export\s+\{[^}]*\}/g, "")
    .split("\n").filter(line => {
      const t = line.trim();
      if (!t || t.startsWith("//") || t.startsWith("/*") || t.startsWith("*")) return true;
      if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(t) && !/^(const|let|var|return|if|for|\/\/|\/\*|\*|function|class|export|import|{|}|"|'|`|\[|\(|\/\/)/.test(t)) return false;
      return true;
    }).join("\n");

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css" rel="stylesheet">
<script src="https://unpkg.com/react@18/umd/react.development.js"><\/script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"><\/script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
<script>const _t = ${YDS_TOKENS_JSON}; window.metaTokens = _t.metaTokens; window.colors = _t.colors;<\/script>
<style>*{box-sizing:border-box;}body{margin:0;padding:16px;background:#ffffff;font-family:'Pretendard',sans-serif;}</style>
</head>
<body><div id="root"></div>
<script type="text/babel">
const { useState, useEffect, useRef } = React;
const { metaTokens, colors } = window;
${cleanCode}

const _comp = typeof ${compName} !== 'undefined' ? ${compName}
  : typeof Component !== 'undefined' ? Component
  : typeof App !== 'undefined' ? App
  : () => React.createElement('div', null, '컴포넌트를 찾을 수 없습니다.');

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(_comp));
<\/script>
<script>
document.addEventListener('error', function(e) {
  if (e.target.tagName !== 'IMG') return;
  const w = Math.round(e.target.offsetWidth) || 80;
  const h = Math.round(e.target.offsetHeight) || 80;
  e.target.src = 'https://picsum.photos/' + w + '/' + h + '?random=' + Math.floor(Math.random() * 200);
  e.target.onerror = null;
}, true);
<\/script>
</body>
</html>`;
}

export { MAX_ITER };
