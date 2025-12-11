import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import strip from 'strip-comments';

function getAllTsFiles(dir, fileList = []) {
  const files = readdirSync(dir);
  
  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllTsFiles(filePath, fileList);
    } else if (file.match(/\.(ts|tsx)$/) && !file.includes('.d.ts')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

const srcDir = './src';
const tsFiles = getAllTsFiles(srcDir);

console.log(`Found ${tsFiles.length} TypeScript files`);

tsFiles.forEach(file => {
  try {
    const content = readFileSync(file, 'utf8');
    const stripped = strip(content);
    writeFileSync(file, stripped, 'utf8');
    console.log(`✓ Cleaned: ${file}`);
  } catch (error) {
    console.error(`✗ Error processing ${file}:`, error.message);
  }
});

console.log('\nAll comments removed!');
