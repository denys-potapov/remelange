const Parser = require("tree-sitter");
const TypeScript = require("tree-sitter-typescript").typescript;

/**
 * Compile jsCode to Ocaml
 */
function remelange(jsCode) {
  const parser = new Parser();
  parser.setLanguage(TypeScript);

  const fs = require("fs");
  const tree = parser.parse(jsCode);
  
  return nodeToOCaml(tree.rootNode);
}

function nodeToOCaml(node) {
    if (!node) {
      return "";
    }

    switch (node.type) {
      case "program":
        return node.children.map(nodeToOCaml).join("\n");
      case "statement_block":
        return node.namedChildren.map(nodeToOCaml).join("\n");
      case "comment": 
        return `(*${node.text}*)`;

      case "function_declaration": {
        const fnName = node.namedChildren[0].text;
        const params = node.namedChildren[1].namedChildren
          .map(p => p.text)
          .join(" ");
        const body = nodeToOCaml(node.namedChildren[2]);
        return `let ${fnName} ${params} =\n${body}`;
      }

      case "if_statement":
        const cond = node.namedChildren[0].text;
        const _then = "";
        const _else = "";
        return `if ${cond} then ${_then} \nelse ${_else}`;

      //   // `x = 42` -> `x = 42`
      //   const name = node.namedChildren[0].text;
      //   const value = jsToOcaml(node.namedChildren[1]);
      //   return `${name} = ${value}`;
      // }

      // case "variable_declaration":
      //   return node.children.map(jsToOcaml).join("\n");

      // case "lexical_declaration": {
      //   // `let x = 42;` -> `let x = 42`
      //   const keyword = "let";
      //   const declarations = node.namedChildren.map(jsToOcaml).join("\n");
      //   return `${keyword} ${declarations}`;
      // }

      // case "variable_declarator": {
      //   // `x = 42` -> `x = 42`
      //   const name = node.namedChildren[0].text;
      //   const value = jsToOcaml(node.namedChildren[1]);
      //   return `${name} = ${value}`;
      // }

      // case "number":
      // case "identifier":
      //   return node.text;

      // case "expression_statement":
      //   return jsToOcaml(node.namedChildren[0]);

      // case "binary_expression": {
      //   // `a + b` -> `a + b`
      //   const left = jsToOcaml(node.namedChildren[0]);
      //   const operator = node.children[1].text;
      //   const right = jsToOcaml(node.namedChildren[2]);
      //   return `${left} ${operator} ${right}`;
      // }

      // case "call_expression": {
      //   // `foo(42)` -> `foo 42`
      //   const fnName = jsToOcaml(node.namedChildren[0]);
      //   const args = node.namedChildren.slice(1).map(jsToOcaml).join(" ");
      //   return `${fnName} ${args}`;
      // }


      // case "return_statement": {
      //   return jsToOcaml(node.namedChildren[0]);
      // }

      // case "block": {
      //   return node.namedChildren.map(jsToOcaml).join("\n");
      // }

      default:
        console.warn(`Unsupported node type ${node.type}`);
        return "";
    }
}

module.exports = remelange;
