# AI Agent Memory Sync Protocol

**Purpose:** Ensure AI agent context persists across sessions and is accessible via Git repository.

---

## Architecture

```
AI Agent Internal Memory (/memories/)
           ↓ (auto-sync)
GitHub Repository (.github/memory/)
           ↓ (git commit)
Persistent Storage (version controlled)
```

---

## Auto-Sync Rules

### When to Sync

**ALWAYS sync after:**

1. ✅ Completing feature implementation
2. ✅ Major architectural changes
3. ✅ Adding new libraries/dependencies
4. ✅ Updating `.github/copilot-instructions.md`
5. ✅ End of development session
6. ✅ Before context window reset

### What to Sync

**Files to maintain:**

- `session-progress.md` - Current state, completed work, next priorities
- `architecture-decisions.md` - Major architectural choices and rationale
- `implementation-notes.md` - Active implementation details
- `library-recommendations.md` - Context7 library evaluations

### Sync Process

```bash
# 1. AI agent updates internal memory
memory → update /memories/session-progress.md

# 2. Copy to Git repository
create_file → .github/memory/session-progress.md

# 3. Commit changes (if substantive)
git add .github/memory/
git commit -m "chore: sync AI agent memory"
git push
```

---

## Memory Files Structure

### `.github/memory/session-progress.md`

**Content:**

- Latest session summary
- Completed phases with commits
- Current repository state
- Validation results
- Next priorities
- Commands reference
- Known gotchas

**Update Frequency:** After each feature completion

---

### `.github/memory/architecture-decisions.md`

**Content:**

- Major architectural choices
- Trade-offs and rationale
- Technology selections
- Performance decisions
- Security considerations

**Update Frequency:** When making architectural changes

---

### `.github/memory/implementation-notes.md`

**Content:**

- Active work in progress
- Implementation challenges
- Solutions discovered
- Patterns established
- Quick wins documented

**Update Frequency:** During implementation

---

### `.github/memory/library-recommendations.md`

**Content:**

- Context7 library evaluations
- Trust scores and snippet counts
- Integration experiences
- Performance notes
- Alternative considerations

**Update Frequency:** When evaluating new libraries

---

## Integration with copilot-instructions.md

**Relationship:**

- `copilot-instructions.md` = **Stable guidelines** (how to work)
- `.github/memory/` = **Dynamic state** (what's done, what's next)

**Update Flow:**

```
Feature Complete
    ↓
Update .github/memory/session-progress.md (state)
    ↓
Update .github/copilot-instructions.md (if patterns changed)
    ↓
Commit both files
```

**When to Update copilot-instructions.md:**

- ✅ New architectural patterns established
- ✅ New critical gotchas discovered
- ✅ New mandatory workflows added
- ✅ Core technology changes
- ❌ Don't update for: completed phases, progress tracking, session notes

---

## Example Sync Workflow

### Scenario: Completed Phase 9 (API Rate Limiting)

**Step 1: Update memory**

```markdown
# session-progress.md

### Phase 9: API Rate Limiting (100% Complete) ✅

**Commits:** abc123, def456

- Upstash Redis rate limiter integrated
- 3-tier rate limits (anonymous: 10/min, free: 60/min, premium: 300/min)
- Custom error pages
- Tests: 95% coverage
```

**Step 2: Update copilot-instructions.md** (if needed)

````markdown
## API Rate Limiting Pattern

**Implementation:**

- Middleware: `app/middleware.ts`
- Rate limiter: `@upstash/ratelimit`
- Redis storage: Upstash Redis

**Usage:**

```typescript
import { ratelimit } from "@/lib/ratelimit";
const { success } = await ratelimit.limit(userId);
if (!success)
  return NextResponse.json({ error: "Rate limit" }, { status: 429 });
```
````

````

**Step 3: Commit**
```bash
git add .github/memory/session-progress.md
git add .github/copilot-instructions.md  # if updated
git commit -m "feat: complete Phase 9 API rate limiting"
git push
````

---

## Benefits

1. **Persistence:** Context survives VS Code updates, system reboots
2. **Collaboration:** Other developers/agents can read current state
3. **History:** Git tracks evolution of implementation decisions
4. **Onboarding:** New agents can quickly understand project state
5. **Debugging:** Historical context helps troubleshoot issues

---

## Best Practices

### ✅ DO

- Sync after each significant milestone
- Keep session-progress.md current (< 1 day old)
- Document gotchas as soon as discovered
- Update library recommendations with trust scores
- Commit memory syncs separately from code changes

### ❌ DON'T

- Sync trivial changes (typo fixes, formatting)
- Include sensitive data (API keys, passwords)
- Duplicate content between memory files
- Let memory files diverge from actual state
- Forget to sync before long breaks

---

## File Ownership

**`.github/copilot-instructions.md`**

- Owner: Human developers + AI agents (collaborative)
- Changes: Reviewed before commit
- Purpose: Stable guidelines for all agents

**`.github/memory/`**

- Owner: AI agents (autonomous)
- Changes: Committed automatically
- Purpose: Dynamic state tracking

---

## Recovery Scenarios

### Scenario 1: Context Window Reset

**Problem:** AI agent loses session context  
**Solution:** Read `.github/memory/session-progress.md` first thing

### Scenario 2: New AI Agent Session

**Problem:** Fresh agent needs project context  
**Solution:**

1. Read `.github/copilot-instructions.md` (how to work)
2. Read `.github/memory/session-progress.md` (current state)
3. Read `DEV_ROADMAP.md` (priorities)

### Scenario 3: Diverged State

**Problem:** Memory doesn't match actual codebase  
**Solution:**

1. Run validation: `npm run lint && npx tsc --noEmit && npm run build`
2. Check Git status: `git status`
3. Update memory to reflect actual state
4. Commit corrections

---

**Established:** November 4, 2025  
**Last Review:** November 4, 2025  
**Next Review:** When protocol needs updating
