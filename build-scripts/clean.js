const { emptyDir } = require('fs-extra');

module.exports = function cleanDir(dir) {
    return emptyDir(dir).catch((e) => console.error(e));
};
