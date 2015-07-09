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
.constant('ddoc', {
  _id: '_design/diary',
  views: {
    all: {
      map: function (doc) {
        emit(doc.date, null);
      }
    },
    drafts: {
      map: function (doc) {
        if (!doc.status)
          emit(doc.date, null);
      }
    },
    published: {
      map: function (doc) {
        if (doc.status)
          emit(doc.date, null);
      }
    }
  }
})
/* CREATE DDOC */
.run([
  'pouchDB', 'db', 'ddoc',
  function (pouchDB, db, ddoc) {
    pouchDB(db).put(ddoc);
  }
])
// get posts from a given view
.factory('getPosts', [
  'pouchDB', 'db',
  function (pouchDB, db) {
    return function (viewname, opts) {
      var view = ['diary', viewname || 'all'].join('/');
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
      getPosts(view).then(function (docs) {
        $scope.posts = docs;
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
  function ($scope, $http, $location, root) {
    $scope.submit = function () {
      $scope.post.date = Date.now();
      $http({
        url: root,
        method: 'POST',
        data: $scope.post
      }).success(function (data, status) {
        $location.path('/');
      }).error(function () {
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
    var post = db.get($routeParams.id);
    post.then(function (res) {
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
  function ($scope, $routeParams, pouchDB, db_name) {
    pouchDB(db).get($routeParams.id).then(function (res) {
      $scope.posts = [res];
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
]);
