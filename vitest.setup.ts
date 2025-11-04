import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Extend matchers
expect.extend({});
