const path = require('path');
const fs = require('fs');
const esbuild = require('esbuild');

module.exports = function createBuild({ minify, distDir, sourceDir, scriptsDir }) {
    const scriptsSourceDir = path.resolve(process.cwd(), sourceDir, scriptsDir);
    const entryPoints = fs
        .readdirSync(scriptsSourceDir)
        .filter((file) => path.extname(file) === '.js')
        .map((file) => path.resolve(scriptsSourceDir, file));
    const outdir = path.resolve(process.cwd(), distDir, scriptsDir);
    const esbuildConfig = {
        entryPoints,
        outdir,
        bundle: true,
        target: ['es2018'],
        minify,
    };
    return () => esbuild.build(esbuildConfig);
};
