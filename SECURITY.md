# Security Guide - Berita Finansial

Panduan keamanan aplikasi untuk melindungi data dan pengguna.

## 🔒 Security Overview

### Security Principles

1. **Defense in Depth** - Multiple layers of security
2. **Least Privilege** - Minimal access rights
3. **Input Validation** - Never trust user input
4. **Secure by Default** - Safe configurations
5. **Regular Updates** - Keep dependencies current

## ✅ Implemented Security Measures

### 1. Input Validation & Sanitization ✅

**Implementation**:
```typescript
// app/lib/validators.ts
export function sanitizeString(input: string, maxLength: number = 1000): string {
  return input.trim().slice(0, maxLength);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

**Protects Against**:
- SQL Injection
- XSS (Cross-Site Scripting)
- Buffer overflow
- DoS attacks

**Example Usage**:
```typescript
const validatedData = validateArticleData(rawData);
// Throws error if validation fails
```

### 2. Authorization Checks ✅

**Implementation**:
```typescript
// app/api/watchlist/route.ts
const watchlist = await prisma.watchlist.findUnique({
  where: { id },
  select: { userId: true },
});

if (watchlist.userId !== session.user.id) {
  return NextResponse.json(
    { error: "Forbidden" },
    { status: 403 }
  );
}
```

**Protects Against**:
- Unauthorized access
- IDOR (Insecure Direct Object References)
- Privilege escalation

### 3. Authentication ✅

**Implementation**:
```typescript
// app/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import { compare } from "bcryptjs"; // Password hashing

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({ /* ... */ }),
    GoogleProvider({ /* ... */ }),
  ],
};
```

**Features**:
- JWT-based sessions
- Bcrypt password hashing
- OAuth integration (Google)
- Secure session management

### 4. Rate Limiting ✅

**Implementation**:
```typescript
// app/lib/rate-limit.ts
import { rateLimit, RateLimitPresets } from '@/app/lib/rate-limit';

export async function POST(req: NextRequest) {
  const identifier = getClientIdentifier(req, session?.user?.id);
  const rateLimitResult = rateLimit(identifier, RateLimitPresets.WRITE);

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': RateLimitPresets.WRITE.limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimitResult.resetIn.toString(),
        }
      }
    );
  }
  
  // Process request...
}
```

**Protects Against**:
- Brute force attacks
- DoS/DDoS attacks
- API abuse
- Credential stuffing

**Rate Limit Presets**:
- AUTH: 5 req/15 min (login, register)
- API: 100 req/min (general API)
- PUBLIC: 300 req/min (public endpoints)
- WRITE: 20 req/min (create, update, delete)
- SENSITIVE: 3 req/5 min (password reset, etc.)

## 🛡️ Security Checklist

### Application Security

#### Input Validation
- [x] All user inputs validated
- [x] String length limits enforced
- [x] Email format validation
- [x] Pagination parameters validated
- [x] Numeric values validated
- [ ] File upload validation (if applicable)

#### Authentication & Authorization
- [x] Password hashing (bcrypt)
- [x] JWT for sessions
- [x] Session expiry configured
- [x] OAuth providers (Google)
- [x] Ownership verification
- [x] Role-based access (USER, EDITOR, ADMIN)
- [ ] 2FA (Two-Factor Authentication)
- [ ] Account lockout after failed attempts

#### Data Protection
- [x] Prisma prepared statements (SQL injection prevention)
- [x] Password not exposed in API responses
- [x] Sensitive data not logged
- [ ] Data encryption at rest
- [ ] HTTPS enforcement
- [ ] Secure cookies (httpOnly, secure, sameSite)

#### API Security
- [x] Rate limiting implemented
- [x] Input validation on all routes
- [x] Authorization checks
- [x] Error messages don't leak info
- [ ] CORS properly configured
- [ ] API versioning
- [ ] Request size limits

### Infrastructure Security

#### Environment Variables
```env
# ✅ Good - Secure configuration
NEXTAUTH_SECRET=<strong-random-32-char-string>
POSTGRES_PRISMA_URL=postgresql://...?sslmode=require

