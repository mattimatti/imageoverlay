'use strict';

module.exports = function(grunt) {
  // Show elapsed time at the end
  require('time-grunt')(grunt);
  // Load all grunt tasks
  //require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    bump: {
      options: {
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        pushTo: 'origin'
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: ['src/**/*.js']
      }
    },

    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib', 'nodeunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'nodeunit']
      },
      cli: {
        files: '<%= jshint.cli.src %>',
        tasks: ['jshint:test', 'nodeunit']
      }
    },
    todo: {
      options: {
        githubBoxes: true,
        file: "TODO.md",
      },
      src: [
        'test/*',
        'lib/*',
        'bin/*',
        'crawler'
      ],
    },

    jsonlint: {
      sample: {
        src: ['config/*.json'],
        options: {
          formatter: 'prose'
        }
      }
    },


    nwjs: {
    options: {
        platforms: ['win64'],
        buildDir: './webkitbuilds', // Where the build version of my NW.js app is saved
    },
    src: ['./package.json','./src/**/*','./config/**/*.json']
  },



    changelog: {
      test: {
        options: {
          version: require('./package.json').version
        }
      }
    }


  });


  grunt.loadNpmTasks('grunt-todo');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-conventional-changelog');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jsonlint');
  grunt.loadNpmTasks('grunt-nw-builder');

  // Default task.
  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('prepare', ['jshint', 'todo', ]);
  //grunt.registerTask('release', ['bump-only:minor', 'commit']);
  //grunt.registerTask('patch', ['bump-only:patch', 'commit']);


  grunt.registerTask('build', ['default', 'prepare', 'bump']);

};