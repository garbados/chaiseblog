var behave = require('./behave');
var angular = require('angular');
var markdown = require('marked');

// initialize the app :D
var app = angular.module('app', [
  // dependencies!
  require('angular-route')
])
// url router
.config([
  '$routeProvider', '$locationProvider', 
  function ($routeProvider, $locationProvider){
    // routing convenience :D
    function route (template, ctrl, path) {
      $routeProvider.when(path, {
        templateUrl: template + '.html',
        controller: ctrl
      });
    }

    // route templates, controllers, and paths
    route('posts', 'PostsCtrl',   '/');
    route('posts', 'DraftsCtrl',  '/drafts');
    route('posts', 'PostCtrl',    '/post/:id');
    route('new',   'EditCtrl',    '/edit/:id');
    route('new',   'NewCtrl',     '/new');

    // 404
    $routeProvider.otherwise({ redirectTo: '/' });
  }
])
// inject node dependencies as constants
.constant('md', markdown)
.constant('behave', behave)
// root URL for the database. 
.factory('root', ['$location', function ($location) {
  if ($location.absUrl().indexOf('_rewrite') !== -1)
    return '_rewrite/data';
  else
    return 'data';
}])
// get posts from a given view
.factory('getPosts', [
  '$http', 'root', 
  function ($http, root){
    return function (viewname, opts){
      var posts = $http({
        url: [root, "_design/diary/_view", viewname].join('/'),
        method: 'GET',
        params: {
          include_docs: true
        }
      });
      if(opts.success){
        posts.success(function(data, status){
          var docs = data.rows.map(function(row){
            return row.doc;
          });
          opts.success(docs);
        });
      }
      posts.error(function(){
        if (opts.error) {
          opts.error.apply(opts, arguments);
        } else {
          console.log(arguments);
        }
      });
      return posts;
    };
  }
])
// delete posts :O
.factory('deletePost', [
  '$http', 'root', 
  function ($http, root){
    return function (post){
      return $http({
        url: [root, post._id].join('/'),
        method: 'DELETE',
        params: {
          rev: post._rev
        }
      });
    };
  }
])
// autosave posts while writing them
.factory('autosave', [
  '$http', '$timeout', 'root', 
  function ($http, $timeout, root) {
    return function (post){
      (function _autosave(){
        $http({
          url: [root, post._id].join('/'),
          method: 'PUT',
          data: post
        })
        .success(function(data, status){
          post._rev = data.rev;
          // save every thirty seconds
          $timeout(_autosave, 1000 * 30);
        })
        .error(function(){
          console.log(arguments);
        })
        ;
      })();
    };
  }
])
// used to create controllers that list posts
// such as PostsCtrl and DraftsCtrl
.factory('listCtrl', [
  'getPosts', 'deletePost', 
  function (getPosts, deletePost) {
    return function ($scope, view){
      $scope.delete = function(post){
        if(confirm("Are you sure you want to delete that post?")){
          deletePost(post).success(function(){
            $scope.posts = $scope.posts.filter(function (doc) {
              return doc._id !== post._id;
            });
          });
        }
      };
      getPosts(view, {
        success: function (docs) {
          $scope.posts = docs;
        }
      });
    };
  }
])
// list all posts
.controller('PostsCtrl',  [
  '$scope', 'listCtrl', 
  function ($scope, listCtrl) { 
    listCtrl($scope, 'published'); 
  }
])
// list all drafts
.controller('DraftsCtrl', [
  '$scope', 'listCtrl', 
  function ($scope, listCtrl) { 
    listCtrl($scope, 'drafts');
  }
])
// form for a new post
.controller('NewCtrl', [
  '$scope', '$http', '$location', 'root', 
  function ($scope, $http, $location, root){
    $scope.submit = function(){
      $scope.post.date = Date.now();
      $http({
        url: root,
        method: 'POST',
        data: $scope.post
      }).success(function(data, status){
        $location.path('/');
      }).error(function(){
        console.log(arguments);
      });
    };
  }
])
// form to edit existing post
.controller('EditCtrl', [
  '$scope', '$http', '$location', '$routeParams', 'root', 'autosave', 
  function ($scope, $http, $location, $routeParams, root, autosave) {
    var doc_url = [root, $routeParams.id].join('/'),
        post = $http.get(doc_url);
    post.success(function(data, status){
      $scope.post = data;
      autosave($scope.post);
    });
    $scope.submit = function(){
      $http.put(doc_url, $scope.post)
      .success(function(data, status){
        $location.path('/');
      })
      .error(function(){
        console.log(arguments);
      });
    };
  }
])
// list a single post, draft or otherwise
.controller('PostCtrl', [
  '$scope', '$http', '$routeParams', 'root', 
  function ($scope, $http, $routeParams, root){
    var doc_url = [root, $routeParams.id].join('/'),
        post = $http.get(doc_url);

    post.success(function (data, status) {
      $scope.posts = [data];
    });
  }
])
// markdown filter for dynamic content
.filter('markdown', [
  'md', '$sce',
  function (md, $sce) {
    return function (input) {
      if (!input) return;

      var html = md(input);
      var safe_html = $sce.trustAsHtml(html);
      return safe_html;
    };
  }
])
// a fancy-pantsy post-writing area
.directive('behave', [
  'behave',
  function (behave) {
    return {
      restrict: 'A', // only activate on element attribute
      link: function (scope, elem, attr) {
        var textarea = elem[0];
        var editor = new behave({ 
          textarea: textarea,
          fence: '```'
        });
      }
    };
  }
]);
