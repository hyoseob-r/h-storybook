import { useState } from "react";
import { metaTokens } from "../tokens";
import { BenefitBadge } from "./Badge.jsx";

// ─── YDS 2.0 VerticalLauncher (리뉴얼-2026) ────────────────────────────────
// Figma: 리뉴얼-2026 > vertical_launcher (node 4917:373717)
// pill 형태 버튼 — 44px 이미지 + 14b 라벨, shadow level_1, rounded 16
// 뱃지 지원 (할인 정보)

const SHADOW = "0px 0px 2px rgba(25,48,64,0.08), 0px 1px 8px rgba(25,48,64,0.1)";
const ASSET_PATH = "/assets/vertical-launcher/";

const LAUNCHER_PRESETS = [
  { id: "yogiplus",  img: "VerticalLauncher_44x44_요기더적립.png",  label: "요기더+적립" },
  { id: "takeout",   img: "VerticalLauncher_44x44_포장주문.png",    label: "포장" },
  { id: "gift",      img: "VerticalLauncher_44x44_선물하기.png",    label: "선물하기" },
  { id: "rank",      img: "VerticalLauncher_44x44_할인랭킹.png",    label: "할인랭킹" },
  { id: "robot",     img: "VerticalLauncher_44x44_로봇배달.png",    label: "로봇배달" },
  { id: "subsidy",   img: "VerticalLauncher_44x44_지원금.png",      label: "고유가지원금" },
  { id: "landers",   img: "VerticalLauncher_44x44_랜더스.png",      label: "랜더스" },
  { id: "kiwoom",    img: "VerticalLauncher_44x44_키움.png",        label: "키움" },
];

export function VLauncherItem({
  img = null,
  label = "포장",
  badge = null,
  onClick,
}) {
  return (
    <div style={{ position: "relative", height: 44, flexShrink: 0 }}>
      <button onClick={onClick} style={{
        display: "flex", alignItems: "center",
        height: 44, background: "#fff", border: "none",
        borderRadius: 16, boxShadow: SHADOW, overflow: "hidden",
        cursor: "pointer", paddingRight: 12,
        fontFamily: "Pretendard, Roboto, sans-serif",
      }}>
        <div style={{
          width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, overflow: "hidden",
        }}>
          {img ? (
            <img src={ASSET_PATH + img} alt={label} style={{ width: 44, height: 44, objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: 14, color: "#ccc" }}>?</span>
          )}
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#333", whiteSpace: "nowrap" }}>
          {label}
        </span>
      </button>
      {badge && (
        <div style={{ position: "absolute", top: -7, left: 0 }}>
          <BenefitBadge label={badge} />
        </div>
      )}
    </div>
  );
}

export function VerticalLauncherRow({ items = LAUNCHER_PRESETS }) {
  return (
    <div style={{
      display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none",
      padding: "8px 16px 16px",
    }}>
      {items.map((item, i) => (
        <VLauncherItem key={item.id || i} img={item.img} label={item.label} badge={item.badge} />
      ))}
    </div>
  );
}

// ── Section (Storybook) ─────────────────────────────────────────────────────
export default function VerticalLauncherSection({ previewWidth }) {
  const pw = previewWidth > 0 ? previewWidth : "100%";
  const pm = previewWidth > 0 ? "0 auto" : 0;

  return (
    <div style={{ padding: "24px 0" }}>
      <div style={{ width: pw, margin: pm }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 12 }}>VerticalLauncher Row</div>
        <div style={{ width: "100%", background: "transparent" }}>
          <VerticalLauncherRow items={[
            { id: "yogiplus", img: "VerticalLauncher_44x44_요기더적립.png", label: "요기더+적립" },
            { id: "takeout", img: "VerticalLauncher_44x44_포장주문.png", label: "포장", badge: "7% 할인" },
            { id: "gift", img: "VerticalLauncher_44x44_선물하기.png", label: "선물하기" },
            { id: "rank", img: "VerticalLauncher_44x44_할인랭킹.png", label: "할인랭킹" },
            { id: "robot", img: "VerticalLauncher_44x44_로봇배달.png", label: "로봇배달" },
            { id: "subsidy", img: "VerticalLauncher_44x44_지원금.png", label: "고유가지원금" },
            { id: "landers", img: "VerticalLauncher_44x44_랜더스.png", label: "랜더스" },
            { id: "kiwoom", img: "VerticalLauncher_44x44_키움.png", label: "키움" },
          ]} />
        </div>
      </div>

      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 12 }}>Individual Items</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: "8px 0" }}>
          {LAUNCHER_PRESETS.map(p => (
            <VLauncherItem key={p.id} img={p.img} label={p.label} />
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
