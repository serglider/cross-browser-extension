const { writeFile, readFile } = require('fs/promises');
const path = require('path');

module.exports = function adjustManifest(sourceDir, destDir, isDevMode, reload) {
    if (!isDevMode) {
        return Promise.resolve();
    }
    const manifestSourcePath = path.resolve(process.cwd(), sourceDir, 'manifest.json');
    const manifestDestPath = path.resolve(process.cwd(), destDir, 'manifest.json');
    return readFile(manifestSourcePath, 'utf8').then((content) => {
        const manifest = JSON.parse(content);
        manifest.version = handleVersion(manifest.version);
        if (reload) {
            manifest.background.scripts.push('dev-reload.js');
        }
        const serialized = JSON.stringify(manifest, null, 4);
        return writeFile(manifestDestPath, serialized, 'utf8');
    });
};

function handleVersion(current) {
    handleVersion.runs = handleVersion.runs || 0;
    const digits = current.split('.');
    if (digits.length === 4) {
        digits[3] = handleVersion.runs;
    } else {
        digits.push(handleVersion.runs);
    }
    handleVersion.runs++;
    return digits.join('.');
}
