'use strict';

module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		simplemocha: {
			test: {
				src: ['test/*.js'],
				options: {
					globals: ['should'],
					timeout: 3000,
					ignoreLeaks: false,
					ui: 'bdd',
					reporter: 'tap'
				}
			},
			doc: {
				src: ['test/*.js'],
				options: {
					globals: ['should'],
					timeout: 3000,
					ignoreLeaks: false,
					ui: 'bdd',
					reporter: 'doc'
				}
			}
		},
		mochaDoc: {
			src: ['doc/header.html', 'doc/content.html', 'doc/footer.html']
		},
		concat: {
			options: {
				separator: '\n'
			},
			doc: {
				src: ['doc/header.html', 'content.html', 'doc/footer.html'],
				dest: 'doc.html'
			}
		},
		jshint: {
			options: {},
			gruntfile: {
				src: 'Gruntfile.js',
				options: {
					jshintrc: 'lib/.jshintrc'
				}
			},
			lib: {
				src: ['lib/*.js', 'lib/**/*.js'],
				options: {
					jshintrc: 'lib/.jshintrc'
				}
			},
			test: {
				src: ['test/*.js', 'test/**/*.js'],
				options: {
					jshintrc: 'test/.jshintrc'
				}
			}
		},
		watch: {
			gruntfile: {
				files: ['lib/*.js', 'lib/**/*.js'],
				tasks: ['jshint:gruntfile']
			},
			lib: {
				files: ['lib/*.js', 'lib/**/*.js'],
				tasks: ['jshint:lib']
			},
			test: {
				files: ['test/*.js', 'test/**/*.js'],
				tasks: ['jshint:test', 'simplemocha']
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-simple-mocha');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');

	// Default task.
	grunt.registerTask('default', ['jshint', 'simplemocha:test']);
	grunt.registerTask('test', 'simplemocha:test');
	grunt.registerTask('mocha-doc', ['simplemocha:doc']);
	grunt.registerTask('doc', ['concat']);

};
