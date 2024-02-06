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
}
