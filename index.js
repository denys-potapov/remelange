#!/usr/bin/env node
const fs = require("fs");
const remelange = require("./remelange");

let jsCode = "";
try {
  // Read the JavaScript file
  jsCode = fs.readFileSync(process.argv[2], "utf8");
} catch (err) {
  console.error(`
USAGE: 
    npx remelange sample.js
ERROR: 
${err}`);
  process.exit(1);
}

console.log(remelange(jsCode));
