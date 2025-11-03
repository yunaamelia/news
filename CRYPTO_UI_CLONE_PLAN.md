# 🎯 Crypto Tailwind UI Clone - Implementation Plan

## 📋 Analysis Summary

Berdasarkan deep analysis menggunakan Chrome DevTools MCP dan Context7 documentation, website target (`https://crypto-tailwind.preview.uideck.com`) menggunakan:

- **Alpine.js** untuk interaktivity (bukan React)
- **Pure Tailwind CSS** dengan utility-first approach
- **Glassmorphism** untuk sticky header
- **Dark mode class-based** toggle
- **Gradient backgrounds** dengan SVG decorations
- **Tooltip system** berbasis CSS (group hover)

---

## 🏗️ Architecture Decision: Next.js 15 Approach

### ✅ What We'll Keep from Target

1. **Glassmorphism effect** (`backdrop-blur-xs`, `bg-white/80`)
2. **Dark mode utilities** (`dark:` prefix)
3. **Gradient backgrounds** (linear-gradient patterns)
4. **Tooltip patterns** (absolute positioning + group hover)
5. **Responsive breakpoints** (mobile-first approach)
6. **Color palette** (blue primary, navy dark)

### 🔄 What We'll Adapt

1. **Alpine.js → React Hooks** (`x-data` → `useState`)
2. **Static HTML → Server Components** (Next.js 15 App Router)
3. **Manual scroll events → `useEffect` + `window.scrollY`**
4. **Crypto icons → Indonesian stocks/crypto data**
5. **English → Bahasa Indonesia** (semua UI text)

---

## 📦 Phase 1: Design System Setup (2-3 hours)

### 1.1 Tailwind Configuration

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3e7dff",
          50: "#eff6ff",
          100: "#dbeafe",
          // ... gradient scale
          900: "#1e3a8a",
        },
        dark: {
          DEFAULT: "#1E2763",
          light: "#2D2C4A",
          bg: "#0a0a0a",
        },
        "body-color": "#637381",
        "body-color-2": "#8896A4",
        "light-bg": "#F3F4F6",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        sticky: "0 10px 30px rgba(0, 0, 0, 0.05)",
      },
      backgroundImage: {
        "gradient-primary":
          "linear-gradient(180deg, #3e7dff 0%, rgba(62, 125, 255, 0) 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
```

### 1.2 Global CSS Extensions

```css
/* app/globals.css - tambahan */
@layer utilities {
  .backdrop-blur-xs {
    backdrop-filter: blur(2px);
  }

  .shadow-sticky {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  }

  .bg-gradient-hero {
    background-image: linear-gradient(
      180deg,
      #3e7dff 0%,
      rgba(62, 125, 255, 0) 100%
    );
  }
}
```

---

## 📦 Phase 2: Sticky Glassmorphism Header (3-4 hours)

### 2.1 Header Component Structure

```typescript
// app/components/layout/GlassmorphismNavbar.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { DarkModeToggle } from './DarkModeToggle'
import { HamburgerMenu } from './HamburgerMenu'

export function GlassmorphismNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`
        fixed top-0 z-50 w-full flex items-center transition-all duration-300
        ${scrolled
          ? 'bg-white/80 dark:bg-dark/80 shadow-sticky backdrop-blur-xs'
          : 'bg-transparent dark:bg-transparent'
        }
      `}
    >
      <div className="container">
        <div className="relative flex items-center justify-between -mx-4">
          {/* Logo */}
          <div className="max-w-full px-4 w-60">
            <Link
              href="/"
              className={`block w-full transition-all ${scrolled ? 'py-4 lg:py-2' : 'py-6 lg:py-5'}`}
            >
              <Image
                src="/logo.svg"
                alt="BeritaFinansial"
                width={180}
                height={40}
                className="w-full dark:hidden"
              />
              <Image
                src="/logo-white.svg"
                alt="BeritaFinansial"
                width={180}
                height={40}
                className="hidden w-full dark:block"
              />
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-8">
            <NavLink href="/#home">Beranda</NavLink>
            <NavLink href="/saham">Saham</NavLink>
            <NavLink href="/kripto">Kripto</NavLink>
            <NavLink href="/analisis">Analisis</NavLink>
            <NavLink href="/edukasi">Edukasi</NavLink>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <DarkModeToggle />
            <Link
              href="/auth/signin"
              className="hidden sm:flex items-center justify-center rounded-full border border-body-color-2 py-2 px-6 text-sm font-semibold transition-all hover:border-primary hover:bg-primary hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-primary"
            >
              Masuk
            </Link>
            <HamburgerMenu
              isOpen={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            />
          </div>
        </div>
      </div>
    </header>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-lg font-semibold text-body-color-2 hover:text-primary dark:text-body-color dark:hover:text-white transition-colors"
    >
      {children}
    </Link>
  )
}
```

### 2.2 Dark Mode Toggle Component

```typescript
// app/components/layout/DarkModeToggle.tsx
'use client'

