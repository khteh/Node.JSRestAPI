import swc from "unplugin-swc"; // https://github.com/inversify/monorepo/issues/1378
import { defineConfig } from 'vitest/config'

export default defineConfig({
    plugins: [
        // Vite plugin
        swc.vite(),
    ],
    test: {
        coverage: {
            provider: 'v8',
            include: ['src/**/*.ts'],
            exclude: ['**/build/**', '**/node_modules/**', '**/*.d.ts'],
            reporter: ['lcov', 'text', 'text-summary', 'html'],
            reportsDirectory: './coverage',
            // Still write the reports when some tests fail (e.g. integration tests without a database).
            reportOnFailure: true,
        },
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
                    include: ['*.{js,tsx,ts}'],
                    clearMocks: true // Automatically calls vi.clearAllMocks() before each test
                },
            },
            {
                test: {
                    name: 'UseCaseTests',
                    root: './tests/UseCasesTests',
                    environment: 'node',
                    //setupFiles: ['./setup.node.ts'],
                    globals: true,
                    include: ['*.{js,tsx,ts}'],
                    clearMocks: true // Automatically calls vi.clearAllMocks() before each test
                },
            },
            {
                test: {
                    name: 'IntegrationTests',
                    root: './tests/IntegrationTests',
                    // Each test file starts the server on the same port, so run the files one at a time.
                    fileParallelism: false,
                    environment: 'node',
                    //setupFiles: ['./IntegrationTestSetup.ts'],
                    globals: true,
                    include: ['*.{js,tsx,ts}'],
                    //exclude: ['./IntegrationTestSetup.ts'],
                    clearMocks: true // Automatically calls vi.clearAllMocks() before each test
                },
            },
        ],
    },
})