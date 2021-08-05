const args = process.argv.slice(2);
const { watch } = require('chokidar');
const cleanDir = require('./clean');
const copyFiles = require('./copy');
const createSSEServer = require('./sse-server');
const adjustManifest = require('./manifest-handler');
const createBuild = require('./build');
const { DIRS_TO_COPY, DEST_DIR, SOURCE_DIR, SCRIPTS_DIR, RELOAD_DELAY } = require('./constants');
const isDevMode = args.includes('watch');
const minify = args.includes('minify');
const reload = args.includes('reload');
const esbuild = createBuild(minify);
const copyItems = [...DIRS_TO_COPY];

if (isDevMode) {
    if (reload) {
        copyItems.push('dev-reload.js');
    }
} else {
    copyItems.push('manifest.json');
}

make()
    .then(() => {
        console.log('done');
        watchFiles();
    })
    .catch((e) => {
        console.log(e);
    });

function make() {
    return cleanDir(DEST_DIR)
        .then(() => copyFiles(copyItems, SOURCE_DIR, DEST_DIR))
        .then(() => adjustManifest(SOURCE_DIR, DEST_DIR, isDevMode, reload))
        .then(() => esbuild());
}

function build() {
    return esbuild().then(() => adjustManifest(SOURCE_DIR, DEST_DIR, isDevMode, reload));
}

function copy() {
    return copyFiles(copyItems, SOURCE_DIR, DEST_DIR).then(() =>
        adjustManifest(SOURCE_DIR, DEST_DIR, isDevMode, reload)
    );
}

function watchFiles() {
    if (!isDevMode) {
        return;
    }

    const watcher = watch([SOURCE_DIR], {
        persistent: true,
    });

    const ee = createSSEServer();

    watcher.on('change', (path) => {
        const task = path.includes(SCRIPTS_DIR) ? build : copy;
        task()
            .then(() => {
                console.log(`${path} changed`);

                setTimeout(() => {
                    ee.emit('reload');
                }, RELOAD_DELAY);
            })
            .catch((e) => {
                console.log(e);
            });
    });
}
