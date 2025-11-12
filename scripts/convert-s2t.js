const fs = require('fs');
const path = require('path');
let OpenCC;
try {
  OpenCC = require('opencc-js');
} catch (e) {
  console.error('請先安裝依賴：npm install opencc-js --save');
  process.exit(1);
}

const root = path.resolve(__dirname, '..');
const ignoreDirs = new Set(['node_modules', '.git', 'out', 'dist', 'build', 'assets', 'BIN']);
const textFileExt = new Set(['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.html', '.css', '.txt']);

function shouldProcess(filePath) {
  const rel = path.relative(root, filePath);
  if (!rel || rel.startsWith('..')) return false;
  const parts = rel.split(path.sep);
  for (const p of parts) if (ignoreDirs.has(p)) return false;
  return textFileExt.has(path.extname(filePath).toLowerCase());
}

function walk(dir, cb) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (ignoreDirs.has(e.name)) continue;
      walk(full, cb);
    } else if (e.isFile()) {
      cb(full);
    }
  }
}

async function main() {
  const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });
  let count = 0;
  walk(root, (file) => {
    if (!shouldProcess(file)) return;
    try {
      const original = fs.readFileSync(file, 'utf8');
      const converted = converter(original);
      if (converted !== original) {
        fs.writeFileSync(file, converted, 'utf8');
        console.log('Converted:', path.relative(root, file));
        count++;
      }
    } catch (err) {
      console.error('Error processing', file, err.message);
    }
  });
  console.log(`Done. Files converted: ${count}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
