export default {
    moduleFileExtensions: ["js", "ts", "tsx"],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
    testMatch: [
        "**/tests/**/*.spec.ts",
        "**/tests/**/*.test.ts",
    ],
    testEnvironment: "node",
};