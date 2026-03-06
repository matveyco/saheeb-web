import { readdirSync, statSync } from 'fs';
import { join } from 'path';

const IMAGES_DIR = join(process.cwd(), 'public', 'images');
const MAX_IMAGE_SIZE_MB = 6;
const maxBytes = MAX_IMAGE_SIZE_MB * 1024 * 1024;

const oversizedFiles = [];

function collectFilesRecursively(dirPath, prefix = '') {
  const entries = readdirSync(dirPath);

  for (const entry of entries) {
    const absolutePath = join(dirPath, entry);
    const relativePath = prefix ? join(prefix, entry) : entry;
    const stats = statSync(absolutePath);

    if (stats.isDirectory()) {
      collectFilesRecursively(absolutePath, relativePath);
      continue;
    }

    if (stats.size > maxBytes) {
      oversizedFiles.push({
        fileName: relativePath,
        sizeMb: (stats.size / (1024 * 1024)).toFixed(2),
      });
    }
  }
}

collectFilesRecursively(IMAGES_DIR);

if (oversizedFiles.length > 0) {
  console.error(
    `Asset size check failed. Files above ${MAX_IMAGE_SIZE_MB}MB in public/images:`
  );
  for (const file of oversizedFiles) {
    console.error(`- ${file.fileName} (${file.sizeMb}MB)`);
  }
  process.exit(1);
}

console.log(
  `Asset size check passed. No image in public/images exceeds ${MAX_IMAGE_SIZE_MB}MB.`
);
