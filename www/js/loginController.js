/*Modul care se ocupa de logica paginii de login*/

angular.module('gradeBook.loginController', ['firebase', 'chart.js'])

.controller('loginController', function ($scope, $location, $firebase, $firebaseAuth) {

    /*$scope.login = function(mailAddress, pass) {
        
    }*/

    var ref = new Firebase('https://gradebook-a87b2.firebaseio.com');
    $scope.authObj = $firebaseAuth(ref);
    $scope.uid = '';
    $scope.mail = '';
    $scope.password = '';
    $scope.login = function () {
        $location.path('/tab/dash');
    };

    $scope.signIn = function (mail, password) {
        console.log("Intram aici");
        $scope.authObj.$authWithPassword({
                email: mail,
                password: password
            }).then(function (authData) {
            console.log("Loggin succes: ", authData);
        }).catch(function (error) {
           console.error("Auth failed: ", error); 
        });
            
        
        /*firebase.auth().signInWithEmailAndPassword(mail, password).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("am loggat");
        });*/
    };
});