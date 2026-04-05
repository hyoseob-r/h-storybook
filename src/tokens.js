// ─────────────────────────────────────────────────────────────────────────────
// META TOKENS  (YDS 2.0 primitive layer — "atoms" that semantic tokens alias)
// Hierarchy: Meta → Semantic (colors/typography/radius below) → Component
// Naming: {color}{scale} = light mode  |  {color}{scale}_i = inverse (dark mode)
// Source: figma.com/design/onuxIpHZS7uphPt4rIYXz7/YDS-2.0-Meta-Token
// ─────────────────────────────────────────────────────────────────────────────
export const metaTokens = {
  // ── Typography primitives ──────────────────────────────────────────────────
  // Typeface: SD Neo (iOS) / SF Pro Display (iOS) / Noto Sans (Android) / Roboto (Android)
  // meta_sf_{size}_{r=Regular | b=Bold}
  typography: {
    meta_sf_10_r: { size: 10, weight: 400, lineHeight: 14 },
    meta_sf_10_b: { size: 10, weight: 700, lineHeight: 14 },
    meta_sf_11_r: { size: 11, weight: 400, lineHeight: 15 },
    meta_sf_11_b: { size: 11, weight: 700, lineHeight: 15 },
    meta_sf_12_r: { size: 12, weight: 400, lineHeight: 16 },
    meta_sf_12_b: { size: 12, weight: 700, lineHeight: 16 },
    meta_sf_13_r: { size: 13, weight: 400, lineHeight: 18 },
    meta_sf_13_b: { size: 13, weight: 700, lineHeight: 18 },
    meta_sf_14_r: { size: 14, weight: 400, lineHeight: 19 },
    meta_sf_14_b: { size: 14, weight: 700, lineHeight: 19 },
    meta_sf_15_r: { size: 15, weight: 400, lineHeight: 20 },
    meta_sf_15_b: { size: 15, weight: 700, lineHeight: 20 },
    meta_sf_16_r: { size: 16, weight: 400, lineHeight: 22 },
    meta_sf_16_b: { size: 16, weight: 700, lineHeight: 22 },
    meta_sf_18_r: { size: 18, weight: 400, lineHeight: 24 },
    meta_sf_18_b: { size: 18, weight: 700, lineHeight: 24 },
    meta_sf_20_r: { size: 20, weight: 400, lineHeight: 27 },
    meta_sf_20_b: { size: 20, weight: 700, lineHeight: 27 },
    meta_sf_22_r: { size: 22, weight: 400, lineHeight: 30 },
    meta_sf_22_b: { size: 22, weight: 700, lineHeight: 30 },
    meta_sf_24_r: { size: 24, weight: 400, lineHeight: 32 },
    meta_sf_24_b: { size: 24, weight: 700, lineHeight: 32 },
    meta_sf_32_r: { size: 32, weight: 400, lineHeight: 43 },
    meta_sf_32_b: { size: 32, weight: 700, lineHeight: 43 },
    meta_sf_56_r: { size: 56, weight: 400, lineHeight: 76 },
    meta_sf_56_b: { size: 56, weight: 700, lineHeight: 76 },
  },
  // ── Radius primitives ──────────────────────────────────────────────────────
  // rfull=360 (not 9999) — confirmed from Figma YDS 2.0 Meta Token doc
  radius: {
    rfull:   360,
    meta_r0: 0,
    meta_r1: 4,
    meta_r2: 8,
    meta_r3: 10,
    meta_r4: 12,
    meta_r5: 16,
    meta_r6: 20,
  },
  // ── Spacing primitives ─────────────────────────────────────────────────────
  // Rule: ≤12dp → multiples of 2 (필요시 사용) | >12dp → multiples of 4 (우선 사용)
  // meta_s1–s13: 2, 4, 6, 8, 10, 12, 16, 20, 24, 28, 32, 36, 40
  spacing: {
    meta_s1:  2,
    meta_s2:  4,
    meta_s3:  6,
    meta_s4:  8,
    meta_s5:  10,
    meta_s6:  12,
    meta_s7:  16,
    meta_s8:  20,
    meta_s9:  24,
    meta_s10: 28,
    meta_s11: 32,
    meta_s12: 36,
    meta_s13: 40,
  },
  // ── Color primitives (TO BE · V.2.0) ───────────────────────────────────────
  // Suffix _i = inverse (dark mode) — 1:1 light↔dark token mapping
  colors: {
    // Blue scale  (semantic alias: foundation.secondary = blue500)
    blue: {
      blue25:    "#F0F7FF", blue25_i:   "#242629",
      blue50:    "#E7F2FE", blue50_i:   "#282B2F",
      blue100:   "#C5DFFB", blue100_i:  "#333A42",
      blue200:   "#8FC2F9", blue200_i:  "#3C5167",
      blue300:   "#5FAAF6", blue300_i:  "#3F6A97",
      blue400:   "#2E8EF4", blue400_i:  "#337FD1",
      blue500:   "#0C74E4", blue500_i:  "#1F8BFF",
      blue700:   "#074382", blue700_i:  "#92C5FC",
      blue800:   "#042E57", blue800_i:  "#AFD5FE",
    },
    // Cyan scale  (new in V.2.0)
    cyan: {
      meta_cyan25:    "#F0F7FA", meta_cyan25_i:  "#262829",
      meta_cyan50:    "#E8F5FA", meta_cyan50_i:  "#282C2E",
      meta_cyan400:   "#2591B5", meta_cyan400_i: "#2582A1",
      cyan800:        "#003F55", cyan800_i:      "#C3EAF7",
    },
    // Red / Primary scale  (ygy_red = hot-pink brand primary AND extended scale)
    // foundation.primary → ygy_red500 (#FA0050) | foundation.primary_i → ygy_red500_i (#FF3072)
    // V.1.0 called this "Pink"; V.2.0 renamed to "Red/ygy_red"
    red: {
      ygy_red25:   "#FFF5F8", ygy_red25_i:  "#282425",
      ygy_red50:   "#FFE6EE", ygy_red50_i:  "#312A2C",
      ygy_red100:  "#FECCDC", ygy_red100_i: "#423137",
      ygy_red200:  "#FD99B9", ygy_red200_i: "#6B3949",
      ygy_red300:  "#FC6696", ygy_red300_i: "#A13759",
      ygy_red500:  "#FA0050", ygy_red500_i: "#FF3072",
      ygy_red800:  "#640020", ygy_red800_i: "#FFA8C4",
    },
    // Green scale  (semantic alias: foundation.green) — V.2.0 teal range
    green: {
      green25:   "#F0F7F6", green25_i:  null,
      green50:   "#E6F4F2", green50_i:  null,
      green100:  null,       green100_i: null,
      green500:  "#05947F", green500_i: "#10A891",
      green800:  "#023B33", green800_i: null,
    },
    // Yellow scale  (semantic alias: foundation.yellow)
    // yellow500 = primary yellow (#FFCB2E) | yellow600 = darker (#CCA329)
    yellow: {
      yellow25:   "#FFF9F0", yellow25_i:  "#282725",
      yellow50:   "#FFF9E5", yellow50_i:  "#2E2C27",
      yellow100:  "#FFF4D1", yellow100_i: "#3B382D",
      yellow500:  "#FFCB2E", yellow500_i: "#D7AD2D",
      yellow600:  "#CCA329", yellow600_i: "#E1C05F",
      yellow800:  "#665214", yellow800_i: "#F6EAC5",
    },
    // Coolgray scale  (blue-tinted gray, new in V.2.0 — no coolgray400)
    coolgray: {
      coolgray25:   "#F5F8FA", coolgray25_i:  "#222629",
      coolgray50:   "#EEF3F5", coolgray50_i:  "#272C2E",
      coolgray100:  "#DEE5EA", coolgray100_i: "#32383B",
      coolgray200:  "#C1CCD4", coolgray200_i: "#464E53",
      coolgray300:  "#A5B4BE", coolgray300_i: "#5C6870",
      coolgray500:  "#6F828E", coolgray500_i: "#8D9FAB",
      coolgray600:  "#576873", coolgray600_i: "#A2B3BE",
      coolgray700:  "#424E56", coolgray700_i: "#BECCD6",
      coolgray800:  "#28343C", coolgray800_i: "#D8E3EB",
    },
    // Orange scale  (semantic alias: ygy_orange in light.ygy_orange)
    orange: {
      orange25:   "#FEF6F4", orange25_i:  "#282524",
      orange50:   "#FEEDE6", orange50_i:  "#312C29",
      orange100:  "#FCDACC", orange100_i: "#453833",
      orange400:  "#F36B33", orange400_i: "#D76638",
      orange500:  "#F04600", orange500_i: "#FF6A2B",
      orange800:  "#601C00", orange800_i: "#FFCEBA",
    },
    // Gray scale  (neutral)
    gray: {
      gray25:   "#F6F6F6", gray25_i:  "#2B2B2B",
      gray50:   "#F2F2F2", gray50_i:  "#303030",
      gray100:  "#E5E5E5", gray100_i: null,
      gray200:  "#CCCCCC", gray200_i: "#575757",
      gray300:  "#B2B2B2", gray300_i: "#707070",
      gray400:  "#999999", gray400_i: "#8A8A8A",
      gray500:  "#7F7F7F", gray500_i: "#A6A6A6",
      gray600:  "#666666", gray600_i: "#BFBFBF",
      gray700:  "#4C4C4C", gray700_i: "#D9D9D9",
      gray800:  "#333333", gray800_i: "#F2F2F2",
      meta_black: "#000000",
    },
  },
  // ── Shadow / Elevation primitives ─────────────────────────────────────────
  // Shadow color: #193040 (rgb 25,48,64) — two-layer shadow system
  // _i suffix = inverse direction (Y negated → shadow goes upward)
  // Opacity is % → divide by 100 for CSS rgba
  elevation: {
    meta_level_0:   { l1: { y:  0, blur:  0, opacity:  0 }, l2: { y: 0, blur: 0, opacity:  0 }, color: "#193040", css: "none" },
    meta_level_1:   { l1: { y:  1, blur:  8, opacity: 10 }, l2: { y: 0, blur: 2, opacity:  8 }, color: "#193040", css: "0 1px 8px rgba(25,48,64,0.10), 0 0 2px rgba(25,48,64,0.08)" },
    meta_level_2:   { l1: { y:  2, blur: 12, opacity: 24 }, l2: { y: 0, blur: 4, opacity: 12 }, color: "#193040", css: "0 2px 12px rgba(25,48,64,0.24), 0 0 4px rgba(25,48,64,0.12)" },
    meta_level_1_i: { l1: { y: -1, blur:  8, opacity: 10 }, l2: { y: 0, blur: 2, opacity:  8 }, color: "#193040", css: "0 -1px 8px rgba(25,48,64,0.10), 0 0 2px rgba(25,48,64,0.08)" },
    meta_level_2_i: { l1: { y: -2, blur: 12, opacity: 24 }, l2: { y: 0, blur: 4, opacity: 12 }, color: "#193040", css: "0 -2px 12px rgba(25,48,64,0.24), 0 0 4px rgba(25,48,64,0.12)" },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SEMANTIC TOKENS  (alias layer — references meta token values above)
// ─────────────────────────────────────────────────────────────────────────────
export const colors = {
  foundation: {
    primary:     { name: "primary",     value: "#fa0050" },
    primary_i:   { name: "primary_i",   value: "#ff3072" },
    secondary:   { name: "secondary",   value: "#0c74e4" },
    secondary_i: { name: "secondary_i", value: "#1f8bff" },
    red:         { name: "red",         value: "#c00000" },
    red_i:       { name: "red_i",       value: "#ff5c5c" },
    green:       { name: "green",       value: "#05947f" },
    green_i:     { name: "green_i",     value: "#10a891" },
    yellow:      { name: "yellow",      value: "#ffcb2e" },
    yellow_i:    { name: "yellow_i",    value: "#d7ad2d" },
    white:       { name: "white",       value: "#ffffff" },
    black:       { name: "black",       value: "#000000" },
  },
  // Light mode extended palette (from btn_Text_Color 규칙 노드)
  // 규칙: _100 suffix = Lightness variant → text color uses base token
  light: {
    primary_a:       { name: "primary_a",       value: "#fa0050" },
    primary_a_100:   { name: "primary_a_100",   value: "#feccdc" },
    primary_b:       { name: "primary_b",       value: "#28343c" },
    primary_b_100:   { name: "primary_b_100",   value: "#dee5ea" },
    accent:          { name: "accent",          value: "#0c80e4" },
    accent_100:      { name: "accent_100",      value: "#c5e2fb" },
    ygy_green:       { name: "ygy_green",       value: "#05947f" },
    ygy_green_100:   { name: "ygy_green_100",   value: "#cdeae6" },
    ygy_orange:      { name: "ygy_orange",      value: "#f04600" },
    ygy_orange_100:  { name: "ygy_orange_100",  value: "#fcdacc" },
    gray_c:          { name: "gray_c",          value: "#000000" },
  },
  gray: {
    gray800: { name: "gray800 (33)", value: "#333333" },
    gray600: { name: "gray600 (66)", value: "#666666" },
    gray400: { name: "gray400 (99)", value: "#999999" },
    gray250: { name: "gray250 (BF)", value: "#bfbfbf" },
    gray100: { name: "gray100 (E5)", value: "#e5e5e5" },
    gray50:  { name: "gray50 (F2)",  value: "#f2f2f2" },
    gray25:  { name: "gray25 (F6)",  value: "#f6f6f6" },
  },
  background: {
    primary:    { name: "primary_bg",   value: "#ffffff" },
    bottom:     { name: "bottom_bg",    value: "#f2f2f2" },
    primary_i:  { name: "primary_bg_i", value: "#1d1d1d" },
    bottom_i:   { name: "bottom_bg_i",  value: "#0f0f0f" },
    dim1:       { name: "dim_bg1",      value: "#000000e5" },
    dim2:       { name: "dim_bg2",      value: "#00000099" },
    dim3:       { name: "dim_bg3",      value: "#0000004d" },
  },
  variant: {
    primary25:    { name: "primary25",    value: "#fff5f8" },
    primary50:    { name: "primary50",    value: "#ffe6ee" },
    primary800:   { name: "primary800",   value: "#640020" },
    secondary25:  { name: "secondary25",  value: "#f0f7fa" },
    secondary50:  { name: "secondary50",  value: "#e8f5fa" },
    secondary800: { name: "secondary800", value: "#003f55" },
    green25:      { name: "green25",      value: "#f0f7f6" },
    green50:      { name: "green50",      value: "#e6f4f2" },
    green800:     { name: "green800",     value: "#023b33" },
    red25:        { name: "red25",        value: "#fef4f4" },
    red50:        { name: "red50",        value: "#fee6e6" },
    red800:       { name: "red800",       value: "#600000" },
    yellow25:     { name: "yellow25",     value: "#fff9f0" },
    yellow50:     { name: "yellow50",     value: "#fff9e5" },
    yellow800:    { name: "yellow800",    value: "#665214" },
  },
};

export const typography = [
  { name: "Title/title_2",    size: 24, weight: 700, lineHeight: 32, style: "Bold" },
  { name: "Title/title_4",    size: 20, weight: 700, lineHeight: 27, style: "Bold" },
  { name: "Title/title_6",    size: 18, weight: 700, lineHeight: 24, style: "Bold" },
  { name: "Title/title_8",    size: 16, weight: 700, lineHeight: 22, style: "Bold" },
  { name: "Body/body_2",      size: 16, weight: 400, lineHeight: 22, style: "Regular" },
  { name: "Body/body_5",      size: 14, weight: 700, lineHeight: 19, style: "Bold" },
  { name: "Body/body_6",      size: 14, weight: 400, lineHeight: 19, style: "Regular" },
  { name: "Body/body_9",      size: 12, weight: 700, lineHeight: 16, style: "Bold" },
  { name: "Body/body_10",     size: 12, weight: 400, lineHeight: 16, style: "Regular" },
  { name: "Body/body_11",     size: 11, weight: 700, lineHeight: 15, style: "Bold" },
  { name: "Body/body_12",     size: 11, weight: 400, lineHeight: 15, style: "Regular" },
  { name: "Caption/caption_1",size: 10, weight: 700, lineHeight: 14, style: "Bold" },
  { name: "Caption/caption_2",size: 10, weight: 400, lineHeight: 14, style: "Regular" },
];

// s1–s13 = semantic aliases of meta_s1–s13 (YDS 2.0 확정값)
// ≤12dp: 2의 배수  |  >12dp: 4의 배수
export const spacing = [
  { name: "s1",  value: 2,  meta: "meta_s1"  },
  { name: "s2",  value: 4,  meta: "meta_s2"  },
  { name: "s3",  value: 6,  meta: "meta_s3"  },
  { name: "s4",  value: 8,  meta: "meta_s4"  },
  { name: "s5",  value: 10, meta: "meta_s5"  },
  { name: "s6",  value: 12, meta: "meta_s6"  },
  { name: "s7",  value: 16, meta: "meta_s7"  },
  { name: "s8",  value: 20, meta: "meta_s8"  },
  { name: "s9",  value: 24, meta: "meta_s9"  },
  { name: "s10", value: 28, meta: "meta_s10" },
  { name: "s11", value: 32, meta: "meta_s11" },
  { name: "s12", value: 36, meta: "meta_s12" },
  { name: "s13", value: 40, meta: "meta_s13" },
];

export const states = {
  overlay: {
    loading_k: { name: "overlay_k/loading", label: "Black Loading",   value: "#0000001a", opacity: "10%" },
    loading_p: { name: "overlay_p/loading", label: "Primary Loading", value: "#fa00501a", opacity: "10%" },
    loading_w: { name: "overlay_w/loading", label: "White Loading",   value: "#ffffff33", opacity: "20%" },
  },
};

export const radius = [
  { name: "r2", value: 8 },
  { name: "r3", value: 10 },
  { name: "r4", value: 12 },
];

// Semantic aliases of metaTokens.elevation — shadow color: #193040 (rgb 25,48,64)
// meta_level_0 = no shadow | _i = inverse direction (upward)
export const elevation = [
  {
    name: "level_0",
    meta: "meta_level_0",
    label: "Level 0",
    direction: "none",
    css: "none",
    android: "elevation: 0dp",
    compose: "elevation = 0.dp",
    ios: "shadowRadius: 0, shadowOpacity: 0",
    swiftui: ".shadow(radius: 0)",
  },
  {
    name: "level_1",
    meta: "meta_level_1",
    label: "Level 1",
    direction: "down",
    css: "0 1px 8px rgba(25,48,64,0.10), 0 0 2px rgba(25,48,64,0.08)",
    android: "elevation: 2dp",
    compose: "elevation = 2.dp",
    ios: "shadowRadius: 8, shadowOpacity: 0.10, shadowOffset: (0, 1)",
    swiftui: ".shadow(color: .black.opacity(0.10), radius: 8, x: 0, y: 1)",
  },
  {
    name: "level_1_i",
    meta: "meta_level_1_i",
    label: "Level 1 (Inverse)",
    direction: "up",
    css: "0 -1px 8px rgba(25,48,64,0.10), 0 0 2px rgba(25,48,64,0.08)",
    android: "elevation: 2dp (inverted context)",
    compose: "elevation = 2.dp",
    ios: "shadowRadius: 8, shadowOpacity: 0.10, shadowOffset: (0, -1)",
    swiftui: ".shadow(color: .black.opacity(0.10), radius: 8, x: 0, y: -1)",
  },
  {
    name: "level_2",
    meta: "meta_level_2",
    label: "Level 2",
    direction: "down",
    css: "0 2px 12px rgba(25,48,64,0.24), 0 0 4px rgba(25,48,64,0.12)",
    android: "elevation: 6dp",
    compose: "elevation = 6.dp",
    ios: "shadowRadius: 12, shadowOpacity: 0.24, shadowOffset: (0, 2)",
    swiftui: ".shadow(color: .black.opacity(0.24), radius: 12, x: 0, y: 2)",
  },
  {
    name: "level_2_i",
    meta: "meta_level_2_i",
    label: "Level 2 (Inverse)",
    direction: "up",
    css: "0 -2px 12px rgba(25,48,64,0.24), 0 0 4px rgba(25,48,64,0.12)",
    android: "elevation: 6dp (inverted context)",
    compose: "elevation = 6.dp",
    ios: "shadowRadius: 12, shadowOpacity: 0.24, shadowOffset: (0, -2)",
    swiftui: ".shadow(color: .black.opacity(0.24), radius: 12, x: 0, y: -2)",
  },
];
