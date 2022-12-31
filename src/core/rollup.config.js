import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
import ts from "rollup-plugin-ts";
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
    {
        input: "index.ts",
        output: [{ file: "build/index.d.ts", "format": "es" }],
        plugins: [
            ts(
                {
                    compilerOptions: {
                        baseUrl: tsConfig.compilerOptions.baseUrl
                    }
                }
            ),
            json()
        ]
    },
]

export default config;