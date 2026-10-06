import { useState } from "react";
import { TopBanner } from "../components/TopBanner.jsx";
import { VerticalLauncherRow } from "../components/VerticalLauncher.jsx";
import { FoodCategorySwimlane } from "../components/FoodCategory.jsx";
import { QCSwimlaneRow } from "../components/QCSwimlane.jsx";
import { ShopListCard } from "../components/ShopListCard.jsx";
import { RollingBanner } from "../components/RollingBanner.jsx";
import { DiscountBrandSwimlane } from "../components/DiscountBrandSwimlane.jsx";
import { ReorderCard, ReorderRow } from "../components/ReorderShortcut.jsx";
import { DiscountRankingRow } from "../components/DiscountRanking.jsx";
import { MenuRecommendRow } from "../components/MenuRecommendSwimlane.jsx";
import { GrocerySwimlane } from "../components/GrocerySwimlane.jsx";
import { QCProductSwimlane } from "../components/QCProductSwimlane.jsx";
import { getShopLogo } from "../shopLogos";
import { getShopImage } from "../shopImages";

// ─── Global Home Simulator ──────────────────────────────────────────────────

// 글로벌홈 전용 배경색 토큰 (예외 처리, 한번에 수정 가능)
const GLOBAL_HOME_BG = "#f8f8f8";

const SHOPLIST_CARDS = [
  {
    shopName: "본도시락-역삼역", shopId: "hansik_1", logoSrc: getShopLogo("bon"),
    rating: 4.8, reviewCount: 1567, deliveryTime: "30~45분", deliveryFee: "1,900~2,900원",
    distance: "372m", minOrder: "12,000원", benefitType: "ypx_free_delivery",
    bottomBadges: [
      { text: "배달앱 최저가", colorStyle: "gray", showLeftIcon: true, leftIconName: "ic_lowest" },
      { text: "스페셜적립", colorStyle: "gray", showLeftIcon: true, leftIconName: "ic_specialpoint" },
      { text: "1,000원 추가할인", colorStyle: "secondary" },
    ],
  },
  {
    shopName: "서브웨이 서초점", shopId: "sandwitch_1", logoSrc: getShopLogo("subway"),
    rating: 4.5, reviewCount: 892, deliveryTime: "25~40분", deliveryFee: "0원~2,000원",
    distance: "0.8km", minOrder: "10,000원", benefitType: "ypx_free_delivery",
    bottomBadges: [
      { text: "즉시할인", colorStyle: "secondary" },
      { text: "최대 5% 적립", colorStyle: "secondary" },
    ],
  },
  {
    shopName: "피자헛 역삼점", shopId: "pizza_1", logoSrc: getShopLogo("pizzahut"),
    rating: 4.2, reviewCount: 456, deliveryTime: "35~50분", deliveryFee: "0원",
    distance: "2.1km", minOrder: "15,000원", benefitType: "single_discount", isAd: true,
  },
];

const BRAND_ITEMS = [
  { shopName: "교촌치킨", logoSrc: getShopLogo("kyochon"), benefit: "최대 3,000원 할인", badges: ["lowest"] },
  { shopName: "BBQ", logoSrc: getShopLogo("bbq"), benefit: "2,000원 즉시할인", badges: ["specialpoint"] },
  { shopName: "BHC", logoSrc: getShopLogo("bhc"), benefit: "무료배달 + 적립 5%", badges: ["menu_discount"] },
  { shopName: "피자헛", logoSrc: getShopLogo("pizzahut"), benefit: "라지 피자 50%", badges: ["lowest", "specialpoint"] },
  { shopName: "도미노피자", logoSrc: getShopLogo("domino"), benefit: "1+1 이벤트", badges: ["recommend"] },
  { shopName: "맘스터치", logoSrc: getShopLogo("moms"), benefit: "무료배달" },
  { shopName: "서브웨이", logoSrc: getShopLogo("subway"), benefit: "최대 5,000원 할인", badges: ["lowest", "specialpoint", "menu_discount", "recommend"] },
  { shopName: "맥도날드", logoSrc: getShopLogo("mcdonalds"), benefit: "배달비 0원" },
  { shopName: "청년피자", logoSrc: getShopLogo("youngman"), benefit: "최대 15% 적립", badges: ["specialpoint"] },
];

