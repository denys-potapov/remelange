const remelange = require("./remelange");

test("Fibonacci", () => {
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
(* COMPILED WITH remelange *)
(*/*
 * Calculate the nth Fibonacci number
 */*)
let rec fib n =
if (n <= 1) then n
else (fib n - 1) + (fib n - 2)
`.trim(),
  );
});

test("is-odd", () => {
  expect(
    remelange(`
const isNumber = require('is-number');

module.exports = function isOdd(value) {
    const n = Math.abs(value);
    if (!isNumber(n)) {
        throw new TypeError('expected a number');
    }
    if (!Number.isInteger(n)) {
        throw new Error('expected an integer');
    }
    if (!Number.isSafeInteger(n)) {
        throw new Error('value exceeds maximum safe integer');
    }

    return (n % 2) === 1;
};
`).trim(),
  ).toBe(
    `
(* COMPILED WITH remelange *)
let is_odd value =
let n = (Int.abs value) in
(n mod 2) = 1
`.trim(),
  );
});
