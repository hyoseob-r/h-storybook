import { useState, useRef } from "react";
import { colors } from "../tokens";

const CATEGORY_ITEMS = [
  { label: "전체",    img: "https://www.figma.com/api/mcp/asset/9d71c5a8-693a-4ab4-94f1-30f393fab5e6" },
  { label: "카페",    img: "https://www.figma.com/api/mcp/asset/9bd89d63-ea6c-4cdf-837f-d2aaf96a5398" },
  { label: "치킨",    img: "https://www.figma.com/api/mcp/asset/91772945-18ff-4634-a5fe-cda075a1ee45" },
  { label: "한식",    img: "https://www.figma.com/api/mcp/asset/a3610b34-be79-4dbd-b5b4-23b05acb8259" },
  { label: "중국집",  img: "https://www.figma.com/api/mcp/asset/dc5dc5d6-0445-404a-b8b5-6d6a78b51e2d" },
  { label: "회초밥",  img: "https://www.figma.com/api/mcp/asset/79c4968c-0443-4ce5-a387-43b7371e957d" },
  { label: "도시락죽", img: "https://www.figma.com/api/mcp/asset/c3925541-459c-4c04-95ce-6b5ff1cfdcc6" },
  { label: "아시안",  img: "https://www.figma.com/api/mcp/asset/7f3d7d2a-c284-45b1-8ca1-8ecb68bad041" },
  { label: "분식",    img: "https://www.figma.com/api/mcp/asset/376084f8-b164-4b5b-9239-39bcb8770272" },
  { label: "피자",    img: "https://www.figma.com/api/mcp/asset/43e75c9b-517d-4838-b724-08e96b77139a" },
  { label: "버거",    img: "https://www.figma.com/api/mcp/asset/392a78fc-287b-44f3-a5d9-0d1d560e31bb" },
  { label: "돈까스",  img: "https://www.figma.com/api/mcp/asset/5fa05041-81a8-478a-8565-5310e696be60" },
  { label: "찜탕",    img: "https://www.figma.com/api/mcp/asset/41a85033-b43e-4919-b995-1afd28fdd788" },
  { label: "고기구이", img: "https://www.figma.com/api/mcp/asset/7e9dc497-bf80-42a9-8190-71eaa24eb201" },
  { label: "샌드위치", img: "https://www.figma.com/api/mcp/asset/52011258-1da2-4dc6-a17e-ac8fcf811a3b" },
  { label: "샐러드",  img: "https://www.figma.com/api/mcp/asset/0f56ddc2-a20f-4493-9bc8-907cc768952e" },
];

const LOTTERIA = { label: "롯데리아", img: "https://www.figma.com/api/mcp/asset/95882b03-2ac7-44bd-a366-79ec8ae44dc7", badge: "2,000원 할인" };

const CATEGORY_REACT_CODE = `function CategoryRow() {
  const items = [
    { label: "전체" }, { label: "카페" }, { label: "치킨" },
    { label: "한식" }, { label: "중국집" }, { label: "회초밥" },
    { label: "도시락죽" }, { label: "아시안" },
  ];
  return (
    <div style={{ background: "#1a1a1a", width: 390, borderRadius: 16, overflow: "hidden" }}>
      {[0, 1].map(row => (
        <div key={row} style={{ display: "flex", gap: 4, padding: "16px 20px 8px", overflowX: "auto" }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 66 }}>
              <img src={item.img} width={52} height={52} style={{ borderRadius: 14 }} />
              <span style={{ fontSize: 14, color: "#333", fontFamily: "Roboto" }}>{item.label}</span>
            </div>
          ))}
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "center", paddingBottom: 8 }}>
        <div style={{ width: 56, height: 4, background: "#333", borderRadius: 2, position: "relative" }}>
          <div style={{ width: 24, height: 4, background: "#fff", borderRadius: 2 }} />
        </div>
      </div>
    </div>
  );
}`;

