import { useState } from "react";
import { metaTokens } from "../tokens";
import { YdsIcon } from "../icons.jsx";
import { SingleBadge, GroupBadge, LogoBadge, AdBadge } from "./Badge.jsx";
import { RatingCompact } from "./Rating.jsx";
import { SectionHeader } from "./SectionHeader.jsx";
import { getShopLogo } from "../shopLogos";
import { getShopImage, imageStyle } from "../shopImages";

// ─── YDS 2.0 SwimlaneCard Component (리뉴얼-2026 v2) ──────────────────────
// Figma: 리뉴얼-2026 > swimlane_p04
// 가로 스크롤 카드 — 썸네일(메뉴 라벨) + 빨간 혜택배너 + 가게정보 + 뱃지

const CARD_WIDTH = 270;
const THUMB_HEIGHT = 144;

// 빨간 혜택 배너 프리셋
const BENEFIT_PRESETS = {
  none: null,
  ypx_free: { items: ["무료배달", "즉시할인", "최대 15% 적립"] },
  store_free: { items: ["무료배달", "즉시할인", "최대 3% 적립"] },
  single_discount: { items: ["즉시할인"] },
  single_cashback: { items: ["최대 5% 적립"] },
};

// 하단 뱃지 프리셋 (배달앱최저가, 스페셜적립, 할인랭킹 등)
const BADGE_PRESETS = {
  lowest:       { text: "배달앱 최저가", colorStyle: "gray", showLeftIcon: true, leftIconName: "ic_lowest" },
  specialpoint: { text: "스페셜적립", colorStyle: "gray", showLeftIcon: true, leftIconName: "ic_specialpoint" },
  ranking:      { text: "할인 1위", colorStyle: "gray", showLeftIcon: true, leftIconName: "ic_bpr" },
  discount:     { text: "즉시할인", colorStyle: "secondary" },
  cashback:     { text: "최대 5% 적립", colorStyle: "secondary" },
};

