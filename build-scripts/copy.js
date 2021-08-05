const { copy } = require('fs-extra');

module.exports = async function copyFiles(list, sourceDir, destDir) {
    const files = list.map((file) => ({
        to: `${destDir}/${file}`,
        from: `${sourceDir}/${file}`,
    }));
    const tasks = files.map(({ from, to }) => copy(from, to));
    return Promise.all(tasks);
};
