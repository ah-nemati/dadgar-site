"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const START_AT = 9;
const FINISH_DELAY = 180;
const SAFETY_TIMEOUT = 5000;

export default function RouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams.toString()}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const activeRef = useRef(false);
  const firstRender = useRef(true);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safetyRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const paint = useCallback((value: number) => {
    progressRef.current = Math.max(0, Math.min(100, value));
    if (barRef.current) {
      barRef.current.style.transform = `scaleX(${progressRef.current / 100})`;
    }
  }, []);

  const clearTimers = useCallback(() => {
    if (tickRef.current) clearInterval(tickRef.current);
    if (hideRef.current) clearTimeout(hideRef.current);
    if (safetyRef.current) clearTimeout(safetyRef.current);
    tickRef.current = null;
    hideRef.current = null;
    safetyRef.current = null;
  }, []);

  const finish = useCallback(() => {
    if (!activeRef.current) return;
    activeRef.current = false;

    if (tickRef.current) clearInterval(tickRef.current);
    if (safetyRef.current) clearTimeout(safetyRef.current);
    tickRef.current = null;
    safetyRef.current = null;

    paint(100);
    hideRef.current = setTimeout(() => {
      containerRef.current?.classList.remove("route-progress--visible");
      paint(0);
    }, FINISH_DELAY);
  }, [paint]);

  const start = useCallback(() => {
    clearTimers();
    activeRef.current = true;
    containerRef.current?.classList.add("route-progress--visible");
    paint(START_AT);

    tickRef.current = setInterval(() => {
      const current = progressRef.current;
      if (current >= 90) return;
      const remaining = 90 - current;
      paint(Math.min(90, current + Math.max(1.5, remaining * 0.14)));
    }, 180);

    safetyRef.current = setTimeout(finish, SAFETY_TIMEOUT);
  }, [clearTimers, finish, paint]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    finish();
  }, [routeKey, finish]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element)
      ) {
        return;
      }

      const anchor = event.target.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const nextUrl = new URL(anchor.href, window.location.href);
      const currentUrl = new URL(window.location.href);
      if (nextUrl.origin !== currentUrl.origin) return;
      if (nextUrl.href === currentUrl.href) return;
      if (
        nextUrl.pathname === currentUrl.pathname &&
        nextUrl.search === currentUrl.search &&
        nextUrl.hash
      ) {
        return;
      }

      start();
    };

    const onPopState = () => start();

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
      clearTimers();
    };
  }, [clearTimers, start]);

  return (
    <div ref={containerRef} className="route-progress" aria-hidden="true">
      <div ref={barRef} className="route-progress__bar" />
    </div>
  );
}
