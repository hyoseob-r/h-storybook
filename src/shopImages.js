// Shop Images Library — 가게 대표이미지 + 메뉴이미지
// 사용법:
//   import { getShopImage, getMenuImage, getMenusByShop, getRandomMenuImages } from "../shopImages";
//   getShopImage("bbq")           → "/assets/shop-images/bbq.png"
//   getMenuImage("bbq_메뉴1")     → "/assets/menu-images/bbq_메뉴1.png"
//   getMenusByShop("bbq")         → [{ id: "bbq_메뉴1", ... }, { id: "bbq_메뉴2", ... }]

const SHOP_IMAGE_PATH = "/assets/shop-images/";
const MENU_IMAGE_PATH = "/assets/menu-images/";

// 가게 대표이미지 — 파일 업로드 후 여기에 등록
// file: 실제 파일명, id: shopLogos와 동일한 ID 사용
export const SHOP_IMAGES = [
  { id: "burger_1", name: "버거1호점", category: "burger", file: "burger_1.png" },
  { id: "burger_2", name: "버거2호점", category: "burger", file: "burger_2.png" },
  { id: "chiken_1", name: "치킨1호점", category: "chiken", file: "chiken_1.png" },
  { id: "chiken_2", name: "치킨2호점", category: "chiken", file: "chiken_2.png" },
  { id: "chiken_3", name: "치킨3호점", category: "chiken", file: "chiken_3.png" },
  { id: "chiken_4", name: "치킨4호점", category: "chiken", file: "chiken_4.png" },
  { id: "chiken_5", name: "치킨5호점", category: "chiken", file: "chiken_5.png" },
  { id: "chiken_6", name: "치킨6호점", category: "chiken", file: "chiken_6.png" },
  { id: "chiken_7", name: "치킨7호점", category: "chiken", file: "chiken_7.png" },
  { id: "chiken_8", name: "치킨8호점", category: "chiken", file: "chiken_8.png" },
  { id: "chinese_1", name: "중식1호점", category: "chinese", file: "chinese_1.png" },
  { id: "chinese_2", name: "중식2호점", category: "chinese", file: "chinese_2.png" },
  { id: "chinese_3", name: "중식3호점", category: "chinese", file: "chinese_3.png" },
  { id: "chinese_4", name: "중식4호점", category: "chinese", file: "chinese_4.png" },
  { id: "chinese_5", name: "중식5호점", category: "chinese", file: "chinese_5.png" },
  { id: "hansik_1", name: "한식1호점", category: "hansik", file: "hansik_1.png" },
  { id: "hansik_2", name: "한식2호점", category: "hansik", file: "hansik_2.png" },
  { id: "hansik_3", name: "한식3호점", category: "hansik", file: "hansik_3.png" },
  { id: "hansik_4", name: "한식4호점", category: "hansik", file: "hansik_4.png" },
  { id: "hansik_5", name: "한식5호점", category: "hansik", file: "hansik_5.png" },
  { id: "pizza_1", name: "피자1호점", category: "pizza", file: "pizza_1.png" },
  { id: "pizza_2", name: "피자2호점", category: "pizza", file: "pizza_2.png" },
  { id: "salad_1", name: "샐러드1호점", category: "salad", file: "salad_1.png" },
  { id: "sandwitch_1", name: "샌드위치1호점", category: "sandwitch", file: "sandwitch_1.png" },
  { id: "sushi_1", name: "초밥1호점", category: "sushi", file: "sushi_1.png" },
  { id: "sushi_2", name: "초밥2호점", category: "sushi", file: "sushi_2.png" },
];

