// Tab & Bottomsheet Logo Library
// _tap: 2depth 탭 버튼용 (44x42)
// _b: 더보기 바텀시트용 (44x42)
// 사용법: import { getTabLogo, getBottomsheetLogo, getAllTabLogos } from "../tabLogos";

const TAB_PATH = "/assets/tab-logos/";
const BOTTOM_PATH = "/assets/bottomsheet-logos/";
const CATEGORY_PATH = "/assets/food-category/";

// 동적 로딩 — 빌드 시 파일 리스트를 하드코딩하지 않고, glob으로 자동 수집
// Vite에서는 import.meta.glob 사용 가능하지만, 심플하게 fetch 기반으로 처리

// _tap 에셋 (2depth 탭 버튼)
const tabFiles = import.meta.glob("/public/assets/tab-logos/*.png", { eager: true, query: "?url", import: "default" });
export const TAB_LOGOS = Object.entries(tabFiles).map(([path, url]) => {
  const file = path.split("/").pop();
  const id = file.replace("brand_", "").replace("_44x42_tap.png", "").replace("temp_", "").replace("category_", "");
  return { id, file, url, name: id };
});

// _b 에셋 (더보기 바텀시트)
const bottomFiles = import.meta.glob("/public/assets/bottomsheet-logos/*.png", { eager: true, query: "?url", import: "default" });
export const BOTTOMSHEET_LOGOS = Object.entries(bottomFiles).map(([path, url]) => {
  const file = path.split("/").pop();
  const id = file.replace("brand_", "").replace("_44x42_b.png", "").replace("temp_", "").replace("category_", "");
  return { id, file, url, name: id };
});

// 푸드 카테고리 에셋
const categoryFiles = import.meta.glob("/public/assets/food-category/*.png", { eager: true, query: "?url", import: "default" });
export const FOOD_CATEGORIES = Object.entries(categoryFiles).map(([path, url]) => {
  const file = path.split("/").pop();
  const id = file.replace("category_", "").replace("_44x42_b.png", "");
  return { id, file, url, name: id };
});

// 유틸 함수
export function getTabLogo(id) {
  const item = TAB_LOGOS.find(l => l.id === id);
  return item?.url || null;
}

export function getBottomsheetLogo(id) {
  const item = BOTTOMSHEET_LOGOS.find(l => l.id === id);
  return item?.url || null;
}

export function getFoodCategory(id) {
  const item = FOOD_CATEGORIES.find(l => l.id === id);
  return item?.url || null;
}

export function getAllTabLogos() { return TAB_LOGOS; }
export function getAllBottomsheetLogos() { return BOTTOMSHEET_LOGOS; }
export function getAllFoodCategories() { return FOOD_CATEGORIES; }
