// 마우스 드래그로 가로 스크롤 — 모바일 터치 시뮬레이션
// 사용법: const handlers = useDragScroll(ref);
// <div ref={ref} {...handlers} style={{ overflowX: "auto" }}>

import { useCallback, useRef } from "react";

export function useDragScroll(scrollRef) {
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);

  const onMouseDown = useCallback((e) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    startX.current = e.clientX;
    startScrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = "grabbing";
    e.preventDefault();
  }, [scrollRef]);

  const onMouseMove = useCallback((e) => {
    if (!isDragging.current || !scrollRef.current) return;
    const dx = e.clientX - startX.current;
    scrollRef.current.scrollLeft = startScrollLeft.current - dx;
  }, [scrollRef]);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  }, [scrollRef]);

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave: onMouseUp,
    style: { cursor: "grab" },
  };
}
