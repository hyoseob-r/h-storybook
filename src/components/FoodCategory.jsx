import { useState } from "react";
import { metaTokens } from "../tokens";
import { getAllFoodCategories } from "../tabLogos";
import { BenefitBadge } from "./Badge.jsx";

// ─── YDS 2.0 FoodCategory Swimlane (리뉴얼-2026) ───────────────────────────
// Figma: 리뉴얼-2026 > food Category (node 4917:373716)
// 좌측 세로배너(80x160) + 우측 2행 카테고리 그리드, 가로 스크롤
// 카테고리: 72px 셀 (48px 이미지 + 14r 라벨)
// 브랜드 아이템: 뱃지 지원

const SHADOW = "0px 0px 2px rgba(25,48,64,0.08), 0px 1px 8px rgba(25,48,64,0.1)";
const V_BANNER_SRC = "/assets/food-category-banner/v_banner_3x.png";

// 카테고리 데이터 (2행)
const ROW1_CATEGORIES = [
  { id: "all", label: "전체" },
  { id: "hicken", label: "치킨" },
  { id: "chinese", label: "중국집" },
  { id: "hansik", label: "한식" },
  { id: "sushi", label: "회/초밥" },
  { id: "lunchbox", label: "도시락/죽" },
  { id: "jokbalbossam", label: "족발/보쌈" },
  { id: "cafedessert", label: "카페/디저트" },
  { id: "jjimtang", label: "찜/탕" },
  { id: "japanese", label: "일식/돈까스" },
  { id: "asian", label: "아시안" },
  { id: "reusable", label: "다회용기" },
  { id: "franchise", label: "프랜차이즈" },
];

const ROW2_CATEGORIES = [
  { id: "brand_lotte", label: "롯데리아", isBrand: true, badge: "15,000원 할인" },
  { id: "burger", label: "버거" },
  { id: "pizza", label: "피자/양식" },
  { id: "bunsik", label: "분식" },
  { id: "brand_theventi", label: "더벤티", isBrand: true, badge: "3,000원 할인" },
  { id: "salad", label: "샐러드" },
  { id: "grilled", label: "고기/구이" },
  { id: "sandwich", label: "샌드위치" },
  { id: "new", label: "신규맛집" },
  { id: "banchan", label: "반찬" },
  { id: "single", label: "1인분주문" },
  { id: "night", label: "야식" },
];

// Figma: category_grobalhome (72 x 76)
// top(72x56) > img_3D_new(48x48 at x:12,y:4) + label(h:20,y:56) + badge(72x16,y:0)
function CategoryItem({ id, label, isBrand = false, badge = null, onClick }) {
  const categories = getAllFoodCategories();
  const catAsset = categories.find(c => c.id === id);
  const imgSrc = catAsset?.url || null;

  return (
    <div onClick={onClick} style={{
      width: 72, height: 76, flexShrink: 0, position: "relative",
      cursor: "pointer", borderRadius: 12,
    }}>
      {/* badge — 최상단 y:0 */}
      {badge && (
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", zIndex: 1 }}>
          <BenefitBadge label={badge} />
        </div>
      )}

      {/* top — 72x56 */}
      <div style={{ width: 72, height: 56, display: "flex", alignItems: "center", justifyContent: "center", padding: "4px 12px" }}>
        {imgSrc ? (
          <img src={imgSrc} alt={label} style={{ width: 48, height: 48, borderRadius: 12, objectFit: "contain" }} />
        ) : (
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: "#f2f2f2",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, color: "#ccc",
          }}>{label.charAt(0)}</div>
        )}
      </div>

      {/* label — h:20 y:56 */}
      <div style={{
        height: 20, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{
          fontSize: 14, fontWeight: 400, color: "#333", lineHeight: "19px",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>{label}</span>
      </div>
    </div>
  );
}

export function FoodCategorySwimlane({ row1 = ROW1_CATEGORIES, row2 = ROW2_CATEGORIES }) {
  return (
    <div style={{
      background: "#fff",
      padding: "16px 0 16px 16px",
      fontFamily: "Pretendard, Roboto, sans-serif",
      position: "relative",
    }}>
      <div style={{
        display: "flex", gap: 12, overflowX: "auto", scrollbarWidth: "none",
      }}>
        {/* 좌측 세로배너 */}
        <div style={{
          width: 80, height: 160, borderRadius: 12, overflow: "hidden",
          flexShrink: 0, background: "#c9dcfc",
        }}>
          <img src={V_BANNER_SRC} alt="프로모션" style={{
            width: "100%", height: "100%", objectFit: "cover",
          }} />
        </div>

        {/* 카테고리 2행 그리드 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", gap: 4 }}>
            {row1.map((cat, i) => <CategoryItem key={cat.id || i} {...cat} />)}
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {row2.map((cat, i) => <CategoryItem key={cat.id || i} {...cat} />)}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
        <div style={{ width: 56, height: 4, borderRadius: 360, background: "rgba(0,0,0,0.08)", overflow: "hidden" }}>
          <div style={{ width: 24, height: 4, borderRadius: 360, background: "#333" }} />
        </div>
      </div>

      {/* Top/Bottom dividers */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "#f2f2f2" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "#f2f2f2" }} />
    </div>
  );
}

// ── Section (Storybook) ─────────────────────────────────────────────────────
export default function FoodCategorySection() {
  return (
    <div style={{ padding: "24px 0" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 12 }}>FoodCategory Swimlane (390px)</div>
        <div style={{ width: "100%", borderRadius: 0, overflow: "hidden" }}>
          <FoodCategorySwimlane />
        </div>
      </div>
    </div>
  );
}