import { useEffect, useState } from 'react'

export function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    // Load from localStorage
    const isDark = localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    setDarkMode(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.theme = newMode ? 'dark' : 'light'
    document.documentElement.classList.toggle('dark', newMode)
  }

  return (
    <label
      htmlFor="darkToggler"
      className="flex h-11 w-20 cursor-pointer items-center justify-center rounded-full bg-light-bg dark:bg-[#1E2763] transition-colors"
    >
      <input
        type="checkbox"
        id="darkToggler"
        className="sr-only"
        checked={darkMode}
        onChange={toggleDarkMode}
      />
      <span className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
        darkMode
          ? 'bg-transparent text-body-color'
          : 'bg-primary text-white'
      }`}>
        <svg width="16" height="16" viewBox="0 0 16 16" className="fill-current">
          <path d="M4.50663 3.2267L3.30663 2.03337L2.36663 2.97337L3.55996 4.1667L4.50663 3.2267ZM2.66663 7.00003H0.666626V8.33337H2.66663V7.00003ZM8.66663 0.366699H7.33329V2.33337H8.66663V0.366699ZM13.6333 2.97337L12.6933 2.03337L11.5 3.2267L12.44 4.1667L13.6333 2.97337ZM11.4933 12.1067L12.6866 13.3067L13.6266 12.3667L12.4266 11.1734L11.4933 12.1067ZM13.3333 7.00003V8.33337H15.3333V7.00003H13.3333ZM7.99996 3.6667C5.79329 3.6667 3.99996 5.46003 3.99996 7.6667C3.99996 9.87337 5.79329 11.6667 7.99996 11.6667C10.2066 11.6667 12 9.87337 12 7.6667C12 5.46003 10.2066 3.6667 7.99996 3.6667ZM7.33329 14.9667H8.66663V13H7.33329V14.9667ZM2.36663 12.36L3.30663 13.3L4.49996 12.1L3.55996 11.16L2.36663 12.36Z"/>
        </svg>
      </span>
      <span className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
        darkMode
          ? 'bg-primary text-white'
          : 'bg-transparent text-body-color-2'
      }`}>
        <svg width="13" height="15" viewBox="0 0 13 15" className="fill-current">
          <path d="M10.6111 12.855C11.591 12.1394 12.3151 11.1979 12.7723 10.1623C10.4824 10.4065 8.1342 9.46314 6.67948 7.47109C5.22476 5.47905 5.04093 2.95516 5.97054 0.848179C4.84491 0.968503 3.72768 1.37162 2.74781 2.08719C-0.224105 4.25747 -0.874706 8.43084 1.29558 11.4028C3.46586 14.3747 7.63923 15.0253 10.6111 12.855Z"/>
        </svg>
      </span>
    </label>
  )
}
```

### 2.3 Hamburger Menu Component

```typescript
// app/components/layout/HamburgerMenu.tsx
'use client'

interface HamburgerMenuProps {
  isOpen: boolean
  onClick: () => void
}

export function HamburgerMenu({ isOpen, onClick }: HamburgerMenuProps) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary"
      aria-label="Toggle Menu"
    >
      <span className={`relative block h-0.5 w-7 bg-black dark:bg-white transition-all ${isOpen ? 'rotate-45 top-1.5' : 'my-1.5'}`} />
      <span className={`relative block h-0.5 w-7 bg-black dark:bg-white transition-all ${isOpen ? 'opacity-0' : 'my-1.5'}`} />
      <span className={`relative block h-0.5 w-7 bg-black dark:bg-white transition-all ${isOpen ? '-rotate-45 -top-1.5' : 'my-1.5'}`} />
    </button>
  )
}
```

---

## 📦 Phase 3: Hero Section dengan Gradient (2-3 hours)

```typescript
// app/components/home/HeroSection.tsx
'use client'

import Link from 'link'
import { CryptoIcons } from './CryptoIcons'

