import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettier from 'eslint-config-prettier'

export default tseslint.config(
    // Ignore build outputs and vendor
    {
        ignores: [
            'public/**',
            'bootstrap/ssr/**',
            'vendor/**',
            'node_modules/**',
            '*.config.js',
            '*.config.ts',
        ],
    },

    // Base JS rules
    js.configs.recommended,

    // TypeScript rules
    ...tseslint.configs.recommended,

    // Disable ESLint rules that conflict with Prettier formatting
    prettier,

    // React rules
    {
        files: ['resources/js/**/*.{ts,tsx}'],
        plugins: {
            'react-hooks':    reactHooks,
            'react-refresh':  reactRefresh,
        },
        rules: {
            // React Hooks
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components':  ['warn', { allowConstantExport: true }],
            // Deriving state from a prop change inside useEffect is intentional here
            'react-hooks/set-state-in-effect':       'warn',

            // TypeScript — relax rules that conflict with the codebase patterns
            '@typescript-eslint/no-explicit-any':             'warn',
            '@typescript-eslint/no-unused-vars':              ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
            '@typescript-eslint/no-non-null-assertion':       'off',
            '@typescript-eslint/ban-ts-comment':              'off',

            // General
            'no-console':   'warn',
            'prefer-const': 'error',
        },
    },
)
