import { sum } from './index.js'; // Note the .js extension is required for ESM

describe('sum', () => {
    it('should return the sum of two positive numbers', () => {
        expect(sum(2, 3)).toBe(5);
    });

    it('should return the sum of a positive and a negative number', () => {
        expect(sum(5, -3)).toBe(2);
    });

    it('should return the sum of two negative numbers', () => {
        expect(sum(-4, -6)).toBe(-10);
    });

    it('should return the sum when one of the numbers is zero', () => {
        expect(sum(0, 7)).toBe(7);
        expect(sum(7, 0)).toBe(7);
    });

    it('should return zero when both numbers are zero', () => {
        expect(sum(0, 0)).toBe(0);
    });

    it('should handle non-numeric inputs gracefully', () => {
        expect(() => sum('a', 3)).toThrow();
        expect(() => sum(2, 'b')).toThrow();
        expect(() => sum(null, undefined)).toThrow();
    });

    it('should handle floating-point numbers correctly', () => {
        expect(sum(1.5, 2.3)).toBeCloseTo(3.8, 4);
        expect(sum(-1.1, -2.2)).toBeCloseTo(-3.3, 4);
    });

    it('should handle very large numbers without overflow', () => {
        const largeNumber = Number.MAX_SAFE_INTEGER;
        expect(sum(largeNumber, 1)).toBe(largeNumber + 1);
    });
});