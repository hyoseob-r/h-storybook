export const colors = {
  foundation: {
    primary:     { name: "primary",     value: "#fa0050" },
    primary_i:   { name: "primary_i",   value: "#ff3072" },
    secondary:   { name: "secondary",   value: "#2591b5" },
    secondary_i: { name: "secondary_i", value: "#2582a1" },
    red:         { name: "red",         value: "#c00000" },
    red_i:       { name: "red_i",       value: "#ff5c5c" },
    green:       { name: "green",       value: "#05947f" },
    green_i:     { name: "green_i",     value: "#10a891" },
    yellow:      { name: "yellow",      value: "#ffcb2e" },
    yellow_i:    { name: "yellow_i",    value: "#d7ad2d" },
    white:       { name: "white",       value: "#ffffff" },
    black:       { name: "black",       value: "#000000" },
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

export const spacing = [
  { name: "s1", value: 2 },
  { name: "s2", value: 4 },
  { name: "s7", value: 16 },
];

export const radius = [
  { name: "r3", value: 10 },
  { name: "r4", value: 12 },
];

// shadow color: #193040 with opacity
// level_1: box-shadow 0 1px 8px rgba(25,48,64,0.10), 0 0 2px rgba(25,48,64,0.08)
// level_1_i: inverse (upward) 0 -1px 8px rgba(25,48,64,0.10), 0 0 2px rgba(25,48,64,0.08)
// level_2: box-shadow 0 2px 12px rgba(25,48,64,0.24), 0 0 4px rgba(25,48,64,0.12)
// level_2_i: inverse (upward) 0 -2px 12px rgba(25,48,64,0.24), 0 0 4px rgba(25,48,64,0.12)
export const elevation = [
  {
    name: "level_1",
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
    label: "Level 2 (Inverse)",
    direction: "up",
    css: "0 -2px 12px rgba(25,48,64,0.24), 0 0 4px rgba(25,48,64,0.12)",
    android: "elevation: 6dp (inverted context)",
    compose: "elevation = 6.dp",
    ios: "shadowRadius: 12, shadowOpacity: 0.24, shadowOffset: (0, -2)",
    swiftui: ".shadow(color: .black.opacity(0.24), radius: 12, x: 0, y: -2)",
  },
];
