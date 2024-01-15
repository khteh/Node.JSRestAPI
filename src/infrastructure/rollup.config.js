import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
import tsConfig from './tsconfig.json' assert { type: "json" };

const config = [
    {
        input: "index.ts",
        output: [{ file: "build/index.js", sourcemap: true }],
        plugins: [
            typescript(
                {
                    sourceMap: tsConfig.compilerOptions.sourceMap
                }
            ),
            json()
        ]
    },
]

export default config;