# 📋 Analysis Templates - Common Scenarios

Template-template siap pakai untuk analisis code yang sering dibutuhkan.

---

## 1️⃣ New Feature Review Template

**Use Case**: Sebelum merge PR untuk fitur baru

```markdown
Tolong review fitur baru [Feature Name] yang akan di-merge:

**Files Changed**:

- app/[path]/[files]
- app/components/[components]
- app/api/[endpoints]

**Review Checklist**:

### Functionality ✅

- [ ] Fitur bekerja sesuai requirements?
- [ ] Edge cases terhandle?
- [ ] Error handling proper?
- [ ] Loading states ada?

### Code Quality ✅

- [ ] TypeScript types lengkap?
- [ ] No 'any' types?
- [ ] Naming conventions followed?
- [ ] Code readable & maintainable?

### Performance ✅

- [ ] No unnecessary re-renders?
- [ ] API calls optimized?
- [ ] Images optimized?
- [ ] Bundle size impact acceptable?

### Testing ✅

- [ ] Unit tests added?
- [ ] E2E scenarios covered?
- [ ] Manual testing done?

### Security ✅

- [ ] Input validation proper?
- [ ] Authentication checked?
- [ ] No sensitive data exposed?

### Documentation ✅

- [ ] README updated?
- [ ] API docs updated?
- [ ] Comments for complex logic?

**Expected Output**:

- Approval status (Ready to Merge / Needs Changes)
- Specific action items before merge
- Estimated effort for fixes
```

---

## 2️⃣ Bug Investigation Template

**Use Case**: Debugging production issue

```markdown
Tolong investigasi bug berikut:

**Bug Description**: [Describe what's happening]

**Steps to Reproduce**:

1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected**: [What should happen]
**Actual**: [What actually happens]

**Error Messages**:
```

[Paste error logs/stack trace]

```

**Files Suspected**:
- [List suspected files]

**Investigation Required**:
1. Trace the code path for this scenario
2. Identify root cause
3. Check for similar bugs elsewhere
4. Suggest fix with test cases
5. Recommend preventive measures

**Questions to Answer**:
- Is this a regression? (worked before?)
- Is it environment-specific?
- Are there side effects to the fix?
- How to prevent this in the future?
```

---

## 3️⃣ Refactoring Proposal Template

**Use Case**: Proposing code improvements

```markdown
Tolong buat refactoring proposal untuk [Component/Module Name]:

**Current State**:

- File: [path]
- Lines of Code: [number]
- Complexity: [High/Medium/Low]

**Problems**:

1. [Problem 1 - e.g., code duplication]
2. [Problem 2 - e.g., poor naming]
3. [Problem 3 - e.g., tight coupling]

**Goals**:

- Improve readability
- Reduce complexity
- Increase testability
- [Other goals]

**Constraints**:

- No breaking changes to public API
- Must maintain backward compatibility
- Timeline: [X days/weeks]

**Request**:

1. Show current code structure
2. Propose new structure
3. Show migration path (step-by-step)
4. Identify risks
5. Estimate effort
6. Suggest testing strategy

**Success Criteria**:

- Passes all existing tests
- Code coverage maintained/improved
- Performance not degraded
- Team approves approach
```

---

## 4️⃣ Performance Bottleneck Analysis

**Use Case**: Page/feature is slow

```markdown
Tolong analyze performance bottleneck untuk [Page/Feature]:

**Issue**: [Describe slowness]

- User Action: [What user does]
- Expected Speed: [< X seconds]
- Actual Speed: [Y seconds]

**Reproduction**:

- URL: [page URL]
- User State: [logged in/out]
- Data Volume: [number of items]

**Investigation Needed**:

### 1. Frontend Analysis

- [ ] Check component re-renders
- [ ] Analyze bundle size for this route
- [ ] Review useState/useEffect usage
- [ ] Check for memory leaks
- [ ] Verify image optimization

### 2. API Analysis

- [ ] Check API response times
- [ ] Review database queries (N+1?)
- [ ] Check caching strategy
- [ ] Verify payload size
- [ ] Check for rate limiting issues

### 3. Network Analysis

- [ ] Count total requests
- [ ] Check waterfall (blocking?)
- [ ] Verify compression (gzip/brotli)
- [ ] Check for redundant requests

**Tools to Use**:

- Chrome DevTools Performance tab
- React DevTools Profiler
- Network tab waterfall
- Lighthouse audit

**Expected Output**:

1. Root cause identification
2. Performance metrics (current vs target)
3. Specific optimizations with before/after
4. Estimated improvement (X% faster)
5. Implementation priority
```

---

## 5️⃣ Code Migration Template

