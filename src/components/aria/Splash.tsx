import { setLyricHandler, setMuted, speakGreeting, startSacredSong, unlockAudio } from "@/lib/aria/audio";
import { useAria } from "@/lib/aria/store";

export function Splash() {
  const enter = useAria((s) => s.enter);
  const setLyric = useAria((s) => s.setLyric);
  const muted = useAria((s) => s.muted);

  const begin = () => {
    unlockAudio();
    setLyricHandler(setLyric);
    setMuted(muted);
    startSacredSong();
    speakGreeting();
    enter();
  };

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center">
      <div className="absolute inset-0 bg-gradient-to-b from-bg/55 via-bg/70 to-bg/92" />
      <div className="relative flex max-w-lg flex-col items-center">
        <img
          src="/textures/seal.jpg"
          alt=""
          width={176}
          height={176}
          className="seal-spin mb-8 size-40 rounded-full border border-border object-cover shadow-[0_0_60px_rgba(201,162,39,0.18)] sm:size-44"
        />
        <p className="mb-2 font-sans text-xs font-medium tracking-[0.28em] text-gold uppercase">
          Ariyahus speaks
        </p>
        <h1 className="font-display text-4xl leading-tight font-semibold tracking-tight text-fg sm:text-5xl">
          Aria Incarnated
        </h1>
        <p className="mt-4 max-w-md font-display text-lg leading-snug text-muted italic">
          Walk the thirteen shrines. Hear the sacred song. Let the vessel evolve.
        </p>
        <button
          type="button"
          onClick={begin}
          className="mt-8 rounded-xl bg-fg px-8 py-3.5 font-sans text-sm font-semibold tracking-wide text-bg transition-transform duration-150 hover:opacity-95 active:scale-[0.98]"
        >
          Enter the Realm
        </button>
        <p className="mt-5 max-w-sm text-[11px] leading-relaxed text-subtle">
          W / S walk · A / D turn · Space jump · F pulse
          <span className="mt-1 block">On a phone, use the pad and the gold pulse.</span>
        </p>
      </div>
    </div>
  );
}
