import { useRef } from "react";
import { YdsIcon } from "../icons.jsx";
import { SectionHeader } from "./SectionHeader.jsx";
import { getShopLogo } from "../shopLogos";
import { getMenuImage } from "../shopImages";

// ─── YDS 2.0 MenuRecommend Swimlane (리뉴얼-2026) ─────────────────────────
// Figma node 13794:410978 — 메뉴 추천 스윔레인
// SectionHeader + 가로 스크롤 메뉴 카드 (148px) + auto_transition 버튼

const FONT = "Pretendard, Roboto, sans-serif";
const CARD_WIDTH = 148;
const THUMB_SIZE = 148;

// ── MenuRecommendCard ──────────────────────────────────────────────────────

export function MenuRecommendCard({
  thumbSrc,
  logoSrc = null,      // 48x48 브랜드 로고 (옵션, 좌상단)
  shopLogoSrc = null,  // 18x18 YPX 심볼 (가게명 옆)
  shopName = "가게명",
  menuName = "메뉴명",
  price = "13,000",    // "13,000"
  pointback = "390원", // "390원"
  deliveryTime = "12~23분",
  deliveryFee = "무료", // "무료" 또는 "2,000원"
}) {
  return (
    <div style={{
      width: CARD_WIDTH, flexShrink: 0,
      fontFamily: FONT,
    }}>
      {/* 1. Thumbnail (148x148) */}
      <div style={{
        width: THUMB_SIZE, height: THUMB_SIZE,
        borderRadius: 12, overflow: "hidden",
        position: "relative",
        background: "rgba(255,255,255,0.88)",
        border: "1px solid rgba(0,0,0,0.04)",
      }}>
        {thumbSrc ? (
          <img src={thumbSrc} alt={menuName} style={{
            width: "100%", height: "100%", objectFit: "cover", display: "block",
          }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "#e5e5e5" }} />
        )}

        {/* 좌상단: 브랜드 로고 (옵션) */}
        {logoSrc && (
          <div style={{
            position: "absolute", top: 7, left: 7,
            width: 48, height: 48, borderRadius: 24,
            overflow: "hidden",
            border: "1px solid rgba(0,0,0,0.04)",
            background: "#fff",
          }}>
            <img src={logoSrc} alt="" style={{
              width: "100%", height: "100%", objectFit: "cover", display: "block",
            }} />
          </div>
        )}
      </div>

      {/* 2. 텍스트 영역 (gap 8) */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
        {/* 가게명 행 (h 18) */}
        <div style={{
          display: "flex", alignItems: "center", gap: 2,
          height: 18,
        }}>
          {shopLogoSrc && (
            <img src={shopLogoSrc} alt="" style={{
              width: 18, height: 18, flexShrink: 0,
            }} />
          )}
          <span style={{
            fontSize: 12, fontWeight: 400, lineHeight: "16px",
            color: "#333",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{shopName}</span>
        </div>

        {/* 메뉴 정보 (gap 4) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* 메뉴명 */}
          <span style={{
            fontSize: 14, fontWeight: 700, lineHeight: "19px",
            color: "#333",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{menuName}</span>

          {/* 가격 */}
          <span style={{
            fontSize: 14, fontWeight: 700, lineHeight: "19px",
            color: "#333",
          }}>{price}원</span>

          {/* 적립 */}
          {pointback && (
            <span style={{
              fontSize: 12, fontWeight: 400, lineHeight: "16px",
              color: "#666",
            }}>최대 {pointback} 적립</span>
          )}

          {/* 배달 정보 */}
          <div style={{
            fontSize: 12, lineHeight: "16px",
            color: "#666",
          }}>
            <span style={{ fontWeight: 400 }}>{deliveryTime} · 배달비 </span>
            <span style={{ fontWeight: 700 }}>{deliveryFee}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MenuRecommendRow ───────────────────────────────────────────────────────

export function MenuRecommendRow({
  title = "추천 메뉴",
  cards = [],
  showMoreButton = true, // auto_transition 버튼 (우측 끝)
}) {
  const scrollRef = useRef(null);

  return (
    <div style={{ fontFamily: FONT }}>
      {/* SectionHeader 재사용 */}
      <SectionHeader title={title} showArrow />

      {/* 가로 스크롤 카드 목록 */}
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          gap: 12,
          paddingLeft: 16,
          paddingTop: 16,
          paddingBottom: 16,
          overflowX: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>{`[data-menu-recommend-scroll]::-webkit-scrollbar { display: none; }`}</style>

        {cards.map((card, i) => (
          <MenuRecommendCard key={i} {...card} />
        ))}

        {/* auto_transition 버튼 (우측 끝) */}
        {showMoreButton && (
          <div style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            paddingRight: 16,
          }}>
            <div style={{
              width: 28, height: 28,
              borderRadius: 10,
              background: "#f6f6f6",
              border: "1.3px solid #e5e5e5",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}>
              <YdsIcon name="chevron_right_s" size={16} color="#333" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Section (Storybook) ────────────────────────────────────────────────────

const SAMPLE_CARDS = [
  {
    thumbSrc: getMenuImage("burger_1_menu_01"),
    logoSrc: getShopLogo("frank"),
    shopLogoSrc: "/assets/badge-icons/ypx_symbol.png",
    shopName: "프랭크버거",
    menuName: "클래식치즈버거",
    price: "8,900",
    pointback: "270원",
    deliveryTime: "15~25분",
    deliveryFee: "무료",
  },
  {
    thumbSrc: getMenuImage("chiken_1_menu_01"),
    logoSrc: getShopLogo("kyochon"),
    shopLogoSrc: "/assets/badge-icons/ypx_symbol.png",
    shopName: "교촌치킨",
    menuName: "허니콤보",
    price: "19,000",
    pointback: "570원",
    deliveryTime: "30~45분",
    deliveryFee: "2,000원",
  },
  {
    thumbSrc: getMenuImage("burger_2_menu_01"),
    logoSrc: getShopLogo("moms"),
    shopLogoSrc: "/assets/badge-icons/ypx_symbol.png",
    shopName: "맘스터치",
    menuName: "싸이버거",
    price: "5,900",
    pointback: "180원",
    deliveryTime: "20~30분",
    deliveryFee: "무료",
  },
  {
    thumbSrc: getMenuImage("chiken_2_menu_01"),
    logoSrc: getShopLogo("bhc"),
    shopLogoSrc: "/assets/badge-icons/ypx_symbol.png",
    shopName: "BHC",
    menuName: "뿌링클",
    price: "18,000",
    pointback: "540원",
    deliveryTime: "35~50분",
    deliveryFee: "1,500원",
  },
  {
    thumbSrc: getMenuImage("burger_1_menu_03"),
    logoSrc: getShopLogo("bbq"),
    shopLogoSrc: "/assets/badge-icons/ypx_symbol.png",
    shopName: "BBQ",
    menuName: "황금올리브",
    price: "20,000",
    pointback: "600원",
    deliveryTime: "40~55분",
    deliveryFee: "무료",
  },
  {
    thumbSrc: getMenuImage("chiken_1_menu_03"),
    logoSrc: getShopLogo("60gye"),
    shopLogoSrc: "/assets/badge-icons/ypx_symbol.png",
    shopName: "60계치킨",
    menuName: "후라이드반+양념반",
    price: "13,000",
    pointback: "390원",
    deliveryTime: "12~23분",
    deliveryFee: "무료",
  },
];

export default function MenuRecommendSwimlaneSection({ previewWidth }) {
  return (
    <div style={{ padding: "24px 0" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#999", marginBottom: 8 }}>Preview</div>

      <div style={{ width: previewWidth > 0 ? previewWidth : "100%", margin: previewWidth > 0 ? "0 auto" : 0 }}>
      <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden" }}>
        <MenuRecommendRow cards={SAMPLE_CARDS} />
      </div>
      </div>
    </div>
  );
}
