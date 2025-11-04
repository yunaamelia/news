# Quick Reference Guide - Berita Finansial

Panduan cepat untuk developer yang bekerja dengan codebase ini.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup database
npm run db:push

# Run development server
npm run dev

# Run tests
npm test

# Run lint
npm run lint

# Build for production
npm run build
```

## 📁 Key Files & Locations

### Core Configuration
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.mjs` - ESLint rules
- `jest.config.js` - Jest test configuration
- `prisma/schema.prisma` - Database schema

### Authentication
- `app/lib/auth.ts` - NextAuth configuration
- `app/api/auth/[...nextauth]/route.ts` - Auth API routes

### Database
- `app/lib/prisma.ts` - Prisma client singleton
- `prisma/seed.ts` - Database seeding

### API Routes
- `app/api/articles/route.ts` - Article CRUD
- `app/api/watchlist/route.ts` - User watchlist
- `app/api/portfolio/route.ts` - User portfolio
- `app/api/market/route.ts` - Market data

### Utilities
- `app/lib/utils.ts` - General utilities
- `app/lib/validators.ts` - Input validation
- `app/lib/rate-limit.ts` - Rate limiting
- `app/lib/market-data.ts` - Market data API

### Components
- `app/components/ui/` - Reusable UI components
- `app/components/layout/` - Layout components
- `app/components/articles/` - Article components
- `app/components/market/` - Market components

## 🛠️ Common Tasks

### Create New API Route

```typescript
// app/api/your-endpoint/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { rateLimit, RateLimitPresets } from "@/app/lib/rate-limit";
import prisma from "@/app/lib/prisma";

export const dynamic = "force-dynamic"; // For user-specific data

export async function GET(req: NextRequest) {
  try {
    // Rate limiting
    const identifier = req.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = rateLimit(identifier, RateLimitPresets.API);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    // Auth check (if needed)
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Your logic here
    const data = await prisma.yourModel.findMany({
      where: { userId: session.user.id }
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### Create New Component

```typescript
// app/components/ui/YourComponent.tsx
import { ReactNode } from "react";

interface YourComponentProps {
  children: ReactNode;
  className?: string;
}

