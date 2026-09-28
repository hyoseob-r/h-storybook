import { useState, useRef, useEffect } from "react";
import { colors, metaTokens } from "../tokens";
import { CopyButton, CodeBlock } from "../shared/ui.jsx";
import { DEVICES, PhoneFrame } from "./Simulator.jsx";

// ── OS Version definitions ────────────────────────────────────────────────────

const IOS_OS = [
  { id: "14", label: "iOS 14", liquidGlass: false },
  { id: "15", label: "iOS 15", liquidGlass: false },
  { id: "16", label: "iOS 16", liquidGlass: false },
  { id: "17", label: "iOS 17", liquidGlass: false },
  { id: "18", label: "iOS 18", liquidGlass: false },
  { id: "26", label: "iOS 26", liquidGlass: true  },
];

const ANDROID_OS = [
  { id: "28", label: "Android 9  (API 28)", blur: false, scrim: false },
  { id: "29", label: "Android 10 (API 29)", blur: false, scrim: true  },
  { id: "30", label: "Android 11 (API 30)", blur: false, scrim: true  },
  { id: "31", label: "Android 12 (API 31)", blur: true,  scrim: true  },
  { id: "33", label: "Android 13 (API 33)", blur: true,  scrim: true  },
  { id: "34", label: "Android 14 (API 34)", blur: true,  scrim: true  },
  { id: "35", label: "Android 15 (API 35)", blur: true,  scrim: true  },
];

// ── Code generators: Glass Nav ────────────────────────────────────────────────

