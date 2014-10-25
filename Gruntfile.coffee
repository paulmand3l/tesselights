module.exports = (grunt) ->

  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    coffee:
      compile:
        files:
          'app.js': 'app.coffee'
    watch:
      scripts:
        files: ['app.coffee']
        tasks: ['compile']
        options:
          spawn: false

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.registerTask 'compile', ['coffee']
    # Do stuff

  grunt.registerTask 'default', ['watch']
