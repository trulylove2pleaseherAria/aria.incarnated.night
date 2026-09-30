import { useRef, type PointerEvent } from "react";
import { touch } from "@/lib/game/input";

export function TouchControls() {
  const pad = useRef<HTMLDivElement>(null);

  const setFromEvent = (e: PointerEvent) => {
    const el = pad.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    const m = Math.hypot(dx, dy);
    const scale = m > 1 ? 1 / m : 1;
    const x = dx * scale;
    const y = dy * scale;
    touch.steer = Math.max(-1, Math.min(1, -x));
    touch.forward = Math.max(-1, Math.min(1, -y));
  };

  const end = (e: PointerEvent) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
    touch.steer = 0;
    touch.forward = 0;
  };

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between px-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
      <div
        ref={pad}
        className="pointer-events-auto relative size-32 rounded-full border border-border bg-surface/70 sm:size-36"
        style={{ touchAction: "none" }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setFromEvent(e);
        }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) setFromEvent(e);
        }}
        onPointerUp={end}
        onPointerCancel={end}
      >
        <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] tracking-wider text-muted">W</span>
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] tracking-wider text-muted">S</span>
        <span className="absolute top-1/2 left-2.5 -translate-y-1/2 text-[10px] tracking-wider text-muted">A</span>
        <span className="absolute top-1/2 right-2.5 -translate-y-1/2 text-[10px] tracking-wider text-muted">D</span>
        <span className="absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald/70" />
      </div>

      <div className="pointer-events-auto mb-1 flex flex-col gap-3">
        <button
          type="button"
          className="size-[4.25rem] rounded-full border border-gold/40 bg-gold font-sans text-[11px] font-semibold tracking-wide text-bg shadow-[0_8px_24px_rgba(0,0,0,0.4)] active:scale-95"
          style={{ touchAction: "none" }}
          onPointerDown={(e) => {
            e.preventDefault();
            touch.pulseHeld = true;
          }}
          onPointerUp={() => {
            touch.pulseHeld = false;
          }}
          onPointerCancel={() => {
            touch.pulseHeld = false;
          }}
        >
          Pulse
        </button>
        <button
          type="button"
          className="size-[4.25rem] rounded-full border border-border bg-emerald font-sans text-[11px] font-semibold tracking-wide text-bg shadow-[0_8px_24px_rgba(0,0,0,0.4)] active:scale-95"
          style={{ touchAction: "none" }}
          onPointerDown={(e) => {
            e.preventDefault();
            touch.jumpHeld = true;
          }}
          onPointerUp={() => {
            touch.jumpHeld = false;
          }}
          onPointerCancel={() => {
            touch.jumpHeld = false;
          }}
        >
          Jump
        </button>
      </div>
    </div>
  );
}
