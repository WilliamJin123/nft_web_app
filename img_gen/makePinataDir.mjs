import fs from 'fs';
import path from 'path';

const counts = {
    normal: 100,
    baby: 15,
    legendary: 75,
    mythical: 30,
};

const sourceDir = './data';
const destDir = './pinata';

async function copyFiles() {
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }
    const types = ['normal', 'baby', 'legendary', 'mythical'];

    for (const type of types) {
        const typeDir = path.join(sourceDir, type);
        const files = fs.readdirSync(typeDir);
        const sortedFiles = files.sort((a, b) => {
            const indexA = parseInt(a.split('-')[0], 10);
            const indexB = parseInt(b.split('-')[0], 10);
            return indexA - indexB;
        });

        var copiedCount = 0;
        for (const file of sortedFiles) {
            if (copiedCount >= counts[type] * 2) {
                break;
            }
            const srcPath = path.join(typeDir, file);
            const destPath = path.join(destDir, `${type}-${file}`);
            try {
                fs.copyFileSync(srcPath, destPath);
                console.log(`Copied: ${file} to ${destPath}`);
                copiedCount++;
            } catch (err) {
                console.error(`Error copying ${file}:`, err);
            } 
        }
        console.log(`Copied ${copiedCount} ${type} files.`);
    }

    console.log('Finished copying files.');
}

copyFiles()