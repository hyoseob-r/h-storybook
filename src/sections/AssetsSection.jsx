import { useState } from "react";
import { getAllLogos, SHOP_LOGOS } from "../shopLogos";
import { getAllShopImages, getAllMenuImages, SHOP_IMAGES, MENU_IMAGES } from "../shopImages";
import { getAllTabLogos, getAllBottomsheetLogos, getAllFoodCategories, TAB_LOGOS, BOTTOMSHEET_LOGOS, FOOD_CATEGORIES } from "../tabLogos";

const shopLogoItems = getAllLogos();
const shopImageItems = getAllShopImages();
const menuImageItems = getAllMenuImages();
const tabLogoItems = getAllTabLogos();
const bottomsheetLogoItems = getAllBottomsheetLogos();
const foodCategoryItems = getAllFoodCategories();

const ASSET_CATEGORIES = [
  {
    id: "shop-logo",
    label: "가게 대표 썸네일 로고",
    desc: "ShopListCard, SwimlaneCard 등에 사용되는 일반 가게 로고 (44x44)",
    status: "ready",
    items: shopLogoItems,
  },
  {
    id: "shop-image",
    label: "가게 대표이미지",
    desc: "가게 상세, 검색결과 등에 사용되는 대표 이미지",
    status: shopImageItems.length > 0 ? "ready" : "empty",
    items: shopImageItems,
    type: "shop-image",
  },
  {
    id: "menu-image",
    label: "메뉴이미지",
    desc: "가게별 메뉴 사진. 가게명_메뉴N 형식. 독립 사용 가능.",
    status: menuImageItems.length > 0 ? "ready" : "empty",
    items: menuImageItems,
    type: "menu-image",
  },
  {
    id: "tab-logo",
    label: "2depth 탭 버튼 로고",
    desc: "카테고리 탭, 가상카테고리 대표이미지 (44x42, _tap)",
    status: tabLogoItems.length > 0 ? "ready" : "empty",
    items: tabLogoItems,
  },
  {
    id: "bottomsheet-logo",
    label: "바텀시트 썸네일 로고",
    desc: "더보기 바텀시트에 표시되는 썸네일 (44x42, _b)",
    status: bottomsheetLogoItems.length > 0 ? "ready" : "empty",
    items: bottomsheetLogoItems,
  },
  {
    id: "food-category",
    label: "푸드 카테고리 로고",
    desc: "글로벌홈 카테고리 아이콘 (치킨, 피자, 한식 등)",
    status: foodCategoryItems.length > 0 ? "ready" : "empty",
    items: foodCategoryItems,
  },
  {
    id: "quickcommerce",
    label: "퀵커머스 로고",
    desc: "편의점/그로써리 매장 로고 — 별도 제작 필요",
    status: "empty",
    items: [],
  },
  {
    id: "promo-graphic",
    label: "프로모션 그래픽",
    desc: "BrandnewBanner, 이벤트 배너용 그래픽 에셋",
    status: "empty",
    items: [],
  },
];

const STATUS_BADGE = {
  ready:   { label: "준비됨", bg: "#e8f5e8", color: "#338833", border: "#88cc88" },
  partial: { label: "일부",   bg: "#fff8e0", color: "#aa7700", border: "#eebb44" },
  empty:   { label: "미등록", bg: "#f5f5f5", color: "#999999", border: "#dddddd" },
};

