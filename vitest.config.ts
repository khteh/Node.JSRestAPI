import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        projects: [
            // you can use a list of glob patterns to define your projects
            // Vitest expects a list of config files
            // or directories where there is a config file
            //'packages/*',
            //'tests/*/vitest.config.{e2e,unit}.ts',
            // you can even run the same tests,
            // but with different configs in the same "vitest" process
            {
                test: {
                    name: 'UnitTests',
                    root: './tests/UnitTests',
                    environment: 'node',
                    //setupFiles: ['./setup.happy-dom.ts'],
                    globals: true,
                    include: ['*.{js,tsx,ts}']
                },
            },
            {
                test: {
                    name: 'UseCaseTests',
                    root: './tests/UseCaseTests',
                    environment: 'node',
                    //setupFiles: ['./setup.node.ts'],
                    globals: true,
                    include: ['*.{js,tsx,ts}']
                },
            },
            {
                test: {
                    name: 'IntegrationTests',
                    root: './tests/IntegrationTests',
                    environment: 'node',
                    //setupFiles: ['./setup.node.ts'],
                    globals: true,
                    include: ['*.{js,tsx,ts}']
                },
            },
        ],
    },
})