**Use Case**: Upgrading library or pattern

```markdown
Tolong buat migration plan untuk: [Migration Description]

**Example**: Migrating from useState to Server Actions

**Current State**:

- Pattern: [Current approach]
- Files Affected: [Estimated number]
- Dependencies: [List dependencies]

**Target State**:

- Pattern: [New approach]
- Benefits: [List benefits]
- Dependencies: [New dependencies needed]

**Migration Plan Needed**:

### Phase 1: Preparation

- [ ] Identify all affected files
- [ ] Create compatibility layer (if needed)
- [ ] Update dependencies
- [ ] Create migration guide

### Phase 2: Pilot

- [ ] Migrate 1-2 simple cases
- [ ] Test thoroughly
- [ ] Document issues found
- [ ] Refine approach

### Phase 3: Rollout

- [ ] Migrate remaining files
- [ ] Update tests
- [ ] Update documentation
- [ ] Remove deprecated code

### Phase 4: Validation

- [ ] All tests pass
- [ ] Performance verified
- [ ] No regressions
- [ ] Team trained

**Risk Assessment**:

- What could go wrong?
- How to rollback if needed?
- Impact on users?

**Timeline**: [Estimated timeline with milestones]
```

---

## 6️⃣ API Design Review Template

**Use Case**: Reviewing new API endpoint

````markdown
Tolong review API design untuk endpoint baru:

**Endpoint**: [Method] /api/[path]

**Purpose**: [What this endpoint does]

**Request**:

```typescript
// Show request interface
interface RequestBody {
  // ...
}
```
````

**Response**:

```typescript
// Show response interface
interface ResponseBody {
  // ...
}
```

**Review Checklist**:

### Design ✅

- [ ] RESTful? (proper HTTP methods)
- [ ] Naming clear & consistent?
- [ ] Versioning considered?
- [ ] Pagination needed?
- [ ] Filtering/sorting needed?

### Security ✅

- [ ] Authentication required?
- [ ] Authorization rules clear?
- [ ] Input validation proper?
- [ ] Rate limiting needed?
- [ ] CORS configured?

### Performance ✅

- [ ] Efficient database queries?
- [ ] Caching strategy?
- [ ] Response size acceptable?
- [ ] N+1 queries avoided?

### Error Handling ✅

- [ ] Proper HTTP status codes?
- [ ] Clear error messages?
- [ ] No sensitive info leaked?
- [ ] Validation errors detailed?

### Documentation ✅

- [ ] OpenAPI/Swagger spec?
- [ ] Example requests/responses?
- [ ] Error scenarios documented?

**Expected Output**:

- Approval (Good to Implement / Needs Changes)
- Alternative designs if applicable
- Implementation notes
- Test scenarios

````

---

## 7️⃣ Database Schema Review Template

**Use Case**: Adding/changing Prisma schema

```markdown
Tolong review Prisma schema changes:

**File**: prisma/schema.prisma

**Changes**:
```prisma
// Show new/changed models
model NewModel {
  // ...
}
````

**Review Checklist**:

### Schema Design ✅

- [ ] Naming conventions followed?
- [ ] Relationships correct?
- [ ] Data types appropriate?
- [ ] Constraints defined?
- [ ] Indexes on query fields?

### Performance ✅

- [ ] Indexes needed for queries?
- [ ] Composite indexes considered?
- [ ] @relation fields optimized?
- [ ] Large text fields separated?

### Data Integrity ✅

- [ ] Cascade delete rules correct?
- [ ] Required fields appropriate?
- [ ] Default values sensible?
- [ ] Unique constraints proper?

### Migration ✅

- [ ] Existing data migration plan?
- [ ] Backward compatibility?
- [ ] Rollback strategy?
- [ ] Data loss risk?

**Migration Command**:

```bash
npx prisma migrate dev --name [migration_name]
```

**Testing Required**:

1. Create new records
2. Update existing records
3. Delete with cascades
4. Query performance
5. Edge cases

**Expected Output**:

- Schema feedback
- Migration SQL review
- Data migration script (if needed)
- Performance impact estimate

````

---

## 8️⃣ Accessibility Audit Template

**Use Case**: Checking WCAG compliance

