import { readdirSync, unlinkSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const mediaDir = resolve(__dirname, '../src/lib/media');
const entries = readdirSync(mediaDir, { withFileTypes: true });

for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  const dir = resolve(mediaDir, entry.name);
  const files = readdirSync(dir);
  const svgFile = files.find(f => f.startsWith('thumb_') && f.endsWith('.svg'));
  if (svgFile) {
    const svgPath = resolve(dir, svgFile);
    const jpgPath = svgPath.replace('.svg', '.jpg');
    try {
      await sharp(svgPath).resize(400, 300).jpeg({ quality: 80 }).toFile(jpgPath);
      unlinkSync(svgPath);
      console.log(`  ${entry.name}/thumb_${entry.name}.jpg`);
    } catch (e) {
      console.error(`  FAILED ${entry.name}: ${e.message}`);
    }
  }
}
console.log('Done');
