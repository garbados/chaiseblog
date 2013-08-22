var config = require('./config.json');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['admin/src/js/index.js', 'public/src/js/index.js'],
      options: {
        browser: true
      , laxcomma: true
      , asi: true
      }
    },
    concat: {
      options: {
        // define a string to put between each file in the concatenated output
        separator: ';'
      },
      admin: {
        // the files to concatenate
        src: [
          'admin/src/js/angular.min.js'
        , 'admin/src/js/showdown.js'
        , 'admin/src/js/app.js'
        ],
        // the location of the resulting JS file
        dest: 'admin/_attachments/js/app.js'
      },
      "public": {
        // the files to concatenate
        src: [
          'public/src/js/angular.min.js'
        , 'public/src/js/showdown.js'
        , 'public/src/js/app.js'
        ],
        // the location of the resulting JS file
        dest: 'public/_attachments/js/app.js'
      }
    },
    uglify: {
      options: {
        // mangle: false
      },
      build: {
        files: {
          'admin/_attachments/js/app.min.js': ['admin/_attachments/js/app.js']
        , 'public/_attachments/js/app.min.js': ['public/_attachments/js/app.js']
        }
      }
    },
    jade: {
      html: {
        files: {
          'admin/_attachments/': ['src/*.jade']
        , 'public/_attachments/': ['src/*.jade']
        },
        options: {
          client: false
        }
      }
    },
    cssmin: {
      minify: {
        files: {
          'admin/_attachments/css/style.css': ['admin/src/css/bootswatch.css', 'admin/src/css/custom.css']
        , 'public/_attachments/css/style.css': ['public/src/css/bootswatch.css', 'public/src/css/custom.css']  
        }
      }
    },
    couchapp: {
      admin: config.admin
    , "public": config["public"]
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
  grunt.registerTask('replicate', "Set up filtered replication between admin and public.", require('./replicate'))

  grunt.registerTask('default', [
    'jshint'
  , 'concat'
  , 'uglify'
  , 'jade'
  , 'cssmin'
  , 'couchapp'
  , 'replicate'
  ]);

};