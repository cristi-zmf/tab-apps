angular.module('gradeBook.controllers', ['firebase'])

.controller('DashCtrl', function ($scope) {})

.controller('ChatsCtrl', function ($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
        Chats.remove(chat);
    };
})

.controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
})

.controller('materiiController', function ($scope, $firebaseArray, $location, $state) {
    var postsDatabaseRef = new Firebase("https://vivid-fire-1290.firebaseio.com/").child('posts');
    var postsData = $firebaseArray(postsDatabaseRef);
    
    $scope.post = {
        message: 'ada'
    };
    
    $scope.posts = postsData;

    $scope.addPost = function () {
        $scope.posts.$add($scope.post);
        $scope.post = {
            message: ''
        };
    };
    
    $scope.materii = {
        materie: ''
    };
    
    $scope.goToMaterie = function () {
        $state.go('tab.materie');
    }

})

.controller('AccountCtrl', function ($scope) {
    $scope.settings = {
        enableFriends: true
    }
})
    
.controller('LoginController', function($scope, $location) {
    $scope.login = function() {
        $location.path('/tab/dash');
    }       
});