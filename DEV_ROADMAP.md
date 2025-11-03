# 🗺️ Development Roadmap - Berita Finansial Indonesia

**Last Updated**: November 4, 2025  
**Current Version**: 1.0.0  
**Status**: Production Ready ✅

---

## 📊 Current Status

### ✅ Phase 1-4: Core Platform (COMPLETED)

**Latest Commit**: `2940f75` - feat(phase4): redesign 6 category pages dengan glassmorphism

**Completed Features:**

- ✅ Next.js 16 + App Router + React 19 setup
- ✅ PostgreSQL database dengan Prisma 6.18
- ✅ NextAuth authentication (Email/Password + Google OAuth)
- ✅ Article management system (CRUD)
- ✅ User roles (USER, EDITOR, ADMIN)
- ✅ Market data integration (Mock stocks + CoinGecko crypto)
- ✅ Watchlist & Portfolio tracking
- ✅ Newsletter subscription system
- ✅ Dark mode implementation
- ✅ Search functionality
- ✅ Bookmark system
- ✅ Reading time estimation
- ✅ Share buttons
- ✅ Comment system with nested replies
- ✅ Reading history tracking
- ✅ Glassmorphism UI redesign (6 category pages)
- ✅ Vercel Speed Insights & Analytics
- ✅ PWA manifest & service worker ready
- ✅ SEO optimization (sitemap, robots.txt, meta tags)
- ✅ GitHub Actions CI/CD pipeline

**Technical Health:**

- ✅ ESLint: No errors
- ✅ TypeScript: No type errors
- ✅ Build: Success
- ✅ Git Status: Clean working tree

---

## 🎯 Phase 5: Performance & Optimization (NEXT)

**Priority**: HIGH  
**Timeline**: 1-2 weeks  
**Status**: Not Started

### Goals:

- Bundle size reduction (target: < 200KB first load)
- Lighthouse score improvements (target: 95+)
- Core Web Vitals optimization
- Image optimization strategy
- API response time improvements

### Tasks:

- [ ] Run bundle analyzer and identify heavy imports
- [ ] Replace Moment.js with date-fns (if used)
- [ ] Implement dynamic imports for heavy components
- [ ] Add Next.js Image optimization
- [ ] Setup Redis caching for market data
- [ ] Implement ISR (Incremental Static Regeneration) properly
- [ ] Optimize database queries (add indexes)
- [ ] Add response compression
- [ ] Implement lazy loading for images
- [ ] Add skeleton loaders for better perceived performance

### Success Metrics:

- First Contentful Paint (FCP): < 1.2s
- Time to Interactive (TTI): < 3.0s
- Cumulative Layout Shift (CLS): < 0.1
- Largest Contentful Paint (LCP): < 2.5s
- Bundle size reduction: > 30%

---

## 🔔 Phase 6: Real-Time Price Alerts

**Priority**: HIGH (User-Requested Feature)  
**Timeline**: 2-3 weeks  
**Status**: Not Started

### Goals:

- Enable users to set price alerts for watchlist items
- Send notifications when target prices are reached
- Support multiple alert types (email, push, in-app)

### Database Schema Changes:

```prisma
model PriceAlert {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  symbol      String
  assetType   AssetType
  targetPrice Float
  condition   AlertCondition // ABOVE, BELOW, EQUALS
  isActive    Boolean  @default(true)
  triggered   Boolean  @default(false)
  createdAt   DateTime @default(now())
  triggeredAt DateTime?

  @@unique([userId, symbol, assetType, targetPrice])
  @@index([userId, isActive])
  @@index([symbol, assetType, isActive])
}

enum AlertCondition {
  ABOVE
  BELOW
  EQUALS
}
```

### Tasks:

- [ ] Update Prisma schema with PriceAlert model
- [ ] Create migration for new tables
- [ ] Build API endpoints:
  - `POST /api/alerts` - Create alert
  - `GET /api/alerts` - List user alerts
  - `PATCH /api/alerts/[id]` - Update alert
  - `DELETE /api/alerts/[id]` - Delete alert
- [ ] Implement background job for price checking (cron or queue)
- [ ] Setup email notification service (Resend or SendGrid)
- [ ] Implement push notifications (Web Push API)
- [ ] Build UI components:
  - Alert creation modal
  - Alert list management page
  - Alert status indicators
- [ ] Add alert notification settings to user profile
- [ ] Implement rate limiting for alert creation
- [ ] Add tests for alert logic

### Technical Considerations:

