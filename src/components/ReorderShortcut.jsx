import { useState } from "react";
import { metaTokens } from "../tokens";
import { SingleBadge, AdBadge } from "./Badge.jsx";
import { RatingCompact } from "./Rating.jsx";
import { getShopLogo } from "../shopLogos";
import { getShopImage } from "../shopImages";

// ─── YDS 2.0 ReorderShortcut (재주문 숏컷, 리뉴얼-2026) ────────────────────
// Figma: 리뉴얼-2026 > shortcut_p04 (270 x 300)
// SwimlaneCard + 이전 주문 메뉴 + LabelButton (바로 담기)

const CARD_WIDTH = 270;

const BENEFIT_PRESETS = {
  none: null,
  ypx_free: { items: ["무료배달", "즉시할인", "최대 15% 적립"] },
  store_free: { items: ["무료배달", "즉시할인", "최대 3% 적립"] },
  single_discount: { items: ["즉시할인"] },
  single_cashback: { items: ["최대 5% 적립"] },
};

const BADGE_PRESETS = {
  lowest:       { text: "배달앱 최저가", colorStyle: "gray", showLeftIcon: true, leftIconName: "ic_lowest" },
  specialpoint: { text: "스페셜적립", colorStyle: "gray", showLeftIcon: true, leftIconName: "ic_specialpoint" },
  ranking:      { text: "할인 1위", colorStyle: "gray", showLeftIcon: true, leftIconName: "ic_bpr" },
  discount:     { text: "즉시할인", colorStyle: "secondary" },
  cashback:     { text: "최대 5% 적립", colorStyle: "secondary" },
};

