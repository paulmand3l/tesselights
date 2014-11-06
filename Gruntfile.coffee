module.exports = (grunt) ->

  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    coffee:
      compile:
        files:
          'dist/app.js': 'app.coffee'
          'dist/scenes.js': 'scenes.coffee'
    watch:
      scripts:
        files: ['app.coffee', 'scenes.coffee']
        tasks: ['compile']
        options:
          spawn: false
    copy:
      main:
        files: [
          src: 'node_modules/async/**'
          dest: 'dist/'
        ]

  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.registerTask 'compile', ['coffee', 'copy']
    # Do stuff

  grunt.registerTask 'default', ['watch']
