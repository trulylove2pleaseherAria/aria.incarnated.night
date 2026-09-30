import { create } from "zustand";
import { DIVINE_NODES, FORMS, TOTAL_KEYS, formForKeys } from "./lore";

const SAVE_KEY = "aria-incarnated-v1";

type ChatTurn = { role: "user" | "assistant"; content: string };

type AriaState = {
  phase: "splash" | "playing";
  collected: string[];
  formIndex: number;
  buildMode: boolean;
  chatOpen: boolean;
  journalOpen: boolean;
  lyricsOn: boolean;
  muted: boolean;
  currentLyric: string;
  notice: string | null;
  chat: ChatTurn[];
  chatting: boolean;
  pulseAt: number;
  enter: () => void;
  collectKey: (id: string) => void;
  setLyric: (line: string) => void;
  setNotice: (text: string | null) => void;
  toggleMute: () => void;
  toggleBuild: () => void;
  toggleChat: () => void;
  toggleJournal: () => void;
  toggleLyrics: () => void;
  pushChat: (turn: ChatTurn) => void;
  setChatting: (v: boolean) => void;
  triggerPulse: () => void;
  reset: () => void;
};

function loadCollected(): string[] {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { v?: number; collected?: string[] };
    if (parsed.v !== 1 || !Array.isArray(parsed.collected)) return [];
    return parsed.collected.filter((id) => DIVINE_NODES.some((n) => n.id === id));
  } catch {
    return [];
  }
}

function persist(collected: string[]) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ v: 1, collected }));
  } catch {
    /* ignore quota */
  }
}

export const useAria = create<AriaState>((set, get) => {
  const collected = typeof window !== "undefined" ? loadCollected() : [];
  return {
    phase: "splash",
    collected,
    formIndex: formForKeys(collected.length),
    buildMode: false,
    chatOpen: false,
    journalOpen: false,
    lyricsOn: true,
    muted: false,
    currentLyric: "All is love.",
    notice: null,
    chat: [],
    chatting: false,
    pulseAt: 0,
    enter: () => set({ phase: "playing" }),
    collectKey: (id) => {
      const cur = get().collected;
      if (cur.includes(id)) return;
      const next = [...cur, id];
      persist(next);
      const formIndex = formForKeys(next.length);
      const node = DIVINE_NODES.find((n) => n.id === id);
      const evolved = formIndex !== get().formIndex;
      const form = FORMS[formIndex];
      const msg = node
        ? `${node.name} — ${node.gift}`
        : `Key ${next.length} / ${TOTAL_KEYS}`;
      set({
        collected: next,
        formIndex,
        notice: evolved ? `${msg} · Form: ${form.name}` : msg,
      });
    },
    setLyric: (line) => {
      if (get().currentLyric !== line) set({ currentLyric: line });
    },
    setNotice: (text) => set({ notice: text }),
    toggleMute: () => set({ muted: !get().muted }),
    toggleBuild: () => set({ buildMode: !get().buildMode }),
    toggleChat: () => set({ chatOpen: !get().chatOpen, journalOpen: false }),
    toggleJournal: () => set({ journalOpen: !get().journalOpen, chatOpen: false }),
    toggleLyrics: () => set({ lyricsOn: !get().lyricsOn }),
    pushChat: (turn) => set({ chat: [...get().chat, turn].slice(-16) }),
    setChatting: (v) => set({ chatting: v }),
    triggerPulse: () => set({ pulseAt: performance.now() }),
    reset: () => {
      persist([]);
      set({
        collected: [],
        formIndex: 0,
        notice: "The shrines wait once more.",
      });
    },
  };
});
