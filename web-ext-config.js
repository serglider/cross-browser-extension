module.exports = {
    sourceDir: 'dist',
    artifactsDir: 'artifacts',
    build: {
        overwriteDest: true,
    },
    run: {
        browserConsole: true,
        startUrl: ['about:addons'],
    },
};