function genGlassCode(platform, os, framework) {
  const api = platform === "android" ? parseInt(os.id) : 0;

  if (framework === "css") return `/* Glass Nav Bar — CSS */
.nav-wrapper {
  height: 100vh;
  overflow-y: auto;
}

.nav-bar {
  position: sticky;
  top: 0;
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  backdrop-filter: blur(0px) saturate(1);
  -webkit-backdrop-filter: blur(0px) saturate(1);
  background-color: rgba(255, 255, 255, 0);
  border-bottom: none;
  transition: all 0.25s;
  z-index: 100;
}

/* Scrolled state — toggle via JS */
.nav-bar.scrolled {
  backdrop-filter: blur(40px) saturate(2.2);
  -webkit-backdrop-filter: blur(40px) saturate(2.2);
  background-color: rgba(255, 255, 255, 0.7);
  border-bottom: 0.5px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 2px 24px rgba(0, 0, 0, 0.08);
}

/* JS: scroll-reactive ratio */
// document.querySelector('.nav-wrapper').addEventListener('scroll', (e) => {
//   const ratio = Math.min(e.target.scrollTop / 300, 1);
//   navBar.style.backdropFilter = \`blur(\${ratio*40}px) saturate(\${1+ratio*1.2})\`;
//   navBar.style.background = \`rgba(255,255,255,\${ratio*0.7})\`;
// });`;

  if (framework === "react") return `// React — Glass Nav Bar
import { useState } from 'react';

function GlassNavBar() {
  const [ratio, setRatio] = useState(0);

  return (
    <div
      onScroll={(e) => setRatio(Math.min(e.target.scrollTop / 300, 1))}
      style={{ height: '100vh', overflowY: 'auto' }}
    >
      {/* Sticky Glass Nav */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: 56,
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          backdropFilter: \`blur(\${ratio * 40}px) saturate(\${1 + ratio * 1.2})\`,
          WebkitBackdropFilter: \`blur(\${ratio * 40}px) saturate(\${1 + ratio * 1.2})\`,
          background: \`rgba(255, 255, 255, \${ratio * 0.7})\`,
          borderBottom: ratio > 0.05 ? \`0.5px solid rgba(255,255,255,\${ratio * 0.4})\` : 'none',
          boxShadow: ratio > 0 ? \`0 2px 24px rgba(0,0,0,\${ratio * 0.08})\` : 'none',
          transition: 'all 0.25s',
          zIndex: 100,
        }}
      >
        <span style={{ flex: 1, textAlign: 'center', fontSize: 15, fontWeight: 700 }}>
          홈
        </span>
      </div>

      {/* Page content */}
    </div>
  );
}`;

  if (platform === "android" && framework === "compose") {
    if (api >= 31) return `// Jetpack Compose — RenderEffect Blur (API 31+)
@Composable
fun GlassNavScreen() {
    val scrollState = rememberScrollState()
    val ratio = (scrollState.value / 300f).coerceIn(0f, 1f)

    Box(Modifier.fillMaxSize()) {
        Column(
            Modifier
                .fillMaxSize()
                .verticalScroll(scrollState)
        ) {
            Spacer(Modifier.height(56.dp))
            repeat(20) { RestaurantCard(it) }
        }

        // Glass Nav Bar
        Box(
            Modifier
                .fillMaxWidth()
                .height(56.dp)
                .blur(lerp(0.dp, 20.dp, ratio))   // Compose 1.3+ / API 31+
                .background(
                    Color.White.copy(alpha = lerp(0f, 0.45f, ratio))
                )
                .border(
                    width = 0.5.dp,
                    color = Color.White.copy(alpha = ratio * 0.4f),
                    shape = RectangleShape
                )
        ) {
            NavBarContent()
        }
    }
}`;
    if (api >= 29) return `// Jetpack Compose — Scrim fallback (API 29–30)
// blur 미지원 → 반투명 스크림으로 대체
@Composable
fun GlassNavScreen() {
    val scrollState = rememberScrollState()
    val ratio = (scrollState.value / 300f).coerceIn(0f, 1f)

    Box(Modifier.fillMaxSize()) {
        Column(
            Modifier
                .fillMaxSize()
                .verticalScroll(scrollState)
        ) {
            Spacer(Modifier.height(56.dp))
            repeat(20) { RestaurantCard(it) }
        }

        Box(
            Modifier
                .fillMaxWidth()
                .height(56.dp)
                .background(
                    Color.Black.copy(alpha = lerp(0f, 0.65f, ratio))
                )
        ) {
            NavBarContent(textColor = Color.White)
        }
    }
}`;
    return `// Jetpack Compose — Solid fallback (API 28 이하)
// blur / scrim 모두 미지원 → solid color 고정
@Composable
fun GlassNavScreen() {
    Box(Modifier.fillMaxSize()) {
        Column(
            Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
        ) {
            Spacer(Modifier.height(56.dp))
            repeat(20) { RestaurantCard(it) }
        }

        Box(
            Modifier
                .fillMaxWidth()
                .height(56.dp)
                .background(Color(0xFF1A1A1A))
        ) {
            NavBarContent(textColor = Color.White)
        }
    }
}`;
  }

  if (platform === "android" && framework === "xml") {
    if (api >= 31) return `<!-- View System + RenderEffect (API 31+) -->
<FrameLayout
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <androidx.core.widget.NestedScrollView
        android:id="@+id/scrollView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:paddingTop="56dp">
        <!-- content -->
    </androidx.core.widget.NestedScrollView>

    <View
        android:id="@+id/navBar"
        android:layout_width="match_parent"
        android:layout_height="56dp"
        android:background="#66FFFFFF" />

</FrameLayout>

// Kotlin
scrollView.setOnScrollChangeListener { _, _, y, _, _ ->
    val ratio = (y / 300f).coerceIn(0f, 1f)
    if (Build.VERSION.SDK_INT >= 31) {
        navBar.setRenderEffect(
            RenderEffect.createBlurEffect(
                ratio * 20f, ratio * 20f,
                Shader.TileMode.CLAMP
            )
        )
    }
    navBar.alpha = 0.1f + ratio * 0.9f
}`;
    return `<!-- View System — Scrim/Solid fallback (API 28–30) -->
<FrameLayout
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <androidx.core.widget.NestedScrollView
        android:id="@+id/scrollView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:paddingTop="56dp">
        <!-- content -->
    </androidx.core.widget.NestedScrollView>

    <View
        android:id="@+id/navBar"
        android:layout_width="match_parent"
        android:layout_height="56dp"
        android:background="#00000000" />

</FrameLayout>

// Kotlin
scrollView.setOnScrollChangeListener { _, _, y, _, _ ->
    val ratio = (y / 300f).coerceIn(0f, 1f)
    // API 28–: blur 불가, 스크림으로 대체
    navBar.setBackgroundColor(
        Color.argb((ratio * 165).toInt(), 0, 0, 0)
    )
}`;
  }

  if (platform === "ios" && framework === "swiftui") {
    if (os.liquidGlass) return `// SwiftUI — iOS 26 Liquid Glass
import SwiftUI

struct HomeView: View {
    @State private var scrollOffset: CGFloat = 0

    var body: some View {
        ScrollView {
            LazyVStack(spacing: 0) {
                ForEach(0..<20) { RestaurantRow(index: $0) }
            }
            .padding(.top, 56)
            .background(scrollOffsetReader)
        }
        .coordinateSpace(name: "scroll")
        .onPreferenceChange(ScrollOffsetKey.self) { scrollOffset = $0 }
        .overlay(alignment: .top) {
            LiquidGlassNavBar(offset: scrollOffset)
        }
    }

    var scrollOffsetReader: some View {
        GeometryReader { geo in
            Color.clear.preference(
                key: ScrollOffsetKey.self,
                value: geo.frame(in: .named("scroll")).minY
            )
        }
    }
}

struct LiquidGlassNavBar: View {
    let offset: CGFloat
    var ratio: CGFloat { min(max(-offset / 100, 0), 1) }

    var body: some View {
        HStack {
            Text("홈").font(.headline)
            Spacer()
            Image(systemName: "magnifyingglass")
        }
        .padding(.horizontal, 16)
        .frame(height: 56)
        .background {
            // iOS 26 Liquid Glass — .ultraThinMaterial + iridescent overlay
            ZStack {
                Rectangle()
                    .fill(.ultraThinMaterial)
                    .opacity(ratio)
                LinearGradient(
                    colors: [
                        .white.opacity(0.15 * ratio),
                        Color(hue: 0.6, saturation: 0.3, brightness: 1).opacity(0.08 * ratio),
                        Color(hue: 0.9, saturation: 0.2, brightness: 1).opacity(0.06 * ratio),
                    ],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
            }
        }
        .overlay(alignment: .bottom) {
            Rectangle()
                .frame(height: 0.5)
                .foregroundColor(.white.opacity(0.4 * ratio))
        }
    }
}`;

    return `// SwiftUI — iOS ${os.id} (.ultraThinMaterial)
import SwiftUI

struct HomeView: View {
    @State private var scrollOffset: CGFloat = 0

    var body: some View {
        ScrollView {
            LazyVStack(spacing: 0) {
                ForEach(0..<20) { RestaurantRow(index: $0) }
            }
            .padding(.top, 56)
            .background(scrollOffsetReader)
        }
        .coordinateSpace(name: "scroll")
        .onPreferenceChange(ScrollOffsetKey.self) { scrollOffset = $0 }
        .overlay(alignment: .top) {
            GlassNavBar(offset: scrollOffset)
        }
    }
}

struct GlassNavBar: View {
    let offset: CGFloat
    var ratio: CGFloat { min(max(-offset / 100, 0), 1) }

    var body: some View {
        HStack {
            Text("홈").font(.headline)
            Spacer()
            Image(systemName: "magnifyingglass")
        }
        .padding(.horizontal, 16)
        .frame(height: 56)
        .background(
            .ultraThinMaterial.opacity(ratio)  // iOS 15+
            // iOS 14: .regularMaterial 사용
        )
        .overlay(alignment: .bottom) {
            Divider().opacity(ratio * 0.6)
        }
    }
}`;
  }

  if (platform === "ios" && framework === "uikit") {
    return `// UIKit — iOS ${os.id}
class HomeViewController: UIViewController {
    private let tableView  = UITableView()
    private let navBar     = UIView()
    private let blurView   = UIVisualEffectView(
        effect: UIBlurEffect(style: .systemChromeMaterial)
    )

    override func viewDidLoad() {
        super.viewDidLoad()
        setupLayout()
        tableView.delegate = self
    }

    private func setupLayout() {
        view.addSubview(tableView)
        tableView.frame = view.bounds
        tableView.contentInset = UIEdgeInsets(top: 56, left: 0, bottom: 0, right: 0)

        navBar.frame = CGRect(x: 0, y: 0,
                              width: view.bounds.width, height: 56)
        blurView.frame  = navBar.bounds
        blurView.alpha  = 0
        navBar.addSubview(blurView)
        view.addSubview(navBar)
    }
}

extension HomeViewController: UIScrollViewDelegate {
    func scrollViewDidScroll(_ scrollView: UIScrollView) {
        let ratio = min(max(scrollView.contentOffset.y / 100, 0), 1)
        UIView.animate(withDuration: 0.1) {
            self.blurView.alpha = Float(ratio)
        }
    }
}`;
  }

  return "";
}

