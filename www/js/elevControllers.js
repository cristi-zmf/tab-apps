angular.module('gradeBook.elevControllers', ['firebase'])

.controller('materiiController', function ($scope, $firebaseArray, $location, $state, Materii) {
    var postsDatabaseRef = new Firebase("https://vivid-fire-1290.firebaseio.com/").child('posts');
    var postsData = $firebaseArray(postsDatabaseRef);
    $scope.materii = Materii.all();    
    
    $scope.goToMaterie = function () {
        $state.go('tab.materie');
    }

});
