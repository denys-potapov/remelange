# remelange — experimental JS/TS to OCaml compiler

A minimal JS/TS to OCaml compiler using Tree-sitter.

## Installation and usage

You can run the tool without installing it globally using npx:

    npx js-to-ocaml input.js

It parses JavaScript code and outputs generated OCaml code to stdout.

Write me a short readme for this tool, use npx to run samples
JS to OCaml Compiler

It parses JavaScript code, converts function names to snake_case, and generates equivalent OCaml code.
Installation

Or install dependencies manually:

npm install tree-sitter tree-sitter-javascript

Then run:

node js_to_ocaml.js input.js

Example Conversion
JavaScript (input.js)

function fibRecursive(n) {
if (n <= 1) {
return n;
}
return fibRecursive(n - 1) + fibRecursive(n - 2);
}

let result = fibRecursive(5);

Generated OCaml Output

let rec fib_recursive n =
if n <= 1 then n
else fib_recursive (n - 1) + fib_recursive (n - 2)

let result = fib_recursive 5

## Features

✅ (?) Parses JavaScript using Tree-sitter

✅ (?)Converts function names to snake_case

✅ (?)Supports function calls, variables, expressions

## TODO

    [ ] Add support for if/else, loops, and arrays
    [ ] Improve indentation and formatting
