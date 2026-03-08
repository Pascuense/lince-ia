import { test, expect } from 'vitest'

test('smoke: environment and test runner work', () => {
  // simple deterministic assertion to validate test runner setup
  expect(1 + 1).toBe(2)
})
