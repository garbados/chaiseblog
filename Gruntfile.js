var config = require('./config.json');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['src/js/app.js'],
      options: {
        browser: true
      , laxcomma: true
      }
    },
    concat: {
      options: {
        // define a string to put between each file in the concatenated output
        separator: ';'
      },
      dist: {
        // the files to concatenate
        src: [
          'src/js/angular.min.js'
        , 'src/js/showdown.js'
        , 'src/js/app.js'
        ],
        // the location of the resulting JS file
        dest: '_attachments/js/app.js'
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      build: {
        files: {
          '_attachments/js/app.min.js': ['_attachments/js/app.js']
        }
      }
    },
    jade: {
      html: {
        files: {
          '_attachments/': ['src/*.jade']
        },
        options: {
          locals: config.jade
        , client: false
        }
      }
    },
    cssmin: {
      minify: {
        files: {
          '_attachments/css/style.css': ['src/css/bootswatch.css', 'src/css/custom.css']  
        }
      }
    },
    couchapp: {
      blog: config.couchapp
    }
  });

  // Load plugins
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jade');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-couchapp');

  // Default task(s).
  grunt.registerTask('default', [
    'jshint'
  , 'concat'
  , 'uglify'
  , 'jade'
  , 'cssmin'
  , 'couchapp'
  ]);

};