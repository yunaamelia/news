# 🎯 Quick Start Guide - Agent Analysis

## Panduan Cepat untuk Memulai Code Review dengan Agent

### 📋 Checklist Sebelum Analisis

```bash
# 1. Pastikan semua dependencies terinstall
npm install

# 2. Jalankan validasi dasar
npm run lint
npx tsc --noEmit
npm run build

# 3. Catat hasilnya untuk baseline comparison
```

---

## 🚀 Template Request untuk Agent

### 1. Code Review Lengkap

```
Tolong lakukan full code review untuk project Berita Finansial ini dengan fokus:

1. Architecture & Structure
   - Apakah struktur folder sudah optimal?
   - Apakah ada file yang salah tempat?
   - Apakah naming convention konsisten?

2. TypeScript Quality
   - Cari semua penggunaan 'any' type
   - Check missing return types
   - Verify interface completeness

3. Performance
   - Identify unnecessary re-renders
   - Check bundle size optimizations
   - Review API caching strategy

4. Security
   - Check for XSS vulnerabilities
   - Verify authentication implementation
   - Review environment variable usage

5. Testing
   - Identify critical functions that need tests
   - Suggest E2E test scenarios
   - Review error handling coverage

Prioritaskan findings berdasarkan:
🔴 Critical (must fix immediately)
🟡 Important (should fix soon)
🟢 Nice-to-have (optional improvement)

Format output dengan contoh code sebelum/sesudah untuk setiap issue.
```

---

### 2. Specific Component Analysis

```
Tolong analisis komponen [ComponentName] secara mendalam:

File: app/components/[path]/[ComponentName].tsx

Check:
- ✅ Props typing (interface complete?)
- ✅ Accessibility (ARIA labels, semantic HTML)
- ✅ Performance (memoization needed?)
- ✅ Error handling (boundary, fallbacks)
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Server vs Client component (correct usage?)
- ✅ Code cleanliness (DRY, readable)

Berikan:
1. Strengths (apa yang sudah bagus)
2. Issues (apa yang perlu diperbaiki + WHY)
3. Recommended changes (code examples)
4. Estimated effort (Low/Medium/High)
```

---

### 3. Performance Audit

```
Tolong lakukan performance audit untuk project ini:

Fokus pada:
1. Bundle Size Analysis
   - Identifikasi dependencies terbesar
   - Cari unused imports
   - Suggest tree-shaking opportunities

2. React Optimization
   - Find unnecessary re-renders
   - Check for missing memoization
   - Review hook dependencies

3. API Performance
   - Check caching strategy (ISR, revalidate times)
   - Review database query efficiency (N+1 problems?)
   - Suggest API response optimization

4. Image Optimization
   - Verify Next/Image usage
   - Check image sizes and formats
   - Suggest lazy loading strategy

Berikan specific recommendations dengan before/after metrics jika memungkinkan.
```

---

### 4. Security Review

```
Tolong lakukan security audit comprehensive:

Check List:
1. Authentication & Authorization
   - Review NextAuth setup
   - Check protected route implementation
   - Verify session management

2. Input Validation
   - Find all user input points (forms, search, comments)
   - Check sanitization implementation
   - Review API validation logic

3. Environment Variables
   - Verify no secrets in code
   - Check NEXT_PUBLIC_ usage (client exposure)
   - Review .env.example completeness

4. API Security
   - Check rate limiting
   - Review CORS configuration
   - Verify error message safety (no info leakage)

5. Dependencies
   - Run npm audit
   - Check for critical CVEs
   - Suggest updates

Format findings dengan:
- Severity level (Critical/High/Medium/Low)
- Exploitation scenario (how can this be abused?)
- Fix recommendation (specific code changes)
```

---

### 5. Testing Strategy

```
Tolong buatkan comprehensive testing strategy untuk project ini:

1. Unit Tests (Jest + React Testing Library)
   - Prioritaskan 10 fungsi/komponen paling krusial
   - Berikan contoh test cases untuk masing-masing
   - Suggest mocking strategy

2. E2E Tests (Playwright)
   - Identifikasi 5 critical user flows
   - Berikan contoh test scenarios
   - Include happy path + error scenarios

3. Integration Tests
   - Suggest API route test coverage
   - Database interaction tests
   - Auth flow tests

4. Visual Regression Tests
   - Suggest Chromatic setup
   - Identify components that need snapshot tests

Output format:
- Test file structure (folder organization)
- Specific test code examples
- Coverage goals (target %)
- CI/CD integration suggestions
```

---

### 6. Refactoring Suggestions

```
Tolong identifikasi opportunities untuk refactoring:

Focus Areas:
1. Code Duplication
   - Find repeated patterns
   - Suggest abstraction opportunities
   - Show before/after examples

2. Component Composition
   - Identify overly complex components
   - Suggest splitting strategies
   - Show better composition patterns

3. Type System
   - Find weak typing (any, unknown abuse)
   - Suggest utility types (Partial, Pick, Omit)
   - Create shared types for common patterns

4. Utility Functions
   - Extract repeated logic to lib/utils.ts
   - Create custom hooks for common patterns
   - Suggest naming improvements

Prioritize:
- High-impact, low-effort changes first
- Consider team familiarity with patterns
- Balance consistency vs. best practices
```

---

## 📊 Expected Output Format

Agent should provide output like this:

````markdown
# Code Review Results - [Date]

## 📊 Executive Summary

