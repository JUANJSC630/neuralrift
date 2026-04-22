/** @type {import('prettier').Config} */
export default {
    // Indentación con 4 espacios — consistente con el código existente
    tabWidth:          4,
    useTabs:           false,
    printWidth:        100,
    singleQuote:       true,
    jsxSingleQuote:    false,
    semi:              false,
    trailingComma:     'all',
    bracketSpacing:    true,
    bracketSameLine:   false,
    arrowParens:       'avoid',
    endOfLine:         'lf',

    // Tailwind: ordena y normaliza clases en una sola línea
    plugins:           ['prettier-plugin-tailwindcss'],
    tailwindConfig:    './tailwind.config.js',

    // Por tipo de archivo
    overrides: [
        {
            files: ['*.json'],
            options: { tabWidth: 2 },
        },
        {
            files: ['*.blade.php'],
            options: { parser: 'html', tabWidth: 4 },
        },
    ],
}
