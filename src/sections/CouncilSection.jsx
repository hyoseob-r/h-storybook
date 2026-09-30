import { useState, useEffect } from "react";

// ─── Council Results Section ────────────────────────────────────────────────
// alfred-agent get-context API에서 Council 토론 결과를 가져와 시각화
// #t-005: Storybook × Agent 통합

const API_BASE = "https://alfred-agent-nine.vercel.app/api";

const AGENT_COLORS = {
  designer:   { bg: "#FFF0F5", accent: "#D93759", label: "Ms. Designer" },
  engineer:   { bg: "#F0F7FF", accent: "#0C74E4", label: "Mr. Engineer" },
  strategist: { bg: "#F5FFF0", accent: "#168046", label: "Ms. Strategist" },
  pm:         { bg: "#FFF8F0", accent: "#E26917", label: "Mr. PM" },
  data:       { bg: "#F0F0FF", accent: "#5F3E9B", label: "Ms. Data" },
  marketing:  { bg: "#FFFFF0", accent: "#D47C00", label: "Mr. Marketing" },
  veritas:    { bg: "#F8F8F8", accent: "#333333", label: "Dr. Veritas" },
  user:       { bg: "#E8F5E8", accent: "#338833", label: "사용자 보정" },
};

function getAgentStyle(agentId) {
  if (!agentId) return { bg: "#f5f5f5", accent: "#999", label: agentId || "?" };
  const id = agentId.toLowerCase();
  if (id === "user" || id.includes("사용자")) return AGENT_COLORS.user;
  if (id.includes("design")) return AGENT_COLORS.designer;
  if (id.includes("engineer") || id.includes("tech")) return AGENT_COLORS.engineer;
  if (id.includes("strateg")) return AGENT_COLORS.strategist;
  if (id.includes("pm") || id.includes("product")) return AGENT_COLORS.pm;
  if (id.includes("data")) return AGENT_COLORS.data;
  if (id.includes("market")) return AGENT_COLORS.marketing;
  if (id.includes("veritas") || id.includes("fact")) return AGENT_COLORS.veritas;
  return { bg: "#f5f5f5", accent: "#666", label: agentId };
}

