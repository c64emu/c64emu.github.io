const esbuild = require('esbuild');

esbuild.buildSync({
    platform: 'browser',
    globalName: 'c64emuGitHubIo',
    minify: true, // TODO
    target: 'es2020',
    entryPoints: ['src/index.ts'],
    bundle: true,
    outfile: 'dist/c64emu.github.io.min.js',
});
