/**
 * Compile jsCode to Ocaml
 */
function remelange(jsCode) {
  const Parser = require("tree-sitter");
  const JavaScript = require("tree-sitter-javascript");
  const fs = require("fs");

  const parser = new Parser();
  parser.setLanguage(JavaScript);

  // Read the JavaScript file
  const inputCode = fs.readFileSync(process.argv[2], "utf8");
  const tree = parser.parse(inputCode);

  function jsToOcaml(node) {
    switch (node.type) {
      case "program":
        return node.children.map(jsToOcaml).join("\n");

      case "variable_declaration":
        return node.children.map(jsToOcaml).join("\n");

      case "lexical_declaration": {
        // `let x = 42;` -> `let x = 42`
        const keyword = "let";
        const declarations = node.namedChildren.map(jsToOcaml).join("\n");
        return `${keyword} ${declarations}`;
      }

      case "variable_declarator": {
        // `x = 42` -> `x = 42`
        const name = node.namedChildren[0].text;
        const value = jsToOcaml(node.namedChildren[1]);
        return `${name} = ${value}`;
      }

      case "number":
      case "identifier":
        return node.text;

      case "expression_statement":
        return jsToOcaml(node.namedChildren[0]);

      case "binary_expression": {
        // `a + b` -> `a + b`
        const left = jsToOcaml(node.namedChildren[0]);
        const operator = node.children[1].text;
        const right = jsToOcaml(node.namedChildren[2]);
        return `${left} ${operator} ${right}`;
      }

      case "call_expression": {
        // `foo(42)` -> `foo 42`
        const fnName = jsToOcaml(node.namedChildren[0]);
        const args = node.namedChildren.slice(1).map(jsToOcaml).join(" ");
        return `${fnName} ${args}`;
      }

      case "function_declaration": {
        // `function foo(x) { return x + 1; }` -> `let foo x = x + 1`
        const fnName = node.namedChildren[0].text;
        const params = node.namedChildren[1].namedChildren
          .map(jsToOcaml)
          .join(" ");
        const body = jsToOcaml(node.namedChildren[2]);
        return `let ${fnName} ${params} = ${body}`;
      }

      case "return_statement": {
        return jsToOcaml(node.namedChildren[0]);
      }

      case "block": {
        return node.namedChildren.map(jsToOcaml).join("\n");
      }

      default:
        return "";
    }
  }

  const ocamlCode = jsToOcaml(tree.rootNode);
  console.log(ocamlCode);
}

module.exports = remelange;
