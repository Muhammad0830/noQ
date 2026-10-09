"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const ROW_H = 32;
const VISIBLE_ROWS = 5;
const PAD = (ROW_H * (VISIBLE_ROWS - 1)) / 2;

interface WheelItem {
  key: string;
  label: string;
  /** Digits that typeahead matches against (e.g. "7", "07"). */
  typed: string[];
}

/**
 * One snap-scroll column. Native scroll-snap supplies the momentum and
 * the exact landing; a settle timer commits the centered row. The
 * selected row magnifies subtly as it passes the center band.
 */
function Wheel({
  items,
  index,
  onCommit,
  label,
  reduced,
}: {
  items: WheelItem[];
  index: number;
  onCommit: (index: number) => void;
  label: string;
  reduced: boolean;
}) {
  const id = React.useId();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [visual, setVisual] = React.useState(index);
  const settleRef = React.useRef<ReturnType<typeof setTimeout>>(null);
  const typeRef = React.useRef<{ buffer: string; at: number }>({
    buffer: "",
    at: 0,
  });
  // Tracks the index this wheel last reported, so external syncs are
  // distinguishable from our own scroll commits.
  const committedRef = React.useRef(index);

  const scrollTo = React.useCallback(
    (i: number, smooth: boolean) => {
      scrollRef.current?.scrollTo({
        top: i * ROW_H,
        behavior: smooth && !reduced ? "smooth" : "auto",
      });
    },
    [reduced],
  );

  // Initial position: land instantly, no scroll animation on mount.
  const mountedRef = React.useRef(false);
  React.useLayoutEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    scrollTo(index, false);
  }, [index, scrollTo]);

  // External value changes glide to the new row.
  React.useEffect(() => {
    if (index !== committedRef.current) {
      committedRef.current = index;
      setVisual(index);
      scrollTo(index, true);
    }
  }, [index, scrollTo]);

  React.useEffect(() => {
    return () => {
      if (settleRef.current) clearTimeout(settleRef.current);
    };
  }, []);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const i = Math.max(
      0,
      Math.min(items.length - 1, Math.round(el.scrollTop / ROW_H)),
    );
    setVisual(i);
    if (settleRef.current) clearTimeout(settleRef.current);
    settleRef.current = setTimeout(() => {
      if (i !== committedRef.current) {
        committedRef.current = i;
        onCommit(i);
      }
    }, 120);
  };

  const jump = (i: number) => {
    const next = Math.max(0, Math.min(items.length - 1, i));
    committedRef.current = next;
    setVisual(next);
    scrollTo(next, true);
    onCommit(next);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      jump(visual + (e.key === "ArrowUp" ? -1 : 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      jump(0);
    } else if (e.key === "End") {
      e.preventDefault();
      jump(items.length - 1);
    } else if (/^[0-9a-z]$/i.test(e.key)) {
      const now = performance.now(); // eslint-disable-line
      const t = typeRef.current;
      const buffer =
        now - t.at < 800 ? t.buffer + e.key.toLowerCase() : e.key.toLowerCase();
      typeRef.current = { buffer, at: now };
      const exact = items.findIndex((it) => it.typed.includes(buffer));
      const prefix = items.findIndex((it) =>
        it.typed.some((s) => s.startsWith(buffer)),
      );
      const hit = exact >= 0 ? exact : prefix;
      if (hit >= 0) jump(hit);
      else typeRef.current = { buffer: e.key.toLowerCase(), at: now };
    }
  };

  return (
    <div
      ref={scrollRef}
      role="listbox"
      aria-label={label}
      aria-activedescendant={`${id}-${items[visual]?.key}`}
      tabIndex={0}
      onScroll={handleScroll}
      onKeyDown={onKeyDown}
      style={{ height: ROW_H * VISIBLE_ROWS }}
      className="w-20 snap-y snap-mandatory overflow-y-auto overscroll-contain rounded-lg outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-scrollbar]:hidden"
    >
      <div style={{ height: PAD }} aria-hidden />
      {items.map((it, i) => {
        const selected = i === visual;
        return (
          <div
            key={it.key}
            id={`${id}-${it.key}`}
            role="option"
            aria-selected={selected}
            onClick={() => jump(i)}
            style={{ height: ROW_H }}
            className={cn(
              "flex cursor-pointer snap-center items-center justify-center text-md tabular-nums transition-[scale,color,opacity] duration-150 ease-out motion-reduce:scale-100",
              selected
                ? "scale-[1.12] font-medium text-foreground"
                : "scale-100 text-muted-foreground/70 hover:text-muted-foreground",
            )}
          >
            {it.label}
          </div>
        );
      })}
      <div style={{ height: PAD }} aria-hidden />
    </div>
  );
}

