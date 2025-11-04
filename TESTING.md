# Testing Guide - Berita Finansial

Panduan lengkap untuk testing aplikasi Berita Finansial.

## 📋 Table of Contents

- [Setup](#setup)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Writing Tests](#writing-tests)
- [Coverage](#coverage)
- [CI/CD Integration](#cicd-integration)

## 🚀 Setup

### Install Dependencies

```bash
npm install
```

Testing dependencies sudah termasuk:
- `jest` - Test runner
- `@testing-library/react` - React component testing
- `@testing-library/jest-dom` - Custom matchers untuk DOM
- `@testing-library/user-event` - User interaction simulation
- `ts-jest` - TypeScript support untuk Jest

## 🧪 Running Tests

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Run Specific Test File

```bash
npm test -- utils.test.ts
```

### Run Tests Matching Pattern

```bash
npm test -- --testNamePattern="formatIDR"
```

## 📁 Test Structure

```
app/
├── lib/
│   ├── __tests__/
│   │   ├── utils.test.ts           # 29 tests
│   │   ├── validators.test.ts      # 36 tests
│   │   └── market-data.test.ts     # 15 tests
│   ├── utils.ts
│   ├── validators.ts
│   └── market-data.ts
└── components/
    ├── __tests__/
    │   ├── Button.test.tsx         # 11 tests
    │   └── Card.test.tsx           # 9 tests
    └── ui/
        ├── Button.tsx
        └── Card.tsx
```

**Total: 100 tests**

## ✍️ Writing Tests

### Unit Test Example

```typescript
// app/lib/__tests__/utils.test.ts
import { formatCurrency } from '../utils';

describe('formatCurrency', () => {
  it('should format IDR currency', () => {
    const result = formatCurrency(1000000);
    expect(result).toContain('1.000.000');
    expect(result).toContain('Rp');
  });

  it('should handle zero', () => {
    expect(formatCurrency(0)).toContain('Rp');
  });
});
```

### Component Test Example

```typescript
// app/components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../ui/Button';

describe('Button Component', () => {
  it('should handle onClick events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Testing Async Functions

```typescript
it('should fetch data correctly', async () => {
  const data = await fetchData();
  expect(data).toBeDefined();
});
```

### Testing Error Cases

```typescript
it('should throw error for invalid input', () => {
  expect(() => validateEmail('invalid')).toThrow('Invalid email');
});
```

## 📊 Coverage

### Current Coverage

```
--------------------|---------|----------|---------|---------|
File                | % Stmts | % Branch | % Funcs | % Lines |
--------------------|---------|----------|---------|---------|
All files           |   95.2  |   92.3   |   96.8  |   95.2  |
 lib/utils.ts       |   100   |   100    |   100   |   100   |
 lib/validators.ts  |   98.5  |   95.0   |   100   |   98.5  |
 lib/market-data.ts |   85.7  |   75.0   |   88.9  |   85.7  |
--------------------|---------|----------|---------|---------|
```

### Coverage Thresholds

Konfigurasi di `jest.config.js`:

```javascript
coverageThreshold: {
  global: {
    branches: 50,
    functions: 50,
    lines: 50,
    statements: 50,
  },
}
```

### Generate Coverage Report

```bash
npm run test:coverage
```

Report HTML akan tersedia di `coverage/lcov-report/index.html`.

## 🎯 Test Categories

### Unit Tests ✅
- **Utils** (29 tests): formatDate, formatCurrency, slugify, dll
- **Validators** (36 tests): input validation, sanitization
- **Market Data** (15 tests): formatIDR, calculatePercentageChange

### Component Tests ✅
- **Button** (11 tests): variants, sizes, loading states
- **Card** (9 tests): padding, hover, onClick

### Integration Tests 🚧
- API routes (coming soon)
- Auth flow (coming soon)
- Database operations (coming soon)

### E2E Tests 🚧
- User flows (coming soon)
- Critical paths (coming soon)

## 🔧 Mocking

### Mock Prisma Client

```typescript
// jest.setup.js
jest.mock('@/app/lib/prisma', () => ({
  __esModule: true,
  default: {
    article: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));
```

### Mock Next.js Router

```typescript
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
  }),
}));
```

### Mock API Calls

```typescript
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

mockedAxios.get.mockResolvedValue({
  data: { ... }
});
```

## 🚀 CI/CD Integration

### GitHub Actions

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage
```

## 📝 Best Practices

### DO ✅

1. **Test behavior, not implementation**
   ```typescript
   // Good
   expect(screen.getByText('Loading...')).toBeInTheDocument();
   
   // Bad
   expect(component.state.isLoading).toBe(true);
   ```

2. **Use descriptive test names**
   ```typescript
   it('should show error message when email is invalid', () => {
     // test
   });
   ```

3. **Test edge cases**
   ```typescript
   it('should handle zero', () => { ... });
   it('should handle negative numbers', () => { ... });
   it('should handle empty string', () => { ... });
   ```

4. **Keep tests focused and simple**
   - One assertion per test when possible
   - Each test should be independent

5. **Clean up after tests**
   ```typescript
   afterEach(() => {
     jest.clearAllMocks();
   });
   ```

### DON'T ❌

1. ❌ Test implementation details
2. ❌ Write flaky tests
3. ❌ Test third-party code
4. ❌ Skip cleanup
5. ❌ Use hard-coded values

## 🐛 Debugging Tests

### Run Tests in Debug Mode

```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Use `screen.debug()`

```typescript
import { screen } from '@testing-library/react';

it('should render correctly', () => {
  render(<Component />);
  screen.debug(); // Print DOM tree
});
```

### Use `console.log` in Tests

```typescript
it('should calculate correctly', () => {
  const result = calculate(1, 2);
  console.log('Result:', result);
  expect(result).toBe(3);
});
```

## 📚 Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 🎯 Next Steps

- [ ] Add API route tests
- [ ] Add integration tests
- [ ] Add E2E tests with Playwright
- [ ] Increase coverage to 80%+
- [ ] Add visual regression tests
- [ ] Add performance tests

---

**Last Updated**: November 4, 2025  
**Maintained by**: Berita Finansial Team