// 메뉴이미지 — 가게명_메뉴N 형식, 독립 사용 가능
// shopId: 연결된 가게 (null이면 독립 메뉴이미지)
// seq: 시퀀스 번호
export const MENU_IMAGES = [
  // burger
  { id: "burger_1_menu_01", shopId: "burger_1", seq: 1, file: "burger_1_menu_01.png" },
  { id: "burger_1_menu_02", shopId: "burger_1", seq: 2, file: "burger_1_menu_02.png" },
  { id: "burger_1_menu_03", shopId: "burger_1", seq: 3, file: "burger_1_menu_03.png" },
  { id: "burger_1_menu_04", shopId: "burger_1", seq: 4, file: "burger_1_menu_04.png" },
  { id: "burger_2_menu_01", shopId: "burger_2", seq: 1, file: "burger_2_menu_01.png" },
  { id: "burger_2_menu_02", shopId: "burger_2", seq: 2, file: "burger_2_menu_02.png" },
  { id: "burger_2_menu_03", shopId: "burger_2", seq: 3, file: "burger_2_menu_03.png" },
  { id: "burger_2_menu_04", shopId: "burger_2", seq: 4, file: "burger_2_menu_04.png" },
  { id: "burger_2_menu_05", shopId: "burger_2", seq: 5, file: "burger_2_menu_05.png" },
  // chiken
  { id: "chiken_1_menu_01", shopId: "chiken_1", seq: 1, file: "chiken_1_menu_01.png" },
  { id: "chiken_1_menu_02", shopId: "chiken_1", seq: 2, file: "chiken_1_menu_02.png" },
  { id: "chiken_1_menu_03", shopId: "chiken_1", seq: 3, file: "chiken_1_menu_03.png" },
  { id: "chiken_1_menu_04", shopId: "chiken_1", seq: 4, file: "chiken_1_menu_04.png" },
  { id: "chiken_1_menu_05", shopId: "chiken_1", seq: 5, file: "chiken_1_menu_05.png" },
  { id: "chiken_1_menu_06", shopId: "chiken_1", seq: 6, file: "chiken_1_menu_06.png" },
  { id: "chiken_1_menu_07", shopId: "chiken_1", seq: 7, file: "chiken_1_menu_07.png" },
  { id: "chiken_2_menu_01", shopId: "chiken_2", seq: 1, file: "chiken_2_menu_01.png" },
  { id: "chiken_2_menu_02", shopId: "chiken_2", seq: 2, file: "chiken_2_menu_02.png" },
  { id: "chiken_2_menu_03", shopId: "chiken_2", seq: 3, file: "chiken_2_menu_03.png" },
  { id: "chiken_2_menu_04", shopId: "chiken_2", seq: 4, file: "chiken_2_menu_04.png" },
  { id: "chiken_2_menu_05", shopId: "chiken_2", seq: 5, file: "chiken_2_menu_05.png" },
  { id: "chiken_2_menu_06", shopId: "chiken_2", seq: 6, file: "chiken_2_menu_06.png" },
  { id: "chiken_3_menu_01", shopId: "chiken_3", seq: 1, file: "chiken_3_menu_01.png" },
  { id: "chiken_3_menu_02", shopId: "chiken_3", seq: 2, file: "chiken_3_menu_02.png" },
  { id: "chiken_3_menu_03", shopId: "chiken_3", seq: 3, file: "chiken_3_menu_03.png" },
  { id: "chiken_3_menu_04", shopId: "chiken_3", seq: 4, file: "chiken_3_menu_04.png" },
  { id: "chiken_3_menu_05", shopId: "chiken_3", seq: 5, file: "chiken_3_menu_05.png" },
  { id: "chiken_4_menu_01", shopId: "chiken_4", seq: 1, file: "chiken_4_menu_01_menu_01.png" },
  { id: "chiken_4_menu_02", shopId: "chiken_4", seq: 2, file: "chiken_4_menu_02_menu_02.png" },
  { id: "chiken_4_menu_03", shopId: "chiken_4", seq: 3, file: "chiken_4_menu_03_menu_03.png" },
  { id: "chiken_4_menu_04", shopId: "chiken_4", seq: 4, file: "chiken_4_menu_04_menu_04.png" },
  { id: "chiken_4_menu_05", shopId: "chiken_4", seq: 5, file: "chiken_4_menu_05_menu_05.png" },
  { id: "chiken_4_menu_06", shopId: "chiken_4", seq: 6, file: "chiken_4_menu_06_menu_06.png" },
  { id: "chiken_5_menu_01", shopId: "chiken_5", seq: 1, file: "chiken_5_menu_01.png" },
  { id: "chiken_5_menu_02", shopId: "chiken_5", seq: 2, file: "chiken_5_menu_02.png" },
  { id: "chiken_5_menu_03", shopId: "chiken_5", seq: 3, file: "chiken_5_menu_03.png" },
  { id: "chiken_5_menu_04", shopId: "chiken_5", seq: 4, file: "chiken_5_menu_04.png" },
  { id: "chiken_5_menu_05", shopId: "chiken_5", seq: 5, file: "chiken_5_menu_05.png" },
  { id: "chiken_5_menu_06", shopId: "chiken_5", seq: 6, file: "chiken_5_menu_06.png" },
  { id: "chiken_5_menu_07", shopId: "chiken_5", seq: 7, file: "chiken_5_menu_07.png" },
  { id: "chiken_5_menu_08", shopId: "chiken_5", seq: 8, file: "chiken_5_menu_08.png" },
  { id: "chiken_6_menu_01", shopId: "chiken_6", seq: 1, file: "chiken_6_menu_01.png" },
  { id: "chiken_6_menu_02", shopId: "chiken_6", seq: 2, file: "chiken_6_menu_02.png" },
  { id: "chiken_6_menu_03", shopId: "chiken_6", seq: 3, file: "chiken_6_menu_03.png" },
  { id: "chiken_6_menu_04", shopId: "chiken_6", seq: 4, file: "chiken_6_menu_04.png" },
  { id: "chiken_6_menu_05", shopId: "chiken_6", seq: 5, file: "chiken_6_menu_05.png" },
  { id: "chiken_7_menu_01", shopId: "chiken_7", seq: 1, file: "chiken_7_menu_01.png" },
  { id: "chiken_7_menu_02", shopId: "chiken_7", seq: 2, file: "chiken_7_menu_02.png" },
  { id: "chiken_7_menu_03", shopId: "chiken_7", seq: 3, file: "chiken_7_menu_03.png" },
  { id: "chiken_7_menu_04", shopId: "chiken_7", seq: 4, file: "chiken_7_menu_04.png" },
  { id: "chiken_7_menu_05", shopId: "chiken_7", seq: 5, file: "chiken_7_menu_05.png" },
  { id: "chiken_7_menu_06", shopId: "chiken_7", seq: 6, file: "chiken_7_menu_06.png" },
  { id: "chiken_7_menu_07", shopId: "chiken_7", seq: 7, file: "chiken_7_menu_07.png" },
  { id: "chiken_8_menu_01", shopId: "chiken_8", seq: 1, file: "chiken_8_menu_01.png" },
  { id: "chiken_8_menu_02", shopId: "chiken_8", seq: 2, file: "chiken_8_menu_02.png" },
  { id: "chiken_8_menu_03", shopId: "chiken_8", seq: 3, file: "chiken_8_menu_03.png" },
  { id: "chiken_8_menu_04", shopId: "chiken_8", seq: 4, file: "chiken_8_menu_04.png" },
  // chinese
  { id: "chinese_1_menu_01", shopId: "chinese_1", seq: 1, file: "chinese_1_menu_01.png" },
  { id: "chinese_1_menu_02", shopId: "chinese_1", seq: 2, file: "chinese_1_menu_02.png" },
  { id: "chinese_1_menu_03", shopId: "chinese_1", seq: 3, file: "chinese_1_menu_03.png" },
  { id: "chinese_1_menu_04", shopId: "chinese_1", seq: 4, file: "chinese_1_menu_04.png" },
  { id: "chinese_1_menu_05", shopId: "chinese_1", seq: 5, file: "chinese_1_menu_05.png" },
  { id: "chinese_1_menu_06", shopId: "chinese_1", seq: 6, file: "chinese_1_menu_06.png" },
  { id: "chinese_1_menu_07", shopId: "chinese_1", seq: 7, file: "chinese_1_menu_07.png" },
  { id: "chinese_2_menu_01", shopId: "chinese_2", seq: 1, file: "chinese_2_menu_01.png" },
  { id: "chinese_2_menu_02", shopId: "chinese_2", seq: 2, file: "chinese_2_menu_02.png" },
  { id: "chinese_2_menu_03", shopId: "chinese_2", seq: 3, file: "chinese_2_menu_03.png" },
  { id: "chinese_2_menu_04", shopId: "chinese_2", seq: 4, file: "chinese_2_menu_04.png" },
  { id: "chinese_2_menu_05", shopId: "chinese_2", seq: 5, file: "chinese_2_menu_05.png" },
  { id: "chinese_2_menu_06", shopId: "chinese_2", seq: 6, file: "chinese_2_menu_06.png" },
  { id: "chinese_3_menu_01", shopId: "chinese_3", seq: 1, file: "chinese_3_menu_01.png" },
  { id: "chinese_3_menu_02", shopId: "chinese_3", seq: 2, file: "chinese_3_menu_02.png" },
  { id: "chinese_3_menu_03", shopId: "chinese_3", seq: 3, file: "chinese_3_menu_03.png" },
  { id: "chinese_4_menu_01", shopId: "chinese_4", seq: 1, file: "chinese_4_menu_01.png" },
  { id: "chinese_4_menu_02", shopId: "chinese_4", seq: 2, file: "chinese_4_menu_02.png" },
  { id: "chinese_4_menu_03", shopId: "chinese_4", seq: 3, file: "chinese_4_menu_03.png" },
  { id: "chinese_4_menu_04", shopId: "chinese_4", seq: 4, file: "chinese_4_menu_04.png" },
  { id: "chinese_4_menu_05", shopId: "chinese_4", seq: 5, file: "chinese_4_menu_05.png" },
  { id: "chinese_4_menu_06", shopId: "chinese_4", seq: 6, file: "chinese_4_menu_06.png" },
  { id: "chinese_5_menu_01", shopId: "chinese_5", seq: 1, file: "chinese_5_menu_01.png" },
  { id: "chinese_5_menu_02", shopId: "chinese_5", seq: 2, file: "chinese_5_menu_02.png" },
  { id: "chinese_5_menu_03", shopId: "chinese_5", seq: 3, file: "chinese_5_menu_03.png" },
  { id: "chinese_5_menu_04", shopId: "chinese_5", seq: 4, file: "chinese_5_menu_04.png" },
  { id: "chinese_5_menu_05", shopId: "chinese_5", seq: 5, file: "chinese_5_menu_05.png" },
  // hansik
  { id: "hansik_1_menu_01", shopId: "hansik_1", seq: 1, file: "hansik_1_menu_01.png" },
  { id: "hansik_1_menu_02", shopId: "hansik_1", seq: 2, file: "hansik_1_menu_02.png" },
  { id: "hansik_1_menu_03", shopId: "hansik_1", seq: 3, file: "hansik_1_menu_03.png" },
  { id: "hansik_1_menu_04", shopId: "hansik_1", seq: 4, file: "hansik_1_menu_04.png" },
  { id: "hansik_1_menu_05", shopId: "hansik_1", seq: 5, file: "hansik_1_menu_05.png" },
  { id: "hansik_1_menu_06", shopId: "hansik_1", seq: 6, file: "hansik_1_menu_06.png" },
  { id: "hansik_1_menu_07", shopId: "hansik_1", seq: 7, file: "hansik_1_menu_07.png" },
  { id: "hansik_1_menu_08", shopId: "hansik_1", seq: 8, file: "hansik_1_menu_08.png" },
  { id: "hansik_2_menu_01", shopId: "hansik_2", seq: 1, file: "hansik_2_menu_01.png" },
  { id: "hansik_2_menu_02", shopId: "hansik_2", seq: 2, file: "hansik_2_menu_02.png" },
  { id: "hansik_2_menu_03", shopId: "hansik_2", seq: 3, file: "hansik_2_menu_03.png" },
  { id: "hansik_2_menu_04", shopId: "hansik_2", seq: 4, file: "hansik_2_menu_04.png" },
  { id: "hansik_2_menu_05", shopId: "hansik_2", seq: 5, file: "hansik_2_menu_05.png" },
  { id: "hansik_2_menu_06", shopId: "hansik_2", seq: 6, file: "hansik_2_menu_06.png" },
  { id: "hansik_3_menu_01", shopId: "hansik_3", seq: 1, file: "hansik_3_menu_01.png" },
  { id: "hansik_3_menu_02", shopId: "hansik_3", seq: 2, file: "hansik_3_menu_02.png" },
  { id: "hansik_3_menu_03", shopId: "hansik_3", seq: 3, file: "hansik_3_menu_03.png" },
  { id: "hansik_3_menu_04", shopId: "hansik_3", seq: 4, file: "hansik_3_menu_04.png" },
  { id: "hansik_3_menu_05", shopId: "hansik_3", seq: 5, file: "hansik_3_menu_05.png" },
  { id: "hansik_3_menu_06", shopId: "hansik_3", seq: 6, file: "hansik_3_menu_06.png" },
  { id: "hansik_4_menu_01", shopId: "hansik_4", seq: 1, file: "hansik_4_menu_01.png" },
  { id: "hansik_4_menu_02", shopId: "hansik_4", seq: 2, file: "hansik_4_menu_02.png" },
  { id: "hansik_4_menu_03", shopId: "hansik_4", seq: 3, file: "hansik_4_menu_03.png" },
  { id: "hansik_4_menu_04", shopId: "hansik_4", seq: 4, file: "hansik_4_menu_04.png" },
  { id: "hansik_4_menu_05", shopId: "hansik_4", seq: 5, file: "hansik_4_menu_05.png" },
  { id: "hansik_5_menu_01", shopId: "hansik_5", seq: 1, file: "hansik_5_menu_01.png" },
  { id: "hansik_5_menu_02", shopId: "hansik_5", seq: 2, file: "hansik_5_menu_02.png" },
  { id: "hansik_5_menu_03", shopId: "hansik_5", seq: 3, file: "hansik_5_menu_03.png" },
  { id: "hansik_5_menu_04", shopId: "hansik_5", seq: 4, file: "hansik_5_menu_04.png" },
  { id: "hansik_5_menu_05", shopId: "hansik_5", seq: 5, file: "hansik_5_menu_05.png" },
  // pizza
  { id: "pizza_1_menu_01", shopId: "pizza_1", seq: 1, file: "pizza_1_menu_01.png" },
  { id: "pizza_1_menu_02", shopId: "pizza_1", seq: 2, file: "pizza_1_menu_02.png" },
  { id: "pizza_1_menu_03", shopId: "pizza_1", seq: 3, file: "pizza_1_menu_03.png" },
  { id: "pizza_1_menu_04", shopId: "pizza_1", seq: 4, file: "pizza_1_menu_04.png" },
  { id: "pizza_1_menu_05", shopId: "pizza_1", seq: 5, file: "pizza_1_menu_05.png" },
  { id: "pizza_2_menu_01", shopId: "pizza_2", seq: 1, file: "pizza_2_menu_01.png" },
  { id: "pizza_2_menu_02", shopId: "pizza_2", seq: 2, file: "pizza_2_menu_02.png" },
  { id: "pizza_2_menu_03", shopId: "pizza_2", seq: 3, file: "pizza_2_menu_03.png" },
  // salad
  { id: "salad_1_menu_01", shopId: "salad_1", seq: 1, file: "salad_1_menu_01.png" },
  { id: "salad_1_menu_02", shopId: "salad_1", seq: 2, file: "salad_1_menu_02.png" },
  { id: "salad_1_menu_03", shopId: "salad_1", seq: 3, file: "salad_1_menu_03.png" },
  { id: "salad_1_menu_04", shopId: "salad_1", seq: 4, file: "salad_1_menu_04.png" },
  { id: "salad_1_menu_05", shopId: "salad_1", seq: 5, file: "salad_1_menu_05.png" },
  // sandwitch
  { id: "sandwitch_1_menu_01", shopId: "sandwitch_1", seq: 1, file: "sandwitch_1_menu_01.png" },
  { id: "sandwitch_1_menu_02", shopId: "sandwitch_1", seq: 2, file: "sandwitch_1_menu_02.png" },
  { id: "sandwitch_1_menu_03", shopId: "sandwitch_1", seq: 3, file: "sandwitch_1_menu_03.png" },
  { id: "sandwitch_1_menu_04", shopId: "sandwitch_1", seq: 4, file: "sandwitch_1_menu_04.png" },
  { id: "sandwitch_1_menu_05", shopId: "sandwitch_1", seq: 5, file: "sandwitch_1_menu_05.png" },
  { id: "sandwitch_1_menu_06", shopId: "sandwitch_1", seq: 6, file: "sandwitch_1_menu_06.png" },
  { id: "sandwitch_1_menu_07", shopId: "sandwitch_1", seq: 7, file: "sandwitch_1_menu_07.png" },
  // sushi
  { id: "sushi_1_menu_01", shopId: "sushi_1", seq: 1, file: "sushi_1_menu_01.png" },
  { id: "sushi_1_menu_02", shopId: "sushi_1", seq: 2, file: "sushi_1_menu_02.png" },
  { id: "sushi_1_menu_03", shopId: "sushi_1", seq: 3, file: "sushi_1_menu_03.png" },
  { id: "sushi_1_menu_04", shopId: "sushi_1", seq: 4, file: "sushi_1_menu_04.png" },
  { id: "sushi_1_menu_05", shopId: "sushi_1", seq: 5, file: "sushi_1_menu_05.png" },
  { id: "sushi_2_menu_01", shopId: "sushi_2", seq: 1, file: "sushi_2_menu_01.png" },
  { id: "sushi_2_menu_02", shopId: "sushi_2", seq: 2, file: "sushi_2_menu_02.png" },
  { id: "sushi_2_menu_03", shopId: "sushi_2", seq: 3, file: "sushi_2_menu_03.png" },
  { id: "sushi_2_menu_04", shopId: "sushi_2", seq: 4, file: "sushi_2_menu_04.png" },
  { id: "sushi_2_menu_05", shopId: "sushi_2", seq: 5, file: "sushi_2_menu_05.png" },
];

