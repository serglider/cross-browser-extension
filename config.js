const { webExt } = require('./package.json');

module.exports = {
    DIRS_TO_COPY: ['assets', 'views', 'styles'],
    SCRIPTS_DIR: 'scripts',
    DEST_DIR: webExt.sourceDir,
    SOURCE_DIR: 'src',
    RELOAD_DELAY: 500,
};
