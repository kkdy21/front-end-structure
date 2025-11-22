import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";

export default [
    {
        ignores: ["dist", "node_modules"],
    },
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module",
            globals: { ...globals.browser, ...globals.node },
            parser: tseslint.parser,
            parserOptions: {
                project: "./tsconfig.json",
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        extends: [importPlugin.flatConfigs.recommended],
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": [
                "warn",
                { allowConstantExport: true },
            ],
            "max-len": ["error", { code: 200 }],
            "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
            "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
            "no-unsafe-optional-chaining": 1,
            "no-undef": 1,
            "no-unused-vars": ["off"],
            "no-mixed-operators": 0,
            "no-promise-executor-return": 1,
            "no-multiple-empty-lines": 0,
            "prefer-regex-literals": ["off"],
            "prefer-const": 1,
            indent: ["error", 4],
            "prefer-destructuring": ["error", { object: false, array: false }],
            radix: ["error", "as-needed"],
            "no-prototype-builtins": "error",
            "no-empty": ["error", { allowEmptyCatch: true }],
            camelcase: "off",
            "no-this-before-super": ["off"],
            "no-useless-constructor": ["off"],
            "no-empty-function": [
                "error",
                { allow: ["constructors", "arrowFunctions"] },
            ],
            "no-param-reassign": ["error", { props: false }],
            "no-underscore-dangle": ["off"],
            "no-new": ["off"],
            "prefer-template": ["error"],
            "no-plusplus": ["off"],
            "no-tabs": ["off"],
            "no-shadow": ["off"],
            "no-use-before-define": ["off"],
            "@typescript-eslint/explicit-member-accessibility": [
                "error",
                {
                    accessibility: "no-public",
                    overrides: {
                        accessors: "no-public",
                        methods: "no-public",
                        properties: "no-public",
                        parameterProperties: "explicit",
                    },
                },
            ],
            "@typescript-eslint/no-object-literal-type-assertion": ["off"],
            "@typescript-eslint/camelcase": ["off"],
            "@typescript-eslint/naming-convention": [
                "off",
                {
                    selector: "variable",
                    format: ["camelCase", "UPPER_CASE", "PascalCase"],
                    filter: {
                        regex: "(total_count)",
                        match: false,
                    },
                    leadingUnderscore: "allow",
                },
                {
                    selector: "memberLike",
                    format: ["camelCase", "snake_case", "PascalCase", "UPPER_CASE"],
                    leadingUnderscore: "allow",
                },
                {
                    selector: "parameter",
                    format: ["camelCase"],
                    leadingUnderscore: "allow",
                },
                {
                    selector: "typeLike",
                    format: ["PascalCase", "UPPER_CASE"],
                },
            ],
            "@typescript-eslint/no-empty-function": ["off"],
            "@typescript-eslint/no-use-before-define": ["off"],
            "@typescript-eslint/ban-ts-ignore": ["off"],
            "@typescript-eslint/explicit-function-return-type": ["off"],
            "@typescript-eslint/explicit-module-boundary-types": ["off"],
            "@typescript-eslint/no-explicit-any": ["off"],
            "@typescript-eslint/no-unused-vars": ["error"],
            "@typescript-eslint/no-shadow": ["error"],
            "@typescript-eslint/consistent-type-imports": ["error"],
        },
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
];
