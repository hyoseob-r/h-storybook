import { useState } from "react";
import { metaTokens } from "../tokens";
import { YdsIcon } from "../icons.jsx";
import { SearchBar } from "./SearchBar.jsx";

// ─── YDS 2.0 TopBanner (top_final) ─────────────────────────────────────────
// Figma node 13767:322397 — top_final
// 헤더 3단계: top=true / scrolled=false / scrolled=true
// 배경 + safety area + contents_area + 검색바

const STATUS_BAR_H = 59;
const TOP_NAV_H = 56;
const SAFETY_TOP = STATUS_BAR_H + TOP_NAV_H; // 115
const CONTENTS_H = 100;
const SAFETY_BOTTOM = 32;

const SHADOW_LEVEL1_V2 = "0px 0px 2px rgba(25,48,64,0.08), 0px 1px 8px rgba(25,48,64,0.1)";

// ── StatusBar ───────────────────────────────────────────────────────────────
export function StatusBar({ theme = "dark" }) {
  const color = theme === "dark" ? "#fff" : "#333";
  return (
    <div style={{
      height: STATUS_BAR_H, padding: "14px 24px 0",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      fontFamily: "Pretendard, -apple-system, sans-serif",
    }}>
      <span style={{ fontSize: 15, fontWeight: 600, color, letterSpacing: -0.2 }}>9:41</span>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
          <rect x="0" y="3" width="3" height="9" rx="1" fill={color} opacity="0.3" />
          <rect x="4" y="2" width="3" height="10" rx="1" fill={color} opacity="0.5" />
          <rect x="8" y="1" width="3" height="11" rx="1" fill={color} opacity="0.7" />
          <rect x="12" y="0" width="3" height="12" rx="1" fill={color} />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M1.6 4.8C3.4 2.4 6 1 8 1s4.6 1.4 6.4 3.8" stroke={color} strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.5"/>
          <path d="M3.6 7.2C4.8 5.6 6.4 4.6 8 4.6s3.2 1 4.4 2.6" stroke={color} strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.7"/>
          <circle cx="8" cy="10" r="1.5" fill={color} />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="2" stroke={color} strokeWidth="1" fill="none" opacity="0.4"/>
          <rect x="2" y="2" width="16" height="8" rx="1" fill={color} />
          <rect x="23" y="3.5" width="2" height="5" rx="1" fill={color} opacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}

// ── NotiBadge ────────────────────────────────────────────────────────────────
function NotiBadge() {
  return (
    <div style={{
      position: "absolute", top: -4, right: -4,
      width: 18, height: 18, borderRadius: 9,
      background: "#fff", border: "1px solid #e5e5e5",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <span style={{
        fontSize: 10, fontWeight: 700, color: "#ff3072",
        lineHeight: "14px", fontFamily: "Pretendard, sans-serif",
      }}>1</span>
    </div>
  );
}

// ── FloatingButton (원형 36x36 그림자 있음) ──────────────────────────────────
function FloatingButton({ theme, icon, size = 20, cartfilled = false, onClick }) {
  const isDark = theme === "dark";
  const isCartFilled = icon === "cart" && cartfilled;
  const bg = isCartFilled
    ? "#FA0050"
    : isDark ? "rgba(0,0,0,0.9)" : "rgba(255,255,255,0.96)";
  const iconColor = isCartFilled ? "#fff" : (isDark ? "#fff" : "#333");

  return (
    <div style={{
      position: "relative",
      width: 36, height: 36, borderRadius: 40,
      background: bg,
      boxShadow: SHADOW_LEVEL1_V2,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
      cursor: "pointer",
    }}>
      <YdsIcon name={icon} size={size} color={iconColor} />
      {isCartFilled && <NotiBadge />}
    </div>
  );
}

// ── FlatButton (원형 36x36 그림자 없음 — scrolled=true) ──────────────────────
function FlatButton({ icon, size = 20, cartfilled = false }) {
  const isCartFilled = icon === "cart" && cartfilled;
  const bg = isCartFilled ? "#FA0050" : "transparent";
  const iconColor = isCartFilled ? "#fff" : "#333";

  return (
    <div style={{
      position: "relative",
      width: 36, height: 36, borderRadius: 40,
      background: bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
      cursor: "pointer",
    }}>
      <YdsIcon name={icon} size={size} color={iconColor} />
      {isCartFilled && <NotiBadge />}
    </div>
  );
}

// ── PillAddress (pill 형태 주소 버튼) ────────────────────────────────────────
function PillAddress({ theme, address }) {
  const isDark = theme === "dark";
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 2,
      background: isDark ? "rgba(0,0,0,0.9)" : "rgba(255,255,255,0.96)",
      borderRadius: 360, padding: "0 12px",
      height: 36,
      boxShadow: SHADOW_LEVEL1_V2,
      cursor: "pointer",
    }}>
      <span style={{
        fontSize: 16, fontWeight: 700, color: isDark ? "#fff" : "#333",
        lineHeight: "22px", fontFamily: "Pretendard, sans-serif",
        whiteSpace: "nowrap",
      }}>{address}</span>
      <YdsIcon name="chevron_down_s" size={20} color={isDark ? "#fff" : "#333"} />
    </div>
  );
}

