import React, { useState, useRef, useEffect } from "react";
import { fetchComponents } from "./supabase.js";
import { ToastProvider } from "./shared/ui.jsx";

// ── Section imports ──────────────────────────────────────────────────────────
import FigmaCodeGenSection from "./components/FigmaCodeGen.jsx";
import FigmaLiveSection from "./sections/FigmaLive.jsx";
import { MetaTokensSection, ColorsSection, TypographySection, SpacingSection, ElevationSection } from "./sections/TokenSections.jsx";
import ButtonSection from "./sections/ButtonSection.jsx";
import IconsSection from "./sections/IconsSection.jsx";
import SimulatorSection from "./sections/Simulator.jsx";
import GlassNavSection from "./sections/GlassNav.jsx";
import DraftsSection from "./sections/DraftsSection.jsx";
import FigmaSection from "./sections/FigmaSection.jsx";
import AssetsSection from "./sections/AssetsSection.jsx";
import CouncilSection from "./sections/CouncilSection.jsx";
import GlobalHomeSection from "./sections/GlobalHomeSection.jsx";

// ── Component imports ────────────────────────────────────────────────────────
import BadgeSection from "./components/Badge.jsx";
import RatingSection from "./components/Rating.jsx";
import NumericStepperSection from "./components/NumericStepper.jsx";
import BottomNavSection from "./components/BottomNav.jsx";
import StickyCTASection from "./components/StickyCTA.jsx";
import ShopListCardSection from "./components/ShopListCard.jsx";
import SwimlaneCardSection from "./components/SwimlaneCard.jsx";
import ShortcutCardSection from "./components/ShortcutCard.jsx";
import VerticalLauncherSection from "./components/VerticalLauncher.jsx";
import FoodCategorySection from "./components/FoodCategory.jsx";
import BrandnewBannerSection from "./components/BrandnewBanner.jsx";
import DiscountBrandSwimlaneSection from "./components/DiscountBrandSwimlane.jsx";
import TopBannerSection from "./components/TopBanner.jsx";

// ── Navigation ───────────────────────────────────────────────────────────────

const NAV_SECTIONS = [
  { label: "Figma", items: [
    { id: "figma-code", label: "Figma → Code", icon: "⚡" },
    { id: "figma-live", label: "Figma Live", icon: "▶" },
  ]},
  { label: "Tokens", items: [
    { id: "meta",       label: "Meta Tokens", icon: "◉" },
    { id: "colors",     label: "Colors",      icon: "◈" },
    { id: "typography", label: "Typography",  icon: "T" },
    { id: "spacing",    label: "Spacing",     icon: "↔" },
    { id: "elevation",  label: "Elevation",   icon: "◻" },
    { id: "icons",      label: "Icons",       icon: "◎" },
  ]},
  { label: "Components", items: [
    { id: "button",    label: "Button",         icon: "⬚" },
    { id: "badge",     label: "Badge",          icon: "⊡" },
    { id: "rating",    label: "Rating",         icon: "★" },
    { id: "stepper",   label: "NumericStepper", icon: "±" },
    { id: "stickycta", label: "StickyCTA",      icon: "▤" },
    { id: "bottomnav", label: "BottomNav",      icon: "▣" },
    { id: "glassnav",  label: "Liquid Glass",   icon: "✦" },
    { id: "shoplist",  label: "ShopList Card",   icon: "☰" },
    { id: "swimlane",  label: "Swimlane Card",   icon: "◫" },
    { id: "shortcut",  label: "Shortcut Card",   icon: "⊞" },
    { id: "vlauncher", label: "Vertical Launcher", icon: "⊟" },
    { id: "foodcat",   label: "Food Category",  icon: "🍽" },
    { id: "brandnew",  label: "BrandnewBanner",  icon: "⬡" },
    { id: "discountbrand", label: "할인브랜드",   icon: "◎" },
    { id: "topbanner",  label: "TopBanner",    icon: "▬" },
  ]},
  { label: "Assets", items: [
    { id: "assets",    label: "Assets",    icon: "🖼" },
  ]},
  { label: "Screens", items: [
    { id: "globalhome", label: "Global Home", icon: "📱" },
  ]},
  { label: "Intelligence", items: [
    { id: "council",   label: "Council",   icon: "⚡" },
  ]},
  { label: "Tools", items: [
    { id: "simulator", label: "Simulator", icon: "📱" },
    { id: "drafts",    label: "Drafts",    icon: "◈" },
    { id: "figma",     label: "Category",  icon: "✦" },
  ]},
];