- Use Vercel Cron Jobs or external service (Upstash QStash)
- Implement exponential backoff for failed notifications
- Consider rate limits (max 10 alerts per user for free tier)
- Add premium tier with unlimited alerts

---

## 📈 Phase 7: TradingView Chart Integration

**Priority**: MEDIUM-HIGH (Visual Impact)  
**Timeline**: 1-2 weeks  
**Status**: Not Started

### Goals:

- Embed professional charting on market pages
- Interactive price analysis for stocks and crypto
- Technical indicators and drawing tools

### Tasks:

- [ ] Research TradingView widget options (free vs paid)
- [ ] Create TradingViewChart component
- [ ] Integrate lightweight widget on market pages
- [ ] Add widget to article pages (contextual)
- [ ] Implement symbol mapping (IDX stocks to TradingView)
- [ ] Add customization options (themes, intervals)
- [ ] Optimize loading performance (lazy load)
- [ ] Add fallback for widget loading errors
- [ ] Test on mobile devices
- [ ] Document usage in component library

### Component Structure:

```typescript
<TradingViewChart
  symbol="BBCA.JK"
  assetType="SAHAM"
  theme={darkMode ? 'dark' : 'light'}
  interval="D"
  height={400}
  showToolbar={true}
/>
```

### Integration Points:

- `/market` - Market overview with mini charts
- `/market/[symbol]` - Full-size interactive chart
- `/artikel/[slug]` - Contextual chart when article mentions ticker
- `/watchlist` - Mini charts for each watchlist item

---

## 👥 Phase 8: Social Features

**Priority**: MEDIUM  
**Timeline**: 3-4 weeks  
**Status**: Not Started

### Goals:

- Build community engagement features
- Increase user retention through social interactions
- Enable content discovery through social graph

### Features:

#### 8.1 User Following System

- [ ] Add Follow/Unfollow functionality
- [ ] Create followers/following lists
- [ ] Show follower count on profiles
- [ ] Feed of followed users' activities

#### 8.2 Article Reactions

- [ ] Add like/love/insightful reactions to articles
- [ ] Show reaction counts and user reactions
- [ ] Reaction analytics for authors
- [ ] Most reacted articles section

#### 8.3 Comment Enhancements

- [ ] Comment likes/dislikes
- [ ] Comment sorting (popular, recent, controversial)
- [ ] Mention system (@username)
- [ ] Comment notifications
- [ ] Report/flag inappropriate comments

#### 8.4 Social Sharing Improvements

- [ ] Native Web Share API integration
- [ ] Custom OG images for articles
- [ ] Share to WhatsApp/Telegram directly
- [ ] Share with custom message templates
- [ ] Track share analytics

### Database Schema Changes:

```prisma
model UserFollow {
  id          String   @id @default(cuid())
  followerId  String
  followingId String
  follower    User     @relation("Follower", fields: [followerId], references: [id], onDelete: Cascade)
  following   User     @relation("Following", fields: [followingId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())

  @@unique([followerId, followingId])
  @@index([followerId])
  @@index([followingId])
}

model ArticleReaction {
  id        String       @id @default(cuid())
  userId    String
  articleId String
  type      ReactionType
  user      User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  article   Article      @relation(fields: [articleId], references: [id], onDelete: Cascade)
  createdAt DateTime     @default(now())

  @@unique([userId, articleId])
  @@index([articleId, type])
}

enum ReactionType {
  LIKE
  LOVE
  INSIGHTFUL
  BULLISH
  BEARISH
}
```

---

## 🔒 Phase 9: API Rate Limiting & Security

**Priority**: HIGH (Production Critical)  
**Timeline**: 1 week  
**Status**: Not Started

### Goals:

- Protect API endpoints from abuse
- Implement tier-based rate limits
- Add request throttling
- Improve security posture

### Tasks:

- [ ] Setup rate limiting middleware
- [ ] Implement Redis-based rate limiter (or Upstash)
- [ ] Define rate limit tiers:
  - Anonymous: 10 req/min
  - Free users: 60 req/min
  - Premium users: 300 req/min
  - Admin: Unlimited
- [ ] Add rate limit headers (X-RateLimit-\*)
- [ ] Create rate limit exceeded error page
- [ ] Implement IP-based blocking for abuse
- [ ] Add CAPTCHA for registration/login after failures
- [ ] Setup request logging for monitoring
- [ ] Add API key system for third-party integrations
- [ ] Implement webhook signature verification
- [ ] Add CORS configuration
- [ ] Security audit checklist