export function SwimlaneCard({
  shopName = "맛있는 분식집",
  thumbSrc = null,
  logoSrc = null,
  menuLabel = null,
  menuPrice = null,
  rating = 4.8,
  reviewCount = 1234,
  deliveryTime = "30~45분",
  deliveryFee = "0원",
  distance = null,
  minOrder = null,
  benefitType = "none",
  badges = [],
  isAd = false,
}) {
  const banner = BENEFIT_PRESETS[benefitType];

  return (
    <div style={{
      width: CARD_WIDTH, flexShrink: 0,
      padding: "16px 0",
      fontFamily: "Pretendard, Roboto, sans-serif",
    }}>
      {/* Thumbnail + 배너 wrapper */}
      <div style={{ width: CARD_WIDTH, height: banner ? THUMB_HEIGHT + 10 : THUMB_HEIGHT, position: "relative" }}>
        <div style={{
          width: CARD_WIDTH, height: THUMB_HEIGHT, borderRadius: metaTokens.radius.meta_r4,
          overflow: "hidden", background: "#f2f2f2", position: "absolute", top: 0, left: 0,
        }}>
          {thumbSrc ? (
            <img src={thumbSrc} alt={shopName} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 32, color: "#ddd" }}>🍽</span>
            </div>
          )}

          {/* 메뉴 라벨 오버레이 (상단) */}
          {menuLabel && (
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0,
              padding: "8px 8px 16px",
              background: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.35) 59%, transparent 100%)",
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", lineHeight: "16px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {menuLabel}
              </div>
              {menuPrice && (
                <div style={{ fontSize: 12, fontWeight: 400, color: "#fff", lineHeight: "16px" }}>
                  {menuPrice}
                </div>
              )}
            </div>
          )}

          {/* 로고 오버레이 (좌상단 48px) */}
          {logoSrc && (
            <div style={{
              position: "absolute", top: 6, left: 6,
              width: 48, height: 48, borderRadius: 400, overflow: "hidden",
              border: `1px solid ${metaTokens.colors.alpha.a_black50}`,
            }}>
              <img src={logoSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}

          {/* AD badge */}
          {isAd && (
            <div style={{ position: "absolute", bottom: 6, left: 6 }}>
              <AdBadge />
            </div>
          )}

          {/* Inline border */}
          <span style={{ position: "absolute", inset: 0, borderRadius: "inherit", border: `1px solid rgba(0,0,0,0.04)`, pointerEvents: "none" }} />
        </div>

        {/* 빨간 혜택 배너 — 이미지 하단에 겹침 (absolute) */}
        {banner && (
          <div style={{
            position: "absolute", bottom: 0, left: 4, right: 4,
            display: "flex", gap: 2, alignItems: "center", justifyContent: "center",
            height: 20, padding: "4px 6px",
            background: "#FA0050", borderRadius: 12,
            overflow: "hidden", zIndex: 1,
          }}>
            {banner.items.map((text, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 2 }}>
                {i > 0 && <span style={{ fontSize: 11, fontWeight: 700, lineHeight: "15px", color: "#fff" }}>+</span>}
                <span style={{ fontSize: 11, fontWeight: 700, lineHeight: "15px", color: "#fff", whiteSpace: "nowrap" }}>{text}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "4px 6px 0", display: "flex", flexDirection: "column", gap: 4 }}>
        {/* 가게명 + 별점 — 같은 행, 별점 우측 끝 */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{
            fontSize: 14, fontWeight: 700, color: "#333",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            flex: "0 1 auto", minWidth: 0,
          }}>{shopName}</span>
          <div style={{ marginLeft: "auto", flexShrink: 0 }}>
            <RatingCompact grade={rating} total={reviewCount} size="small" />
          </div>
        </div>

        {/* 배달비 */}
        <div style={{ fontSize: 12, color: "#333" }}>
          배달비 {deliveryFee}
        </div>

        {/* 배달시간 · 거리 · 최소주문 */}
        <div style={{ fontSize: 12, color: "#666", display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
          <span>{deliveryTime}</span>
          {distance && (
            <>
              <span style={{ width: 3, height: 3, borderRadius: 1.5, background: "#ccc", display: "inline-block" }} />
              <span>{distance}</span>
            </>
          )}
          {minOrder && (
            <>
              <span style={{ width: 3, height: 3, borderRadius: 1.5, background: "#ccc", display: "inline-block" }} />
              <span>최소 {minOrder}</span>
            </>
          )}
        </div>

        {/* 하단 뱃지 */}
        {badges.length > 0 && (
          <div style={{ marginTop: 2, display: "flex", flexWrap: "wrap", gap: 4 }}>
            {badges.map((key, i) => {
              const preset = BADGE_PRESETS[key];
              if (!preset) return null;
              return (
                <SingleBadge key={i} text={preset.text} colorStyle={preset.colorStyle}
                  size="small" showLeftIcon={preset.showLeftIcon} leftIconName={preset.leftIconName} />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Swimlane Row ────────────────────────────────────────────────────────────
export function SwimlaneRow({
  title = "이 가게 어때요?",
  showMore = true,
  children,
}) {
  return (
    <div style={{ fontFamily: "Pretendard, Roboto, sans-serif" }}>
      <SectionHeader title={title} showArrow={showMore} />
      {/* Scrollable row */}
      <div style={{
        display: "flex", gap: 8, overflowX: "auto", paddingLeft: 16,
        scrollbarWidth: "none",
      }}>
        {children}
      </div>
    </div>
  );
}

// ── Section (Storybook) ─────────────────────────────────────────────────────
export default function SwimlaneCardSection({ previewWidth }) {
  const sampleShops = [
    { shopName: "서브웨이 서초점", thumbSrc: getShopImage("sandwitch_1"), logoSrc: getShopLogo("subway"), rating: 4.8, reviewCount: 1523, deliveryTime: "25~40분", deliveryFee: "0원", distance: "0.8km", benefitType: "ypx_free", badges: ["lowest", "specialpoint"] },
    { shopName: "맘스터치 강남역점", thumbSrc: getShopImage("burger_1"), rating: 4.5, reviewCount: 892, deliveryTime: "30~45분", deliveryFee: "1,000원", distance: "1.5km", badges: ["discount"] },
    { shopName: "피자헛 역삼점", thumbSrc: getShopImage("pizza_1"), logoSrc: getShopLogo("pizzahut"), rating: 4.2, reviewCount: 456, deliveryTime: "35~50분", deliveryFee: "0원", distance: "2.1km", benefitType: "single_discount", badges: ["ranking"] },
    { shopName: "교촌치킨 서초점", thumbSrc: getShopImage("chiken_1"), rating: 4.6, reviewCount: 2103, deliveryTime: "40~55분", deliveryFee: "2,000원", distance: "1.2km", badges: ["lowest"] },
    { shopName: "BHC 강남점", thumbSrc: getShopImage("chiken_2"), logoSrc: getShopLogo("bhc"), rating: 4.4, reviewCount: 731, deliveryTime: "35~50분", deliveryFee: "1,500원", distance: "0.5km", isAd: true, badges: ["specialpoint"] },
    { shopName: "본도시락 역삼역", thumbSrc: getShopImage("hansik_1"), logoSrc: getShopLogo("bon"), rating: 4.7, reviewCount: 1890, deliveryTime: "20~35분", deliveryFee: "0원", distance: "372m", benefitType: "ypx_free", badges: ["lowest", "specialpoint", "ranking"] },
  ];

  const pw = previewWidth > 0 ? previewWidth : "100%";
  const pm = previewWidth > 0 ? "0 auto" : 0;

  return (
    <div style={{ padding: "24px 0" }}>
      <div style={{ width: pw, margin: pm }}>
      <div style={{ marginBottom: 32, width: "100%", background: "#fff" }}>
        <SwimlaneRow title="이 가게 어때요?">
          {sampleShops.map((s, i) => <SwimlaneCard key={i} {...s} />)}
        </SwimlaneRow>
      </div>

      <div style={{ width: "100%", background: "#fff" }}>
        <SwimlaneRow title="골라먹는 재미">
          {sampleShops.slice(0, 4).map((s, i) => (
            <SwimlaneCard key={i} {...s} benefitType="single_cashback" badges={["cashback", "discount"]} />
          ))}
        </SwimlaneRow>
      </div>
      </div>
    </div>
  );
}
