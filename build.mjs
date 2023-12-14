import { copyFileSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { minify } from 'minify';
import { URL } from 'url';
import tryToCatch from 'try-to-catch';

const name = 'whitestone-stream-ui';
const base = new URL('.', import.meta.url).pathname;
const src  = join(base, 'src');
const dist = join(base, 'dist');
const srcfile  = (file) => join(src, file);
const distfile = (file) => join(dist, file);
const { version } = JSON.parse(readFileSync(join(base, 'package.json'), 'utf8'));
console.log(`Building ${name} v${version}...`);

const copyright = readFileSync(srcfile('copyright.css'), 'utf8')
    .replace(/{year}/g, new Date().getFullYear())
    .replace(/{version}/g, `v${version}`);
const [error, content] = await tryToCatch(minify, srcfile(`${name}.css`));
if (error) throw Error(error.message);

copyFileSync(srcfile(`${name}.css`), distfile(`${name}.css`));
writeFileSync(distfile(`${name}.min.css`), copyright + content);

export default null;