export interface TimePickerProps
  extends Omit<React.ComponentProps<"div">, "defaultValue" | "onChange"> {
  /** Canonical 24h "HH:mm" string. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** 12 renders an AM/PM column; 24 runs 00–23. */
  hourCycle?: 12 | 24;
  minuteStep?: number;
  /** Form field name; submits "HH:mm" via a hidden input. */
  name?: string;
}

const pad2 = (n: number) => String(n).padStart(2, "0");

function parseTime(v: string | undefined, step: number): { h: number; m: number } {
  const m = v?.match(/^(\d{1,2}):(\d{2})$/);
  const h = m ? Math.min(23, Number(m[1])) : 9;
  const raw = m ? Math.min(59, Number(m[2])) : 0;
  return { h, m: Math.min(59, Math.round(raw / step) * step) };
}

/**
 * Hour / minute / period snap-scroll wheels: native momentum with
 * scroll-snap landings, a center band the selected row magnifies
 * through, typeahead that jumps ("7", "45", "p"), and arrow-key steps.
 */
export function TimePicker({
  value: valueProp,
  defaultValue = "09:00",
  onValueChange,
  hourCycle = 12,
  minuteStep = 5,
  name,
  className,
  "aria-label": ariaLabel = "Time",
  ...props
}: TimePickerProps) {
  const reduced = useReducedMotion() ?? false;
  const [valueState, setValueState] = React.useState(defaultValue);
  const raw = valueProp !== undefined ? valueProp : valueState;
  const { h, m } = parseTime(raw, minuteStep);

  const commit = (nh: number, nm: number) => {
    const next = `${pad2(nh)}:${pad2(nm)}`;
    setValueState(next);
    onValueChange?.(next);
  };

  const hours: WheelItem[] =
    hourCycle === 24
      ? Array.from({ length: 24 }, (_, i) => ({
        key: String(i),
        label: pad2(i),
        typed: [String(i), pad2(i)],
      }))
      : Array.from({ length: 12 }, (_, i) => {
        const hr = i + 1;
        return { key: String(hr), label: String(hr), typed: [String(hr), pad2(hr)] };
      });

  const minutes: WheelItem[] = Array.from(
    { length: Math.ceil(60 / minuteStep) },
    (_, i) => {
      const min = i * minuteStep;
      return { key: String(min), label: pad2(min), typed: [String(min), pad2(min)] };
    },
  );

  const periods: WheelItem[] = [
    { key: "am", label: "AM", typed: ["a", "am"] },
    { key: "pm", label: "PM", typed: ["p", "pm"] },
  ];

  const hour12 = ((h + 11) % 12) + 1;
  const isPM = h >= 12;
  const hourIndex = hourCycle === 24 ? h : hour12 - 1;
  const minuteIndex = Math.min(minutes.length - 1, Math.round(m / minuteStep));

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn("relative w-fit", className)}
      {...props}
    >
      {/* Center selection band, behind all columns. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 h-8 -translate-y-1/2 rounded-md bg-accent"
      />
      <div className="relative flex gap-1 mask-[linear-gradient(to_bottom,transparent,black_26%,black_74%,transparent)]">
        <Wheel
          key={`hour-${hourCycle}`}
          items={hours}
          index={hourIndex}
          label="Hour"
          reduced={reduced}
          onCommit={(i) =>
            commit(
              hourCycle === 24 ? i : ((i + 1) % 12) + (isPM ? 12 : 0),
              m,
            )
          }
        />
        <span
          aria-hidden
          className="flex h-40 items-center pb-px text-sm font-medium text-muted-foreground"
        >
          :
        </span>
        <Wheel
          key={`minute-${minuteStep}`}
          items={minutes}
          index={minuteIndex}
          label="Minute"
          reduced={reduced}
          onCommit={(i) => commit(h, i * minuteStep)}
        />
        {hourCycle === 12 && (
          <Wheel
            items={periods}
            index={isPM ? 1 : 0}
            label="AM or PM"
            reduced={reduced}
            onCommit={(i) => commit((hour12 % 12) + (i === 1 ? 12 : 0), m)}
          />
        )}
      </div>
      {name && <input type="hidden" name={name} value={`${pad2(h)}:${pad2(m)}`} />}
    </div>
  );
}