### Rate Limit Strategy:

```typescript
// Free tier
POST /api/articles/comments: 10/hour
POST /api/watchlist: 20/hour
GET /api/market/*: 60/hour

// Premium tier
POST /api/articles/comments: 100/hour
POST /api/watchlist: 100/hour
GET /api/market/*: 300/hour
```

---

## 🎨 Phase 10: Advanced Portfolio Analytics

**Priority**: MEDIUM  
**Timeline**: 2-3 weeks  
**Status**: Not Started

### Goals:

- Provide detailed portfolio performance insights
- Help users make data-driven investment decisions
- Compete with traditional portfolio trackers

### Features:

#### 10.1 Performance Metrics

- [ ] Total portfolio value (real-time)
- [ ] Daily/Weekly/Monthly/YTD/All-time returns
- [ ] Per-asset performance breakdown
- [ ] Profit/Loss calculations with fees
- [ ] Portfolio allocation chart (pie/donut)
- [ ] Performance vs benchmark (IHSG for stocks, BTC for crypto)

#### 10.2 Advanced Analytics

- [ ] Portfolio diversity score
- [ ] Risk assessment (volatility, beta)
- [ ] Dividend/staking yield tracking
- [ ] Tax reporting (capital gains summary)
- [ ] Portfolio rebalancing suggestions
- [ ] Historical performance chart

#### 10.3 Transaction History

- [ ] Complete buy/sell history
- [ ] Average cost calculation
- [ ] Realized vs unrealized gains
- [ ] Export to CSV/Excel
- [ ] Import from broker (if possible)

### UI Components:

- Portfolio dashboard (enhanced)
- Performance charts (line, area, candlestick)
- Asset allocation visualization
- Transaction timeline
- Analytics widgets

---

## 🤖 Phase 11: AI-Powered Features

**Priority**: LOW-MEDIUM (Future Innovation)  
**Timeline**: 4-6 weeks  
**Status**: Not Started

### Goals:

- Leverage AI for personalized recommendations
- Automate content categorization
- Provide intelligent insights

### Features:

#### 11.1 AI Recommendations

- [ ] Personalized article suggestions based on reading history
- [ ] "You might also like" similar articles
- [ ] Asset recommendations based on portfolio
- [ ] Trending topics detection
- [ ] Smart notifications (only relevant news)

#### 11.2 Content Analysis

- [ ] Automatic article tagging
- [ ] Sentiment analysis for news (bullish/bearish)
- [ ] Key points extraction (TL;DR generation)
- [ ] Related articles linking
- [ ] Content quality scoring

#### 11.3 Market Insights

- [ ] AI-generated market summaries
- [ ] Pattern recognition in price movements
- [ ] Anomaly detection (unusual volume/price)
- [ ] Correlation analysis between assets
- [ ] News impact prediction

### Technology Stack:

- OpenAI GPT-4 API for text analysis
- Custom ML models for recommendations
- Vector database for semantic search (Pinecone/Weaviate)
- Embeddings for article similarity

---

## 📱 Phase 12: Mobile App (React Native)

**Priority**: LOW (Long-term Goal)  
**Timeline**: 8-12 weeks  
**Status**: Not Started

### Goals:

- Native mobile experience for iOS and Android
- Push notifications support
- Offline reading capabilities
- Better performance on mobile devices

### Features:

- [ ] Cross-platform app with React Native
- [ ] Share codebase with web (API layer)
- [ ] Native navigation
- [ ] Biometric authentication
- [ ] Push notifications (FCM)
- [ ] Offline mode with local storage
- [ ] App store optimization
- [ ] Deep linking support
- [ ] In-app updates

### Considerations:

- Use Expo for faster development
- Share UI components where possible
- Native modules for device features
- App store submission process
- Maintenance overhead (2 additional platforms)

---

## 🚀 Phase 13: Community & Engagement

**Priority**: MEDIUM  
**Timeline**: 4-6 weeks  
**Status**: Not Started

### Goals:

- Build active user community
- Enable peer-to-peer learning
- Increase time on site

### Features:

#### 13.1 Discussion Forum

- [ ] Create forum categories (Saham, Kripto, Strategi)
- [ ] Thread creation and replies
- [ ] Upvote/downvote system
- [ ] Best answer marking
- [ ] User reputation system
- [ ] Moderator tools

#### 13.2 User Profiles

- [ ] Public profile pages
- [ ] Portfolio sharing (optional)
- [ ] Achievement badges
- [ ] Activity timeline
- [ ] Expertise tags
- [ ] Bio and social links

