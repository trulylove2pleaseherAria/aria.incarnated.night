import { t as ARIAHUS_SYSTEM } from "./lore-CJWDHwFa.mjs";
import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/speak-DTXMh3AO.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var speakWithAriyahus_createServerFn_handler = createServerRpc({
	id: "5cb421820f4d59e564482a1b8cb28edf8831e5d394598546b9e05c87ed5a5560",
	name: "speakWithAriyahus",
	filename: "src/lib/aria/speak.ts"
}, (opts) => speakWithAriyahus.__executeServer(opts));
var speakWithAriyahus = createServerFn({ method: "POST" }).validator((input) => {
	if (typeof input !== "object" || input === null) throw new Error("Invalid request");
	const rec = input;
	if (typeof rec.message !== "string") throw new Error("Message required");
	const message = rec.message.trim().slice(0, 500);
	if (!message) throw new Error("Message required");
	const history = [];
	if (Array.isArray(rec.history)) for (const turn of rec.history.slice(-8)) {
		if (!turn || typeof turn !== "object") continue;
		const t = turn;
		if ((t.role === "user" || t.role === "assistant") && typeof t.content === "string") history.push({
			role: t.role,
			content: t.content.slice(0, 1600)
		});
	}
	return {
		message,
		history
	};
}).handler(speakWithAriyahus_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "Ariyahus is silent in this realm."
	};
	const messages = [
		{
			role: "system",
			content: ARIAHUS_SYSTEM
		},
		...data.history,
		{
			role: "user",
			content: data.message
		}
	];
	try {
		const res = await fetch("https://api.x.ai/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: "grok-4.5",
				messages,
				max_tokens: 220,
				temperature: .85
			})
		});
		if (!res.ok) return {
			ok: false,
			error: "The heavens do not answer just now."
		};
		const text = (await res.json()).choices?.[0]?.message?.content?.trim() ?? "";
		if (!text) return {
			ok: false,
			error: "Only wind through the shrines."
		};
		return {
			ok: true,
			text
		};
	} catch {
		return {
			ok: false,
			error: "The heavens do not answer just now."
		};
	}
});
//#endregion
export { speakWithAriyahus_createServerFn_handler };
