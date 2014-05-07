module.exports = {
  options: {
    separator: ';\n',
    banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
  },
  dist: {
    src: [
      'client/lib/**/*.js',
      'dist/javascripts/app.js'
    ],
    dest: 'dist/javascripts/orbino.js'
  }
};