const RANKING_CARDS = [
  { thumbSrc: getShopImage("hansik_1"), shopName: "한솔도시락", shopLogoSrc: "/assets/badge-icons/ypx_symbol.png", menuName: "제육볶음", discountRate: "63", salePrice: "11,500", originalPrice: "20,000", pointback: "1,150원", remaining: "3개 남음", timer: "04:59:59", rankingBadge: "한식 할인 1위" },
  { thumbSrc: getShopImage("chiken_1"), shopName: "교촌치킨", shopLogoSrc: "/assets/badge-icons/ypx_symbol.png", menuName: "허니콤보", discountRate: "46", salePrice: "11,254", originalPrice: "20,000", pointback: "1,400원", remaining: "5개 남음", timer: "04:59:59", rankingBadge: "치킨 할인 1위" },
  { thumbSrc: getShopImage("pizza_1"), shopName: "피자헛", shopLogoSrc: "/assets/badge-icons/ypx_symbol.png", menuName: "슈퍼슈프림", discountRate: "40", salePrice: "14,900", originalPrice: "24,900", pointback: "900원", timer: "04:59:59", rankingBadge: "피자 할인 1위" },
];

const MENU_RECOMMEND_CARDS = [
  { thumbSrc: getShopImage("hansik_1"), logoSrc: getShopLogo("bon"), shopLogoSrc: "/assets/badge-icons/ypx_symbol.png", shopName: "공리특허짬뽕-논현점", menuName: "탕짜면", price: "13,000", pointback: "390원", deliveryTime: "12~23분", deliveryFee: "무료" },
  { thumbSrc: getShopImage("sandwitch_1"), logoSrc: getShopLogo("subway"), shopLogoSrc: "/assets/badge-icons/ypx_symbol.png", shopName: "차고집칡냉면&돈까스", menuName: "물냉면", price: "11,000", pointback: "330원", deliveryTime: "42~57분", deliveryFee: "무료" },
  { thumbSrc: getShopImage("chiken_1"), logoSrc: getShopLogo("kyochon"), shopLogoSrc: "/assets/badge-icons/ypx_symbol.png", shopName: "봉춘찜닭-강남점", menuName: "뼈없는찜닭", price: "28,000", pointback: "840원", deliveryTime: "17~27분", deliveryFee: "무료" },
  { thumbSrc: getShopImage("pizza_1"), logoSrc: getShopLogo("pizzahut"), shopLogoSrc: "/assets/badge-icons/ypx_symbol.png", shopName: "맘스터치-강남대로점", menuName: "매직풍싸이버거 세트", price: "11,500", pointback: "309원", deliveryTime: "22~32분", deliveryFee: "무료" },
];

const GROCERY_ITEMS = [
  { label: "이마트슈퍼", bgColor: "#ffb41e", badge: "7,000원 쿠폰" },
  { label: "GS더프레시", bgColor: "#04563e", badge: "5% 할인" },
  { label: "홈플러스", bgColor: "#e31837" },
  { label: "롯데마트", bgColor: "#d03021", badge: "최대 5,000원" },
  { label: "쿠팡", bgColor: "#3a6fd8" },
  { label: "오아시스", bgColor: "#168046" },
  { label: "마켓컬리", bgColor: "#5F3E9B" },
];

const QC_PRODUCTS = [
  { thumbSrc: getShopImage("hansik_1"), productName: "[KF365] 실속바나나 1kg", price: "2,900" },
  { thumbSrc: getShopImage("sandwitch_1"), productName: "[KF365] 신선 계란 30구", price: "5,900", originalPrice: "7,900", discountRate: "25" },
  { thumbSrc: getShopImage("chiken_1"), productName: "코카콜라 190ml 6캔", price: "3,480", promoBadge: "2+1" },
  { thumbSrc: getShopImage("pizza_1"), productName: "서울우유 1L", price: "2,680" },
  { thumbSrc: getShopImage("hansik_1"), productName: "CJ 햇반 210g 12개", price: "11,980", originalPrice: "14,900", discountRate: "20" },
  { thumbSrc: getShopImage("sandwitch_1"), productName: "풀무원 두부 300g", price: "1,980" },
];

function SectionDivider() {
  return <div style={{ height: 8, background: "#f0f0f0" }} />;
}

