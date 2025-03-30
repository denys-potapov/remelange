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
        .map((p) => p.text)
        .join(" ");
      const body = nodeToOCaml(node.namedChildren[2]);

      // Support recursive definitions
      const rec = body.includes(fnName) ? "rec " : "";

      return `let ${rec}${fnName} ${params} =\n${body}`;
    }

    case "else_clause":
      return `\nelse ${nodeToOCaml(node.namedChildren[0])}`;

    case "if_statement":
      const cond = node.namedChildren[0].text;
      const _then = nodeToOCaml(node.namedChildren[1]);
      const _else = nodeToOCaml(node.namedChildren[2]);
      return `if ${cond} then ${_then}${_else}`;

    case "number":
    case "identifier":
      return node.text;

    case "binary_expression": {
      const left = nodeToOCaml(node.leftNode);
      const operator = node.children[1].text;
      const right = nodeToOCaml(node.rightNode);
      return `${left} ${operator} ${right}`;
    }

    case "call_expression": {
      const fnName = node.functionNode.text; // TODO convertsnake
      const args = node.argumentsNode.namedChildren.map(nodeToOCaml).join(" ");
      return `(${fnName} ${args})`;
    }

    case "return_statement": {
      return nodeToOCaml(node.namedChildren[0]);
    }

    default:
      console.warn(`Unsupported node type ${node.type}`);
      return "";
  }
}

module.exports = remelange;
