# remelange — experimental JS/TS to OCaml compiler

A minimal JS/TS to OCaml compiler using Tree-sitter.

## Installation and usage

Create `sample.js`

```javascript
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
```

You can run remelange without installing using npx:

    npx remelange sample.js > sample.ml

Optionally format the code:

    ocamlformat --enable-outside-detected-project sample.ml

Result `sample.ml`:

```ocaml
(* COMPILED WITH remelange *)
(*/*
 * Calculate the nth Fibonacci number
 */*)
let rec fib n = if n <= 1 then n else fib n - 1 + (fib n - 2)
```

Generate `*.mli` file if you want to publish as opam package:

    ocamlc -i sample.ml > sample.mli

```ocaml
val fib : int -> int
```

## Features

✅ Recursive function declaration

✅ Respect OCaml naming convention

✅ Supports function calls, variables, expressions

## TODO

[ ] Improve indentation and formatting
[ ] Support for TS polymorphic variants
