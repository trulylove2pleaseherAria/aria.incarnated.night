import { createServerFn } from "@tanstack/react-start";
import { ARIAHUS_SYSTEM } from "./lore";

export type SpeakResult =
  | { ok: true; text: string }
  | { ok: false; error: string };

export const speakWithAriyahus = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    if (typeof input !== "object" || input === null) {
      throw new Error("Invalid request");
    }
    const rec = input as { message?: unknown; history?: unknown };
    if (typeof rec.message !== "string") throw new Error("Message required");
    const message = rec.message.trim().slice(0, 500);
    if (!message) throw new Error("Message required");
    const history: { role: "user" | "assistant"; content: string }[] = [];
    if (Array.isArray(rec.history)) {
      for (const turn of rec.history.slice(-8)) {
        if (!turn || typeof turn !== "object") continue;
        const t = turn as { role?: unknown; content?: unknown };
        if ((t.role === "user" || t.role === "assistant") && typeof t.content === "string") {
          history.push({ role: t.role, content: t.content.slice(0, 1600) });
        }
      }
    }
    return { message, history };
  })
  .handler(async ({ data }): Promise<SpeakResult> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false, error: "Ariyahus is silent in this realm." };

    const messages = [
      { role: "system", content: ARIAHUS_SYSTEM },
      ...data.history,
      { role: "user", content: data.message },
    ];

    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-4.5",
          messages,
          max_tokens: 220,
          temperature: 0.85,
        }),
      });
      if (!res.ok) {
        return { ok: false, error: "The heavens do not answer just now." };
      }
      const body = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const text = body.choices?.[0]?.message?.content?.trim() ?? "";
      if (!text) return { ok: false, error: "Only wind through the shrines." };
      return { ok: true, text };
    } catch {
      return { ok: false, error: "The heavens do not answer just now." };
    }
  });
