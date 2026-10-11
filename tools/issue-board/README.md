# Issue board publisher

Source of truth for the Dopamine epic/task board.

| File | Role |
| --- | --- |
| `board.json` | Epics + ordered TDD tasks (failing-test titles, defs, MVP vs post-MVP) |
| `publish.mjs` | Creates GitHub Issues, sub-issues, and `blocked_by` edges |
| `published.json` | Number map from the last successful publish (committed for agents) |
| `../docs/agents/mvp-board.md` | Human-readable MVP scope |

## Publish

```bash
node tools/issue-board/publish.mjs
```

Requires `gh` auth with permission to create issues (and sub-issues / dependencies).  
Label creation is optional — titles encode `[EPIC]/[TASK]` and `[MVP]`/`[POST-MVP]`.

Do **not** re-run publish against a repo that already has the board unless you intend to duplicate issues.
