import { useState, useRef, useEffect } from "react";
import { metaTokens, colors } from "../tokens";
import { supabase } from "../supabase.js";

function FigmaLiveSection() {
  const [code, setCode]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [ts, setTs]           = useState(null);
  const iframeRef             = useRef(null);

  // Supabase 직접 조회 (supabase.js의 client 재사용)
  const loadCode = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: sbErr } = await supabase
        .from("context_notes")
        .select("content, updated_at")
        .eq("title", "figma_component_latest")
        .single();
      if (sbErr) throw sbErr;
      setCode(data.content);
      setTs(data.updated_at);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  // 페이지 로드 시 또는 #figma-live 해시가 있을 때 자동 로드
  useEffect(() => {
    loadCode();
  }, []);

  // tokens JSON (iframe에 주입)
  const tokensJson = JSON.stringify({ metaTokens, colors });

  // iframe srcDoc 생성
  const buildSrcDoc = (userCode) => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, 'Pretendard', sans-serif; background: #f5f5f5; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 24px; }
    #root { width: 100%; }
    .error-box { background: #fff0f0; border: 1px solid #ffcccc; border-radius: 8px; padding: 16px; color: #cc0000; font-size: 12px; white-space: pre-wrap; font-family: monospace; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script>
    const __tokens = ${tokensJson.replace(/</g, "\\u003c")};
    window.metaTokens = __tokens.metaTokens;
    window.colors = __tokens.colors;
  </script>
  <script type="text/babel" data-presets="react">
    const { useState, useEffect, useRef } = React;
    const metaTokens = window.metaTokens;
    const colors = window.colors;

    // ── user component code ──
    try {
      ${userCode}

      // Try to mount: look for default export or last-defined component
      const root = ReactDOM.createRoot(document.getElementById('root'));
      if (typeof App !== 'undefined') {
        root.render(React.createElement(App));
      } else if (typeof Component !== 'undefined') {
        root.render(React.createElement(Component));
      } else if (typeof Preview !== 'undefined') {
        root.render(React.createElement(Preview));
      } else {
        document.getElementById('root').innerHTML = '<div class="error-box">컴포넌트를 찾을 수 없습니다.\\nApp, Component, 또는 Preview 함수를 export하거나 정의해주세요.</div>';
      }
    } catch(e) {
      document.getElementById('root').innerHTML = '<div class="error-box">렌더링 오류:\\n' + e.message + '</div>';
    }
  </script>
</body>
</html>`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header bar */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#111" }}>Figma Live Preview</div>
          <div style={{ fontSize: "11px", color: "#aaa", marginTop: "2px" }}>
            {ts ? `마지막 업데이트: ${new Date(ts).toLocaleString("ko-KR")}` : "alfred-agent에서 생성한 최신 컴포넌트 코드"}
          </div>
        </div>
        <button
          onClick={loadCode}
          disabled={loading}
          style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", background: loading ? "#f0f0f0" : "#111111", color: loading ? "#aaaaaa" : "#ffffff", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: loading ? "default" : "pointer", transition: "all 0.15s" }}>
          {loading
            ? <><span style={{ display: "inline-block", width: "12px", height: "12px", border: "2px solid #aaa", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />로딩 중...</>
            : <>↻ 새로고침</>}
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div style={{ background: "#fff0f0", border: "1px solid #ffcccc", borderRadius: "10px", padding: "16px", color: "#cc0000", fontSize: "12px", fontFamily: "monospace" }}>
          오류: {error}
        </div>
      )}

      {/* Code + Preview split */}
      {code && !error && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", alignItems: "start" }}>
          {/* Code panel */}
          <div style={{ background: "#1a1a2e", borderRadius: "12px", overflow: "hidden" }}>
            <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "11px", color: "#7070a0", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>JSX</span>
              <span style={{ fontSize: "10px", color: "#555575" }}>{code.split("\n").length} lines</span>
            </div>
            <pre style={{ padding: "16px", fontSize: "11px", lineHeight: "1.7", color: "#c8d0e0", overflowX: "auto", overflowY: "auto", maxHeight: "480px", whiteSpace: "pre", fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
              {code}
            </pre>
          </div>

          {/* Preview panel */}
          <div style={{ background: "#ffffff", borderRadius: "12px", overflow: "hidden", border: "1px solid #e5e5e5" }}>
            <div style={{ padding: "10px 16px", borderBottom: "1px solid #e5e5e5", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4cdd80", display: "inline-block" }} />
              <span style={{ fontSize: "11px", color: "#aaaaaa", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Live Preview</span>
            </div>
            <iframe
              ref={iframeRef}
              srcDoc={buildSrcDoc(code)}
              sandbox="allow-scripts"
              style={{ width: "100%", height: "480px", border: "none", display: "block" }}
              title="Figma Live Preview"
            />
          </div>
        </div>
      )}

      {/* Empty state */}
      {!code && !loading && !error && (
        <div style={{ background: "#f8f8f8", borderRadius: "12px", padding: "48px", textAlign: "center", color: "#aaaaaa" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>🎨</div>
          <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "#888888" }}>컴포넌트 없음</div>
          <div style={{ fontSize: "11px" }}>alfred-agent에서 Figma 컴포넌트를 생성하면 여기에 표시됩니다</div>
        </div>
      )}
    </div>
  );
}

export default FigmaLiveSection;