```markdown
Tolong audit accessibility untuk [Page/Component]:

**Target**: WCAG 2.1 Level AA compliance

**Areas to Check**:

### Keyboard Navigation ✅
- [ ] All interactive elements reachable?
- [ ] Tab order logical?
- [ ] Focus indicators visible?
- [ ] No keyboard traps?
- [ ] Shortcuts don't conflict?

### Screen Reader ✅
- [ ] Semantic HTML used?
- [ ] ARIA labels present?
- [ ] Images have alt text?
- [ ] Form labels associated?
- [ ] Live regions for dynamic content?

### Visual ✅
- [ ] Color contrast > 4.5:1?
- [ ] Text resizable to 200%?
- [ ] No information by color alone?
- [ ] Focus indicators visible?

### Forms ✅
- [ ] Labels for all inputs?
- [ ] Error messages descriptive?
- [ ] Required fields indicated?
- [ ] Input purpose clear?

### Media ✅
- [ ] Videos have captions?
- [ ] Audio has transcripts?
- [ ] Autoplay disabled?

**Testing Tools**:
- axe DevTools
- WAVE
- Lighthouse Accessibility
- NVDA/JAWS screen readers

**Expected Output**:
1. List of violations with severity
2. Code fixes for each issue
3. Testing instructions
4. Compliance score
````

---

## 9️⃣ SEO Optimization Template

**Use Case**: Improving search rankings

````markdown
Tolong audit SEO untuk [Page/Section]:

**URL**: [Page URL]
**Target Keywords**: [List keywords]

**On-Page SEO ✅**:

- [ ] Title tag optimized? (50-60 chars)
- [ ] Meta description? (150-160 chars)
- [ ] H1 tag present & unique?
- [ ] Header hierarchy correct? (H1 > H2 > H3)
- [ ] Images have alt text?
- [ ] Internal links present?
- [ ] URL structure clean?

**Technical SEO ✅**:

- [ ] Sitemap generated?
- [ ] Robots.txt configured?
- [ ] Canonical tags set?
- [ ] Schema markup added? (JSON-LD)
- [ ] Page speed optimized?
- [ ] Mobile-friendly?
- [ ] HTTPS enabled?

**Content SEO ✅**:

- [ ] Keyword density appropriate?
- [ ] Content length sufficient?
- [ ] Original content (no duplication)?
- [ ] Readability good?
- [ ] Fresh/updated content?

**Next.js Specific ✅**:

- [ ] Metadata API used correctly?
- [ ] generateMetadata implemented?
- [ ] Static metadata for static pages?
- [ ] OG images generated?

**Testing**:

```bash
# Check with Google
curl -A "Googlebot" [URL]

# Lighthouse SEO score
npm run lighthouse -- --only-categories=seo
```
````

**Expected Output**:

1. Current SEO score
2. Specific improvements needed
3. Metadata examples
4. Schema markup examples
5. Expected impact

````

---

## 🔟 Load Testing Template

**Use Case**: Stress testing before launch

```markdown
Tolong setup load testing untuk [Feature/Endpoint]:

**Target**:
- Endpoint: [API route or page]
- Expected Traffic: [X requests/second]
- Success Criteria:
  - Response time < [Y ms] for 95th percentile
  - Error rate < [Z%]
  - No memory leaks

**Test Scenarios**:

### Scenario 1: Normal Load
- Users: 100 concurrent
- Duration: 5 minutes
- Ramp-up: 30 seconds

### Scenario 2: Peak Load
- Users: 500 concurrent
- Duration: 10 minutes
- Ramp-up: 1 minute

### Scenario 3: Stress Test
- Users: 1000 concurrent
- Duration: 5 minutes
- Ramp-up: 2 minutes

**Metrics to Track**:
- Response time (p50, p95, p99)
- Throughput (req/sec)
- Error rate
- CPU usage
- Memory usage
- Database connections

**Tools**:
```bash
# Using k6
k6 run load-test.js

# Using Artillery
artillery run load-test.yml
````

**Expected Output**:

1. Load test script
2. Baseline metrics
3. Bottlenecks identified
4. Optimization recommendations
5. Infrastructure requirements

````

---

## 💡 Pro Tips

### When to Use Each Template

| Scenario | Template | Frequency |
|----------|----------|-----------|
| New PR | New Feature Review | Every PR |
| Production Bug | Bug Investigation | As needed |
| Tech Debt | Refactoring Proposal | Monthly |
| Slow Page | Performance Bottleneck | As needed |
| Library Update | Code Migration | Quarterly |
| New API | API Design Review | Per endpoint |
| Schema Change | Database Schema Review | Per migration |
| Launch Prep | Accessibility + SEO | Before launch |
| Traffic Spike | Load Testing | Before major events |

### Customizing Templates

```markdown
# Add project-specific sections:

**Our Custom Checks**:
- [ ] Follows our design system?
- [ ] i18n strings added?
- [ ] Analytics events tracked?
- [ ] Feature flag configured?
````

---

**Remember**: Template adalah starting point. Customize sesuai kebutuhan project! 🎯
