export const sum = (a, b) => {
  if (typeof a !== 'number' || typeof b !== 'number' || isNaN(a) || isNaN(b)) {
    throw new Error('Arguments must be numbers');
  }
  return a + b;
};