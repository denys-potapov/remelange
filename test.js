const remelange = require("./remelange");

test("Simple test", () => {
  expect(remelange(`
/*
 * Calculate the nth Fibonacci number
 */
function fib(n) {
  if (n <= 1) {
    return n;
  } else {
    return fib(n - 1) + fib(n - 2);
  }
}
`.trim())).toBe(`

`);
});