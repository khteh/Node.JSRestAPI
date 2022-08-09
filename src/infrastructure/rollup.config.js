import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

import tsConfig from './tsconfig.json';

const config = [
    {
        input: "index.ts",
        output: [{ file: "build/index.js", sourcemap: true }],
        plugins: [
            typescript(
                {
                    sourceMap: tsConfig.compilerOptions.sourceMap
                }
            )
        ]
    },
    {
        input: 'build/index.d.ts',
        output: [{ file: "build/index.d.ts", "format": "es" }],
        plugins: [
            dts(
                {
                    compilerOptions: {
                        baseUrl: tsConfig.compilerOptions.baseUrl
                    }
                }
            )
        ]
    },
]

export default config;