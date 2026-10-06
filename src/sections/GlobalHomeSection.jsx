import { useState } from "react";
import { TopBanner } from "../components/TopBanner.jsx";
import { VerticalLauncherRow } from "../components/VerticalLauncher.jsx";
import { FoodCategorySwimlane } from "../components/FoodCategory.jsx";
import { QCSwimlaneRow } from "../components/QCSwimlane.jsx";
import { SwimlaneCard, SwimlaneRow } from "../components/SwimlaneCard.jsx";
import { ShopListCard } from "../components/ShopListCard.jsx";
import { RollingBanner } from "../components/RollingBanner.jsx";
import { DiscountBrandSwimlane } from "../components/DiscountBrandSwimlane.jsx";
import { getShopLogo } from "../shopLogos";
import { getShopImage } from "../shopImages";

// ─── Global Home Simulator ──────────────────────────────────────────────────
// Figma: 리뉴얼-2026 > node 13497:360471 (2053)
// 글로벌홈 전체 구성을 하나의 스크롤 페이지로 조합

const SWIMLANE_SHOPS = [
  { shopName: "본도시락", thumbSrc: getShopImage("hansik_1"), menuLabel: "고추장불고기", menuPrice: "8,500원", rating: 4.8, reviewCount: 1567, deliveryTime: "20~35분", deliveryFee: "0원", distance: "372m", benefitType: "ypx_free", badges: ["lowest", "specialpoint"] },
  { shopName: "서브웨이", thumbSrc: getShopImage("sandwitch_1"), menuLabel: "에그마요", menuPrice: "6,900원", rating: 4.5, reviewCount: 892, deliveryTime: "25~40분", deliveryFee: "0원", distance: "0.8km", badges: ["discount"] },
  { shopName: "피자헛", thumbSrc: getShopImage("pizza_1"), menuLabel: "슈퍼슈프림", menuPrice: "24,900원", rating: 4.2, reviewCount: 456, deliveryTime: "35~50분", deliveryFee: "0원", distance: "2.1km", benefitType: "single_discount", badges: ["ranking"] },
  { shopName: "교촌치킨", thumbSrc: getShopImage("chiken_1"), menuLabel: "허니콤보", menuPrice: "19,000원", rating: 4.6, reviewCount: 2103, deliveryTime: "40~55분", deliveryFee: "2,000원", distance: "1.2km", badges: ["lowest"] },
  { shopName: "BHC", thumbSrc: getShopImage("chiken_2"), menuLabel: "뿌링클", menuPrice: "18,000원", rating: 4.4, reviewCount: 731, deliveryTime: "35~50분", deliveryFee: "1,500원", distance: "0.5km", isAd: true },
];

const SHOPLIST_CARDS = [
  {
    shopName: "본도시락-역삼역", shopId: "hansik_1", logoSrc: getShopLogo("bon"),
    rating: 4.8, reviewCount: 1567, deliveryTime: "30~45분", deliveryFee: "1,900~2,900원",
    distance: "372m", minOrder: "12,000원", benefitType: "ypx_free_delivery",
    bottomBadges: [
      { text: "배달앱 최저가", colorStyle: "gray", showLeftIcon: true, leftIconName: "ic_lowest" },
      { text: "스페셜적립", colorStyle: "gray", showLeftIcon: true, leftIconName: "ic_specialpoint" },
      { text: "한식 할인 1위", colorStyle: "gray", showLeftIcon: true, leftIconName: "ic_bpr" },
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
];

function SectionDivider() {
  return <div style={{ height: 8, background: "#f2f2f2" }} />;
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
        background: "#fff",
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
            title="매일 하루종일 특가"
            subtitle="멈추지 않는 선착순 할인!"
          />

          {/* 2. Vertical Launcher */}
          <VerticalLauncherRow items={[
            { id: "yogiplus", img: "VerticalLauncher_44x44_요기더적립.png", label: "요기더+적립" },
            { id: "takeout", img: "VerticalLauncher_44x44_포장주문.png", label: "포장", badge: "7% 할인" },
            { id: "gift", img: "VerticalLauncher_44x44_선물하기.png", label: "선물하기" },
            { id: "rank", img: "VerticalLauncher_44x44_할인랭킹.png", label: "할인랭킹" },
            { id: "robot", img: "VerticalLauncher_44x44_로봇배달.png", label: "로봇배달" },
          ]} />

          {/* 2.5. Food Category */}
          <FoodCategorySwimlane />

          <SectionDivider />

          {/* 2.7. QC Swimlane */}
          <QCSwimlaneRow />

          <SectionDivider />

          {/* 3. RollingBanner (롤링 배너) */}
          <div style={{ padding: 16 }}>
            <RollingBanner
              bannerType="type1"
              bgColor="#8fc7ff"
              title1="무한적립"
              title2="주문할수록 쌓여요"
              description="최대 15% 적립"
              badges={[{ icon: "ic_specialpoint_flat", text: "스페셜적립" }]}
              customBadgeLabel="선착순"
            />
          </div>

          <SectionDivider />

          {/* 4. 맞춤 추천 Swimlane */}
          <div style={{ padding: 16 }}>
            <SwimlaneRow title="고객님 맞춤 추천 가게">
              {SWIMLANE_SHOPS.map((s, i) => <SwimlaneCard key={i} {...s} />)}
            </SwimlaneRow>
          </div>

          <SectionDivider />

          {/* 5. 할인 브랜드 */}
          <div style={{ padding: 16 }}>
            <DiscountBrandSwimlane
              title="내 주변 할인중인 브랜드"
              brands={BRAND_ITEMS}
            />
          </div>

          <SectionDivider />

          {/* 6. ShopList Cards */}
          <div style={{ padding: "0 0 16px" }}>
            {SHOPLIST_CARDS.map((card, i) => (
              <ShopListCard key={i} {...card} showMenuThumbnails />
            ))}
          </div>

          {/* Bottom spacer for BottomNav */}
          <div style={{ height: 80 }} />
        </div>
      </div>
    </div>
  );
}
