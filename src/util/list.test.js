import { generateList, generateRandomNumbers } from './list';

describe('Validating generating random numbers', () => {
  it('Validate that the numbers are all unique and within the expected range', () => {
    const pairs = 5;
    const random = generateRandomNumbers(pairs);
    const check = new Set();
    random.forEach(number => {
      expect(number).toBeGreaterThanOrEqual(1);
      expect(number).toBeLessThanOrEqual(100);
      check.add(number);
    });
    expect(check.size).toBe(pairs);
  });

  it('Validate that the generated list will always be twice the expected length', () => {
    const pairs = 5;
    const generatedPairs = generateList(pairs);
    expect(generatedPairs.length).toBe(pairs * 2);
  });

  it('Validate that the generated numbers will never be more than 100', () => {
    const random = generateRandomNumbers(200);
    expect(random.length).toBe(100);
  });

  it('Validate that the generated numbers will never be less than 1', () => {
    let random = generateRandomNumbers(0);
    expect(random.length).toBe(1);
    random = generateRandomNumbers(-1);
    expect(random.length).toBe(1);
    random = generateRandomNumbers('X');
    expect(random.length).toBe(1);
  });
});
