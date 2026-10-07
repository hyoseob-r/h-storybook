import { useRef } from "react";
import { YdsIcon } from "../icons.jsx";
import { getMenuImage } from "../shopImages.js";

// ─── YDS 2.0 QC Product Swimlane (퀵커머스 상품 스윔레인, 리뉴얼-2026) ─────
// Figma node 13794:409993 — 큰 스윔레인
// 타이틀 영역 + 2행 × 3열 상품 그리드, 가로 스크롤

const FONT = "Pretendard, Roboto, sans-serif";
const CARD_W = 140;
const THUMB_SIZE = 140;

// ── QCProductCard ──────────────────────────────────────────────────────────

export function QCProductCard({
  thumbSrc,
  productName = "상품명",
  price = "5,900",
  originalPrice = null,
  discountRate = null,
  promoBadge = null,
  bulkDiscount = null,
  isAdult = false,
  onAddCart,
}) {
  return (
    <div style={{
      width: CARD_W, flexShrink: 0,
      fontFamily: FONT,
    }}>
      {/* 1. Thumbnail */}
      <div style={{
        width: THUMB_SIZE, height: THUMB_SIZE,
        borderRadius: 8, overflow: "hidden",
        position: "relative", background: "#f0f0f0",
      }}>
        {thumbSrc ? (
          <img src={thumbSrc} alt={productName} style={{
            width: "100%", height: "100%", objectFit: "cover", display: "block",
          }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "#e5e5e5" }} />
        )}

        {/* dim overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(0,0,0,0.04)",
          borderRadius: 8,
          border: "1px solid rgba(0,0,0,0.05)",
          pointerEvents: "none",
        }} />

        {/* 우상단: 19세 뱃지 */}
        {isAdult && (
          <div style={{
            position: "absolute", top: 8, right: 8,
            width: 28, height: 28,
          }}>
            <YdsIcon name="ic_19_circle" size={28} />
          </div>
        )}
        {/* 좌상단: 프로모 뱃지 */}
        {!isAdult && promoBadge && (
          <div style={{
            position: "absolute", top: 8, left: 8,
            background: "#05947f",
            borderRadius: 2,
            padding: "3px 6px",
            display: "flex", alignItems: "center", gap: 3,
          }}>
            <span style={{
              fontSize: 13, fontWeight: 700, lineHeight: "18px",
              color: "#fff",
            }}>{promoBadge}</span>
          </div>
        )}

        {/* 우하단: 장바구니 버튼 40x40 */}
        <button onClick={onAddCart} style={{
          position: "absolute", bottom: 8, right: 8,
          width: 40, height: 40,
          borderRadius: 20,
          background: "#fff",
          border: "none",
          boxShadow: "0px 0px 2px rgba(25,48,64,0.08), 0px 1px 8px rgba(25,48,64,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          padding: 8,
        }}>
          <YdsIcon name="add_s" size={24} color="#FA0050" />
        </button>
      </div>

      {/* 2. Text area */}
      <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
        {/* 상품명 — 2줄까지 */}
        <div style={{
          fontSize: 14, fontWeight: 400, lineHeight: "19px",
          color: "rgba(0,0,0,0.8)",
          width: CARD_W,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          wordBreak: "break-word",
        }}>
          {productName}
        </div>

        {/* 할인 조건 뱃지 (옵션) */}
        {bulkDiscount && (
          <div style={{
            display: "inline-flex", alignItems: "center",
            border: "1px solid #fd99b9",
            borderRadius: 2,
            padding: "1px 4px",
            alignSelf: "flex-start",
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, lineHeight: "16px", color: "#fa0050" }}>
              {bulkDiscount.minQty}
            </span>
            <span style={{ fontSize: 12, fontWeight: 400, lineHeight: "16px", color: "#fa0050", marginLeft: 2 }}>
              사면 {bulkDiscount.rate}↓
            </span>
          </div>
        )}
      </div>

      {/* 3. Price area */}
      <div style={{ marginTop: 4 }}>
        {/* 원래가 (취소선) */}
        {originalPrice && (
          <div style={{
            fontSize: 12, fontWeight: 400, lineHeight: "16px",
            color: "rgba(0,0,0,0.3)",
            textDecoration: "line-through",
          }}>
            {originalPrice}원
          </div>
        )}

        {/* 할인율 + 할인가 */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
          {discountRate && (
            <span style={{
              fontSize: 16, fontWeight: 700, lineHeight: "22px",
              color: "#fa0050",
            }}>
              {discountRate}%
            </span>
          )}
          <span style={{
            fontSize: 16, fontWeight: 700, lineHeight: "22px",
            color: "rgba(0,0,0,0.8)",
          }}>
            {price}
          </span>
          <span style={{
            fontSize: 14, fontWeight: 400, lineHeight: "19px",
            color: "rgba(0,0,0,0.8)",
          }}>
            원
          </span>
        </div>
      </div>
    </div>
  );
}

// ── QCProductSwimlane ──────────────────────────────────────────────────────