function StepBubble({ step }) {
  const style = getAgentStyle(step.id);
  const [expanded, setExpanded] = useState(false);
  const preview = step.result?.substring(0, 120) || "";
  const isLong = (step.result?.length || 0) > 120;

  return (
    <div style={{
      background: style.bg, border: `1px solid ${style.accent}20`,
      borderRadius: 12, padding: "12px 16px", marginBottom: 8,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span style={{
          fontSize: 10, fontWeight: 700, color: style.accent,
          background: `${style.accent}15`, padding: "2px 8px", borderRadius: 10,
        }}>{step.role || style.label}</span>
        <span style={{ fontSize: 10, color: "#999" }}>{step.id}</span>
      </div>
      <div style={{
        fontSize: 13, color: "#333", lineHeight: "20px",
        whiteSpace: "pre-wrap", wordBreak: "break-word",
      }}>
        {expanded || !isLong ? step.result : preview + "..."}
      </div>
      {isLong && (
        <button onClick={() => setExpanded(!expanded)} style={{
          marginTop: 6, background: "none", border: "none", cursor: "pointer",
          fontSize: 11, color: style.accent, padding: 0,
        }}>
          {expanded ? "접기" : "전문 보기"}
        </button>
      )}
    </div>
  );
}

function RoundCard({ round }) {
  const [open, setOpen] = useState(false);
  const stepCount = round.steps?.length || 0;

  return (
    <div style={{
      background: "#fff", border: "1px solid #e5e5e5", borderRadius: 12,
      marginBottom: 12, overflow: "hidden",
    }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", padding: "14px 16px", background: "transparent",
        border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, textAlign: "left",
      }}>
        <span style={{
          width: 28, height: 28, borderRadius: 14,
          background: "#FA0050", color: "#fff", fontSize: 12, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>R{round.round}</span>
        <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#333" }}>
          Round {round.round}
        </span>
        <span style={{ fontSize: 11, color: "#999" }}>{stepCount}명 발언</span>
        <span style={{ fontSize: 12, color: "#ccc", transition: "transform 0.2s", transform: open ? "rotate(90deg)" : "rotate(0deg)" }}>▸</span>
      </button>
      {open && (
        <div style={{ padding: "0 16px 16px" }}>
          {round.steps?.map((step, i) => <StepBubble key={i} step={step} />)}
        </div>
      )}
    </div>
  );
}

export default function CouncilSection() {
  const [council, setCouncil] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feed, setFeed] = useState([]);

  const loadCouncil = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`${API_BASE}/get-context`);
      const data = await resp.json();
      setCouncil(data.latest_full || null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const loadFeed = async () => {
    try {
      const resp = await fetch(`${API_BASE}/competitor-monitor?limit=10`);
      const data = await resp.json();
      setFeed(data.changes || []);
    } catch {}
  };

  useEffect(() => { loadCouncil(); loadFeed(); }, []);

  return (
    <div style={{ padding: "24px 32px", maxWidth: 700, fontFamily: "Pretendard, sans-serif" }}>
      {/* Council 토론 결과 */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>Council 토론 결과</h2>
          <button onClick={loadCouncil} style={{
            padding: "6px 14px", borderRadius: 20, border: "1px solid #e0e0e0",
            background: "#fff", cursor: "pointer", fontSize: 11, color: "#666",
          }}>새로고침</button>
        </div>

        {loading && <div style={{ color: "#999", fontSize: 13 }}>로딩 중...</div>}
        {error && <div style={{ color: "#FA0050", fontSize: 13 }}>에러: {error}</div>}

        {council && (
          <>
            {/* 요약 */}
            <div style={{
              background: "#f8f8ff", border: "1px solid #e0e0f0", borderRadius: 12,
              padding: 16, marginBottom: 16,
            }}>
              <div style={{ fontSize: 11, color: "#999", marginBottom: 4 }}>
                {council.id} · {council.rounds_count || council.rounds?.length || 0} 라운드
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#333", marginBottom: 8 }}>
                {council.topic}
              </div>
              {council.summary && (
                <div style={{ fontSize: 13, color: "#555", lineHeight: "20px", whiteSpace: "pre-wrap" }}>
                  {council.summary.substring(0, 500)}
                  {council.summary.length > 500 ? "..." : ""}
                </div>
              )}
            </div>

            {/* 라운드별 발언 */}
            {council.rounds?.map((round, i) => (
              <RoundCard key={i} round={round} />
            ))}
          </>
        )}

        {!loading && !council && (
          <div style={{ padding: 32, textAlign: "center", color: "#ccc", fontSize: 13 }}>
            Council 데이터가 없습니다
          </div>
        )}
      </div>

      {/* 경쟁사 모니터링 피드 */}
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1a", marginBottom: 16 }}>경쟁사 모니터링</h2>
        {feed.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", color: "#ccc", fontSize: 13 }}>
            아직 변경 피드가 없습니다
          </div>
        ) : (
          feed.map((item, i) => (
            <div key={item.id || i} style={{
              background: "#fff", border: "1px solid #e5e5e5", borderRadius: 10,
              padding: "12px 16px", marginBottom: 8,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                {item.tags?.map((tag, j) => (
                  <span key={j} style={{
                    fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 8,
                    background: tag === "baemin" ? "#E8F5E8" : tag === "coupangeats" ? "#E8F0FF" : "#f0f0f0",
                    color: tag === "baemin" ? "#168046" : tag === "coupangeats" ? "#0C74E4" : "#666",
                  }}>{tag}</span>
                ))}
                <span style={{ fontSize: 10, color: "#999" }}>{new Date(item.date).toLocaleDateString("ko-KR")}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>{item.title}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