// ── Section: Liquid Glass ─────────────────────────────────────────────────────

const STORES = [
  { name: "맥도날드",   tag: "버거",   time: "20분", rating: "4.8", food: "https://picsum.photos/seed/burger1/96/96",   bg: "#FFC72C", initial: "M", color: "#DA291C" },
  { name: "BBQ치킨",   tag: "치킨",   time: "25분", rating: "4.7", food: "https://picsum.photos/seed/chicken2/96/96",  bg: "#E63329", initial: "B", color: "#ffffff" },
  { name: "본죽",       tag: "한식",   time: "30분", rating: "4.6", food: "https://picsum.photos/seed/korean3/96/96",   bg: "#4CAF50", initial: "본", color: "#ffffff" },
  { name: "스타벅스",  tag: "카페",   time: "15분", rating: "4.9", food: "https://picsum.photos/seed/coffee4/96/96",   bg: "#00704A", initial: "S", color: "#ffffff" },
  { name: "피자헛",    tag: "피자",   time: "35분", rating: "4.5", food: "https://picsum.photos/seed/pizza5/96/96",    bg: "#E31837", initial: "P", color: "#ffffff" },
  { name: "롯데리아",  tag: "버거",   time: "18분", rating: "4.4", food: "https://picsum.photos/seed/burger6/96/96",   bg: "#E31837", initial: "L", color: "#ffffff" },
  { name: "교촌치킨",  tag: "치킨",   time: "28분", rating: "4.7", food: "https://picsum.photos/seed/chicken7/96/96",  bg: "#C8A96E", initial: "교", color: "#ffffff" },
  { name: "CU 편의점", tag: "편의점", time: "10분", rating: "4.3", food: "https://picsum.photos/seed/store8/96/96",    bg: "#00AADC", initial: "CU", color: "#ffffff" },
];

