// scripts/check-build-assets.js
// Fails if any .js file in build/assets/ starts with "<" (likely HTML, not JS)
import fs from 'fs';
import path from 'path';

const assetsDir = path.join(process.cwd(), 'build', 'assets');
let failed = false;

if (!fs.existsSync(assetsDir)) {
  console.error('Assets directory does not exist:', assetsDir);
  process.exit(1);
}

for (const file of fs.readdirSync(assetsDir)) {
  if (file.endsWith('.js')) {
    const filePath = path.join(assetsDir, file);
    const firstBytes = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' }).slice(0, 10);
    if (firstBytes.trim().startsWith('<')) {
      console.error(`ERROR: ${file} in build/assets/ is not valid JavaScript (starts with '<')`);
      failed = true;
    }
  }
}

if (failed) {
  process.exit(1);
} else {
  console.log('All build/assets/*.js files are valid JavaScript.');
}
