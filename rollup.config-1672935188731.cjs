'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var svelte = require('rollup-plugin-svelte');
var commonjs = require('@rollup/plugin-commonjs');
var resolve = require('@rollup/plugin-node-resolve');
var livereload = require('rollup-plugin-livereload');
var sveltePreprocess = require('svelte-preprocess');
var typescript = require('@rollup/plugin-typescript');
var css = require('rollup-plugin-css-only');

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

var rollup_config = {
	input: 'src/index.ts',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		svelte({
			preprocess: sveltePreprocess({ sourceMap: !production }),
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			}
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
		typescript({
			sourceMap: !production,
			inlineSources: !production
		}),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// Disabled minification for now.

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		//production && terser()
	],
	watch: {
		clearScreen: false
	}
};

exports.default = rollup_config;
