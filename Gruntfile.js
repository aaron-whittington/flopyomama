
var buildScript =  	require('./Build.js');
  	
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
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('watch-all', ['watch']);

  grunt.registerTask('jshint-all', ['jshint']);
 
  grunt.registerTask('build', 'Build all with the dev script.', function() {
  
  	var done = this.async();
    buildScript.nsBuild.fMain('all', done);
   // grunt.log.write('Logging some stuff...').ok();
  });

};