function GlassNavSection() {
  const [platform, setPlatform]   = useState("ios");
  const [osIdx, setOsIdx]         = useState(5);
  const [deviceIdx, setDeviceIdx] = useState(2);
  const [scrollRatio, setScrollRatio] = useState(0);
  const [framework, setFramework] = useState("swiftui");
  const contentRef = useRef(null);

  const osList  = platform === "ios" ? IOS_OS : ANDROID_OS;
  const os      = osList[Math.min(osIdx, osList.length - 1)];
  const device  = DEVICES[platform][deviceIdx];
  const api     = platform === "android" ? parseInt(os.id) : 999;

  // ── Compatibility ──────────────────────────────────────────────────────────
  const compat = platform === "ios"
    ? { blur: true,  glass: os.liquidGlass, label: os.liquidGlass ? "Liquid Glass" : "UIBlurEffect", color: "#4caf50" }
    : api >= 31
      ? { blur: true,  glass: false, label: "RenderEffect.createBlurEffect", color: "#4caf50" }
      : api >= 29
        ? { blur: false, glass: false, label: "Scrim 대체 (blur 불가)",          color: "#ff9800" }
        : { blur: false, glass: false, label: "Solid color만 가능",              color: "#f44336" };

  // ── Nav bar visual style ───────────────────────────────────────────────────
  const t = scrollRatio;
  let navStyle = {};
  if (platform === "ios") {
    if (os.liquidGlass) {
      navStyle = {
        backdropFilter: `blur(${t * 40}px) saturate(${1 + t * 1.2})`,
        background: `linear-gradient(135deg,rgba(255,255,255,${t*0.25}),rgba(180,220,255,${t*0.12}),rgba(255,200,230,${t*0.1}))`,
        borderBottom: t > 0.05 ? `0.5px solid rgba(255,255,255,${t*0.5})` : "none",
        boxShadow: t > 0 ? `0 2px 24px rgba(0,0,0,${t*0.08}),inset 0 1px 0 rgba(255,255,255,${t*0.5})` : "none",
      };
    } else {
      navStyle = {
        backdropFilter: `blur(${t*20}px)`,
        background: `rgba(242,242,247,${t*0.85})`,
        borderBottom: t > 0.05 ? `0.5px solid rgba(0,0,0,${t*0.12})` : "none",
      };
    }
  } else {
    if (api >= 31) {
      navStyle = {
        backdropFilter: `blur(${t*20}px)`,
        background: `rgba(255,255,255,${0.05+t*0.4})`,
        borderBottom: `1px solid rgba(255,255,255,${t*0.3})`,
        boxShadow: t > 0 ? `0 2px 16px rgba(0,0,0,${t*0.15})` : "none",
      };
    } else if (api >= 29) {
      navStyle = { background: `rgba(0,0,0,${t*0.65})` };
    } else {
      navStyle = { background: "#1a1a1a", borderBottom: "1px solid #333" };
    }
  }

  const navTextColor = (platform === "android" && api < 31 && t > 0.2) ? "#fff"
    : (platform === "ios" || (platform === "android" && api >= 31)) ? "#111"
    : "#fff";

  // ── Sync slider → actual scroll ────────────────────────────────────────────
  useEffect(() => {
    if (!contentRef.current) return;
    const el = contentRef.current;
    el.scrollTop = scrollRatio * (el.scrollHeight - el.clientHeight);
  }, [scrollRatio]);

  const fwOptions = [
    ...(platform === "ios"
      ? [{ id: "swiftui", label: "SwiftUI" }, { id: "uikit", label: "UIKit" }]
      : [{ id: "compose", label: "Jetpack Compose" }, { id: "xml", label: "View (XML)" }]),
    { id: "css",   label: "CSS" },
    { id: "react", label: "React" },
  ];

  return (
    <div style={{ display: "flex", gap: "20px", height: "100%", minHeight: 0 }}>

      {/* ── Left controls ── */}
      <div style={{ width: "210px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "12px", overflowY: "auto" }}>

        {/* Platform */}
        <div style={{ background: "#ffffff", border: "1px solid #e5e5e5", borderRadius: "10px", padding: "14px" }}>
          <div style={{ fontSize: "10px", color: "#999999", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "10px", fontWeight: 600 }}>Platform</div>
          <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
            {["ios","android"].map(p => (
              <button key={p} onClick={() => { setPlatform(p); setOsIdx(p === "ios" ? 5 : 3); setFramework(p === "ios" ? "swiftui" : "compose"); setDeviceIdx(0); }}
                style={{ flex: 1, padding: "7px", borderRadius: "7px", background: platform === p ? "#f0f0f0" : "transparent", border: platform === p ? "1px solid #c0c0c0" : "1px solid #e5e5e5", color: platform === p ? "#333333" : "#999999", fontSize: "11px", cursor: "pointer", fontWeight: platform === p ? 700 : 400 }}>
                {p === "ios" ? "iOS" : "Android"}
              </button>
            ))}
          </div>
          <div style={{ fontSize: "10px", color: "#999999", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px", fontWeight: 600 }}>OS Version</div>
          <select value={osIdx} onChange={e => setOsIdx(Number(e.target.value))}
            style={{ width: "100%", background: "#ffffff", border: "1px solid #d0d0d0", borderRadius: "6px", padding: "6px 8px", color: "#333333", fontSize: "11px", outline: "none", cursor: "pointer" }}>
            {osList.map((o, i) => <option key={i} value={i}>{o.label}</option>)}
          </select>
        </div>

        {/* Device */}
        <div style={{ background: "#ffffff", border: "1px solid #e5e5e5", borderRadius: "10px", padding: "14px" }}>
          <div style={{ fontSize: "10px", color: "#999999", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "8px", fontWeight: 600 }}>Device</div>
          <select value={deviceIdx} onChange={e => setDeviceIdx(Number(e.target.value))}
            style={{ width: "100%", background: "#ffffff", border: "1px solid #d0d0d0", borderRadius: "6px", padding: "6px 8px", color: "#333333", fontSize: "11px", outline: "none", cursor: "pointer" }}>
            {DEVICES[platform].map((d, i) => <option key={i} value={i}>{d.name}</option>)}
          </select>
        </div>

        {/* Scroll simulator */}
        <div style={{ background: "#ffffff", border: "1px solid #e5e5e5", borderRadius: "10px", padding: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <div style={{ fontSize: "10px", color: "#999999", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>Scroll</div>
            <div style={{ fontSize: "10px", color: "#aaaaaa", fontFamily: "monospace" }}>{Math.round(scrollRatio * 100)}%</div>
          </div>
          <input type="range" min="0" max="100" value={Math.round(scrollRatio * 100)}
            onChange={e => setScrollRatio(Number(e.target.value) / 100)}
            style={{ width: "100%", accentColor: "#fa0050", cursor: "pointer" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#bbbbbb", marginTop: "4px" }}>
            <span>Top</span><span>Bottom</span>
          </div>
        </div>

        {/* Compatibility badge */}
        <div style={{ background: "#ffffff", border: `1px solid ${compat.color}33`, borderRadius: "10px", padding: "14px" }}>
          <div style={{ fontSize: "10px", color: "#999999", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "10px", fontWeight: 600 }}>Compatibility</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 10px", borderRadius: "20px", background: `${compat.color}18`, border: `1px solid ${compat.color}44` }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: compat.color }} />
            <span style={{ fontSize: "10px", color: compat.color, fontWeight: 600 }}>{compat.label}</span>
          </div>
          {platform === "android" && api < 31 && (
            <div style={{ marginTop: "10px", fontSize: "10px", color: "#888888", lineHeight: "1.6" }}>
              {api >= 29 ? "blur 미지원 → 스크림으로 대체" : "blur/scrim 모두 미지원 → solid color"}
            </div>
          )}
          {platform === "ios" && os.liquidGlass && (
            <div style={{ marginTop: "10px", fontSize: "10px", color: "#888888", lineHeight: "1.6" }}>
              iridescent gradient + saturate 필터 적용
            </div>
          )}
        </div>
      </div>

      {/* ── Phone preview ── */}
      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
        <PhoneFrame platform={platform} device={device}>
          <div ref={contentRef} style={{ height: "100%", overflowY: "auto", overflowX: "hidden", position: "relative" }}>
            {/* Glass Nav Bar — sticky */}
            <div style={{ position: "sticky", top: 0, zIndex: 10, height: "56px", display: "flex", alignItems: "center", padding: "0 16px", transition: "all 0.25s", ...navStyle }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "#fa0050", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#fff", fontSize: "12px", fontWeight: 700 }}>Y</span>
              </div>
              <span style={{ flex: 1, textAlign: "center", fontSize: "15px", fontWeight: 700, color: navTextColor, fontFamily: platform === "ios" ? "system-ui" : "Roboto, sans-serif" }}>홈</span>
              <span style={{ fontSize: "18px", color: navTextColor, opacity: 0.7 }}>⌕</span>
            </div>

            {/* Hero banner */}
            <div style={{ margin: "0 16px 16px", padding: "20px 16px", background: "linear-gradient(135deg,#fa0050,#ff3072)", borderRadius: "16px", color: "#fff" }}>
              <div style={{ fontSize: "11px", opacity: 0.85, marginBottom: "4px", fontFamily: platform === "ios" ? "system-ui" : "Roboto, sans-serif" }}>지금 주문하면</div>
              <div style={{ fontSize: "18px", fontWeight: 700, fontFamily: platform === "ios" ? "system-ui" : "Roboto, sans-serif" }}>무료배달 이벤트</div>
              <div style={{ fontSize: "11px", marginTop: "4px", opacity: 0.8, fontFamily: platform === "ios" ? "system-ui" : "Roboto, sans-serif" }}>오늘 23:59 까지</div>
            </div>

            {/* Section title */}
            <div style={{ padding: "0 16px 10px", fontSize: "14px", fontWeight: 700, color: "#111", fontFamily: platform === "ios" ? "system-ui" : "Roboto, sans-serif" }}>
              주변 맛집
            </div>

            {/* Store list */}
            {STORES.map((s, i) => (
              <div key={i} style={{ borderBottom: "1px solid #f5f5f5" }}>
                {/* Food photo */}
                <div style={{ position: "relative", height: "100px", overflow: "hidden" }}>
                  <img src={s.food} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  {/* Logo badge */}
                  <div style={{ position: "absolute", bottom: 8, left: 12, width: 36, height: 36, borderRadius: 10, background: s.bg, border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.18)" }}>
                    <span style={{ fontSize: s.initial.length > 1 ? "9px" : "13px", fontWeight: 900, color: s.color, letterSpacing: "-0.5px" }}>{s.initial}</span>
                  </div>
                </div>
                {/* Info */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#111", fontFamily: platform === "ios" ? "system-ui" : "Roboto, sans-serif" }}>{s.name}</div>
                    <div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>⭐ {s.rating} · {s.time}</div>
                  </div>
                  <span style={{ padding: "2px 8px", background: "#fff5f8", borderRadius: "10px", color: "#fa0050", fontSize: "10px", fontWeight: 700, flexShrink: 0 }}>{s.tag}</span>
                </div>
              </div>
            ))}
            <div style={{ height: "40px" }} />
          </div>
        </PhoneFrame>
      </div>

      {/* ── Code panel ── */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Framework selector */}
        <div style={{ display: "flex", gap: "4px" }}>
          {fwOptions.map(f => (
            <button key={f.id} onClick={() => setFramework(f.id)}
              style={{ padding: "6px 14px", borderRadius: "7px", background: framework === f.id ? "#f0f0f0" : "transparent", border: framework === f.id ? "1px solid #c0c0c0" : "1px solid #e5e5e5", color: framework === f.id ? "#333333" : "#999999", fontSize: "11px", cursor: "pointer", fontWeight: framework === f.id ? 700 : 400 }}>
              {f.label}
            </button>
          ))}
        </div>
        <CodeBlock code={genGlassCode(platform, os, framework)} />
      </div>

    </div>
  );
}

export default GlassNavSection;
