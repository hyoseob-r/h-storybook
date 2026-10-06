import { useRef } from "react";
import { YdsIcon } from "../icons.jsx";
import { SingleBadge } from "./Badge.jsx";
import { getShopLogo } from "../shopLogos";
import { getMenuImage } from "../shopImages";

// ─── YDS 2.0 DiscountRanking Swimlane (리뉴얼-2026) ───────────────────────
// Figma node 13794:409351 — 할인랭킹 스윔레인
// 좌측 고정 타이틀 영역 + 우측 가로 스크롤 메뉴 카드

const CARD_WIDTH = 148;
const THUMB_SIZE = 148;

// ── DiscountRankingCard ─────────────────────────────────────────────────────

export function DiscountRankingCard({
  thumbSrc,
  shopName = "가게명",
  shopLogoSrc = null,
  menuName = "메뉴명",
  discountRate = "63",
  salePrice = "11,500",
  originalPrice = "20,000",
  pointback = "1,150원",
  remaining = null,
  timer = "04:59:59",
  rankingBadge = "한식 할인 1위",
}) {
  return (
    <div style={{
      width: CARD_WIDTH, flexShrink: 0,
      fontFamily: "Pretendard, Roboto, sans-serif",
    }}>
      {/* 1. Thumbnail */}
      <div style={{
        width: THUMB_SIZE, height: THUMB_SIZE,
        borderRadius: 12, overflow: "hidden",
        position: "relative", background: "#f0f0f0",
      }}>
        {thumbSrc ? (
          <img src={thumbSrc} alt={menuName} style={{
            width: "100%", height: "100%", objectFit: "cover", display: "block",
          }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "#e5e5e5" }} />
        )}

        {/* 할인율 뱃지 — 좌상단 */}
        <div style={{
          position: "absolute", top: 0, left: 0,
          background: "#FA0050",
          borderRadius: "12px 0 12px 0",
          height: 24, padding: "0 8px",
          display: "flex", alignItems: "center",
        }}>
          <span style={{
            fontSize: 14, fontWeight: 700, lineHeight: "19px",
            color: "#fff",
          }}>{discountRate}%</span>
        </div>

        {/* 타이머 뱃지 — 하단 중앙 */}
        {timer && (
          <div style={{
            position: "absolute", bottom: 6, left: "50%",
            transform: "translateX(-50%)",
            background: "#333", borderRadius: 20,
            height: 22, padding: "0 6px",
            display: "flex", alignItems: "center", gap: 2,
          }}>
            <YdsIcon name="clock" size={16} color="#fff" />
            <span style={{
              fontSize: 12, fontWeight: 700, lineHeight: "16px",
              color: "#fff", whiteSpace: "nowrap",
            }}>{timer}</span>
          </div>
        )}
      </div>

      {/* 2. 랭킹 뱃지 */}
      {rankingBadge && (
        <div style={{ marginTop: 6 }}>
          <SingleBadge text={rankingBadge} colorStyle="gray" size="small" showLeftIcon leftIconName="ic_bpr" />
        </div>
      )}

      {/* 3. 텍스트 영역 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
        {/* 가게명 */}
        <div style={{
          display: "flex", alignItems: "center", gap: 4,
        }}>
          {shopLogoSrc && (
            <img src={shopLogoSrc} alt="" style={{
              width: 18, height: 18, borderRadius: 4, objectFit: "cover", flexShrink: 0,
            }} />
          )}
          <span style={{
            fontSize: 14, fontWeight: 400, lineHeight: "19px",
            color: "#333",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{shopName}</span>
        </div>

        {/* 메뉴명 */}
        <div style={{
          fontSize: 14, fontWeight: 700, lineHeight: "19px",
          color: "#333",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>{menuName}</div>

        {/* 가격 행 */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
          <span style={{
            fontSize: 16, fontWeight: 700, lineHeight: "22px",
            color: "#FA0050",
          }}>{discountRate}%</span>
          <span style={{
            fontSize: 16, fontWeight: 700, lineHeight: "22px",
            color: "#333",
          }}>{salePrice}원</span>
          {originalPrice && (
            <span style={{
              fontSize: 10, fontWeight: 400, lineHeight: "14px",
              color: "#999", textDecoration: "line-through",
            }}>{originalPrice}원</span>
          )}
        </div>

        {/* 적립 */}
        {pointback && (
          <div style={{
            fontSize: 12, fontWeight: 400, lineHeight: "16px",
            color: "#0C74E4",
          }}>
            최대 <span style={{ fontWeight: 700 }}>{pointback}</span> 적립
          </div>
        )}

        {/* 잔여 */}
        {remaining && (
          <div style={{
            fontSize: 10, fontWeight: 400, lineHeight: "14px",
            color: "#FA0050",
          }}>{remaining}</div>
        )}
      </div>
    </div>
  );
}

// ── DiscountRankingRow ──────────────────────────────────────────────────────

export function DiscountRankingRow({
  cards = [],
  promoImageSrc = null,
}) {
  const scrollRef = useRef(null);

  return (
    <div style={{
      background: "linear-gradient(180deg, #d4e7fb 0%, #fafafa 52.4%)",
      padding: "16px 0",
      fontFamily: "Pretendard, Roboto, sans-serif",
    }}>
      <div
        ref={scrollRef}
        style={{
          display: "flex", gap: 12,
          overflowX: "auto", paddingLeft: 16, paddingRight: 16,
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* 좌측 고정 영역 */}
        <div style={{
          width: 148, minWidth: 148, flexShrink: 0,
          display: "flex", flexDirection: "column",
          justifyContent: "space-between",
          height: 289,
        }}>
          {/* 상단: 타이틀 */}
          <div>
            <div style={{
              fontSize: 20, fontWeight: 800, lineHeight: "26px",
              color: "#333", marginBottom: 2,
              display: "flex", alignItems: "center", gap: 4,
            }}>
              <YdsIcon name="ic_bpr" size={24} />
              할인랭킹
            </div>
            <div style={{
              fontSize: 14, fontWeight: 400, lineHeight: "19px",
              color: "#333",
            }}>
              실시간 할인율 1위 메뉴
            </div>

            {/* 더보기 ChipButton */}
            <button style={{
              marginTop: 12,
              background: "#c5dffb", border: "none",
              borderRadius: 360, height: 32,
              padding: "0 10px 0 12px",
              display: "inline-flex", alignItems: "center", gap: 2,
              cursor: "pointer",
              fontFamily: "Pretendard, Roboto, sans-serif",
            }}>
              <span style={{
                fontSize: 14, fontWeight: 700, lineHeight: "19px",
                color: "#333",
              }}>더보기</span>
              <YdsIcon name="chevron_right_s" size={16} color="#333" />
            </button>
          </div>

          {/* 하단: 프로모션 이미지 */}
          {promoImageSrc && (
            <div style={{
              width: "100%", height: 148, borderRadius: 12, overflow: "hidden",
              background: "#e0edf9",
            }}>
              <img src={promoImageSrc} alt="프로모션" style={{
                width: "100%", height: "100%", objectFit: "cover", display: "block",
              }} />
            </div>
          )}
        </div>

        {/* 메뉴 카드들 */}
        {cards.map((card, i) => (
          <DiscountRankingCard key={i} {...card} />
        ))}
      </div>

      {/* scrollbar 숨김 */}
      <style>{`
        [data-discount-ranking-scroll]::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

// ── Section (Storybook) ─────────────────────────────────────────────────────

const SAMPLE_CARDS = [
  {
    thumbSrc: "/assets/menu-images/hansik_1_menu_01.png",
    shopName: "한솥도시락",
    shopLogoSrc: getShopLogo("hansot"),
    menuName: "제육볶음 도시락",
    discountRate: "63",
    salePrice: "5,500",
    originalPrice: "15,000",
    pointback: "1,150원",
    remaining: "3개 남음",
    timer: "04:59:59",
    rankingBadge: "한식 할인 1위",
  },
  {
    thumbSrc: "/assets/menu-images/chiken_1_menu_01.png",
    shopName: "교촌치킨",
    shopLogoSrc: getShopLogo("kyochon"),
    menuName: "교촌 허니오리지날",
    discountRate: "45",
    salePrice: "11,500",
    originalPrice: "20,900",
    pointback: "920원",
    remaining: null,
    timer: "02:30:00",
    rankingBadge: "치킨 할인 1위",
  },
  {
    thumbSrc: "/assets/menu-images/burger_1_menu_01.png",
    shopName: "맥도날드",
    shopLogoSrc: getShopLogo("mcdonalds"),
    menuName: "빅맥 세트",
    discountRate: "30",
    salePrice: "6,300",
    originalPrice: "9,000",
    pointback: "630원",
    remaining: "5개 남음",
    timer: "01:15:22",
    rankingBadge: "버거 할인 1위",
  },
];

export default function DiscountRankingSection() {
  return (
    <div style={{ padding: "24px 0" }}>
      {/* Full preview */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#999", marginBottom: 8 }}>Preview — 할인랭킹 스윔레인</div>
        <div style={{
          width: "100%", maxWidth: 390,
          background: "#fff", borderRadius: 12,
          border: "1px solid #e8e8e8", overflow: "hidden",
        }}>
          <DiscountRankingRow
            cards={SAMPLE_CARDS}
            promoImageSrc="/assets/banners/discount_ranking_hero.png"
          />
        </div>
      </div>

      {/* Individual card */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#999", marginBottom: 8 }}>DiscountRankingCard — 단일 카드</div>
        <div style={{
          display: "inline-block",
          background: "#fff", borderRadius: 12, padding: 16,
          border: "1px solid #e8e8e8",
        }}>
          <DiscountRankingCard {...SAMPLE_CARDS[0]} />
        </div>
      </div>
    </div>
  );
}