export function HeroSection() {
  return (
    <section id="home" className="relative z-10 pt-48 pb-28">
      <div className="container">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full px-4">
            <div className="mx-auto max-w-[720px] text-center">
              <h1 className="mb-4 text-3xl font-bold leading-tight text-black dark:text-white md:text-[45px]">
                Platform Berita Saham & Kripto Terpercaya Indonesia
              </h1>
              <p className="mx-auto mb-4 max-w-[620px] text-lg font-medium text-body-color-2 dark:text-white">
                Dapatkan berita real-time, analisis mendalam, dan data pasar terlengkap untuk keputusan investasi yang lebih baik.
              </p>

              <CryptoIcons />

              <Link
                href="/premium"
                className="inline-block px-8 py-3 text-base font-semibold text-white rounded-full bg-primary hover:bg-primary/90 transition-colors"
              >
                Mulai Gratis
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient Background */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-20 bg-gradient-hero" />

      {/* SVG Decorations */}
      <div className="absolute top-0 left-0 -z-10">
        <svg width="300" height="300" viewBox="0 0 300 300" className="text-primary/10">
          <circle cx="150" cy="150" r="120" fill="currentColor" />
        </svg>
      </div>
      <div className="absolute top-0 right-0 -z-10">
        <svg width="200" height="200" viewBox="0 0 200 200" className="text-primary/10">
          <circle cx="100" cy="100" r="80" fill="currentColor" />
        </svg>
      </div>
    </section>
  )
}
```

---

## 📦 Phase 4: Reusable Components (2-3 hours)

### 4.1 Tooltip Component

```typescript
// app/components/ui/Tooltip.tsx
interface TooltipProps {
  content: string
  children: React.ReactNode
}

export function Tooltip({ content, children }: TooltipProps) {
  return (
    <div className="relative group">
      {children}
      <div className="absolute -top-full left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#2D2C4A] px-5 py-2 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <span className="absolute -bottom-1 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-[#2D2C4A]" />
        {content}
      </div>
    </div>
  )
}
```

### 4.2 Market Icon dengan Tooltip

```typescript
// app/components/market/MarketIcon.tsx
import Image from 'next/image'
import { Tooltip } from '@/app/components/ui/Tooltip'

interface MarketIconProps {
  symbol: string
  name: string
  icon: string
  color: string
}

export function MarketIcon({ symbol, name, icon, color }: MarketIconProps) {
  return (
    <Tooltip content={`${name} (${symbol})`}>
      <span
        className="flex items-center justify-center w-10 h-10 mt-2 bg-white rounded-full transition-transform hover:scale-110"
        style={{ boxShadow: `0 4px 12px ${color}20` }}
      >
        <Image src={icon} alt={symbol} width={24} height={24} />
      </span>
    </Tooltip>
  )
}
```

---

## 📦 Phase 5: Integration & Testing (2-3 hours)

### 5.1 Update Layout

```typescript
// app/layout.tsx
import { GlassmorphismNavbar } from './components/layout/GlassmorphismNavbar'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="bg-white dark:bg-black">
        <GlassmorphismNavbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
```

### 5.2 Performance Optimizations

```typescript
// next.config.ts
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ hostname: "assets.vercel.com" }],
  },
  experimental: {
    optimizeCss: true,
  },
};
```

---

## ✅ Checklist Implementasi

### Design System

- [ ] Configure Tailwind with crypto theme colors
- [ ] Add custom backdrop-blur utilities
- [ ] Set up dark mode class strategy
- [ ] Create gradient background utilities

### Components

- [ ] GlassmorphismNavbar with scroll trigger
- [ ] DarkModeToggle with localStorage
- [ ] HamburgerMenu with animation
- [ ] HeroSection with gradient + SVG
- [ ] Tooltip component
- [ ] MarketIcon component

### Integration

- [ ] Replace current Navbar with Glassmorphism version
- [ ] Add Hero section to homepage
- [ ] Test dark mode toggle
- [ ] Test responsive behavior
- [ ] Validate scroll performance

### Testing

- [ ] Lighthouse score > 90
- [ ] Dark mode persistence works
- [ ] Mobile navigation smooth
- [ ] Glassmorphism renders correctly
- [ ] All tooltips functional

---

## 🎯 Success Criteria

1. **Visual Match**: 90%+ similarity to target design
2. **Performance**: LCP < 2.5s, CLS < 0.1
3. **Accessibility**: WCAG 2.1 AA compliant
4. **Responsive**: Perfect on mobile/tablet/desktop
5. **Dark Mode**: Seamless toggle with no flicker

---

## 📚 Resources

- **Tailwind Docs**: https://tailwindcss.com/docs/dark-mode
- **Next.js Image**: https://nextjs.org/docs/api-reference/next/image
- **Context7 Tailwind**: Comprehensive utilities for responsive and dark mode
- **Chrome DevTools Analysis**: Full page structure captured

---

## 🚀 Estimated Timeline

- **Day 1 (4h)**: Design system + Header component
- **Day 2 (4h)**: Hero section + Tooltips
- **Day 3 (3h)**: Integration + Testing
- **Total**: ~11 hours untuk full implementation

**Status**: Ready to implement ✅
