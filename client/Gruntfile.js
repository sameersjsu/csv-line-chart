module.exports = function (grunt) {
  // Initializing grunt configuration
  grunt.initConfig({
    'pkg': grunt.file.read('package.json'),
    'connect': {
      static:{
        port: 8000
      }
    }
  });

  // Loading grunt tasks
  grunt.loadNpmTasks('grunt-connect');
  // Registring grunt tasks
  grunt.registerTask('default', 'connect:static');
};