const CATEGORY_SWIFTUI_CODE = `struct CategoryRow: View {
  let items = ["전체","카페","치킨","한식","중국집","회초밥","도시락죽","아시안"]
  var body: some View {
    VStack(spacing: 4) {
      ForEach(0..<2) { row in
        ScrollView(.horizontal, showsIndicators: false) {
          HStack(spacing: 4) {
            ForEach(items, id: \\.self) { item in
              VStack(spacing: 4) {
                Image(item)
                  .resizable()
                  .frame(width: 52, height: 52)
                  .cornerRadius(14)
                Text(item)
                  .font(.system(size: 14))
                  .foregroundColor(Color(hex: "333333"))
              }
              .frame(width: 66)
            }
          }
          .padding(.horizontal, 20)
          .padding(.vertical, 16)
        }
      }
    }
    .background(Color(hex: "1a1a1a"))
    .cornerRadius(16)
    .frame(width: 390)
  }
}`;

const CATEGORY_COMPOSE_CODE = `@Composable
fun CategoryRow() {
  val items = listOf("전체","카페","치킨","한식","중국집","회초밥","도시락죽","아시안")
  Column(
    modifier = Modifier
      .background(Color(0xFF1A1A1A), RoundedCornerShape(16.dp))
      .width(390.dp)
  ) {
    repeat(2) {
      LazyRow(
        contentPadding = PaddingValues(horizontal = 20.dp, vertical = 16.dp),
        horizontalArrangement = Arrangement.spacedBy(4.dp)
      ) {
        items(items) { item ->
          Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.width(66.dp)
          ) {
            AsyncImage(
              model = item.imageUrl,
              contentDescription = item,
              modifier = Modifier.size(52.dp).clip(RoundedCornerShape(14.dp))
            )
            Text(text = item, fontSize = 14.sp, color = Color(0xFF333333))
          }
        }
      }
    }
  }
}`;

const CATEGORY_FLUTTER_CODE = `class CategoryRow extends StatelessWidget {
  final items = ['전체','카페','치킨','한식','중국집','회초밥','도시락죽','아시안'];
  @override
  Widget build(BuildContext context) {
    return Container(
      width: 390,
      decoration: BoxDecoration(
        color: Color(0xFF1A1A1A),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: List.generate(2, (row) =>
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: EdgeInsets.fromLTRB(20, 16, 20, 8),
            child: Row(
              children: items.map((item) => Container(
                width: 66,
                child: Column(children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(14),
                    child: Image.network(item.imageUrl, width: 52, height: 52, fit: BoxFit.cover),
                  ),
                  SizedBox(height: 4),
                  Text(item, style: TextStyle(fontSize: 14, color: Color(0xFF333333))),
                ]),
              )).toList(),
            ),
          ),
        ),
      ),
    );
  }
}`;

