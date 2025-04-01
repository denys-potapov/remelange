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

  return removeEmptyLines(
    "(* COMPILED WITH remelange *)\n" + nodeToOCaml(tree.rootNode),
  );
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

    case "lexical_declaration":
    case "expression_statement":
      return nodeToOCaml(node.namedChildren[0]);

    case "variable_declarator":
      const name = node.namedChildren[0].text;
      const value = nodeToOCaml(node.namedChildren[1]);
      if (value) {
        return `let ${name} = ${value} in`;
      }

      return "";

    case "assignment_expression":
      if (node.leftNode.text === "module.exports") {
        return nodeToOCaml(node.rightNode);
      }
      return "";

    case "parenthesized_expression":
      const inner = nodeToOCaml(node.namedChildren[0]);
      return inner ? `(${inner})` : "";

    case "comment":
      return `(*${node.text}*)`;

    case "function_expression":
    case "function_declaration": {
      const fnName = toSnakeCase(node.namedChildren[0].text);
      const params = node.namedChildren[1].namedChildren
        .map((p) => p.text)
        .join(" ");
      const body = nodeToOCaml(node.namedChildren[2]);

      // Support recursive definitions
      const rec = body.includes(fnName) ? "rec " : "";

      return `let ${rec}${fnName} ${params} =\n${body}`;
    }

    case "if_statement":
      const cond = nodeToOCaml(node.namedChildren[0]);
      if (cond) {
        const _then = nodeToOCaml(node.namedChildren[1]);
        const _else = nodeToOCaml(node.namedChildren[2]);

        return `if ${cond} then ${_then}${_else}`;
      }
      return "";

    case "else_clause":
      return `\nelse ${nodeToOCaml(node.namedChildren[0])}`;

    case "number":
    case "identifier":
      return node.text;

    case "binary_expression": {
      const left = nodeToOCaml(node.leftNode);
      let operator = node.children[1].text;
      if (operator === "===") {
        operator = "=";
      }
      if (operator === "%") {
        operator = "mod";
      }
      const right = nodeToOCaml(node.rightNode);

      return `${left} ${operator} ${right}`;
    }

    case "call_expression": {
      const fnName = convertCall(node.functionNode.text);
      if (fnName) {
        const args = node.argumentsNode.namedChildren
          .map(nodeToOCaml)
          .join(" ");
        return `(${fnName} ${args})`;
      }
      return "";
    }

    case "return_statement": {
      return nodeToOCaml(node.namedChildren[0]);
    }

    default:
      console.warn(`Unsupported node type ${node.type} at ${node.text}`);
      return "";
  }
}

function toSnakeCase(name) {
  return name.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
}

function removeEmptyLines(code) {
  return code
    .split("\n")
    .filter((line) => line.trim() !== "")
    .join("\n");
}

function convertCall(fnName) {
  switch (fnName) {
    case "require":
    case "isNumber":
    case "Number.isInteger":
    case "Number.isSafeInteger":
      return "";

    case "Math.abs":
      // TODO add float support
      return "Int.abs";

    default:
      return fnName;
  }
}

module.exports = remelange;
