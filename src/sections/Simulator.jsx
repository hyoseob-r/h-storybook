import React, { useState, useRef, useEffect } from "react";
import { colors, typography, metaTokens } from "../tokens";
import { YdsIcon, ICON_NAMES } from "../icons.jsx";
import { fetchComponents, saveComponent, deleteComponent, renameComponent } from "../supabase.js";
import { useToast } from "../shared/ui.jsx";

// shapeStyle → 허용된 colorStyle (YDS 2.0 스펙)
const ALLOWED_COLORS = {
  filled:   ["primary_v2"],
  outlined: ["primary_v2", "gray250_v2"],
  text:     ["gray_v2"],
};

// ── Device definitions ────────────────────────────────────────────────────────

const DEVICES = {
  ios: [
    { name: "iPhone SE (3rd)",     w: 375, h: 667 },
    { name: "iPhone 13 mini",      w: 360, h: 780 },
    { name: "iPhone 13",           w: 390, h: 844 },
    { name: "iPhone 13 Pro",       w: 390, h: 844 },
    { name: "iPhone 13 Pro Max",   w: 428, h: 926 },
    { name: "iPhone 14",           w: 390, h: 844 },
    { name: "iPhone 14 Plus",      w: 428, h: 926 },
    { name: "iPhone 14 Pro",       w: 393, h: 852 },
    { name: "iPhone 14 Pro Max",   w: 430, h: 932 },
    { name: "iPhone 15",           w: 393, h: 852 },
    { name: "iPhone 15 Plus",      w: 430, h: 932 },
    { name: "iPhone 15 Pro",       w: 393, h: 852 },
    { name: "iPhone 15 Pro Max",   w: 430, h: 932 },
    { name: "iPhone 16",           w: 393, h: 852 },
    { name: "iPhone 16 Plus",      w: 430, h: 932 },
    { name: "iPhone 16 Pro",       w: 402, h: 874 },
    { name: "iPhone 16 Pro Max",   w: 440, h: 956 },
  ],
  android: [
    { name: "Nokia 1 (320dp)",     w: 320, h: 569  },
    { name: "Galaxy A54 (360dp)",  w: 360, h: 780  },
    { name: "Galaxy S20 (412dp)",  w: 412, h: 915  },
  ],
};

// ── Section: Simulator ────────────────────────────────────────────────────────

const MAX_FRAME_H = 560;