function FigmaSection() {
  const [platform, setPlatform] = useState("react");
  const [activeItem, setActiveItem] = useState(null);
  const [scrollRatio, setScrollRatio] = useState(0);
  const scrollRef = useRef(null);
  const dragRef = useRef({ down: false, startX: 0, scrollLeft: 0 });
  const row1 = CATEGORY_ITEMS.slice(0, 8);
  const row2 = [...CATEGORY_ITEMS.slice(8), LOTTERIA];

  const handleScroll = (e) => {
    const el = e.target;
    const ratio = el.scrollLeft / (el.scrollWidth - el.clientWidth) || 0;
    setScrollRatio(ratio);
  };

  const onMouseDown = (e) => {
    dragRef.current = { down: true, startX: e.pageX - scrollRef.current.offsetLeft, scrollLeft: scrollRef.current.scrollLeft };
    scrollRef.current.style.cursor = "grabbing";
  };
  const onMouseUp = () => {
    dragRef.current.down = false;
    scrollRef.current.style.cursor = "grab";
  };
  const onMouseMove = (e) => {
    if (!dragRef.current.down) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    scrollRef.current.scrollLeft = dragRef.current.scrollLeft - (x - dragRef.current.startX);
  };

  const codeMap = { react: CATEGORY_REACT_CODE, swiftui: CATEGORY_SWIFTUI_CODE, compose: CATEGORY_COMPOSE_CODE, flutter: CATEGORY_FLUTTER_CODE };
  const platforms = [
    { id: "react",   label: "React JSX" },
    { id: "swiftui", label: "SwiftUI" },
    { id: "compose", label: "Compose" },
    { id: "flutter", label: "Flutter" },
  ];

  const renderCategoryItem = (item, i) => (
    <div key={i}
      onClick={() => setActiveItem(activeItem === i ? null : i)}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", minWidth: "66px", cursor: "pointer", position: "relative" }}>
      <div style={{ width: "52px", height: "52px", borderRadius: "14px", overflow: "hidden", background: colors.gray.gray25.value, position: "relative" }}>
        <img src={item.img} width="52" height="52" style={{ objectFit: "cover", display: "block" }} onError={e => { e.target.style.display = "none"; }} />
        {item.badge && (
          <div style={{ position: "absolute", bottom: "0", left: "0", right: "0", background: "#FA0050", fontSize: "7px", fontWeight: 700, color: "#fff", textAlign: "center", padding: "2px 0", lineHeight: 1.2 }}>{item.badge}</div>
        )}
      </div>
      <span style={{ fontSize: "12px", color: colors.gray.gray800.value, fontFamily: "Roboto, sans-serif", whiteSpace: "nowrap" }}>{item.label}</span>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Component info */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ background: "#5028c8", color: "#fff", fontSize: "9px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px", letterSpacing: "0.08em" }}>FIGMA IMPORT</div>
        <div style={{ fontSize: "12px", color: "#888" }}>리뉴얼-2026 · Category · 390 × 200px</div>
      </div>

      {/* Preview */}
      <div>
        <div style={{ fontSize: "11px", color: "#aaa", marginBottom: "10px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Preview</div>
        <div style={{ background: colors.background.primary.value, borderRadius: "16px", width: "390px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: `1px solid ${colors.gray.gray100.value}` }}>
          {/* Scrollable 2-row grid */}
          <div ref={scrollRef} onScroll={handleScroll}
            onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseLeave={onMouseUp} onMouseMove={onMouseMove}
            style={{ overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none", padding: "16px 20px 12px", cursor: "grab", userSelect: "none" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "max-content" }}>
              <div style={{ display: "flex", gap: "4px" }}>
                {row1.map((item, i) => renderCategoryItem(item, i))}
              </div>
              <div style={{ display: "flex", gap: "4px" }}>
                {row2.map((item, i) => renderCategoryItem(item, i + 8))}
              </div>
            </div>
          </div>
          {/* Scroll indicator */}
          <div style={{ display: "flex", justifyContent: "center", paddingBottom: "10px" }}>
            <div style={{ width: "56px", height: "4px", background: colors.gray.gray100.value, borderRadius: "2px", position: "relative" }}>
              <div style={{ width: "24px", height: "4px", background: colors.gray.gray800.value, borderRadius: "2px", position: "absolute", left: `${scrollRatio * 32}px`, transition: "left 0.1s ease" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Platform code */}
      <div>
        <div style={{ fontSize: "11px", color: "#aaa", marginBottom: "10px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Code</div>
        {/* Platform tabs */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "12px" }}>
          {platforms.map(p => (
            <button key={p.id} onClick={() => setPlatform(p.id)}
              style={{ padding: "6px 14px", borderRadius: "8px", border: "none", background: platform === p.id ? "#5028c8" : "#f0f0f0", color: platform === p.id ? "#fff" : "#666", fontSize: "11px", fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}>
              {p.label}
            </button>
          ))}
        </div>
        {/* Code block */}
        <div style={{ background: "#111111", borderRadius: "12px", padding: "20px", overflowX: "auto" }}>
          <pre style={{ margin: 0, fontSize: "11px", lineHeight: 1.6, color: "#e0e0e0", fontFamily: "'SF Mono', 'Fira Code', monospace", whiteSpace: "pre" }}>
            {codeMap[platform]}
          </pre>
        </div>
      </div>

      {/* Spec grid */}
      <div>
        <div style={{ fontSize: "11px", color: "#aaa", marginBottom: "10px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Specs</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
          {[
            { key: "Container", val: "390 × 200px" },
            { key: "Item size", val: "66 × 72px" },
            { key: "Icon", val: "52 × 52px, r14" },
            { key: "Label", val: "14px Roboto" },
            { key: "Gap", val: "4px" },
            { key: "H Padding", val: "20px" },
            { key: "V Padding", val: "16px top, 8px btm" },
            { key: "Badge", val: "9px Bold #FA0050" },
          ].map(s => (
            <div key={s.key} style={{ background: "#f8f8f8", borderRadius: "8px", padding: "10px 12px" }}>
              <div style={{ fontSize: "9px", color: "#aaa", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.key}</div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "#333" }}>{s.val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FigmaSection;
