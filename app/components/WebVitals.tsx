"use client";

import { useReportWebVitals } from "next/web-vitals";

/**
 * Web Vitals Monitoring Component
 * 
 * Tracks Core Web Vitals metrics and sends them to console/analytics.
 * Best practice: Import in root layout.tsx for app-wide monitoring.
 * 
 * Metrics tracked:
 * - FCP (First Contentful Paint): Time until first DOM content renders
 * - LCP (Largest Contentful Paint): Time until largest content renders
 * - CLS (Cumulative Layout Shift): Visual stability (layout shifts)
 * - FID (First Input Delay): Time until first user interaction processed
 * - TTFB (Time to First Byte): Server response time
 * - INP (Interaction to Next Paint): Responsiveness to all interactions
 * 
 * Good thresholds:
 * - FCP: < 1.8s (good), 1.8-3s (needs improvement), > 3s (poor)
 * - LCP: < 2.5s (good), 2.5-4s (needs improvement), > 4s (poor)
 * - CLS: < 0.1 (good), 0.1-0.25 (needs improvement), > 0.25 (poor)
 * - FID: < 100ms (good), 100-300ms (needs improvement), > 300ms (poor)
 * - TTFB: < 800ms (good), 800-1800ms (needs improvement), > 1800ms (poor)
 * - INP: < 200ms (good), 200-500ms (needs improvement), > 500ms (poor)
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log(`[Web Vitals] ${metric.name}:`, {
        value: metric.value,
        id: metric.id,
        rating: metric.rating,
      });
    }

    // Detailed logging for specific metrics
    switch (metric.name) {
      case "FCP":
        // First Contentful Paint: Marks when first DOM content renders
        console.log(`[FCP] ${metric.value.toFixed(2)}ms - ${metric.rating}`);
        break;

      case "LCP":
        // Largest Contentful Paint: Largest content element visible
        console.log(`[LCP] ${metric.value.toFixed(2)}ms - ${metric.rating}`);
        break;

      case "CLS":
        // Cumulative Layout Shift: Visual stability score
        console.log(`[CLS] ${metric.value.toFixed(4)} - ${metric.rating}`);
        break;

      case "FID":
        // First Input Delay: Time to first interaction
        console.log(`[FID] ${metric.value.toFixed(2)}ms - ${metric.rating}`);
        break;

      case "TTFB":
        // Time to First Byte: Server response time
        console.log(`[TTFB] ${metric.value.toFixed(2)}ms - ${metric.rating}`);
        break;

      case "INP":
        // Interaction to Next Paint: Responsiveness
        console.log(`[INP] ${metric.value.toFixed(2)}ms - ${metric.rating}`);
        break;

      default:
        // Other metrics (Next.js-hydration, Next.js-route-change-to-render, etc.)
        console.log(`[${metric.name}] ${metric.value.toFixed(2)}ms`);
    }

    // Send to external analytics (if configured)
    // Example: Vercel Analytics, Google Analytics, custom endpoint
    if (typeof window !== "undefined") {
      // Option 1: Send to Vercel Analytics (automatic if @vercel/analytics installed)
      // Already handled by Vercel's built-in analytics
      
      // Option 2: Send to Google Analytics (gtag.js)
      // if (window.gtag) {
      //   window.gtag("event", metric.name, {
      //     value: Math.round(
      //       metric.name === "CLS" ? metric.value * 1000 : metric.value
      //     ),
      //     event_label: metric.id,
      //     non_interaction: true,
      //   });
      // }

      // Option 3: Send to custom analytics endpoint
      // const body = JSON.stringify(metric);
      // const url = "/api/analytics/vitals";
      // if (navigator.sendBeacon) {
      //   navigator.sendBeacon(url, body);
      // } else {
      //   fetch(url, { body, method: "POST", keepalive: true });
      // }
    }
  });

  // Return null - this component doesn't render anything
  return null;
}
