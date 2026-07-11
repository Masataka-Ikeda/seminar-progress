// scripts/build.js
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dataPath = path.join(root, 'data', 'progress.json');
const templatePath = path.join(root, 'src', 'template.html');
const outDir = path.join(root, 'public');
const outPath = path.join(outDir, 'index.html');

function ensureDir(dir){
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function build(){
  if (!fs.existsSync(dataPath)) {
    console.error('data/progress.json が見つかりません:', dataPath);
    process.exit(1);
  }
  const rawJson = fs.readFileSync(dataPath, 'utf8');
  let parsed;
  try {
    parsed = JSON.parse(rawJson);
  } catch(e){
    console.error('progress.json のパースエラー:', e.message);
    process.exit(1);
  }

  const template = fs.readFileSync(templatePath, 'utf8');

  // JSON を pretty にして埋め込む（XSS に注意：自己ホスト用なので許容）
  const injected = JSON.stringify(parsed, null, 2);

  const outHtml = template.replace('__INJECT_DATA__', injected);

  ensureDir(outDir);
  fs.writeFileSync(outPath, outHtml, 'utf8');
  console.log('ビルド完了:', outPath);
}

build();

