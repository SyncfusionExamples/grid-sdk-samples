'use strict';

const { execFileSync } = require('node:child_process');
const { mkdirSync } = require('node:fs');
const { join } = require('node:path');
const { RELEASES } = require('../lib/benchmark.cjs');

const root = join(__dirname, '..');
const artifacts = join(root, '.artifacts');
const requestedRelease = process.argv.find((arg) => arg.startsWith('--release='))?.split('=')[1];
const packages = require('../release-versions.json');

mkdirSync(artifacts, { recursive: true });
for (const release of Object.keys(RELEASES)) {
    if (requestedRelease && requestedRelease !== release) continue;
    const target = join(artifacts, release);
    mkdirSync(target, { recursive: true });
    execFileSync('npm', ['install', '--prefix', target, '--package-lock=false', '--no-save', '--ignore-scripts',
        '--registry=https://registry.npmjs.org', '--@syncfusion:registry=https://registry.npmjs.org',
        ...Object.entries(packages[release]).map(([name, version]) => `@syncfusion/${name}@${version}`)], { stdio: 'inherit', shell: process.platform === 'win32' });
}
