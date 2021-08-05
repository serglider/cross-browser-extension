const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');
const distDir = path.resolve(process.cwd(), 'dist');
const manifestPath = path.resolve(distDir, 'manifest.json');
const { version, name } = require(manifestPath);
const zipPath = path.resolve(process.cwd(), 'submissions', `${name}-${version}.zip`);
const streamConfig = { type: 'nodebuffer', streamFiles: true };

process.chdir(distDir);
const zip = new JSZip();
addFiles('./');
zip.generateNodeStream(streamConfig)
    .pipe(fs.createWriteStream(zipPath))
    .on('finish', () => {
        console.log(`"${zipPath} file generated"`);
    });

function addFiles(dir, zip) {
    const files = fs.readdirSync(dir, {
        withFileTypes: true,
    });

    files.forEach(({ name }) => {
        const filePath = `${dir}/${name}`.replace('//', '/');
        if (fs.statSync(filePath).isFile()) {
            addFile(filePath);
        } else if (fs.statSync(filePath).isDirectory()) {
            addFiles(filePath, zip);
        }
    });
}

function addFile(filePath) {
    zip.file(filePath, fs.readFileSync(filePath, 'utf-8'));
}
