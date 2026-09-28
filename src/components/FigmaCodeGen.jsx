import { useState, useRef, useEffect } from "react";
import { metaTokens } from "../tokens";
import {
  parseFigmaUrl,
  fetchFigmaImageUrl,
  fetchFigmaNodeData,
  nodeToSpec,
  generateCode,
  compareAndFix,
  buildPreviewHtml,
  MAX_ITER,
} from "../figmaCodeGen";

const TOKEN_KEY = "figma_token";

export default function FigmaCodeGenSection() {
  const [url, setUrl] = useState("");
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [showToken, setShowToken] = useState(false);

  // 실행 상태
  const [phase, setPhase] = useState("idle"); // idle | figma | generate | verify | done | error
  const [figmaImg, setFigmaImg] = useState(null);
  const [code, setCode] = useState("");
  const [spec, setSpec] = useState("");
  const [error, setError] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [verifyLog, setVerifyLog] = useState("");
  const [verifyCount, setVerifyCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [componentName, setComponentName] = useState("");

  const timerRef = useRef(null);
  const runningRef = useRef(false);

  const saveToken = (t) => { setToken(t); localStorage.setItem(TOKEN_KEY, t); };

  const reset = () => {
    setPhase("idle");
    setFigmaImg(null);
    setCode("");
    setSpec("");
    setError("");
    setElapsed(0);
    setVerifyLog("");
    setVerifyCount(0);
    setComponentName("");
    runningRef.current = false;
    clearInterval(timerRef.current);
  };

  const run = async () => {
    if (runningRef.current) return;
    runningRef.current = true;
    setError("");
    setCode("");
    setFigmaImg(null);
    setVerifyLog("");
    setVerifyCount(0);
    setElapsed(0);

    const start = Date.now();
    timerRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 1000);

    try {
      const parsed = parseFigmaUrl(url);
      if (!parsed) throw new Error("올바른 Figma URL이 아닙니다.");
      if (!parsed.nodeId) throw new Error("node-id가 URL에 없습니다. 레이어를 선택한 후 링크를 복사해주세요.");
      if (!token.trim()) throw new Error("Figma Access Token을 입력해주세요.");

      // 1. Figma 데이터 가져오기
      setPhase("figma");
      const [imgUrl, nodeData] = await Promise.all([
        fetchFigmaImageUrl(parsed.fileKey, parsed.nodeId, token.trim()),
        fetchFigmaNodeData(parsed.fileKey, parsed.nodeId, token.trim()),
      ]);
      setFigmaImg(imgUrl);
      const designSpec = nodeToSpec(nodeData);
      setSpec(designSpec);

      // 컴포넌트 이름 추출
      const name = nodeData?.name?.replace(/[^a-zA-Z0-9가-힣]/g, "") || "FigmaComponent";
      const pascalName = name.charAt(0).toUpperCase() + name.slice(1);
      setComponentName(pascalName);

      // 2. 코드 생성
      setPhase("generate");
      const generatedCode = await generateCode(designSpec, (partial) => {
        setCode(partial.replace(/^```[\w]*\n?/i, ""));
      });
      setCode(generatedCode);

      // 3. 자동 검증 (1회)
      setPhase("verify");
      setVerifyLog("▶ 검증 1회차 분석 중...\n");
      const result = await compareAndFix(designSpec, generatedCode, (delta, full) => {
        setVerifyLog("▶ 검증 1회차\n" + full);
      });
      setVerifyCount(1);

      if (!result.done) {
        setCode(result.code);
        setVerifyLog(prev => prev + "\n🔧 차이 발견, 코드 수정 완료\n");
      } else {
        setVerifyLog(prev => prev + "\n✅ 스펙과 일치 — 수정 불필요\n");
      }

      setPhase("done");
    } catch (e) {
      setError(e.message);
      setPhase("error");
    } finally {
      runningRef.current = false;
      clearInterval(timerRef.current);
    }
  };

  const runExtraVerify = async () => {
    if (runningRef.current) return;
    runningRef.current = true;
    setVerifyLog(prev => prev + `\n▶ 추가 검증 ${verifyCount + 1}회차 분석 중...\n`);
    try {
      const result = await compareAndFix(spec, code, (delta, full) => {
        setVerifyLog(prev => {
          const lines = prev.split("\n");
          const idx = lines.findLastIndex(l => l.startsWith("▶ 추가 검증"));
          if (idx >= 0) return lines.slice(0, idx + 1).join("\n") + "\n" + full;
          return prev + full;
        });
      });
      setVerifyCount(c => c + 1);
      if (!result.done) {
        setCode(result.code);
        setVerifyLog(prev => prev + "\n🔧 코드 수정 완료\n");
      } else {
        setVerifyLog(prev => prev + "\n✅ 스펙 일치\n");
      }
    } catch (e) {
      setVerifyLog(prev => prev + `\n❌ 검증 오류: ${e.message}\n`);
    } finally {
      runningRef.current = false;
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 컴포넌트 코드에서 이름 추출
  const extractedName = code.match(/export\s+default\s+function\s+(\w+)/)?.[1] || componentName || "Component";

  const previewHtml = code ? buildPreviewHtml(code) : "";

  // ── 스타일 상수 ───────────────────────────────────────────────────────────
  const S = {
    card: { background:"#ffffff", borderRadius:12, overflow:"hidden" },
    header: { padding:"14px 20px", background:"linear-gradient(135deg, #f5f0ff 0%, #ede8ff 100%)", borderBottom:"1px solid #e0d8f4", display:"flex", alignItems:"center", gap:10 },
    headerIcon: { fontSize:18 },
    headerTitle: { fontSize:11, fontWeight:700, color:"#7740c8", letterSpacing:"0.08em" },
    headerSub: { fontSize:10, color:"#9a70d8", marginTop:1 },
    input: { width:"100%", padding:"8px 12px", borderRadius:8, border:"1px solid #e0e0e0", fontSize:12, color:"#333", outline:"none", boxSizing:"border-box", fontFamily:"Pretendard, sans-serif" },
    btnPrimary: { padding:"9px 24px", borderRadius:20, background:"#7740c8", border:"none", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" },
    btnGhost: { padding:"6px 14px", borderRadius:16, background:"transparent", border:"1px solid #ddd", fontSize:11, color:"#777", cursor:"pointer" },
    label: { fontSize:10, fontWeight:700, color:"#555", marginBottom:4 },
  };

  return (
    <div style={{ padding:"24px 32px", maxWidth:900 }}>
      <h2 style={{ fontSize:20, fontWeight:700, color:"#1a1a1a", marginBottom:4 }}>Figma → Code</h2>
      <p style={{ fontSize:13, color:"#888", marginBottom:24, lineHeight:1.6 }}>
        Figma URL을 넣으면 YDS 2.0 기반 React 컴포넌트 코드를 자동 생성합니다.
      </p>

      {/* ── 입력 영역 ── */}
      <div style={{ ...S.card, border:"1px solid #e5e5e5", marginBottom:20 }}>
        <div style={S.header}>
          <span style={S.headerIcon}>🎨</span>
          <div>
            <div style={S.headerTitle}>FIGMA → REACT + YDS 2.0</div>
            <div style={S.headerSub}>디자인 스펙 추출 → 코드 생성 → 자동 검증</div>
          </div>
        </div>

        <div style={{ padding:16, display:"flex", flexDirection:"column", gap:12 }}>
          {/* Token */}
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
              <span style={S.label}>Figma Access Token</span>
              <button onClick={() => setShowToken(p => !p)} style={{ fontSize:9, color:"#aaa", background:"none", border:"none", cursor:"pointer" }}>
                {showToken ? "숨기기" : "보기"}
              </button>
            </div>
            <input
              type={showToken ? "text" : "password"}
              value={token}
              onChange={e => saveToken(e.target.value)}
              placeholder="figd_xxxxxxxx..."
              style={{ ...S.input, fontFamily:"monospace", fontSize:11 }}
            />
          </div>

          {/* URL */}
          <div>
            <div style={S.label}>Figma Design URL</div>
            <input
              value={url}
              onChange={e => { setUrl(e.target.value); setError(""); }}
              placeholder="https://www.figma.com/design/..."
              style={{ ...S.input, border: error && phase === "error" ? "1px solid #cc3333" : "1px solid #e0e0e0" }}
            />
          </div>

          {/* 실행 버튼 */}
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <button
              onClick={phase === "idle" || phase === "error" || phase === "done" ? run : null}
              disabled={phase === "figma" || phase === "generate" || phase === "verify" || !url.trim()}
              style={{
                ...S.btnPrimary,
                opacity: (phase === "figma" || phase === "generate" || phase === "verify" || !url.trim()) ? 0.5 : 1,
                cursor: (phase === "figma" || phase === "generate" || phase === "verify" || !url.trim()) ? "default" : "pointer",
              }}
            >
              {phase === "idle" || phase === "error" ? "▶ 코드 생성" : phase === "done" ? "↺ 재생성" : "생성 중..."}
            </button>
            {phase === "done" && (
              <button onClick={reset} style={S.btnGhost}>초기화</button>
            )}
            {(phase === "figma" || phase === "generate" || phase === "verify") && (
              <span style={{ fontSize:11, color:"#7740c8" }}>
                {phase === "figma" && "🎨 Figma 디자인 읽는 중..."}
                {phase === "generate" && "⚙️ 코드 생성 중..."}
                {phase === "verify" && "🔍 스펙 검증 중..."}
                <span style={{ color:"#bbb", marginLeft:8 }}>{elapsed}s</span>
              </span>
            )}
          </div>

          {error && <div style={{ fontSize:11, color:"#cc3333", lineHeight:1.6 }}>{error}</div>}
        </div>
      </div>

      {/* ── 결과 영역 ── */}
      {(code || figmaImg) && (
        <div style={{ ...S.card, border:"1px solid #e0d8f4" }}>
          {/* 검증 상태 */}
          <div style={{ padding:"10px 16px", display:"flex", alignItems:"center", gap:8, borderBottom:"1px solid #eee", background:"#fafafa" }}>
            <span style={{ fontSize:11, color:"#888" }}>
              {verifyCount === 0 ? "생성 중..." : `✅ ${verifyCount}회 검증 완료`}
            </span>
            {phase === "done" && (
              <button onClick={runExtraVerify} disabled={runningRef.current} style={{ ...S.btnGhost, marginLeft:"auto", fontSize:10, color:"#7740c8", borderColor:"#c8aaee" }}>
                🔍 추가 검증
              </button>
            )}
          </div>

          {/* Figma 원본 vs 생성 결과 — 나란히 */}
          <div style={{ display:"flex", minHeight:400, position:"relative" }}>
            {figmaImg && (
              <div style={{ flex:1, borderRight:"1px solid #eee", display:"flex", flexDirection:"column" }}>
                <div style={{ padding:"6px 12px", fontSize:10, fontWeight:700, color:"#9970d8", background:"#faf8ff", borderBottom:"1px solid #eee", letterSpacing:"0.1em" }}>
                  FIGMA 원본
                </div>
                <div style={{ flex:1, overflow:"auto", padding:8 }}>
                  <img src={figmaImg} alt="Figma" style={{ maxWidth:"100%", display:"block" }} crossOrigin="anonymous" />
                </div>
              </div>
            )}
            <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
              <div style={{ padding:"6px 12px", fontSize:10, fontWeight:700, color:"#448844", background:"#f8fff8", borderBottom:"1px solid #eee", letterSpacing:"0.1em", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span>REACT + YDS 결과</span>
                {code && (
                  <button
                    onClick={() => setExpanded(true)}
                    style={{ fontSize:9, color:"#888", background:"rgba(255,255,255,0.8)", border:"1px solid #ddd", borderRadius:6, padding:"2px 8px", cursor:"pointer" }}
                  >
                    ⤢ 크게
                  </button>
                )}
              </div>
              {previewHtml ? (
                <iframe
                  srcDoc={previewHtml}
                  style={{ flex:1, border:"none", minHeight:360 }}
                  sandbox="allow-scripts"
                  title="preview"
                />
              ) : (
                <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", color:"#ccc", fontSize:12 }}>
                  {phase !== "idle" ? "생성 중..." : "코드가 여기에 표시됩니다"}
                </div>
              )}
            </div>
          </div>

          {/* 검증 로그 */}
          {verifyLog && (
            <details style={{ borderTop:"1px solid #eee" }}>
              <summary style={{ padding:"8px 16px", fontSize:10, fontWeight:700, color:"#7740c8", cursor:"pointer", background:"#fafafa" }}>
                검증 로그
              </summary>
              <pre style={{ margin:0, padding:"12px 16px", fontSize:10, color:"#cdd9e5", background:"#0d1117", overflow:"auto", maxHeight:200, whiteSpace:"pre-wrap", lineHeight:1.7 }}>
                {verifyLog}
              </pre>
            </details>
          )}

          {/* 액션 버튼 */}
          {phase === "done" && (
            <div style={{ padding:"12px 16px", display:"flex", gap:8, flexWrap:"wrap", alignItems:"center", borderTop:"1px solid #eee" }}>
              <button onClick={copy} style={{ ...S.btnGhost, fontWeight:600, color: copied ? "#338833" : "#555", borderColor: copied ? "#88cc88" : "#ddd", background: copied ? "#f0fff4" : "transparent" }}>
                {copied ? "✓ 복사됨" : "📋 코드 복사"}
              </button>
              <button onClick={() => setShowCode(v => !v)} style={S.btnGhost}>
                {showCode ? "코드 숨기기" : "</> 코드 보기"}
              </button>
              <span style={{ fontSize:10, color:"#bbb", marginLeft:"auto" }}>
                {extractedName} · {code.split("\n").length}줄 · {elapsed}s
              </span>
            </div>
          )}

          {/* 코드 보기 */}
          {showCode && code && (
            <div style={{ borderTop:"1px solid #eee" }}>
              <pre style={{ margin:0, padding:16, fontSize:11, color:"#a8d8ea", background:"#1a1a2e", overflow:"auto", maxHeight:400, whiteSpace:"pre-wrap", wordBreak:"break-all", lineHeight:1.6 }}>
                {code}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* ── 전체화면 오버레이 ── */}
      {expanded && previewHtml && (
        <div style={{ position:"fixed", inset:0, zIndex:9999, background:"#fff", display:"flex", flexDirection:"column" }}>
          <div style={{ padding:"10px 16px", background:"#faf8ff", borderBottom:"1px solid #e0d8f4", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
            <span style={{ fontSize:12, fontWeight:700, color:"#7740c8" }}>🎨 {extractedName}</span>
            <span style={{ fontSize:11, color:"#aaa", flex:1 }}>전체화면 미리보기</span>
            <button onClick={() => setExpanded(false)} style={{ padding:"5px 14px", background:"#f0ebff", border:"1px solid #c8aaee", borderRadius:8, fontSize:12, color:"#7740c8", cursor:"pointer", fontWeight:700 }}>
              ✕ 닫기
            </button>
          </div>
          <div style={{ flex:1, display:"flex" }}>
            {figmaImg && (
              <div style={{ flex:1, borderRight:"1px solid #eee", overflow:"auto" }}>
                <div style={{ padding:"6px 12px", fontSize:10, fontWeight:700, color:"#9970d8", background:"#faf8ff", borderBottom:"1px solid #eee" }}>FIGMA 원본</div>
                <img src={figmaImg} alt="Figma" style={{ maxWidth:"100%", display:"block", padding:8 }} />
              </div>
            )}
            <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
              <div style={{ padding:"6px 12px", fontSize:10, fontWeight:700, color:"#448844", background:"#f8fff8", borderBottom:"1px solid #eee" }}>REACT + YDS 결과</div>
              <iframe srcDoc={previewHtml} style={{ flex:1, border:"none" }} sandbox="allow-scripts" title="fullscreen preview" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
