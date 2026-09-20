# Alerts

Most notifications are **generated from media/post metadata** at runtime (`defs/08_content.md`).

Optional curated lines live in `templates.json` (schema: `templates.example.json`). Hand templates merge with algorithmic ones — rare specials, satire, and spam noise. **Missing/empty file is fine**; the game still runs.

| Field | Meaning |
| --- | --- |
| `source` | `pulse` · `loop` · `wave` · `echo` · `system` · `standalone` · `spam` |
| `priority` | `low` · `normal` · `high` (urgency / Attention Request weight) |
| `rewardable` | `false` for spam and intentionally useless filler (no Dopamine) |
| `body` | Copy; may use `{user}`, `{topic}`, `{noun}`, `{place}`, `{creatorLabel}`, `{title}`, `{tag}`, `{pace}`, `{momentLabel}` |

Window logos used on alerts live in `../icons/`.
