var root = "root"
	, md = new Showdown.converter()
	, app = angular.module('app', []);

app.factory('getPosts', function($http){
	return function(viewname, opts){
		var posts = $http({
			url: root + "/_design/couchblog/_view/" + viewname,
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

function PostsCtrl($scope, $http, getPosts){
	getPosts('published', {
		success: function(docs){
			$scope.posts = docs
		}
	});
}

function DraftsCtrl($scope, $http, getPosts){
	getPosts('drafts', {
		success: function(docs){
			$scope.posts = docs
		}
	});
}

function NewCtrl($scope, $http, $location){
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
	}
}

function EditCtrl($scope, $http, $location, $routeParams){
	var doc_url = [root, $routeParams.id].join('/')
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

function PostCtrl($scope, $http, $routeParams){
	var doc_url = [root, $routeParams.id].join('/')
		, post = $http.get(doc_url);
	post.success(function(data, status){
		$scope.posts = [data];
	});
}

app.config(function($routeProvider, $locationProvider){
	// $locationProvider.html5mode(true);
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

// for dynamic content
app.filter('markdown', function(){
	return function(input){
		if(input) return md.makeHtml(input);
	}
});