# ❌ Bad - Never commit these
NEXTAUTH_SECRET=secret123
DATABASE_URL=postgresql://localhost/db
```

**Best Practices**:
- [x] Use `.env.local` for local development
- [x] Never commit secrets to Git
- [x] Different secrets per environment
- [ ] Use secret management service (AWS Secrets Manager, etc.)
- [ ] Rotate secrets regularly

#### Database Security
- [x] Connection pooling (Neon adapter)
- [x] SSL/TLS for connections
- [x] Prepared statements (Prisma)
- [x] Proper indexes for performance
- [ ] Regular backups
- [ ] Backup encryption
- [ ] Read replicas for scaling

#### Headers Security
```typescript
// next.config.ts
headers: [
  {
    source: '/:path*',
    headers: [
      {
        key: 'X-Frame-Options',
        value: 'DENY' // Prevent clickjacking
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff' // Prevent MIME sniffing
      },
      {
        key: 'X-XSS-Protection',
        value: '1; mode=block' // XSS protection
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin'
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()'
      }
    ]
  }
]
```

## 🚨 Common Vulnerabilities & Mitigation

### 1. SQL Injection

**Risk**: Attacker executes arbitrary SQL

**Mitigation**:
```typescript
// ✅ Safe - Using Prisma (parameterized queries)
await prisma.article.findMany({
  where: { title: { contains: userInput } }
});

// ❌ Unsafe - Raw SQL with user input
await prisma.$executeRaw`SELECT * FROM Article WHERE title LIKE '%${userInput}%'`;
```

### 2. Cross-Site Scripting (XSS)

**Risk**: Attacker injects malicious scripts

**Mitigation**:
```typescript
// ✅ Safe - React automatically escapes
<p>{userInput}</p>

// ❌ Unsafe - Direct HTML injection
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Safe if needed - Sanitize first
import DOMPurify from 'isomorphic-dompurify';
<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(userInput) 
}} />
```

### 3. CSRF (Cross-Site Request Forgery)

**Risk**: Unauthorized actions on behalf of user

**Mitigation**:
```typescript
// NextAuth automatically handles CSRF for auth routes
// For custom forms, use CSRF tokens

import { getCsrfToken } from 'next-auth/react';

const csrfToken = await getCsrfToken();
// Include in form submission
```

### 4. Insecure Direct Object References (IDOR)

**Risk**: Access to unauthorized resources

**Mitigation**:
```typescript
// ❌ Bad - No ownership check
const item = await prisma.portfolio.findUnique({ where: { id } });
await prisma.portfolio.delete({ where: { id } });

// ✅ Good - Verify ownership
const item = await prisma.portfolio.findUnique({ 
  where: { id },
  select: { userId: true }
});

if (item.userId !== session.user.id) {
  throw new Error('Forbidden');
}
```

### 5. Sensitive Data Exposure

**Risk**: Leaking sensitive information

**Mitigation**:
```typescript
// ❌ Bad - Exposing password
const user = await prisma.user.findUnique({ 
  where: { id } 
});

// ✅ Good - Select only needed fields
const user = await prisma.user.findUnique({ 
  where: { id },
  select: {
    id: true,
    name: true,
    email: true,
    // password: NOT included
  }
});
```

## 🔐 Password Security

### Hashing
```typescript
import { hash, compare } from 'bcryptjs';

// Hash password before storing
const hashedPassword = await hash(password, 12);

// Verify password
const isValid = await compare(password, hashedPassword);
```

### Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

### Implementation
```typescript
export function validatePassword(password: string): boolean {
  const minLength = 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength &&
    hasUpper &&
    hasLower &&
    hasNumber &&
    hasSpecial
  );
}
```

## 📊 Security Monitoring

### Logging
```typescript
// Log security events
console.error('Failed login attempt', {
  email: attempt.email,
  ip: req.ip,
  timestamp: new Date(),
});

// Never log sensitive data
// ❌ console.log('User password:', password);
```

### Monitoring Tools
- [ ] Error tracking (Sentry)
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Security scanning (Snyk, Dependabot)
- [ ] Log aggregation (LogRocket, DataDog)

## 🚨 Incident Response

### If Security Breach Detected

1. **Contain**: Disable affected accounts/features
2. **Investigate**: Analyze logs, find root cause
3. **Remediate**: Fix vulnerability, patch system
4. **Notify**: Inform affected users
5. **Review**: Update security measures
6. **Document**: Record incident and response

### Emergency Contacts
- Security Lead: [contact]
- DevOps: [contact]
- Legal: [contact]

## 🔄 Regular Security Tasks

### Daily
- [ ] Review failed login attempts
- [ ] Check error logs

### Weekly
- [ ] Review new dependencies
- [ ] Check security alerts
- [ ] Monitor rate limits

### Monthly
- [ ] Update dependencies
- [ ] Security audit
- [ ] Backup verification
- [ ] Access review

### Quarterly
- [ ] Penetration testing
- [ ] Security training
- [ ] Policy review
- [ ] Disaster recovery drill

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [Prisma Security](https://www.prisma.io/docs/guides/security)
- [NextAuth.js Security](https://next-auth.js.org/security)

---

**Last Updated**: November 4, 2025  
**Security Contact**: security@beritafinansial.com  
**Maintained by**: Berita Finansial Security Team