const titles = { assets: "Assets", "figma-code": "Figma → Code", "figma-live": "Figma Live", meta: "Meta Tokens", colors: "Color Tokens", typography: "Typography", spacing: "Spacing & Radius", elevation: "Elevation / Shadow", button: "Button", badge: "Badge", rating: "Rating", stepper: "NumericStepper", icons: "Icons", simulator: "Simulator", glassnav: "Liquid Glass Nav", shoplist: "ShopList Card", swimlane: "Swimlane Card", shortcut: "Shortcut Card", brandnew: "BrandnewBanner", discountbrand: "할인 브랜드 스윔레인", topbanner: "TopBanner", vlauncher: "Vertical Launcher", foodcat: "Food Category", globalhome: "Global Home", council: "Council & Monitor", drafts: "Drafts", figma: "Category" };
const subtitles = { assets: "컴포넌트용 이미지 에셋 — 로고/사진/그래픽 관리", "figma-code": "Figma URL → YDS 2.0 React 컴포넌트 자동 생성", "figma-live": "alfred-agent 생성 컴포넌트 — Supabase 실시간 렌더링", meta: "YDS 2.0 Primitive Layer — Meta → Semantic → Component", colors: "YDS 2.0 Customer Token", typography: "Roboto 기반 타입 스케일", spacing: "스페이싱 및 보더 라디우스", elevation: "YDS 2.0 Elevation — Level 1 · 2 (normal & inverse)", button: "버튼 컴포넌트 — 멀티 플랫폼 코드", badge: "배지 컴포넌트 — single/group/offers/noti/logo/icon", rating: "별점 컴포넌트 — compact (starIcon + grade + total)", stepper: "수량 조절 — compact/default, elevated/outlined", stickycta: "하단 고정 CTA — PriceButton + NumericStepper", bottomnav: "하단 네비게이션 — pill glass nav + floating bars", icons: "YDS 2.0 System Icon — Figma 원본 기반", simulator: "iOS / Android 실시간 화면 시뮬레이션", glassnav: "OS 버전별 Glass Nav Bar — 호환성 + 코드 생성", shoplist: "가게 리스트 카드 — 로고 + 정보 + 혜택 배지", swimlane: "가로 스크롤 카드 — 썸네일 + 가게 정보", shortcut: "홈 상단 숏컷 — 아이콘 + 라벨 빠른 진입점", brandnew: "프로모션 배너 — 선착순 특가 / 멤버십 / 무한적립", discountbrand: "내 주변 할인중인 브랜드 — 3페이지 × 3아이템 스윔레인", topbanner: "글로벌홈 탑배너 — 배경+스테이터스바+탑네비+컨텐츠+검색", vlauncher: "버티컬 런처 — pill 버튼 가로 스윔레인 (요기더+적립, 포장, 선물하기...)", foodcat: "푸드 카테고리 — 2행 그리드 + 세로배너, 가로 스크롤", globalhome: "글로벌홈 전체 화면 시뮬레이터 — 390x844 폰 프레임", council: "Council 토론 결과 + 경쟁사 모니터링 피드", drafts: "Figma에서 가져온 컴포넌트 — 관리 및 시뮬레이터 연동", figma: "Figma에서 추출한 카테고리 컴포넌트 — 리뉴얼-2026" };

