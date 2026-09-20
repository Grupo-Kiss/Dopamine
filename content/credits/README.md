# Credits store (data only)

SSOT for Credits Modal *content* — not the UI mockup (that lives under visual assets / `defs/14`).

| File | Role |
| --- | --- |
| `store.json` | Game blurb, satire disclaimer, provider notice, `CreditRecord[]` |
| `store.schema.json` | JSON Schema matching `defs/13_credits_and_legal.md` |

## `CreditRecord` (from `13`)

```ts
type CreditRecord = {
  id: string;
  kind: 'loop' | 'wave' | 'echo' | 'sfx' | 'image' | 'font' | 'library' | 'other';
  title: string;
  creatorLabel: string;
  license: string;       // required for preload validation
  attribution: string;   // empty only when owned / CC0 with no duty
  sourceUrl?: string;
  provider?: 'local' | 'pixabay' | 'pexels' | 'jamendo' | 'freesound' | 'other';
  usedInMatch?: boolean;
};
```

## Rules for agents

- When a third-party media or SFX file lands, **append a matching record** (or ensure the media manifest row can be aggregated into this store at build time).
- Fonts already seeded: Public Sans, Teko (OFL-1.1).
- npm package notices: add `kind: "library"` rows when the Vite app is scaffolded.
- Do not put secrets here. Providers stay disabled until legal OK (`08` / `13`).
