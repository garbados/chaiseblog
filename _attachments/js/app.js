// initialize the app :D
var app = angular.module('app', []);

// config values shared throughout the app
app.service('config', function($http){
  // set to 'root' if using a virtualhost
  this.root = '_rewrite/root';
});

// markdown converter
app.service('md', function(){
  // rather than modifying `this`, just return the converter object
  return new Showdown.converter();
});

// get posts from a given view
app.factory('getPosts', function($http, config){
  return function(viewname, opts){
    var posts = $http({
      url: config.root 
         + "/_design/chaiseblog/_view/" 
         + viewname,
      method: 'GET',
      params: {
        include_docs: true
      }
    });
    if(opts.success){
      posts.success(function(data, status){
        var docs = [];
        for(var i in data.rows){
          docs.push(data.rows[i].doc);
        }
        opts.success(docs);
      });
    }
    posts.error(function(){
      console.log(arguments);
    });
    return posts;
  }
});

// list all posts
function PostsCtrl($scope, $http, getPosts){
  getPosts('published', {
    success: function(docs){
      $scope.posts = docs
    }
  });
}

// list all drafts
function DraftsCtrl($scope, $http, getPosts){
  getPosts('drafts', {
    success: function(docs){
      $scope.posts = docs
    }
  });
}

// form for a new post
function NewCtrl($scope, $http, $location, config){
  $scope.submit = function(){
    $scope.post.date = Date.now();
    $http({
      url: config.root,
      method: 'POST',
      data: $scope.post
    }).success(function(data, status){
      $location.path('/');
    }).error(function(){
      console.log(arguments);
    });
  }
}

// form to edit existing post
function EditCtrl($scope, $http, $location, $routeParams, config){
  var doc_url = [config.root, $routeParams.id].join('/')
    , post = $http.get(doc_url);
  post.success(function(data, status){
    $scope.post = data;
  });
  $scope.submit = function(){
    $http.put(doc_url, $scope.post)
    .success(function(data, status){
      $location.path('/');
    })
    .error(function(){
      console.log(arguments);
    });
  }
}

// list a single post, draft or otherwise
function PostCtrl($scope, $http, $routeParams, config){
  var doc_url = [config.root, $routeParams.id].join('/')
    , post = $http.get(doc_url);
  post.success(function(data, status){
    $scope.posts = [data];
  });
}

// url router
app.config(function($routeProvider){
  $routeProvider
  .when('/', {
    templateUrl: 'posts.html',
    controller: PostsCtrl
  })
  .when('/drafts', {
    templateUrl: 'posts.html',
    controller: DraftsCtrl
  })
  .when('/new', {
    templateUrl: 'new.html',
    controller: NewCtrl
  })
  .when('/edit/:id', {
    templateUrl: 'new.html',
    controller: EditCtrl
  })
  .when('/post/:id', {
    templateUrl: 'posts.html',
    controller: PostCtrl
  })
  .otherwise({
    redirectTo: '/'
  });
});

// markdown filter for dynamic content
app.filter('markdown', function(md){
  return function(input){
    if(input) return md.makeHtml(input);
  }
});