function PhoneFrame({ platform, device, children, canvasMode, darkMode = false }) {
  const isIOS = platform === "ios";
  const scale = MAX_FRAME_H / device.h;
  const fw = Math.round(device.w * scale);
  const fh = MAX_FRAME_H;
  const border = isIOS ? 10 : 8;
  const radius = isIOS ? Math.round(48 * scale) : Math.round(36 * scale);
  // 폰 전체를 실제 dp 크기로 렌더링 후 scale로 축소
  const totalW = device.w + border * 2;
  const totalH = device.h + border * 2;
  const screenBg  = darkMode ? "#1d1d1d" : "#ffffff";
  const statusBg  = darkMode ? "#1d1d1d" : "#ffffff";
  const statusFg  = darkMode ? "#ffffff" : "#000000";
  const homeBg    = darkMode ? "#1d1d1d" : "#ffffff";
  const homeBar   = darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
      {/* Device label */}
      <div style={{ fontSize: "10px", color: "#aaaaaa", letterSpacing: "0.1em" }}>
        {device.name} · {device.w} × {device.h}dp
      </div>
      {/* Layout placeholder — actual size after scale */}
      <div style={{ width: `${totalW * scale}px`, height: `${totalH * scale}px`, position: "relative", flexShrink: 0 }}>
        {/* Phone at full dp size, scaled down */}
        <div style={{ transformOrigin: "top left", transform: `scale(${scale})`, position: "absolute", top: 0, left: 0, width: `${totalW}px` }}>
          <div style={{ position: "relative", width: `${device.w}px` }}>
            {/* Phone shell */}
            <div style={{
              width: `${device.w}px`, height: `${device.h}px`, borderRadius: isIOS ? "48px" : "36px",
              background: isIOS ? "#1a1a1a" : "#111",
              border: `${border}px solid ${isIOS ? "#2a2a2a" : "#222"}`,
              boxShadow: "0 30px 80px rgba(0,0,0,0.6), inset 0 0 0 1px #333",
              display: "flex", flexDirection: "column", overflow: "hidden", position: "relative"
            }}>
              {/* Status bar */}
              {isIOS ? (
                <div style={{ height: "44px", background: statusBg, display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 24px 8px", flexShrink: 0 }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: statusFg, fontFamily: "system-ui" }}>9:41</span>
                  <div style={{ width: "100px", height: "26px", background: "#111", borderRadius: "20px", position: "absolute", left: "50%", transform: "translateX(-50%)", top: "0" }} />
                  <span style={{ fontSize: "9px", color: statusFg }}>●●● WiFi 🔋</span>
                </div>
              ) : (
                <div style={{ height: "28px", background: statusBg, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", flexShrink: 0 }}>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: statusFg, fontFamily: "Roboto, sans-serif" }}>9:41</span>
                  <span style={{ fontSize: "8px", color: statusFg }}>▲▲▲ WiFi 🔋</span>
                </div>
              )}
              {/* Screen content */}
              <div style={{ flex: 1, background: screenBg, position: "relative", overflow: "auto" }}>
                {children}
              </div>
              {/* Home indicator */}
              {isIOS ? (
                <div style={{ height: "28px", background: homeBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: "100px", height: "4px", background: homeBar, borderRadius: "2px" }} />
                </div>
              ) : (
                <div style={{ height: "36px", background: homeBg, display: "flex", alignItems: "center", justifyContent: "center", gap: "20px" }}>
                  <span style={{ fontSize: "14px", color: statusFg, opacity: 0.4 }}>◁</span>
                  <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: `1.5px solid ${statusFg}`, opacity: 0.4 }} />
                  <span style={{ fontSize: "12px", color: statusFg, opacity: 0.4 }}>□</span>
                </div>
              )}
            </div>
            {/* Side buttons */}
            {isIOS ? (
              <>
                <div style={{ position: "absolute", right: `-${border+4}px`, top: "100px", width: "3px", height: "60px", background: "#2a2a2a", borderRadius: "2px" }} />
                <div style={{ position: "absolute", left: `-${border+4}px`, top: "90px",  width: "3px", height: "32px", background: "#2a2a2a", borderRadius: "2px" }} />
                <div style={{ position: "absolute", left: `-${border+4}px`, top: "135px", width: "3px", height: "52px", background: "#2a2a2a", borderRadius: "2px" }} />
                <div style={{ position: "absolute", left: `-${border+4}px`, top: "200px", width: "3px", height: "52px", background: "#2a2a2a", borderRadius: "2px" }} />
              </>
            ) : (
              <>
                <div style={{ position: "absolute", right: `-${border+4}px`, top: "80px",  width: "3px", height: "44px", background: "#222", borderRadius: "2px" }} />
                <div style={{ position: "absolute", left: `-${border+4}px`, top: "110px", width: "3px", height: "32px", background: "#222", borderRadius: "2px" }} />
                <div style={{ position: "absolute", left: `-${border+4}px`, top: "155px", width: "3px", height: "52px", background: "#222", borderRadius: "2px" }} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Figma JSON → React renderer ──────────────────────────────────────────────

function figmaRGBA(c, opacity = 1) {
  if (!c) return "transparent";
  return `rgba(${Math.round(c.r*255)},${Math.round(c.g*255)},${Math.round(c.b*255)},${((c.a??1)*(opacity??1)).toFixed(3)})`;
}

function figmaFill(fills) {
  if (!fills?.length) return undefined;
  const f = fills.find(f => f.visible !== false);
  if (!f) return undefined;
  if (f.type === "SOLID") return figmaRGBA(f.color, f.opacity);
  if (f.type === "GRADIENT_LINEAR") {
    const stops = f.gradientStops.map(s => `${figmaRGBA(s.color)} ${Math.round(s.position*100)}%`).join(", ");
    return `linear-gradient(${stops})`;
  }
  if (f.type === "GRADIENT_RADIAL") {
    const stops = f.gradientStops.map(s => `${figmaRGBA(s.color)} ${Math.round(s.position*100)}%`).join(", ");
    return `radial-gradient(${stops})`;
  }
  if (f.type === "IMAGE") return "#e8e8e8"; // 이미지 fills → 회색 플레이스홀더
  return undefined;
}

function figmaImageFill(fills) {
  if (!fills?.length) return null;
  return fills.find(f => f.visible !== false && f.type === "IMAGE") || null;
}

function figmaNodeToStyle(node, ox, oy) {
  const b = node.absoluteBoundingBox;
  const s = {
    position: "absolute",
    left:   b ? b.x - ox : 0,
    top:    b ? b.y - oy : 0,
    width:  b ? b.width  : "auto",
    height: b ? b.height : "auto",
    boxSizing: "border-box",
    // clipsContent가 명시적으로 true인 노드만 overflow:hidden
    overflow: node.clipsContent === true ? "hidden" : "visible",
  };
  if (node.opacity !== undefined && node.opacity < 1) s.opacity = node.opacity;
  if (node.cornerRadius) s.borderRadius = node.cornerRadius;
  if (Array.isArray(node.rectangleCornerRadii)) {
    const [tl, tr, br, bl] = node.rectangleCornerRadii;
    s.borderRadius = `${tl}px ${tr}px ${br}px ${bl}px`;
  }
  const bg = figmaFill(node.fills);
  if (bg) s.background = bg;
  if (node.strokes?.length && node.strokeWeight) {
    const sc = node.strokes.find(s => s.visible !== false);
    if (sc?.color) s.border = `${node.strokeWeight}px solid ${figmaRGBA(sc.color)}`;
  }
  const shadows = (node.effects || [])
    .filter(e => e.visible !== false && (e.type === "DROP_SHADOW" || e.type === "INNER_SHADOW"))
    .map(e => `${e.type==="INNER_SHADOW"?"inset ":""}${e.offset?.x??0}px ${e.offset?.y??0}px ${e.radius??0}px ${e.spread??0}px ${figmaRGBA(e.color)}`);
  if (shadows.length) s.boxShadow = shadows.join(", ");
  return s;
}

function RenderFigmaNode({ node, ox, oy }) {
  if (node.visible === false) return null;
  const style = figmaNodeToStyle(node, ox, oy);

  if (node.type === "TEXT") {
    const ts = node.style || {};
    const textColor = figmaFill(node.fills);
    return (
      <div style={{
        ...style,
        background: "none",
        overflow: "visible",
        fontSize: ts.fontSize || 14,
        fontWeight: ts.fontWeight || 400,
        lineHeight: ts.lineHeightPx ? `${ts.lineHeightPx}px` : "normal",
        letterSpacing: ts.letterSpacing ? `${ts.letterSpacing}px` : undefined,
        textAlign: (ts.textAlignHorizontal || "LEFT").toLowerCase(),
        color: textColor || "#000",
        whiteSpace: "pre-wrap",
        fontFamily: "Pretendard, system-ui, sans-serif",
      }}>
        {node.characters}
      </div>
    );
  }

  if (node.type === "ELLIPSE") {
    return <div style={{ ...style, borderRadius: "50%" }} />;
  }

  // VECTOR, BOOLEAN_OPERATION, STAR, POLYGON → fill color로 채운 박스 (아이콘 placeholder)
  if (node.type === "VECTOR" || node.type === "BOOLEAN_OPERATION" || node.type === "STAR" || node.type === "POLYGON") {
    const fillColor = figmaFill(node.fills) || figmaFill(node.strokes) || "rgba(0,0,0,0.15)";
    return <div style={{ ...style, background: fillColor, borderRadius: style.borderRadius || 2 }} />;
  }

  // LINE → 얇은 선
  if (node.type === "LINE") {
    const strokeColor = figmaFill(node.strokes) || "#ccc";
    return <div style={{ ...style, background: strokeColor, height: Math.max(style.height, 1) }} />;
  }

  // RECTANGLE, FRAME, GROUP, COMPONENT, INSTANCE, COMPONENT_SET → 자식 렌더
  // 이미지 fill이 있으면 회색 플레이스홀더 오버레이
  const imgFill = figmaImageFill(node.fills);
  const children = node.children || [];

  return (
    <div style={style}>
      {imgFill && children.length === 0 && (
        <div style={{ position:"absolute", inset:0, background:"#d0d0d0", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontSize:"10px", color:"#999" }}>🖼</span>
        </div>
      )}
      {children.map((child, i) => (
        <RenderFigmaNode key={`${child.id||i}`} node={child} ox={ox} oy={oy} />
      ))}
    </div>
  );
}

// ── Draft utils (Supabase) ───────────────────────────────────────────────────
// DB row → app 포맷 변환
function rowToDraft(row) {
  return { id: row.id, name: row.name, svgData: row.svg_data, w: row.w, h: row.h, createdAt: row.created_at };
}

// ── SVG dimension extractor ──────────────────────────────────────────────────
function extractSvgSize(svgStr) {
  const wMatch = svgStr.match(/\bwidth="([^"]+)"/);
  const hMatch = svgStr.match(/\bheight="([^"]+)"/);
  const vbMatch = svgStr.match(/viewBox="([^"]+)"/);
  let w = wMatch ? parseFloat(wMatch[1]) : 0;
  let h = hMatch ? parseFloat(hMatch[1]) : 0;
  if ((!w || !h) && vbMatch) {
    const parts = vbMatch[1].split(/[\s,]+/);
    if (!w) w = parseFloat(parts[2]) || 100;
    if (!h) h = parseFloat(parts[3]) || 100;
  }
  return { w: w || 100, h: h || 100 };
}

// ── Figma URL 파싱 유틸 ───────────────────────────────────────────────────────
function parseFigmaUrl(url) {
  try {
    const u = new URL(url.trim());
    const parts = u.pathname.split("/").filter(Boolean);
    // /design/{fileKey}/... or /file/{fileKey}/...
    const keyIdx = parts.findIndex(p => p === "design" || p === "file" || p === "proto");
    if (keyIdx === -1 || keyIdx + 1 >= parts.length) return null;
    const fileKey = parts[keyIdx + 1];
    const rawId = u.searchParams.get("node-id") || u.searchParams.get("nodeId") || null;
    const nodeId = rawId ? rawId.replace(/-/g, ":") : null;
    return { fileKey, nodeId };
  } catch { return null; }
}

// ── Figma Import Panel (SVG paste + URL fetch) ───────────────────────────────
function FigmaImportPanel({ onAdd, onClose }) {
  const toast = useToast();
  const [tab,      setTab]      = useState("url"); // "url" | "svg"
  // URL 탭
  const [figmaUrl, setFigmaUrl] = useState("");
  const [token,    setToken]    = useState(() => localStorage.getItem("figma_token") || "");
  const [showToken, setShowToken] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [fetchStart, setFetchStart] = useState(null);
  const [fetchElapsed, setFetchElapsed] = useState(0);
  const fetchTimerRef = useRef(null);
  // SVG 탭 (기존)
  const [svg,      setSvg]      = useState("");
  const [error,    setError]    = useState("");
  const [name,     setName]     = useState("Untitled");
  const [ready,    setReady]    = useState(false);
  // step: "idle" | "confirming" | "saving" | "done"
  const [step,     setStep]     = useState("idle");
  const [progress, setProgress] = useState(0);
  const cancelRef  = useRef(false);
  const timerRef   = useRef(null);

  const saveToken = (t) => {
    setToken(t);
    localStorage.setItem("figma_token", t);
  };

  const handleFetchFromUrl = async () => {
    setFetchError("");
    const parsed = parseFigmaUrl(figmaUrl);
    if (!parsed) { setFetchError("올바른 Figma URL이 아닙니다."); return; }
    if (!token.trim()) { setFetchError("Figma Access Token을 입력해주세요."); return; }
    const { fileKey, nodeId } = parsed;
    if (!nodeId) { setFetchError("node-id가 URL에 없습니다. 레이어를 선택하고 링크를 복사해주세요."); return; }
    const start = Date.now();
    setFetchStart(start);
    setFetchElapsed(0);
    setFetching(true);
    fetchTimerRef.current = setInterval(() => {
      setFetchElapsed(Math.floor((Date.now() - start) / 1000));
    }, 500);
    try {
      // Figma nodes API로 JSON 레이어 트리 가져오기
      const idsParam = encodeURIComponent(nodeId);
      const res = await fetch(
        `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${idsParam}`,
        { headers: { "X-Figma-Token": token.trim() } }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Figma API 오류 (${res.status})`);
      }
      const data = await res.json();
      const nodeEntry = Object.values(data.nodes || {})[0];
      if (!nodeEntry?.document) throw new Error("노드를 가져오지 못했습니다.");
      const doc = nodeEntry.document;
      const rootB = doc.absoluteBoundingBox;
      const rootX = rootB?.x || 0;
      const rootY = rootB?.y || 0;

      // ── 색상 헬퍼 ──
      function figmaColorToHex(c, a) {
        if (!c) return null;
        const hex = `#${Math.round(c.r*255).toString(16).padStart(2,"0")}${Math.round(c.g*255).toString(16).padStart(2,"0")}${Math.round(c.b*255).toString(16).padStart(2,"0")}`;
        const alpha = a ?? c.a ?? 1;
        return alpha < 1 ? `rgba(${Math.round(c.r*255)},${Math.round(c.g*255)},${Math.round(c.b*255)},${alpha.toFixed(2)})` : hex;
      }

      // ── Figma 노드 트리 → items 트리 변환 ──
      let idCounter = Date.now();
      function figmaNodeToItem(node, parentNode = null) {
        const b = node.absoluteBoundingBox;
        if (!b) return null;
        const x = Math.round(b.x - rootX);
        const y = Math.round(b.y - rootY);
        const w = Math.round(b.width);
        const h = Math.round(b.height);
        const id = idCounter++;
        const name = node.name || node.type;

        // ── Constraints 파싱 ──
        const cH = node.constraints?.horizontal || "LEFT";   // LEFT RIGHT CENTER SCALE STRETCH
        const cV = node.constraints?.vertical   || "TOP";    // TOP BOTTOM CENTER SCALE STRETCH
        const constraints = { horizontal: cH, vertical: cV };

        // ── fills → background ──
        const fills = node.fills?.[0];
        let frameBg = "transparent";
        if (fills?.type === "SOLID" && fills.color) {
          frameBg = figmaColorToHex(fills.color, fills.opacity);
        } else if (fills?.type === "GRADIENT_LINEAR" && fills.gradientStops) {
          const stops = fills.gradientStops.map(s => `${figmaColorToHex(s.color)} ${Math.round(s.position*100)}%`).join(", ");
          frameBg = `linear-gradient(${stops})`;
        }

        // ── strokes → border ──
        const stroke = node.strokes?.[0];
        const frameBorder = (stroke?.type === "SOLID" && stroke.color)
          ? figmaColorToHex(stroke.color, stroke.opacity)
          : "transparent";

        if (node.type === "TEXT") {
          const fs = node.style?.fontSize || 14;
          const fw = node.style?.fontWeight || 400;
          const styleMap = [
            { name:"meta_sf_title1", size:28 }, { name:"meta_sf_title2", size:22 },
            { name:"meta_sf_title3", size:17 }, { name:"meta_sf_body1",  size:15 },
            { name:"meta_sf_body2",  size:13 }, { name:"meta_sf_caption1", size:11 },
          ];
          const matched = styleMap.reduce((a,s) => Math.abs(s.size-fs) < Math.abs(a.size-fs) ? s : a);
          const color = fills?.color ? figmaColorToHex(fills.color, fills.opacity) : "#333333";
          const textAlign = node.style?.textAlignHorizontal?.toLowerCase() || "left";
          return { id, type:"text", x, y, w, h, name, content: node.characters||name, style: matched.name, color, textAlign, constraints };
        }

        // ── Auto Layout 파싱 ──
        let autoLayout = null;
        if (node.layoutMode && node.layoutMode !== "NONE") {
          const mainAxisMap = { MIN:"flex-start", CENTER:"center", MAX:"flex-end", SPACE_BETWEEN:"space-between" };
          const crossAxisMap = { MIN:"flex-start", CENTER:"center", MAX:"flex-end", BASELINE:"flex-start" };
          autoLayout = {
            enabled: true,
            direction: node.layoutMode === "HORIZONTAL" ? "horizontal" : "vertical",
            gap: node.itemSpacing || 0,
            padT: node.paddingTop    || node.verticalPadding   || 0,
            padB: node.paddingBottom || node.verticalPadding   || 0,
            padL: node.paddingLeft   || node.horizontalPadding || 0,
            padR: node.paddingRight  || node.horizontalPadding || 0,
            mainAlign:  mainAxisMap[node.primaryAxisAlignItems]   || "flex-start",
            crossAlign: crossAxisMap[node.counterAxisAlignItems]  || "flex-start",
            wrap: node.layoutWrap === "WRAP",
            // 크기 모드
            wMode: node.primaryAxisSizingMode === "AUTO" ? (node.layoutMode==="HORIZONTAL"?"hug":"fixed")
                 : node.counterAxisSizingMode === "AUTO" ? (node.layoutMode==="VERTICAL"?"hug":"fixed") : "fixed",
          };
        }

        // ── layoutGrow → fill 모드 ──
        const layoutGrow = node.layoutGrow || 0; // 1 = fill in parent AL

        const frameRadius = node.cornerRadius || node.rectangleCornerRadii?.[0] || 0;
        const opacity = node.opacity !== undefined ? node.opacity : 1;

        const children = (node.children || [])
          .map(child => figmaNodeToItem(child, node))
          .filter(Boolean)
          .map(child => ({ ...child, x: child.x - x, y: child.y - y }));

        return {
          id, type:"frame", x, y, w, h, name,
          frameBg, frameBorder, frameRadius: Math.round(frameRadius),
          opacity: opacity < 1 ? opacity : undefined,
          autoLayout, layoutGrow, constraints,
          children,
        };
      }

      const convertedItems = (doc.children || [doc]).map(figmaNodeToItem).filter(Boolean);
      const finalItems = convertedItems.length > 0 ? convertedItems : [figmaNodeToItem(doc)].filter(Boolean);

      toast(`Figma 레이어 ${finalItems.length}개 가져왔습니다!`, "success");
      onAdd(finalItems);
      onClose();
    } catch (e) {
      setFetchError(e.message);
    } finally {
      clearInterval(fetchTimerRef.current);
      setFetching(false);
      setFetchStart(null);
    }
  };

  const handlePaste = (val) => {
    setSvg(val);
    setStep("idle");
    cancelRef.current = false;
    const trimmed = val.trim();
    if (!trimmed) { setReady(false); setError(""); return; }
    if (!trimmed.startsWith("<svg")) {
      setError("SVG가 아닙니다. Figma에서 Copy as SVG로 복사해주세요.");
      setReady(false); return;
    }
    setError("");
    setReady(true);
  };

  const { w, h } = ready ? extractSvgSize(svg) : { w: 0, h: 0 };
  const thumbScale = ready ? Math.min(160 / w, 100 / h, 1) : 1;

  // SVG 크기 → 예상 시간 계산
  const svgBytes = ready ? new Blob([svg]).size : 0;
  const sizeLabel = svgBytes < 1024
    ? `${svgBytes} B`
    : svgBytes < 1024 * 1024
    ? `${(svgBytes / 1024).toFixed(1)} KB`
    : `${(svgBytes / 1024 / 1024).toFixed(1)} MB`;
  // localStorage write는 빠르지만 큰 SVG는 직렬화 시간이 있음
  const saveDurationMs = svgBytes < 20 * 1024 ? 400
    : svgBytes < 100 * 1024 ? 800
    : svgBytes < 500 * 1024 ? 1400
    : 2200;
  const timeLabel = saveDurationMs < 600 ? "약 0.5초 미만"
    : saveDurationMs < 1000 ? "약 1초"
    : saveDurationMs < 1600 ? "약 1~2초"
    : "약 2초 이상";
  const storageLabel = "Supabase 서버 (HWorld DB)";

  // 저장 버튼 클릭 → 확인 단계로
  const handleSaveClick = () => {
    if (!ready || step !== "idle") return;
    setStep("confirming");
  };

  // 확인 후 실제 저장
  const handleConfirm = () => {
    setStep("saving");
    setProgress(0);
    cancelRef.current = false;

    // 프로그레스 애니메이션 (Supabase 업로드 동안)
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(elapsed / saveDurationMs, 0.9);
      setProgress(pct);
      if (!cancelRef.current) timerRef.current = requestAnimationFrame(tick);
    };
    timerRef.current = requestAnimationFrame(tick);

    saveComponent({ name, svgData: svg, w, h })
      .then((row) => {
        if (cancelRef.current) return;
        cancelAnimationFrame(timerRef.current);
        setProgress(1);
        setStep("done");
        toast(`"${name}" 서버에 저장됐습니다`, "success");
      })
      .catch((e) => {
        cancelAnimationFrame(timerRef.current);
        setStep("idle");
        toast("저장에 실패했습니다: " + e.message, "error");
      });
  };

  // 중지
  const handleCancel = () => {
    cancelRef.current = true;
    cancelAnimationFrame(timerRef.current);
    setStep("idle");
    setProgress(0);
    toast("저장이 중지됐습니다", "warning");
  };

  const handleAddWithoutSave = () => {
    onAdd({ svgData: svg, w, h });
    toast("저장하지 않고 캔버스에 추가했습니다", "info");
  };

  const handleClose = () => {
    if (ready && step !== "done") {
      cancelRef.current = true;
      cancelAnimationFrame(timerRef.current);
      toast("저장하지 않고 닫았습니다", "warning");
    }
    onClose();
  };

  return (
    <div style={{ background:"#ffffff", border:"1px solid #e5e5e5", borderRadius:"10px", padding:"12px", display:"flex", flexDirection:"column", gap:"8px" }}>
      {/* 헤더 */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", gap:"4px" }}>
          {[["url","🔗 URL"], ["svg","📋 SVG"]].map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding:"3px 10px", borderRadius:"20px", fontSize:"10px", fontWeight: tab===t ? 700 : 400, background: tab===t ? "#111111" : "transparent", color: tab===t ? "#ffffff" : "#aaaaaa", border: tab===t ? "none" : "1px solid #e5e5e5", cursor:"pointer" }}>
              {label}
            </button>
          ))}
        </div>
        <button onClick={handleClose} style={{ background:"none", border:"none", color:"#aaaaaa", cursor:"pointer", fontSize:"14px", lineHeight:1 }}>×</button>
      </div>

      {/* URL 탭 */}
      {tab === "url" && (
        <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
          {/* Token 설정 */}
          <div style={{ background:"#f8f8f8", border:"1px solid #e5e5e5", borderRadius:"6px", padding:"8px 10px", display:"flex", flexDirection:"column", gap:"6px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:"10px", fontWeight:700, color:"#555555" }}>Figma Access Token</span>
              <button onClick={() => setShowToken(p => !p)} style={{ fontSize:"9px", color:"#aaaaaa", background:"none", border:"none", cursor:"pointer" }}>{showToken ? "숨기기" : "보기"}</button>
            </div>
            <input
              type={showToken ? "text" : "password"}
              value={token}
              onChange={e => saveToken(e.target.value)}
              placeholder="figd_xxxxxxxx..."
              style={{ width:"100%", padding:"5px 8px", borderRadius:"5px", border:"1px solid #e0e0e0", fontSize:"10px", fontFamily:"monospace", color:"#333333", outline:"none", boxSizing:"border-box", background:"#ffffff" }}
            />
            {!token && (
              <div style={{ fontSize:"9px", color:"#aaaaaa", lineHeight:1.6 }}>
                Figma → Settings → Security → Personal access tokens → Generate new token
              </div>
            )}
          </div>

          {/* URL 입력 */}
          <input
            value={figmaUrl}
            onChange={e => { setFigmaUrl(e.target.value); setFetchError(""); }}
            placeholder="https://www.figma.com/design/..."
            style={{ width:"100%", padding:"7px 10px", borderRadius:"6px", border:`1px solid ${fetchError?"#cc3333":"#e0e0e0"}`, fontSize:"11px", color:"#333333", outline:"none", boxSizing:"border-box" }}
          />
          {fetchError && <div style={{ fontSize:"10px", color:"#cc3333" }}>{fetchError}</div>}

          <button
            onClick={handleFetchFromUrl}
            disabled={fetching || !figmaUrl.trim()}
            style={{ padding:"8px", borderRadius:"6px", background: fetching || !figmaUrl.trim() ? "#cccccc" : "#111111", border:"none", color:"#ffffff", fontSize:"11px", fontWeight:700, cursor: fetching || !figmaUrl.trim() ? "default" : "pointer", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"8px" }}>
            <span>{fetching ? "가져오는 중..." : "→ 컴포넌트로 가져오기"}</span>
            {fetching && (
              <span style={{ fontSize:"10px", fontWeight:400, opacity:0.85, fontVariantNumeric:"tabular-nums", whiteSpace:"nowrap" }}>
                {fetchElapsed}s <span style={{ opacity:0.6 }}>/ ~{fetchElapsed < 3 ? 8 : fetchElapsed < 6 ? 12 : 15}s</span>
              </span>
            )}
          </button>
          {fetching && (
            <div style={{ height:"3px", background:"#e5e5e5", borderRadius:"2px", overflow:"hidden" }}>
              <div style={{
                height:"100%",
                width:`${Math.min((fetchElapsed / 15) * 100, 92)}%`,
                background:"linear-gradient(90deg, #5028c8, #8855ff)",
                borderRadius:"2px",
                transition:"width 0.5s ease"
              }} />
            </div>
          )}

          <div style={{ fontSize:"9px", color:"#aaaaaa", lineHeight:1.7 }}>
            Figma에서 레이어 선택 → 우클릭 → Copy link to selection → 붙여넣기
          </div>
        </div>
      )}

      {/* SVG 탭 (기존) */}
      {tab === "svg" && (
        <>
          <div style={{ background:"#f0f4ff", border:"1px solid #c5d3f5", borderRadius:"6px", padding:"8px 10px", fontSize:"10px", color:"#3355aa", lineHeight:1.7 }}>
            Figma에서 레이어 선택<br/>
            → 우클릭 → <b>Copy/Paste as → Copy as SVG</b><br/>
            → 아래에 붙여넣기 (Ctrl+V / ⌘V)
          </div>
          <textarea
            value={svg}
            onChange={e => handlePaste(e.target.value)}
            onPaste={e => { setTimeout(() => handlePaste(e.target.value), 0); }}
            placeholder="<svg xmlns=... 여기에 붙여넣기"
            style={{ width:"100%", height:"64px", background:"#f8f8f8", border:`1px solid ${error?"#cc3333":ready?"#5028c8":"#d0d0d0"}`, borderRadius:"6px", padding:"6px 8px", fontSize:"10px", fontFamily:"monospace", color:"#333333", resize:"none", outline:"none", boxSizing:"border-box" }}
          />
          {error && <div style={{ fontSize:"10px", color:"#cc3333", lineHeight:1.5 }}>{error}</div>}
        </>
      )}

      {tab === "svg" && ready && step === "idle" && (
        <>
          {/* Preview */}
          <div style={{ background:"#f5f5f5", border:"1px solid #e5e5e5", borderRadius:"6px", padding:"8px", overflow:"hidden", display:"flex", flexDirection:"column", gap:"6px" }}>
            <div style={{ fontSize:"9px", color:"#999999" }}>{Math.round(w)}×{Math.round(h)}px · {sizeLabel}</div>
            <div style={{ transform:`scale(${thumbScale})`, transformOrigin:"top left", width: w*thumbScale, height: h*thumbScale, flexShrink:0 }}
              dangerouslySetInnerHTML={{ __html: svg }} />
          </div>
          {/* Save prompt */}
          <div style={{ background:"#fffbe6", border:"1px solid #f0d800", borderRadius:"6px", padding:"10px", display:"flex", flexDirection:"column", gap:"8px" }}>
            <div style={{ fontSize:"10px", fontWeight:700, color:"#665500" }}>Draft에 저장하시겠습니까?</div>
            <input value={name} onChange={e => setName(e.target.value)}
              style={{ width:"100%", padding:"5px 8px", borderRadius:"5px", border:"1px solid #e0c800", background:"#ffffff", fontSize:"11px", color:"#111111", outline:"none", boxSizing:"border-box" }} />
            <div style={{ display:"flex", gap:"6px" }}>
              <button onClick={handleSaveClick}
                style={{ flex:1, padding:"6px", borderRadius:"5px", background:"#111111", border:"none", color:"#ffffff", fontSize:"11px", fontWeight:700, cursor:"pointer" }}>
                Draft로 저장
              </button>
              <button onClick={handleAddWithoutSave}
                style={{ flex:1, padding:"6px", borderRadius:"5px", background:"transparent", border:"1px solid #d0d0d0", color:"#888888", fontSize:"11px", cursor:"pointer" }}>
                저장 없이 추가
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── 저장 전 확인 단계 ── */}
      {tab === "svg" && step === "confirming" && (
        <div style={{ background:"#f5f0ff", border:"1px solid #b090ee", borderRadius:"8px", padding:"12px", display:"flex", flexDirection:"column", gap:"10px" }}>
          <div style={{ fontSize:"11px", fontWeight:700, color:"#3a0a8a" }}>저장하기 전에 확인해주세요</div>
          <div style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:"4px 10px", fontSize:"10px" }}>
            <span style={{ color:"#999" }}>파일 크기</span>  <span style={{ color:"#333", fontWeight:600 }}>{sizeLabel}</span>
            <span style={{ color:"#999" }}>예상 시간</span>  <span style={{ color:"#333", fontWeight:600 }}>{timeLabel}</span>
            <span style={{ color:"#999" }}>저장 위치</span>  <span style={{ color:"#333" }}>{storageLabel}</span>
            <span style={{ color:"#999" }}>이름</span>       <span style={{ color:"#333", fontWeight:600 }}>"{name}"</span>
          </div>
          <div style={{ fontSize:"10px", color:"#7755aa", background:"#ede5ff", borderRadius:"5px", padding:"7px 9px", lineHeight:1.6 }}>
            Supabase 서버에 저장됩니다.<br/>
            어떤 기기, 어떤 브라우저에서도 불러올 수 있습니다.
          </div>
          <div style={{ display:"flex", gap:"6px" }}>
            <button onClick={handleConfirm}
              style={{ flex:1, padding:"7px", borderRadius:"5px", background:"#5028c8", border:"none", color:"#ffffff", fontSize:"11px", fontWeight:700, cursor:"pointer" }}>
              진짜 저장할게
            </button>
            <button onClick={() => { setStep("idle"); toast("저장이 취소됐습니다", "warning"); }}
              style={{ flex:1, padding:"7px", borderRadius:"5px", background:"transparent", border:"1px solid #d0c0f0", color:"#7755aa", fontSize:"11px", cursor:"pointer" }}>
              취소
            </button>
          </div>
        </div>
      )}

      {/* ── 저장 진행 중 ── */}
      {tab === "svg" && step === "saving" && (
        <div style={{ background:"#f8f8f8", border:"1px solid #e0e0e0", borderRadius:"8px", padding:"12px", display:"flex", flexDirection:"column", gap:"10px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontSize:"11px", fontWeight:600, color:"#333" }}>저장 중...</div>
            <div style={{ fontSize:"10px", color:"#999" }}>{Math.round(progress * 100)}%</div>
          </div>
          {/* Progress bar */}
          <div style={{ height:"6px", background:"#e5e5e5", borderRadius:"3px", overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${progress * 100}%`, background:"linear-gradient(90deg,#5028c8,#8855ff)", borderRadius:"3px", transition:"width 0.05s linear" }} />
          </div>
          <button onClick={handleCancel}
            style={{ padding:"6px", borderRadius:"5px", background:"transparent", border:"1px solid #ffbbbb", color:"#cc3333", fontSize:"11px", fontWeight:600, cursor:"pointer" }}>
            중지
          </button>
        </div>
      )}

      {/* ── 저장 완료 ── */}
      {tab === "svg" && step === "done" && (
        <div style={{ background:"#e8f5e8", border:"1px solid #5aaa5a", borderRadius:"6px", padding:"10px", display:"flex", flexDirection:"column", gap:"8px" }}>
          <div style={{ fontSize:"11px", color:"#2a7a2a", fontWeight:700 }}>✓ Draft에 저장됐습니다</div>
          <div style={{ height:"4px", background:"#5aaa5a", borderRadius:"2px" }} />
          <div style={{ display:"flex", gap:"6px" }}>
            <button onClick={() => { onAdd({ svgData: svg, w, h }); toast("캔버스에 추가됐습니다", "success"); }}
              style={{ flex:1, padding:"6px", borderRadius:"5px", background:"#111111", border:"none", color:"#ffffff", fontSize:"11px", fontWeight:700, cursor:"pointer" }}>
              캔버스에 추가
            </button>
            <button onClick={onClose}
              style={{ flex:1, padding:"6px", borderRadius:"5px", background:"transparent", border:"1px solid #d0d0d0", color:"#888888", fontSize:"11px", cursor:"pointer" }}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Deep tree helpers (Frame nesting) ────────────────────────────────────────
function findDeep(items, id) {
  for (const it of items) {
    if (it.id === id) return it;
    if (it.children) { const f = findDeep(it.children, id); if (f) return f; }
  }
  return null;
}
function updateDeep(items, id, patch) {
  return items.map(it => {
    if (it.id === id) return { ...it, ...patch };
    if (it.children) return { ...it, children: updateDeep(it.children, id, patch) };
    return it;
  });
}
function removeDeep(items, id) {
  return items
    .filter(it => it.id !== id)
    .map(it => it.children ? { ...it, children: removeDeep(it.children, id) } : it);
}
function insertIntoFrame(items, frameId, child) {
  return items.map(it => {
    if (it.id === frameId) return { ...it, children: [...(it.children||[]), child] };
    if (it.children) return { ...it, children: insertIntoFrame(it.children, frameId, child) };
    return it;
  });
}
function reparentInto(items, itemId, frameId) {
  const item = findDeep(items, itemId);
  if (!item) return items;
  const frame = findDeep(items, frameId);
  const relX = Math.max(0, (item.x||0) - (frame?.x||0));
  const relY = Math.max(0, (item.y||0) - (frame?.y||0));
  const without = removeDeep(items, itemId);
  return insertIntoFrame(without, frameId, { ...item, x: relX, y: relY });
}
function flattenTree(items, depth = 0) {
  const result = [];
  for (const it of [...items].reverse()) {
    result.push({ item: it, depth });
    if (it.type === "frame" && it.children?.length) {
      result.push(...flattenTree([...it.children].reverse(), depth + 1));
    }
  }
  return result;
}

const newScreenId = () => Date.now();
const makeScreen = (name) => ({ id: newScreenId(), name, items: [] });

function SimulatorSection({ pendingDraft, onDraftConsumed }) {
  const toast = useToast();
  const [mode,      setMode]      = useState("assembly"); // "assembly" | "prototype"
  const [platform,  setPlatform]  = useState("ios");
  const [deviceIdx, setDeviceIdx] = useState(2);

  // ── 화면 관리 ────────────────────────────────────────────────────────────────
  const [screens,        setScreens]        = useState([makeScreen("Screen 1")]);
  const [activeScreenId, setActiveScreenId] = useState(null);
  const [protoScreenId,  setProtoScreenId]  = useState(null); // 프로토 모드 현재 화면
  const [renamingId,     setRenamingId]     = useState(null);
  const [renameVal,      setRenameVal]      = useState("");

  const activeId     = activeScreenId ?? screens[0]?.id;
  const activeScreen = screens.find(s => s.id === activeId) || screens[0];
  const items        = activeScreen?.items || [];

  const setItems = (updater) => {
    setScreens(prev => prev.map(s =>
      s.id === activeId
        ? { ...s, items: typeof updater === "function" ? updater(s.items) : updater }
        : s
    ));
  };

  const addScreen = () => {
    const s = makeScreen(`Screen ${screens.length + 1}`);
    setScreens(prev => [...prev, s]);
    setActiveScreenId(s.id);
  };

  const removeScreen = (id) => {
    if (screens.length === 1) { toast("마지막 화면은 삭제할 수 없습니다", "warning"); return; }
    setScreens(prev => prev.filter(s => s.id !== id));
    if (activeId === id) setActiveScreenId(screens.find(s => s.id !== id)?.id || null);
  };

  const startRename = (s) => { setRenamingId(s.id); setRenameVal(s.name); };
  const commitRename = () => {
    if (renameVal.trim()) setScreens(prev => prev.map(s => s.id === renamingId ? { ...s, name: renameVal.trim() } : s));
    setRenamingId(null);
  };

  // 프로토타입 현재 화면
  const protoId     = protoScreenId ?? screens[0]?.id;
  const protoScreen = screens.find(s => s.id === protoId) || screens[0];

  const [selected,  setSelected]  = useState(null);
  const [hovered,   setHovered]   = useState(null);
  const [snapGrid,      setSnapGrid]      = useState(true);
  const [darkMode,      setDarkMode]      = useState(false);
  const [showFigmaPanel,  setShowFigmaPanel]  = useState(false);
  const [showDraftPicker, setShowDraftPicker] = useState(false);
  const [showAiPanel,     setShowAiPanel]     = useState(false);
  const [aiCommand,       setAiCommand]       = useState("");
  const [aiStatus,        setAiStatus]        = useState("idle"); // idle | waiting | done | error
  const [aiStartTime,     setAiStartTime]     = useState(null);
  const [aiElapsed,       setAiElapsed]       = useState(0);
  const [aiProxyUrl,      setAiProxyUrl]      = useState(() => { const v = localStorage.getItem("storybook_ai_proxy_url"); return (v && v !== "connected") ? v : null; });
  const [aiProxyChecking, setAiProxyChecking] = useState(false);
  const aiPollRef         = useRef(null);
  const aiTimerRef        = useRef(null);
  const [collapsedLayers, setCollapsedLayers] = useState(new Set());
  const [pickerDrafts,    setPickerDrafts]    = useState([]);
  const [pickerLoading,   setPickerLoading]   = useState(false);
  const [showCode,        setShowCode]        = useState(false);

  const isProto = mode === "prototype";
  const itemsRef = useRef(items);
  useEffect(() => { itemsRef.current = items; }, [items]);

  // ── prototype pinch-zoom ──────────────────────────────────────────────────────
  const [protoScale, setProtoScale] = useState(1);
  const pinchRef = useRef(null); // { dist0, scale0 }
  const protoFrameRef = useRef(null);
  useEffect(() => {
    const el = protoFrameRef.current;
    if (!el || !isProto) return;
    const dist = (t) => {
      const dx = t[0].clientX - t[1].clientX;
      const dy = t[0].clientY - t[1].clientY;
      return Math.hypot(dx, dy);
    };
    const onStart = (e) => {
      if (e.touches.length === 2) {
        pinchRef.current = { dist0: dist(e.touches), scale0: protoScale };
      }
    };
    const onMove = (e) => {
      if (e.touches.length === 2 && pinchRef.current) {
        e.preventDefault();
        const ratio = dist(e.touches) / pinchRef.current.dist0;
        setProtoScale(Math.min(3, Math.max(0.4, pinchRef.current.scale0 * ratio)));
      }
    };
    const onEnd = () => { if (pinchRef.current) pinchRef.current = null; };
    const onWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setProtoScale(prev => Math.min(3, Math.max(0.4, prev * (1 - e.deltaY * 0.003))));
      }
    };
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove",  onMove,  { passive: false });
    el.addEventListener("touchend",   onEnd,   { passive: true });
    el.addEventListener("wheel",      onWheel, { passive: false });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove",  onMove);
      el.removeEventListener("touchend",   onEnd);
      el.removeEventListener("wheel",      onWheel);
    };
  }, [isProto, protoScale]);

  useEffect(() => {
    if (!pendingDraft) return;
    const id = Date.now();
    if (pendingDraft.svgData) {
      setItems(prev => [...prev, { id, type:"svg", svgData: pendingDraft.svgData, w: pendingDraft.w||100, h: pendingDraft.h||100, x:16, y:Math.min(16+prev.length*40,400), isMaster:false }]);
    } else if (pendingDraft.figmaData) {
      const b = pendingDraft.figmaData?.absoluteBoundingBox;
      setItems(prev => [...prev, { id, type:"figma", figmaData: pendingDraft.figmaData, x:16, y:Math.min(16+prev.length*40,400), w:b?.width||100, isMaster:false }]);
    }
    setSelected(id);
    onDraftConsumed?.();
  }, [pendingDraft]);

  const dragRef   = useRef(null); // { id, startMX, startMY, startX, startY }
  const resizeRef = useRef(null); // { id, handle, startMX, startW, startX }
  const scaleRef  = useRef(1);
  const snapRef   = useRef(true);
  const compRefs  = useRef({});   // id → DOM element

  const device = DEVICES[platform][deviceIdx];
  const scale  = MAX_FRAME_H / device.h;
  scaleRef.current = scale;
  snapRef.current  = snapGrid;

  const GRID   = 8;
  const snap   = (v) => snapRef.current ? Math.round(v / GRID) * GRID : Math.round(v);
  // convert desired screen-px to dp (for handles/borders inside the scaled frame)
  const sdp    = (px) => px / scale;

  // ── window-level mouse (drag + resize) ───────────────────────────────────────
  useEffect(() => {
    const onMove = (e) => {
      if (dragRef.current) {
        const { id, startMX, startMY, startX, startY } = dragRef.current;
        const dx = (e.clientX - startMX) / scaleRef.current;
        const dy = (e.clientY - startMY) / scaleRef.current;
        setItems(prev => updateDeep(prev, id, { x: Math.max(0, Math.round((startX + dx) / 8) * 8), y: Math.max(0, Math.round((startY + dy) / 8) * 8) }));
      }
      if (resizeRef.current) {
        const { id, handle, startMX, startW, startX } = resizeRef.current;
        const dx = (e.clientX - startMX) / scaleRef.current;
        let upd = {};
        if (handle.includes("e")) { upd.w = Math.max(60, Math.round((startW + dx) / 8) * 8); }
        if (handle.includes("w")) {
          const nw = Math.max(60, Math.round((startW - dx) / 8) * 8);
          upd.w = nw;
          upd.x = Math.max(0, Math.round((startX + (startW - nw)) / 8) * 8);
        }
        setItems(prev => updateDeep(prev, id, upd));
      }
    };
    const onUp = (e) => {
      if (dragRef.current) {
        const { id, startMX, startMY, startX, startY } = dragRef.current;
        const dx = (e.clientX - startMX) / scaleRef.current;
        const dy = (e.clientY - startMY) / scaleRef.current;
        const finalX = Math.max(0, Math.round((startX + dx) / 8) * 8);
        const finalY = Math.max(0, Math.round((startY + dy) / 8) * 8);
        // frame drop detection: only for root-level items
        const cur = itemsRef.current;
        const isRoot = cur.some(it => it.id === id);
        if (isRoot) {
          const draggedItem = findDeep(cur, id);
          const iw = draggedItem?.w || 60;
          const ih = draggedItem?.h || 30;
          const cx = finalX + iw / 2;
          const cy = finalY + ih / 2;
          const targetFrame = cur.find(it =>
            it.type === "frame" && it.id !== id &&
            cx >= it.x && cx <= it.x + (it.w || 200) &&
            cy >= it.y && cy <= it.y + (it.h || 150)
          );
          if (targetFrame) {
            setItems(prev => reparentInto(prev, id, targetFrame.id));
          }
        }
      }
      dragRef.current = null;
      resizeRef.current = null;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, []);

  // ── keyboard shortcuts ───────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (!selected) return;
      const item = items.find(i => i.id === selected);
      if (!item) return;

      if ((e.key === "Delete" || e.key === "Backspace") && !item.isMaster) {
        e.preventDefault();
        setItems(prev => removeDeep(prev, selected));
        setSelected(null);
        return;
      }
      if (e.key === "Escape") { setSelected(null); return; }
      if ((e.metaKey || e.ctrlKey) && e.key === "d") {
        e.preventDefault();
        const nid = Date.now();
        setItems(prev => [...prev, { ...item, id: nid, x: (item.x||0) + 24, y: (item.y||0) + 24, isMaster: false }]);
        setSelected(nid);
        return;
      }
      if (!item.isMaster) {
        const N = e.shiftKey ? 10 : 1;
        if (e.key === "ArrowLeft")  { e.preventDefault(); setItems(p => updateDeep(p, selected, { x: Math.max(0, (item.x||0)-N) })); }
        if (e.key === "ArrowRight") { e.preventDefault(); setItems(p => updateDeep(p, selected, { x: (item.x||0)+N })); }
        if (e.key === "ArrowUp")    { e.preventDefault(); setItems(p => updateDeep(p, selected, { y: Math.max(0, (item.y||0)-N) })); }
        if (e.key === "ArrowDown")  { e.preventDefault(); setItems(p => updateDeep(p, selected, { y: (item.y||0)+N })); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, items]);

  // ── AI 명령 브릿지 ───────────────────────────────────────────────────────────
  const cancelAiCommand = () => {
    clearInterval(aiPollRef.current);
    clearInterval(aiTimerRef.current);
    setAiStatus("idle");
    setAiStartTime(null);
    setAiElapsed(0);
  };

  const AI_HUB = "https://alfred-agent-nine.vercel.app";
  const AI_PROXY_KEY = "storybook_ai_proxy_url";

  const detectAiProxy = async () => {
    // ai-worker가 허브에 등록됐는지 확인
    try {
      const res = await fetch(`${AI_HUB}/api/get-proxy?github_login=hyoseob-r`, { signal: AbortSignal.timeout(5000) });
      const data = await res.json();
      if (data?.proxy_url) {
        setAiProxyUrl("hub");
        localStorage.setItem(AI_PROXY_KEY, "hub");
        return;
      }
    } catch {}
    alert("ai-worker가 실행 중이지 않습니다. Mac에서 ai-worker가 켜져 있는지 확인해주세요.");
  };

  const disconnectAiProxy = () => { localStorage.removeItem(AI_PROXY_KEY); setAiProxyUrl(null); };

  const sendAiCommand = async () => {
    if (!aiCommand.trim() || !aiProxyUrl) return;
    const start = Date.now();
    setAiStatus("waiting");
    setAiStartTime(start);
    setAiElapsed(0);
    aiTimerRef.current = setInterval(() => setAiElapsed(Math.floor((Date.now() - start) / 1000)), 500);

    try {
      // 1. 결과 초기화 후 명령 허브에 전송
      await fetch(`${AI_HUB}/api/ai-queue`, { method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ type:"result", payload:{ cleared:true, ts: start } }) });
      await fetch(`${AI_HUB}/api/ai-queue`, { method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ type:"command", payload:{ command: aiCommand.trim(), ts: start } }) });

      // 2. ai-worker가 처리 후 허브에 올린 결과를 폴링
      const deadline = start + 300_000;
      aiPollRef.current = setInterval(async () => {
        if (Date.now() > deadline) {
          clearInterval(aiPollRef.current); clearInterval(aiTimerRef.current); setAiStatus("error"); return;
        }
        try {
          const res  = await fetch(`${AI_HUB}/api/ai-queue?role=browser`);
          const data = await res.json();
          if (data?.items && !data.cleared && data._updatedAt > new Date(start).toISOString()) {
            clearInterval(aiPollRef.current); clearInterval(aiTimerRef.current);
            setScreens(prev => prev.map(s => s.id === activeScreen ? { ...s, items: data.items } : s));
            setItems(data.items);
            setAiStatus("done"); setAiCommand("");
            setTimeout(() => { setAiStatus("idle"); setAiStartTime(null); setAiElapsed(0); }, 2500);
          }
        } catch {}
      }, 2000);
    } catch {
      clearInterval(aiTimerRef.current);
      setAiStatus("error");
    }
  };

  // ── item helpers ─────────────────────────────────────────────────────────────
  const addItem = (type) => {
    const id = Date.now();
    const base = type === "frame"
      ? { type:"frame", w:240, h:160, children:[], frameBg:"rgba(0,0,0,0.03)", frameBorder:"#cccccc", frameRadius:8, isMaster:false }
      : type === "labelButton"
      ? { type:"labelButton", shape:"filled", colorStyle:"primary_v2", size:"medium", config:"labelOnly", iconPos:"left", iconName:"chevron_right", labelText:"버튼", isMaster:false }
      : { type:"text", style:"Body/body_6", content:"텍스트", color:"#333333", isMaster:false };
    // if selected item is a frame, add inside it
    const selItem = findDeep(itemsRef.current, selected);
    if (selItem?.type === "frame") {
      const childCount = selItem.children?.length || 0;
      const newChild = { id, x:8, y:8 + childCount*52, ...base };
      setItems(prev => updateDeep(prev, selItem.id, { children: [...(selItem.children||[]), newChild] }));
    } else {
      setItems(prev => [...prev, { id, x:16, y:Math.min(16 + prev.length * 64, 480), ...base }]);
    }
    setSelected(id);
  };

  const updateItem    = (id, upd) => setItems(prev => updateDeep(prev, id, upd));
  const removeItem    = (id) => { setItems(prev => removeDeep(prev, id)); if (selected === id) setSelected(null); };
  const duplicateItem = (item) => {
    const nid = Date.now();
    const copy = JSON.parse(JSON.stringify({ ...item, id: nid, x: (item.x||0) + 24, y: (item.y||0) + 24, isMaster: false }));
    const assignIds = (node) => { node.id = Date.now() + Math.random(); if (node.children) node.children.forEach(assignIds); };
    if (copy.children) copy.children.forEach(assignIds);
    setItems(prev => [...prev, copy]);
    setSelected(nid);
  };
  const sel = findDeep(items, selected);

  const changeShape = (s) => {
    if (!sel) return;
    const allowed = ALLOWED_COLORS[s];
    updateItem(sel.id, { shape: s, colorStyle: allowed.includes(sel.colorStyle) ? sel.colorStyle : allowed[0] });
  };

  const startDrag = (e, item) => {
    e.preventDefault(); e.stopPropagation();
    setSelected(item.id);
    if (!item.isMaster) {
      dragRef.current = { id: item.id, startMX: e.clientX, startMY: e.clientY, startX: item.x, startY: item.y };
    }
  };

  const startResize = (e, item, handle) => {
    e.preventDefault(); e.stopPropagation();
    const el = compRefs.current[item.id];
    const cw = item.w || (el ? el.offsetWidth : 120);
    resizeRef.current = { id: item.id, handle, startMX: e.clientX, startW: cw, startX: item.x };
  };

  // ── render component ─────────────────────────────────────────────────────────
  const renderComp = (item) => {
    if (item.type === "frame") return null; // frames rendered by wrapper
    if (item.type === "labelButton") {
      const h  = item.size === "medium" ? 48 : 36;
      const ph = item.size === "medium" ? 16 : 12;
      const fs = item.size === "medium" ? 14 : 12;
      const r  = item.size === "medium" ? 10 : 8;
      const bgFilled = { primary_v2:"#FA0050", gray_v2:"#333333", gray250_v2:"#BFBFBF" };
      const fgFilled = { primary_v2:"#fff",    gray_v2:"#fff",    gray250_v2:"#333" };
      const accentC  = { primary_v2:"#FA0050", gray_v2:"#333333", gray250_v2:"#BFBFBF" };
      const bg  = item.shape === "filled"   ? bgFilled[item.colorStyle] : "transparent";
      const fg  = item.shape === "filled"   ? fgFilled[item.colorStyle] : accentC[item.colorStyle];
      const bdr = item.shape === "outlined" ? `1px solid ${accentC[item.colorStyle]}` : "none";
      const ico = <YdsIcon name={item.iconName || "chevron_right"} size={fs + 2} color={fg} />;
      return (
        <div style={{ height:`${h}px`, padding:`0 ${ph}px`, background:bg, border:bdr, borderRadius:`${r}px`, color:fg, fontSize:`${fs}px`, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:"5px", fontFamily: platform==="ios"?"system-ui":"Roboto,sans-serif", userSelect:"none", whiteSpace:"nowrap", width:"100%", boxSizing:"border-box" }}>
          {item.config === "labelWithIcon" && item.iconPos === "left"  && ico}
          {item.labelText}
          {item.config === "labelWithIcon" && item.iconPos === "right" && ico}
        </div>
      );
    }
    if (item.type === "text") {
      const t = typography.find(t => t.name === item.style) || { size:14, weight:400, lineHeight:19 };
      return (
        <div style={{ fontSize:`${t.size}px`, fontWeight:t.weight, lineHeight:`${t.lineHeight}px`, color:item.color, fontFamily: platform==="ios"?"system-ui":"Roboto,sans-serif", userSelect:"none", whiteSpace:"pre-wrap", textAlign: item.textAlign||"left", width:"100%" }}>
          {item.content}
        </div>
      );
    }
    if (item.type === "figma") {
      const b = item.figmaData?.absoluteBoundingBox;
      return (
        <div style={{ position:"relative", width: item.w || b?.width || 100, height: b?.height || 100, pointerEvents:"none" }}>
          <RenderFigmaNode node={item.figmaData} ox={b?.x || 0} oy={b?.y || 0} />
        </div>
      );
    }
    if (item.type === "svg") {
      return (
        <div style={{ width: item.w || 100, height: item.h || 100, pointerEvents:"none", lineHeight:0 }}
          dangerouslySetInnerHTML={{ __html: item.svgData }} />
      );
    }
  };

  // ── recursive item wrapper (handles frame nesting) ───────────────────────────
  const renderItemWrapper = (item, parentAL = null, depth = 0) => {
    const sc = !parentAL && item.scroll?.enabled ? item.scroll : null;
    const resolvedW = item.wMode==="fill" ? device.w
      : item.wMode==="pct" ? Math.round(device.w*(item.wPct||100)/100)
      : item.w;
    const resolvedH = item.hMode==="fill" ? device.h
      : item.hMode==="pct" ? Math.round(device.h*(item.hPct||100)/100)
      : item.h;

    if (item.type === "frame") {
      const al = item.autoLayout?.enabled ? item.autoLayout : null;
      const flexDir = al?.direction==="horizontal" ? "row" : "column";
      const wPx = resolvedW || item.w || 240;
      const hPx = resolvedH || item.h || 160;

      // ── Constraints → posStyle ──
      const con = item.constraints;
      let posStyle;
      if (parentAL) {
        // 부모가 Auto Layout이면 flex 흐름
        const grow = item.layoutGrow === 1;
        posStyle = {
          position: "relative",
          flex: grow ? "1 1 auto" : "0 0 auto",
          alignSelf: con?.vertical === "STRETCH" ? "stretch" : undefined,
        };
      } else if (con && parentAL === null) {
        // 부모가 절대 배치 — Constraints 적용
        const ch = con.horizontal;
        const cv = con.vertical;
        posStyle = { position:"absolute" };
        // 수평
        if (ch === "RIGHT")        { posStyle.right = 0; }
        else if (ch === "CENTER")  { posStyle.left="50%"; posStyle.transform=`translateX(-50%)`; }
        else if (ch === "STRETCH") { posStyle.left=`${item.x}px`; posStyle.right=0; }
        else                       { posStyle.left=`${item.x||0}px`; }
        // 수직
        if (cv === "BOTTOM")       { posStyle.bottom=0; }
        else if (cv === "CENTER")  {
          posStyle.top="50%";
          posStyle.transform = (posStyle.transform||"") + " translateY(-50%)";
        } else if (cv === "STRETCH") { posStyle.top=`${item.y}px`; posStyle.bottom=0; }
        else                       { posStyle.top=`${item.y||0}px`; }
      } else {
        posStyle = { position:"absolute", left:`${item.x||0}px`, top:`${item.y||0}px` };
      }

      // ── 크기 ──
      const widthStyle  = (con?.horizontal==="STRETCH" && !parentAL) ? "auto"
        : item.wMode==="fill" ? "100%"
        : item.wMode==="hug"  ? "fit-content"
        : (item.layoutGrow===1 && parentAL) ? undefined  // flex가 처리
        : `${wPx}px`;
      const heightStyle = (con?.vertical==="STRETCH" && !parentAL) ? "auto"
        : item.hMode==="hug" ? "fit-content"
        : `${hPx}px`;

      return (
        <div key={item.id}
          ref={el => compRefs.current[item.id] = el}
          style={{
            ...posStyle,
            width: widthStyle,
            height: heightStyle,
            background: item.frameBg || "rgba(0,0,0,0.03)",
            border: item.frameBorder && item.frameBorder !== "transparent" ? `1px solid ${item.frameBorder}` : "none",
            borderRadius: `${item.frameRadius||0}px`,
            opacity: item.opacity,
            overflow: "hidden",
            boxSizing: "border-box",
            display: al ? "flex" : "block",
            flexDirection: al ? flexDir : undefined,
            gap: al ? `${al.gap||0}px` : undefined,
            padding: al ? `${al.padT||0}px ${al.padR||0}px ${al.padB||0}px ${al.padL||0}px` : 0,
            justifyContent: al ? (al.mainAlign||"flex-start") : undefined,
            alignItems: al ? (al.crossAlign||"flex-start") : undefined,
            flexWrap: al?.wrap ? "wrap" : "nowrap",
            cursor: isProto ? (item.onTap?"pointer":"default") : "grab",
          }}
          onMouseDown={e => { if (!isProto) { e.stopPropagation(); setSelected(item.id); if (!item.isMaster) dragRef.current = { id:item.id, startMX:e.clientX, startMY:e.clientY, startX:item.x||0, startY:item.y||0 }; } }}
          onMouseEnter={() => !isProto && setHovered(item.id)}
          onMouseLeave={() => !isProto && setHovered(null)}
          onClick={e => { e.stopPropagation(); if (!isProto) setSelected(item.id); if (isProto && item.onTap?.type==="navigate") setProtoScreenId(item.onTap.screenId); }}
        >
          {/* children */}
          {item.children?.map(child => renderItemWrapper(child, al, depth+1))}
          {/* empty placeholder */}
          {!isProto && (!item.children || item.children.length===0) && (
            <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:`${sdp(10)}px`, color:"#c0c0c0", pointerEvents:"none", userSelect:"none" }}>Frame</div>
          )}
          {/* frame label badge */}
          {!isProto && (
            <div style={{ position:"absolute", top:`${sdp(-13)}px`, left:0, fontSize:`${sdp(9)}px`, color:"#888", background:"#f0f0f0", padding:`${sdp(1)}px ${sdp(4)}px`, borderRadius:`${sdp(3)}px`, whiteSpace:"nowrap", pointerEvents:"none", zIndex:10 }}>
              {item.name||"Frame"}
            </div>
          )}
          {!isProto && hovered===item.id && selected!==item.id && renderSelectionBox(item, true)}
          {!isProto && selected===item.id && renderSelectionBox(item, false)}
        </div>
      );
    }

    // leaf item
    const clipW = sc?.clipW || resolvedW;
    const clipH = sc?.clipH || resolvedH || item.h;
    const conL = item.constraints;
    let posStyle;
    if (parentAL) {
      const grow = item.layoutGrow === 1;
      posStyle = { position:"relative", flex: grow ? "1 1 auto" : "0 0 auto",
        alignSelf: conL?.vertical==="STRETCH" ? "stretch" : undefined };
    } else if (conL) {
      posStyle = { position:"absolute" };
      if (conL.horizontal==="RIGHT")        posStyle.right = 0;
      else if (conL.horizontal==="CENTER")  { posStyle.left="50%"; posStyle.transform="translateX(-50%)"; }
      else if (conL.horizontal==="STRETCH") { posStyle.left=`${item.x}px`; posStyle.right=0; }
      else                                  posStyle.left=`${item.x||0}px`;
      if (conL.vertical==="BOTTOM")         posStyle.bottom = 0;
      else if (conL.vertical==="CENTER")    { posStyle.top="50%"; posStyle.transform=(posStyle.transform||"")+" translateY(-50%)"; }
      else if (conL.vertical==="STRETCH")   { posStyle.top=`${item.y}px`; posStyle.bottom=0; }
      else                                  posStyle.top=`${item.y||0}px`;
    } else {
      posStyle = { position:"absolute", left:`${item.x||0}px`, top:`${item.y||0}px` };
    }
    // mouse-drag scroll handler for prototype scroll containers
    const makeDragScroll = (sc) => {
      if (!sc || !isProto) return {};
      let startX, startY, scrollLeft, scrollTop, isDragging = false;
      return {
        onMouseDown: (e) => {
          const el = e.currentTarget;
          isDragging = true;
          startX = e.clientX; startY = e.clientY;
          scrollLeft = el.scrollLeft; scrollTop = el.scrollTop;
          el.style.cursor = "grabbing";
          e.preventDefault(); e.stopPropagation();
          const onMove = (ev) => {
            if (!isDragging) return;
            if (sc.direction === "horizontal") el.scrollLeft = scrollLeft - (ev.clientX - startX);
            else el.scrollTop = scrollTop - (ev.clientY - startY);
          };
          const onUp = () => {
            isDragging = false;
            el.style.cursor = "grab";
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
          };
          window.addEventListener("mousemove", onMove);
          window.addEventListener("mouseup", onUp);
        },
      };
    };
    const dragScrollHandlers = makeDragScroll(sc);
    return (
      <div key={item.id}
        ref={el => compRefs.current[item.id] = el}
        className={sc && isProto ? "sim-noscrollbar" : undefined}
        style={{
          ...posStyle,
          cursor: isProto ? (sc ? "grab" : item.onTap ? "pointer" : "default") : item.isMaster?"pointer":"grab",
          ...(sc ? {
            width:`${clipW}px`, height:`${clipH}px`,
            overflowX: sc.direction==="horizontal" ? (isProto?"scroll":"hidden") : "hidden",
            overflowY: sc.direction==="vertical"   ? (isProto?"scroll":"hidden") : "hidden",
            WebkitOverflowScrolling:"touch",
            scrollbarWidth:"none",
            msOverflowStyle:"none",
            touchAction: isProto ? (sc.direction==="horizontal" ? "pan-x" : "pan-y") : "none",
            userSelect:"none",
            outline: !isProto ? `${sdp(1.5)}px dashed #2591b5` : "none",
            boxSizing:"border-box",
          } : item.wMode==="hug" ? { width:"fit-content" } : item.hMode==="hug" ? { height:"fit-content" } : resolvedW ? { width:`${resolvedW}px` } : {}),
        }}
        {...(isProto && sc ? dragScrollHandlers : {})}
        onMouseDown={e => { if (!isProto) { e.stopPropagation(); startDrag(e, item); } }}
        onMouseEnter={() => !isProto && setHovered(item.id)}
        onMouseLeave={() => !isProto && setHovered(null)}
        onClick={e => { e.stopPropagation(); if (isProto && item.onTap?.type==="navigate") setProtoScreenId(item.onTap.screenId); else if (!isProto) setSelected(item.id); }}
      >
        {!isProto && sc && (
          <div style={{ position:"absolute", top:`${sdp(-14)}px`, left:0, fontSize:`${sdp(9)}px`, color:"#2591b5", background:"#e8f5fa", padding:`${sdp(1)}px ${sdp(5)}px`, borderRadius:`${sdp(4)}px`, whiteSpace:"nowrap", zIndex:10, pointerEvents:"none", fontWeight:700 }}>
            {sc.direction==="horizontal" ? "⇔ 가로 스크롤" : "⇕ 세로 스크롤"}
          </div>
        )}
        {renderComp(item)}
        {!isProto && hovered===item.id && selected!==item.id && renderSelectionBox(item, true)}
        {!isProto && selected===item.id && renderSelectionBox(item, false)}
      </div>
    );
  };

  // ── selection / hover overlay with resize handles ────────────────────────────
  const renderSelectionBox = (item, isHover) => {
    const color  = item.isMaster ? "#ccaa00" : "#111111";
    const bw     = sdp(isHover ? 1 : 1.5);   // border width in dp
    const hSize  = sdp(7);                    // handle square size in dp
    const hOff   = hSize / 2;                 // half, for centering
    const rDp    = sdp(3);                    // border-radius in dp
    const inset  = -(bw + sdp(1));

    // Handle descriptors: key, positioning style (dp), whether it resizes
    const handles = [
      { key:"nw", s:{ top:`-${hOff}px`,  left:`-${hOff}px`  },                        resize:true  },
      { key:"n",  s:{ top:`-${hOff}px`,  left:"50%", transform:`translateX(-${hOff}px)` }, resize:false },
      { key:"ne", s:{ top:`-${hOff}px`,  right:`-${hOff}px` },                        resize:true  },
      { key:"e",  s:{ top:"50%", transform:`translateY(-${hOff}px)`, right:`-${hOff}px` }, resize:true  },
      { key:"se", s:{ bottom:`-${hOff}px`, right:`-${hOff}px` },                      resize:true  },
      { key:"s",  s:{ bottom:`-${hOff}px`, left:"50%", transform:`translateX(-${hOff}px)` }, resize:false },
      { key:"sw", s:{ bottom:`-${hOff}px`, left:`-${hOff}px` },                       resize:true  },
      { key:"w",  s:{ top:"50%", transform:`translateY(-${hOff}px)`, left:`-${hOff}px` }, resize:true  },
    ];
    const cursorMap = { nw:"nw-resize", n:"ns-resize", ne:"ne-resize", e:"ew-resize", se:"se-resize", s:"ns-resize", sw:"sw-resize", w:"ew-resize" };

    return (
      <div style={{ position:"absolute", inset:`${inset}px`, border:`${bw}px solid ${color}${isHover?"88":"ff"}`, borderRadius:`${rDp}px`, pointerEvents:"none", zIndex:20 }}>
        {!isHover && !item.isMaster && handles.map(h => (
          <div key={h.key}
            style={{ position:"absolute", width:`${hSize}px`, height:`${hSize}px`, background:"#fff", border:`${bw}px solid ${color}`, borderRadius:`${sdp(2)}px`, cursor: cursorMap[h.key], pointerEvents:"all", zIndex:21, ...h.s }}
            onMouseDown={h.resize ? (e => startResize(e, item, h.key)) : undefined}
          />
        ))}
        {!isHover && item.isMaster && (
          <div style={{ position:"absolute", top:`-${sdp(8)}px`, right:`-${sdp(8)}px`, background:"#ccaa00", borderRadius:"50%", width:`${sdp(14)}px`, height:`${sdp(14)}px`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:`${sdp(7)}px`, fontWeight:700, color:"#000", pointerEvents:"none" }}>M</div>
        )}
      </div>
    );
  };

  // ── property panel ───────────────────────────────────────────────────────────
  const pCtl = (label, opts, val, key, allowedSet) => {
    const isLocked = allowedSet && allowedSet.length === 0;
    return (
      <div style={{ marginBottom:"10px" }}>
        <div style={{ fontSize:"10px", color:"#aaaaaa", marginBottom:"4px" }}>{label}</div>
        <div style={{ display:"flex", gap:"3px", flexWrap:"wrap" }}>
          {opts.map(o => {
            const dis = !isLocked && allowedSet && !allowedSet.includes(o);
            return (
              <button key={o} disabled={dis || isLocked} onClick={() => !dis && !isLocked && updateItem(sel.id, { [key]: o })}
                style={{ padding:"3px 7px", borderRadius:"4px", background: val===o?"#f0f0f0":"transparent", border: val===o?"1px solid #c0c0c0":"1px solid #e5e5e5", color: isLocked?"#333350": dis?"#252540": val===o?"#333333":"#999999", fontSize:"10px", cursor:(dis||isLocked)?"default":"pointer", textDecoration:dis?"line-through":"none" }}>
                {o}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderProps = () => {
    if (!sel) return (
      <div style={{ padding:"24px 16px", textAlign:"center", color:"#d0d0d0", fontSize:"11px", lineHeight:2 }}>
        컴포넌트를<br/>선택하세요
        <div style={{ marginTop:"14px", padding:"10px", background:"#f4f4f4", borderRadius:"7px", textAlign:"left" }}>
          <div style={{ fontSize:"9px", color:"#aaaaaa", lineHeight:2.2 }}>
            <span style={{ color:"#555555" }}>⌫</span> 삭제<br/>
            <span style={{ color:"#555555" }}>↑↓←→</span> 1dp 이동<br/>
            <span style={{ color:"#555555" }}>⇧ + 화살표</span> 10dp<br/>
            <span style={{ color:"#555555" }}>⌘D</span> 복제<br/>
            <span style={{ color:"#555555" }}>Esc</span> 선택 해제
          </div>
        </div>
      </div>
    );
    const locked = sel.isMaster;
    return (
      <div style={{ padding:"14px", display:"flex", flexDirection:"column" }}>
        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px" }}>
          <div style={{ fontSize:"10px", color: locked?"#ccaa00":"#999999", letterSpacing:"0.12em", textTransform:"uppercase", fontWeight:600 }}>
            {locked && "🔒 "}{sel.type === "frame" ? "Frame" : sel.type === "labelButton" ? "LabelButton" : sel.type === "svg" ? "SVG" : sel.type === "figma" ? "Figma" : "Text"}
          </div>
          <button onClick={() => updateItem(sel.id, { isMaster: !locked })}
            style={{ padding:"2px 6px", borderRadius:"4px", background: locked?"#fffbe6":"transparent", border: locked?"1px solid #e6c800":"1px solid #d0d0d0", color: locked?"#997700":"#888888", fontSize:"9px", cursor:"pointer" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=locked?"#ccaa00":"#999999"; e.currentTarget.style.color=locked?"#664400":"#333333"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=locked?"#e6c800":"#d0d0d0"; e.currentTarget.style.color=locked?"#997700":"#888888"; }}>
            {locked ? "Master 해제" : "Master 지정"}
          </button>
        </div>
        {locked && (
          <div style={{ marginBottom:"10px", padding:"7px 9px", background:"#fffce6", border:"1px solid #e6c800", borderRadius:"6px", fontSize:"10px", color:"#997700", lineHeight:1.6 }}>
            편집이 잠겨있습니다.<br/>복제 후 수정하세요.
          </div>
        )}

        {sel.type === "labelButton" && <>
          <div style={{ marginBottom:"10px" }}>
            <div style={{ fontSize:"10px", color:"#aaaaaa", marginBottom:"4px" }}>labelText</div>
            <input value={sel.labelText} onChange={e => !locked && updateItem(sel.id, { labelText: e.target.value })} readOnly={locked}
              style={{ width:"100%", background:"#ffffff", border:"1px solid #d0d0d0", borderRadius:"5px", padding:"5px 8px", color: locked?"#555570":"#111111", fontSize:"11px", outline:"none", boxSizing:"border-box" }} />
          </div>
          <div style={{ marginBottom:"10px" }}>
            <div style={{ fontSize:"10px", color:"#aaaaaa", marginBottom:"4px" }}>shapeStyle</div>
            <div style={{ display:"flex", gap:"3px" }}>
              {["filled","outlined","text"].map(o => (
                <button key={o} onClick={() => !locked && changeShape(o)} disabled={locked}
                  style={{ padding:"3px 7px", borderRadius:"4px", background: sel.shape===o?"#f0f0f0":"transparent", border: sel.shape===o?"1px solid #c0c0c0":"1px solid #e5e5e5", color: locked?"#333350": sel.shape===o?"#333333":"#999999", fontSize:"10px", cursor: locked?"default":"pointer" }}>
                  {o}
                </button>
              ))}
            </div>
          </div>
          {pCtl("colorStyle", ["primary_v2","gray_v2","gray250_v2"], sel.colorStyle, "colorStyle", locked ? [] : ALLOWED_COLORS[sel.shape])}
          {pCtl("size",   ["medium","small"],            sel.size,   "size",   locked ? [] : undefined)}
          {pCtl("config", ["labelOnly","labelWithIcon"], sel.config, "config", locked ? [] : undefined)}
          {sel.config === "labelWithIcon" && pCtl("iconPos", ["left","right"], sel.iconPos, "iconPos", locked ? [] : undefined)}
          {sel.config === "labelWithIcon" && (
            <div style={{ marginBottom:"10px" }}>
              <div style={{ fontSize:"10px", color:"#aaaaaa", marginBottom:"6px" }}>icon</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:"4px" }}>
                {ICON_NAMES.map(name => (
                  <button key={name} disabled={locked} onClick={() => !locked && updateItem(sel.id, { iconName: name })} title={name}
                    style={{ padding:"5px", borderRadius:"5px", background: sel.iconName===name?"#f0f0f0":"transparent", border: sel.iconName===name?"1px solid #c0c0c0":"1px solid #e5e5e5", cursor: locked?"default":"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <YdsIcon name={name} size={14} color={locked?"#333350": sel.iconName===name?"#333333":"#888888"} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </>}

        {sel.type === "text" && <>
          <div style={{ marginBottom:"10px" }}>
            <div style={{ fontSize:"10px", color:"#aaaaaa", marginBottom:"4px" }}>content</div>
            <textarea value={sel.content} onChange={e => !locked && updateItem(sel.id, { content: e.target.value })} readOnly={locked}
              style={{ width:"100%", background:"#ffffff", border:"1px solid #d0d0d0", borderRadius:"5px", padding:"5px 8px", color: locked?"#555570":"#111111", fontSize:"11px", outline:"none", resize:"vertical", minHeight:"52px", boxSizing:"border-box" }} />
          </div>
          <div style={{ marginBottom:"10px" }}>
            <div style={{ fontSize:"10px", color:"#aaaaaa", marginBottom:"4px" }}>typography</div>
            <select value={sel.style} onChange={e => !locked && updateItem(sel.id, { style: e.target.value })} disabled={locked}
              style={{ width:"100%", background:"#ffffff", border:"1px solid #d0d0d0", borderRadius:"5px", padding:"5px 8px", color: locked?"#555570":"#333333", fontSize:"10px", outline:"none" }}>
              {typography.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
            </select>
          </div>
          <div style={{ marginBottom:"10px" }}>
            <div style={{ fontSize:"10px", color:"#aaaaaa", marginBottom:"4px" }}>color</div>
            <div style={{ display:"flex", gap:"6px", alignItems:"center" }}>
              <input type="color" value={sel.color} onChange={e => !locked && updateItem(sel.id, { color: e.target.value })} disabled={locked}
                style={{ width:"28px", height:"28px", border:"none", background:"none", cursor: locked?"default":"pointer", padding:0, opacity: locked?0.3:1 }} />
              <input value={sel.color} onChange={e => !locked && updateItem(sel.id, { color: e.target.value })} readOnly={locked}
                style={{ flex:1, background:"#ffffff", border:"1px solid #d0d0d0", borderRadius:"5px", padding:"5px 8px", color: locked?"#555570":"#111111", fontSize:"11px", outline:"none" }} />
            </div>
          </div>
        </>}

        {/* Frame-specific properties */}
        {sel.type === "frame" && (
          <div style={{ marginBottom:"10px" }}>
            <div style={{ fontSize:"10px", color:"#aaaaaa", marginBottom:"6px" }}>Frame 이름</div>
            <input value={sel.name||""} onChange={e => updateItem(sel.id, { name:e.target.value })}
              placeholder="Frame"
              style={{ width:"100%", background:"#fff", border:"1px solid #d0d0d0", borderRadius:"5px", padding:"5px 8px", fontSize:"11px", color:"#111", outline:"none", boxSizing:"border-box" }} />
            <div style={{ fontSize:"10px", color:"#aaaaaa", marginTop:"8px", marginBottom:"4px" }}>배경 / 테두리</div>
            <div style={{ display:"flex", gap:"6px", alignItems:"center" }}>
              <input type="color" value={sel.frameBg?.startsWith("rgba") ? "#f0f0f0" : (sel.frameBg||"#f0f0f0")}
                onChange={e => updateItem(sel.id, { frameBg: e.target.value })}
                style={{ width:"28px", height:"28px", border:"none", background:"none", cursor:"pointer", padding:0 }} />
              <input type="color" value={sel.frameBorder||"#cccccc"}
                onChange={e => updateItem(sel.id, { frameBorder: e.target.value })}
                style={{ width:"28px", height:"28px", border:"none", background:"none", cursor:"pointer", padding:0 }} />
              <div style={{ display:"flex", alignItems:"center", gap:"4px", flex:1, background:"#f7f7f7", border:"1px solid #e5e5e5", borderRadius:"5px", padding:"3px 6px" }}>
                <span style={{ fontSize:"9px", color:"#aaa" }}>R</span>
                <input type="number" value={sel.frameRadius||0} onChange={e => updateItem(sel.id, { frameRadius: Number(e.target.value) })}
                  style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:"11px", color:"#111", padding:0 }} />
              </div>
            </div>
          </div>
        )}
        {/* ── FRAME: Position & Size (Figma-style) ── */}
        <div style={{ borderTop:"1px solid #e5e5e5", paddingTop:"10px", marginBottom:"2px" }}>
          {/* X Y row */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4px", marginBottom:"4px", overflow:"hidden" }}>
            {[["X","x"],["Y","y"]].map(([label, key]) => (
              <div key={key} style={{ display:"flex", alignItems:"center", gap:"3px", background:"#f7f7f7", border:"1px solid #e5e5e5", borderRadius:"5px", padding:"3px 5px", overflow:"hidden", minWidth:0 }}>
                <span style={{ fontSize:"9px", color:"#aaaaaa", flexShrink:0 }}>{label}</span>
                <input type="number" value={sel[key]} readOnly={locked}
                  onChange={e => !locked && updateItem(sel.id, { [key]: Number(e.target.value) })}
                  style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:"11px", color: locked?"#999":"#111", padding:0, minWidth:0, width:0 }} />
              </div>
            ))}
          </div>
          {/* W H row with mode icons */}
          {(["w","h"]).map(dim => {
            const modeKey = dim+"Mode";
            const pctKey  = dim+"Pct";
            const devSize = dim==="w" ? device.w : device.h;
            const curMode = sel[modeKey] || "fixed";
            const resolved = curMode==="fill" ? devSize : curMode==="pct" ? Math.round(devSize*(sel[pctKey]||100)/100) : (sel[dim]||"");
            return (
              <div key={dim} style={{ display:"flex", alignItems:"center", gap:"3px", marginBottom:"4px", overflow:"hidden" }}>
                {/* Fixed / Fill / Hug toggles */}
                <div style={{ display:"flex", gap:"2px", flexShrink:0 }}>
                  {[["fixed","—","고정"],["fill","⇔",dim==="w"?"부모 폭 채우기":"부모 높이 채우기"],["hug","⤢","내용에 맞춤"]].map(([m,icon,tip]) => (
                    <button key={m} title={tip} onClick={() => {
                      if(locked)return;
                      const patch = {[modeKey]:m};
                      if(m==="fill"){
                        patch[dim]=devSize;
                        // scroll clip도 같이 갱신
                        if(sel.scroll?.enabled){
                          const scPatch = {...(sel.scroll||{})};
                          if(dim==="w") scPatch.clipW=devSize;
                          else scPatch.clipH=devSize;
                          patch.scroll=scPatch;
                        }
                      } else if(m==="hug"){
                        patch[dim]=undefined;
                      } else if(m==="fixed"){
                        // fixed로 돌아올 때 현재 resolved 값 유지
                        patch[dim]=resolved||devSize;
                      }
                      updateItem(sel.id,patch);
                    }}
                      style={{ width:"18px", height:"18px", borderRadius:"3px", border:"none", cursor:locked?"default":"pointer", fontSize:"10px", display:"flex", alignItems:"center", justifyContent:"center", background:curMode===m?"#111":"#f0f0f0", color:curMode===m?"#fff":"#888", flexShrink:0 }}>
                      {icon}
                    </button>
                  ))}
                </div>
                {/* dim label */}
                <span style={{ fontSize:"9px", color:"#aaa", flexShrink:0, textTransform:"uppercase", width:"9px" }}>{dim}</span>
                {/* value field */}
                <div style={{ flex:1, display:"flex", alignItems:"center", background:"#f7f7f7", border:"1px solid #e5e5e5", borderRadius:"5px", padding:"3px 5px", overflow:"hidden", minWidth:0 }}>
                  {curMode==="hug" ? <span style={{ fontSize:"10px", color:"#aaa" }}>hug</span>
                  : curMode==="fill" ? <span style={{ fontSize:"10px", color:"#aaa" }}>{devSize}</span>
                  : curMode==="pct" ? <>
                      <input type="number" min={1} max={100} value={sel[pctKey]||100} readOnly={locked}
                        onChange={e => { if(locked)return; const pct=Number(e.target.value); updateItem(sel.id,{[pctKey]:pct,[dim]:Math.round(devSize*pct/100)}); }}
                        style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:"11px", color:"#111", padding:0, minWidth:0, width:0 }} />
                      <span style={{ fontSize:"9px", color:"#aaa", flexShrink:0 }}>%</span>
                    </>
                  : <input type="number" value={sel[dim]||""} placeholder="auto" readOnly={locked}
                      onChange={e => !locked && updateItem(sel.id,{[dim]:e.target.value?Number(e.target.value):undefined,[modeKey]:"fixed"})}
                      style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:"11px", color:locked?"#999":"#111", padding:0, minWidth:0, width:0 }} />
                  }
                </div>
                {/* % toggle (fixed only) */}
                {curMode==="fixed" && (
                  <button title="%" onClick={() => { if(locked)return; const pct=sel[pctKey]||Math.round((sel[dim]||devSize)*100/devSize); updateItem(sel.id,{[modeKey]:"pct",[pctKey]:pct,[dim]:Math.round(devSize*pct/100)}); }}
                    style={{ fontSize:"8px", color:"#aaa", background:"transparent", border:"1px solid #e5e5e5", borderRadius:"3px", padding:"2px 3px", cursor:"pointer", flexShrink:0 }}>%</button>
                )}
              </div>
            );
          })}
          {/* Snap toggle */}
          <div style={{ display:"flex", justifyContent:"flex-end" }}>
            <button onClick={() => setSnapGrid(v => !v)}
              style={{ fontSize:"9px", padding:"2px 7px", borderRadius:"4px", background: snapGrid?"#111":"transparent", color: snapGrid?"#fff":"#aaa", border: snapGrid?"none":"1px solid #e5e5e5", cursor:"pointer" }}>
              {snapGrid ? "Snap 8dp ✓" : "Snap off"}
            </button>
          </div>
        </div>

        {/* ── AUTO LAYOUT ── */}
        <div style={{ borderTop:"1px solid #e5e5e5", paddingTop:"10px", marginBottom:"2px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"6px" }}>
            <span style={{ fontSize:"10px", color:"#999", fontWeight:600, letterSpacing:"0.08em" }}>AUTO LAYOUT</span>
            <button onClick={() => {
              if (sel.autoLayout?.enabled)
                updateItem(sel.id, { autoLayout: null });
              else
                updateItem(sel.id, { autoLayout: { enabled:true, direction:"horizontal", gap:8, padT:8, padR:8, padB:8, padL:8, mainAlign:"start", crossAlign:"center", wrap:false } });
            }}
              style={{ padding:"2px 8px", borderRadius:"10px", fontSize:"9px", fontWeight:700, border:"none", cursor:"pointer", background: sel.autoLayout?.enabled?"#111":"#f0f0f0", color: sel.autoLayout?.enabled?"#fff":"#888" }}>
              {sel.autoLayout?.enabled ? "ON" : "OFF"}
            </button>
          </div>
          {sel.autoLayout?.enabled && (() => {
            const al = sel.autoLayout;
            const upAl = (patch) => updateItem(sel.id, { autoLayout: { ...al, ...patch } });
            return (<>
              {/* Direction */}
              <div style={{ display:"flex", gap:"4px", marginBottom:"6px" }}>
                {[["horizontal","⇒ 가로"],["vertical","⇓ 세로"]].map(([d,label]) => (
                  <button key={d} onClick={() => upAl({ direction:d })}
                    style={{ flex:1, padding:"5px", borderRadius:"5px", fontSize:"10px", fontWeight: al.direction===d?700:400, background: al.direction===d?"#111":"transparent", color: al.direction===d?"#fff":"#888", border: al.direction===d?"none":"1px solid #e5e5e5", cursor:"pointer" }}>
                    {label}
                  </button>
                ))}
              </div>
              {/* Gap */}
              <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"6px" }}>
                <span style={{ fontSize:"9px", color:"#aaa", width:"30px" }}>Gap</span>
                <div style={{ flex:1, display:"flex", alignItems:"center", gap:"4px", background:"#f7f7f7", border:"1px solid #e5e5e5", borderRadius:"5px", padding:"3px 6px" }}>
                  <input type="number" value={al.gap} onChange={e => upAl({ gap:Number(e.target.value) })}
                    style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:"11px", color:"#111", padding:0, minWidth:0 }} />
                  <span style={{ fontSize:"9px", color:"#aaa" }}>dp</span>
                </div>
              </div>
              {/* Padding */}
              <div style={{ marginBottom:"6px" }}>
                <div style={{ fontSize:"9px", color:"#aaa", marginBottom:"4px" }}>Padding</div>
                {/* Top row */}
                <div style={{ display:"flex", justifyContent:"center", marginBottom:"3px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"3px", background:"#f7f7f7", border:"1px solid #e5e5e5", borderRadius:"5px", padding:"3px 8px", width:"60px" }}>
                    <span style={{ fontSize:"8px", color:"#aaa" }}>T</span>
                    <input type="number" value={al.padT||0} onChange={e => upAl({ padT:Number(e.target.value) })}
                      style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:"11px", color:"#111", padding:0, minWidth:0 }} />
                  </div>
                </div>
                {/* Middle row: L and R */}
                <div style={{ display:"flex", gap:"4px", justifyContent:"space-between", marginBottom:"3px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"3px", background:"#f7f7f7", border:"1px solid #e5e5e5", borderRadius:"5px", padding:"3px 8px", width:"60px" }}>
                    <span style={{ fontSize:"8px", color:"#aaa" }}>L</span>
                    <input type="number" value={al.padL||0} onChange={e => upAl({ padL:Number(e.target.value) })}
                      style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:"11px", color:"#111", padding:0, minWidth:0 }} />
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:"3px", background:"#f7f7f7", border:"1px solid #e5e5e5", borderRadius:"5px", padding:"3px 8px", width:"60px" }}>
                    <span style={{ fontSize:"8px", color:"#aaa" }}>R</span>
                    <input type="number" value={al.padR||0} onChange={e => upAl({ padR:Number(e.target.value) })}
                      style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:"11px", color:"#111", padding:0, minWidth:0 }} />
                  </div>
                </div>
                {/* Bottom row */}
                <div style={{ display:"flex", justifyContent:"center" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"3px", background:"#f7f7f7", border:"1px solid #e5e5e5", borderRadius:"5px", padding:"3px 8px", width:"60px" }}>
                    <span style={{ fontSize:"8px", color:"#aaa" }}>B</span>
                    <input type="number" value={al.padB||0} onChange={e => upAl({ padB:Number(e.target.value) })}
                      style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:"11px", color:"#111", padding:0, minWidth:0 }} />
                  </div>
                </div>
              </div>
              {/* Align main axis */}
              <div style={{ marginBottom:"4px" }}>
                <div style={{ fontSize:"9px", color:"#aaa", marginBottom:"3px" }}>{al.direction==="horizontal"?"가로 정렬":"세로 정렬"}</div>
                <div style={{ display:"flex", gap:"3px" }}>
                  {[["start","시작"],["center","중앙"],["end","끝"],["space-between","균등"]].map(([v,label]) => (
                    <button key={v} onClick={() => upAl({ mainAlign:v })}
                      style={{ flex:1, padding:"3px 2px", borderRadius:"4px", fontSize:"9px", background: al.mainAlign===v?"#111":"transparent", color: al.mainAlign===v?"#fff":"#888", border: al.mainAlign===v?"none":"1px solid #e5e5e5", cursor:"pointer" }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Align cross axis */}
              <div style={{ marginBottom:"6px" }}>
                <div style={{ fontSize:"9px", color:"#aaa", marginBottom:"3px" }}>{al.direction==="horizontal"?"세로 정렬":"가로 정렬"}</div>
                <div style={{ display:"flex", gap:"3px" }}>
                  {[["start","시작"],["center","중앙"],["end","끝"]].map(([v,label]) => (
                    <button key={v} onClick={() => upAl({ crossAlign:v })}
                      style={{ flex:1, padding:"3px 2px", borderRadius:"4px", fontSize:"9px", background: al.crossAlign===v?"#111":"transparent", color: al.crossAlign===v?"#fff":"#888", border: al.crossAlign===v?"none":"1px solid #e5e5e5", cursor:"pointer" }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Wrap */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"6px" }}>
                <span style={{ fontSize:"9px", color:"#aaa" }}>Wrap</span>
                <button onClick={() => upAl({ wrap: !al.wrap })}
                  style={{ padding:"2px 8px", borderRadius:"10px", fontSize:"9px", fontWeight:700, border:"none", cursor:"pointer", background: al.wrap?"#111":"#f0f0f0", color: al.wrap?"#fff":"#888" }}>
                  {al.wrap?"ON":"OFF"}
                </button>
              </div>
              {/* Platform code hints */}
              <div style={{ background:"#f4f4f4", borderRadius:"6px", padding:"7px 9px", fontSize:"8.5px", lineHeight:1.8, color:"#888" }}>
                <div style={{ fontWeight:700, color:"#555", marginBottom:"3px", fontSize:"9px" }}>코드 변환</div>
                <div><span style={{ color:"#5577cc" }}>iOS</span> {al.direction==="horizontal"
                  ? `HStack(alignment: .${al.crossAlign==="start"?"top":al.crossAlign==="end"?"bottom":"center"}, spacing: ${al.gap})`
                  : `VStack(alignment: .${al.crossAlign==="start"?"leading":al.crossAlign==="end"?"trailing":"center"}, spacing: ${al.gap})`}</div>
                <div style={{ marginTop:"2px" }}><span style={{ color:"#aa5500" }}>Android</span> {al.direction==="horizontal"
                  ? `Row(horizontalArrangement = Arrangement.${al.mainAlign==="space-between"?"SpaceBetween":al.mainAlign==="center"?"Center":al.mainAlign==="end"?"End":"Start"}, verticalAlignment = Alignment.${al.crossAlign==="start"?"Top":al.crossAlign==="end"?"Bottom":"CenterVertically"})`
                  : `Column(verticalArrangement = Arrangement.${al.mainAlign==="space-between"?"SpaceBetween":al.mainAlign==="center"?"Center":al.mainAlign==="end"?"Bottom":"Top"}, horizontalAlignment = Alignment.${al.crossAlign==="start"?"Start":al.crossAlign==="end"?"End":"CenterHorizontally"})`}</div>
                <div style={{ marginTop:"2px" }}><span style={{ color:"#338855" }}>XML</span> LinearLayout orientation="{al.direction==="horizontal"?"horizontal":"vertical"}" gravity="{al.mainAlign==="center"?"center":al.mainAlign==="end"?"end":"start"}"</div>
              </div>
            </>);
          })()}
        </div>

        {/* ── SCROLL ── */}
        <div style={{ borderTop:"1px solid #e5e5e5", paddingTop:"10px", marginBottom:"2px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"6px" }}>
            <span style={{ fontSize:"10px", color:"#999", fontWeight:600, letterSpacing:"0.08em" }}>SCROLL</span>
            <button onClick={() => updateItem(sel.id, { scroll: sel.scroll?.enabled ? null : { enabled:true, direction:"horizontal", clipW:sel.w||200, clipH:sel.h||120 } })}
              style={{ padding:"2px 8px", borderRadius:"10px", fontSize:"9px", fontWeight:700, border:"none", cursor:"pointer", background: sel.scroll?.enabled?"#111":"#f0f0f0", color: sel.scroll?.enabled?"#fff":"#888" }}>
              {sel.scroll?.enabled?"ON":"OFF"}
            </button>
          </div>
          {sel.scroll?.enabled && (<>
            <div style={{ display:"flex", gap:"4px", marginBottom:"6px" }}>
              {[["horizontal","⇔ 가로"],["vertical","⇕ 세로"]].map(([d,label]) => (
                <button key={d} onClick={() => updateItem(sel.id, { scroll:{ ...sel.scroll, direction:d } })}
                  style={{ flex:1, padding:"5px", borderRadius:"5px", fontSize:"10px", fontWeight: sel.scroll.direction===d?700:400, background: sel.scroll.direction===d?"#111":"transparent", color: sel.scroll.direction===d?"#fff":"#888", border: sel.scroll.direction===d?"none":"1px solid #e5e5e5", cursor:"pointer" }}>
                  {label}
                </button>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4px", overflow:"hidden" }}>
              {[["W","clipW"],["H","clipH"]].map(([label,key]) => (
                <div key={key} style={{ display:"flex", alignItems:"center", gap:"3px", background:"#f7f7f7", border:"1px solid #e5e5e5", borderRadius:"5px", padding:"3px 5px", overflow:"hidden", minWidth:0 }}>
                  <span style={{ fontSize:"9px", color:"#aaa", flexShrink:0 }}>{label}</span>
                  <input type="number" value={sel.scroll[key]} onChange={e => updateItem(sel.id, { scroll:{ ...sel.scroll, [key]:Number(e.target.value) } })}
                    style={{ flex:1, background:"transparent", border:"none", outline:"none", fontSize:"11px", color:"#111", padding:0, minWidth:0, width:0 }} />
                </div>
              ))}
            </div>
          </>)}
        </div>

        {/* ── INTERACTION ── */}
        {screens.length > 1 && (
          <div style={{ borderTop:"1px solid #e5e5e5", paddingTop:"10px", marginBottom:"2px" }}>
            <div style={{ fontSize:"10px", color:"#999", fontWeight:600, letterSpacing:"0.08em", marginBottom:"6px" }}>INTERACTION</div>
            <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
              <span style={{ fontSize:"9px", color:"#aaa", flexShrink:0 }}>탭 →</span>
              <select value={sel.onTap?.screenId||""} onChange={e => { const v=e.target.value; updateItem(sel.id, { onTap: v?{ type:"navigate", screenId:Number(v) }:null }); }}
                style={{ flex:1, padding:"4px 6px", borderRadius:"5px", border:"1px solid #d0d0d0", background:"#fff", fontSize:"10px", color:"#333", outline:"none" }}>
                <option value="">없음</option>
                {screens.filter(s=>s.id!==activeId).map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            {sel.onTap?.screenId && (
              <div style={{ marginTop:"5px", fontSize:"9px", color:"#5028c8", background:"#f4f0ff", padding:"4px 7px", borderRadius:"5px" }}>
                ▶ "{screens.find(s=>s.id===sel.onTap.screenId)?.name}"으로 이동
              </div>
            )}
          </div>
        )}

        {/* ── ACTIONS ── */}
        <div style={{ borderTop:"1px solid #e5e5e5", paddingTop:"10px", display:"flex", gap:"6px" }}>
          <button onClick={() => duplicateItem(sel)}
            style={{ flex:1, padding:"6px", borderRadius:"5px", background:"transparent", border:"1px solid #b0d0b8", color:"#2a7a4a", fontSize:"10px", cursor:"pointer" }}
            onMouseEnter={e=>{e.currentTarget.style.background="#e8f5ec";}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}>복제</button>
          <button onClick={() => !locked && removeItem(sel.id)} disabled={locked}
            style={{ flex:1, padding:"6px", borderRadius:"5px", background:"transparent", border: locked?"1px solid #ddd":"1px solid #f0b0b0", color: locked?"#ccc":"#aa3333", fontSize:"10px", cursor: locked?"default":"pointer" }}
            onMouseEnter={e=>{if(!locked)e.currentTarget.style.background="#ffeaea";}} onMouseLeave={e=>{if(!locked)e.currentTarget.style.background="transparent";}}>삭제</button>
        </div>
      </div>
    );
  };

  // ── layout ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>

      {/* Mode toggle */}
      <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
        {[["assembly","⬚ 조립"], ["prototype","▶ 프로토타이핑"]].map(([m, label]) => (
          <button key={m} onClick={() => { setMode(m); setSelected(null); }}
            style={{ padding:"6px 16px", borderRadius:"20px", fontSize:"11px", fontWeight: mode===m ? 700 : 400, background: mode===m ? "#111111" : "transparent", color: mode===m ? "#ffffff" : "#888888", border: mode===m ? "none" : "1px solid #e0e0e0", cursor:"pointer", transition:"all 0.15s" }}>
            {label}
          </button>
        ))}
        <div style={{ fontSize:"10px", color:"#cccccc", marginLeft:"8px" }}>
          {isProto ? "실제 앱처럼 — 터치 스크롤 / 핀치 줌" : "컴포넌트 배치 및 편집"}
          {isProto && protoScale !== 1 && (
            <button onClick={() => setProtoScale(1)}
              style={{ marginLeft:"6px", padding:"2px 8px", borderRadius:"10px", fontSize:"9px", background:"#f0f0f0", border:"1px solid #d0d0d0", color:"#555", cursor:"pointer" }}>
              {Math.round(protoScale*100)}% ↺
            </button>
          )}
        </div>
      </div>

      {/* Screens tab bar */}
      <div style={{ display:"flex", alignItems:"center", gap:"4px", padding:"6px 10px", background:"#f8f8f8", border:"1px solid #e5e5e5", borderRadius:"10px", minHeight:"36px" }}>
        {isProto ? (
          /* Prototype mode: prev/next navigation */
          <>
            <button
              onClick={() => {
                const idx = screens.findIndex(s => s.id === protoId);
                if (idx > 0) setProtoScreenId(screens[idx - 1].id);
              }}
              disabled={screens.findIndex(s => s.id === protoId) === 0}
              style={{ padding:"3px 8px", borderRadius:"5px", background:"transparent", border:"1px solid #e0e0e0", color: screens.findIndex(s => s.id === protoId) === 0 ? "#d0d0d0" : "#555555", fontSize:"11px", cursor: screens.findIndex(s => s.id === protoId) === 0 ? "default" : "pointer" }}>
              ‹
            </button>
            <div style={{ display:"flex", gap:"3px", flex:1, justifyContent:"center" }}>
              {screens.map((s, idx) => (
                <button key={s.id} onClick={() => setProtoScreenId(s.id)}
                  style={{ padding:"4px 12px", borderRadius:"16px", fontSize:"11px", background: protoId === s.id ? "#111111" : "transparent", color: protoId === s.id ? "#ffffff" : "#888888", border: protoId === s.id ? "none" : "1px solid #e0e0e0", cursor:"pointer", fontWeight: protoId === s.id ? 700 : 400, transition:"all 0.12s" }}>
                  {s.name}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                const idx = screens.findIndex(s => s.id === protoId);
                if (idx < screens.length - 1) setProtoScreenId(screens[idx + 1].id);
              }}
              disabled={screens.findIndex(s => s.id === protoId) === screens.length - 1}
              style={{ padding:"3px 8px", borderRadius:"5px", background:"transparent", border:"1px solid #e0e0e0", color: screens.findIndex(s => s.id === protoId) === screens.length - 1 ? "#d0d0d0" : "#555555", fontSize:"11px", cursor: screens.findIndex(s => s.id === protoId) === screens.length - 1 ? "default" : "pointer" }}>
              ›
            </button>
          </>
        ) : (
          /* Assembly mode: screen tabs + add/rename/delete */
          <>
            {screens.map(s => (
              <div key={s.id} style={{ display:"flex", alignItems:"center", gap:"2px", position:"relative" }}>
                {renamingId === s.id ? (
                  <input
                    autoFocus
                    value={renameVal}
                    onChange={e => setRenameVal(e.target.value)}
                    onBlur={() => { setScreens(prev => prev.map(sc => sc.id === s.id ? { ...sc, name: renameVal || sc.name } : sc)); setRenamingId(null); }}
                    onKeyDown={e => {
                      if (e.key === "Enter") { setScreens(prev => prev.map(sc => sc.id === s.id ? { ...sc, name: renameVal || sc.name } : sc)); setRenamingId(null); }
                      if (e.key === "Escape") setRenamingId(null);
                    }}
                    style={{ padding:"3px 8px", borderRadius:"5px", border:"1px solid #5028c8", fontSize:"11px", color:"#111111", outline:"none", width:"90px", background:"#fff" }}
                  />
                ) : (
                  <button
                    onClick={() => setActiveScreenId(s.id)}
                    onDoubleClick={() => { setRenamingId(s.id); setRenameVal(s.name); }}
                    style={{ padding:"4px 10px", borderRadius:"16px", fontSize:"11px", background: activeId === s.id ? "#111111" : "transparent", color: activeId === s.id ? "#ffffff" : "#888888", border: activeId === s.id ? "none" : "1px solid #e0e0e0", cursor:"pointer", fontWeight: activeId === s.id ? 700 : 400, transition:"all 0.12s", display:"flex", alignItems:"center", gap:"5px" }}>
                    {s.name}
                    {screens.length > 1 && (
                      <span
                        onClick={e => { e.stopPropagation(); removeScreen(s.id); }}
                        style={{ fontSize:"10px", color: activeId === s.id ? "#ffffff88" : "#cccccc", lineHeight:1, marginLeft:"2px" }}>×</span>
                    )}
                  </button>
                )}
              </div>
            ))}
            <button onClick={addScreen}
              style={{ padding:"4px 8px", borderRadius:"5px", background:"transparent", border:"1px dashed #d0d0d0", color:"#aaaaaa", fontSize:"11px", cursor:"pointer", flexShrink:0, marginLeft:"2px" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="#5028c8"; e.currentTarget.style.color="#5028c8"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="#d0d0d0"; e.currentTarget.style.color="#aaaaaa"; }}>
              + 화면
            </button>
            <div style={{ fontSize:"9px", color:"#cccccc", marginLeft:"auto", flexShrink:0 }}>더블클릭 → 이름 편집</div>
          </>
        )}
      </div>

    <div style={{ display:"flex", gap:"16px", alignItems:"flex-start" }}>

      {/* Left: Device + Palette + Layers */}
      {!isProto && <div style={{ width:"224px", flexShrink:0, display:"flex", flexDirection:"column", gap:"10px" }}>

        {/* AI 명령 패널 */}
        <div style={{ background: aiStatus==="waiting" ? "#fffbe8" : aiStatus==="done" ? "#f0fff4" : aiStatus==="error" ? "#fff0f0" : "#f5f0ff", border:`1px solid ${aiStatus==="waiting"?"#f0c040":aiStatus==="done"?"#88cc88":aiStatus==="error"?"#ee8888":"#c0a0ff"}`, borderRadius:"10px", padding:"10px" }}>
          {/* 프록시 연결 상태 */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"8px" }}>
            <div style={{ fontSize:"10px", fontWeight:700, color:"#5028c8", letterSpacing:"0.1em", textTransform:"uppercase" }}>✦ AI 명령</div>
            {aiProxyUrl
              ? <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
                  <span style={{ fontSize:"9px", color:"#059669", fontWeight:600 }}>⚡ 연결됨</span>
                  <button onClick={disconnectAiProxy} style={{ fontSize:"9px", padding:"1px 6px", borderRadius:"4px", background:"transparent", border:"1px solid #fca5a5", color:"#dc2626", cursor:"pointer" }}>해제</button>
                </div>
              : <button onClick={detectAiProxy}
                  style={{ fontSize:"9px", padding:"2px 8px", borderRadius:"5px", background:"#111", border:"none", color:"#fff", cursor:"pointer", fontWeight:600 }}>
                  AI 활성화
                </button>
            }
          </div>
          {/* 처리 상태 */}
          {aiStatus==="waiting" && (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"6px" }}>
              <div style={{ fontSize:"9px", color:"#b07000", display:"flex", gap:"8px" }}>
                <span>시작 {new Date(aiStartTime).toLocaleTimeString("ko-KR", { hour:"2-digit", minute:"2-digit", second:"2-digit" })}</span>
                <span style={{ fontVariantNumeric:"tabular-nums" }}>경과 {aiElapsed}s</span>
              </div>
              <button onClick={cancelAiCommand} style={{ fontSize:"9px", padding:"1px 8px", borderRadius:"4px", background:"#fff0f0", border:"1px solid #ffaaaa", color:"#cc3333", cursor:"pointer", fontWeight:600 }}>■ 중지</button>
            </div>
          )}
          {aiStatus==="done" && <div style={{ fontSize:"9px", color:"#059669", marginBottom:"6px", fontWeight:600 }}>✓ 완료</div>}
          {aiStatus==="error" && <div style={{ fontSize:"9px", color:"#cc3333", marginBottom:"6px", fontWeight:600 }}>✗ 오류 — 다시 시도하세요</div>}
          <textarea
            value={aiCommand}
            onChange={e => setAiCommand(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); sendAiCommand(); } }}
            placeholder={aiProxyUrl ? "화면을 글로 설명해주세요.\n예) 요기요 홈 화면\n카테고리 + 추천 가게 카드\n\nCmd+Enter로 전송" : "먼저 프록시를 연결해주세요."}
            disabled={aiStatus==="waiting" || !aiProxyUrl}
            style={{ width:"100%", minHeight:"80px", background:"transparent", border:"none", outline:"none", fontSize:"11px", color: aiProxyUrl?"#333":"#aaa", lineHeight:1.6, resize:"none", fontFamily:"inherit", boxSizing:"border-box", padding:0 }}
          />
          <button onClick={sendAiCommand} disabled={aiStatus==="waiting" || !aiCommand.trim() || !aiProxyUrl}
            style={{ marginTop:"6px", width:"100%", padding:"7px", borderRadius:"6px", background: (!aiProxyUrl||aiStatus==="waiting")?"#e5e5e5":"#5028c8", border:"none", color: (!aiProxyUrl||aiStatus==="waiting")?"#aaa":"#fff", fontSize:"11px", fontWeight:700, cursor: (!aiProxyUrl||aiStatus==="waiting")?"default":"pointer", transition:"all 0.15s" }}>
            {aiStatus==="waiting" ? "처리 중..." : "→ 화면 그리기"}
          </button>
        </div>

        <div style={{ background:"#ffffff", border:"1px solid #e5e5e5", borderRadius:"10px", padding:"12px" }}>
          <div style={{ fontSize:"10px", color:"#999999", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:"8px", fontWeight:600 }}>Platform</div>
          <div style={{ display:"flex", gap:"5px", marginBottom:"10px" }}>
            {["ios","android"].map(p => (
              <button key={p} onClick={() => { setPlatform(p); setDeviceIdx(0); }}
                style={{ flex:1, padding:"6px", borderRadius:"6px", background: platform===p?"#f0f0f0":"transparent", border: platform===p?"1px solid #c0c0c0":"1px solid #e5e5e5", color: platform===p?"#333333":"#999999", fontSize:"11px", cursor:"pointer", fontWeight: platform===p?700:400, textTransform:"uppercase" }}>
                {p === "ios" ? "iOS" : "Android"}
              </button>
            ))}
          </div>
          <select value={deviceIdx} onChange={e => setDeviceIdx(Number(e.target.value))}
            style={{ width:"100%", background:"#ffffff", border:"1px solid #d0d0d0", borderRadius:"6px", padding:"5px 8px", color:"#333333", fontSize:"10px", outline:"none" }}>
            {DEVICES[platform].map((d, i) => <option key={i} value={i}>{d.name} ({d.w}×{d.h})</option>)}
          </select>
          <button onClick={() => setDarkMode(d => !d)}
            style={{ marginTop:"8px", width:"100%", padding:"7px", borderRadius:"6px", border:`1px solid ${darkMode?"#5a5a9a":"#e5e5e5"}`, background: darkMode?"#1a1a3a":"transparent", color: darkMode?"#333333":"#999999", fontSize:"11px", cursor:"pointer", fontWeight:600, transition:"all 0.15s" }}>
            {darkMode ? "☾  Dark" : "☀  Light"}
          </button>
        </div>

        {/* Palette */}
        <div style={{ background:"#ffffff", border:"1px solid #e5e5e5", borderRadius:"10px", padding:"12px" }}>
          <div style={{ fontSize:"10px", color:"#999999", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:"8px", fontWeight:600 }}>Add</div>
          <div style={{ display:"flex", flexDirection:"column", gap:"5px" }}>
            {[{ type:"frame", label:"▣  Frame" }, { type:"labelButton", label:"⬚  LabelButton" }, { type:"text", label:"T   Text" }].map(c => (
              <button key={c.type} onClick={() => addItem(c.type)}
                style={{ padding:"8px 10px", borderRadius:"7px", background:"transparent", border:"1px solid #e5e5e5", color:"#888888", fontSize:"11px", cursor:"pointer", textAlign:"left", transition:"all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="#c0c0c0"; e.currentTarget.style.color="#333333"; e.currentTarget.style.background="#f4f4f4"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="#e5e5e5"; e.currentTarget.style.color="#888888"; e.currentTarget.style.background="transparent"; }}>
                + {c.label}
              </button>
            ))}
            <button onClick={() => { setShowFigmaPanel(v => !v); setShowDraftPicker(false); }}
              style={{ padding:"8px 10px", borderRadius:"7px", background: showFigmaPanel?"#111111":"transparent", border: showFigmaPanel?"1px solid #333333":"1px solid #e5e5e5", color: showFigmaPanel?"#ffffff":"#888888", fontSize:"11px", cursor:"pointer", textAlign:"left", transition:"all 0.15s" }}
              onMouseEnter={e => { if (!showFigmaPanel) { e.currentTarget.style.borderColor="#c0c0c0"; e.currentTarget.style.color="#333333"; e.currentTarget.style.background="#f4f4f4"; }}}
              onMouseLeave={e => { if (!showFigmaPanel) { e.currentTarget.style.borderColor="#e5e5e5"; e.currentTarget.style.color="#888888"; e.currentTarget.style.background="transparent"; }}}>
              ◈  Figma SVG
            </button>
            {(
              <button onClick={() => {
                const next = !showDraftPicker;
                setShowDraftPicker(next);
                setShowFigmaPanel(false);
                if (next) {
                  setPickerLoading(true);
                  fetchComponents()
                    .then(rows => { setPickerDrafts(rows.map(rowToDraft)); setPickerLoading(false); })
                    .catch(e => { toast("불러오기 실패: " + e.message, "error"); setPickerLoading(false); });
                }
              }}
                style={{ padding:"8px 10px", borderRadius:"7px", background: showDraftPicker?"#5028c8":"transparent", border: showDraftPicker?"1px solid #5028c8":"1px solid #e5e5e5", color: showDraftPicker?"#ffffff":"#888888", fontSize:"11px", cursor:"pointer", textAlign:"left", transition:"all 0.15s", display:"flex", alignItems:"center", justifyContent:"space-between" }}
                onMouseEnter={e => { if (!showDraftPicker) { e.currentTarget.style.borderColor="#c0c0c0"; e.currentTarget.style.color="#333333"; e.currentTarget.style.background="#f4f4f4"; }}}
                onMouseLeave={e => { if (!showDraftPicker) { e.currentTarget.style.borderColor="#e5e5e5"; e.currentTarget.style.color="#888888"; e.currentTarget.style.background="transparent"; }}}>
                <span>◈  From Drafts</span>
                {pickerLoading
                  ? <span style={{ display:"inline-block", width:"10px", height:"10px", border:"1.5px solid rgba(255,255,255,0.4)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.6s linear infinite" }} />
                  : <span style={{ fontSize:"9px", background: showDraftPicker?"rgba(255,255,255,0.3)":"#e5e5e5", color: showDraftPicker?"#fff":"#888888", borderRadius:"10px", padding:"1px 6px" }}>{pickerDrafts.length}</span>
                }
              </button>
            )}
          </div>
        </div>

        {/* Figma Import Panel */}
        {showFigmaPanel && (
          <FigmaImportPanel
            onClose={() => setShowFigmaPanel(false)}
            onAdd={(payload) => {
              // 배열이면 Figma 레이어 트리 변환 결과
              if (Array.isArray(payload)) {
                setItems(prev => [...prev, ...payload]);
                setSelected(payload[0]?.id || null);
              } else {
                const { svgData, w, h } = payload;
                const id = Date.now();
                setItems(prev => [...prev, { id, type:"svg", svgData, w, h, x:16, y:Math.min(16+prev.length*40,400), isMaster:false }]);
                setSelected(id);
              }
              setShowFigmaPanel(false);
            }}
          />
        )}

        {/* Draft Picker */}
        {showDraftPicker && (
          <div style={{ background:"#ffffff", border:"1px solid #5028c8", borderRadius:"10px", padding:"12px", display:"flex", flexDirection:"column", gap:"6px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontSize:"10px", fontWeight:700, color:"#5028c8", letterSpacing:"0.1em", textTransform:"uppercase" }}>Components</div>
              <button onClick={() => setShowDraftPicker(false)} style={{ background:"none", border:"none", color:"#aaaaaa", cursor:"pointer", fontSize:"14px" }}>×</button>
            </div>
            {pickerLoading && (
              <div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"8px 0", color:"#aaa", fontSize:"11px" }}>
                <span style={{ display:"inline-block", width:"10px", height:"10px", border:"1.5px solid #e5e5e5", borderTopColor:"#5028c8", borderRadius:"50%", animation:"spin 0.6s linear infinite" }} />
                불러오는 중...
              </div>
            )}
            {!pickerLoading && pickerDrafts.length === 0 && (
              <div style={{ fontSize:"11px", color:"#aaaaaa", padding:"8px 0" }}>저장된 컴포넌트가 없습니다</div>
            )}
            {!pickerLoading && pickerDrafts.map(draft => {
              const dw = draft.w || 100;
              const dh = draft.h || 100;
              const scale = Math.min(60 / dw, 40 / dh, 1);
              return (
                <button key={draft.id}
                  onClick={() => {
                    const id = Date.now();
                    setItems(prev => [...prev, { id, type:"svg", svgData: draft.svgData, w: dw, h: dh, x:16, y:Math.min(16+prev.length*40,400), isMaster:false }]);
                    setSelected(id);
                    setShowDraftPicker(false);
                  }}
                  style={{ display:"flex", alignItems:"center", gap:"10px", padding:"8px", borderRadius:"7px", background:"transparent", border:"1px solid #e5e5e5", cursor:"pointer", textAlign:"left", transition:"all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background="#f4f0ff"; e.currentTarget.style.borderColor="#5028c8"; }}
                  onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor="#e5e5e5"; }}>
                  <div style={{ width:60, height:40, background:"#f5f5f5", borderRadius:"5px", flexShrink:0, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <div style={{ transform:`scale(${scale})`, transformOrigin:"center center", lineHeight:0 }}
                      dangerouslySetInnerHTML={{ __html: draft.svgData }} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:"11px", fontWeight:600, color:"#333333", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{draft.name}</div>
                    <div style={{ fontSize:"9px", color:"#aaaaaa", marginTop:"2px" }}>{Math.round(dw)}×{Math.round(dh)}px</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Layers — Figma 스타일 */}
        <div style={{ background:"#ffffff", border:"1px solid #e5e5e5", borderRadius:"10px", padding:"10px", flex:1, minHeight:0, display:"flex", flexDirection:"column" }}>
          <div style={{ fontSize:"10px", color:"#999999", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:"6px", fontWeight:600, flexShrink:0 }}>Layers</div>
          {items.length === 0
            ? <div style={{ fontSize:"10px", color:"#d0d0d0", textAlign:"center", padding:"12px 0" }}>비어있음</div>
            : <div style={{ display:"flex", flexDirection:"column", gap:"0px", overflowY:"auto" }}>
                {(function renderLayerNodes(nodes, depth) {
                  return nodes.map(item => {
                    const hasChildren = item.children?.length > 0;
                    const isCollapsed = collapsedLayers.has(item.id);
                    const isSelected  = selected === item.id;
                    const icon = item.type==="frame" ? "▣" : item.type==="labelButton" ? "⬚" : item.type==="text" ? "T" : item.type==="svg" ? "◈" : item.type==="figma" ? "◈" : "▪";
                    const label = item.type==="text" ? (item.content?.slice(0,20)||(item.name||"Text"))
                      : item.type==="labelButton" ? (item.labelText||"Button")
                      : (item.name || item.type);
                    const typeColor = item.type==="frame" ? "#5028c8" : item.type==="text" ? "#c07000" : "#888";
                    return [
                      <div key={item.id}
                        onClick={() => setSelected(item.id)}
                        style={{
                          display:"flex", alignItems:"center", gap:"2px",
                          paddingLeft:`${4 + depth * 12}px`, paddingRight:"4px",
                          height:"22px",
                          borderRadius:"4px",
                          background: isSelected ? "#e8e3ff" : "transparent",
                          cursor:"pointer",
                          userSelect:"none",
                        }}
                        onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background="#f5f5f5"; }}
                        onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background="transparent"; }}
                      >
                        {/* 삼각형 토글 */}
                        <span onClick={e => { e.stopPropagation(); if (hasChildren) setCollapsedLayers(s => { const n=new Set(s); n.has(item.id)?n.delete(item.id):n.add(item.id); return n; }); }}
                          style={{ width:"12px", fontSize:"8px", color:"#aaa", flexShrink:0, cursor: hasChildren?"pointer":"default", display:"flex", alignItems:"center", justifyContent:"center" }}>
                          {hasChildren ? (isCollapsed ? "▶" : "▼") : ""}
                        </span>
                        {/* 아이콘 */}
                        <span style={{ fontSize:"9px", color: isSelected?"#5028c8":typeColor, flexShrink:0, width:"12px", textAlign:"center" }}>{icon}</span>
                        {/* 이름 */}
                        <span style={{ fontSize:"10px", color: isSelected?"#3010a0":"#333", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1, lineHeight:"22px" }}>
                          {label}
                        </span>
                        {/* 삭제 */}
                        <button onClick={e => { e.stopPropagation(); if (!item.isMaster) removeItem(item.id); }}
                          style={{ background:"none", border:"none", color:"transparent", cursor:"pointer", fontSize:"11px", padding:"0 2px", flexShrink:0 }}
                          onMouseEnter={e => e.currentTarget.style.color="#cc3333"}
                          onMouseLeave={e => e.currentTarget.style.color="transparent"}
                        >×</button>
                      </div>,
                      ...(hasChildren && !isCollapsed ? renderLayerNodes(item.children, depth+1) : [])
                    ];
                  }).flat();
                })(items, 0)}
              </div>
          }
        </div>
      </div>}

      {/* Center: Phone canvas */}
      <style>{`.sim-noscrollbar::-webkit-scrollbar{display:none}`}</style>
      <div style={{ flex:1, display:"flex", justifyContent:"center" }}>
        <PhoneFrame platform={platform} device={device} canvasMode darkMode={darkMode}>
          <div
            ref={protoFrameRef}
            style={{
              position:"absolute", inset:0,
              transform: isProto && protoScale !== 1 ? `scale(${protoScale})` : undefined,
              transformOrigin:"top center",
              touchAction: isProto ? "pan-y pinch-zoom" : "none",
            }}
            onClick={() => !isProto && setSelected(null)}
          >
            {(isProto ? protoScreen?.items || [] : items).map(item => renderItemWrapper(item, null, 0))}
            {(isProto ? protoScreen?.items || [] : items).length === 0 && (
              <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", color:"#bbb", fontSize:`${sdp(12)}px`, fontFamily:"system-ui", pointerEvents:"none", flexDirection:"column", gap:`${sdp(6)}px` }}>
                <span style={{ fontSize:`${sdp(24)}px`, opacity:0.3 }}>+</span>
                <span style={{ opacity:0.4 }}>{isProto ? "조립 모드에서 컴포넌트를 추가하세요" : "Add에서 컴포넌트 추가"}</span>
              </div>
            )}
          </div>
        </PhoneFrame>
      </div>

      {/* Right: Properties (조립 모드만) */}
      {!isProto && <div style={{ width:"224px", flexShrink:0, background:"#ffffff", border:"1px solid #e5e5e5", borderRadius:"10px", overflow:"hidden" }}>
        {renderProps()}
      </div>}

    </div>
    </div>
  );
}

export { DEVICES, PhoneFrame, RenderFigmaNode, rowToDraft, extractSvgSize, parseFigmaUrl };
export default SimulatorSection;