export default function AssetsSection() {
  const [selected, setSelected] = useState(null);
  const [copied, setCopied] = useState(null);

  const copyImport = (item, catType) => {
    let code;
    if (catType === "shop-image") {
      code = `import { getShopImage } from "../shopImages";\n// url: getShopImage("${item.id}")  →  ${item.name}`;
    } else if (catType === "menu-image") {
      code = `import { getMenuImage } from "../shopImages";\n// url: getMenuImage("${item.id}")  →  ${item.label || item.id}`;
    } else {
      code = `import { getShopLogo } from "../shopLogos";\n// url: getShopLogo("${item.id}")  →  ${item.name}`;
    }
    navigator.clipboard.writeText(code);
    setCopied(item.id);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div style={{ padding: "24px 32px", maxWidth: 900 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>Assets</h2>
      <p style={{ fontSize: 13, color: "#888", marginBottom: 24, lineHeight: 1.6 }}>
        컴포넌트에 사용되는 이미지 에셋 관리. 로고/사진/그래픽을 등록하면 컴포넌트가 실제 에셋으로 렌더링됩니다.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {ASSET_CATEGORIES.map(cat => {
          const badge = STATUS_BADGE[cat.status];
          const isOpen = selected === cat.id;
          return (
            <div key={cat.id} style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: 12, overflow: "hidden" }}>
              <button
                onClick={() => setSelected(isOpen ? null : cat.id)}
                style={{ width: "100%", padding: "16px 20px", background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}
              >
                <span style={{ fontSize: 14, fontWeight: 600, color: "#111", flex: 1 }}>{cat.label}</span>
                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`, fontWeight: 600 }}>
                  {badge.label}
                </span>
                <span style={{ fontSize: 11, color: "#bbb" }}>
                  {cat.items.length > 0 ? `${cat.items.length}개` : ""}
                </span>
                <span style={{ fontSize: 12, color: "#ccc", transition: "transform 0.2s", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>▸</span>
              </button>

              {isOpen && (
                <div style={{ padding: "0 20px 20px", borderTop: "1px solid #f0f0f0" }}>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 12, marginBottom: 16, lineHeight: 1.6 }}>{cat.desc}</div>

                  {cat.items.length === 0 ? (
                    <div style={{ padding: "32px 0", textAlign: "center", color: "#ccc" }}>
                      <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.4 }}>🖼</div>
                      <div style={{ fontSize: 12 }}>등록된 에셋 없음</div>
                      <div style={{ fontSize: 11, color: "#ddd", marginTop: 4 }}>이미지 URL 또는 파일을 등록해주세요</div>
                    </div>
                  ) : (
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: cat.type === "shop-image" || cat.type === "menu-image"
                        ? "repeat(auto-fill, minmax(120px, 1fr))"
                        : "repeat(auto-fill, minmax(72px, 1fr))",
                      gap: cat.type === "shop-image" || cat.type === "menu-image" ? 10 : 6
                    }}>
                      {cat.items.map((item) => {
                        const isImage = cat.type === "shop-image" || cat.type === "menu-image";
                        const displayName = item.label || item.name || item.id;
                        return (
                          <div key={item.id} onClick={() => copyImport(item, cat.type)}
                            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: isImage ? 8 : 6, borderRadius: 8, cursor: "pointer", background: copied === item.id ? "#e8f5e8" : "transparent", border: copied === item.id ? "1px solid #88cc88" : "1px solid transparent", transition: "all 0.15s" }}
                            title={`${displayName} — 클릭하면 import 코드 복사`}>
                            <img src={item.url} alt={displayName} style={{
                              width: isImage ? 100 : 44,
                              height: isImage ? 100 : 44,
                              borderRadius: isImage ? 10 : 8,
                              objectFit: "cover",
                              objectPosition: "center",
                              border: "1px solid #e5e5e5"
                            }} />
                            <span style={{ fontSize: 9, color: copied === item.id ? "#338833" : "#999", textAlign: "center", lineHeight: 1.3, maxWidth: isImage ? 100 : 64, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {copied === item.id ? "복사됨" : displayName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 사용법 */}
      <div style={{ marginTop: 24, padding: 16, background: "#f0f7ff", border: "1px solid #c5e2fb", borderRadius: 10, fontSize: 11, color: "#336", lineHeight: 1.8 }}>
        <strong>사용법</strong><br/>
        <code style={{ background: "#e8f0ff", padding: "1px 6px", borderRadius: 4 }}>{"import { getShopLogo, getRandomLogos } from \"../shopLogos\";"}</code><br/>
        <code style={{ background: "#e8f0ff", padding: "1px 6px", borderRadius: 4 }}>{"getShopLogo(\"bbq\")  →  /assets/shop-logos/bbq_44x44.png"}</code><br/>
        <code style={{ background: "#e8f0ff", padding: "1px 6px", borderRadius: 4 }}>{"getRandomLogos(5)  →  랜덤 5개 로고 (미리보기용)"}</code><br/><br/>
        <code style={{ background: "#e8f0ff", padding: "1px 6px", borderRadius: 4 }}>{"import { getShopImage, getMenuImage, getMenusByShop } from \"../shopImages\";"}</code><br/>
        <code style={{ background: "#e8f0ff", padding: "1px 6px", borderRadius: 4 }}>{"getShopImage(\"bbq\")     →  가게 대표이미지"}</code><br/>
        <code style={{ background: "#e8f0ff", padding: "1px 6px", borderRadius: 4 }}>{"getMenuImage(\"bbq_메뉴1\")  →  메뉴이미지 (독립 사용)"}</code><br/>
        <code style={{ background: "#e8f0ff", padding: "1px 6px", borderRadius: 4 }}>{"getMenusByShop(\"bbq\")   →  해당 가게 메뉴 전체"}</code>
      </div>

      {/* 요약 */}
      <div style={{ marginTop: 12, padding: 16, background: "#f8f8f8", borderRadius: 10, fontSize: 11, color: "#999", lineHeight: 1.8 }}>
        <strong style={{ color: "#555" }}>에셋 현황</strong><br/>
        아이콘: 122개 (icons.jsx) · 디자인 토큰: 완비 (tokens.js)<br/>
        가게 로고: {SHOP_LOGOS.length}개 · 대표이미지: {SHOP_IMAGES.length}개 · 메뉴: {MENU_IMAGES.length}개<br/>
        탭 로고: {TAB_LOGOS.length}개 · 바텀시트: {BOTTOMSHEET_LOGOS.length}개 · 카테고리: {FOOD_CATEGORIES.length}개 · 퀵커머스: 미등록 · 프로모션: 미등록
      </div>
    </div>
  );
}
