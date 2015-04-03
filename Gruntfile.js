module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
  			files: ['./Dev/JS/*.js', 
  			'./Dev/FlopYoMamaTemplate.html',
  			'./Dev/Style/*.less'],
  			tasks: ['build-dev'] // jshint-all
		},
    jshint: {
        options: {
          curly: false, /*allow conditionals without braces*/
          eqeqeq: true,
          eqnull: true,
          browser: true,
          multistr: true, /*allow EOL escaping*/
          globals: {
            /*jQuery: true,
            $: true,
            nsUtil: true,
            nsHtml: true,
            nsUI: true*/
          },   
          '-W117': true, /*ignore undefined globals*/ 
          '-W097': true /*ignore 'use strict' in file rather than function*/ 
        },
        all : ['./Dev/JS/*.js']
    },
	uglify: {
		RELEASE: {
			options: {
				mangle: true,
				compress: {
					drop_console: true
				}
			},
			files: [{
				expand: true,
				cwd: './Dev/JS',
				src: '*.js',
				dest: './Release/JS'
			}]
		}
	},
	preprocess: {
		options: {
			context: {
				DEBUG: true
			}
		},
		htmlDev: {
			src: './Dev/FlopYoMamaTemplate.html',
			dest: './Dev/FlopYoMama.html'
		},
		htmlRelease: {
			src: './Dev/FlopYoMamaTemplate.html',
			dest: './Release/FlopYoMama.html',
			options: {
				context: {
					DEBUG: false
				}
			}
		}
	},
	less: {
		dev: {
			options: {
				
			},
			files: {
				'./Dev/Style/FlopYoMama.css': './Dev/Style/FlopYoMama.less'
			}
		},
		release: {
			options: {
				compress: true,	
			},
			files: {
				'./Release/Style/FlopYoMama.css': './Dev/Style/FlopYoMama.less'
			}
		}
	}
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-preprocess');

  grunt.registerTask('watch-all', ['watch']);
  grunt.registerTask('jshint-all', ['jshint']);

  grunt.registerTask('build-release',['uglify', 'preprocess', 'less']);   
  grunt.registerTask('build-dev', [ 'preprocess', 'less'] );
};
