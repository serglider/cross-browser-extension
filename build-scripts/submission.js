const fse = require('fs-extra');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const distDir = path.resolve(process.cwd(), 'dist');
const manifestPath = path.resolve(distDir, 'manifest.json');
const { version, name } = require(manifestPath);
const namePrefix = name.replace(/ /g, '_');
const zipPath = path.resolve(process.cwd(), 'submissions', `${namePrefix}_${version}.zip`);
const zipFormat = 'zip';
const zipOptions = {
    zlib: { level: 9 },
};

fse.ensureFile(zipPath).then(archive).then(onComplete).catch(onZipError);

function archive() {
    const itemsToZip = fs.readdirSync(distDir, {
        withFileTypes: true,
    });
    const output = fs.createWriteStream(zipPath);
    const archive = archiver(zipFormat, zipOptions);
    output.on('close', onClose);
    archive.on('error', onError);
    archive.pipe(output);

    itemsToZip.forEach(({ name }) => {
        const filePath = `${distDir}/${name}`.replace('//', '/');
        if (fs.statSync(filePath).isFile()) {
            archive.file(filePath, { name });
        } else if (fs.statSync(filePath).isDirectory()) {
            archive.directory(filePath, name);
        }
    });

    return archive.finalize();

    function onClose() {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
    }

    function onError(e) {
        throw e;
    }
}

function onComplete() {
    console.log('DONE');
}

function onZipError(e) {
    console.error(e);
}