export function ReorderCard({
  shopName = "본도시락-역삼역",
  thumbSrc = null,
  logoSrc = null,
  rating = 4.8,
  reviewCount = 1234,
  deliveryFee = "0원",
  deliveryTime = "30~45분",
  distance = "372m",
  minOrder = "12,000원",
  orderCount = "3회 주문",
  previousMenu = "셀프마라탕x1, 꿔바로우x1, 콜라x1",
  benefitType = "none",
  badges = [],
  isAd = false,
  orderType = "delivery", // "delivery" | "takeout"
  onReorder,
}) {
  const banner = BENEFIT_PRESETS[benefitType];
  const buttonLabel = orderType === "takeout" ? "포장 바로 주문하기" : "배달 바로 주문하기";

  return (
    <div style={{
      width: CARD_WIDTH, height: 300, flexShrink: 0,
      fontFamily: "Pretendard, Roboto, sans-serif",
      display: "flex", flexDirection: "column",
      borderRadius: 20, overflow: "hidden",
      background: "#fff",
      boxShadow: "0px 0px 2px rgba(25,48,64,0.08), 0px 1px 8px rgba(25,48,64,0.1)",
    }}>
      {/* Thumbnail 270x124 + red badge 겹침 */}
      <div style={{ width: CARD_WIDTH, height: 130, position: "relative", flexShrink: 0 }}>
        <div style={{
          width: CARD_WIDTH, height: 124,
          borderRadius: "12px 12px 0 0", overflow: "hidden",
          background: "#f2f2f2", position: "relative",
        }}>
          {thumbSrc && <img src={thumbSrc} alt={shopName} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />}
          {logoSrc && (
            <div style={{
              position: "absolute", top: 6, left: 6,
              width: 48, height: 48, borderRadius: 400, overflow: "hidden",
              border: "1px solid rgba(0,0,0,0.08)",
            }}>
              <img src={logoSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          {isAd && <div style={{ position: "absolute", bottom: 6, left: 6 }}><AdBadge /></div>}
        </div>
        {/* Red benefit banner */}
        {banner && (
          <div style={{
            position: "absolute", bottom: 0, left: 4, right: 4,
            display: "flex", gap: 2, alignItems: "center", justifyContent: "center",
            height: 20, padding: "4px 6px",
            background: "#FA0050", borderRadius: 12,
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
      <div style={{ padding: "6px 12px 0", display: "flex", flexDirection: "column", gap: 4, flex: "1 0 0", minHeight: 0, overflow: "hidden" }}>
        {/* 가게명 + 별점 */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 16, fontWeight: 700, lineHeight: "22px", color: "#333", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
            {shopName}
          </span>
          <RatingCompact grade={rating} total={reviewCount} size="small" />
        </div>

        {/* 배달비 */}
        <div style={{ fontSize: 12, fontWeight: 700, lineHeight: "16px", color: "#333" }}>배달비 {deliveryFee}</div>

        {/* 주문횟수 · 배달시간 · 거리 · 최소주문 */}
        <div style={{ fontSize: 12, lineHeight: "16px", color: "#333", display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
          {orderCount && <span style={{ fontWeight: 700 }}>{orderCount}</span>}
          <span style={{ width: 3, height: 3, borderRadius: 1.5, background: "#ccc" }} />
          <span>{deliveryTime}</span>
          <span style={{ width: 3, height: 3, borderRadius: 1.5, background: "#ccc" }} />
          <span>{distance}</span>
          {minOrder && (
            <>
              <span style={{ width: 3, height: 3, borderRadius: 1.5, background: "#ccc" }} />
              <span>최소 {minOrder}</span>
            </>
          )}
        </div>

        {/* 이전 주문 메뉴 */}
        {previousMenu && (
          <div style={{ fontSize: 12, lineHeight: "16px", color: "#999", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {previousMenu}
          </div>
        )}

        {/* 뱃지 */}
        {badges.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, maxHeight: 40, overflow: "hidden" }}>
            {badges.map((key, i) => {
              const preset = BADGE_PRESETS[key];
              if (!preset) return null;
              return <SingleBadge key={i} text={preset.text} colorStyle={preset.colorStyle} size="small" showLeftIcon={preset.showLeftIcon} leftIconName={preset.leftIconName} />;
            })}
          </div>
        )}
      </div>

      {/* caption + labelbutton — 바텀 정렬 */}
      <div style={{ marginTop: "auto", flexShrink: 0 }}>
        {/* gradient 구분선 — Figma 원본 radial gradient */}
        <div style={{
          width: "100%", height: 12,
          backgroundImage: "url('/assets/ui-elements/gradient_divider.png')",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }} />
        {/* LabelButton / text — padding 12좌우 4상하, 246 Fill x 36 */}
        <div style={{ padding: "4px 12px" }}>
          <div
            onClick={onReorder}
            style={{
              width: "100%", height: 36, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 8,
            }}
          >
            <span style={{
              fontSize: 14, fontWeight: 700, lineHeight: "19px", color: "#333",
              fontFamily: "Pretendard, Roboto, sans-serif",
            }}>{buttonLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Reorder Row ────────────────────────────────────────────────────────────
export function ReorderRow({ title = "재주문 숏컷", children }) {
  return (
    <div style={{ fontFamily: "Pretendard, Roboto, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 16px 12px" }}>
        <span style={{ fontSize: 18, fontWeight: 700, lineHeight: "24px", color: "#333" }}>{title}</span>
      </div>
      <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingLeft: 16, paddingBottom: 16, scrollbarWidth: "none" }}>
        {children}
      </div>
    </div>
  );
}

// ── Section (Storybook) ─────────────────────────────────────────────────────
export default function ReorderShortcutSection() {
  return (
    <div style={{ padding: "24px 0" }}>
      <div style={{ width: "100%", background: "#fff", overflow: "hidden" }}>
        <ReorderRow title="재주문 숏컷">
          <ReorderCard shopName="본도시락-역삼역" thumbSrc={getShopImage("hansik_1")} logoSrc={getShopLogo("bon")} rating={4.8} reviewCount={1567} deliveryFee="0원" orderCount="3회 주문" previousMenu="고추장불고기x1, 된장찌개x1" benefitType="ypx_free" badges={["lowest", "specialpoint"]} />
          <ReorderCard shopName="교촌치킨 서초점" thumbSrc={getShopImage("chiken_1")} rating={4.6} reviewCount={2103} deliveryFee="2,000원" orderCount="5회 주문" previousMenu="허니콤보x1, 레드콤보x1, 콜라1.25Lx1" benefitType="single_discount" badges={["discount"]} orderType="takeout" />
          <ReorderCard shopName="서브웨이 서초점" thumbSrc={getShopImage("sandwitch_1")} logoSrc={getShopLogo("subway")} rating={4.5} reviewCount={892} deliveryFee="0원" orderCount="8회 주문" previousMenu="에그마요x2, 쿠키x1" badges={["cashback"]} />
          <ReorderCard shopName="맘스터치 강남점" thumbSrc={getShopImage("chiken_2")} logoSrc={getShopLogo("moms")} rating={4.3} reviewCount={738} deliveryFee="0원" orderCount="4회 주문" previousMenu="싸이버거x2, 감자튀김x1" benefitType="single_cashback" orderType="takeout" />
          <ReorderCard shopName="피자헛 역삼점" thumbSrc={getShopImage("pizza_1")} logoSrc={getShopLogo("pizzahut")} rating={4.2} reviewCount={456} deliveryFee="0원" orderCount="2회 주문" previousMenu="슈퍼슈프림 라지x1" isAd />
        </ReorderRow>
      </div>
    </div>
  );
}
