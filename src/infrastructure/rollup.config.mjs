import fs from 'node:fs';
import path from 'node:path';
import json from '@rollup/plugin-json';
import swc from 'unplugin-swc';
import tsConfig from './tsconfig.json' with { type: "json" };

// TypeScript 7's native compiler has no JavaScript API, so @rollup/plugin-typescript
// can't use it. SWC transpiles the TypeScript here (reading decorator settings from
// tsconfig.json); type checking is done by the `tsc` step that runs before rollup.

// NodeNext-style imports reference "./Foo.js" while the source file is "./Foo.ts".
const resolveTsFromJs = () => ({
    name: 'resolve-ts-from-js',
    resolveId(source, importer) {
        if (!importer || !source.startsWith('.') || !source.endsWith('.js')) return null;
        const candidate = path.resolve(path.dirname(importer), source.slice(0, -3) + '.ts');
        return fs.existsSync(candidate) ? candidate : null;
    }
});

const config = [
    {
        input: "index.ts",
        // SWC's decorator metadata emits `typeof ILogger === "undefined" ? Object : ILogger`
        // for interface-typed parameters. Interfaces have no runtime export, so let rollup
        // shim them as undefined (tsc has already type-checked the real imports).
        shimMissingExports: true,
        onwarn(warning, warn) {
            if (warning.code === 'SHIMMED_EXPORT') return;
            warn(warning);
        },
        output: [{ file: "build/index.js", sourcemap: true }],
        plugins: [
            resolveTsFromJs(),
            swc.rollup({
                sourceMaps: tsConfig.compilerOptions.sourceMap ?? true
            }),
            json()
        ]
    },
]

export default config;
