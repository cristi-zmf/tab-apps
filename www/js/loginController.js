/*Modul care se ocupa de logica paginii de login*/

angular.module('gradeBook.loginController', ['firebase', 'chart.js'])

.controller('loginController', function ($scope, $location, $firebase, $firebaseAuth, $firebaseArray, CurrentUser, DatabaseTables) {

    /*$scope.login = function(mailAddress, pass) {
        
    }*/

    $scope.ref = new Firebase('https://gradebook-a87b2.firebaseio.com/').child('elevi');
    $scope.uid = '';
    $scope.mail = '';
    $scope.password = '';
    $scope.login = function () {
        $location.path('/tab/dash');
    };
    
    var isStudent = function (uid, databaseRef) {
        var database = $firebaseArray(databaseRef);
        var elevi = database.$getRecord("elevi");
        console.log("valoarea lui get: ", databaseRef);
        if (elevi.get(uid) === null)
            return false;
        else
            return true;
    };
    
    $scope.signIn = function (mail, password) {
        console.log("Intram aici");
        var errorObj;    
        
        firebase.auth().signInWithEmailAndPassword(mail, password).then(function (authData) {
            CurrentUser.setLoggedUser(authData.uid);
            console.log("Ia uite ce avem aici ", authData.uid);
            
            if (isStudent(authData.uid, $scope.ref))
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