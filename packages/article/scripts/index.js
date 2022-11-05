#!/usr/bin/env node
const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ["src/server.js"],
  bundle: true,
  outfile: "build/server.js",
  jsxFactory: 'CustomJsxProcessor',
  jsx: 'transform',
  platform: 'node',
}).catch(() => process.exit(1));