export default function YourComponent({
  children,
  className = "",
}: YourComponentProps) {
  return (
    <div className={`your-base-classes ${className}`}>
      {children}
    </div>
  );
}
```

### Add Database Model

```prisma
// prisma/schema.prisma
model YourModel {
  id        String   @id @default(cuid())
  userId    String
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

// Then update User model to add relation:
model User {
  // ... existing fields
  yourModels YourModel[]
}
```

```bash
# Generate Prisma client & push to database
npm run db:generate
npm run db:push
```

### Write Tests

```typescript
// app/lib/__tests__/your-function.test.ts
import { yourFunction } from '../your-file';

describe('yourFunction', () => {
  it('should do something', () => {
    const result = yourFunction('input');
    expect(result).toBe('expected output');
  });

  it('should handle edge cases', () => {
    expect(() => yourFunction('')).toThrow('Error message');
  });
});
```

## 🔒 Security Checklist

When adding new features:

- [ ] Validate all user inputs
- [ ] Check authorization (ownership)
- [ ] Add rate limiting if needed
- [ ] Use parameterized queries (Prisma)
- [ ] Don't expose sensitive data
- [ ] Add error handling
- [ ] Write tests
- [ ] Update documentation

## 🎨 UI Component Patterns

### Button Variants
```typescript
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="success">Success</Button>
<Button variant="danger">Danger</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="outline">Outline</Button>
```

### Card Styles
```typescript
<Card>Basic Card</Card>
<Card hover onClick={handleClick}>Clickable Card</Card>
<Card padding="none">No Padding</Card>
<Card padding="lg">Large Padding</Card>
```

### Error Boundary
```typescript
import ErrorBoundary from '@/app/components/ui/ErrorBoundary';

<ErrorBoundary
  fallback={<CustomErrorUI />}
  onError={(error, errorInfo) => {
    // Log to error tracking service
  }}
>
  <YourComponent />
</ErrorBoundary>
```

## 📊 Database Queries

### Best Practices

```typescript
// ✅ Good - Select only needed fields
const articles = await prisma.article.findMany({
  select: {
    id: true,
    title: true,
    slug: true,
    excerpt: true,
    publishedAt: true,
  }
});

// ✅ Good - Use include for relations
const articles = await prisma.article.findMany({
  include: {
    author: {
      select: { name: true, image: true }
    }
  }
});

// ❌ Bad - Fetching all fields unnecessarily
const articles = await prisma.article.findMany();

// ✅ Good - Pagination
const articles = await prisma.article.findMany({
  take: limit,
  skip: (page - 1) * limit,
  orderBy: { publishedAt: 'desc' }
});
```

## 🧪 Testing Patterns

### Unit Test
```typescript
describe('formatCurrency', () => {
  it('should format IDR currency', () => {
    expect(formatCurrency(1000000)).toContain('1.000.000');
  });
});
```

### Component Test
```typescript
describe('Button', () => {
  it('should handle clicks', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click</Button>);
    
    fireEvent.click(screen.getByText('Click'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

### API Route Test
```typescript
describe('GET /api/articles', () => {
  it('should return articles', async () => {
    const res = await fetch('/api/articles');
    const data = await res.json();
    
    expect(res.status).toBe(200);
    expect(data.articles).toBeDefined();
  });
});
```

## 🔍 Debugging

### Check Logs
```bash
# View Next.js logs
npm run dev

# View Prisma queries
# Set in prisma.ts: log: ["query", "error", "warn"]

# Run TypeScript check
npx tsc --noEmit

# Run ESLint
npm run lint
```

### Common Issues

**Issue**: Build fails with "Module not found"
```bash
# Solution: Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

**Issue**: Prisma Client outdated
```bash
# Solution: Regenerate client
npm run db:generate
```

**Issue**: Tests failing
```bash
# Solution: Clear Jest cache
npm test -- --clearCache
npm test
```

## 📚 Documentation Links

- [Next.js 16 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Jest Docs](https://jestjs.io/)

## 📖 Internal Documentation

- `TESTING.md` - Complete testing guide
- `OPTIMIZATION.md` - Performance optimization
- `SECURITY.md` - Security best practices
- `ANALYSIS_SUMMARY.md` - Comprehensive analysis

## 🎯 Code Style

### TypeScript
- Use explicit types (no `any`)
- Use interfaces for objects
- Use type for unions/primitives
- Add JSDoc comments for functions

### React
- Use functional components
- Prefer Server Components
- Use "use client" only when needed
- Destructure props

### Naming
- Components: PascalCase
- Functions: camelCase
- Constants: UPPER_CASE
- Files: kebab-case or PascalCase

### Imports
```typescript
// External packages first
import { NextRequest } from "next/server";
import prisma from "@prisma/client";

// Internal imports second
import { authOptions } from "@/app/lib/auth";
import Button from "@/app/components/ui/Button";

// Types last
import type { User } from "@/app/types";
```

## 💡 Pro Tips

1. **Always validate input** - Use validators from `app/lib/validators.ts`
2. **Check authorization** - Verify ownership before mutations
3. **Add rate limiting** - Protect endpoints with `rate-limit.ts`
4. **Write tests** - Test before committing
5. **Use Server Components** - Default to Server Components
6. **Optimize queries** - Select only needed fields
7. **Handle errors** - Use try-catch with specific errors
8. **Document changes** - Update relevant documentation

## 🚨 Emergency Contacts

- **Security Issues**: Open GitHub issue with "security" label
- **Bug Reports**: Open GitHub issue
- **Feature Requests**: Open GitHub discussion
- **Documentation**: Update relevant .md files

---

**Last Updated**: November 4, 2025  
**Version**: 1.0  
**Maintained by**: Berita Finansial Team
