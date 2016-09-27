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
        commitFiles: ['-a'],
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


    conventionalChangelog: {
      release: {
        options: {
          preset: 'jshint',
          changelogOpts: {
            // conventional-changelog options go here
            preset: 'angular'
          },
          context: {
            // context goes here
          },
          gitRawCommitsOpts: {
            // git-raw-commits options go here
          },
          parserOpts: {
            // conventional-commits-parser options go here
          },
          writerOpts: {
            // conventional-changelog-writer options go here
          }
        },
        src: 'CHANGELOG.md'
      }
    },


    'npm-publish': {
      options: {
        requires: ['build'],
        abortIfDirty: true
      }
    }



  });

  grunt.loadNpmTasks('grunt-npm');
  grunt.loadNpmTasks('grunt-todo');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-conventional-changelog');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jsonlint');

  // Default task.
  grunt.registerTask('default', ['jshint', 'jsonlint']);
  grunt.registerTask('prepare', ['todo', 'conventionalChangelog']);

  grunt.registerTask('build', ['default', 'prepare', 'bump','npm-publish']);

};