- **Overall Health**: Good
- **Code Quality Score**: 8/10
- **Security Status**: Minor Issues Found
- **Performance**: Acceptable
- **Test Coverage**: 45% (Target: 70%+)

**Top 3 Priority Actions**:

1. 🔴 Fix authentication vulnerability in `/api/user/profile` (2 hours)
2. 🟡 Add error boundary to ArticleCard component (1 hour)
3. 🟡 Optimize database queries in `/api/articles` (3 hours)

---

## 🔴 Critical Issues (2 found)

### Issue #1: Unprotected API Route

**File**: `app/api/user/profile/route.ts:15-25`

**Current Code**:

```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return Response.json(user);
}
```
````

**Problem**:

- No authentication check - anyone can access any user's profile
- Exposes sensitive data (email, phone) without authorization
- Potential IDOR vulnerability

**Recommended Fix**:

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only allow users to access their own profile
  if (session.user.id !== userId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      // Exclude sensitive fields
    },
  });

  return Response.json(user);
}
```

**Benefits**:

- ✅ Prevents unauthorized access
- ✅ Protects user privacy
- ✅ Follows least privilege principle

**Priority**: 🔴 Critical
**Effort**: Low (< 1 hour)
**Impact**: High (security vulnerability)

---

## 🟡 Important Issues (5 found)

[Similar detailed format for each issue]

---

## 🟢 Nice-to-Have Improvements (8 found)

[Similar detailed format for each improvement]

---

## ✅ Quick Wins (Low Effort, High Impact)

1. **Add missing TypeScript return types** (30 min, improves type safety)
2. **Replace console.log with proper logger** (45 min, better debugging)
3. **Add .prettierrc for consistent formatting** (15 min, team consistency)

---

## 📈 Performance Optimizations

### Current Bundle Size: 287 KB

### Target: < 250 KB

**Recommendations**:

1. Replace moment.js with date-fns (saves ~40 KB)
2. Lazy load non-critical components (saves ~25 KB)
3. Optimize images in public/images (saves ~50 KB)

**Expected Improvement**: ~115 KB reduction

---

## 🧪 Testing Recommendations

### Priority Tests to Add:

1. **Auth Flow E2E Test**

```typescript
test("user can sign in and access protected pages", async ({ page }) => {
  // Test code here
});
```

2. **API Route Unit Tests**

```typescript
describe("GET /api/articles", () => {
  it("returns paginated articles", async () => {
    // Test code here
  });
});
```

[More test examples]

---

## 📚 Additional Resources

- [Next.js Best Practices](https://nextjs.org/docs/app/building-your-application)
- [React Performance Tips](https://react.dev/learn/render-and-commit)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

---

**Review Completed**: [Timestamp]
**Reviewer**: GitHub Copilot Agent
**Next Review**: [Suggested date]

```

---

## 🎯 Tips Menggunakan Agent

### Do's ✅
- **Berikan konteks jelas**: Spesifik file/folder yang ingin dianalisis
- **Prioritaskan**: Fokus pada area yang paling critical dulu
- **Minta contoh code**: Selalu minta before/after examples
- **Tanya "why"**: Minta penjelasan reasoning, bukan hanya "what to fix"
- **Set expectations**: Sebutkan deadline atau effort constraints

### Don'ts ❌
- **Jangan terlalu broad**: "Review everything" kurang actionable
- **Jangan skip validation**: Selalu run lint/tsc sebelum dan sesudah changes
- **Jangan ignore trade-offs**: Tanya tentang pros/cons dari suggestions
- **Jangan implement blindly**: Review dan understand setiap suggestion

---

## 📞 Sample Conversations

### Conversation 1: Initial Full Review
```

User: "Tolong lakukan full code review dengan fokus pada security dan performance. Prioritaskan issues yang bisa diselesaikan dalam 1 minggu."

Agent: [Provides comprehensive review with priorities]

User: "Dari 10 critical issues yang kamu temukan, mana 3 yang paling urgent? Berikan step-by-step fix untuk masing-masing."

Agent: [Provides detailed fixes for top 3]

User: "Untuk issue #1 (authentication), apakah ada trade-offs jika kita implement solution yang kamu suggest?"

Agent: [Discusses trade-offs: performance impact, complexity, etc.]

```

### Conversation 2: Component Optimization
```

User: "Component ArticleCard re-render terlalu sering. Tolong identifikasi penyebabnya dan berikan solution."

Agent: [Analyzes component, finds unnecessary re-renders]

User: "Apakah solution kamu akan increase bundle size? Dan apakah ada alternatif lain?"

Agent: [Discusses impact and alternatives: React.memo vs composition]

User: "Ok, implement React.memo approach. Tolong generate test cases untuk verify behavior tidak berubah."

Agent: [Provides test code]

```

---

## 🔄 Iterative Review Process

```

Week 1: Initial Review
↓
Implement Critical Fixes
↓
Week 2: Verify Fixes + Review Important Issues
↓
Implement Important Fixes
↓
Week 3: Performance Optimization
↓
Week 4: Testing + Documentation
↓
Final Review + Production Deploy

```

---

**Pro Tip**: Simpan semua review results dalam folder `/docs/reviews/` dengan format:
- `YYYY-MM-DD-full-review.md`
- `YYYY-MM-DD-component-[name]-review.md`
- `YYYY-MM-DD-security-audit.md`

Ini membantu tracking progress dan decision history! 📚
```
