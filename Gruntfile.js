// tom-weatherhead/thaw-reversi-engine/Gruntfile.js

'use strict';

module.exports = require('thaw-config').grunt({
	eslint: true,
	mocha: true
});

/*
module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		eslint: {
			target: [
				'*.js',
				'src/*.js',
				'test/*.js'
			]
		},
		mochaTest: {
			options: {
				reporter: 'spec'
			},
			test: {
				src: ['test/*_spec.js']
			}
		},
		nsp: {
			package: grunt.file.readJSON('package.json')
		},
		watch: {
			js: {
				files: [
					'*.js',
					'src/*.js'
					// , 'test/*.js' ?
				],
				tasks: 'build'
			},
			pkg: {
				files: 'package.json',
				tasks: 'build'
			},
			readme: {
				files: 'README.md',
				tasks: 'build'
			}
		}
	});

	// Tasks
	grunt.loadNpmTasks('grunt-eslint');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-nsp');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Aliases
	grunt.registerTask('test', ['eslint', 'mochaTest', 'nsp']);
	grunt.registerTask('default', ['test']);
};
 */