// ── H World App Menu ─────────────────────────────────────────────────────────

const H_WORLD_APPS = [
  { id: "launcher",  label: "h's world",      sub: "Launcher",          href: "https://alfred-launcher.vercel.app",     color: "#111111" },
  { id: "alfred",    label: "Alfred Agent",    sub: "Problem to Product", href: "https://alfred-agent-nine.vercel.app",   color: "#2255cc" },
  { id: "storybook", label: "h's Storybook",   sub: "Design System",     href: "https://storybook-livid-chi.vercel.app", color: "#5028c8" },
  { id: "lottie",    label: "Lottie Studio",   sub: "Animation",         href: "https://lottie-studio.vercel.app",       color: "#cc7700" },
];

function AppMenu({ current }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);
  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width: "24px", height: "24px", borderRadius: "7px", background: open ? "#f0f0f0" : "transparent", border: "1px solid " + (open ? "#cccccc" : "#e5e5e5"), color: open ? "#555555" : "#aaaaaa", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "#cccccc"; e.currentTarget.style.color = "#555555"; }}
        onMouseLeave={e => { if (!open) { e.currentTarget.style.borderColor = "#e5e5e5"; e.currentTarget.style.color = "#aaaaaa"; } }}>
        <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor">
          <rect x="0" y="0" width="5" height="5" rx="1" /><rect x="7" y="0" width="5" height="5" rx="1" />
          <rect x="0" y="7" width="5" height="5" rx="1" /><rect x="7" y="7" width="5" height="5" rx="1" />
        </svg>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, background: "#ffffff", border: "1px solid #e5e5e5", borderRadius: "12px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", padding: "6px", minWidth: "210px", zIndex: 1000 }}>
          {H_WORLD_APPS.map(app => {
            const isCurrent = app.id === current;
            return isCurrent ? (
              <div key={app.id} style={{ padding: "8px 10px", borderRadius: "8px", background: "#f5f5f5", marginBottom: "2px" }}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: app.color, opacity: 0.5 }}>{app.label}</div>
                <div style={{ fontSize: "10px", color: "#bbbbbb" }}>{app.sub} · 현재</div>
              </div>
            ) : (
              <a key={app.id} href={app.href} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}
                style={{ display: "block", padding: "8px 10px", borderRadius: "8px", textDecoration: "none", marginBottom: "2px", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: app.color }}>{app.label}</div>
                <div style={{ fontSize: "10px", color: "#aaaaaa" }}>{app.sub} ↗</div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [active, setActive] = useState("colors");
  const [pendingDraft, setPendingDraft] = useState(null);
  const [componentCount, setComponentCount] = useState(0);

  useEffect(() => {
    fetchComponents()
      .then(rows => setComponentCount(rows.length))
      .catch(() => {});
  }, [active]);

  const renderContent = () => {
    if (active === "figma-code") return <FigmaCodeGenSection />;
    if (active === "figma-live") return <FigmaLiveSection />;
    if (active === "meta")       return <MetaTokensSection />;
    if (active === "colors")     return <ColorsSection />;
    if (active === "typography") return <TypographySection />;
    if (active === "spacing")    return <SpacingSection />;
    if (active === "elevation")  return <ElevationSection />;
    if (active === "button")     return <ButtonSection />;
    if (active === "icons")      return <IconsSection />;
    if (active === "simulator")  return <SimulatorSection pendingDraft={pendingDraft} onDraftConsumed={() => setPendingDraft(null)} />;
    if (active === "glassnav")   return <GlassNavSection />;
    if (active === "badge")      return <BadgeSection />;
    if (active === "rating")     return <RatingSection />;
    if (active === "stepper")    return <NumericStepperSection />;
    if (active === "bottomnav")  return <BottomNavSection />;
    if (active === "stickycta")  return <StickyCTASection />;
    if (active === "shoplist")   return <ShopListCardSection />;
    if (active === "swimlane")   return <SwimlaneCardSection />;
    if (active === "shortcut")   return <ShortcutCardSection />;
    if (active === "brandnew")   return <BrandnewBannerSection />;
    if (active === "discountbrand") return <DiscountBrandSwimlaneSection />;
    if (active === "assets")     return <AssetsSection />;
    if (active === "council")    return <CouncilSection />;
    if (active === "topbanner")  return <TopBannerSection />;
    if (active === "vlauncher")  return <VerticalLauncherSection />;
    if (active === "foodcat")    return <FoodCategorySection />;
    if (active === "globalhome") return <GlobalHomeSection />;
    if (active === "drafts")     return <DraftsSection onUseInSimulator={draft => { setPendingDraft(draft); setActive("simulator"); }} />;
    if (active === "figma")      return <FigmaSection />;
  };

  return (
    <ToastProvider>
    <div style={{ display: "flex", height: "100vh", background: "#f5f5f5", color: "#111111", fontFamily: "'Pretendard', -apple-system, sans-serif" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes toastIn { from { opacity:0; transform:translateY(10px) scale(0.95); } to { opacity:1; transform:translateY(0) scale(1); } }`}</style>
      {/* Sidebar */}
      <div style={{ width: "200px", flexShrink: 0, background: "#ffffff", borderRight: "1px solid #e5e5e5", display: "flex", flexDirection: "column", padding: "20px 0" }}>
        <div style={{ padding: "0 16px 20px", borderBottom: "1px solid #e5e5e5", marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "3px" }}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#111111", letterSpacing: "-0.01em" }}>h's Storybook</div>
            <AppMenu current="storybook" />
          </div>
          <div style={{ fontSize: "10px", color: "#aaaaaa" }}>YDS 2.0 Design System</div>
        </div>
        {NAV_SECTIONS.map((sec, si) => (
          <div key={sec.label}>
            <div style={{ fontSize: "9px", color: "#bbbbbb", letterSpacing: "0.15em", textTransform: "uppercase", padding: si === 0 ? "0 16px 6px" : "16px 16px 6px", fontWeight: 600 }}>{sec.label}</div>
            {sec.items.map(n => {
              const isFigma = sec.label === "Figma";
              const on = active === n.id;
              return (
                <button key={n.id} onClick={() => setActive(n.id)}
                  style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 16px", background: on ? (isFigma ? "#fef3f8" : "#e5e5e5") : "transparent", border: "none", borderLeft: on ? `2px solid ${isFigma ? "#FA0050" : "#111"}` : "2px solid transparent", color: on ? (isFigma ? "#FA0050" : "#111") : "#888", fontSize: "12px", fontWeight: on && isFigma ? 700 : 400, cursor: "pointer", textAlign: "left", transition: "all 0.15s", width: "100%" }}>
                  <span style={{ fontSize: "13px", opacity: 0.7 }}>{n.icon}</span>{n.label}
                  {n.id === "drafts" && componentCount > 0 && (
                    <span style={{ marginLeft:"auto", fontSize:"9px", background:"#5028c8", color:"#fff", borderRadius:"10px", padding:"1px 6px" }}>{componentCount}</span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ padding: "12px 16px", borderTop: "1px solid #e5e5e5", fontSize: "9px", color: "#d0d0d0" }}>
          Figma → YDS 2.0 ✓
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "16px 28px", borderBottom: "1px solid #e5e5e5", background: "#ffffff", flexShrink: 0 }}>
          <div style={{ fontSize: "18px", fontWeight: 700, color: "#111111" }}>{titles[active]}</div>
          <div style={{ fontSize: "11px", color: "#aaaaaa", marginTop: "3px" }}>{subtitles[active]}</div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "28px", scrollbarWidth: "thin", scrollbarColor: "#e5e5e5 transparent" }}>
          {renderContent()}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e5e5e5; border-radius: 2px; }
      `}</style>
    </div>
    </ToastProvider>
  );
}
