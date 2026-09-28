import { useState } from "react";

const ASSET_CATEGORIES = [
  {
    id: "shop-logo",
    label: "가게 대표 썸네일 로고",
    desc: "ShopListCard, SwimlaneCard 등에 사용되는 일반 가게 로고",
    status: "ready", // ready | empty | partial
    items: [],
  },
  {
    id: "tab-logo",
    label: "2depth 탭 버튼 로고",
    desc: "카테고리 탭, 가상카테고리 대표이미지",
    status: "empty",
    items: [],
  },
  {
    id: "bottomsheet-logo",
    label: "바텀시트 썸네일 로고",
    desc: "더보기 바텀시트에 표시되는 썸네일",
    status: "empty",
    items: [],
  },
  {
    id: "food-category",
    label: "푸드 카테고리 로고",
    desc: "글로벌홈 카테고리 아이콘 (치킨, 피자, 한식 등)",
    status: "partial",
    items: [],
  },
  {
    id: "quickcommerce",
    label: "퀵커머스 로고",
    desc: "편의점/그로써리 매장 로고 — 별도 제작 필요",
    status: "empty",
    items: [],
  },
  {
    id: "promo-graphic",
    label: "프로모션 그래픽",
    desc: "BrandnewBanner, 이벤트 배너용 그래픽 에셋",
    status: "empty",
    items: [],
  },
];

const STATUS_BADGE = {
  ready:   { label: "준비됨", bg: "#e8f5e8", color: "#338833", border: "#88cc88" },
  partial: { label: "일부",   bg: "#fff8e0", color: "#aa7700", border: "#eebb44" },
  empty:   { label: "미등록", bg: "#f5f5f5", color: "#999999", border: "#dddddd" },
};

export default function AssetsSection() {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ padding: "24px 32px", maxWidth: 900 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>Assets</h2>
      <p style={{ fontSize: 13, color: "#888", marginBottom: 24, lineHeight: 1.6 }}>
        컴포넌트에 사용되는 이미지 에셋 관리. 로고/사진/그래픽을 등록하면 컴포넌트가 실제 에셋으로 렌더링됩니다.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {ASSET_CATEGORIES.map(cat => {
          const badge = STATUS_BADGE[cat.status];
          const isOpen = selected === cat.id;
          return (
            <div key={cat.id} style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: 12, overflow: "hidden" }}>
              {/* Header */}
              <button
                onClick={() => setSelected(isOpen ? null : cat.id)}
                style={{ width: "100%", padding: "16px 20px", background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}
              >
                <span style={{ fontSize: 14, fontWeight: 600, color: "#111", flex: 1 }}>{cat.label}</span>
                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`, fontWeight: 600 }}>
                  {badge.label}
                </span>
                <span style={{ fontSize: 11, color: "#bbb" }}>
                  {cat.items.length > 0 ? `${cat.items.length}개` : ""}
                </span>
                <span style={{ fontSize: 12, color: "#ccc", transition: "transform 0.2s", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>▸</span>
              </button>

              {/* Content */}
              {isOpen && (
                <div style={{ padding: "0 20px 20px", borderTop: "1px solid #f0f0f0" }}>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 12, marginBottom: 16, lineHeight: 1.6 }}>{cat.desc}</div>

                  {cat.items.length === 0 ? (
                    <div style={{ padding: "32px 0", textAlign: "center", color: "#ccc" }}>
                      <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.4 }}>🖼</div>
                      <div style={{ fontSize: 12 }}>등록된 에셋 없음</div>
                      <div style={{ fontSize: 11, color: "#ddd", marginTop: 4 }}>이미지 URL 또는 파일을 등록해주세요</div>
                    </div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: 8 }}>
                      {cat.items.map((item, i) => (
                        <div key={i} style={{ aspectRatio: "1", borderRadius: 8, overflow: "hidden", border: "1px solid #e5e5e5", background: "#f5f5f5" }}>
                          <img src={item.url} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 요약 */}
      <div style={{ marginTop: 24, padding: 16, background: "#f8f8f8", borderRadius: 10, fontSize: 11, color: "#999", lineHeight: 1.8 }}>
        <strong style={{ color: "#555" }}>에셋 현황</strong><br/>
        아이콘: ✅ 122개 (icons.jsx) · 디자인 토큰: ✅ 완비 (tokens.js)<br/>
        가게 로고: ⏳ 등록 대기 · 탭 로고: 미등록 · 바텀시트 로고: 미등록<br/>
        푸드 카테고리: 일부 있음 · 퀵커머스: 별도 제작 · 프로모션: 미등록
      </div>
    </div>
  );
}
