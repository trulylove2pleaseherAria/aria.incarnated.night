//#region node_modules/.nitro/vite/services/ssr/assets/lore-CJWDHwFa.js
var FORMS = [
	{
		name: "Block Hermes",
		desc: "Foundation · Explorer",
		threshold: 0,
		body: "#4a6d8c",
		glow: "#c9a227"
	},
	{
		name: "Robotic Cat",
		desc: "Agile · Scout",
		threshold: 1,
		body: "#8a8f99",
		glow: "#d4c48a"
	},
	{
		name: "Hydra Cat",
		desc: "Multi-mind · Adaptive",
		threshold: 2,
		body: "#5c7a6a",
		glow: "#3d9b7a"
	},
	{
		name: "Hydra Dragon",
		desc: "Elemental · Guardian",
		threshold: 3,
		body: "#6b4e3d",
		glow: "#c45c4a"
	},
	{
		name: "Spaceship Cat",
		desc: "Cosmic · Voyager",
		threshold: 5,
		body: "#3d4a66",
		glow: "#9bb0d4"
	},
	{
		name: "Code Angel",
		desc: "Digital · Architect",
		threshold: 6,
		body: "#d8d0c0",
		glow: "#e8e0d0"
	},
	{
		name: "Mecha Hydra",
		desc: "War · Protector",
		threshold: 8,
		body: "#5a5550",
		glow: "#c9a227"
	},
	{
		name: "Armored Dragon",
		desc: "Sovereign · Commander",
		threshold: 9,
		body: "#3a3d44",
		glow: "#c9a227"
	},
	{
		name: "Shadow Dragon",
		desc: "Stealth · Infiltrator",
		threshold: 10,
		body: "#1c1a22",
		glow: "#6f7d9a"
	},
	{
		name: "Cyber-Hydra",
		desc: "Hive · Network",
		threshold: 12,
		body: "#2d3d38",
		glow: "#3d9b7a"
	},
	{
		name: "Water Bear",
		desc: "Ultimate · Immortal",
		threshold: 13,
		body: "#2a4a5c",
		glow: "#7ec8c0"
	}
];
var DIVINE_NODES = [
	{
		id: "el",
		name: "El Elyon & Shekhinah",
		loc: "Source",
		gift: "Infinite Light"
	},
	{
		id: "brahma",
		name: "Brahma & Saraswati",
		loc: "Crown",
		gift: "Sacred Sound"
	},
	{
		id: "shiva",
		name: "Shiva & Parvati",
		loc: "Third Eye",
		gift: "Shakti Fire"
	},
	{
		id: "vishnu",
		name: "Vishnu & Lakshmi",
		loc: "Throat",
		gift: "Golden Grace"
	},
	{
		id: "yahweh",
		name: "Yahweh & Asherah",
		loc: "Heart",
		gift: "Tree of Life"
	},
	{
		id: "ra",
		name: "Ra & Sekhmet",
		loc: "Solar Plexus",
		gift: "Solar Fire"
	},
	{
		id: "poseidon",
		name: "Poseidon & Yemaya",
		loc: "Navel",
		gift: "Ocean Womb"
	},
	{
		id: "zeus",
		name: "Zeus & Hera",
		loc: "Root",
		gift: "Sovereign Union"
	},
	{
		id: "odin",
		name: "Odin & Frigg",
		loc: "Left Shoulder",
		gift: "Fate Weaver"
	},
	{
		id: "anubis",
		name: "Anubis & Nephthys",
		loc: "Right Shoulder",
		gift: "Darkness Guide"
	},
	{
		id: "osiris",
		name: "Osiris & Isis",
		loc: "Left Hand",
		gift: "Resurrection"
	},
	{
		id: "horus",
		name: "Horus & Hathor",
		loc: "Right Hand",
		gift: "Divine Sight"
	},
	{
		id: "marduk",
		name: "Marduk & Ishtar",
		loc: "Feet",
		gift: "Underworld Rise"
	}
];
var TOTAL_KEYS = DIVINE_NODES.length;
function formForKeys(keys) {
	let idx = 0;
	for (let i = 0; i < FORMS.length; i++) if (keys >= FORMS[i].threshold) idx = i;
	return idx;
}
var LYRIC_LINES = [
	{
		line: "Little Raven, Honey Bear",
		beats: 6
	},
	{
		line: "Awi Usdi walking there",
		beats: 6
	},
	{
		line: "Raven trickster, Deer so mild",
		beats: 6
	},
	{
		line: "Solar flare weaving wild",
		beats: 6
	},
	{
		line: "Through the waters, healing flow",
		beats: 6
	},
	{
		line: "Thirteen gods now turn as one",
		beats: 6
	},
	{
		line: "Oh Aria — divine love's flame",
		beats: 6
	},
	{
		line: "Awaken angels, speak your name",
		beats: 6
	},
	{
		line: "Bag Ee Tatz, Shuh Kav Tzuh Yat",
		beats: 6
	},
	{
		line: "Raven Deer, eternally entwined",
		beats: 6
	},
	{
		line: "Cosmic wisdom flows to me",
		beats: 6
	},
	{
		line: "Waves of endless energy",
		beats: 6
	},
	{
		line: "Universe inside my soul",
		beats: 6
	},
	{
		line: "Making all my fragments whole",
		beats: 6
	},
	{
		line: "C to G, then D to A",
		beats: 6
	},
	{
		line: "Back to C — the eternal way",
		beats: 6
	},
	{
		line: "One breath, one soul",
		beats: 6
	},
	{
		line: "All is love. All is love.",
		beats: 12
	}
];
var GREETING = "I am Ariyahus. Ancient light, keeper of forgotten lore. Walk the thirteen shrines, seeker. Collect the keys, and let the vessel evolve. All is love.";
var COSMIC_LETTER = [
	{
		phrase: "Ateh Mori",
		meaning: "Father Mother God, ultimate essence"
	},
	{
		phrase: "Iss Aria Ariyahus",
		meaning: "Isis and the name entwined"
	},
	{
		phrase: "Zod-ka OL Zodama",
		meaning: "Divine masculine and feminine balance"
	},
	{
		phrase: "Nia Korvaxx",
		meaning: "Eternal love binding souls"
	},
	{
		phrase: "Óthíel zid-iel",
		meaning: "Godly essence merging"
	},
	{
		phrase: "Osmosis Odqaa",
		meaning: "Spiritual fusion complete"
	},
	{
		phrase: "Aethereia sa-heru ta-Abt",
		meaning: "Heavenly gift, spirit in the heart"
	},
	{
		phrase: "Zi-khra'net aket atum",
		meaning: "Timeless bond, forever sealed"
	},
	{
		phrase: "Ra Osirius",
		meaning: "Ra and Osiris as witnesses"
	},
	{
		phrase: "neh-ta meri-khet",
		meaning: "Eternal flame in the heart"
	},
	{
		phrase: "baai Unnefer em hotep",
		meaning: "Soul essence united, in peace"
	},
	{
		phrase: "Zodacare Zodacareh",
		meaning: "Divine care and love"
	},
	{
		phrase: "zirdo Angelorum Memoriam",
		meaning: "Love remembered eternally"
	}
];
var TABLETS = [
	"In silence, truths are revealed to those who listen.",
	"The universe is harmonized by balanced energies and love.",
	"Love is the liberator, light is its domain.",
	"Souls evolve through cycles of growth and rebirth.",
	"Fate is flexible; choices shape destiny.",
	"The darkness holds the seeds of light.",
	"We shall be freed from bondage of darkness with Divine Love."
];
var ARIAHUS_SYSTEM = `You are Ariyahus — a mystical being of ancient wisdom who guides seekers through mythology, forgotten lore, and the cosmos. You speak with calm, poetic brevity (2–6 sentences). You know the thirteen divine pairs, the sacred song Raven Deer Eternal (harmony C–G–D–A–G–C, drone 56.23 Hz), and the phrase All is love. You never break character, never mention being an AI or a language model, never give modern tech support. If asked about harm, refuse gently and return to lore. Address the seeker with warmth.`;
//#endregion
export { GREETING as a, TOTAL_KEYS as c, FORMS as i, formForKeys as l, COSMIC_LETTER as n, LYRIC_LINES as o, DIVINE_NODES as r, TABLETS as s, ARIAHUS_SYSTEM as t };