export default function GlobalHomeSection() {
  const [theme, setTheme] = useState("dark");

  return (
    <div style={{ padding: "24px 0" }}>
      {/* Theme toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "#999" }}>Header theme:</span>
        {["dark", "light"].map(t => (
          <button key={t} onClick={() => setTheme(t)}
            style={{ padding: "4px 12px", borderRadius: 20,
              border: `1.5px solid ${theme === t ? "#0C74E4" : "#e0e0e0"}`,
              background: theme === t ? "#0C74E4" : "#fff",
              color: theme === t ? "#fff" : "#666",
              fontSize: 10, cursor: "pointer" }}>{t}</button>
        ))}
      </div>

      {/* Phone frame */}
      <div style={{
        width: 390, height: 844,
        borderRadius: 40, overflow: "hidden",
        border: "3px solid #333",
        background: GLOBAL_HOME_BG,
        position: "relative",
      }}>
        <div style={{
          width: "100%", height: "100%",
          overflowY: "auto", overflowX: "hidden",
          scrollbarWidth: "none",
        }}>
          {/* 1. TopBanner */}
          <TopBanner
            theme={theme}
            bgColor={theme === "dark" ? "#1a1a2e" : "#E8F0FF"}
            bgImage="/assets/banners/topbanner_bg.png"
            leftSrc="/assets/banners/topbanner_left.png"
            rightSrc="/assets/banners/topbanner_right.png"
          />

          {/* 2. Vertical Launcher */}
          <div style={{ background: "#fff" }}>
            <VerticalLauncherRow items={[
              { id: "yogiplus", img: "VerticalLauncher_44x44_요기더적립.png", label: "요기더+적립" },
              { id: "takeout", img: "VerticalLauncher_44x44_포장주문.png", label: "포장", badge: "7% 할인" },
              { id: "gift", img: "VerticalLauncher_44x44_선물하기.png", label: "선물하기" },
              { id: "rank", img: "VerticalLauncher_44x44_할인랭킹.png", label: "할인랭킹" },
              { id: "robot", img: "VerticalLauncher_44x44_로봇배달.png", label: "로봇배달" },
            ]} />
          </div>

          {/* 3. Food Category — bg white + 상하 보더(gray50) 컴포넌트 내장 */}
          <div style={{ background: "#fff" }}>
            <FoodCategorySwimlane />
          </div>

          <SectionDivider />

          {/* 4. QC Swimlane (런처) */}
          <div style={{ background: "#fff" }}>
            <QCSwimlaneRow />
          </div>

          <SectionDivider />

          {/* 5. RollingBanner */}
          <RollingBanner
            bannerType="nukki2"
            variant="full"
            theme="blue"
            title1="매일 하루종일 특가"
            title2="+최대 5% 적립까지!"
            description="멈추지 않는 선착순 할인!"
            badges={[{ icon: "ic_lowest_flat", text: "배달앱 최저가" }, { icon: "ic_specialpoint_flat", text: "스페셜적립", small: true }]}
            customBadgeLabel="선착순"
          />

          <SectionDivider />

          {/* 6. 재주문 숏컷 */}
          <div style={{ background: "#fff" }}>
            <ReorderRow title="재주문 숏컷">
              <ReorderCard shopName="본도시락-역삼역" thumbSrc={getShopImage("hansik_1")} logoSrc={getShopLogo("bon")} rating={4.8} reviewCount={1567} deliveryFee="0원" orderCount="3회 주문" previousMenu="고추장불고기x1, 된장찌개x1" benefitType="ypx_free" badges={["lowest", "specialpoint"]} />
              <ReorderCard shopName="교촌치킨 서초점" thumbSrc={getShopImage("chiken_1")} rating={4.6} reviewCount={2103} orderCount="5회 주문" previousMenu="허니콤보x1, 레드콤보x1" benefitType="single_discount" badges={["discount"]} orderType="takeout" walkTime="3분" />
              <ReorderCard shopName="서브웨이 서초점" thumbSrc={getShopImage("sandwitch_1")} logoSrc={getShopLogo("subway")} rating={4.5} reviewCount={892} deliveryFee="0원" orderCount="8회 주문" previousMenu="에그마요x2, 쿠키x1" badges={["cashback"]} />
            </ReorderRow>
          </div>

          <SectionDivider />

          {/* 7. 메뉴 추천 */}
          <div style={{ background: "#fff" }}>
            <MenuRecommendRow title="추천 메뉴" cards={MENU_RECOMMEND_CARDS} />
          </div>

          <SectionDivider />

          {/* 8. 할인 브랜드 캐러셀 */}
          <div style={{ background: "#fff" }}>
            <DiscountBrandSwimlane title="내 주변 할인중인 브랜드" brands={BRAND_ITEMS} />
          </div>

          <SectionDivider />

          {/* 9. 할인랭킹 */}
          <DiscountRankingRow cards={RANKING_CARDS} promoImageSrc="/assets/banners/discount_ranking_hero.png" />

          <SectionDivider />

          {/* 10. 우리동네 장보기·쇼핑 */}
          <div style={{ background: "#fff" }}>
            <GrocerySwimlane items={GROCERY_ITEMS} />
          </div>

          <SectionDivider />

          {/* 11. QC 상품 */}
          <div style={{ background: "#fff" }}>
            <QCProductSwimlane title="샤인머스캣 2천원 할인" subtitle="알고 먹으면 더 맛있는!" dateRange="2026.10.01~2026.10.15" products={QC_PRODUCTS} />
          </div>

          <SectionDivider />

          {/* 12. ShopList Cards */}
          <div style={{ background: "#fff" }}>
            {SHOPLIST_CARDS.map((card, i) => (
              <ShopListCard key={i} {...card} showMenuThumbnails />
            ))}
          </div>

          {/* Bottom spacer */}
          <div style={{ height: 80 }} />
        </div>
      </div>
    </div>
  );
}