export function QCProductSwimlane({
  title = "이번 주 특가",
  subtitle = "놓치면 후회할 가격",
  dateRange = "10.1(수)~10.7(화)",
  products = [],
}) {
  const scrollRef = useRef(null);

  // 2행 × N열 grid: 행 우선 배치
  const rows = [[], []];
  products.forEach((p, i) => {
    rows[i % 2].push(p);
  });
  const colCount = Math.max(rows[0].length, rows[1].length);

  return (
    <div style={{ fontFamily: FONT, background: "#fff" }}>
      {/* Title area — h 100, paddingLeft 16 */}
      <div style={{
        height: 100, paddingLeft: 16,
        display: "flex", flexDirection: "column", justifyContent: "center",
      }}>
        <div style={{
          fontSize: 20, fontWeight: 700, lineHeight: "27px",
          color: "#333",
        }}>
          {title}
        </div>
        {subtitle && (
          <div style={{
            fontSize: 13, fontWeight: 400, lineHeight: "18px",
            color: "#333",
            marginTop: 2,
          }}>
            {subtitle}
          </div>
        )}
        {dateRange && (
          <div style={{
            fontSize: 12, fontWeight: 400, lineHeight: "16px",
            color: "rgba(0,0,0,0.6)",
            marginTop: 2,
          }}>
            {dateRange}
          </div>
        )}
      </div>

      {/* Product grid — 2행 × 3열, horizontal scroll */}
      <div
        ref={scrollRef}
        style={{
          overflowX: "auto",
          scrollbarWidth: "none",
          paddingLeft: 16, paddingRight: 16,
          paddingBottom: 20,
        }}
      >
        <div style={{
          display: "grid",
          gridTemplateRows: "auto auto",
          gridTemplateColumns: `repeat(${colCount}, ${CARD_W}px)`,
          gridAutoFlow: "column",
          columnGap: 10,
          rowGap: 16,
        }}>
          {products.map((p, i) => (
            <QCProductCard key={i} {...p} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Sample Data ────────────────────────────────────────────────────────────

const SAMPLE_PRODUCTS = [
  {
    thumbSrc: null,
    productName: "[풀무원] 국산콩 순두부 찌개양념",
    price: "3,480",
    originalPrice: "4,980",
    discountRate: "30",
  },
  {
    thumbSrc: null,
    productName: "오뚜기 진라면 순한맛 멀티 (5개입)",
    price: "3,280",
    promoBadge: "2+1",
  },
  {
    thumbSrc: null,
    productName: "매일 바이오 플레인 요거트 150g",
    price: "1,580",
  },
  {
    thumbSrc: null,
    productName: "[CJ] 비비고 왕교자 350g",
    price: "4,980",
    originalPrice: "6,980",
    discountRate: "28",
    bulkDiscount: { minQty: "10개 이상", rate: "99%" },
  },
  {
    thumbSrc: null,
    productName: "서울우유 1L",
    price: "2,780",
    isAdult: false,
  },
  {
    thumbSrc: null,
    productName: "카스 프레시 500ml (6캔)",
    price: "11,900",
    originalPrice: "13,900",
    discountRate: "14",
    isAdult: true,
  },
];

// ── Section (Storybook) ────────────────────────────────────────────────────

export default function QCProductSwimlaneSection() {
  // Assign menu images to sample products
  const menuIds = [
    "burger_1_menu_01", "burger_1_menu_02", "burger_1_menu_03",
    "burger_2_menu_01", "burger_2_menu_02", "burger_2_menu_03",
  ];
  const products = SAMPLE_PRODUCTS.map((p, i) => ({
    ...p,
    thumbSrc: p.thumbSrc || getMenuImage(menuIds[i]) || null,
  }));

  return (
    <div style={{ padding: "24px 0" }}>
      {/* Info */}
      <div style={{
        padding: "12px 20px", background: "#fff", borderRadius: 12,
        border: "1px solid #e8e8e8", marginBottom: 16,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#333", marginBottom: 6 }}>
          Spec — QC Product Swimlane
        </div>
        <div style={{ fontSize: 10, color: "#888", lineHeight: "16px" }}>
          2행 x 3열 가로 스크롤 그리드 / 상품_M 카드 (140px) / 장바구니 버튼 / 프로모 뱃지 / 할인 조건 뱃지 / 19세 뱃지
        </div>
      </div>

      {/* Variants label */}
      <div style={{ fontSize: 11, fontWeight: 700, color: "#999", marginBottom: 8, paddingLeft: 4 }}>
        Preview — 6개 상품 (일반 / 할인 / 프로모 / 대량할인 / 19세)
      </div>

      {/* Live Preview */}
      <div style={{
        background: "#fff", borderRadius: 12,
        border: "1px solid #e8e8e8", overflow: "hidden",
      }}>
        <QCProductSwimlane
          title="이번 주 특가"
          subtitle="놓치면 후회할 가격"
          dateRange="10.1(수)~10.7(화)"
          products={products}
        />
      </div>
    </div>
  );
}
