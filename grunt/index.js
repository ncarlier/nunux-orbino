module.exports = function(grunt) {
  return {
    pkg:       grunt.file.readJSON('package.json'),
    clean:     ['dist'],
    bower:     require('./bower'),
    concat:    require('./concat'),
    copy:      require('./copy'),
    jshint:    require('./jshint'),
    less:      require('./less'),
    uglify:    require('./uglify')
  };
};
