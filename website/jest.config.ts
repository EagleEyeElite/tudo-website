import nextJest from "next/jest.js";

const createJestConfig = nextJest({
    dir: './',
})

/** @type {import('jest').Config} */
const config: import('jest').Config = {
    testEnvironment: 'jest-environment-jsdom',
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
        "^.+\\.graphql$": "jest-transform-graphql",
        "^.+\\.gql$": "jest-transform-graphql",
    },
}



export default createJestConfig(config)
