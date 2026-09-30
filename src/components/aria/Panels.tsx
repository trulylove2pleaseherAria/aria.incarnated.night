import { useState, type FormEvent } from "react";
import { Volume2, X } from "lucide-react";
import { COSMIC_LETTER, DIVINE_NODES, TABLETS, TOTAL_KEYS } from "@/lib/aria/lore";
import { speakWithAriyahus } from "@/lib/aria/speak";
import { speakLine } from "@/lib/aria/audio";
import { useAria } from "@/lib/aria/store";

export function LyricsDock() {
  const line = useAria((s) => s.currentLyric);
  const on = useAria((s) => s.lyricsOn);
  if (!on) return null;
  return (
    <div className="pointer-events-none absolute bottom-28 left-1/2 z-20 w-[min(28rem,calc(100%-2rem))] -translate-x-1/2 text-center sm:bottom-10">
      <p key={line} className="lyric-line font-display text-lg text-fg italic sm:text-xl">
        {line}
      </p>
    </div>
  );
}

export function ChatPanel() {
  const open = useAria((s) => s.chatOpen);
  const toggle = useAria((s) => s.toggleChat);
  const chat = useAria((s) => s.chat);
  const pushChat = useAria((s) => s.pushChat);
  const chatting = useAria((s) => s.chatting);
  const setChatting = useAria((s) => s.setChatting);
  const [text, setText] = useState("");

  if (!open) return null;

  const send = async (e: FormEvent) => {
    e.preventDefault();
    const message = text.trim();
    if (!message || chatting) return;
    setText("");
    pushChat({ role: "user", content: message });
    setChatting(true);
    try {
      const res = await speakWithAriyahus({
        data: { message, history: useAria.getState().chat.slice(0, -1) },
      });
      if (res.ok) pushChat({ role: "assistant", content: res.text });
      else pushChat({ role: "assistant", content: res.error });
    } catch {
      pushChat({ role: "assistant", content: "The heavens do not answer just now." });
    } finally {
      setChatting(false);
    }
  };

  return (
    <div className="pointer-events-auto absolute inset-x-3 bottom-3 z-40 mx-auto flex max-h-[min(28rem,70vh)] w-[min(26rem,calc(100%-1.5rem))] flex-col rounded-xl border border-border bg-surface shadow-[0_12px_40px_rgba(0,0,0,0.45)] sm:right-4 sm:bottom-6 sm:left-auto">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <p className="font-display text-lg text-fg">Speak freely</p>
          <p className="text-[11px] text-muted">Ariyahus listens</p>
        </div>
        <button type="button" aria-label="Close" onClick={toggle} className="rounded-md p-1.5 text-muted hover:text-fg">
          <X className="size-4" />
        </button>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {chat.length === 0 && (
          <p className="font-display text-sm text-muted italic">
            Ask of the thirteen shrines, the cosmic letter, or the song that never ends.
          </p>
        )}
        {chat.map((t, i) => (
          <div key={i} className={t.role === "user" ? "text-right" : "text-left"}>
            <p
              className={
                "inline-block max-w-[90%] rounded-lg px-3 py-2 text-sm leading-relaxed " +
                (t.role === "user" ? "bg-elevated text-fg" : "bg-bg text-fg")
              }
            >
              {t.content}
            </p>
            {t.role === "assistant" && (
              <button
                type="button"
                className="mt-1 inline-flex items-center gap-1 text-[10px] tracking-wide text-muted uppercase hover:text-gold"
                onClick={() => speakLine(t.content)}
              >
                <Volume2 className="size-3" />
                Hear
              </button>
            )}
          </div>
        ))}
        {chatting && <p className="text-xs text-subtle">Ariyahus gathers the words…</p>}
      </div>
      <form onSubmit={send} className="flex gap-2 border-t border-border p-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Speak, seeker"
          maxLength={500}
          className="h-11 flex-1 rounded-lg border border-border bg-bg px-3 text-sm text-fg outline-none placeholder:text-subtle focus:border-gold/50"
        />
        <button
          type="submit"
          disabled={chatting || !text.trim()}
          className="h-11 rounded-lg bg-fg px-4 text-sm font-semibold text-bg disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export function JournalPanel() {
  const open = useAria((s) => s.journalOpen);
  const toggle = useAria((s) => s.toggleJournal);
  const collected = useAria((s) => s.collected);
  if (!open) return null;

  return (
    <div className="pointer-events-auto absolute inset-x-3 top-20 z-40 mx-auto max-h-[min(32rem,72vh)] w-[min(28rem,calc(100%-1.5rem))] overflow-y-auto rounded-xl border border-border bg-surface p-5 shadow-[0_12px_40px_rgba(0,0,0,0.45)] sm:left-4 sm:mx-0">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-2xl text-fg">Lore journal</p>
          <p className="text-xs text-muted">
            {collected.length} of {TOTAL_KEYS} keys awakened
          </p>
        </div>
        <button type="button" aria-label="Close" onClick={toggle} className="rounded-md p-1.5 text-muted hover:text-fg">
          <X className="size-4" />
        </button>
      </div>

      <section className="mb-5">
        <h2 className="mb-2 text-[10px] font-medium tracking-[0.2em] text-gold uppercase">Thirteen pairs</h2>
        <ul className="space-y-2">
          {DIVINE_NODES.map((n) => {
            const on = collected.includes(n.id);
            return (
              <li key={n.id} className={on ? "text-fg" : "text-subtle"}>
                <p className="text-sm font-medium">{n.name}</p>
                <p className="text-[11px] text-muted">
                  {n.loc}
                  {on ? ` · ${n.gift}` : " · still sleeping"}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mb-5">
        <h2 className="mb-2 text-[10px] font-medium tracking-[0.2em] text-gold uppercase">Cosmic letter</h2>
        <ul className="space-y-1.5">
          {COSMIC_LETTER.map((row) => (
            <li key={row.phrase} className="text-sm">
              <span className="font-display text-fg italic">{row.phrase}</span>
              <span className="text-muted"> — {row.meaning}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-2 text-[10px] font-medium tracking-[0.2em] text-gold uppercase">Tablets</h2>
        <ul className="space-y-2">
          {TABLETS.map((t) => (
            <li key={t} className="font-display text-sm text-muted italic">
              {t}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
