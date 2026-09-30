import { useEffect, useState, type ComponentType } from "react";
import { useAria } from "@/lib/aria/store";
import { Splash } from "./Splash";
import { Hud } from "./Hud";
import { TouchControls } from "./TouchControls";
import { ChatPanel, JournalPanel, LyricsDock } from "./Panels";

type SceneProps = { playing: boolean };

export function AriaApp() {
  const phase = useAria((s) => s.phase);
  const toggleChat = useAria((s) => s.toggleChat);
  const toggleJournal = useAria((s) => s.toggleJournal);
  const toggleMute = useAria((s) => s.toggleMute);
  const toggleLyrics = useAria((s) => s.toggleLyrics);
  const playing = phase === "playing";
  const [Scene, setScene] = useState<ComponentType<SceneProps> | null>(null);

  useEffect(() => {
    void import("@/lib/game/AriaScene").then((m) => setScene(() => m.AriaScene));
  }, []);

  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      const typing =
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          (el as HTMLElement).isContentEditable);
      if (typing || e.repeat) return;
      if (e.code === "KeyC") toggleChat();
      if (e.code === "KeyJ") toggleJournal();
      if (e.code === "KeyM") toggleMute();
      if (e.code === "KeyL") toggleLyrics();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playing, toggleChat, toggleJournal, toggleMute, toggleLyrics]);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-bg text-fg">
      <div className="absolute inset-0">
        {Scene ? (
          <Scene playing={playing} />
        ) : (
          <img
            src="/textures/cosmos.jpg"
            alt=""
            className="h-full w-full object-cover"
          />
        )}
      </div>
      {playing ? (
        <div className="pointer-events-none absolute inset-0">
          <Hud />
          <LyricsDock />
          <TouchControls />
          <ChatPanel />
          <JournalPanel />
        </div>
      ) : (
        <Splash />
      )}
    </div>
  );
}
