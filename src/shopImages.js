// Shop Images Library — 가게 대표이미지 + 메뉴이미지
// 매핑 없이 폴더 기반 자동 수집 (import.meta.glob)
// 파일만 넣으면 자동 인식

// ── 가게 대표이미지 ─────────────────────────────────────────────────────────
const shopImageFiles = import.meta.glob("/public/assets/shop-images/*.png", { eager: true, query: "?url", import: "default" });
export const SHOP_IMAGES = Object.entries(shopImageFiles).map(([path, url]) => {
  const file = path.split("/").pop();
  const id = file.replace(".png", "");
  const category = id.replace(/_\d+$/, "");
  return { id, file, url, category, name: id };
});

// ── 메뉴이미지 ──────────────────────────────────────────────────────────────
const menuImageFiles = import.meta.glob("/public/assets/menu-images/*.png", { eager: true, query: "?url", import: "default" });
export const MENU_IMAGES = Object.entries(menuImageFiles).map(([path, url]) => {
  const file = path.split("/").pop();
  const id = file.replace(".png", "");
  const shopId = id.replace(/_menu.*$/, "");
  const seqMatch = file.match(/_menu_?(\d+)/);
  const seq = seqMatch ? parseInt(seqMatch[1]) : 0;
  return { id, shopId, seq, file, url };
});

// ── 유틸 함수 ───────────────────────────────────────────────────────────────

export function getShopImage(id) {
  const img = SHOP_IMAGES.find(s => s.id === id);
  return img?.url || null;
}

export function getShopImageByName(name) {
  const img = SHOP_IMAGES.find(s => s.name === name);
  return img?.url || null;
}

export function getAllShopImages() {
  return SHOP_IMAGES;
}

export function getMenuImage(id) {
  const img = MENU_IMAGES.find(m => m.id === id);
  return img?.url || null;
}

export function getMenusByShop(shopId) {
  return MENU_IMAGES
    .filter(m => m.shopId === shopId)
    .sort((a, b) => a.seq - b.seq);
}

export function getAllMenuImages() {
  return MENU_IMAGES;
}

export function getRandomMenuImages(count = 5) {
  const shuffled = [...MENU_IMAGES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// ── 카테고리별 조회 ─────────────────────────────────────────────────────────

export function getShopImagesByCategory(category) {
  return SHOP_IMAGES.filter(s => s.category === category);
}

export function getCategories() {
  return [...new Set(SHOP_IMAGES.map(s => s.category))];
}

// ── 이미지 스타일 (height 기준 리사이징 + 센터 크롭) ─────────────────────────
export function imageStyle(width, height, borderRadius = 8) {
  return {
    width,
    height,
    objectFit: "cover",
    objectPosition: "center",
    borderRadius,
  };
}

// ── 통합 조회 ───────────────────────────────────────────────────────────────

export function getShopWithMenus(shopId) {
  const shop = SHOP_IMAGES.find(s => s.id === shopId);
  if (!shop) return null;
  return {
    ...shop,
    menus: getMenusByShop(shopId),
  };
}
