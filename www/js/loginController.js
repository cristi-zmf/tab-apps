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
        /*$scope.authWithPassword({
                email : mail,
                password : password
            }, function(error, authData) {
                    if (error) {
                        console.log("Login failed!", error);
                    } else {
                        console.log("Login succes", authdata);
                    }});*/
            
           /* .then(function (authData) {
            console.log("Loggin succes: ", authData);
        }).catch(function (error) {
           console.error("Auth failed: ", error); 
        });*/
        var errorObj;    
        
        firebase.auth().signInWithEmailAndPassword(mail, password).then(function (authData) {
            $location.path('/tab/dash');
            $scope.$apply();
            console.log("auth succesful", authData);
            
        }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            errorObj = error;
            console.log("Login failed: ", error);
        });
        
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
            console.log("userul este ", user.mail);
            $location.path('/tab/dash');
            }
        }, null, '  ');
        /*if () {
            console.log("bad user", errorObj);
        }
        
        else {
            console.log("succesful login", errorObj);
            $location.path('/tab/dash');
        }*/
    };
});