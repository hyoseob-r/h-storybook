# /icon — YDS 아이콘 검색

컴포넌트에서 아이콘이 필요할 때, 정확한 아이콘 이름을 찾는 스킬입니다.

## 사용법

아이콘 키워드(한글/영어)를 받으면 `src/iconSynonyms.js`의 `findIcon()` 함수를 사용해 정확한 아이콘 이름을 반환합니다.

## 검색 순서

1. **정확 매칭** — 아이콘 이름과 정확히 일치 (예: "cart" → cart)
2. **동의어 매칭** — synonym 테이블에서 검색 (예: "장바구니" → cart)
3. **부분 매칭** — 아이콘 이름에 포함 (예: "chevron" → chevron_down, chevron_up, ...)
4. **역방향 매칭** — synonym 키에 부분 포함

## 규칙

- **항상 `<YdsIcon name="..." />` 컴포넌트를 사용할 것** (인라인 SVG 금지)
- 찾은 아이콘이 없으면 사용자에게 알리고, 가장 가까운 대안을 제시할 것
- `_s` suffix = small variant, `_filled` suffix = filled variant
- `nav_` prefix = 바텀네비 전용 아이콘

## 전체 아이콘 목록 (122개)

19_circle, add, add_s, alarm, arrow_down, arrow_down_s, arrow_left, arrow_left_s, arrow_right, arrow_right_s, arrow_up, arrow_up_s, attached, bag, benefit, calendar, calendar_month, camera, card, cart, chat_quit, check, check_s, chevron_down, chevron_down_filled, chevron_down_s, chevron_left, chevron_left_s, chevron_right, chevron_right_filled, chevron_right_s, chevron_up, chevron_up_s, clock, clock_filled, close, close_filled, close_fullscreen, close_s, closed_store, copy, copy_filled, counseling_chat, coupon, coupon_filled, coupon_ticket, delete, doublechevron_left_s, doublechevron_right_s, download, email, event_available, exclamation, exclamation_filled, expand, file, file_check, file_upload, file_upload_s, filter, filter_list, gear, gear_filled, gift, gps, hamburger, heart, heart_filled, helmet, helmet_filled, house, house_filled, information, information_filled, link, link_off, linkarrow_filled, location_l, medical, monitor, more_horiz, more_vert_s, mymenu, nav_benefit, nav_benefit_filled, nav_heart, nav_heart_filled, nav_house, nav_house_filled, nav_mymenu, nav_mymenu_filled, nav_receipt, nav_receipt_filled, new_filled, notice, open_in_new, open_store, order, order_filled, phone, picture, point, receipt, refresh, remove, remove_s, review, robo, safety_hygiene, search, share, sign, spoon, store, store_door, store_filled, switch_horizontal, switch_vertical, takeout, task, thumb_up, thumb_up_filled, triangle_down, triangle_down_s, triangle_left, triangle_left_s, triangle_right, triangle_right_s, triangle_up, triangle_up_s, warning, write
