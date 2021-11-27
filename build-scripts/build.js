const path = require('path');
const fs = require('fs');
const esbuild = require('esbuild');
const { SOURCE_DIR, SCRIPTS_DIR } = require('./constants');
const scriptsSourceDir = path.resolve(process.cwd(), SOURCE_DIR, SCRIPTS_DIR);

const entryPoints = fs
    .readdirSync(scriptsSourceDir)
    .filter((file) => path.extname(file) === '.js')
    .map((file) => path.resolve(scriptsSourceDir, file));

module.exports = function createBuild(minify, distDir) {
    const scriptsDestDir = path.resolve(process.cwd(), distDir, SCRIPTS_DIR);
    const esbuildConfig = {
        entryPoints,
        outdir: scriptsDestDir,
        bundle: true,
        target: ['es2018'],
        minify,
    };
    return () => esbuild.build(esbuildConfig);
};
