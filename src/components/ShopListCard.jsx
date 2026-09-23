import { useState } from "react";
import { metaTokens } from "../tokens";
import { YdsIcon } from "../icons.jsx";
import { SingleBadge, GroupBadge, OffersBadge, LogoBadge } from "./Badge.jsx";
import { RatingCompact } from "./Rating.jsx";

// ─── YDS 2.0 ShopListCard Component (리뉴얼-2026) ──────────────────────────
// Figma: 리뉴얼-2026 > ShopList Card
// 가게 리스트 카드 — 로고 + 가게 정보 + 혜택 배지

const BENEFIT_PRESETS = {
  none: [],
  ypx_free_delivery: [
    { text: "무료배달", showLeftIcon: true, leftIconName: "check_s" },
    { text: "즉시할인", showLeftIcon: true, leftIconName: "check_s" },
    { text: "최대 5% 적립" },
  ],
  store_free_delivery: [
    { text: "가게무배", showLeftIcon: true, leftIconName: "check_s" },
    { text: "즉시할인", showLeftIcon: true, leftIconName: "check_s" },
    { text: "최대 3% 적립" },
  ],
  single_discount: [{ text: "즉시할인", showLeftIcon: true, leftIconName: "check_s" }],
  single_cashback: [{ text: "최대 5% 적립" }],
  single_ypx_free: [{ text: "무료배달", showLeftIcon: true, leftIconName: "check_s" }],
  single_store_free: [{ text: "가게무배", showLeftIcon: true, leftIconName: "check_s" }],
};

const SUBSCRIPTION_LABELS = {
  none: null,
  ypx_sub: { text: "요기패스X", colorStyle: "primary" },
  ypx_nonsub: { text: "요기패스X 가입하면", colorStyle: "dimmed" },
  nonsub_ypx: { text: "요기패스X", colorStyle: "primary" },
  nonsub_nonypx: null,
};

export function ShopListCard({
  shopName = "맛있는 분식집",
  logoSrc = null,
  rating = 4.8,
  reviewCount = 1234,
  deliveryTime = "30~45분",
  deliveryFee = "0원~3,000원",
  distance = "1.2km",
  benefitType = "ypx_free_delivery",
  subscriptionType = "none",
  offerText = null,
  isAd = false,
}) {
  const benefits = BENEFIT_PRESETS[benefitType] || [];
  const subLabel = SUBSCRIPTION_LABELS[subscriptionType];

  return (
    <div style={{
      display: "flex", gap: 12, padding: "16px 0",
      borderBottom: "1px solid #F2F2F2",
      fontFamily: "Pretendard, Roboto, sans-serif",
    }}>
      {/* Logo */}
      <div style={{ flexShrink: 0, position: "relative" }}>
        <LogoBadge src={logoSrc} size={88} />
        {isAd && (
          <span style={{
            position: "absolute", bottom: 4, left: 4,
            fontSize: 9, color: "#999", background: "rgba(255,255,255,0.85)",
            padding: "1px 4px", borderRadius: 3,
          }}>AD</span>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
        {/* Shop name */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{
            fontSize: 16, fontWeight: 700, color: "#333",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{shopName}</span>
          {subLabel && <SingleBadge text={subLabel.text} colorStyle={subLabel.colorStyle} size="small" />}
        </div>

        {/* Rating + delivery info */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#999" }}>
          <RatingCompact grade={rating} total={reviewCount} size="small" />
          <span style={{ width: 2, height: 2, borderRadius: 1, background: "#ccc", display: "inline-block" }} />
          <span>{distance}</span>
        </div>

        {/* Delivery meta */}
        <div style={{ fontSize: 12, color: "#666", display: "flex", gap: 4, alignItems: "center" }}>
          <span>{deliveryTime}</span>
          <span style={{ width: 2, height: 2, borderRadius: 1, background: "#ccc", display: "inline-block" }} />
          <span>배달비 {deliveryFee}</span>
        </div>

        {/* Benefits */}
        {benefits.length > 0 && (
          <div style={{ marginTop: 2 }}>
            <GroupBadge items={benefits} colorStyle="primary" size="small" />
          </div>
        )}

        {/* Offer badge */}
        {offerText && (
          <div style={{ marginTop: 2 }}>
            <OffersBadge text={offerText} size="small" showLeftIcon leftIconName="coupon" />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Section (Storybook) ─────────────────────────────────────────────────────
export default function ShopListCardSection() {
  const [benefitType, setBenefitType] = useState("ypx_free_delivery");
  const [subType, setSubType] = useState("none");

  return (
    <div style={{ padding: "24px 0" }}>
      {/* Controls */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#999", marginRight: 4 }}>Benefits:</span>
          {["none", "ypx_free_delivery", "store_free_delivery", "single_discount", "single_cashback"].map(t => (
            <button key={t} onClick={() => setBenefitType(t)}
              style={{ padding: "4px 10px", borderRadius: 20, border: `1.5px solid ${benefitType === t ? "#0C74E4" : "#e0e0e0"}`,
                background: benefitType === t ? "#0C74E4" : "#fff", color: benefitType === t ? "#fff" : "#666",
                fontSize: 10, cursor: "pointer" }}>{t.replace(/_/g, " ")}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#999", marginRight: 4 }}>Subscription:</span>
          {["none", "ypx_sub", "ypx_nonsub"].map(t => (
            <button key={t} onClick={() => setSubType(t)}
              style={{ padding: "4px 10px", borderRadius: 20, border: `1.5px solid ${subType === t ? "#0C74E4" : "#e0e0e0"}`,
                background: subType === t ? "#0C74E4" : "#fff", color: subType === t ? "#fff" : "#666",
                fontSize: 10, cursor: "pointer" }}>{t.replace(/_/g, " ")}</button>
          ))}
        </div>
      </div>

      {/* Demo cards */}
      <div style={{ width: 375, background: "#fff", borderRadius: 12, padding: "0 16px" }}>
        <ShopListCard
          shopName="서브웨이 서초점"
          rating={4.8} reviewCount={1523}
          deliveryTime="25~40분" deliveryFee="0원~2,000원" distance="0.8km"
          benefitType={benefitType} subscriptionType={subType}
        />
        <ShopListCard
          shopName="맘스터치 강남역점"
          rating={4.5} reviewCount={892}
          deliveryTime="30~45분" deliveryFee="1,000원~3,000원" distance="1.5km"
          benefitType={benefitType} subscriptionType={subType}
          offerText="1,000원 할인"
        />
        <ShopListCard
          shopName="피자헛 역삼점 맛있는 피자 전문점"
          rating={4.2} reviewCount={456}
          deliveryTime="35~50분" deliveryFee="0원" distance="2.1km"
          benefitType={benefitType} subscriptionType={subType}
          isAd
        />
      </div>
    </div>
  );
}
