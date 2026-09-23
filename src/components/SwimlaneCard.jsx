import { useState } from "react";
import { metaTokens } from "../tokens";
import { YdsIcon } from "../icons.jsx";
import { SingleBadge, GroupBadge, OffersBadge, LogoBadge } from "./Badge.jsx";
import { RatingCompact } from "./Rating.jsx";

// ─── YDS 2.0 SwimlaneCard Component (리뉴얼-2026) ──────────────────────────
// Figma: 리뉴얼-2026 > Swimlane Card
// 가로 스크롤 카드 — 썸네일 상단 + 가게 정보 하단

const CARD_WIDTH = 150;
const THUMB_HEIGHT = 150;

export function SwimlaneCard({
  shopName = "맛있는 분식집",
  thumbSrc = null,
  logoSrc = null,
  rating = 4.8,
  reviewCount = 1234,
  deliveryTime = "30~45분",
  deliveryFee = "0원",
  benefits = [],
  offerText = null,
  isAd = false,
}) {
  return (
    <div style={{
      width: CARD_WIDTH, flexShrink: 0,
      fontFamily: "Pretendard, Roboto, sans-serif",
    }}>
      {/* Thumbnail */}
      <div style={{
        width: CARD_WIDTH, height: THUMB_HEIGHT, borderRadius: metaTokens.radius.meta_r4,
        overflow: "hidden", background: "#f2f2f2", position: "relative",
      }}>
        {thumbSrc ? (
          <img src={thumbSrc} alt={shopName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 32, color: "#ddd" }}>🍽</span>
          </div>
        )}
        {/* Offer overlay */}
        {offerText && (
          <div style={{ position: "absolute", bottom: 6, left: 6 }}>
            <OffersBadge text={offerText} size="small" />
          </div>
        )}
        {/* AD label */}
        {isAd && (
          <span style={{
            position: "absolute", top: 6, left: 6,
            fontSize: 9, color: "#999", background: "rgba(255,255,255,0.85)",
            padding: "1px 4px", borderRadius: 3,
          }}>AD</span>
        )}
        {/* Heart button */}
        <button style={{
          position: "absolute", top: 6, right: 6, background: "none", border: "none",
          cursor: "pointer", padding: 0,
        }}>
          <YdsIcon name="heart" size={20} color="rgba(255,255,255,0.8)" />
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: "8px 0", display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{
          fontSize: 14, fontWeight: 700, color: "#333",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>{shopName}</div>

        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#999" }}>
          <RatingCompact grade={rating} total={reviewCount} size="small" />
        </div>

        <div style={{ fontSize: 11, color: "#666" }}>
          {deliveryTime} · 배달비 {deliveryFee}
        </div>

        {benefits.length > 0 && (
          <div style={{ marginTop: 2 }}>
            <GroupBadge items={benefits} colorStyle="primary" size="small" />
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
      {/* Section header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 0 12px" }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: "#333" }}>{title}</span>
        {showMore && (
          <button style={{ display: "flex", alignItems: "center", gap: 2, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <span style={{ fontSize: 13, color: "#999" }}>더보기</span>
            <YdsIcon name="chevron_right_s" size={16} color="#999" />
          </button>
        )}
      </div>
      {/* Scrollable row */}
      <div style={{
        display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4,
        scrollbarWidth: "none",
      }}>
        {children}
      </div>
    </div>
  );
}

// ── Section (Storybook) ─────────────────────────────────────────────────────
export default function SwimlaneCardSection() {
  const sampleShops = [
    { shopName: "서브웨이 서초점", rating: 4.8, reviewCount: 1523, deliveryTime: "25~40분", deliveryFee: "0원", offerText: "1,000원 할인" },
    { shopName: "맘스터치 강남역점", rating: 4.5, reviewCount: 892, deliveryTime: "30~45분", deliveryFee: "1,000원" },
    { shopName: "피자헛 역삼점", rating: 4.2, reviewCount: 456, deliveryTime: "35~50분", deliveryFee: "0원", benefits: [{ text: "무료배달", showLeftIcon: true, leftIconName: "check_s" }] },
    { shopName: "교촌치킨 서초점", rating: 4.6, reviewCount: 2103, deliveryTime: "40~55분", deliveryFee: "2,000원" },
    { shopName: "BHC 강남점", rating: 4.4, reviewCount: 731, deliveryTime: "35~50분", deliveryFee: "1,500원", isAd: true },
    { shopName: "굽네치킨 역삼점", rating: 4.3, reviewCount: 512, deliveryTime: "30~45분", deliveryFee: "0원" },
  ];

  return (
    <div style={{ padding: "24px 0" }}>
      {/* Swimlane Row demo */}
      <div style={{ marginBottom: 32, width: 375, background: "#fff", borderRadius: 12, padding: 16 }}>
        <SwimlaneRow title="이 가게 어때요?">
          {sampleShops.map((s, i) => <SwimlaneCard key={i} {...s} />)}
        </SwimlaneRow>
      </div>

      {/* Second row */}
      <div style={{ width: 375, background: "#fff", borderRadius: 12, padding: 16 }}>
        <SwimlaneRow title="골라먹는 재미 🎉" showMore={false}>
          {sampleShops.slice(0, 4).map((s, i) => (
            <SwimlaneCard key={i} {...s} offerText={null} benefits={[
              { text: "즉시할인", showLeftIcon: true, leftIconName: "check_s" },
              { text: "최대 5% 적립" },
            ]} />
          ))}
        </SwimlaneRow>
      </div>
    </div>
  );
}
