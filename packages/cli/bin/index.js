#!/usr/bin/env node
const esbuild = require('esbuild');
const path = require("path")

const settingsProto = require(path.join(process.cwd(), "./limo.conf.js"));
const isFunction = typeof settingsProto === "function";
const settings = isFunction ? settingsProto() : settingsProto;

console.log('Welcome to Limo!')
console.log(settings);

esbuild.build({
  entryPoints: [settings.entry],
  bundle: true,
  outfile: settings.outfile,
  jsxFactory: 'Limo',
  platform: 'node',
}).catch(() => process.exit(1));