// ── TopNavHeader (3가지 상태) ────────────────────────────────────────────────
export function TopNavHeader({ theme = "dark", top = true, scrolled = false, cartfilled = false, address = "서울 강남구 역삼동" }) {
  const isDark = theme === "dark";

  // 배경 — 그라디언트 스크림은 부모(GlobalHome)에서 처리
  const background = "transparent";

  const px = (!top && scrolled) ? 8 : 16;

  return (
    <div style={{
      height: TOP_NAV_H, padding: `12px ${px}px`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 8,
      background,
    }}>
      {/* 좌: 주소 */}
      {(top || !scrolled) ? (
        <PillAddress theme={top ? theme : "light"} address={address} />
      ) : (
        /* scrolled=true: 텍스트 주소 (pill 아님) */
        <div style={{
          display: "flex", alignItems: "center", gap: 2,
          padding: "6px 8px",
          borderRadius: 360,
          cursor: "pointer",
        }}>
          <span style={{
            fontSize: 16, fontWeight: 700, color: "#333",
            lineHeight: "22px", fontFamily: "Pretendard, sans-serif",
            whiteSpace: "nowrap",
          }}>{address}</span>
          <YdsIcon name="chevron_down_s" size={20} color="#333" />
        </div>
      )}

      {/* 우: 버튼들 */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
        {/* 검색: top=false에서만 */}
        {!top && (
          scrolled
            ? <FlatButton icon="search" cartfilled={false} />
            : <FloatingButton theme="light" icon="search" cartfilled={false} />
        )}

        {/* 장바구니 */}
        {top ? (
          <FloatingButton theme={theme} icon="cart" cartfilled={cartfilled} />
        ) : scrolled ? (
          <FlatButton icon="cart" cartfilled={cartfilled} />
        ) : (
          <FloatingButton theme="light" icon="cart" cartfilled={cartfilled} />
        )}

        {/* 햄버거 */}
        {top ? (
          <FloatingButton theme={theme} icon="hamburger" cartfilled={false} />
        ) : scrolled ? (
          <FlatButton icon="hamburger" cartfilled={false} />
        ) : (
          <FloatingButton theme="light" icon="hamburger" cartfilled={false} />
        )}
      </div>
    </div>
  );
}

// ── ContentsArea ─────────────────────────────────────────────────────────────
function ContentsArea({ leftSrc = null, rightSrc = null }) {
  return (
    <div style={{
      height: CONTENTS_H,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Left — 좌측 여백 20px, 좌측 정렬 */}
      {leftSrc && (
        <img src={leftSrc} alt="" style={{
          position: "absolute", left: 20, top: 0,
          height: "100%", objectFit: "contain", objectPosition: "left center",
          zIndex: 1,
        }} />
      )}
      {!leftSrc && (
        <div style={{ position: "absolute", left: 20, top: 0, width: 180, height: "100%", borderRadius: 8, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>Left</span>
        </div>
      )}

      {/* Right — 우측 여백 20px, 우측 정렬, Left와 겹침 가능 */}
      {rightSrc && (
        <img src={rightSrc} alt="" style={{
          position: "absolute", right: 20, top: 0,
          height: "100%", objectFit: "contain", objectPosition: "right center",
        }} />
      )}
      {!rightSrc && (
        <div style={{ position: "absolute", right: 20, top: 0, width: 135, height: "100%", borderRadius: 8, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>Right</span>
        </div>
      )}
    </div>
  );
}

// ── SearchBarContainer (흰 배경 라운드 영역 + search_bar_ranking) ────────────
function SearchBarContainer() {
  return (
    <div style={{
      width: "100%",
      background: "#f8f8f8",
      borderRadius: "32px 32px 0 0",
      padding: "16px 16px 8px",
    }}>
      <SearchBar
        rank={1}
        keyword="파리바게뜨"
        trend="up"
        bonusText="5,000원 할인"
      />
    </div>
  );
}

// ── TopBanner (export) ──────────────────────────────────────────────────────
export function TopBanner({
  bgColor = "#1a1a2e",
  bgImage = null,
  theme = "dark",
  leftSrc = null,
  rightSrc = null,
  address = "서울 강남구 역삼동",
  showSearch = true,
  showHeader = true,
  // 헤더 상태
  headerState = "top", // "top" | "scrolled-false" | "scrolled-true"
  cartfilled = false,
}) {
  const isTop = headerState === "top";
  const isScrolledFalse = headerState === "scrolled-false";
  const isScrolledTrue = headerState === "scrolled-true";

  return (
    <div style={{
      width: "100%", position: "relative",
      background: bgColor,
      fontFamily: "Pretendard, Roboto, sans-serif",
      overflow: "hidden",
    }}>
      {/* 배경 이미지 — 가로 100% 리사이징, 바텀 정렬, 넘치면 상단 크롭 */}
      {bgImage && (
        <img src={bgImage} alt="" style={{
          position: "absolute", bottom: 0, left: 0,
          width: "100%", height: "auto",
          pointerEvents: "none",
        }} />
      )}

      <div style={{ position: "relative", zIndex: 1 }}>
        {showHeader ? (
          <>
            <StatusBar theme={isTop ? theme : "light"} />
            <TopNavHeader
              theme={theme}
              top={isTop}
              scrolled={isScrolledTrue}
              cartfilled={cartfilled}
              address={address}
            />
          </>
        ) : (
          <div style={{ height: 115 }} />
        )}
        <ContentsArea leftSrc={leftSrc} rightSrc={rightSrc} />
        {showSearch && <SearchBarContainer />}
      </div>
    </div>
  );
}

// ── Section (Storybook Controls) ────────────────────────────────────────────
const controlStyle = {
  padding: "16px 20px", background: "#fff", borderRadius: 12,
  border: "1px solid #e8e8e8", marginBottom: 16,
};

export default function TopBannerSection({ previewWidth }) {
  const [theme, setTheme] = useState("dark");
  const [headerState, setHeaderState] = useState("top");
  const [cartfilled, setCartfilled] = useState(false);

  const chipStyle = (active) => ({
    padding: "4px 12px", borderRadius: 20,
    border: `1.5px solid ${active ? "#0C74E4" : "#e0e0e0"}`,
    background: active ? "#0C74E4" : "#fff",
    color: active ? "#fff" : "#666",
    fontSize: 10, cursor: "pointer",
  });

  // dark theme에서는 headerState가 항상 top
  const effectiveState = theme === "dark" ? "top" : headerState;

  return (
    <div style={{ padding: "24px 0" }}>
      {/* Controls */}
      <div style={controlStyle}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#333", marginBottom: 10 }}>Options</div>

        {/* Theme */}
        <div style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 10, color: "#999", width: 80, flexShrink: 0 }}>Theme</span>
          <button onClick={() => setTheme("dark")} style={chipStyle(theme === "dark")}>Dark</button>
          <button onClick={() => setTheme("light")} style={chipStyle(theme === "light")}>Light</button>
        </div>

        {/* State */}
        <div style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 10, color: "#999", width: 80, flexShrink: 0 }}>State</span>
          <button onClick={() => setHeaderState("top")} style={chipStyle(effectiveState === "top")}>top</button>
          <button
            onClick={() => { if (theme === "light") setHeaderState("scrolled-false"); }}
            style={{
              ...chipStyle(effectiveState === "scrolled-false"),
              opacity: theme === "dark" ? 0.4 : 1,
              cursor: theme === "dark" ? "not-allowed" : "pointer",
            }}
          >scrolled-false</button>
          <button
            onClick={() => { if (theme === "light") setHeaderState("scrolled-true"); }}
            style={{
              ...chipStyle(effectiveState === "scrolled-true"),
              opacity: theme === "dark" ? 0.4 : 1,
              cursor: theme === "dark" ? "not-allowed" : "pointer",
            }}
          >scrolled-true</button>
        </div>

        {/* CartFilled */}
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span style={{ fontSize: 10, color: "#999", width: 80, flexShrink: 0 }}>CartFilled</span>
          <button onClick={() => setCartfilled(false)} style={chipStyle(!cartfilled)}>Off</button>
          <button onClick={() => setCartfilled(true)} style={chipStyle(cartfilled)}>On</button>
        </div>
      </div>

      {/* Preview */}
      <div style={{ fontSize: 11, fontWeight: 700, color: "#999", marginBottom: 8 }}>Preview</div>

      <div style={{ width: previewWidth > 0 ? previewWidth : "100%", margin: previewWidth > 0 ? "0 auto" : 0 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: "#999", marginBottom: 6 }}>
          top_final — {theme} / {effectiveState} / cart={cartfilled ? "filled" : "empty"}
        </div>
        <div style={{ width: "100%" }}>
          <TopBanner
            theme={theme}
            bgColor={theme === "dark" ? "#1a1a2e" : "#E8F0FF"}
            bgImage="/assets/banners/topbanner_bg.png"
            leftSrc="/assets/banners/topbanner_left.png"
            rightSrc="/assets/banners/topbanner_right.png"
            headerState={effectiveState}
            cartfilled={cartfilled}
          />
        </div>
      </div>
      </div>
    </div>
  );
}
