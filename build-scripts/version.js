const path = require('path');
const fs = require('fs-extra');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const inquirer = require('inquirer');
const semver = require('semver');
const pkg = require('../package.json');
const manifest = require('../src/manifest.json');

const pkgVersion = pkg.version;
const manifestVersion = manifest.version;
console.log(`Current package version: ${pkgVersion}`);
console.log(`Current manifest version: ${manifestVersion}`);
if (!validateManifestVersion(manifestVersion)) {
    console.error(
        `Current manifest version is invalid.\nPlease see: https://developer.chrome.com/docs/extensions/mv3/manifest/version/`
    );
    process.exit(1);
}
const isPkgVersionValid = semver.valid(pkgVersion) !== null;
if (!isPkgVersionValid) {
    console.error(`Current package version is invalid.\nPlease see: https://semver.org/`);
    process.exit(1);
}

const questions = [
    {
        type: 'list',
        name: 'updateMode',
        message: 'Select version update type',
        default: 'patch',
        choices: ['patch', 'minor', 'major', 'prepatch', 'preminor', 'premajor'],
        filter(val) {
            return val.toLowerCase();
        },
    },
    {
        type: 'input',
        name: 'prereleaseTag',
        message: 'Pre-release tag',
        default() {
            const prereleaseList = semver.prerelease(pkgVersion);
            return (prereleaseList && prereleaseList[0]) || 'beta';
        },
        when(answers) {
            return answers.updateMode.startsWith('pre');
        },
        filter(val) {
            return val.toLowerCase();
        },
    },
    {
        type: 'input',
        name: 'customManifestVersion',
        message: 'Pre-release Manifest Version',
        default(answers) {
            return bumpManifestVersion(manifestVersion, answers.updateMode);
        },
        when(answers) {
            return answers.updateMode.startsWith('pre');
        },
        validate(value) {
            const valid = validateManifestVersion(value);
            return (
                valid ||
                'Please enter valid manifest version\nPlease see: https://developer.chrome.com/docs/extensions/mv3/manifest/version/'
            );
        },
    },
    {
        type: 'confirm',
        name: 'handleGit',
        message: 'Commit and push?',
        default: true,
    },
];

inquirer.prompt(questions).then((answers) => {
    const packageVersion = semver.inc(pkgVersion, answers.updateMode, answers.prereleaseTag);
    const manifestVersion = answers.customManifestVersion
        ? answers.customManifestVersion
        : packageVersion;
    Promise.all([writePkg(packageVersion), writeManifest(manifestVersion, packageVersion)])
        .then(() => {
            console.log('Versions updated in package.json and src/manifest');
            if (answers.handleGit) {
                return handleGit(packageVersion);
            }
        })
        .then(() => console.log('DONE'))
        .catch((e) => console.error(e));
});

function handleGit(v) {
    const commitCommand = `git commit -am "${v}"`;
    const getBranchCommand = `git branch --show-current`;
    return exec(commitCommand)
        .then(() => exec(getBranchCommand))
        .then(({ stdout }) => {
            return stdout.toString().replace('\n', '');
        })
        .then((branch) => {
            const pushCommand = `git push --set-upstream origin ${branch}`;
            return exec(pushCommand);
        });
}

function writePkg(v) {
    pkg.version = v;
    const p = path.join(process.cwd(), 'package.json');
    return writeJson(p, pkg);
}

function writeManifest(manifestVersion, pkgVersion) {
    manifest.version = manifestVersion;
    manifest.version_name = pkgVersion;
    const p = path.join(process.cwd(), 'src', 'manifest.json');
    return writeJson(p, manifest);
}

function writeJson(filePath, obj) {
    return fs.writeJson(filePath, obj, { spaces: 4 });
}

function validateManifestVersion(v) {
    const re = /^\d{1,5}(\.\d{1,5}){0,3}$/;
    const m = re.test(v);
    if (!m) {
        return false;
    }
    return v.split('.').every(isValidSection);

    function isValidSection(s) {
        const startsWithZero = s.length > 1 && s.startsWith('0');
        const lessThanMax = Number(s) < 65535;
        return lessThanMax && !startsWithZero;
    }
}

function bumpManifestVersion(currentVersion, mode) {
    const [mj, mn = 0, ptch = 0, pre = 0] = currentVersion.split('.').map(Number);
    let v;
    switch (mode) {
        case 'major':
            v = `${mj + 1}.0.0`;
            break;
        case 'minor':
            v = `${mj}.${mn + 1}.0`;
            break;
        case 'patch':
            v = `${mj}.${mn}.${ptch + 1}`;
            break;
        default:
            v = `${mj}.${mn}.${ptch}.${pre + 1}`;
            break;
    }
    return v;
}
