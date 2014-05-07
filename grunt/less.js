module.exports = {
  compile: {
    options: {
      paths: ['client/stylesheets'],
      cleancss: true
    },
    files: {
      'dist/stylesheets/style.css': 'client/stylesheets/style.less'
    }
  }
};
