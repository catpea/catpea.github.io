#!/usr/bin/env node
// Refresh the portable HTML projection after editing label.mlml. No dependencies.
import { readFile, writeFile, rename, unlink } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const home = new URL('./', import.meta.url);
const input = process.argv[2] ? resolve(process.argv[2]) : fileURLToPath(new URL('label.mlml', home));
const output = process.argv[3] ? resolve(process.argv[3]) : fileURLToPath(new URL('index.html', home));
const template = fileURLToPath(new URL('index.html', home));
let temporary;
try {
  const [xml, html] = await Promise.all([readFile(input, 'utf8'), readFile(template, 'utf8')]);
  const marker = /const EMBEDDED_MLML = [\s\S]*?; \/\* END_MLML_SEED \*\//g;
  if ([...html.matchAll(marker)].length !== 1) throw new Error('The viewer must contain exactly one MLML seed marker.');
  const encoded = JSON.stringify(xml).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  const result = html.replace(marker, () => `const EMBEDDED_MLML = ${encoded}; /* END_MLML_SEED */`);
  temporary = `${output}.${process.pid}.tmp`;
  await writeFile(temporary, result, { encoding: 'utf8', flag: 'wx' });
  await rename(temporary, output);
  temporary = undefined;
  console.log(`Projected ${input} → ${output}`);
} catch (error) {
  if (temporary) await unlink(temporary).catch(() => {});
  console.error(`Could not build the MLML viewer: ${error.message}`);
  process.exitCode = 1;
}
