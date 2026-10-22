import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
    dir: './',
})

/**
 * Integration tests against the running local stack (docker compose + `npm run dev`), see jest.setup.ts
 * @type {import('jest').Config}
 */
const config: import('jest').Config = {
    testEnvironment: 'node',
    setupFiles: ['<rootDir>/jest.setup.ts'],
}

export default createJestConfig(config)
