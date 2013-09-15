var config = require('./config.json');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: [
        'admin/src/js/app.js', 
        'admin/app.js',
        'public/src/js/app.js',
        'public/app.js',
        'Gruntfile.js',
        'tasks/*'
      ],
      options: {}
    },
    concat: {
      options: {
        // define a string to put between each file in the concatenated output
        separator: ';'
      },
      admin: {
        // the files to concatenate
        src: [
          'admin/src/js/angular.min.js',
          'admin/src/js/showdown.js',
          'admin/src/js/app.js'
        ],
        // the location of the resulting JS file
        dest: 'admin/_attachments/js/app.js'
      },
      "public": {
        // the files to concatenate
        src: [
          'public/src/js/angular.min.js',
          'public/src/js/showdown.js',
          'public/src/js/app.js'
        ],
        // the location of the resulting JS file
        dest: 'public/_attachments/js/app.js'
      }
    },
    uglify: {
      options: {},
      build: {
        files: {
          'admin/_attachments/js/app.min.js': ['admin/_attachments/js/app.js'],
          'public/_attachments/js/app.min.js': ['public/_attachments/js/app.js']
        }
      }
    },
    jade: {
      html: {
        files: {
          'admin/_attachments/': ['admin/src/*.jade'],
          'public/_attachments/': ['public/src/*.jade']
        },
        options: {
          locals: config.jade,
          client: false
        }
      }
    },
    cssmin: {
      minify: {
        files: {
          'admin/_attachments/css/style.css': ['admin/src/css/bootswatch.css', 'admin/src/css/custom.css'],
          'public/_attachments/css/style.css': ['public/src/css/bootswatch.css', 'public/src/css/custom.css']  
        }
      }
    },
    mkcouchdb: {
      'public': config.public,
      admin: config.admin,
      replication: config.replication
    },
    couchapp: {
      'public': config.public,
      admin: config.admin
    },
    replication: {
      blog: {
        db: config.replication.db,
        'public': config.public.db,
        admin: config.admin.db
      }
    }
  });

  // Load plugins
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jade');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-couchapp');
  grunt.loadTasks('./tasks');

  // Default task(s).
  var default_tasks = ['jshint', 'concat', 'uglify', 'jade', 'cssmin', 'mkcouchdb:admin', 'couchapp:admin'];
  if('public' in config){
    default_tasks.push('mkcouchdb:public');
    default_tasks.push('couchapp:public');
    default_tasks.push('replication');
  }
  grunt.registerTask('default', default_tasks);

};