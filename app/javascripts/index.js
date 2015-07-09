window.PouchDB = require('pouchdb');

// initialize the app :D
require('angular').module('app', [
  // dependencies!
  require('angular-route'),
  require('angular-pouchdb')
])
// url router
.config([
  '$routeProvider', '$locationProvider',
  function ($routeProvider, $locationProvider) {
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
/* CONSTANTS */
.constant('md', require('marked'))
.constant('db', 'posts')
// get posts from a given view
.factory('getPosts', [
  'pouchDB', 'db',
  function (pouchDB, db) {
    return function (view, opts) {
      return pouchDB(db).query(view, {
        include_docs: true
      });
    };
  }
])
// delete posts :O
.factory('deletePost', [
  'pouchDB', 'db',
  function (pouchDB, db) {
    return function (post) {
      return pouchDB(db).remove(post);
    };
  }
])
// used to create controllers that list posts
// such as PostsCtrl and DraftsCtrl
.factory('listCtrl', [
  'getPosts', 'deletePost',
  function (getPosts, deletePost) {
    return function ($scope, view) {
      $scope.delete = function (post) {
        if(confirm("Are you sure you want to delete that post?")) {
          deletePost(post).then(function () {
            $scope.posts = $scope.posts.filter(function (doc) {
              return doc._id !== post._id;
            });
          });
        }
      };
      getPosts(view).then(function (res) {
        $scope.posts = res.rows.map(function (row) {
          return row.doc;
        });
      });
    };
  }
])
// list all posts
.controller('PostsCtrl',  [
  '$scope', 'listCtrl',
  function ($scope, listCtrl) {
    listCtrl($scope, function (doc) {
      if (doc.status)
        emit(doc.date, null);
    });
  }
])
// list all drafts
.controller('DraftsCtrl', [
  '$scope', 'listCtrl',
  function ($scope, listCtrl) {
    listCtrl($scope, function (doc) {
      if (!doc.status)
        emit(doc.date, null);
    });
  }
])
// form for a new post
.controller('NewCtrl', [
  '$scope', '$location', 'pouchDB', 'db',
  function ($scope, $location, pouchDB, db) {
    $scope.submit = function () {
      $scope.post.date = Date.now();
      $scope.post._id = String($scope.post.date);
      pouchDB(db).put($scope.post)
      .then(function () {
        $location.path('/');
      })
      .catch(function () {
        console.log(arguments);
      });
    };
  }
])
// form to edit existing post
.controller('EditCtrl', [
  '$scope', '$location', '$routeParams', 'pouchDB', 'db',
  function ($scope, $location, $routeParams, pouchDB, db_name) {
    var db = pouchDB(db_name);

    db.get($routeParams.id)
    .then(function (res) {
      $scope.post = res;
    });

    $scope.submit = function () {
      db.put($scope.post)
      .then(function () {
        $location.path('/');
      })
      .catch(function () {
        // TODO error form
        console.log(arguments);
      });
    };
  }
])
// list a single post, draft or otherwise
.controller('PostCtrl', [
  '$scope', '$routeParams', 'pouchDB', 'db',
  function ($scope, $routeParams, pouchDB, db) {
    pouchDB(db).get($routeParams.id).then(function (res) {
      $scope.posts = [res];
    });
  }
])
// import posts from a URL
.controller('ImportCtrl', [
])
// export posts to a URL
.controller('ExportCtrl', [
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
]);
