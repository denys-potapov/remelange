const remelange = require("./remelange");

test("Simple test", () => {
  expect(
    remelange(`
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
`).trim(),
  ).toBe(
    `
(*/*
 * Calculate the nth Fibonacci number
 */*)
let rec fib n =
if (n <= 1) then n
else (fib n - 1) + (fib n - 2)
`.trim(),
  );
});
