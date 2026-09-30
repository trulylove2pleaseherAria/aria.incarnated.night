import { useEffect, type ReactNode } from "react";
import { BookOpen, KeyRound, MessageCircle, Music, Volume2, VolumeX } from "lucide-react";
import { FORMS, TOTAL_KEYS } from "@/lib/aria/lore";
import { useAria } from "@/lib/aria/store";
import { setMuted } from "@/lib/aria/audio";

export function Hud() {
  const collected = useAria((s) => s.collected);
  const formIndex = useAria((s) => s.formIndex);
  const muted = useAria((s) => s.muted);
  const lyricsOn = useAria((s) => s.lyricsOn);
  const toggleMute = useAria((s) => s.toggleMute);
  const toggleChat = useAria((s) => s.toggleChat);
  const toggleJournal = useAria((s) => s.toggleJournal);
  const toggleLyrics = useAria((s) => s.toggleLyrics);
  const notice = useAria((s) => s.notice);
  const setNotice = useAria((s) => s.setNotice);
  const form = FORMS[formIndex] ?? FORMS[0];
  const keys = collected.length;
  const progress = (keys / TOTAL_KEYS) * 100;

  useEffect(() => {
    setMuted(muted);
  }, [muted]);

  useEffect(() => {
    if (!notice) return;
    const t = window.setTimeout(() => setNotice(null), 2800);
    return () => window.clearTimeout(t);
  }, [notice, setNotice]);

  return (
    <>
      <div className="hud-panel pointer-events-auto absolute top-3 left-3 z-20 w-[min(16.5rem,calc(100%-7.5rem))] rounded-xl p-3.5 sm:top-4 sm:left-4">
        <p className="text-[10px] font-medium tracking-[0.2em] text-gold uppercase">Sovereign vessel</p>
        <div className="mt-2 flex items-baseline justify-between gap-3">
          <span className="font-display text-lg leading-none text-fg">{form.name}</span>
          <span className="font-mono text-[11px] text-muted tabular-nums">{keys} / {TOTAL_KEYS}</span>
        </div>
        <p className="mt-1 text-[11px] text-muted">{form.desc}</p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-elevated">
          <div
            className="h-full rounded-full bg-gold transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[10px] text-subtle">
          <span className="inline-flex items-center gap-1">
            <KeyRound className="size-3" strokeWidth={1.75} />
            Divine keys
          </span>
          <span className="font-mono tabular-nums">56.23 Hz</span>
        </div>
      </div>

      <div className="pointer-events-auto absolute top-3 right-3 z-20 flex flex-col gap-2 sm:top-4 sm:right-4">
        <IconBtn label={muted ? "Unmute" : "Mute"} onClick={toggleMute}>
          {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </IconBtn>
        <IconBtn label="Lyrics" onClick={toggleLyrics} active={lyricsOn}>
          <Music className="size-4" />
        </IconBtn>
        <IconBtn label="Speak with Ariyahus" onClick={toggleChat}>
          <MessageCircle className="size-4" />
        </IconBtn>
        <IconBtn label="Journal" onClick={toggleJournal}>
          <BookOpen className="size-4" />
        </IconBtn>
      </div>

      {notice && (
        <div className="pointer-events-none absolute top-1/2 left-1/2 z-30 w-[min(20rem,calc(100%-2rem))] -translate-x-1/2 -translate-y-[4.5rem] rounded-xl border border-border bg-surface/95 px-5 py-4 text-center shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
          <p className="font-display text-base text-fg">{notice}</p>
        </div>
      )}
    </>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  active,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={
        "hud-panel flex size-11 items-center justify-center rounded-lg text-fg transition-opacity duration-150 " +
        (active ? "border-gold/50 text-gold" : "hover:opacity-90")
      }
    >
      {children}
    </button>
  );
}