// --- 가게 대표이미지 ---

export function getShopImage(id) {
  const img = SHOP_IMAGES.find(s => s.id === id);
  return img ? SHOP_IMAGE_PATH + img.file : null;
}

export function getShopImageByName(name) {
  const img = SHOP_IMAGES.find(s => s.name === name);
  return img ? SHOP_IMAGE_PATH + img.file : null;
}

export function getAllShopImages() {
  return SHOP_IMAGES.map(s => ({ ...s, url: SHOP_IMAGE_PATH + s.file }));
}

// --- 메뉴이미지 (독립 접근) ---

export function getMenuImage(id) {
  const img = MENU_IMAGES.find(m => m.id === id);
  return img ? MENU_IMAGE_PATH + img.file : null;
}

export function getMenusByShop(shopId) {
  return MENU_IMAGES
    .filter(m => m.shopId === shopId)
    .sort((a, b) => a.seq - b.seq)
    .map(m => ({ ...m, url: MENU_IMAGE_PATH + m.file }));
}

export function getAllMenuImages() {
  return MENU_IMAGES.map(m => ({ ...m, url: MENU_IMAGE_PATH + m.file }));
}

export function getRandomMenuImages(count = 5) {
  const shuffled = [...MENU_IMAGES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(m => ({ ...m, url: MENU_IMAGE_PATH + m.file }));
}

// --- 카테고리별 조회 ---

export function getShopImagesByCategory(category) {
  return SHOP_IMAGES
    .filter(s => s.category === category)
    .map(s => ({ ...s, url: SHOP_IMAGE_PATH + s.file }));
}

export function getCategories() {
  return [...new Set(SHOP_IMAGES.map(s => s.category))];
}

// --- 이미지 스타일 (height 기준 리사이징 + 센터 크롭) ---
// 원본은 직사각형(가로>세로). 표시 영역에 맞춰 세로 기준 리사이징, 좌우 센터 크롭.
// width/height: 표시할 영역 크기. 가로형이면 width>height, 정사각형이면 width===height.
export function imageStyle(width, height, borderRadius = 8) {
  return {
    width,
    height,
    objectFit: "cover",
    objectPosition: "center",
    borderRadius,
  };
}

// --- 통합 조회 (가게 + 메뉴 한번에) ---

export function getShopWithMenus(shopId) {
  const shop = SHOP_IMAGES.find(s => s.id === shopId);
  if (!shop) return null;
  return {
    ...shop,
    url: SHOP_IMAGE_PATH + shop.file,
    menus: getMenusByShop(shopId),
  };
}
