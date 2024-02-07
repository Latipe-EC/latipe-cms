module.exports = {
	root: true,
	env: {
		es6: true, // enable ES2015 features.
		browser: true, // enable use of global browser variables like `windows`.
		node: true, // enable use of global node variables like `process`.
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react-hooks/recommended',
	],
	ignorePatterns: ['dist', '.eslintrc.cjs'],
	parser: '@typescript-eslint/parser',
	plugins: ['react-refresh'],
	rules: {
		'react-refresh/only-export-components': [
			'warn',
			{ allowConstantExport: true },
		],
	},
	settings: {
		react: {
			version: 'detect', // auto-detect React version from package.json.
		},
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts', '.tsx'], // use typescript-eslint parser for .ts|tsx files.
		},
		'import/resolver': {
			typescript: {
				alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`.
			},
		},
	},
}