#### 13.3 Gamification

- [ ] Daily login streaks
- [ ] Reading milestones
- [ ] Commenting achievements
- [ ] Leaderboards
- [ ] Referral program
- [ ] Premium member perks

---

## 🎓 Phase 14: Educational Content

**Priority**: MEDIUM  
**Timeline**: Ongoing  
**Status**: Not Started

### Goals:

- Educate new investors
- Establish platform as learning resource
- Improve user investment decisions

### Features:

#### 14.1 Learning Paths

- [ ] Beginner's guide to stocks
- [ ] Cryptocurrency fundamentals
- [ ] Technical analysis course
- [ ] Fundamental analysis course
- [ ] Risk management strategies
- [ ] Portfolio management

#### 14.2 Interactive Tools

- [ ] Investment calculator
- [ ] Compound interest calculator
- [ ] Risk tolerance quiz
- [ ] Asset allocation tool
- [ ] Retirement planning calculator

#### 14.3 Webinars & Events

- [ ] Live webinar hosting
- [ ] Event calendar
- [ ] Recording library
- [ ] Expert Q&A sessions
- [ ] Certificate of completion

---

## 🌐 Phase 15: Expansion & Scale

**Priority**: LOW (Future Vision)  
**Timeline**: 6-12 months  
**Status**: Not Started

### Goals:

- Scale beyond Indonesia
- Multi-language support
- Regional market coverage

### Features:

- [ ] Multi-language support (EN, ID, MS, TH)
- [ ] Multiple market support (SGX, HKEX, etc.)
- [ ] Regional news coverage
- [ ] Local payment methods
- [ ] Currency conversion
- [ ] Timezone handling
- [ ] CDN optimization for regions

---

## 📊 Success Metrics & KPIs

### Current Status (Phase 4):

- Monthly Active Users: TBD
- Daily Active Users: TBD
- Average Session Duration: TBD
- Bounce Rate: TBD
- Conversion Rate (Free to Premium): TBD

### Target Metrics (End of Phase 10):

- MAU: 10,000+
- DAU: 2,000+
- Session Duration: > 5 minutes
- Bounce Rate: < 40%
- Conversion Rate: > 5%
- Newsletter Subscribers: 5,000+
- Premium Members: 500+

---

## 🛠️ Technical Debt & Maintenance

### Ongoing Tasks:

- [ ] Dependency updates (monthly)
- [ ] Security patches (immediate)
- [ ] Performance monitoring (weekly)
- [ ] Error tracking setup (Sentry)
- [ ] Database optimization (quarterly)
- [ ] Code refactoring (ongoing)
- [ ] Documentation updates (ongoing)
- [ ] Test coverage improvements (target: 80%)

### Known Issues:

- None currently reported

---

## 💰 Monetization Strategy

### Current:

- ✅ Premium membership tier (in schema, not enforced)

### Planned:

- [ ] Tiered subscription plans
- [ ] Display advertising (Google AdSense)
- [ ] Sponsored content
- [ ] Affiliate partnerships (broker referrals)
- [ ] API access for businesses
- [ ] White-label solutions
- [ ] Enterprise analytics dashboard

---

## 🎯 Immediate Next Steps (This Week)

Based on priority and impact:

1. **Create Dev Environment Checklist** - Document all setup requirements
2. **Performance Baseline** - Run Lighthouse audit, bundle analyzer
3. **Security Audit** - Review authentication, API routes, data validation
4. **Choose Phase 5 or Phase 6** - Decision on next major feature
5. **Update Project Board** - Migrate roadmap to GitHub Projects

---

## 📝 Notes & Decisions Log

### November 4, 2025

- ✅ Created comprehensive development roadmap
- ✅ Documented 15 phases of development
- ✅ Prioritized performance optimization and price alerts
- ⏳ Awaiting decision on Phase 5 vs Phase 6 priority

### Pending Decisions:

- [ ] Choose between Phase 5 (optimization) or Phase 6 (price alerts) as next sprint
- [ ] Define premium membership pricing tiers
- [ ] Select email service provider (Resend vs SendGrid)
- [ ] Decide on rate limiting solution (Upstash vs Vercel KV)

---

**Legend:**

- ✅ Completed
- 🚧 In Progress
- ⏳ Planned
- ❌ Blocked
- 💡 Idea/Discussion

---

_This roadmap is a living document and will be updated as the project evolves._

**Last Review**: November 4, 2025  
**Next Review**: November 18, 2025
