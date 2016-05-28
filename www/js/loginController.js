/*Modul care se ocupa de logica paginii de login*/

angular.module('gradeBook.loginController', ['firebase', 'chart.js'])

.controller('loginController', function ($scope, $location, $firebase, $firebaseAuth, CurrentUser) {

    /*$scope.login = function(mailAddress, pass) {
        
    }*/

    var ref = new Firebase('https://gradebook-a87b2.firebaseio.com');
    $scope.uid = '';
    $scope.mail = '';
    $scope.password = '';
    $scope.login = function () {
        $location.path('/tab/dash');
    };

    $scope.signIn = function (mail, password) {
        console.log("Intram aici");
        var errorObj;    
        
        firebase.auth().signInWithEmailAndPassword(mail, password).then(function (authData) {
            CurrentUser.setLoggedUser(mail);
            console.log("Ia uite ce avem aici ", CurrentUser.loggedUser);
            $location.path('/tab/dash');
            $scope.$apply();
            
        }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            errorObj = error;
            console.log("Login failed: ", error);
        });
    };
});