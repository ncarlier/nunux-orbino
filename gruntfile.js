module.exports = function(grunt) {
  // Load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Load grunt configurations
  var conf = require('./grunt')(grunt);
  grunt.initConfig(conf);

  // Register tasks
  grunt.registerTask('build', ['less', 'concat', 'uglify', 'copy']);
  grunt.registerTask('install', ['clean', 'build']);
  grunt.registerTask('hint', 'jshint');
  grunt.registerTask('dep', ['bower']);
  grunt.registerTask('default', 'install');
};
